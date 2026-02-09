"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import FeedbackCard from "../../../components/ui/FeedbackCard";
import LoadingLine from "../../../components/ui/LoadingLine";
import PageShell from "../../../components/ui/PageShell";
import { ActionLink, PrimaryActions } from "../../../components/ui/PrimaryActions";
import { FieldRow } from "../../../components/ui/FieldList";
import { ScreenHeader, Section, KeyValueGrid } from "../../../components/ui/ScreenKit";
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
  estimatedStock: number;
  variance: number;
};

const buildLotCounts = (lots: LocalStockLot[], locationId: string) => {
  const counts: Record<string, number> = {};
  for (const lot of lots) {
    if (lot.locationId !== locationId) {
      continue;
    }
    const current = counts[lot.productId] ?? 0;
    counts[lot.productId] = current + 1;
  }
  return counts;
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
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(0);
  const [suggestedOrders, setSuggestedOrders] = useState<Record<string, number>>(
    {}
  );

  const refreshData = useCallback(() => {
    setEntries(getBaselineForLocation(locationId));
    setLotCounts(buildLotCounts(loadLocalLots(), locationId));
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
      const estimatedStock = lotCounts[entry.productId] ?? 0;
      return {
        entry,
        estimatedStock,
        variance: entry.countedUnits - estimatedStock
      };
    });
  }, [entries, lotCounts]);

  useEffect(() => {
    setSuggestedOrders((prev) => {
      const next: Record<string, number> = {};
      for (const row of rows) {
        const existing = prev[row.entry.id];
        const fallback = Math.abs(row.variance);
        const normalized =
          typeof existing === "number" && Number.isFinite(existing)
            ? Math.max(0, Math.floor(existing))
            : fallback;
        next[row.entry.id] = normalized;
      }
      return next;
    });
  }, [rows]);

  const handleThresholdChange = (value: number) => {
    setThreshold(normalizeIntegerInput(value, 0));
  };

  const handleSuggestedChange = (entryId: string, value: number) => {
    setSuggestedOrders((prev) => ({
      ...prev,
      [entryId]: clampNonNegative(normalizeIntegerInput(value, 0))
    }));
  };

  const handleExport = () => {
    const rowsForCsv = rows.map((row) => {
      const suggested = suggestedOrders[row.entry.id] ?? Math.abs(row.variance);
      return {
        productName: row.entry.productName,
        baselineCount: row.entry.countedUnits,
        estimatedStock: row.estimatedStock,
        variance: row.variance,
        suggestedOrderQty: suggested
      };
    });
    const csvRows = [
      [
        "locationId",
        "locationName",
        "product",
        "baselineCount",
        "estimatedCurrentStock",
        "variance",
        "suggestedOrderQty"
      ],
      ...rowsForCsv.map((row) => [
        locationId,
        locationName ?? "",
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
          subtitle="Compare baseline counts with locally inferred stock to draft a suggested order."
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
          <FieldRow
            label="Threshold"
            value={`Flag when variance ≤ ${threshold}`}
          />
        </KeyValueGrid>
        <PrimaryActions>
          <button
            type="button"
            className="stock-button stock-button--primary"
            onClick={handleExport}
            disabled={rows.length === 0}
          >
            Export CSV
          </button>
        </PrimaryActions>
      </Section>

      <Section title="Draft order list">
        <div className="stock-form__row">
          <label className="stock-form__label" htmlFor="variance-threshold">
            Variance threshold
            <input
              id="variance-threshold"
              className="stock-form__input"
              type="number"
              step={1}
              value={threshold}
              onChange={(event) =>
                handleThresholdChange(event.target.valueAsNumber)
              }
            />
          </label>
        </div>
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
              <span role="columnheader">Estimated current stock</span>
              <span role="columnheader">Variance</span>
              <span role="columnheader">Suggested order qty</span>
            </div>
            {rows.map((row) => {
              const suggested =
                suggestedOrders[row.entry.id] ?? Math.abs(row.variance);
              const isFlagged = row.variance <= threshold;
              return (
                <div
                  key={row.entry.id}
                  className={`stock-order-table__row${isFlagged ? " stock-order-table__row--flagged" : ""}`}
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
                    {row.estimatedStock}
                  </div>
                  <div role="cell" className="stock-order-table__cell">
                    <span>{row.variance}</span>
                    {isFlagged ? (
                      <span className="stock-order-table__flag">
                        Flagged
                      </span>
                    ) : null}
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
        <ActionLink href={`/baseline/${locationId}`}>
          Back to baseline review
        </ActionLink>
        <ActionLink href="/baseline">Back to baseline</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
