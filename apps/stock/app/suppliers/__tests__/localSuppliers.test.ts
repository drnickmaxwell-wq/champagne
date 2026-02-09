import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  loadSupplierStore,
  normalizeDraftLineSupplierMeta,
  upsertSupplier,
  upsertSupplierProduct
} from "../localSuppliers";
import type { Supplier, SupplierProductLink } from "../localSuppliers";

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "stock.suppliers.v1";

const createStorage = (): StorageLike => {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    }
  };
};

let storage: StorageLike;

beforeEach(() => {
  storage = createStorage();
  vi.stubGlobal("window", { localStorage: storage });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loadSupplierStore", () => {
  it("returns empty store for invalid payload", () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, suppliers: [] }));
    const store = loadSupplierStore();
    expect(store.suppliers).toEqual([]);
    expect(store.supplierProducts).toEqual([]);
  });

  it("parses valid suppliers and product links", () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        suppliers: [
          {
            id: "s-1",
            name: "Stock Co",
            notes: "Primary",
            active: true
          }
        ],
        supplierProducts: [
          {
            supplierId: "s-1",
            productId: "p-1",
            packSize: 5,
            packLabel: "Box of 5"
          }
        ]
      })
    );
    const store = loadSupplierStore();
    expect(store.suppliers).toHaveLength(1);
    expect(store.suppliers[0]?.name).toBe("Stock Co");
    expect(store.supplierProducts).toHaveLength(1);
    expect(store.supplierProducts[0]?.packSize).toBe(5);
  });
});

describe("upsertSupplier", () => {
  it("replaces supplier entries by id", () => {
    const supplier: Supplier = { id: "s-1", name: "Original", active: true };
    upsertSupplier(supplier);
    const updated = upsertSupplier({ id: "s-1", name: "Updated", active: true });
    expect(updated.suppliers).toHaveLength(1);
    expect(updated.suppliers[0]?.name).toBe("Updated");
  });
});

describe("upsertSupplierProduct", () => {
  it("replaces supplier links by supplier + product", () => {
    const product: SupplierProductLink = {
      supplierId: "s-1",
      productId: "p-1",
      packSize: 10,
      packLabel: "Box of 10"
    };
    upsertSupplierProduct(product);
    const updated = upsertSupplierProduct({
      supplierId: "s-1",
      productId: "p-1",
      packSize: 12,
      packLabel: "Box of 12"
    });
    expect(updated.supplierProducts).toHaveLength(1);
    expect(updated.supplierProducts[0]?.packLabel).toBe("Box of 12");
  });
});

describe("supplier links", () => {
  it("allows a product to have multiple suppliers", () => {
    const supplierA: SupplierProductLink = {
      supplierId: "s-1",
      productId: "p-1",
      packSize: 10,
      packLabel: "Box of 10"
    };
    const supplierB: SupplierProductLink = {
      supplierId: "s-2",
      productId: "p-1",
      packSize: 5,
      packLabel: "Box of 5"
    };
    upsertSupplierProduct(supplierA);
    const updated = upsertSupplierProduct(supplierB);
    expect(updated.supplierProducts).toHaveLength(2);
  });
});

describe("draft supplier metadata", () => {
  it("parses draft supplier metadata safely", () => {
    const meta = normalizeDraftLineSupplierMeta({
      supplierId: "s-1",
      packSize: 12,
      packLabel: "Box of 12"
    });
    expect(meta).toEqual({
      supplierId: "s-1",
      packSize: 12,
      packLabel: "Box of 12"
    });
  });

  it("keeps metadata even when supplier is missing", () => {
    const meta = normalizeDraftLineSupplierMeta({
      supplierId: "missing-supplier",
      packSize: 8,
      packLabel: "Tray of 8"
    });
    expect(meta.supplierId).toBe("missing-supplier");
  });
});
