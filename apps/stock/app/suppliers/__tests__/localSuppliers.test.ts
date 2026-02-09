import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getBestSupplierPrice,
  loadSupplierStore,
  upsertSupplier,
  upsertSupplierProduct
} from "../localSuppliers";
import type { Supplier, SupplierProduct } from "../localSuppliers";

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
});

describe("upsertSupplier", () => {
  it("replaces supplier entries by id", () => {
    const supplier: Supplier = { id: "s-1", name: "Original" };
    upsertSupplier(supplier);
    const updated = upsertSupplier({ id: "s-1", name: "Updated" });
    expect(updated.suppliers).toHaveLength(1);
    expect(updated.suppliers[0]?.name).toBe("Updated");
  });
});

describe("upsertSupplierProduct", () => {
  it("replaces pricing rows by supplier + product", () => {
    const product: SupplierProduct = {
      supplierId: "s-1",
      productId: "p-1",
      unitPricePence: 120,
      lastUpdatedISO: "2024-01-01T00:00:00.000Z"
    };
    upsertSupplierProduct(product);
    const updated = upsertSupplierProduct({
      supplierId: "s-1",
      productId: "p-1",
      unitPricePence: 150,
      lastUpdatedISO: "2024-02-01T00:00:00.000Z"
    });
    expect(updated.supplierProducts).toHaveLength(1);
    expect(updated.supplierProducts[0]?.unitPricePence).toBe(150);
  });
});

describe("getBestSupplierPrice", () => {
  it("returns the lowest price for a product", () => {
    const products: SupplierProduct[] = [
      {
        supplierId: "s-1",
        productId: "p-1",
        unitPricePence: 210,
        lastUpdatedISO: "2024-01-01T00:00:00.000Z"
      },
      {
        supplierId: "s-2",
        productId: "p-1",
        unitPricePence: 180,
        lastUpdatedISO: "2024-01-02T00:00:00.000Z"
      }
    ];
    const best = getBestSupplierPrice("p-1", products);
    expect(best?.supplierId).toBe("s-2");
  });
});
