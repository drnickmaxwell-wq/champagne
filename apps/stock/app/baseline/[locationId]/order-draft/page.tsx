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
import {
  getBestSupplierPrice,
  loadSupplierStore,
  type Supplier,
  type SupplierProduct
} from "../../../suppliers/localSuppliers";

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
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProduct[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Record<string, string>>(
    {}
  );

  const refreshData = useCallback(() => {
    setEntries(getBaselineForLocation(locationId));
    setLotCounts(buildLotCounts(loadLocalLots(), locationId));
    const supplierStore = loadSupplierStore();
    setSuppliers(supplierStore.suppliers);
    setSupplierProducts(supplierStore.supplierProducts);
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

  useEffect(() => {
    setSelectedSuppliers((prev) => {
      const next: Record<string, string> = { ...prev };
      for (const row of rows) {
        const productId = row.entry.productId;
        if (next[productId]) {
          continue;
        }
        const best = getBestSupplierPrice(productId, supplierProducts);
        if (best) {
          next[productId] = best.supplierId;
        }
      }
      return next;
    });
  }, [rows, supplierProducts]);

  const handleThresholdChange = (value: number) => {
    setThreshold(normalizeIntegerInput(value, 0));
  };

  const handleSuggestedChange = (entryId: string, value: number) => {
    setSuggestedOrders((prev) => ({
      ...prev,
      [entryId]: clampNonNegative(normalizeIntegerInput(value, 0))
    }));
  };

  const handleSupplierChange = (productId: string, supplierId: string) => {
    setSelectedSuppliers((prev) => ({
      ...prev,
      [productId]: supplierId
    }));
  };

  const formatCurrency = useCallback((valuePence: number) => {
    const formatter = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP"
    });
    return formatter.format(valuePence / 100);
  }, []);

  const supplierById = useMemo(() => {
    const map = new Map<string, Supplier>();
    suppliers.forEach((supplier) => {
      map.set(supplier.id, supplier);
    });
    return map;
  }, [suppliers]);

  const supplierProductLookup = useMemo(() => {
    const map = new Map<string, SupplierProduct>();
    supplierProducts.forEach((product) => {
      map.set(`${product.supplierId}:${product.productId}`, product);
    });
    return map;
  }, [supplierProducts]);

  const supplierOptionsByProduct = useMemo(() => {
    const map = new Map<string, SupplierProduct[]>();
    supplierProducts.forEach((product) => {
      const list = map.get(product.productId) ?? [];
      list.push(product);
      map.set(product.productId, list);
    });
    return map;
  }, [supplierProducts]);

  const totalsBySupplier = useMemo(() => {
    const totals = new Map<
      string,
      { supplierId: string; supplierName: string; totalPence: number; lineCount: number }
    >();
    rows.forEach((row) => {
      const productId = row.entry.productId;
      const suggested = suggestedOrders[row.entry.id] ?? Math.abs(row.variance);
      const supplierId = selectedSuppliers[productId];
      if (!supplierId) {
        return;
      }
      const pricing = supplierProductLookup.get(`${supplierId}:${productId}`);
      if (!pricing) {
        return;
      }
      const current = totals.get(supplierId) ?? {
        supplierId,
        supplierName: supplierById.get(supplierId)?.name ?? supplierId,
        totalPence: 0,
        lineCount: 0
      };
      totals.set(supplierId, {
        ...current,
        totalPence: current.totalPence + pricing.unitPricePence * suggested,
        lineCount: current.lineCount + 1
      });
    });
    return Array.from(totals.values()).sort((a, b) =>
      a.supplierName.localeCompare(b.supplierName)
    );
  }, [rows, selectedSuppliers, supplierProductLookup, suggestedOrders, supplierById]);

  const orderSubtotalPence = useMemo(() => {
    return rows.reduce((total, row) => {
      const productId = row.entry.productId;
      const supplierId = selectedSuppliers[productId];
      if (!supplierId) {
        return total;
      }
      const pricing = supplierProductLookup.get(`${supplierId}:${productId}`);
      if (!pricing) {
        return total;
      }
      const suggested = suggestedOrders[row.entry.id] ?? Math.abs(row.variance);
      return total + pricing.unitPricePence * suggested;
    }, 0);
  }, [rows, selectedSuppliers, supplierProductLookup, suggestedOrders]);

  const handleExport = () => {
    const rowsForCsv = rows.map((row) => {
      const suggested = suggestedOrders[row.entry.id] ?? Math.abs(row.variance);
      const best = getBestSupplierPrice(row.entry.productId, supplierProducts);
      const selectedSupplierId =
        selectedSuppliers[row.entry.productId] ?? best?.supplierId ?? "";
      const selectedSupplier = selectedSupplierId
        ? supplierById.get(selectedSupplierId)
        : undefined;
      const selectedPricing = selectedSupplierId
        ? supplierProductLookup.get(
            `${selectedSupplierId}:${row.entry.productId}`
          )
        : undefined;
      const lineTotalPence = selectedPricing
        ? selectedPricing.unitPricePence * suggested
        : 0;
      return {
        productName: row.entry.productName,
        baselineCount: row.entry.countedUnits,
        estimatedStock: row.estimatedStock,
        variance: row.variance,
        suggestedOrderQty: suggested,
        bestSupplierId: best?.supplierId ?? "",
        bestSupplierName: best ? supplierById.get(best.supplierId)?.name ?? "" : "",
        bestUnitPricePence: best?.unitPricePence ?? "",
        selectedSupplierId,
        selectedSupplierName: selectedSupplier?.name ?? "",
        selectedUnitPricePence: selectedPricing?.unitPricePence ?? "",
        lineTotalPence
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
        "suggestedOrderQty",
        "bestSupplierId",
        "bestSupplierName",
        "bestUnitPricePence",
        "selectedSupplierId",
        "selectedSupplierName",
        "selectedUnitPricePence",
        "lineTotalPence"
      ],
      ...rowsForCsv.map((row) => [
        locationId,
        locationName ?? "",
        row.productName,
        row.baselineCount,
        row.estimatedStock,
        row.variance,
        row.suggestedOrderQty,
        row.bestSupplierId,
        row.bestSupplierName,
        row.bestUnitPricePence,
        row.selectedSupplierId,
        row.selectedSupplierName,
        row.selectedUnitPricePence,
        row.lineTotalPence
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
          <FieldRow
            label="Order subtotal"
            value={
              orderSubtotalPence > 0 ? formatCurrency(orderSubtotalPence) : "—"
            }
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
              <span role="columnheader">Best unit price</span>
              <span role="columnheader">Selected supplier</span>
              <span role="columnheader">Line total</span>
            </div>
            {rows.map((row) => {
              const suggested =
                suggestedOrders[row.entry.id] ?? Math.abs(row.variance);
              const isFlagged = row.variance <= threshold;
              const best = getBestSupplierPrice(row.entry.productId, supplierProducts);
              const bestSupplierName = best
                ? supplierById.get(best.supplierId)?.name ?? "Unknown"
                : "—";
              const productSuppliers =
                supplierOptionsByProduct.get(row.entry.productId) ?? [];
              const selectedSupplierId = selectedSuppliers[row.entry.productId] ?? "";
              const selectedSupplierName = selectedSupplierId
                ? supplierById.get(selectedSupplierId)?.name ?? selectedSupplierId
                : "—";
              const selectedPricing = selectedSupplierId
                ? supplierProductLookup.get(
                    `${selectedSupplierId}:${row.entry.productId}`
                  )
                : undefined;
              const lineTotal =
                selectedPricing ? selectedPricing.unitPricePence * suggested : null;
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
                  <div role="cell" className="stock-order-table__cell">
                    {best ? (
                      <>
                        <strong>{formatCurrency(best.unitPricePence)}</strong>
                        <span className="stock-order-table__meta">{bestSupplierName}</span>
                      </>
                    ) : (
                      <span className="stock-order-table__meta">No pricing</span>
                    )}
                  </div>
                  <div role="cell" className="stock-order-table__cell">
                    {productSuppliers.length === 0 ? (
                      <span className="stock-order-table__meta">No suppliers</span>
                    ) : (
                      <select
                        className="stock-form__input stock-order-table__input"
                        value={selectedSupplierId}
                        onChange={(event) =>
                          handleSupplierChange(row.entry.productId, event.target.value)
                        }
                      >
                        <option value="">Select supplier</option>
                        {productSuppliers.map((product) => {
                          const supplierName =
                            supplierById.get(product.supplierId)?.name ??
                            product.supplierId;
                          return (
                            <option key={product.supplierId} value={product.supplierId}>
                              {supplierName}
                            </option>
                          );
                        })}
                      </select>
                    )}
                    {selectedSupplierId ? (
                      <span className="stock-order-table__meta">
                        {selectedSupplierName}
                      </span>
                    ) : null}
                  </div>
                  <div role="cell" className="stock-order-table__cell">
                    {lineTotal !== null ? (
                      <strong>{formatCurrency(lineTotal)}</strong>
                    ) : (
                      <span className="stock-order-table__meta">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Supplier rollup">
        {totalsBySupplier.length === 0 ? (
          <FeedbackCard
            title="No supplier totals yet"
            message="Select suppliers on each line to see totals."
          />
        ) : (
          <div className="stock-card">
            <div className="stock-card__body">
              <ul className="stock-list">
                {totalsBySupplier.map((supplierTotal) => (
                  <li key={supplierTotal.supplierId}>
                    <strong>{supplierTotal.supplierName}</strong> —{" "}
                    {formatCurrency(supplierTotal.totalPence)} ({supplierTotal.lineCount}{" "}
                    lines)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Section>

      <PrimaryActions>
        <ActionLink href={`/baseline/${locationId}`}>
          Back to baseline review
        </ActionLink>
        <ActionLink href="/baseline">Back to baseline</ActionLink>
        <ActionLink href="/suppliers">Suppliers</ActionLink>
        <ActionLink href="/scan">Scan</ActionLink>
      </PrimaryActions>
    </PageShell>
  );
}
