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
  buildBaselineSource,
  buildBaselineVarianceRowsFromLots,
  startBaselineDraft,
  type BaselineDraft
} from "../../baselineDraft";
import {
  getBaselineForLocation,
  type BaselineCountEntry
} from "../../localBaseline";
import { loadLocalLots, type LocalStockLot } from "../../../stockLots/localLots";
import {
  computeVarianceConfidence,
  type VarianceConfidence,
  type VarianceEstimateSource
} from "../../varianceConfidence";
import {
  loadSupplierStore,
  type Supplier,
  type SupplierProductLink,
  type DraftLineSupplierMeta
} from "../../../suppliers/localSuppliers";
import {
  canEditDraft,
  DRAFT_STATUS,
  DRAFT_STATUS_ACTION,
  transitionDraftStatus,
  type DraftStatus
} from "./draftStatus";
import { loadLocalBarcodeRegistry, type LocalProduct } from "../../../scan/localRegistry";
import { buildOrderDraftCsv, type CsvRow } from "./csv";
import { buildOrderDraftExport, type OrderDraftExportLineItem } from "./export";

type DraftRow = {
  entry: BaselineCountEntry;
  estimatedStock: number;
  variance: number;
  confidence: VarianceConfidence;
};

type LotCounts = {
  counts: Record<string, number>;
  lotsByProduct: Record<string, LocalStockLot[]>;
};

const buildLotCounts = (lots: LocalStockLot[], locationId: string): LotCounts => {
  const counts: Record<string, number> = {};
  const lotsByProduct: Record<string, LocalStockLot[]> = {};
  for (const lot of lots) {
    if (lot.locationId !== locationId) {
      continue;
    }
    const current = counts[lot.productId] ?? 0;
    counts[lot.productId] = current + 1;
    if (!lotsByProduct[lot.productId]) {
      lotsByProduct[lot.productId] = [];
    }
    lotsByProduct[lot.productId].push(lot);
  }
  return { counts, lotsByProduct };
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

const buildPackKey = (link: SupplierProductLink) => {
  return `${link.packSize}::${encodeURIComponent(link.packLabel)}`;
};

const parsePackKey = (value: string) => {
  const [sizeRaw, labelRaw] = value.split("::");
  if (!sizeRaw || !labelRaw) {
    return null;
  }
  const size = Number.parseInt(sizeRaw, 10);
  if (!Number.isFinite(size) || size < 1) {
    return null;
  }
  const label = decodeURIComponent(labelRaw);
  if (!label.trim()) {
    return null;
  }
  return { packSize: size, packLabel: label };
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
  const [lotsByProduct, setLotsByProduct] = useState<
    Record<string, LocalStockLot[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(0);
  const [suggestedOrders, setSuggestedOrders] = useState<Record<string, number>>(
    {}
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierProducts, setSupplierProducts] = useState<SupplierProductLink[]>(
    []
  );
  const [lineSupplierMeta, setLineSupplierMeta] = useState<
    Record<string, DraftLineSupplierMeta>
  >({});
  const [draftStatus, setDraftStatus] = useState<DraftStatus>(
    DRAFT_STATUS.draft
  );
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [baselineDraft, setBaselineDraft] = useState<BaselineDraft | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setEntries(getBaselineForLocation(locationId));
    const { counts, lotsByProduct: lotsLookup } = buildLotCounts(
      loadLocalLots(),
      locationId
    );
    setLotCounts(counts);
    setLotsByProduct(lotsLookup);
    const supplierStore = loadSupplierStore();
    setSuppliers(supplierStore.suppliers);
    setSupplierProducts(supplierStore.supplierProducts);
    const registry = loadLocalBarcodeRegistry();
    setProducts(registry.products);
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
      const lotsForProduct = lotsByProduct[entry.productId] ?? [];
      const hasEstimate = Number.isFinite(estimatedStock);
      const estimateSource: VarianceEstimateSource =
        lotsForProduct.length > 0 ? "lots" : "unknown";
      return {
        entry,
        estimatedStock,
        variance: entry.countedUnits - estimatedStock,
        confidence: computeVarianceConfidence({
          baselineExists: true,
          estimateSource,
          hasCurrentEstimate: hasEstimate,
          lots: lotsForProduct
        })
      };
    });
  }, [entries, lotCounts, lotsByProduct]);

  const varianceRows = useMemo(() => {
    return buildBaselineVarianceRowsFromLots(entries, lotsByProduct);
  }, [entries, lotsByProduct]);

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
    if (!canEditDraft(draftStatus)) {
      return;
    }
    setThreshold(normalizeIntegerInput(value, 0));
  };

  const handleSuggestedChange = (entryId: string, value: number) => {
    if (!canEditDraft(draftStatus)) {
      return;
    }
    setSuggestedOrders((prev) => ({
      ...prev,
      [entryId]: clampNonNegative(normalizeIntegerInput(value, 0))
    }));
  };

  const handleSupplierChange = (productId: string, supplierId: string) => {
    if (!canEditDraft(draftStatus)) {
      return;
    }
    setLineSupplierMeta((prev) => ({
      ...prev,
      [productId]: supplierId ? { supplierId } : {}
    }));
  };

  const handlePackChange = (productId: string, packKey: string) => {
    if (!canEditDraft(draftStatus)) {
      return;
    }
    if (!packKey) {
      setLineSupplierMeta((prev) => {
        const current = prev[productId];
        if (!current) {
          return prev;
        }
        return {
          ...prev,
          [productId]: { supplierId: current.supplierId }
        };
      });
      return;
    }
    const parsed = parsePackKey(packKey);
    if (!parsed) {
      return;
    }
    setLineSupplierMeta((prev) => ({
      ...prev,
      [productId]: {
        supplierId: prev[productId]?.supplierId,
        packLabel: parsed.packLabel,
        packSize: parsed.packSize
      }
    }));
  };

  const handleFreezeConfirm = () => {
    if (
      !window.confirm(
        "Freezing prevents accidental changes. You can unfreeze later."
      )
    ) {
      return;
    }
    setDraftStatus((current) =>
      transitionDraftStatus(current, { type: DRAFT_STATUS_ACTION.freeze })
    );
  };

  const handleCreateBaselineDraft = () => {
    const confirmed = window.confirm(
      "This creates a draft based on baseline differences. You can edit before ordering."
    );
    const source = buildBaselineSource(entries, locationId);
    const draft = startBaselineDraft(confirmed, source, varianceRows);
    if (!draft) {
      return;
    }
    setBaselineDraft(draft);
    setSuggestedOrders(() => {
      const next: Record<string, number> = {};
      for (const item of draft.items) {
        next[item.entryId] = item.suggestedOrder;
      }
      return next;
    });
  };

  const handleUnfreezeConfirm = () => {
    if (
      !window.confirm(
        "Freezing prevents accidental changes. You can unfreeze later."
      )
    ) {
      return;
    }
    setDraftStatus((current) =>
      transitionDraftStatus(current, { type: DRAFT_STATUS_ACTION.unfreeze })
    );
  };

  const supplierById = useMemo(() => {
    const map = new Map<string, Supplier>();
    suppliers.forEach((supplier) => {
      map.set(supplier.id, supplier);
    });
    return map;
  }, [suppliers]);

  const supplierOptionsByProduct = useMemo(() => {
    const map = new Map<string, SupplierProductLink[]>();
    supplierProducts.forEach((product) => {
      const list = map.get(product.productId) ?? [];
      list.push(product);
      map.set(product.productId, list);
    });
    return map;
  }, [supplierProducts]);

  const buildLineItems = (): OrderDraftExportLineItem[] => {
    return rows.map((row) => {
      const suggested = suggestedOrders[row.entry.id] ?? Math.abs(row.variance);
      const selectedMeta = lineSupplierMeta[row.entry.productId];
      return {
        productId: row.entry.productId,
        productName: row.entry.productName,
        qtyUnits: suggested,
        supplierId: selectedMeta?.supplierId,
        packLabel: selectedMeta?.packLabel
      };
    });
  };

  const handleExportDraft = () => {
    setExportError(null);
    try {
      const origin = baselineDraft?.origin ?? "manual";
      const payload = buildOrderDraftExport({
        generatedAt: new Date().toISOString(),
        draftId: `order-draft-${locationId}-${origin}`,
        origin,
        locationId,
        locationName: locationName || locationId,
        lineItems: buildLineItems(),
        notes: baselineDraft?.note
      });
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `order-draft-${locationId}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Unable to export the draft. No file was created.");
    }
  };

  const handleExportCsv = () => {
    setExportError(null);
    try {
      const productLookup = new Map(
        products.map((product) => [product.id, product])
      );
      const rowsForCsv: CsvRow[] = rows.map((row) => {
        const suggested = suggestedOrders[row.entry.id] ?? Math.abs(row.variance);
        const productDetails = productLookup.get(row.entry.productId);
        return {
          productId: row.entry.productId,
          productName: row.entry.productName,
          category: productDetails?.category ?? "",
          locationId,
          locationName: locationName ?? "",
          unitType: productDetails?.unitType ?? "",
          quantity: suggested,
          baselineCount: row.entry.countedUnits,
          varianceNote: row.confidence.label,
          reviewStatus: draftStatus
        };
      });
      const csv = buildOrderDraftCsv(
        {
          generatedAt: new Date().toISOString(),
          draftStatus,
          generatedBy: "stock-app",
          warning: "Draft only — not an approved purchase order"
        },
        rowsForCsv
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `order-draft-${locationId}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Unable to export the draft. No file was created.");
    }
  };

  const isFrozen = draftStatus === DRAFT_STATUS.frozen;
  const statusLabel = isFrozen ? "Frozen" : "Draft";
  const baselineNote = baselineDraft?.note ?? "Not yet generated";

  return (
    <PageShell
      className={isFrozen ? "stock-page-shell--frozen" : undefined}
      header={
        <ScreenHeader
          eyebrow="Order draft"
          title={locationName || "Location"}
          subtitle="Compare baseline counts with locally inferred stock to draft a suggested order."
          status={
            <span
              className={`stock-status-pill${isFrozen ? " stock-status-pill--frozen" : ""}`}
            >
              {statusLabel}
            </span>
          }
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
          <FieldRow label="Draft origin" value={baselineNote} />
        </KeyValueGrid>
        <p className="stock-order-draft__note">
          {isFrozen
            ? "Frozen — edits are locked until you unfreeze."
            : "Draft — edits stay enabled until you freeze."}
        </p>
        <p className="stock-order-draft__note">
          This exports the draft as a structured file. No order is placed.
        </p>
        {exportError ? (
          <FeedbackCard title="Export failed" message={exportError} />
        ) : null}
        <PrimaryActions>
          {isFrozen ? (
            <button
              type="button"
              className="stock-button stock-button--secondary"
              onClick={handleUnfreezeConfirm}
            >
              Unfreeze draft
            </button>
          ) : (
            <button
              type="button"
              className="stock-button stock-button--secondary"
              onClick={handleFreezeConfirm}
              disabled={rows.length === 0}
            >
              Freeze draft
            </button>
          )}
          <button
            type="button"
            className="stock-button stock-button--primary"
            onClick={handleExportDraft}
            disabled={rows.length === 0}
          >
            Export draft
          </button>
          <button
            type="button"
            className="stock-button stock-button--secondary"
            onClick={handleExportCsv}
            disabled={rows.length === 0}
          >
            Export CSV
          </button>
        </PrimaryActions>
      </Section>

      <Section title="Baseline variance">
        {varianceRows.length === 0 ? (
          <FeedbackCard
            title="No baseline counts"
            message="Scan products to add baseline counts for this location."
          />
        ) : (
          <div className="stock-order-table" role="table" aria-label="Baseline variance">
            <div className="stock-order-table__header" role="row">
              <span role="columnheader">Product</span>
              <span role="columnheader">Baseline count</span>
              <span role="columnheader">Current stock</span>
              <span role="columnheader">Variance</span>
            </div>
            {varianceRows.map((row) => (
              <div key={row.entry.id} className="stock-order-table__row" role="row">
                <div role="cell" className="stock-order-table__cell">
                  <strong>{row.entry.productName}</strong>
                  <span className="stock-order-table__meta">{row.entry.barcode}</span>
                </div>
                <div role="cell" className="stock-order-table__cell">
                  {row.baselineCount}
                </div>
                <div role="cell" className="stock-order-table__cell">
                  {row.estimatedStock ?? "Not yet tracked"}
                </div>
                <div role="cell" className="stock-order-table__cell">
                  {row.variance ?? "Not yet tracked"}
                </div>
              </div>
            ))}
          </div>
        )}
        <PrimaryActions>
          <button
            type="button"
            className="stock-button stock-button--primary"
            onClick={handleCreateBaselineDraft}
            disabled={varianceRows.length === 0}
          >
            Create order draft from baseline
          </button>
        </PrimaryActions>
      </Section>

      <Section title="Draft order list">
        <p className="stock-order-table__helper">
          Confidence reflects how trustworthy the estimate is based on baseline and
          local lot data.
        </p>
        <div className="stock-form__row">
          <label className="stock-form__label" htmlFor="variance-threshold">
            Variance threshold
            <input
              id="variance-threshold"
              className="stock-form__input"
              type="number"
              step={1}
              value={threshold}
              disabled={isFrozen}
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
              <span role="columnheader">Confidence</span>
              <span role="columnheader">Suggested order qty</span>
              <span role="columnheader">Selected supplier</span>
              <span role="columnheader">Pack option</span>
            </div>
            {rows.map((row) => {
              const suggested =
                suggestedOrders[row.entry.id] ?? Math.abs(row.variance);
              const isFlagged = row.variance <= threshold;
              const productSuppliers =
                supplierOptionsByProduct.get(row.entry.productId) ?? [];
              const selectedMeta = lineSupplierMeta[row.entry.productId];
              const selectedSupplierId = selectedMeta?.supplierId ?? "";
              const selectedSupplierName = selectedSupplierId
                ? supplierById.get(selectedSupplierId)?.name ?? selectedSupplierId
                : "—";
              const availableSuppliers = Array.from(
                new Set(productSuppliers.map((option) => option.supplierId))
              );
              const packOptions = selectedSupplierId
                ? productSuppliers.filter(
                    (option) => option.supplierId === selectedSupplierId
                  )
                : [];
              const selectedPackKey =
                selectedMeta?.packLabel && selectedMeta.packSize
                  ? buildPackKey({
                      supplierId: selectedSupplierId,
                      productId: row.entry.productId,
                      packLabel: selectedMeta.packLabel,
                      packSize: selectedMeta.packSize
                    })
                  : "";
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
                    <span
                      className="stock-order-table__badge"
                      title={row.confidence.helperText}
                    >
                      {row.confidence.label}
                    </span>
                    <span className="stock-order-table__meta">
                      {row.confidence.helperText}
                    </span>
                  </div>
                  <div role="cell" className="stock-order-table__cell">
                    <input
                      className="stock-form__input stock-order-table__input"
                      type="number"
                      min={0}
                      step={1}
                      value={suggested}
                      disabled={isFrozen}
                      onChange={(event) =>
                        handleSuggestedChange(
                          row.entry.id,
                          event.target.valueAsNumber
                        )
                      }
                    />
                  </div>
                  <div role="cell" className="stock-order-table__cell">
                    {productSuppliers.length === 0 ? (
                      <span className="stock-order-table__meta">No suppliers</span>
                    ) : (
                      <select
                        className="stock-form__input stock-order-table__input"
                        value={selectedSupplierId}
                        disabled={isFrozen}
                        onChange={(event) =>
                          handleSupplierChange(row.entry.productId, event.target.value)
                        }
                      >
                        <option value="">Select supplier</option>
                        {availableSuppliers.map((supplierId) => {
                          const supplierName =
                            supplierById.get(supplierId)?.name ?? supplierId;
                          return (
                            <option key={supplierId} value={supplierId}>
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
                    {packOptions.length === 0 ? (
                      <span className="stock-order-table__meta">No pack options</span>
                    ) : (
                      <select
                        className="stock-form__input stock-order-table__input"
                        value={selectedPackKey}
                        disabled={isFrozen || !selectedSupplierId}
                        onChange={(event) =>
                          handlePackChange(row.entry.productId, event.target.value)
                        }
                      >
                        <option value="">Select pack size</option>
                        {packOptions.map((option) => {
                          const optionLabel = `${option.packLabel} (${option.packSize})`;
                          const optionKey = buildPackKey(option);
                          return (
                            <option key={optionKey} value={optionKey}>
                              {optionLabel}
                            </option>
                          );
                        })}
                      </select>
                    )}
                    {selectedMeta?.packLabel && selectedMeta.packSize ? (
                      <span className="stock-order-table__meta">
                        {selectedMeta.packLabel} ({selectedMeta.packSize})
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="stock-order-table__helper">
          Pack sizes are informational. Final quantities are editable.
        </p>
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
