"use client";

import { useMemo } from "react";
import Link from "next/link";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import FeedbackCard from "../components/ui/FeedbackCard";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";
import { PrimaryActions } from "../components/ui/PrimaryActions";
import { getExpiryStatus, getLotsNearExpiry } from "../stockLots/localLots";

const formatStatus = (status: string) => {
  if (status === "expired") {
    return "Expired";
  }
  if (status === "near-expiry") {
    return "Expiring soon";
  }
  if (status === "ok") {
    return "OK";
  }
  return "Check date";
};

export default function ExpiryPage() {
  const expiringLots = useMemo(() => getLotsNearExpiry(30), []);

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Expiry"
          subtitle="Items expiring soon, plus anything missing a clear date."
        />
      }
    >
      <Section title="Expiring soon">
        {expiringLots.length === 0 ? (
          <FeedbackCard
            title="No expiry warnings"
            message="Nothing expiring in the next 30 days."
          />
        ) : (
          <div className="stock-grid">
            {expiringLots.map((lot) => {
              const status = getExpiryStatus(lot.expiryDate);
              return (
                <Card key={lot.id} title={lot.batchNumber || "Batch"}>
                  <div className="stock-fieldlist">
                    <div className="stock-field-row">
                      <span className="stock-field-label">Expiry date</span>
                      <span className="stock-field-value">
                        {lot.expiryDate || "Not recorded"}
                      </span>
                    </div>
                    <div className="stock-field-row">
                      <span className="stock-field-label">Status</span>
                      <span className="stock-field-value">
                        {formatStatus(status)}
                      </span>
                    </div>
                    <div className="stock-field-row">
                      <span className="stock-field-label">Barcode</span>
                      <span className="stock-field-value">{lot.barcode}</span>
                    </div>
                    {lot.locationId ? (
                      <div className="stock-field-row">
                        <span className="stock-field-label">Location</span>
                        <span className="stock-field-value">
                          {lot.locationId}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
      <PrimaryActions>
        <Link href="/scan" className="stock-action-link">
          Scan again
        </Link>
        <Link href="/" className="stock-action-link stock-action-link--secondary">
          Back to home
        </Link>
      </PrimaryActions>
    </PageShell>
  );
}
