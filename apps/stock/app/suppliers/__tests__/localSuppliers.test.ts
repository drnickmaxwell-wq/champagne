import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadSuppliers, upsertSupplier } from "../localSuppliers";
import type { Supplier } from "../localSuppliers";

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

describe("loadSuppliers", () => {
  it("returns empty store for invalid payload", () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, suppliers: [] }));
    const store = loadSuppliers();
    expect(store).toEqual([]);
  });

  it("parses valid suppliers", () => {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        suppliers: [
          {
            id: "s-1",
            name: "Stock Co",
            orderingMethod: "EMAIL",
            contact: {
              email: "orders@stock.co"
            },
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-02T00:00:00.000Z"
          }
        ]
      })
    );
    const store = loadSuppliers();
    expect(store).toHaveLength(1);
    expect(store[0]?.name).toBe("Stock Co");
    expect(store[0]?.orderingMethod).toBe("EMAIL");
  });
});

describe("upsertSupplier", () => {
  it("replaces supplier entries by id", () => {
    const supplier: Supplier = {
      id: "s-1",
      name: "Original",
      orderingMethod: "EMAIL",
      contact: {},
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
    };
    upsertSupplier(supplier);
    const updated = upsertSupplier({
      id: "s-1",
      name: "Updated",
      orderingMethod: "PHONE",
      contact: { phone: "555-1234" },
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z"
    });
    expect(updated).toHaveLength(1);
    expect(updated[0]?.name).toBe("Updated");
    expect(updated[0]?.orderingMethod).toBe("PHONE");
  });
});
