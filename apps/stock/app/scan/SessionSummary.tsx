"use client";

import { FieldRow } from "../components/ui/FieldList";
import { PrimaryActions } from "../components/ui/PrimaryActions";
import { KeyValueGrid, Section } from "../components/ui/ScreenKit";

type SessionSummaryProps = {
  received: number;
  withdrawn: number;
  locationCount: number;
  currentLocationName: string | null;
  expiringCount?: number;
  expiringPreview?: {
    id: string;
    label: string;
    expiryDate: string;
    statusLabel: string;
  }[];
  onEndSession: () => void;
};

export default function SessionSummary({
  received,
  withdrawn,
  locationCount,
  currentLocationName,
  expiringCount = 0,
  expiringPreview = [],
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
          <FieldRow label="Expiring soon" value={expiringCount} />
        </KeyValueGrid>
        {expiringPreview.length ? (
          <div className="stock-session-summary__expiring">
            <p className="stock-session-summary__eyebrow">Expiring soon</p>
            <ul>
              {expiringPreview.map((lot) => (
                <li key={lot.id}>
                  {lot.label} — {lot.expiryDate} ({lot.statusLabel})
                </li>
              ))}
            </ul>
          </div>
        ) : null}
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
