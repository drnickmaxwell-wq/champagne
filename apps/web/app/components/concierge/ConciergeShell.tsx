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

type GuidedSingleStep = {
  id: "topic" | "goal" | "timing" | "urgency";
  title: string;
  type: "single_select";
  options: { label: string; value: string }[];
  note?: string;
};

type GuidedMultiStep = {
  id: "constraints";
  title: string;
  type: "multi_select";
  options: { label: string; value: string }[];
  maxSelections?: number;
  note?: string;
};

type GuidedStep = GuidedSingleStep | GuidedMultiStep;

type GuidedAnswers = {
  topic?: string;
  goal?: string;
  timing?: string;
  constraints: string[];
  urgency?: string;
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

const GUIDED_STEPS: GuidedStep[] = [
  {
    id: "topic",
    title: "What are you looking to discuss?",
    type: "single_select",
    options: [
      { label: "Implants", value: "implants" },
      { label: "Whitening", value: "whitening" },
      { label: "Cosmetic bonding", value: "bonding" },
      { label: "Invisalign / straightening", value: "orthodontics" },
      { label: "General check-up", value: "checkup" },
      { label: "Something else", value: "other" },
    ],
  },
  {
    id: "goal",
    title: "What’s your goal?",
    type: "single_select",
    options: [
      { label: "Improve appearance", value: "appearance" },
      { label: "Improve comfort / function", value: "function" },
      { label: "Replace missing tooth/teeth", value: "replace_missing" },
      { label: "Understand options and costs", value: "options_costs" },
      { label: "Not sure yet", value: "not_sure" },
    ],
  },
  {
    id: "timing",
    title: "What’s your timeframe?",
    type: "single_select",
    options: [
      { label: "Just exploring", value: "exploring" },
      { label: "Next few weeks", value: "weeks" },
      { label: "Next few months", value: "months" },
      { label: "As soon as sensible", value: "soon" },
    ],
  },
  {
    id: "constraints",
    title: "Any constraints we should keep in mind?",
    type: "multi_select",
    options: [
      { label: "Budget-conscious", value: "budget" },
      { label: "Prefer minimal appointments", value: "few_visits" },
      { label: "Anxious about treatment", value: "anxious" },
      { label: "Prefer the most durable option", value: "durable" },
      { label: "Prefer the most natural look", value: "natural" },
    ],
    maxSelections: 3,
  },
  {
    id: "urgency",
    title: "Is this urgent?",
    type: "single_select",
    options: [
      { label: "No", value: "no" },
      { label: "Some discomfort", value: "discomfort" },
      { label: "Severe pain / swelling", value: "severe" },
    ],
    note: "This is not emergency care. If you have severe swelling, breathing difficulty, or feel unwell, seek urgent medical help.",
  },
];

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
  const [guidedActive, setGuidedActive] = useState(false);
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [guidedAnswers, setGuidedAnswers] = useState<GuidedAnswers>({ constraints: [] });
  const hasAssistantMessages = useMemo(() => messages.some((message) => message.role === "assistant"), [messages]);
  const canStartGuidedConsultation = isEnabled && isOpen && !isLoading;
  const activeGuidedStep = GUIDED_STEPS[guidedStepIndex];

  const resetGuidedConsultation = () => {
    setGuidedStepIndex(0);
    setGuidedAnswers({ constraints: [] });
  };

  const cancelGuidedConsultation = () => {
    setGuidedActive(false);
    resetGuidedConsultation();
  };

  const composeGuidedPrompt = (answers: GuidedAnswers) => {
    const constraintsText = answers.constraints.length ? answers.constraints.join(", ") : "none";
    const severeSafetyLine =
      answers.urgency === "severe"
        ? " If you have severe swelling, breathing difficulty, or feel unwell, please seek urgent medical help immediately."
        : "";

    return `I’d like to discuss: ${answers.topic}. My goal is: ${answers.goal}. Timeframe: ${answers.timing}. Constraints: ${constraintsText}. Urgency: ${answers.urgency}. Please explain the sensible options and typical next steps in a clinician-led way, and suggest what information you’d need at an appointment.${severeSafetyLine}`;
  };

  const sendGuidedConsultation = (answers: GuidedAnswers) => {
    onPostback(composeGuidedPrompt(answers));
    setGuidedActive(false);
    resetGuidedConsultation();
  };

  const handleSingleSelect = (step: GuidedSingleStep, value: string) => {
    const nextAnswers = { ...guidedAnswers, [step.id]: value };
    setGuidedAnswers(nextAnswers);
    if (guidedStepIndex === GUIDED_STEPS.length - 1) {
      sendGuidedConsultation(nextAnswers);
      return;
    }
    setGuidedStepIndex((index) => index + 1);
  };

  const handleConstraintsToggle = (value: string) => {
    if (activeGuidedStep.type !== "multi_select") {
      return;
    }

    const selections = guidedAnswers.constraints;
    const exists = selections.includes(value);
    if (exists) {
      setGuidedAnswers({ ...guidedAnswers, constraints: selections.filter((item) => item !== value) });
      return;
    }

    if ((activeGuidedStep.maxSelections ?? 0) > 0 && selections.length >= (activeGuidedStep.maxSelections ?? 0)) {
      return;
    }

    setGuidedAnswers({ ...guidedAnswers, constraints: [...selections, value] });
  };

  const continueFromConstraints = () => {
    if (guidedStepIndex === GUIDED_STEPS.length - 1) {
      sendGuidedConsultation(guidedAnswers);
      return;
    }
    setGuidedStepIndex((index) => index + 1);
  };

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

              {canStartGuidedConsultation ? (
                <div className={styles.consultationHeader}>
                  <button
                    type="button"
                    className={styles.startConsultationButton}
                    onClick={() => {
                      resetGuidedConsultation();
                      setGuidedActive(true);
                    }}
                    disabled={guidedActive}
                  >
                    Start a consultation
                  </button>
                </div>
              ) : null}

              {guidedActive ? (
                <section className={styles.consultationPanel} aria-label="Guided consultation">
                  <p className={styles.stepMeta}>
                    Step {guidedStepIndex + 1} of {GUIDED_STEPS.length}
                  </p>
                  <p className={styles.stepTitle}>{activeGuidedStep.title}</p>
                  <p className={styles.stepNote}>Please avoid sharing private medical details here.</p>
                  <div className={styles.optionGrid}>
                    {activeGuidedStep.options.map((option) => {
                      const isSelected =
                        activeGuidedStep.type === "single_select"
                          ? guidedAnswers[activeGuidedStep.id] === option.value
                          : guidedAnswers.constraints.includes(option.value);

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={`${styles.optionButton} ${isSelected ? styles.optionSelected : ""}`.trim()}
                          data-selected={isSelected ? "true" : "false"}
                          onClick={() =>
                            activeGuidedStep.type === "single_select"
                              ? handleSingleSelect(activeGuidedStep, option.value)
                              : handleConstraintsToggle(option.value)
                          }
                          disabled={isLoading}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  {activeGuidedStep.type === "multi_select" ? (
                    <p className={styles.meta}>
                      Select up to {activeGuidedStep.maxSelections}. Current: {guidedAnswers.constraints.length}
                    </p>
                  ) : null}
                  {activeGuidedStep.note ? <p className={styles.meta}>{activeGuidedStep.note}</p> : null}

                  <div className={styles.consultationActions}>
                    <button type="button" className={styles.consultationActionButton} onClick={cancelGuidedConsultation}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.consultationActionButton}
                      onClick={resetGuidedConsultation}
                      disabled={isLoading}
                    >
                      Reset
                    </button>
                    {activeGuidedStep.type === "multi_select" ? (
                      <button
                        type="button"
                        className={styles.consultationPrimaryButton}
                        onClick={continueFromConstraints}
                        disabled={isLoading}
                      >
                        Continue
                      </button>
                    ) : null}
                  </div>
                </section>
              ) : null}

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
