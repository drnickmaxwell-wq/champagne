import { describe, expect, it } from "vitest";
import {
  buildEmailOrderPack,
  buildPhoneOrderPack,
  buildPortalOrderPack,
  groupDraftLineItemsBySupplier,
  type OrderDraftPackLineItem
} from "../orderPacks";

describe("order packs", () => {
  const sampleItems: OrderDraftPackLineItem[] = [
    {
      productId: "prod-1",
      productName: "Gloves",
      qtyUnits: 4,
      supplierId: "sup-1",
      supplierSku: "GLV-4",
      packLabel: "Box",
      notes: "Latex-free"
    },
    {
      productId: "prod-2",
      productName: "Masks",
      qtyUnits: 2,
      supplierId: "sup-1"
    },
    {
      productId: "prod-3",
      productName: "Wipes",
      qtyUnits: 3
    }
  ];

  it("groups items by supplierId and keeps unassigned separate", () => {
    const grouped = groupDraftLineItemsBySupplier(sampleItems);
    expect(grouped).toHaveLength(2);
    const assignedGroup = grouped.find((group) => group.supplierId === "sup-1");
    const unassignedGroup = grouped.find((group) => !group.supplierId);
    expect(assignedGroup?.items).toHaveLength(2);
    expect(unassignedGroup?.items).toHaveLength(1);
  });

  it("builds pack text that includes all items and quantities", () => {
    const email = buildEmailOrderPack({
      supplierName: "Supply Co",
      items: sampleItems
    });
    expect(email).toContain("Gloves");
    expect(email).toContain("Qty 4");
    expect(email).toContain("Masks");
    expect(email).toContain("Qty 2");
  });

  it("keeps pack output price-free", () => {
    const email = buildEmailOrderPack({
      supplierName: "Supply Co",
      items: sampleItems
    });
    const phone = buildPhoneOrderPack({
      supplierName: "Supply Co",
      items: sampleItems
    });
    const portal = buildPortalOrderPack({
      supplierName: "Supply Co",
      items: sampleItems
    });
    const combined = [email, phone, portal].join("\n");
    expect(combined).not.toMatch(/\$/);
    expect(combined.toLowerCase()).not.toContain("price");
  });
});
