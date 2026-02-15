"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import styles from "./concierge.module.css";
import type { IntentStage } from "./_helpers/sessionMemory";

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
  isEnabled: boolean;
  isOpen: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  inputValue: string;
  messages: ConciergeMessage[];
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onToggle: () => void;
  onClose: () => void;
  onPostback: (payload: string) => void;
  debugState?: {
    lastSeenPath: string;
    visitedPathsCount: number;
    intentStage: IntentStage;
    topicHints: string[];
    conversationId: string | null;
  };
};

type QuickPill = {
  label: string;
  prompt: string;
};

const QUICK_PILLS: Record<"implants" | "whitening" | "default", QuickPill[]> = {
  implants: [
    { label: "Suitability", prompt: "Am I a suitable candidate for dental implants?" },
    { label: "Healing time", prompt: "What is the typical healing time for dental implants?" },
    { label: "Maintenance", prompt: "How do I look after implants long term?" },
  ],
  whitening: [
    { label: "Longevity", prompt: "How long does tooth whitening typically last?" },
    { label: "Sensitivity", prompt: "Will whitening make my teeth sensitive, and how is that managed?" },
    { label: "Suitability", prompt: "Am I suitable for tooth whitening?" },
  ],
  default: [
    { label: "Costs & options", prompt: "Can you explain the options and how costs are usually structured?" },
    { label: "Next steps", prompt: "What are the sensible next steps from here?" },
    { label: "Timeframes", prompt: "What sort of timeframes are typical for this?" },
  ],
};

function resolvePillCategory(pathname: string): keyof typeof QUICK_PILLS {
  const lowerPath = pathname.toLowerCase();
  if (lowerPath.includes("implants")) return "implants";
  if (lowerPath.includes("whitening")) return "whitening";
  return "default";
}

type ReflectiveAnswerMode = "simple" | "clinical" | "bullet";

type FormattedAssistantContent = {
  kind: "text" | "bullet";
  content: ReactNode;
};

const REFLECTIVE_MODES: { mode: ReflectiveAnswerMode; label: string }[] = [
  { mode: "simple", label: "Simple" },
  { mode: "clinical", label: "Clinical" },
  { mode: "bullet", label: "Bullet" },
];

const MIN_LENGTH_FOR_TRANSFORM = 120;

function splitIntoSentencesConservative(content: string) {
  const trimmed = content.trim();
  if (!trimmed) {
    return [];
  }

  return trimmed
    .split(/(?<=[.?!])(?:\s+|\n+)/)
    .map((unit) => unit.trim())
    .filter(Boolean);
}

function formatAssistantContent(content: string, mode: ReflectiveAnswerMode): FormattedAssistantContent {
  if (mode === "clinical") {
    return { kind: "text", content };
  }

  if (content.trim().length < MIN_LENGTH_FOR_TRANSFORM) {
    return { kind: "text", content };
  }

  const sentenceUnits = splitIntoSentencesConservative(content);
  if (sentenceUnits.length < 3) {
    return { kind: "text", content };
  }

  if (mode === "bullet") {
    if (sentenceUnits.length < 2) {
      return { kind: "text", content };
    }

    return {
      kind: "bullet",
      content: (
        <ul className={styles.bulletList}>
          {sentenceUnits.map((unit, index) => (
            <li key={`${index}-${unit.slice(0, 32)}`} className={styles.bulletItem}>
              {unit}
            </li>
          ))}
        </ul>
      ),
    };
  }

  const paragraphs: string[] = [];
  for (let index = 0; index < sentenceUnits.length; index += 2) {
    paragraphs.push(sentenceUnits.slice(index, index + 2).join(" "));
  }

  return {
    kind: "text",
    content: (
      <>
        {paragraphs.map((paragraph, index) => (
          <span key={`${index}-${paragraph.slice(0, 32)}`} className={styles.simpleParagraph}>
            {paragraph}
          </span>
        ))}
      </>
    ),
  };
}

function renderMessageContent(message: ConciergeMessage, mode: ReflectiveAnswerMode): FormattedAssistantContent {
  if (message.role !== "assistant") {
    return { kind: "text", content: message.content };
  }

  return formatAssistantContent(message.content, mode);
}

export function ConciergeShell({
  isEnabled,
  isOpen,
  isLoading,
  errorMessage,
  inputValue,
  messages,
  onInputChange,
  onSubmit,
  onToggle,
  onClose,
  onPostback,
  debugState,
}: ConciergeShellProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const previousOpenRef = useRef(isOpen);
  const [launcherTrace, setLauncherTrace] = useState<"idle" | "open" | "close">("idle");
  const [reflectiveAnswerMode, setReflectiveAnswerMode] = useState<ReflectiveAnswerMode>("clinical");
  const hasAssistantMessages = useMemo(() => messages.some((message) => message.role === "assistant"), [messages]);

  const quickPills = useMemo(() => {
    const currentPath =
      debugState?.lastSeenPath || (typeof window !== "undefined" ? window.location.pathname : "/");
    return QUICK_PILLS[resolvePillCategory(currentPath)];
  }, [debugState?.lastSeenPath]);

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    const lineHeight = 24;
    element.style.height = `${Math.min(element.scrollHeight, lineHeight * 3)}px`;
  }, [inputValue]);

  useEffect(() => {
    const wasOpen = previousOpenRef.current;

    if (!wasOpen && isOpen) {
      const activeElement = document.activeElement;
      lastFocusedRef.current = activeElement instanceof HTMLElement ? activeElement : null;
      setLauncherTrace("open");
    }

    if (wasOpen && !isOpen) {
      if (launcherRef.current) {
        launcherRef.current.focus();
      } else {
        lastFocusedRef.current?.focus();
      }
      setLauncherTrace("close");
    }

    previousOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (launcherTrace === "idle") return;

    const timeoutId = window.setTimeout(() => {
      setLauncherTrace("idle");
    }, 420);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [launcherTrace]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div className={styles.root} data-open={isOpen ? "true" : "false"} data-enabled={isEnabled ? "true" : "false"}>
      {isEnabled ? (
        <button
          ref={launcherRef}
          type="button"
          className={styles.launcher}
          data-trace={launcherTrace}
          onClick={onToggle}
          aria-label={isOpen ? "Close Champagne Concierge" : "Open Champagne Concierge"}
          aria-expanded={isOpen}
        >
          <span className={styles.launcherText}>Concierge</span>
        </button>
      ) : null}

      {isEnabled && isOpen ? (
        <>
          <div className={styles.overlay} aria-hidden="true" onClick={onClose} />
          <aside className={styles.panel} aria-label="Champagne Concierge panel">
            <header className={styles.header}>
              <h2 className={styles.title}>Champagne Concierge</h2>
              <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Close concierge panel">
                ✕
              </button>
            </header>

            <div className={styles.messages} aria-live="polite">
              <div className={styles.pillsRow} aria-label="Quick prompts">
                {quickPills.map((pill) => (
                  <button
                    key={pill.label}
                    type="button"
                    className={styles.pill}
                    onClick={() => onPostback(pill.prompt)}
                    disabled={isLoading}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {hasAssistantMessages ? (
                <div className={styles.modeToggle} role="group" aria-label="Reflective answer mode">
                  {REFLECTIVE_MODES.map((item) => (
                    <button
                      key={item.mode}
                      type="button"
                      className={styles.modeOption}
                      data-active={reflectiveAnswerMode === item.mode ? "true" : "false"}
                      aria-pressed={reflectiveAnswerMode === item.mode}
                      onClick={() => setReflectiveAnswerMode(item.mode)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}

              {messages.map((message) => {
                const renderedContent = renderMessageContent(message, reflectiveAnswerMode);

                return (
                  <article key={message.id} className={styles.message}>
                    <p className={styles.role}>{message.role === "assistant" ? "Concierge" : "You"}</p>
                    {renderedContent.kind === "bullet" ? (
                      <div className={styles.content}>{renderedContent.content}</div>
                    ) : (
                      <p className={styles.content}>{renderedContent.content}</p>
                    )}

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
                );
              })}

              {isLoading ? <p className={styles.meta}>Thinking…</p> : null}
              {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
              {debugState ? (
                <div>
                  <p className={styles.meta}>Debug · lastSeenPath: {debugState.lastSeenPath}</p>
                  <p className={styles.meta}>Debug · visitedPaths: {debugState.visitedPathsCount}</p>
                  <p className={styles.meta}>Debug · intentStage: {debugState.intentStage}</p>
                  <p className={styles.meta}>Debug · topicHints: {debugState.topicHints.join(", ") || "none"}</p>
                  <p className={styles.meta}>Debug · conversationId: {debugState.conversationId ?? "none"}</p>
                </div>
              ) : null}
            </div>

            <form className={styles.composer} onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                rows={1}
                value={inputValue}
                onChange={(event) => onInputChange(event.target.value)}
                placeholder="Ask a question about this page"
                disabled={isLoading}
              />
              <button type="submit" className={styles.sendButton} disabled={isLoading || inputValue.trim().length === 0}>
                ↗
              </button>
            </form>
          </aside>
        </>
      ) : null}
    </div>
  );
}
