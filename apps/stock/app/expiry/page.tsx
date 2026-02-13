"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Location } from "@champagne/stock-shared";
import { LocationSchema } from "@champagne/stock-shared";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import FeedbackCard from "../components/ui/FeedbackCard";
import RoleModeSwitch from "../components/ui/RoleModeSwitch";
import { ScreenHeader, Section } from "../components/ui/ScreenKit";
import { PrimaryActions } from "../components/ui/PrimaryActions";
import { fetchLocations } from "../lib/ops-api";
import {
  loadExpiryAcknowledgements,
  setAcknowledged
} from "../lib/localStores/expiryAcknowledgements";
import { getExpiryStatus, getLotsNearExpiry } from "../stockLots/localLots";

const formatStatus = (status: string) => {
  if (status === "expired") return "Expired";
  if (status === "near-expiry") return "Expiring soon";
  if (status === "ok") return "OK";
  return "Check date";
};

export default function ExpiryPage() {
  const [locationsById, setLocationsById] = useState<Record<string, string>>({});
  const [acks, setAcks] = useState<Record<string, boolean>>({});

  const expiringLots = useMemo(() => getLotsNearExpiry(30), []);

  useEffect(() => {
    setAcks(loadExpiryAcknowledgements());
  }, []);

  useEffect(() => {
    const load = async () => {
      const result = await fetchLocations();
      if (!result.ok) return;
      const parsed = LocationSchema.array().safeParse(result.data);
      if (!parsed.success) return;
      const map: Record<string, string> = {};
      parsed.data.forEach((location: Location) => {
        map[location.id] = location.name;
      });
      setLocationsById(map);
    };
    void load();
  }, []);

  const groupedLots = useMemo(() => {
    const groups = new Map<string, typeof expiringLots>();
    expiringLots.forEach((lot) => {
      const key = lot.locationId ?? "unassigned";
      const current = groups.get(key) ?? [];
      current.push(lot);
      groups.set(key, current);
    });
    return Array.from(groups.entries());
  }, [expiringLots]);

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Stock"
          title="Expiry"
          subtitle="Items expiring soon, grouped by location."
          actions={<RoleModeSwitch />}
        />
      }
    >
      <Section title="Expiring soon">
        {expiringLots.length === 0 ? (
          <FeedbackCard title="No expiry warnings" message="Nothing expiring in the next 30 days." />
        ) : (
          <div className="stock-grid">
            {groupedLots.map(([locationId, lots]) => {
              const locationName =
                locationId === "unassigned"
                  ? "No location assigned"
                  : locationsById[locationId] ?? locationId;

              return (
                <Card key={locationId} title={locationName}>
                  <div className="stock-expiry-group">
                    {lots.map((lot) => {
                      const status = getExpiryStatus(lot.expiryDate);
                      const ackKey = `${lot.id}::${lot.expiryDate}`;
                      const acknowledged = Boolean(acks[ackKey]);
                      return (
                        <div
                          key={lot.id}
                          className={`stock-expiry-item${acknowledged ? " stock-expiry-item--ack" : ""}`}
                        >
                          <div className="stock-fieldlist">
                            <div className="stock-field-row">
                              <span className="stock-field-label">Batch</span>
                              <span className="stock-field-value">{lot.batchNumber || "Not recorded"}</span>
                            </div>
                            <div className="stock-field-row">
                              <span className="stock-field-label">Expiry date</span>
                              <span className="stock-field-value">{lot.expiryDate || "Not recorded"}</span>
                            </div>
                            <div className="stock-field-row">
                              <span className="stock-field-label">Status</span>
                              <span className="stock-field-value">{formatStatus(status)}</span>
                            </div>
                            <div className="stock-field-row">
                              <span className="stock-field-label">Barcode</span>
                              <span className="stock-field-value">{lot.barcode}</span>
                            </div>
                          </div>
                          <label className="stock-expiry-item__ack">
                            <input
                              type="checkbox"
                              checked={acknowledged}
                              onChange={(event) =>
                                setAcks(setAcknowledged(lot.id, lot.expiryDate, event.target.checked))
                              }
                            />
                            Acknowledge
                          </label>
                        </div>
                      );
                    })}
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
        <Link href="/home" className="stock-action-link stock-action-link--secondary">
          Back to home
        </Link>
      </PrimaryActions>
    </PageShell>
  );
}
