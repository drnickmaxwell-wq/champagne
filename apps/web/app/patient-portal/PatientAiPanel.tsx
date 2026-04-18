"use client";

import { useState } from "react";

type ActionKind = "guidance" | "risk-summary";

export default function PatientAiPanel() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<ActionKind | null>(null);

  async function runAction(action: ActionKind) {
    setLoading(action);
    setError("");

    try {
      const response = await fetch(`/api/patient-ai/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = typeof data?.error === "string" ? data.error : `Request failed (${response.status}).`;
        throw new Error(message);
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed.";
      setError(message);
      setResult("");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-neutral-200 bg-white p-6">
      <p className="text-sm font-medium text-neutral-800">Patient AI tools</p>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={4}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
        placeholder="Add a short note for guidance or risk summary."
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => runAction("guidance")}
          disabled={loading !== null}
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading === "guidance" ? "Loading..." : "Get guidance"}
        </button>

        <button
          type="button"
          onClick={() => runAction("risk-summary")}
          disabled={loading !== null}
          className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading === "risk-summary" ? "Loading..." : "Get risk summary"}
        </button>
      </div>

      {error ? <p className="text-sm text-neutral-700">Error: {error}</p> : null}
      {result ? <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-white p-3 text-xs">{result}</pre> : null}
    </div>
  );
}
