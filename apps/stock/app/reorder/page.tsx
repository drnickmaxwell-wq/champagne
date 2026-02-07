"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EventTypeSchema,
  ReorderSuggestionSchema
} from "@champagne/stock-shared";
import type { ReorderSuggestion } from "@champagne/stock-shared";
import { fetchReorder, postEvent } from "../lib/ops-api";
import FeedbackCard from "../components/ui/FeedbackCard";
import LoadingLine from "../components/ui/LoadingLine";
import PageShell from "../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../components/ui/PrimaryActions";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";

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
  const [opsUnreachable, setOpsUnreachable] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const canReceive = EventTypeSchema.options.includes("RECEIVE");

  const loadReorder = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    setOpsUnreachable(false);
    const result = await fetchReorder();
    setLoading(false);
    if (!result.ok) {
      if (result.status === 0) {
        setOpsUnreachable(true);
      }
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
    if (submittingId) {
      return;
    }
    setStatusMessage("");
    setErrorMessage("");
    setOpsUnreachable(false);
    if (suggestion.suggestedOrderUnits <= 0) {
      setErrorMessage("No receive quantity suggested for this item.");
      return;
    }
    setSubmittingId(suggestion.productId);
    const result = await postEvent({
      eventType: "RECEIVE",
      qtyDeltaUnits: suggestion.suggestedOrderUnits,
      productId: suggestion.productId
    });
    setSubmittingId(null);
    if (!result.ok) {
      if (result.status === 0) {
        setOpsUnreachable(true);
      }
      setErrorMessage(resolveErrorMessage(result.data));
      return;
    }
    setStatusMessage(
      `Received ${suggestion.suggestedOrderUnits} → Reorder list`
    );
    void loadReorder();
  };

  return (
    <PageShell header={<ScreenHeader title="Reorder" />}>
      <div className="stock-feedback-region" aria-live="polite">
        {loading ? <LoadingLine label="Working..." /> : null}
        {submittingId ? <LoadingLine label="Working..." /> : null}
        {statusMessage ? (
          <FeedbackCard title="Status" role="status" message={statusMessage} />
        ) : null}
        {opsUnreachable ? (
          <FeedbackCard
            title="Ops API unreachable"
            role="alert"
            message="Unable to reach ops-api. Check network or service status."
          />
        ) : null}
        {errorMessage ? (
          <FeedbackCard title="Error" role="alert" message={errorMessage} />
        ) : null}
      </div>
      {suggestions.length === 0 && !loading ? (
        <FeedbackCard title="Empty" message="No reorder suggestions." />
      ) : null}
      {suggestions.map((suggestion) => (
        <Section key={suggestion.productId}>
          <strong>{suggestion.name}</strong>
          {suggestion.variant ? ` (${suggestion.variant})` : ""}
          <div>
            <span>Available: {suggestion.availableUnits}</span>
            <span> Min: {suggestion.minLevelUnits}</span>
            <span> Suggested: {suggestion.suggestedOrderUnits}</span>
          </div>
          <PrimaryActions>
            <button
              type="button"
              onClick={() => handleReceive(suggestion)}
              disabled={
                !canReceive ||
                suggestion.suggestedOrderUnits <= 0 ||
                submittingId === suggestion.productId
              }
            >
              Receive (quick +{suggestion.suggestedOrderUnits})
            </button>
            {!canReceive ? <span>Receive events not supported.</span> : null}
          </PrimaryActions>
        </Section>
      ))}
      <p>Flat list for now; supplier grouping later.</p>
      <PrimaryActions>
        <ActionLink href="/scan">Scan again</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
