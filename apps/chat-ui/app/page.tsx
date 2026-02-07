"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type EngineStatus = { state: "checking" } | { state: "ok" } | { state: "error" };
type ConversationResult = {
  matched: boolean;
  conversationId: string | null;
  content: string;
};

const DENTALLY_BOOKING_URL = "https://st-marys-house-dental-care.portal.dental";
const REQUEST_TIMEOUT_MS = 8000;

export default function Page() {
  const [status, setStatus] = useState<EngineStatus>({ state: "checking" });
  const [input, setInput] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL;
    const maxAttempts = 3;
    let isCancelled = false;
    let retryTimeoutId: number | null = null;

    if (!baseUrl) {
      setStatus({ state: "error" });
      return () => undefined;
    }

    const checkHealth = (attempt: number) => {
      setStatus({ state: "checking" });
      fetch(`${baseUrl}/health`, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          if (!isCancelled) {
            setStatus({ state: "ok" });
          }
        })
        .catch(() => {
          if (isCancelled) {
            return;
          }
          if (attempt >= maxAttempts) {
            setStatus({ state: "error" });
            return;
          }
          const backoffMs = 500 * 2 ** (attempt - 1);
          retryTimeoutId = window.setTimeout(() => checkHealth(attempt + 1), backoffMs);
        });
    };

    checkHealth(1);

    return () => {
      isCancelled = true;
      if (retryTimeoutId !== null) {
        window.clearTimeout(retryTimeoutId);
      }
    };
  }, []);

  const engineBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL ?? "", []);

  const statusLine = status.state === "ok" ? "Engine: online" : "Engine: unreachable";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!engineBaseUrl) {
      setError("Engine URL is not configured.");
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) {
      setError("Please enter a message.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setReply(null);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${engineBaseUrl}/v1/converse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as ConversationResult;
      setReply(data.content);
    } catch (fetchError) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Unable to reach the concierge engine right now.");
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Champagne Concierge UI — Placeholder</h1>
      <p className="max-w-xl text-center text-sm text-neutral-300">
        This is the placeholder shell for the <code>chat-ui</code> app inside the champagne-core monorepo.
      </p>
      <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3">
        <label className="text-sm" htmlFor="chat-input">
          Ask the concierge
        </label>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <input
            id="chat-input"
            className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
            placeholder="Type your question..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="rounded-md border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
      <a
        className="rounded-md border px-4 py-2 text-sm font-medium"
        href={DENTALLY_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Book an appointment
      </a>
      {reply ? <p className="max-w-xl text-sm">{reply}</p> : null}
      {error ? <p className="max-w-xl text-sm">{error}</p> : null}
      <p className="text-sm text-neutral-300">{statusLine}</p>
    </main>
  );
}
