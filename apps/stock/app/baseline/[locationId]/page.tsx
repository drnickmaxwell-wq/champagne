"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import FeedbackCard from "../../components/ui/FeedbackCard";
import LoadingLine from "../../components/ui/LoadingLine";
import MessagePanel from "../../components/ui/MessagePanel";
import PageShell from "../../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../../components/ui/PrimaryActions";
import { FieldRow } from "../../components/ui/FieldList";
import Card from "../../components/ui/Card";
import {
  ScreenHeader,
  Section,
  KeyValueGrid
} from "../../components/ui/ScreenKit";
import {
  clearBaselineForLocation,
  exportBaselineCsv,
  getBaselineForLocation,
  upsertBaselineEntry,
  type BaselineCountEntry
} from "../localBaseline";
import { DRAFT_STATUS, type DraftStatus } from "../orderDraftStatus";
import { getOrderDraftStatus } from "../orderDraftStore";

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

export default function BaselineReviewPage() {
  const params = useParams();
  const locationParam = params?.locationId;
  const locationId =
    typeof locationParam === "string"
      ? locationParam
      : Array.isArray(locationParam)
        ? locationParam[0] ?? ""
        : "";
  const [entries, setEntries] = useState<BaselineCountEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [draftStatus, setDraftStatus] = useState<DraftStatus>(
    DRAFT_STATUS.draft
  );
  const [showArchivedDraft, setShowArchivedDraft] = useState(false);

  const refreshEntries = useCallback(() => {
    setEntries(getBaselineForLocation(locationId));
  }, [locationId]);

  useEffect(() => {
    setLoading(false);
    refreshEntries();
  }, [refreshEntries]);

  useEffect(() => {
    if (!locationId) {
      return;
    }
    setDraftStatus(getOrderDraftStatus(locationId));
  }, [locationId]);

  const locationName = useMemo(() => {
    const named = entries.find((entry) => entry.locationName)?.locationName;
    return named ?? locationId;
  }, [entries, locationId]);

  const isArchivedDraft = draftStatus === DRAFT_STATUS.archived;

  const handleCountChange = (entryId: string, nextValue: number) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId) {
          return entry;
        }
        const updated = {
          ...entry,
          countedUnits: nextValue,
          updatedAt: new Date().toISOString()
        };
        upsertBaselineEntry(updated);
        return updated;
      })
    );
  };

  const handleDownload = () => {
    const csv = exportBaselineCsv(locationId);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `baseline-${locationId}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (!window.confirm("Clear baseline counts for this location?")) {
      return;
    }
    clearBaselineForLocation(locationId);
    setEntries([]);
    setStatusMessage("Baseline cleared for this location.");
  };

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Baseline"
          title={locationName || "Location"}
          subtitle="Review and adjust counted units before export."
        />
      }
    >
      <div className="stock-feedback-region" aria-live="polite">
        {loading ? <LoadingLine label="Working..." /> : null}
        {statusMessage ? (
          <MessagePanel title="Update">{statusMessage}</MessagePanel>
        ) : null}
      </div>

      <Section title="Summary">
        <KeyValueGrid>
          <FieldRow label="Location" value={locationName || "Unknown"} />
          <FieldRow label="Items counted" value={entries.length} />
        </KeyValueGrid>
        <PrimaryActions>
          <button
            type="button"
            className="stock-button stock-button--primary"
            onClick={handleDownload}
            disabled={!entries.length}
          >
            Download CSV
          </button>
          {isArchivedDraft && !showArchivedDraft ? (
            <button
              type="button"
              className="stock-button stock-button--secondary"
              onClick={() => setShowArchivedDraft(true)}
            >
              View archived draft
            </button>
          ) : (
            <ActionLink href={`/baseline/${locationId}/order-draft`}>
              Draft order list
            </ActionLink>
          )}
          <button
            type="button"
            className="stock-button stock-button--secondary"
            onClick={handleClear}
            disabled={!entries.length}
          >
            Clear baseline for this location
          </button>
        </PrimaryActions>
      </Section>

      <Section title="Counts">
        {entries.length === 0 ? (
          <FeedbackCard
            title="No baseline counts"
            message="Scan products to add baseline counts for this location."
          />
        ) : (
          <div className="stock-grid">
            {entries.map((entry) => (
              <Card key={entry.id} title={entry.productName}>
                <KeyValueGrid>
                  <FieldRow label="Barcode" value={entry.barcode} />
                  <FieldRow
                    label="Last updated"
                    value={formatTimestamp(entry.updatedAt)}
                  />
                </KeyValueGrid>
                <div className="stock-form__row">
                  <label className="stock-form__label">
                    Counted units
                    <input
                      className="stock-form__input"
                      type="number"
                      min={0}
                      step={1}
                      value={entry.countedUnits}
                      onChange={(event) =>
                        handleCountChange(
                          entry.id,
                          Number.isNaN(event.target.valueAsNumber)
                            ? entry.countedUnits
                            : Math.max(0, event.target.valueAsNumber)
                        )
                      }
                    />
                  </label>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <PrimaryActions>
        <ActionLink href="/baseline">Back to baseline</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
        <ActionLink href="/products">Products</ActionLink>
        <ActionLink href="/locations">Locations</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
