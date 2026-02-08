"use client";

import { useState } from "react";

type PortalShellProps = {
  initialPatientId: string | null;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  requestId?: string;
};

export default function PortalShell({ initialPatientId }: PortalShellProps) {
  const [patientId, setPatientId] = useState<string | null>(initialPatientId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    const response = await fetch("/api/session", { method: "POST" });
    if (!response.ok) {
      setError("Unable to sign in.");
      return;
    }
    const data = (await response.json()) as { patientId?: string };
    setPatientId(data.patientId ?? "demo-patient-1");
  };

  const handleSignOut = async () => {
    setError(null);
    const response = await fetch("/api/session", { method: "DELETE" });
    if (!response.ok) {
      setError("Unable to sign out.");
      return;
    }
    setPatientId(null);
    setMessages([]);
  };

  const handleSend = async () => {
    if (!input.trim()) {
      return;
    }
    setError(null);

    if (!patientId) {
      setError("Sign in required.");
      return;
    }

    const message = input.trim();
    setInput("");
    setIsSending(true);

    setMessages((prev) => [...prev, { role: "user", content: message }]);

    try {
      const response = await fetch("/api/converse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message })
      });

      if (response.status === 401) {
        setError("Sign in required.");
        return;
      }

      const data = (await response.json()) as { reply?: string; requestId?: string; error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to send message.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "(No reply)",
          requestId: data.requestId
        }
      ]);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send message.");
    } finally {
      setIsSending(false);
    }
  };

  if (!patientId) {
    return (
      <main>
        <h1>Patient Portal</h1>
        <p>Please sign in.</p>
        <button type="button" onClick={handleSignIn}>
          Sign in
        </button>
        {error ? <p role="alert">{error}</p> : null}
      </main>
    );
  }

  return (
    <main>
      <header>
        <h1>Patient Portal</h1>
        <p>Signed in as {patientId}</p>
        <button type="button" onClick={handleSignOut}>
          Sign out
        </button>
      </header>
      <section aria-live="polite">
        <h2>Conversation</h2>
        {messages.length === 0 ? <p>No messages yet.</p> : null}
        <ul>
          {messages.map((messageItem, index) => (
            <li key={`${messageItem.role}-${index}`}>
              <strong>{messageItem.role === "user" ? "You" : "Portal"}:</strong>{" "}
              {messageItem.content}
              {messageItem.requestId ? (
                <span>
                  {" "}(audit: {messageItem.requestId})
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <label htmlFor="portal-message">Message</label>
        <textarea
          id="portal-message"
          rows={3}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="button" onClick={handleSend} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </section>
      {error ? <p role="alert">{error}</p> : null}
    </main>
  );
}
