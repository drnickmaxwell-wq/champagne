import { describe, expect, it } from "vitest";
import {
  buildSupplierOrderBlocks,
  buildSupplierOrderFilename,
  buildSupplierOrderText,
  type SupplierOrderBlock
} from "../orderExport";

describe("buildSupplierOrderText", () => {
  it("formats supplier order text with no prices", () => {
    const block: SupplierOrderBlock = {
      supplierId: "supplier-a",
      supplierName: "Alpha Dental",
      orderingEmail: "orders@alpha.test",
      cutoffNotes: "Order by 2pm for next day",
      lines: [
        {
          productName: "Sutures 4-0",
          qty: 3,
          supplierSku: "SUT-40",
          packSize: "Box of 12",
          notes: "Blue only"
        }
      ]
    };

    const text = buildSupplierOrderText(block);

    expect(text).toContain("Supplier: Alpha Dental");
    expect(text).toContain("Ordering email: orders@alpha.test");
    expect(text).toContain("- Sutures 4-0 — Qty 3 — Supplier SKU SUT-40 — Pack size Box of 12 — Notes Blue only");
    expect(text.toLowerCase()).not.toContain("price");
    expect(text).not.toMatch(/[£$€]/);
  });
});

describe("buildSupplierOrderBlocks", () => {
  it("groups basket lines by mapped supplier", () => {
    const blocks = buildSupplierOrderBlocks({
      basket: [
        { productId: "p-1", qty: 2, notes: "Urgent" },
        { productId: "p-2", qty: 1 }
      ],
      products: [
        { id: "p-1", name: "Gloves", barcode: "1", category: "consumable", createdAt: "now", requiresBatchTracking: false, unitType: "box" },
        { id: "p-2", name: "Masks", barcode: "2", category: "consumable", createdAt: "now", requiresBatchTracking: false, unitType: "box" }
      ],
      suppliers: [
        { id: "s-1", name: "Supplier One", createdAt: "now" }
      ],
      mappings: {
        "p-1": { supplierId: "s-1", supplierSku: "G-1", packSize: "100" },
        "p-2": { supplierId: "s-1" }
      }
    });

    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.lines).toHaveLength(2);
  });
});

describe("buildSupplierOrderFilename", () => {
  it("returns expected dated txt filename", () => {
    const filename = buildSupplierOrderFilename("Alpha Dental", new Date("2026-01-05T00:00:00.000Z"));
    expect(filename).toBe("supplier-order-alpha-dental-20260105.txt");
  });
});
