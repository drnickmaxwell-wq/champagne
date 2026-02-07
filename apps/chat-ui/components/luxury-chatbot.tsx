"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  DollarSign,
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { chatUiFixtures } from "../lib/chat-fixtures";
import BookingRequestModal from "./booking-request-modal";
import EmergencyCallbackModal from "./emergency-callback-modal";
import NewPatientEnquiryModal from "./new-patient-enquiry-modal";

const easeOutCubic: [number, number, number, number] = [0.215, 0.61, 0.355, 1];
const easeInOutCubic: [number, number, number, number] = [0.645, 0.045, 0.355, 1];

type EngineStatus = { state: "checking" } | { state: "ok" } | { state: "error" };

type ConversationResult = {
  matched: boolean;
  conversationId: string | null;
  content: string;
  confidence?: "high" | "medium" | "low" | number | null;
  ui?: unknown;
};

type EmotionAnalysis = {
  primary: string;
  confidence: number;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  emotion?: EmotionAnalysis;
  confidence?: "high" | "medium" | "low" | null;
  ui?: AssistantUiPayload;
};

type LuxuryChatbotProps = {
  engineBaseUrl: string;
  onStatusChange?: (status: EngineStatus) => void;
};

const REQUEST_TIMEOUT_MS = 8000;

type HandoffPayload = {
  kind: "handoff";
  form: "booking" | "emergency_callback" | "new_patient";
};
type ActionPayload = string | HandoffPayload | Record<string, unknown>;

type CardAction =
  | { type: "link"; label: string; href: string }
  | { type: "postback"; label: string; payload: ActionPayload };

type CardPayload = {
  title?: string;
  body: string;
  actions: CardAction[];
};

type AssistantUiPayload = {
  kind: "cards";
  cards: CardPayload[];
};

type ParsedAssistantContent = {
  content: string;
  ui?: AssistantUiPayload;
};

const UI_MARKER = "UI:";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const extractFirstJsonObject = (value: string) => {
  const startIndex = value.indexOf("{");
  if (startIndex === -1) {
    return null;
  }
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = startIndex; index < value.length; index += 1) {
    const char = value[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "\"") {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return value.slice(startIndex, index + 1);
      }
    }
  }
  return null;
};

const parseJsonPayload = (payload: string): Record<string, unknown> | null => {
  if (!payload.trim().startsWith("{")) {
    return null;
  }
  try {
    const parsed = JSON.parse(payload);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const isHandoffPayload = (
  payload: unknown,
  form: HandoffPayload["form"],
) => {
  if (typeof payload === "string") {
    if (form === "booking" && payload === "BOOKING_REQUEST") {
      return true;
    }
    const parsed = parseJsonPayload(payload);
    if (!parsed) {
      return false;
    }
    return parsed.kind === "handoff" && parsed.form === form;
  }
  if (isRecord(payload)) {
    return payload.kind === "handoff" && payload.form === form;
  }
  return false;
};

const extractTenantIdFromManifest = (value: unknown): string | null => {
  if (!isRecord(value) || typeof value.tenantId !== "string") {
    return null;
  }
  return value.tenantId;
};

const normalizeAction = (value: unknown): CardAction | null => {
  if (!isRecord(value) || typeof value.type !== "string") {
    return null;
  }
  if (value.type === "link") {
    if (typeof value.label === "string" && typeof value.href === "string") {
      return { type: "link", label: value.label, href: value.href };
    }
    return null;
  }
  if (value.type === "postback") {
    if (typeof value.label !== "string") {
      return null;
    }
    if (typeof value.payload === "string") {
      return { type: "postback", label: value.label, payload: value.payload };
    }
    if (isRecord(value.payload)) {
      return { type: "postback", label: value.label, payload: value.payload };
    }
  }
  return null;
};

const normalizeCardsPayload = (value: unknown): AssistantUiPayload | null => {
  if (!isRecord(value) || value.kind !== "cards" || !Array.isArray(value.cards)) {
    return null;
  }
  const cards = value.cards
    .map((card) => {
      if (!isRecord(card) || typeof card.body !== "string") {
        return null;
      }
      const actions = Array.isArray(card.actions)
        ? card.actions.map(normalizeAction).filter(Boolean)
        : [];
      return {
        title: typeof card.title === "string" ? card.title : undefined,
        body: card.body,
        actions: actions as CardAction[],
      };
    })
    .filter(Boolean) as CardPayload[];

  if (cards.length === 0) {
    return null;
  }
  return { kind: "cards", cards };
};

const parseUiBlockFromContent = (content: string): ParsedAssistantContent => {
  const markerIndex = content.indexOf(UI_MARKER);
  if (markerIndex === -1) {
    return { content };
  }
  const textPart = content.slice(0, markerIndex).trimEnd();
  const afterMarker = content.slice(markerIndex + UI_MARKER.length).trim();
  const jsonPayload = extractFirstJsonObject(afterMarker);
  if (!jsonPayload) {
    return { content };
  }
  try {
    const parsed = JSON.parse(jsonPayload);
    const ui = normalizeCardsPayload(parsed);
    if (!ui) {
      return { content };
    }
    return { content: textPart, ui };
  } catch {
    return { content };
  }
};

const resolveAssistantContent = (data: ConversationResult): ParsedAssistantContent => {
  const resolvedContent =
    typeof data.content === "string" && data.content.trim().length > 0
      ? data.content
      : "No content returned.";

  const directUi = normalizeCardsPayload(data.ui);
  if (directUi) {
    return { content: resolvedContent, ui: directUi };
  }

  return parseUiBlockFromContent(resolvedContent);
};

function resolveConfidenceLabel(confidence: ConversationResult["confidence"]) {
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
}

function FloatingSparkle({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        rotate: [0, 180, 360],
        y: [-20, -40, -60],
        x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: easeOutCubic,
      }}
      className="absolute text-[color:var(--brand-gold)] text-xs pointer-events-none"
    >
      ✨
    </motion.div>
  );
}

function EmotionIndicator({ emotion }: { emotion?: EmotionAnalysis }) {
  if (!emotion) return null;

  const getEmotionColor = (emotionType: string) => {
    switch (emotionType) {
      case "anxiety":
        return "text-[color:var(--text-medium)]";
      case "distress":
        return "text-[color:var(--text-high)]";
      case "excitement":
        return "text-[color:var(--text-high)]";
      case "discomfort":
        return "text-[color:var(--text-medium)]";
      default:
        return "text-[color:var(--text-low)]";
    }
  };

  const getEmotionIcon = (emotionType: string) => {
    switch (emotionType) {
      case "anxiety":
        return "😰";
      case "distress":
        return "😨";
      case "excitement":
        return "😊";
      case "discomfort":
        return "😣";
      default:
        return "😐";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 text-xs text-[color:var(--text-medium)] mb-2"
    >
      <span>{getEmotionIcon(emotion.primary)}</span>
      <span className={getEmotionColor(emotion.primary)}>
        {emotion.primary} ({Math.round(emotion.confidence * 100)}%)
      </span>
    </motion.div>
  );
}

function AssistantCards({
  payload,
  onPostback,
}: {
  payload: AssistantUiPayload;
  onPostback: (payload: ActionPayload) => void;
}) {
  if (payload.kind !== "cards") return null;

  const handleLinkClick = (href: string) => {
    if (!href) return;
    const newWindow = window.open(href, "_blank", "noopener,noreferrer");
    if (!newWindow) {
      window.location.assign(href);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      {payload.cards.map((card, index) => (
        <div
          key={`${card.title ?? "card"}-${index}`}
          className="rounded-2xl border border-[color:color-mix(in oklab,var(--smh-accent-gold) 16%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 92%, transparent)] px-3 py-3 shadow-sm"
        >
          {card.title ? (
            <p className="text-sm font-semibold text-[color:var(--text-high)] mb-1">
              {card.title}
            </p>
          ) : null}
          <p className="text-sm text-[color:var(--text-medium)] leading-relaxed">
            {card.body}
          </p>
          {card.actions.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {card.actions.map((action, actionIndex) => {
                if (action.type === "link") {
                  return (
                    <button
                      key={`${action.label}-${actionIndex}`}
                      type="button"
                      onClick={() => handleLinkClick(action.href)}
                      className="rounded-full border border-[color:color-mix(in oklab,var(--smh-accent-gold) 22%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 84%, transparent)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-high)] transition hover:brightness-105"
                    >
                      {action.label}
                    </button>
                  );
                }
                return (
                  <button
                    key={`${action.label}-${actionIndex}`}
                    type="button"
                    onClick={() => onPostback(action.payload)}
                    className="rounded-full border border-[color:color-mix(in oklab,var(--smh-accent-gold) 22%, transparent)] bg-[color:color-mix(in oklab,var(--smh-bg) 86%, transparent)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-high)] transition hover:brightness-105"
                  >
                    {action.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function MessageBubble({
  message,
  isUser,
  onPostback,
}: {
  message: ChatMessage;
  isUser: boolean;
  onPostback: (payload: ActionPayload) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? "order-2" : "order-1"}`}>
        {!isUser && <EmotionIndicator emotion={message.emotion} />}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "lux-chat-user-bubble ml-4"
              : "lux-chat-assistant-bubble mr-4 text-[color:var(--chat-text)]"
          }`}
        >
          {message.content.trim().length > 0 ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : null}
          {!isUser && message.ui ? (
            <AssistantCards payload={message.ui} onPostback={onPostback} />
          ) : null}
          <div
            className={`text-xs mt-2 ${
              isUser ? "lux-chat-user-meta" : "lux-chat-assistant-meta"
            }`}
          >
            {message.confidence ? `Confidence: ${message.confidence} · ` : ""}
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isUser
            ? "lux-chat-avatar-user order-1 mr-2"
            : "lux-chat-avatar-assistant order-2 ml-2"
        }`}
      >
        {isUser ? "👤" : "🦷"}
      </div>
    </motion.div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  color = "teal",
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}) {
  const colorClasses = {
    teal: "lux-chat-quick-action--teal",
    pink: "lux-chat-quick-action--pink",
    yellow: "lux-chat-quick-action--yellow",
    purple: "lux-chat-quick-action--purple",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 lux-chat-quick-action ${
        colorClasses[color as keyof typeof colorClasses]
      } rounded-full text-xs font-medium transition-all duration-300`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </motion.button>
  );
}

export default function LuxuryChatbot({
  engineBaseUrl,
  onStatusChange,
}: LuxuryChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connected");
  const [lastError, setLastError] = useState<string | null>(null);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>({ state: "checking" });
  const [tenantId, setTenantId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInjectedFixture = useRef(false);
  const fixtureMode = process.env.NEXT_PUBLIC_CHATBOT_UI_FIXTURE ?? "";

  useEffect(() => {
    onStatusChange?.(engineStatus);
    if (engineStatus.state === "ok") {
      setConnectionStatus("connected");
    } else if (engineStatus.state === "checking") {
      setConnectionStatus("connecting");
    } else {
      setConnectionStatus("disconnected");
    }
  }, [engineStatus, onStatusChange]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/brand/chat-ui.json", { cache: "force-cache", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        const resolvedTenantId = extractTenantIdFromManifest(payload);
        if (resolvedTenantId) {
          setTenantId(resolvedTenantId);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "1",
        role: "assistant",
        content:
          "Hello! I’m the St Mary’s House concierge. I can help with appointments and general questions. How can I help today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (!isOpen || hasInjectedFixture.current) {
      return;
    }
    const fixture = chatUiFixtures[fixtureMode];
    if (!fixture) {
      return;
    }
    const uiPayload = normalizeCardsPayload(fixture.ui);

    const fixtureMessage: ChatMessage = {
      id: `fixture-${fixtureMode}`,
      role: "assistant",
      content: fixture.content,
      timestamp: new Date(),
      ui: uiPayload ?? undefined,
    };

    setMessages((prev) => [...prev, fixtureMessage]);
    hasInjectedFixture.current = true;
  }, [fixtureMode, isOpen]);

  useEffect(() => {
    const maxAttempts = 3;
    let isCancelled = false;
    let retryTimeoutId: number | null = null;

    if (!engineBaseUrl) {
      setEngineStatus({ state: "error" });
      return () => undefined;
    }

    const checkHealth = (attempt: number) => {
      setEngineStatus({ state: "checking" });
      fetch(`${engineBaseUrl}/health`, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          if (!isCancelled) {
            setEngineStatus({ state: "ok" });
          }
        })
        .catch(() => {
          if (isCancelled) {
            return;
          }
          if (attempt >= maxAttempts) {
            setEngineStatus({ state: "error" });
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
  }, [engineBaseUrl]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setLastError(null);
    setConnectionStatus("connecting");

    if (!engineBaseUrl) {
      setLastError("Engine URL is not configured.");
      setConnectionStatus("disconnected");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${engineBaseUrl}/v1/converse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content.trim() }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`.trim());
      }

      const data = (await response.json()) as ConversationResult;
      const resolvedMessage = resolveAssistantContent(data);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: resolvedMessage.content,
        ui: resolvedMessage.ui,
        timestamp: new Date(),
        confidence: resolveConfidenceLabel(data.confidence),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setConnectionStatus("connected");
    } catch (error) {
      const errorMessage =
        error instanceof DOMException && error.name === "AbortError"
          ? "Request failed: timeout after 8s."
          : error instanceof Error
            ? `Request failed: ${error.message}`
            : "Request failed: Unknown error.";

      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
      setLastError(errorMessage);
      setConnectionStatus("disconnected");
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const actions = {
      book: "book appointment",
      emergency: "emergency",
      fees: "fees",
      technology: "technology",
      implants: "implants",
      whitening: "whitening",
    };

    sendMessage(actions[action as keyof typeof actions] || action);
  };

  const handlePostback = (payload: ActionPayload) => {
    if (isHandoffPayload(payload, "booking")) {
      setIsBookingModalOpen(true);
      return;
    }
    if (isHandoffPayload(payload, "emergency_callback")) {
      setIsEmergencyModalOpen(true);
      return;
    }
    if (isHandoffPayload(payload, "new_patient")) {
      setIsNewPatientModalOpen(true);
      return;
    }
    if (typeof payload === "string") {
      sendMessage(payload);
      return;
    }
    sendMessage(JSON.stringify(payload));
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="lux-chat-launch-button fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden group"
        style={{ display: isOpen ? "none" : "flex" }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <FloatingSparkle key={i} delay={i * 0.5} />
          ))}
        </div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10"
        >
          <MessageCircle className="w-8 h-8" />
        </motion.div>

        <div
          className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
            connectionStatus === "connected"
              ? "bg-[color:var(--brand-teal)]"
              : connectionStatus === "connecting"
                ? "bg-[color:var(--brand-gold)]"
                : "bg-[color:var(--text-low)]"
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ duration: 0.3, ease: easeOutCubic }}
            className="lux-chat-window fixed bottom-6 right-6 z-50 w-96 h-[600px] rounded-3xl overflow-hidden"
          >
            <div className="lux-chat-window-header p-4 relative overflow-hidden">
              <div className="lux-chat-header-sheen" aria-hidden="true" />
              <div className="absolute inset-0 opacity-30">
                <svg viewBox="0 0 400 100" className="w-full h-full">
                  <motion.path
                    d="M0,50 Q100,20 200,50 T400,50 V100 H0 Z"
                    fill="color-mix(in oklab, var(--smh-white) 20%, transparent)"
                    animate={{
                      d: [
                        "M0,50 Q100,20 200,50 T400,50 V100 H0 Z",
                        "M0,50 Q100,80 200,50 T400,50 V100 H0 Z",
                        "M0,50 Q100,20 200,50 T400,50 V100 H0 Z",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: easeInOutCubic }}
                  />
                </svg>
              </div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[color:color-mix(in oklab,var(--smh-white) 20%, transparent)] rounded-full flex items-center justify-center">
                    <span className="text-lg">🦷</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">St Mary&apos;s House Concierge</h3>
                    <p className="text-xs opacity-90">Care concierge</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "connected"
                        ? "bg-[color:var(--brand-teal)]"
                        : connectionStatus === "connecting"
                          ? "bg-[color:var(--brand-gold)]"
                          : "bg-[color:var(--text-low)]"
                    }`}
                  />

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-[color:color-mix(in oklab,var(--smh-white) 20%, transparent)] rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="lux-chat-scroll-sheen flex-1 p-4 overflow-y-auto h-[400px]">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isUser={message.role === "user"}
                  onPostback={handlePostback}
                />
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-[color:color-mix(in oklab,var(--smh-white) 90%, transparent)] backdrop-blur-sm rounded-2xl px-4 py-3 mr-4 shadow-lg">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-[color:var(--brand-teal)] rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-2 bg-[color:color-mix(in oklab,var(--smh-bg) 82%, transparent 18%)]">
              <div className="flex gap-2 flex-wrap">
                <QuickActionButton
                  icon={Calendar}
                  label="Book appointment"
                  onClick={() => handleQuickAction("book")}
                  color="teal"
                />
                <QuickActionButton
                  icon={Zap}
                  label="Emergency"
                  onClick={() => handleQuickAction("emergency")}
                  color="pink"
                />
                <QuickActionButton
                  icon={DollarSign}
                  label="Fees"
                  onClick={() => handleQuickAction("fees")}
                  color="yellow"
                />
                <QuickActionButton
                  icon={Sparkles}
                  label="Technology"
                  onClick={() => handleQuickAction("technology")}
                  color="purple"
                />
                <QuickActionButton
                  icon={Sparkles}
                  label="Implants"
                  onClick={() => handleQuickAction("implants")}
                  color="teal"
                />
                <QuickActionButton
                  icon={Sparkles}
                  label="Whitening"
                  onClick={() => handleQuickAction("whitening")}
                  color="pink"
                />
              </div>
            </div>

            <div className="p-4 bg-[color:color-mix(in oklab,var(--smh-bg) 86%, transparent 14%)] backdrop-blur-sm border-t border-[color:color-mix(in oklab,var(--smh-accent-gold) 26%, transparent)]">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-[color:color-mix(in oklab,var(--smh-bg) 94%, transparent 6%)] border border-[color:color-mix(in oklab,var(--smh-accent-gold) 18%, transparent)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[color:var(--smh-accent-gold)] focus:border-transparent text-sm text-[color:var(--chat-text)]"
                    disabled={isLoading}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVoiceInput}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isListening
                      ? "bg-[color:var(--brand-magenta)] text-[color:var(--smh-white)]"
                      : "bg-[color:var(--surface-1)] text-[color:var(--text-medium)] hover:bg-[color:var(--surface-2)]"
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 lux-chat-send-button rounded-full transition-all duration-300"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              {lastError ? (
                <p className="mt-2 text-xs text-[color:var(--text-ink-medium)]">{lastError}</p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <BookingRequestModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tenantId={tenantId}
      />
      <EmergencyCallbackModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        tenantId={tenantId}
      />
      <NewPatientEnquiryModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        tenantId={tenantId}
      />
    </>
  );
}
