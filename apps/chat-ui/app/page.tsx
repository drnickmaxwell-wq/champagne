"use client";

import { useEffect, useState } from "react";

type EngineStatus = { state: "checking" } | { state: "ok" } | { state: "error" };

export default function Page() {
  const [status, setStatus] = useState<EngineStatus>({ state: "checking" });

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL;
    if (!baseUrl) {
      setStatus({ state: "error" });
      return;
    }

    fetch(`${baseUrl}/health`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        setStatus({ state: "ok" });
      })
      .catch(() => {
        setStatus({ state: "error" });
      });
  }, []);

  const statusLine = (() => {
    if (status.state === "checking") {
      return "Engine: checking...";
    }
    if (status.state === "ok") {
      return "Engine: ok";
    }
    return "Engine: unreachable";
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
