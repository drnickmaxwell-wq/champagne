"use client";

import { FieldRow } from "../components/ui/FieldList";
import { PrimaryActions } from "../components/ui/PrimaryActions";
import { KeyValueGrid, Section } from "../components/ui/ScreenKit";

type SessionSummaryProps = {
  received: number;
  withdrawn: number;
  locationCount: number;
  currentLocationName: string | null;
  onEndSession: () => void;
};

export default function SessionSummary({
  received,
  withdrawn,
  locationCount,
  currentLocationName,
  onEndSession
}: SessionSummaryProps) {
  const currentLocationLabel =
    currentLocationName?.trim().length ? currentLocationName : "not set";
  return (
    <Section title="Session summary">
      <div className="stock-session-summary">
        <p className="stock-session-summary__eyebrow">This session</p>
        <KeyValueGrid>
          <FieldRow label="Received" value={received} />
          <FieldRow label="Withdrawn" value={withdrawn} />
          <FieldRow label="Current location" value={currentLocationLabel} />
          <FieldRow label="Locations touched" value={locationCount} />
        </KeyValueGrid>
        <PrimaryActions>
          <button
            type="button"
            className="stock-button stock-button--secondary"
            onClick={onEndSession}
          >
            End session
          </button>
        </PrimaryActions>
      </div>
    </Section>
  );
}
