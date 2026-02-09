import { describe, expect, it } from "vitest";
import {
  buildOrderDraftCsv,
  getOrderDraftCsvColumns,
  type CsvMeta,
  type CsvRow
} from "../csv";

const baseMeta = (draftStatus: CsvMeta["draftStatus"]): CsvMeta => ({
  generatedAt: "2024-02-10T12:34:56.000Z",
  draftStatus,
  generatedBy: "stock-app",
  warning: "Draft only — not an approved purchase order"
});

const baseRows: CsvRow[] = [
  {
    productId: "prod-1",
    productName: "Gloves, Large",
    category: "consumable",
    locationId: "loc-1",
    locationName: "Main Shelf",
    unitType: "box",
    quantity: 4,
    baselineCount: 10,
    varianceNote: "Low confidence",
    reviewStatus: "DRAFT"
  },
  {
    productId: "prod-2",
    productName: "Mask \"N95\"",
    category: "",
    locationId: "loc-1",
    locationName: "Main Shelf",
    unitType: "",
    quantity: undefined,
    baselineCount: undefined,
    varianceNote: "Check\nlot",
    reviewStatus: "DRAFT"
  }
];

const expectMetadata = (csv: string, status: CsvMeta["draftStatus"]) => {
  const lines = csv.split("\n");
  expect(lines[0]).toBe(`# Generated_at: 2024-02-10T12:34:56.000Z`);
  expect(lines[1]).toBe(`# Draft_status: ${status}`);
  expect(lines[2]).toBe(`# Generated_by: stock-app`);
  expect(lines[3]).toBe(`# Warning: Draft only — not an approved purchase order`);
};

describe("buildOrderDraftCsv", () => {
  it("emits a draft snapshot with metadata and stable columns", () => {
    const csv = buildOrderDraftCsv(baseMeta("DRAFT"), baseRows);
    expectMetadata(csv, "DRAFT");
    const lines = csv.split("\n");
    expect(lines[4]).toBe(getOrderDraftCsvColumns().join(","));
    expect(csv).toMatchInlineSnapshot(`
      "# Generated_at: 2024-02-10T12:34:56.000Z
      # Draft_status: DRAFT
      # Generated_by: stock-app
      # Warning: Draft only — not an approved purchase order
      product_id,product_name,category,location_id,location_name,unit_type,quantity,baseline_count,variance_note,review_status
      prod-1,"Gloves, Large",consumable,loc-1,Main Shelf,box,4,10,Low confidence,DRAFT
      prod-2,"Mask ""N95""",,loc-1,Main Shelf,,,,"Check
      lot",DRAFT"
    `);
  });

  it("emits a frozen snapshot with metadata", () => {
    const rows = baseRows.map((row) => ({ ...row, reviewStatus: "FROZEN" }));
    const csv = buildOrderDraftCsv(baseMeta("FROZEN"), rows);
    expectMetadata(csv, "FROZEN");
    expect(csv).toMatchInlineSnapshot(`
      "# Generated_at: 2024-02-10T12:34:56.000Z
      # Draft_status: FROZEN
      # Generated_by: stock-app
      # Warning: Draft only — not an approved purchase order
      product_id,product_name,category,location_id,location_name,unit_type,quantity,baseline_count,variance_note,review_status
      prod-1,"Gloves, Large",consumable,loc-1,Main Shelf,box,4,10,Low confidence,FROZEN
      prod-2,"Mask ""N95""",,loc-1,Main Shelf,,,,"Check
      lot",FROZEN"
    `);
  });
});
