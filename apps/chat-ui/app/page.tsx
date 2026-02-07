"use client";

import { useMemo, useState } from "react";
import LuxuryChatbot from "../components/luxury-chatbot";

type EngineStatus = { state: "checking" } | { state: "ok" } | { state: "error" };

const DENTALLY_BOOKING_URL = "https://st-marys-house-dental-care.portal.dental";

export default function Page() {
  const [status, setStatus] = useState<EngineStatus>({ state: "checking" });
  const engineBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL ?? "", []);

  const statusLine = status.state === "ok" ? "Engine: online" : "Engine: unreachable";

  return (
    <main className="chat-preview-stage">
      <div className="chat-preview-card">
        <div className="chat-preview-layout">
          <header className="chat-preview-header">
            <div className="space-y-3">
              <span className="chat-preview-badge">Chat UI Preview</span>
              <h1 className="text-3xl font-semibold">St Mary&apos;s House Chat</h1>
              <p className="max-w-xl text-sm text-[color:var(--text-medium)]">
                The chat experience runs in your browser while the engine handles responses
                securely. Use the launcher to open the chat window.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <a
                className="rounded-full border border-[color:color-mix(in oklab,var(--smh-accent-gold) 35%, transparent)] px-4 py-2 text-sm font-medium"
                href={DENTALLY_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book an appointment
              </a>
              <span className="text-xs text-[color:var(--text-low)]">{statusLine}</span>
            </div>
          </header>
          <div className="text-sm text-[color:var(--text-medium)]">
            <p className="mb-3">
              The chat preview is ready. Tap the floating chat button in the lower right corner
              to begin a conversation and review the chat experience.
            </p>
            <ul className="space-y-2 text-[color:var(--text-low)]">
              <li>• Live engine status and quick actions are available.</li>
              <li>• Responses are streamed from the configured chat engine.</li>
              <li>• The booking link remains available for scheduling.</li>
            </ul>
          </div>
          <div className="flex items-center justify-center text-sm text-[color:var(--text-low)]">
            The chat window appears in the lower-right corner when opened.
          </div>
        </div>
      </div>
      <LuxuryChatbot engineBaseUrl={engineBaseUrl} onStatusChange={setStatus} />
    </main>
  );
}
