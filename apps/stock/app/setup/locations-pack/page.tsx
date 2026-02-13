"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import type { Location } from "@champagne/stock-shared";
import { LocationSchema } from "@champagne/stock-shared";
import PageShell from "../../components/ui/PageShell";
import FeedbackCard from "../../components/ui/FeedbackCard";
import { ActionLink, PrimaryActions } from "../../components/ui/PrimaryActions";
import { ScreenHeader, Section } from "../../components/ui/ScreenKit";
import { fetchLocations } from "../../lib/ops-api";
import { loadLocationNotes } from "../../lib/localStores/locationNotes";

export default function LocationsPackPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    const result = await fetchLocations();
    setLoading(false);
    if (!result.ok) {
      setErrorMessage("Unable to load locations for print pack.");
      return;
    }
    const parsed = LocationSchema.array().safeParse(result.data);
    if (!parsed.success) {
      setErrorMessage("Unexpected locations response.");
      return;
    }
    setLocations(parsed.data);
    setNotes(loadLocationNotes());
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Setup"
          title="Location QR setup pack"
          subtitle="Print all location labels for cupboards and surgeries."
        />
      }
    >
      <PrimaryActions>
        <button
          type="button"
          className="stock-button stock-button--primary"
          onClick={() => window.print()}
          disabled={loading || locations.length === 0}
        >
          Print pack
        </button>
        <ActionLink href="/locations">Back to locations</ActionLink>
        <ActionLink href="/setup">Back to setup</ActionLink>
      </PrimaryActions>

      <Section title="Pack preview">
        {errorMessage ? <FeedbackCard title="Error" message={errorMessage} role="alert" /> : null}
        {loading ? <FeedbackCard title="Loading" message="Preparing print pack..." /> : null}
        {!loading && locations.length === 0 && !errorMessage ? (
          <FeedbackCard title="No locations" message="Add a location first, then print the pack." />
        ) : null}
        <div className="stock-pack-grid" data-print-pack="true">
          {locations.map((location) => (
            <div key={location.id} className="stock-pack-card">
              <QRCodeCanvas value={location.id} size={200} level="M" includeMargin />
              <p className="stock-pack-card__name">{location.name}</p>
              <p className="stock-pack-card__id">{location.id}</p>
              {notes[location.id] ? (
                <p className="stock-pack-card__note">{notes[location.id]}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      <PrimaryActions>
        <Link href="/home" className="stock-action-link stock-action-link--secondary">
          Home
        </Link>
      </PrimaryActions>
    </PageShell>
  );
}
