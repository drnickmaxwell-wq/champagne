import { describe, expect, it } from "vitest";
import { findSupplierCatalogItem } from "../localSupplierCatalog";
import { getPreferredSupplierId } from "../localSupplierPrefs";
import { buildDraftLineSupplierMeta } from "../supplierResolution";
import type { SupplierCatalogItem } from "../localSupplierCatalog";
import type { ProductSupplierPreference } from "../localSupplierPrefs";

describe("supplier catalog lookup", () => {
  it("returns the latest catalog item for a supplier + product", () => {
    const items: SupplierCatalogItem[] = [
      {
        id: "item-1",
        supplierId: "sup-1",
        productId: "prod-1",
        supplierSku: "SKU-OLD",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: "item-2",
        supplierId: "sup-1",
        productId: "prod-1",
        supplierSku: "SKU-NEW",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      }
    ];

    const match = findSupplierCatalogItem("sup-1", "prod-1", items);
    expect(match?.supplierSku).toBe("SKU-NEW");
  });
});

describe("preferred supplier resolution", () => {
  it("returns the preferred supplier id for a product", () => {
    const preferences: ProductSupplierPreference[] = [
      {
        productId: "prod-1",
        preferredSupplierId: "sup-1",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }
    ];

    expect(getPreferredSupplierId("prod-1", preferences)).toBe("sup-1");
  });
});

describe("draft prefill", () => {
  it("does not crash when supplier data is missing", () => {
    const meta = buildDraftLineSupplierMeta("prod-1", [], []);
    expect(meta).toEqual({});
  });
});
