"use client";

import { useMemo, useState } from "react";
import { ConciergeShell } from "./ConciergeShell";
import styles from "./concierge.module.css";

type ConciergeLayerProps = {
  enabled: boolean;
};

type ConciergeMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const DEBUG_QUERY_PARAM = "debugChat";

export function ConciergeLayer({ enabled }: ConciergeLayerProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);

  const engineBaseUrl = useMemo(
    () => process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL?.trim().replace(/\/$/, "") ?? "",
    [],
  );

  if (!enabled) return null;

  async function submitMessage() {
    const text = input.trim();
    if (!text || pending) return;

    const userMessage: ConciergeMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
    };

    setInput("");
    setError(null);
    setPending(true);
    setMessages((current) => [...current, userMessage]);

    if (!engineBaseUrl) {
      setError("Concierge engine URL is unavailable.");
      setPending(false);
      return;
    }

    try {
      const requestHeaders: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (new URLSearchParams(window.location.search).has(DEBUG_QUERY_PARAM)) {
        requestHeaders["x-debug-chat"] = "1";
      }

      const response = await fetch(`${engineBaseUrl}/v1/converse`, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          text,
          pageContext: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const payload = (await response.json()) as { text?: string; message?: string };
      const assistantText = payload.text?.trim() || payload.message?.trim() || "Received.";

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: assistantText,
        },
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send message.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.layer}>
      <button
        type="button"
        className={styles.launcher}
        aria-label={open ? "Close concierge" : "Open concierge"}
        onClick={() => setOpen((value) => !value)}
      />

      <ConciergeShell
        open={open}
        pending={pending}
        messages={messages}
        input={input}
        error={error}
        onInputChange={setInput}
        onSubmit={submitMessage}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
