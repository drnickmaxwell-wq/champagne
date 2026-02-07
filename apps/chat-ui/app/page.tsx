"use client";

import { useEffect, useState } from "react";

type EngineStatus =
  | { state: "checking" }
  | { state: "ok"; message: string }
  | { state: "error"; message: string };

export default function Page() {
  const [status, setStatus] = useState<EngineStatus>({ state: "checking" });

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL;
    if (!baseUrl) {
      setStatus({ state: "error", message: "Missing NEXT_PUBLIC_CHATBOT_ENGINE_URL" });
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(`${baseUrl}/health`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const version = typeof data?.version === "string" ? data.version : null;
        const message = version ? `OK (${version})` : `OK ${JSON.stringify(data)}`;
        setStatus({ state: "ok", message });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        setStatus({ state: "error", message });
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const statusLine = (() => {
    if (status.state === "checking") {
      return "Engine: checking...";
    }
    if (status.state === "ok") {
      return `Engine: ${status.message}`;
    }
    return `Engine: unreachable — ${status.message}`;
  })();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Champagne Concierge UI — Placeholder</h1>
      <p className="max-w-xl text-center text-sm text-neutral-300">
        This is the placeholder shell for the <code>chat-ui</code> app inside the champagne-core monorepo.
      </p>
      <p className="text-sm text-neutral-300">{statusLine}</p>
    </main>
  );
}
