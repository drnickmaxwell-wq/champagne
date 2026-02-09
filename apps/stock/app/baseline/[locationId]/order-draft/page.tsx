"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import FeedbackCard from "../../../components/ui/FeedbackCard";
import LoadingLine from "../../../components/ui/LoadingLine";
import PageShell from "../../../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../../../components/ui/PrimaryActions";
import { FieldRow } from "../../../components/ui/FieldList";
import {
  ScreenHeader,
  Section,
  KeyValueGrid
} from "../../../components/ui/ScreenKit";
import {
  getBaselineForLocation,
  type BaselineCountEntry
} from "../../localBaseline";
import { loadLocalLots, type LocalStockLot } from "../../../stockLots/localLots";

const escapeCsvValue = (value: string | number | undefined) => {
  if (value === undefined || value === null) {
    return "";
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

type DraftRow = {
  entry: BaselineCountEntry;
  estimatedStock: number | null;
  variance: number | null;
};

type LotSummary = {
  counts: Record<string, number>;
  productsWithLots: Set<string>;
};

const buildLotCounts = (lots: LocalStockLot[], locationId: string): LotSummary => {
  const counts: Record<string, number> = {};
  const productsWithLots = new Set<string>();
  for (const lot of lots) {
    if (lot.locationId !== locationId) {
      continue;
    }
    productsWithLots.add(lot.productId);
    const current = counts[lot.productId] ?? 0;
    counts[lot.productId] = current + 1;
  }
  return { counts, productsWithLots };
};

const normalizeIntegerInput = (value: number, fallback: number) => {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.floor(value);
};

const clampNonNegative = (value: number) => {
  return Math.max(0, value);
};

export default function OrderDraftPage() {
  const params = useParams();
  const locationParam = params?.locationId;
  const locationId =
    typeof locationParam === "string"
      ? locationParam
      : Array.isArray(locationParam)
        ? locationParam[0] ?? ""
        : "";
  const [entries, setEntries] = useState<BaselineCountEntry[]>([]);
  const [lotCounts, setLotCounts] = useState<Record<string, number>>({});
  const [productsWithLots, setProductsWithLots] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [suggestedOrders, setSuggestedOrders] = useState<Record<string, number>>(
    {}
  );

  const refreshData = useCallback(() => {
    setEntries(getBaselineForLocation(locationId));
    const lotSummary = buildLotCounts(loadLocalLots(), locationId);
    setLotCounts(lotSummary.counts);
    setProductsWithLots(lotSummary.productsWithLots);
  }, [locationId]);

  useEffect(() => {
    setLoading(false);
    refreshData();
  }, [refreshData]);

  const locationName = useMemo(() => {
    const named = entries.find((entry) => entry.locationName)?.locationName;
    return named ?? locationId;
  }, [entries, locationId]);

  const rows = useMemo<DraftRow[]>(() => {
    return entries.map((entry) => {
      const estimatedStock = productsWithLots.has(entry.productId)
        ? lotCounts[entry.productId] ?? 0
        : null;
      const variance =
        estimatedStock === null ? null : entry.countedUnits - estimatedStock;
      return {
        entry,
        estimatedStock,
        variance
      };
    });
  }, [entries, lotCounts, productsWithLots]);

  useEffect(() => {
    setSuggestedOrders((prev) => {
      const next: Record<string, number> = {};
      for (const row of rows) {
        const existing = prev[row.entry.id];
        const fallback =
          row.variance !== null && row.variance > 0 ? row.variance : 0;
        const normalized =
          typeof existing === "number" && Number.isFinite(existing)
            ? Math.max(0, Math.floor(existing))
            : fallback;
        next[row.entry.id] = normalized;
      }
      return next;
    });
  }, [rows]);

  const handleSuggestedChange = (entryId: string, value: number) => {
    setSuggestedOrders((prev) => ({
      ...prev,
      [entryId]: clampNonNegative(normalizeIntegerInput(value, 0))
    }));
  };

  const handleExport = () => {
    const rowsForCsv = rows.map((row) => {
      const suggested = suggestedOrders[row.entry.id] ?? 0;
      return {
        productId: row.entry.productId,
        productName: row.entry.productName,
        baselineCount: row.entry.countedUnits,
        estimatedStock: row.estimatedStock ?? "Unknown",
        variance: row.variance ?? "Unknown",
        suggestedOrderQty: suggested
      };
    });
    const csvRows = [
      [
        "productId",
        "productName",
        "baselineCount",
        "currentEstimate",
        "variance",
        "suggestedQty"
      ],
      ...rowsForCsv.map((row) => [
        row.productId,
        row.productName,
        row.baselineCount,
        row.estimatedStock,
        row.variance,
        row.suggestedOrderQty
      ])
    ];
    const csv = csvRows
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `order-draft-${locationId}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell
      header={
        <ScreenHeader
          eyebrow="Order draft"
          title={locationName || "Location"}
          subtitle="Compare baseline counts with local stock estimates to draft a suggested order."
        />
      }
    >
      <div className="stock-feedback-region" aria-live="polite">
        {loading ? <LoadingLine label="Working..." /> : null}
      </div>

      <Section title="Summary">
        <KeyValueGrid>
          <FieldRow label="Location" value={locationName || "Unknown"} />
          <FieldRow label="Baseline items" value={entries.length} />
        </KeyValueGrid>
        <PrimaryActions>
          <button
            type="button"
            className="stock-button stock-button--primary"
            onClick={handleExport}
            disabled={rows.length === 0}
          >
            Download CSV
          </button>
        </PrimaryActions>
      </Section>

      <Section title="Draft order list">
        {rows.length === 0 ? (
          <FeedbackCard
            title="No baseline counts"
            message="Scan products to add baseline counts for this location."
          />
        ) : (
          <div className="stock-order-table" role="table" aria-label="Draft order">
            <div className="stock-order-table__header" role="row">
              <span role="columnheader">Product</span>
              <span role="columnheader">Baseline count</span>
              <span role="columnheader">Current estimate</span>
              <span role="columnheader">Variance</span>
              <span role="columnheader">Suggested order qty</span>
            </div>
            {rows.map((row) => {
              const suggested = suggestedOrders[row.entry.id] ?? 0;
              const varianceLabel =
                row.variance === null ? "—" : String(row.variance);
              const estimatedLabel =
                row.estimatedStock === null
                  ? "Unknown"
                  : String(row.estimatedStock);
              return (
                <div
                  key={row.entry.id}
                  className="stock-order-table__row"
                  role="row"
                >
                  <div role="cell" className="stock-order-table__cell">
                    <strong>{row.entry.productName}</strong>
                    <span className="stock-order-table__meta">
                      {row.entry.barcode}
                    </span>
                  </div>
                  <div role="cell" className="stock-order-table__cell">
                    {row.entry.countedUnits}
                  </div>
                  <div role="cell" className="stock-order-table__cell">
                    {estimatedLabel}
                  </div>
                  <div role="cell" className="stock-order-table__cell">
                    <span>{varianceLabel}</span>
                  </div>
                  <div role="cell" className="stock-order-table__cell">
                    <input
                      className="stock-form__input stock-order-table__input"
                      type="number"
                      min={0}
                      step={1}
                      value={suggested}
                      onChange={(event) =>
                        handleSuggestedChange(
                          row.entry.id,
                          event.target.valueAsNumber
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <PrimaryActions>
        <ActionLink href={`/baseline/${locationId}`}>Back to review</ActionLink>
        <ActionLink href="/baseline">Back to baseline</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
