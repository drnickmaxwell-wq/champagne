"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getPageManifest } from "@champagne/manifests";
import { ConciergeShell, type ConciergeMessage } from "./ConciergeShell";
import {
  classifyIntentStage,
  getSessionState,
  setIntentStage,
  setSessionSummary,
  updateVisitedPath,
} from "./_helpers/sessionMemory";

type ConverseCard = {
  title?: string;
  description?: string;
  actions?: Array<{ type?: string; label?: string; href?: string; payload?: string }>;
};

type ConverseResponse = {
  content?: string;
  ui?: {
    kind?: string;
    cards?: ConverseCard[];
  };
};

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
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content: "Welcome. Ask anything about this page and I will keep guidance focused.",
    },
  ]);
  const [sessionState, setSessionState] = useState(() => getSessionState());

  const conciergeEnabled = useMemo(() => resolveConciergeEnabled(pathname), [pathname]);

  useEffect(() => {
    setSessionState(updateVisitedPath(pathname));
  }, [pathname]);

  const sendMessage = async (rawInput: string) => {
    const text = rawInput.trim();
    if (!text || isLoading) return;

    const idSeed = Date.now().toString();
    setInput("");
    setError(null);
    setMessages((previous) => [...previous, { id: `${idSeed}-user`, role: "user", content: text }]);

    const intentStage = classifyIntentStage(text);
    setIntentStage(intentStage);
    setSessionSummary(text);
    setSessionState(getSessionState());

    setIsLoading(true);

    try {
      const response = await fetch("/api/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, pageContext: { pathname: window.location.pathname } }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const payload = (await response.json()) as ConverseResponse;
      const cards = payload.ui?.kind === "cards" && Array.isArray(payload.ui.cards)
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

      setMessages((previous) => [
        ...previous,
        {
          id: `${idSeed}-assistant`,
          role: "assistant",
          content: payload.content ?? "I can help with another question whenever you are ready.",
          cards,
        },
      ]);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Request failed");
      setMessages((previous) => [
        ...previous,
        {
          id: `${idSeed}-error`,
          role: "assistant",
          content: "I could not reach concierge service right now. Please try again.",
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
      messages={messages}
      onInputChange={(value) => setInput(value.slice(0, 1200))}
      onSubmit={() => {
        void sendMessage(input);
      }}
      onToggle={() => setIsOpen((previous) => !previous)}
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
      debugState={
        process.env.NODE_ENV !== "production"
          ? {
              lastSeenPath: sessionState.lastSeenPath,
              visitedPathsCount: sessionState.visitedPaths.length,
              intentStage: sessionState.intentStage,
            }
          : undefined
      }
    />
  );
}
