"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getPageManifest } from "@champagne/manifests";
import { ConciergeShell, type ConciergeMessage } from "./ConciergeShell";
import { normalizeConverseDisplayMessage, type ConverseResponse } from "./_helpers/converseDisplay";
import { HandoffModal } from "./_handoff/HandoffModal";
import { resolveHandoffKind, type HandoffKind } from "./_handoff/postbackRouter";
import {
  classifyIntentStage,
  getSessionState,
  setConversationId,
  setIntentStage,
  updateVisitedPath,
} from "./_helpers/sessionMemory";

function resolveConciergeEnabled(pathname: string): boolean {
  const manifest = getPageManifest(pathname) as { conciergeEnabled?: boolean } | undefined;
  return manifest?.conciergeEnabled ?? true;
}

function resolveDebugToggle(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("conciergeDebug") === "1";
}

function getCalmErrorMessage(status: number): string {
  if (status === 429) {
    return "Concierge is a little busy right now. Please try again in a moment.";
  }

  if (status >= 500) {
    return "Concierge is briefly unavailable. Please try again shortly.";
  }

  return "I could not complete that request just now. Please try again.";
}

export function ConciergeLayer() {
  const pathname = usePathname() || "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content:
        "Welcome. I can help you understand this page, and the practice team will guide the next step if you need personal advice.",
    },
  ]);
  const [sessionState, setSessionState] = useState(() => getSessionState());
  const [conversationId, setConversationIdState] = useState<string | null>(() => getSessionState().conversationId);
  const [activeHandoff, setActiveHandoff] = useState<HandoffKind | null>(null);

  const conciergeEnabled = useMemo(() => resolveConciergeEnabled(pathname), [pathname]);

  useEffect(() => {
    setSessionState(updateVisitedPath(pathname));
  }, [pathname]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      setDebugEnabled(resolveDebugToggle());
    }
  }, []);

  const closePanel = () => setIsOpen(false);

  const sendMessage = async (rawInput: string) => {
    const text = rawInput.trim();
    if (!text || isLoading) return;

    const idSeed = Date.now().toString();
    setInput("");
    setError(null);
    setMessages((previous) => [...previous, { id: `${idSeed}-user`, role: "user", content: text }]);

    const intentStage = classifyIntentStage(text);
    setIntentStage(intentStage);
    setSessionState(getSessionState());

    setIsLoading(true);

    try {
      const response = await fetch("/api/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, pageContext: { pathname: window.location.pathname } }),
      });

      if (!response.ok) {
        const message = getCalmErrorMessage(response.status);
        setError(message);
        setMessages((previous) => [
          ...previous,
          {
            id: `${idSeed}-error`,
            role: "assistant",
            content: message,
          },
        ]);
        return;
      }

      const payload = (await response.json()) as ConverseResponse;
      if (typeof payload.conversationId === "string" && payload.conversationId.trim().length > 0) {
        const nextConversationId = payload.conversationId.trim();
        setConversationIdState(nextConversationId);
        setSessionState(setConversationId(nextConversationId));
      }

      const displayMessage = normalizeConverseDisplayMessage(payload, idSeed);

      setMessages((previous) => [
        ...previous,
        {
          id: `${idSeed}-assistant`,
          role: "assistant",
          ...displayMessage,
        },
      ]);
    } catch {
      const message = "I could not connect just now. Please try again when you are ready.";
      setError(message);
      setMessages((previous) => [
        ...previous,
        {
          id: `${idSeed}-error`,
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostback = (payload: string) => {
    let normalizedPayload = payload;

    try {
      const parsed = JSON.parse(payload) as unknown;
      if (
        parsed &&
        typeof parsed === "object" &&
        "kind" in parsed &&
        "form" in parsed &&
        parsed.kind === "handoff" &&
        (parsed.form === "booking" || parsed.form === "emergency-callback" || parsed.form === "new-patient")
      ) {
        const normalizedForm =
          parsed.form === "emergency-callback"
            ? "emergency_callback"
            : parsed.form === "new-patient"
              ? "new_patient"
              : "booking";
        normalizedPayload = JSON.stringify({ kind: "handoff", form: normalizedForm });
      }
    } catch {
      normalizedPayload = payload;
    }

    const handoffKind = resolveHandoffKind(normalizedPayload);
    if (handoffKind) {
      setActiveHandoff(handoffKind);
      return;
    }

    void sendMessage(payload);
  };

  return (
    <>
      <ConciergeShell
        isEnabled={conciergeEnabled}
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
        onClose={closePanel}
        onPostback={handlePostback}
        debugState={
          process.env.NODE_ENV !== "production" && debugEnabled
            ? {
                lastSeenPath: sessionState.lastSeenPath,
                visitedPathsCount: sessionState.visitedPaths.length,
                intentStage: sessionState.intentStage,
                topicHints: sessionState.topicHints,
                conversationId,
              }
            : undefined
        }
      />
      {activeHandoff ? <HandoffModal kind={activeHandoff} onClose={() => setActiveHandoff(null)} /> : null}
    </>
  );
}
