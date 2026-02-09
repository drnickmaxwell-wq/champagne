import { describe, expect, it } from "vitest";
import type { Supplier } from "../../../suppliers/localSuppliers";
import type { SupplierOrderPack } from "../orderPacks";
import {
  buildSupplierOrderText,
  buildSupplierOrderViews
} from "../supplierOrderView";

describe("supplier order view", () => {
  const supplier: Supplier = {
    id: "sup-1",
    name: "Henry Schein",
    orderingMethod: "PORTAL",
    contact: {
      phone: "555-1234",
      email: "orders@henryschein.test",
      portalUrl: "https://portal.example.test",
      notes: "Use rep line"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-02"
  };

  const packs: SupplierOrderPack[] = [
    {
      supplierId: "sup-1",
      items: [
        {
          productId: "prod-1",
          productName: "Composite A2",
          qtyUnits: 6,
          supplierId: "sup-1",
          supplierSku: "HS-123",
          packLabel: "Box",
          notes: "Urgent"
        }
      ]
    },
    {
      items: [
        {
          productId: "prod-2",
          productName: "Etch Gel",
          qtyUnits: 2
        }
      ]
    }
  ];

  it("builds supplier views with assigned and unassigned sections", () => {
    const supplierById = new Map([[supplier.id, supplier]]);
    const views = buildSupplierOrderViews(packs, supplierById);
    expect(views).toHaveLength(2);
    expect(views[0]?.supplierName).toBe("Henry Schein");
    expect(views[0]?.orderingMethod).toBe("PORTAL");
    expect(views[1]?.supplierName).toBe("Unassigned items");
    expect(views[1]?.orderingMethod).toBe("Not provided");
  });

  it("builds plain text output with supplier grouping", () => {
    const supplierById = new Map([[supplier.id, supplier]]);
    const views = buildSupplierOrderViews(packs, supplierById);
    const text = buildSupplierOrderText(views);
    expect(text).toContain("Supplier: Henry Schein");
    expect(text).toContain("- Composite A2 — 6 units (SKU HS-123 | Pack Box | Notes: Urgent)");
    expect(text).toContain("Supplier: Unassigned items");
    expect(text).toContain("- Etch Gel — 2 units");
    expect(text).not.toMatch(/\$/);
  });

  it("does not mutate pack items", () => {
    const supplierById = new Map([[supplier.id, supplier]]);
    const snapshot = structuredClone(packs);
    buildSupplierOrderViews(packs, supplierById);
    expect(packs).toEqual(snapshot);
  });
});
