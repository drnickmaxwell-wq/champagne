"use client";

import { useEffect, useRef } from "react";
import type { FormEvent } from "react";
import styles from "./concierge.module.css";

type ConciergeAction =
  | { type: "link"; label: string; href: string }
  | { type: "postback"; label: string; payload: string };

type ConciergeCard = {
  id: string;
  title?: string;
  description?: string;
  actions?: ConciergeAction[];
};

export type ConciergeMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  cards?: ConciergeCard[];
};

type ConciergeShellProps = {
  isOpen: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  inputValue: string;
  isCooldownActive: boolean;
  cooldownSeconds: number;
  debugEnabled: boolean;
  showDebugToggle: boolean;
  debugPayload: unknown;
  messages: ConciergeMessage[];
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onToggle: () => void;
  onDebugToggle: () => void;
  onPostback: (payload: string) => void;
};

export function ConciergeShell({
  isOpen,
  isLoading,
  errorMessage,
  inputValue,
  isCooldownActive,
  cooldownSeconds,
  debugEnabled,
  showDebugToggle,
  debugPayload,
  messages,
  onInputChange,
  onSubmit,
  onToggle,
  onDebugToggle,
  onPostback,
}: ConciergeShellProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    const lineHeight = 24;
    element.style.height = `${Math.min(element.scrollHeight, lineHeight * 3)}px`;
  }, [inputValue]);

  return (
    <div className={styles.root} data-open={isOpen ? "true" : "false"}>
      <button
        type="button"
        className={styles.launcher}
        onClick={onToggle}
        aria-label={isOpen ? "Close Champagne Concierge" : "Open Champagne Concierge"}
        aria-expanded={isOpen}
      >
        <span className={styles.launcherText}>Concierge</span>
      </button>

      {isOpen ? (
        <aside className={styles.panel} aria-label="Champagne Concierge panel">
          <header className={styles.header}>
            <h2 className={styles.title}>Champagne Concierge</h2>
            <div className={styles.headerActions}>
              {showDebugToggle ? (
                <label className={styles.debugToggle}>
                  <input type="checkbox" checked={debugEnabled} onChange={onDebugToggle} />
                  Debug
                </label>
              ) : null}
              <button type="button" onClick={onToggle} className={styles.closeButton} aria-label="Close concierge panel">
                ✕
              </button>
            </div>
          </header>

          <div className={styles.messages} aria-live="polite">
            {messages.map((message) => (
              <article key={message.id} className={styles.message}>
                <p className={styles.role}>{message.role === "assistant" ? "Concierge" : "You"}</p>
                <p className={styles.content}>{message.content}</p>

                {message.cards?.length ? (
                  <ul className={styles.cardList}>
                    {message.cards.map((card) => (
                      <li key={card.id} className={styles.card}>
                        {card.title ? <p className={styles.cardTitle}>{card.title}</p> : null}
                        {card.description ? <p className={styles.cardDescription}>{card.description}</p> : null}
                        {card.actions?.length ? (
                          <div className={styles.cardActions}>
                            {card.actions.map((action) =>
                              action.type === "link" ? (
                                <a key={`${card.id}-${action.label}`} href={action.href} className={styles.actionButton}>
                                  {action.label}
                                </a>
                              ) : (
                                <button
                                  key={`${card.id}-${action.label}`}
                                  type="button"
                                  className={styles.actionButton}
                                  onClick={() => onPostback(action.payload)}
                                >
                                  {action.label}
                                </button>
                              ),
                            )}
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}

            {isLoading ? <p className={styles.meta}>Thinking…</p> : null}
            {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
            {showDebugToggle && debugPayload ? (
              <details className={styles.debugPanel}>
                <summary>Debug payload</summary>
                <pre className={styles.debugCode}>{JSON.stringify(debugPayload, null, 2)}</pre>
              </details>
            ) : null}
          </div>

          <form className={styles.composer} onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              rows={1}
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder={isCooldownActive ? `Please wait ${cooldownSeconds}s…` : "Ask a question about this page"}
              disabled={isLoading || isCooldownActive}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isLoading || isCooldownActive || inputValue.trim().length === 0}
            >
              ↗
            </button>
          </form>
        </aside>
      ) : null}
    </div>
  );
}
