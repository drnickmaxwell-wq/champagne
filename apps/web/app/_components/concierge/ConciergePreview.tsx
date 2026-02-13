"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import styles from "./ConciergePreview.module.css";

type Message = {
  role: "user" | "assistant";
  content: string;
  id: string;
};

type MessageBlock =
  | { type: "lead"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "sourceHint"; text: string }
  | { type: "bullet"; text: string };

const PAGE_CONTEXT_OPTIONS = [
  "(none)",
  "implants",
  "/treatments/implants",
  "cbct-3d-scanning",
  "/treatments/digital-smile-design",
] as const;

const QUICK_REPLIES = [
  "Implant treatment timeline",
  "What to expect at consult",
  "Comfort & sedation options",
  "Financing overview",
] as const;

function buildPreviewReply(text: string, pageContext: string): string {
  const contextLine = pageContext
    ? `Context read: ${pageContext}. I can keep recommendations aligned with this journey.`
    : "Context read: none selected. I can keep guidance neutral and practical.";

  return [
    "Thank you — I can walk you through this in a calm, step-by-step way.",
    contextLine,
    "A typical next step is a consultation with imaging, then a phased plan based on goals and comfort.",
    "- Clarify suitability and options",
    "- Outline visit flow and recovery pacing",
    "- Keep language simple and transparent",
    "Source hint: Preview UI copy only.",
    `Your prompt was: ${text}`,
  ].join("\n\n");
}

function toMessageBlocks(content: string): MessageBlock[] {
  const lines = content.split("\n").map((line) => line.trim());
  const blocks: MessageBlock[] = [];
  let leadUsed = false;

  for (const line of lines) {
    if (!line) continue;

    if (line.startsWith("Source hint:")) {
      blocks.push({ type: "sourceHint", text: line });
      continue;
    }

    if (line.startsWith("- ")) {
      blocks.push({ type: "bullet", text: line.slice(2).trim() });
      continue;
    }

    if (!leadUsed) {
      const match = line.match(/^(.*?[.!?])\s+(.*)$/);
      if (match) {
        blocks.push({ type: "lead", text: match[1].trim() });
        blocks.push({ type: "paragraph", text: match[2].trim() });
      } else {
        blocks.push({ type: "lead", text: line });
      }
      leadUsed = true;
      continue;
    }

    blocks.push({ type: "paragraph", text: line });
  }

  return blocks;
}

export function ConciergePreview() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "seed-assistant",
      role: "assistant",
      content:
        "Welcome to the Champagne Concierge preview. I can simulate premium response cadence and next-step guidance.\n\nChoose a quick reply or type your own prompt to see interaction styling.\n\nSource hint: Preview UI only. No clinical assessment.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pageContext, setPageContext] = useState<(typeof PAGE_CONTEXT_OPTIONS)[number]>("(none)");
  const [isLoading, setIsLoading] = useState(false);

  const normalizedPageContext = useMemo(() => (pageContext === "(none)" ? "" : pageContext), [pageContext]);

  const sendPrompt = (text: string) => {
    const prompt = text.trim();
    if (!prompt || isLoading) return;

    const idSeed = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    setInput("");
    setIsLoading(true);

    setMessages((previous) => [...previous, { id: `${idSeed}-user`, role: "user", content: prompt }]);

    window.setTimeout(() => {
      const reply = buildPreviewReply(prompt, normalizedPageContext);
      setMessages((previous) => [...previous, { id: `${idSeed}-assistant`, role: "assistant", content: reply }]);
      setIsLoading(false);
    }, 850);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(input);
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

      <div className={styles.quickReplies}>
        {QUICK_REPLIES.map((option) => (
          <button key={option} type="button" className={styles.quickReply} onClick={() => sendPrompt(option)} disabled={isLoading}>
            {option}
          </button>
        ))}
      </div>

      <div className={styles.messages} aria-live="polite">
        {messages.map((message) => {
          const blocks = toMessageBlocks(message.content);
          return (
            <article
              key={message.id}
              className={`${styles.message} ${message.role === "user" ? styles.user : styles.assistant} ${
                message.role === "assistant" ? styles.reveal : ""
              }`}
            >
              <span className={styles.role}>{message.role === "user" ? "You" : "Concierge"}</span>
              <div className={styles.contentStack}>
                {blocks.map((block, index) => {
                  if (block.type === "lead") {
                    return (
                      <p key={`${message.id}-lead-${index}`} className={styles.lead}>
                        {block.text}
                      </p>
                    );
                  }

                  if (block.type === "sourceHint") {
                    return (
                      <p key={`${message.id}-hint-${index}`} className={styles.sourceHint}>
                        {block.text}
                      </p>
                    );
                  }

                  if (block.type === "bullet") {
                    return (
                      <p key={`${message.id}-bullet-${index}`} className={styles.bullet}>
                        • {block.text}
                      </p>
                    );
                  }

                  return (
                    <p key={`${message.id}-paragraph-${index}`} className={styles.text}>
                      {block.text}
                    </p>
                  );
                })}
              </div>
            </article>
          );
        })}

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
