"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import styles from "./ConciergePreview.module.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const PAGE_CONTEXT_OPTIONS = [
  "(none)",
  "implants",
  "/treatments/implants",
  "cbct-3d-scanning",
  "/treatments/digital-smile-design",
] as const;

const ENGINE_BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL ?? "http://localhost:5055";

function formatReply(content: string): string {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function ConciergePreview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pageContext, setPageContext] = useState<(typeof PAGE_CONTEXT_OPTIONS)[number]>("(none)");
  const [isLoading, setIsLoading] = useState(false);

  const normalizedPageContext = useMemo(() => (pageContext === "(none)" ? "" : pageContext), [pageContext]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setIsLoading(true);
    setMessages((previous) => [...previous, { role: "user", content: text }]);

    try {
      const response = await fetch(`${ENGINE_BASE_URL}/v1/converse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, pageContext: normalizedPageContext }),
      });

      if (!response.ok) throw new Error("Engine request failed");

      const payload = (await response.json()) as { content?: unknown };
      const reply = typeof payload.content === "string" ? formatReply(payload.content) : "";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: reply || "I’m having trouble reaching the concierge service right now.",
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: "I’m having trouble reaching the concierge service right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.shell} aria-label="Champagne concierge preview chat">
      <div className={styles.metaRow}>
        <label className={styles.label} htmlFor="page-context-sim">
          Page context simulator (dev)
        </label>
        <select
          id="page-context-sim"
          className={styles.select}
          value={pageContext}
          onChange={(event) => setPageContext(event.target.value as (typeof PAGE_CONTEXT_OPTIONS)[number])}
        >
          {PAGE_CONTEXT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.messages} aria-live="polite">
        {messages.length === 0 ? (
          <article className={`${styles.message} ${styles.assistant}`}>
            <span className={styles.role}>Concierge</span>
            <p className={styles.text}>Welcome to the concierge preview. Ask a short question to test response tone.</p>
          </article>
        ) : (
          messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={`${styles.message} ${message.role === "user" ? styles.user : styles.assistant}`}
            >
              <span className={styles.role}>{message.role === "user" ? "You" : "Concierge"}</span>
              <p className={styles.text}>{message.content}</p>
            </article>
          ))
        )}

        {isLoading ? (
          <article className={`${styles.message} ${styles.assistant}`}>
            <span className={styles.role}>Concierge</span>
            <span className={styles.typing} aria-label="Concierge is typing">
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </span>
          </article>
        ) : null}
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a preview prompt"
          autoComplete="off"
        />
        <button className={styles.sendButton} type="submit" disabled={isLoading || input.trim().length === 0}>
          Send
        </button>
      </form>
    </section>
  );
}
