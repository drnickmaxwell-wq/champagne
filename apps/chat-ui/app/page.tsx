"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

type EngineStatus = { state: "checking" } | { state: "ok" } | { state: "error" };
type ConversationResult = {
  matched: boolean;
  conversationId: string | null;
  content: string;
  confidence?: "high" | "medium" | "low" | number | null;
};

const DENTALLY_BOOKING_URL = "https://st-marys-house-dental-care.portal.dental";
const REQUEST_TIMEOUT_MS = 8000;

export default function Page() {
  const [status, setStatus] = useState<EngineStatus>({ state: "checking" });
  const [userInput, setUserInput] = useState("");
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [lastBotReply, setLastBotReply] = useState<string | null>(null);
  const [lastConfidence, setLastConfidence] = useState<"high" | "medium" | "low" | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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
  const resolveConfidenceLabel = (confidence: ConversationResult["confidence"]) => {
    if (typeof confidence === "string") {
      const normalized = confidence.toLowerCase();
      if (normalized === "high" || normalized === "medium" || normalized === "low") {
        return normalized;
      }
      return null;
    }
    if (typeof confidence === "number") {
      if (confidence >= 0.75) {
        return "high";
      }
      if (confidence >= 0.45) {
        return "medium";
      }
      return "low";
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!engineBaseUrl) {
      setLastError("Engine URL is not configured.");
      return;
    }

    const trimmed = userInput.trim();
    if (!trimmed) {
      setLastError("Please enter a message.");
      return;
    }

    setIsSending(true);
    setLastError(null);
    setLastUserMessage(trimmed);
    setLastBotReply(null);
    setLastConfidence(null);

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
        throw new Error(`Request failed: ${response.status} ${response.statusText}`.trim());
      }

      const data = (await response.json()) as ConversationResult;
      const content =
        typeof data.content === "string" && data.content.trim().length > 0
          ? data.content
          : "No content returned.";
      setLastBotReply(content);
      setLastConfidence(resolveConfidenceLabel(data.confidence));
    } catch (fetchError) {
      if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
        setLastError("Request failed: timeout after 8s.");
      } else {
        const message = fetchError instanceof Error ? fetchError.message : "Unknown error.";
        setLastError(`Request failed: ${message}`);
      }
    } finally {
      window.clearTimeout(timeoutId);
      setIsSending(false);
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
            className="flex-1 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-0)] px-3 py-2 text-sm text-[var(--text-high)] caret-[var(--text-high)] outline-none placeholder:text-[var(--text-medium)] focus-visible:ring-2 focus-visible:ring-[var(--border-subtle)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]"
            placeholder="Type your question..."
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Sending...
              </>
            ) : (
              "Send"
            )}
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
      {lastUserMessage || lastBotReply ? (
        <div className="flex w-full max-w-xl flex-col gap-3 text-sm">
          {lastUserMessage ? (
            <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-1)] px-3 py-2">
              <div className="font-medium">You:</div>
              <div>{lastUserMessage}</div>
            </div>
          ) : null}
          {lastBotReply ? (
            <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-1)] px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">Engine:</span>
                {lastConfidence ? (
                  <span className="rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-xs uppercase tracking-wide text-[var(--text-medium)]">
                    {lastConfidence}
                  </span>
                ) : null}
              </div>
              <div className="whitespace-pre-wrap text-[var(--text-high)]">{lastBotReply}</div>
            </div>
          ) : null}
        </div>
      ) : null}
      {lastError ? (
        <p className="max-w-xl text-sm">
          <span className="font-medium">Error:</span> {lastError}
        </p>
      ) : null}
      <p className="text-sm text-neutral-300">{statusLine}</p>
    </main>
  );
}
