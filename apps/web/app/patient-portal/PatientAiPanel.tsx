"use client";

import { useState } from "react";

const PROCEDURE_OPTIONS = [
  "Tooth extraction",
  "Root canal",
  "Dental implant",
  "Crown fitting",
  "Composite filling",
] as const;

const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL?.trim() ?? "";

function buildPortalApiUrl(path: string): string | null {
  if (!portalBase) return null;

  try {
    const url = new URL(portalBase.replace(/\/+$/, ""));
    return `${url.toString().replace(/\/+$/, "")}${path}`;
  } catch {
    return null;
  }
}

function extractAdviceLines(data: unknown): string[] {
  if (typeof data === "string") return [data];

  if (Array.isArray(data)) {
    return data.filter((item): item is string => typeof item === "string");
  }

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const candidates = [record.advice, record.guidance, record.summary, record.message, record.output];

    for (const candidate of candidates) {
      if (typeof candidate === "string") return [candidate];
      if (Array.isArray(candidate)) {
        const lines = candidate.filter((item): item is string => typeof item === "string");
        if (lines.length > 0) return lines;
      }
    }
  }

  return [];
}

export default function PatientAiPanel() {
  const [procedureType, setProcedureType] = useState<string>(PROCEDURE_OPTIONS[0]);
  const [symptom, setSymptom] = useState("");
  const [adviceLines, setAdviceLines] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function getGuidance() {
    setLoading(true);
    setError("");

    const guidanceUrl = buildPortalApiUrl("/api/patient-ai/guidance");

    if (!guidanceUrl) {
      setError("Portal API is not configured.");
      setAdviceLines([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(guidanceUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          procedureType,
          symptom: symptom.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message = typeof data?.error === "string" ? data.error : `Request failed (${response.status}).`;
        throw new Error(message);
      }

      const extractedLines = extractAdviceLines(data);
      setAdviceLines(extractedLines.length > 0 ? extractedLines : ["Guidance received."]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed.";
      setError(message);
      setAdviceLines([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-neutral-200 bg-white p-6">
      <p className="text-sm font-medium text-neutral-800">Post-op advice</p>

      <label className="space-y-1 block">
        <span className="text-sm text-neutral-800">Procedure type</span>
        <select
          value={procedureType}
          onChange={(event) => setProcedureType(event.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
        >
          {PROCEDURE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1 block">
        <span className="text-sm text-neutral-800">Symptom</span>
        <input
          type="text"
          value={symptom}
          onChange={(event) => setSymptom(event.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900"
          placeholder="e.g. swelling near extraction site"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={getGuidance}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Loading..." : "Get guidance"}
        </button>
      </div>

      {error ? <p className="text-sm text-neutral-700">Error: {error}</p> : null}

      {adviceLines.length > 0 ? (
        <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-3">
          <p className="text-sm font-medium text-neutral-800">Advice</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
            {adviceLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
