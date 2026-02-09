import { describe, expect, it } from "vitest";
import type { BaselineCountEntry } from "../localBaseline";
import type { LocalStockLot } from "../../stockLots/localLots";
import {
  buildBaselineDraft,
  buildBaselineSource,
  buildBaselineVarianceRowsFromLots,
  startBaselineDraft
} from "../baselineDraft";

const makeEntry = (overrides: Partial<BaselineCountEntry> = {}): BaselineCountEntry => {
  return {
    id: overrides.id ?? "entry-1",
    locationId: overrides.locationId ?? "loc-1",
    locationName: overrides.locationName ?? "Main Shelf",
    productId: overrides.productId ?? "prod-1",
    productName: overrides.productName ?? "Gloves",
    barcode: overrides.barcode ?? "CODE-1",
    countedUnits: overrides.countedUnits ?? 10,
    updatedAt: overrides.updatedAt ?? "2024-01-01T00:00:00.000Z"
  };
};

const makeLot = (overrides: Partial<LocalStockLot> = {}): LocalStockLot => {
  return {
    id: overrides.id ?? "lot-1",
    productId: overrides.productId ?? "prod-1",
    locationId: overrides.locationId ?? "loc-1",
    barcode: overrides.barcode ?? "CODE-1",
    batchNumber: overrides.batchNumber ?? "BATCH-1",
    expiryDate: overrides.expiryDate ?? "2026-01-01",
    notes: overrides.notes,
    createdAt: overrides.createdAt ?? "2024-01-01T00:00:00.000Z"
  };
};

describe("baseline draft helpers", () => {
  it("does not mutate baseline entries when building a draft", () => {
    const entries = [makeEntry()];
    const entriesSnapshot = JSON.stringify(entries);
    const lotsByProduct = { "prod-1": [makeLot(), makeLot({ id: "lot-2" })] };
    const source = buildBaselineSource(entries, "loc-1");
    const rows = buildBaselineVarianceRowsFromLots(entries, lotsByProduct);

    const draft = buildBaselineDraft(source, rows);

    expect(JSON.stringify(entries)).toBe(entriesSnapshot);
    expect(draft.items[0]?.productId).toBe("prod-1");
  });

  it("builds draft items from variance rows", () => {
    const entries = [
      makeEntry(),
      makeEntry({ id: "entry-2", productId: "prod-2", productName: "Masks" })
    ];
    const lotsByProduct = {
      "prod-1": [makeLot(), makeLot({ id: "lot-2" })],
      "prod-2": [
        makeLot({ id: "lot-3", productId: "prod-2" }),
        makeLot({ id: "lot-4", productId: "prod-2" }),
        makeLot({ id: "lot-5", productId: "prod-2" }),
        makeLot({ id: "lot-6", productId: "prod-2" }),
        makeLot({ id: "lot-7", productId: "prod-2" }),
        makeLot({ id: "lot-8", productId: "prod-2" }),
        makeLot({ id: "lot-9", productId: "prod-2" }),
        makeLot({ id: "lot-10", productId: "prod-2" }),
        makeLot({ id: "lot-11", productId: "prod-2" }),
        makeLot({ id: "lot-12", productId: "prod-2" }),
        makeLot({ id: "lot-13", productId: "prod-2" }),
        makeLot({ id: "lot-14", productId: "prod-2" })
      ]
    };
    const source = buildBaselineSource(entries, "loc-1");
    const rows = buildBaselineVarianceRowsFromLots(entries, lotsByProduct);
    const draft = buildBaselineDraft(source, rows);

    expect(draft.items).toHaveLength(2);
    expect(draft.items[0]?.suggestedOrder).toBe(rows[0]?.variance);
    expect(draft.items[1]?.suggestedOrder).toBe(rows[1]?.variance);
  });

  it("returns null when draft creation is cancelled", () => {
    const entries = [makeEntry()];
    const lotsByProduct = { "prod-1": [makeLot()] };
    const source = buildBaselineSource(entries, "loc-1");
    const rows = buildBaselineVarianceRowsFromLots(entries, lotsByProduct);

    expect(startBaselineDraft(false, source, rows)).toBeNull();
  });
});
