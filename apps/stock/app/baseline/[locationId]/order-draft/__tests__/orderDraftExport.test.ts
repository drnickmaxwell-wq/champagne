import { describe, expect, it } from "vitest";
import { buildOrderDraftExport, type OrderDraftExportLineItem } from "../export";

describe("buildOrderDraftExport", () => {
  it("builds a contract-aligned payload without mutating inputs", () => {
    const lineItems: OrderDraftExportLineItem[] = [
      {
        productId: "prod-1",
        productName: "Gloves",
        qtyUnits: 4,
        supplierId: "sup-1",
        supplierSku: "SKU-1",
        packLabel: "Box"
      },
      {
        productId: "prod-2",
        productName: "Masks",
        qtyUnits: 2
      }
    ];
    Object.freeze(lineItems);
    Object.freeze(lineItems[0]);
    Object.freeze(lineItems[1]);

    const payload = buildOrderDraftExport({
      draftId: "draft-1",
      origin: "manual",
      locationId: "loc-1",
      locationName: "Main Shelf",
      generatedAt: "2024-01-01T00:00:00.000Z",
      lineItems
    });

    expect(payload.contractVersion).toBe("stock.orderDraft.v1");
    expect(payload.payloadVersion).toBe("v1");
    expect(payload.generatedAt).toBe("2024-01-01T00:00:00.000Z");
    expect(payload.draftId).toBe("draft-1");
    expect(payload.origin).toBe("manual");
    expect(payload.locationRefs).toEqual([
      { locationId: "loc-1", locationName: "Main Shelf" }
    ]);
    expect(payload.lineItems).toEqual([
      {
        productId: "prod-1",
        productName: "Gloves",
        qtyUnits: 4,
        supplierId: "sup-1",
        supplierSku: "SKU-1",
        packLabel: "Box"
      },
      {
        productId: "prod-2",
        productName: "Masks",
        qtyUnits: 2
      }
    ]);
    expect(payload.notes).toBeUndefined();
  });

  it("preserves baseline origin and optional supplier metadata", () => {
    const payload = buildOrderDraftExport({
      draftId: "draft-2",
      origin: "baseline",
      locationId: "loc-2",
      locationName: "Overflow",
      generatedAt: "2024-02-02T12:00:00.000Z",
      lineItems: [
        {
          productId: "prod-3",
          productName: "Syringe",
          qtyUnits: 1,
          supplierId: "sup-2",
          supplierSku: "SYR-10"
        }
      ],
      notes: "Generated from baseline scan — Overflow"
    });

    expect(payload.origin).toBe("baseline");
    expect(payload.notes).toBe("Generated from baseline scan — Overflow");
    expect(payload.lineItems[0]).toMatchObject({
      productId: "prod-3",
      productName: "Syringe",
      qtyUnits: 1,
      supplierId: "sup-2",
      supplierSku: "SYR-10"
    });
    expect("packLabel" in payload.lineItems[0]).toBe(false);
  });
});
