import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getExpiryStatus,
  getLotsForProduct,
  loadLocalLots,
  type LocalStockLot
} from "../localLots";

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "stock.localLots.v1";

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

const writeLots = (storage: StorageLike, lots: unknown) => {
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, lots }));
};

beforeEach(() => {
  vi.stubGlobal("window", { localStorage: createStorage() });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getExpiryStatus", () => {
  it("returns expected status buckets", () => {
    const now = new Date("2024-01-15T12:00:00Z");
    expect(getExpiryStatus("bad-date", now)).toBe("unknown");
    expect(getExpiryStatus("2024-01-10", now)).toBe("expired");
    expect(getExpiryStatus("2024-02-10", now, 30)).toBe("near-expiry");
    expect(getExpiryStatus("2024-03-20", now, 30)).toBe("ok");
  });
});

describe("getLotsForProduct", () => {
  it("sorts lots by expiry date", () => {
    const storage = (globalThis.window as { localStorage: StorageLike })
      .localStorage;
    const lots: LocalStockLot[] = [
      {
        id: "lot-b",
        productId: "product-1",
        locationId: null,
        barcode: "CODE-1",
        batchNumber: "B-2",
        expiryDate: "2024-05-01",
        createdAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: "lot-a",
        productId: "product-1",
        locationId: null,
        barcode: "CODE-1",
        batchNumber: "B-1",
        expiryDate: "2024-02-01",
        createdAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: "lot-other",
        productId: "product-2",
        locationId: null,
        barcode: "CODE-2",
        batchNumber: "C-1",
        expiryDate: "2024-03-01",
        createdAt: "2024-01-03T00:00:00.000Z"
      }
    ];

    writeLots(storage, lots);
    const result = getLotsForProduct("product-1");
    expect(result.map((lot) => lot.id)).toEqual(["lot-a", "lot-b"]);
  });
});

describe("loadLocalLots", () => {
  it("ignores invalid records", () => {
    const storage = (globalThis.window as { localStorage: StorageLike })
      .localStorage;
    const validLot: LocalStockLot = {
      id: "lot-valid",
      productId: "product-1",
      locationId: null,
      barcode: "CODE-1",
      batchNumber: "B-1",
      expiryDate: "2024-05-01",
      createdAt: "2024-01-01T00:00:00.000Z"
    };
    writeLots(storage, [validLot, { id: "bad" }]);
    expect(loadLocalLots()).toEqual([validLot]);
  });
});
