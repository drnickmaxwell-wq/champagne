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

const easeOutCubic: [number, number, number, number] = [0.215, 0.61, 0.355, 1];
const easeInOutCubic: [number, number, number, number] = [0.645, 0.045, 0.355, 1];

type EngineStatus = { state: "checking" } | { state: "ok" } | { state: "error" };

type ConversationResult = {
  matched: boolean;
  conversationId: string | null;
  content: string;
  confidence?: "high" | "medium" | "low" | number | null;
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
};

type LuxuryChatbotProps = {
  engineBaseUrl: string;
  onStatusChange?: (status: EngineStatus) => void;
};

const REQUEST_TIMEOUT_MS = 8000;

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
      className="absolute text-yellow-400 text-xs pointer-events-none"
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
        return "text-orange-500";
      case "distress":
        return "text-red-500";
      case "excitement":
        return "text-green-500";
      case "discomfort":
        return "text-red-400";
      default:
        return "text-blue-500";
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
      className="flex items-center gap-2 text-xs text-gray-500 mb-2"
    >
      <span>{getEmotionIcon(emotion.primary)}</span>
      <span className={getEmotionColor(emotion.primary)}>
        {emotion.primary} ({Math.round(emotion.confidence * 100)}%)
      </span>
    </motion.div>
  );
}

function MessageBubble({ message, isUser }: { message: ChatMessage; isUser: boolean }) {
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
          <p className="text-sm leading-relaxed">{message.content}</p>
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connected");
  const [lastError, setLastError] = useState<string | null>(null);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>({ state: "checking" });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          "Hello! I'm Dr. Marina, your AI concierge at St Mary's House Dental Care. I'm here to help you navigate your dental journey with our luxury coastal practice. How can I assist you today? 🌊",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

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
      const resolvedContent =
        typeof data.content === "string" && data.content.trim().length > 0
          ? data.content
          : "No content returned.";

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: resolvedContent,
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
      book: "I'd like to book an appointment for a consultation.",
      emergency: "I have a dental emergency and need urgent care.",
      technology: "Tell me about your 3D technology and advanced treatments.",
      costs: "What are your treatment costs and payment options?",
    };

    sendMessage(actions[action as keyof typeof actions] || action);
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
              ? "bg-green-400"
              : connectionStatus === "connecting"
                ? "bg-yellow-400"
                : "bg-red-400"
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
                    fill="rgba(255,255,255,0.2)"
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
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-lg">🦷</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Dr. Marina</h3>
                    <p className="text-xs opacity-90">AI Dental Concierge</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "connected"
                        ? "bg-green-300"
                        : connectionStatus === "connecting"
                          ? "bg-yellow-300"
                          : "bg-red-300"
                    }`}
                  />

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
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
                />
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-4"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 mr-4 shadow-lg">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-teal-500 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-2 bg-[color:color-mix(in oklab,var(--smh-bg, #0f172a) 82%, transparent 18%)]">
              <div className="flex gap-2 flex-wrap">
                <QuickActionButton
                  icon={Calendar}
                  label="Book Appointment"
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
                  icon={Sparkles}
                  label="3D Technology"
                  onClick={() => handleQuickAction("technology")}
                  color="purple"
                />
                <QuickActionButton
                  icon={DollarSign}
                  label="Costs"
                  onClick={() => handleQuickAction("costs")}
                  color="yellow"
                />
              </div>
            </div>

            <div className="p-4 bg-[color:color-mix(in oklab,var(--smh-bg, #0f172a) 86%, transparent 14%)] backdrop-blur-sm border-t border-[color:color-mix(in oklab,var(--smh-accent-gold) 26%, transparent)]">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage(inputMessage)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-[color:color-mix(in oklab,var(--smh-bg, #0f172a) 94%, transparent 6%)] border border-[color:color-mix(in oklab,var(--smh-accent-gold) 18%, transparent)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[color:var(--smh-accent-gold)] focus:border-transparent text-sm text-[color:var(--chat-text)]"
                    disabled={isLoading}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVoiceInput}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isListening ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
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
                <p className="mt-2 text-xs text-red-200">{lastError}</p>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
