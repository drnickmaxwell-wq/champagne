import type { BaselineCountEntry } from "./localBaseline";
import type { LocalStockLot } from "../stockLots/localLots";

export type DraftOrigin = "manual" | "baseline";

export type BaselineSource = {
  locationId: string;
  locationName: string;
  entries: BaselineCountEntry[];
};

export type BaselineVarianceRow = {
  entry: BaselineCountEntry;
  baselineCount: number;
  estimatedStock: number | null;
  variance: number | null;
  lots: LocalStockLot[];
};

export type BaselineDraftItem = {
  entryId: string;
  productId: string;
  productName: string;
  baselineCount: number;
  estimatedStock: number | null;
  variance: number | null;
  suggestedOrder: number;
};

export type BaselineDraft = {
  status: "draft";
  origin: DraftOrigin;
  note: string;
  source: BaselineSource;
  items: BaselineDraftItem[];
};

const buildLotIndex = (lots: LocalStockLot[], locationId: string) => {
  const lotsByProduct: Record<string, LocalStockLot[]> = {};
  for (const lot of lots) {
    if (lot.locationId !== locationId) {
      continue;
    }
    if (!lotsByProduct[lot.productId]) {
      lotsByProduct[lot.productId] = [];
    }
    lotsByProduct[lot.productId].push(lot);
  }
  return lotsByProduct;
};

export const buildBaselineSource = (
  entries: BaselineCountEntry[],
  locationId: string
): BaselineSource => {
  const locationName =
    entries.find((entry) => entry.locationName)?.locationName ?? locationId;
  return {
    locationId,
    locationName,
    entries
  };
};

export const buildBaselineVarianceRows = (
  entries: BaselineCountEntry[],
  lots: LocalStockLot[],
  locationId: string
): BaselineVarianceRow[] => {
  const lotsByProduct = buildLotIndex(lots, locationId);
  return buildBaselineVarianceRowsFromLots(entries, lotsByProduct);
};

export const buildBaselineVarianceRowsFromLots = (
  entries: BaselineCountEntry[],
  lotsByProduct: Record<string, LocalStockLot[]>
): BaselineVarianceRow[] => {
  return entries.map((entry) => {
    const productLots = lotsByProduct[entry.productId] ?? [];
    const hasEstimate = productLots.length > 0;
    const estimatedStock = hasEstimate ? productLots.length : null;
    const variance = hasEstimate
      ? Math.max(0, entry.countedUnits - productLots.length)
      : null;
    return {
      entry,
      baselineCount: entry.countedUnits,
      estimatedStock,
      variance,
      lots: productLots
    };
  });
};

export const buildBaselineDraft = (
  source: BaselineSource,
  rows: BaselineVarianceRow[],
  origin: DraftOrigin = "baseline"
): BaselineDraft => {
  return {
    status: "draft",
    origin,
    note: `Generated from baseline scan — ${source.locationName}`,
    source,
    items: rows.map((row) => ({
      entryId: row.entry.id,
      productId: row.entry.productId,
      productName: row.entry.productName,
      baselineCount: row.baselineCount,
      estimatedStock: row.estimatedStock,
      variance: row.variance,
      suggestedOrder: row.variance ?? 0
    }))
  };
};

export const startBaselineDraft = (
  confirmed: boolean,
  source: BaselineSource,
  rows: BaselineVarianceRow[]
) => {
  if (!confirmed) {
    return null;
  }
  return buildBaselineDraft(source, rows);
};
