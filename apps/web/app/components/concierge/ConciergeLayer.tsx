"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getPageManifest } from "@champagne/manifests";
import { ConciergeShell, type ConciergeMessage } from "./ConciergeShell";
import {
  buildConverseHeaders,
  createCooldownUntil,
  getCooldownRemainingSeconds,
  isBlockedHttpStatus,
  isBlockedNetworkError,
  isPrivacyTripwireContent,
  isRateLimit429Payload,
} from "./_helpers/resilience";

type ConverseCard = {
  title?: string;
  description?: string;
  actions?: Array<{ type?: string; label?: string; href?: string; payload?: string }>;
};

type ConverseResponse = {
  content?: string;
  debug?: unknown;
  ui?: {
    kind?: string;
    cards?: ConverseCard[];
  };
};

const ENGINE_BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL ?? "";
const IS_DEV = process.env.NODE_ENV !== "production";

const RATE_LIMIT_MESSAGE = "We are receiving a lot of requests. Please wait a few moments and try again.";
const BLOCKED_MESSAGE = "I cannot reach concierge services from this network right now. Please try again shortly.";

function resolveConciergeEnabled(pathname: string): boolean {
  const manifest = getPageManifest(pathname) as { conciergeEnabled?: boolean } | undefined;
  return manifest?.conciergeEnabled ?? true;
}

export function ConciergeLayer() {
  const pathname = usePathname() || "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownNow, setCooldownNow] = useState(() => Date.now());
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [latestDebugPayload, setLatestDebugPayload] = useState<unknown>(null);
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content: "Welcome. Ask anything about this page and I will keep guidance focused.",
    },
  ]);

  const conciergeEnabled = useMemo(() => resolveConciergeEnabled(pathname), [pathname]);
  const cooldownSeconds = getCooldownRemainingSeconds(cooldownUntil, cooldownNow);
  const isCooldownActive = cooldownSeconds > 0;

  useEffect(() => {
    if (!isCooldownActive) return;
    const timer = window.setInterval(() => {
      setCooldownNow(Date.now());
    }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [isCooldownActive]);

  useEffect(() => {
    if (!isCooldownActive && cooldownUntil !== null) {
      setCooldownUntil(null);
    }
  }, [cooldownUntil, isCooldownActive]);

  const sendMessage = async (rawInput: string) => {
    const text = rawInput.trim();
    if (!text || isLoading || isCooldownActive) return;

    const idSeed = Date.now().toString();
    setError(null);
    setMessages((previous) => [...previous, { id: `${idSeed}-user`, role: "user", content: text }]);

    if (!ENGINE_BASE_URL) {
      setError("Concierge engine is unavailable right now.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${ENGINE_BASE_URL}/v1/converse`, {
        method: "POST",
        headers: buildConverseHeaders({ debugEnabled, isDev: IS_DEV }),
        body: JSON.stringify({ text, pageContext: pathname }),
      });

      let payload: ConverseResponse = {};
      try {
        payload = (await response.json()) as ConverseResponse;
      } catch {
        payload = {};
      }

      if (isRateLimit429Payload(response.status, payload)) {
        setCooldownUntil(createCooldownUntil());
        setCooldownNow(Date.now());
        setError(RATE_LIMIT_MESSAGE);
        setMessages((previous) => [
          ...previous,
          {
            id: `${idSeed}-rate-limit`,
            role: "assistant",
            content: RATE_LIMIT_MESSAGE,
          },
        ]);
        return;
      }

      if (isBlockedHttpStatus(response.status)) {
        setError(BLOCKED_MESSAGE);
        setMessages((previous) => [
          ...previous,
          {
            id: `${idSeed}-blocked`,
            role: "assistant",
            content: BLOCKED_MESSAGE,
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const assistantContent = payload.content ?? "I can help with another question whenever you are ready.";
      const suppressCards = isPrivacyTripwireContent(assistantContent);

      const cards = !suppressCards && payload.ui?.kind === "cards" && Array.isArray(payload.ui.cards)
        ? payload.ui.cards.map((card, cardIndex) => ({
            id: `${idSeed}-card-${cardIndex}`,
            title: card.title,
            description: card.description,
            actions: card.actions
              ?.map((action) => {
                if (action.type === "link" && action.href && action.label) {
                  return { type: "link" as const, href: action.href, label: action.label };
                }

                if (action.type === "postback" && action.payload && action.label) {
                  return { type: "postback" as const, payload: action.payload, label: action.label };
                }

                return null;
              })
              .filter((action): action is { type: "link"; href: string; label: string } | { type: "postback"; payload: string; label: string } => Boolean(action)),
          }))
        : undefined;

      if (IS_DEV && debugEnabled && payload.debug !== undefined) {
        setLatestDebugPayload(payload.debug);
      }

      setMessages((previous) => [
        ...previous,
        {
          id: `${idSeed}-assistant`,
          role: "assistant",
          content: assistantContent,
          cards,
        },
      ]);
      setInput("");
    } catch (fetchError) {
      const blocked = isBlockedNetworkError(fetchError);
      const content = blocked
        ? BLOCKED_MESSAGE
        : "I could not reach concierge service right now. Please try again.";

      setError(content);
      setMessages((previous) => [
        ...previous,
        {
          id: `${idSeed}-error`,
          role: "assistant",
          content,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!conciergeEnabled) {
    return null;
  }

  return (
    <ConciergeShell
      isOpen={isOpen}
      isLoading={isLoading}
      errorMessage={error}
      inputValue={input}
      isCooldownActive={isCooldownActive}
      cooldownSeconds={cooldownSeconds}
      debugEnabled={debugEnabled}
      showDebugToggle={IS_DEV}
      debugPayload={latestDebugPayload}
      messages={messages}
      onInputChange={(value) => setInput(value.slice(0, 1200))}
      onSubmit={() => {
        void sendMessage(input);
      }}
      onToggle={() => setIsOpen((previous) => !previous)}
      onDebugToggle={() => setDebugEnabled((previous) => !previous)}
      onPostback={(payload) => {
        setMessages((previous) => [
          ...previous,
          {
            id: `${Date.now()}-postback`,
            role: "assistant",
            content: `Postback received (${payload}). Phase 1 handoff placeholder acknowledged.`,
          },
        ]);
      }}
    />
  );
}
