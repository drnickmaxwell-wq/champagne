"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EventTypeSchema,
  ReorderSuggestionSchema
} from "@champagne/stock-shared";
import type { ReorderSuggestion } from "@champagne/stock-shared";
import { fetchReorder, postEvent } from "../lib/ops-api";

const resolveErrorMessage = (data: unknown) => {
  if (data && typeof data === "object") {
    const candidate = data as Record<string, unknown>;
    if (typeof candidate.message === "string") {
      return candidate.message;
    }
    if (typeof candidate.error === "string") {
      return candidate.error;
    }
  }
  return "Request failed.";
};

export default function ReorderPage() {
  const [suggestions, setSuggestions] = useState<ReorderSuggestion[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const canReceive = EventTypeSchema.options.includes("RECEIVE");

  const loadReorder = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    const result = await fetchReorder();
    setLoading(false);
    if (!result.ok) {
      setErrorMessage(resolveErrorMessage(result.data));
      setSuggestions([]);
      return;
    }

    const parsed = ReorderSuggestionSchema.array().safeParse(result.data);
    if (!parsed.success) {
      setErrorMessage("Unexpected reorder response.");
      setSuggestions([]);
      return;
    }

    setSuggestions(parsed.data);
  }, []);

  useEffect(() => {
    void loadReorder();
  }, [loadReorder]);

  const handleReceive = async (suggestion: ReorderSuggestion) => {
    if (!canReceive) {
      return;
    }
    setStatusMessage("");
    setErrorMessage("");
    if (suggestion.suggestedOrderUnits <= 0) {
      setErrorMessage("No receive quantity suggested for this item.");
      return;
    }
    const result = await postEvent({
      eventType: "RECEIVE",
      qtyDeltaUnits: suggestion.suggestedOrderUnits,
      productId: suggestion.productId
    });
    if (!result.ok) {
      setErrorMessage(resolveErrorMessage(result.data));
      return;
    }
    setStatusMessage("Receive event recorded.");
    void loadReorder();
  };

  return (
    <section>
      <h1>Reorder</h1>
      {loading ? <p>Loading suggestions...</p> : null}
      {statusMessage ? <p>{statusMessage}</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}
      {suggestions.length === 0 && !loading ? (
        <p>No reorder suggestions.</p>
      ) : null}
      <ul>
        {suggestions.map((suggestion) => (
          <li key={suggestion.productId}>
            <strong>{suggestion.name}</strong>
            {suggestion.variant ? ` (${suggestion.variant})` : ""}
            <div>
              <span>Available: {suggestion.availableUnits}</span>
              <span>Min: {suggestion.minLevelUnits}</span>
              <span>Suggested: {suggestion.suggestedOrderUnits}</span>
            </div>
            <div>
              <button
                type="button"
                onClick={() => handleReceive(suggestion)}
                disabled={!canReceive || suggestion.suggestedOrderUnits <= 0}
              >
                Receive (quick +{suggestion.suggestedOrderUnits})
              </button>
              {!canReceive ? <span>Receive events not supported.</span> : null}
            </div>
          </li>
        ))}
      </ul>
      <p>Flat list for now; supplier grouping later.</p>
    </section>
  );
}
