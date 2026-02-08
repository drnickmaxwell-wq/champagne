import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearBaselineForLocation,
  loadBaselineEntries,
  upsertBaselineEntry
} from "../localBaseline";
import type { BaselineCountEntry } from "../localBaseline";

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "stock.localBaseline.v1";

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

const writeEntries = (storage: StorageLike, entries: unknown) => {
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, entries }));
};

beforeEach(() => {
  vi.stubGlobal("window", { localStorage: createStorage() });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const makeEntry = (overrides: Partial<BaselineCountEntry> = {}) => {
  return {
    id: overrides.id ?? "entry-1",
    locationId: overrides.locationId ?? "loc-1",
    locationName: overrides.locationName ?? "Shelf A",
    productId: overrides.productId ?? "prod-1",
    productName: overrides.productName ?? "Gloves",
    barcode: overrides.barcode ?? "CODE-1",
    countedUnits: overrides.countedUnits ?? 5,
    updatedAt: overrides.updatedAt ?? "2024-01-01T00:00:00.000Z"
  };
};

describe("upsertBaselineEntry", () => {
  it("replaces entries by locationId + productId", () => {
    const storage = (globalThis.window as { localStorage: StorageLike })
      .localStorage;
    const first = makeEntry();
    const replacement = makeEntry({ countedUnits: 8, updatedAt: "2024-02-01T00:00:00.000Z" });
    writeEntries(storage, [first]);

    const updated = upsertBaselineEntry(replacement);
    expect(updated).toHaveLength(1);
    expect(updated[0]?.countedUnits).toBe(8);
  });
});

describe("loadBaselineEntries", () => {
  it("returns empty when payload is invalid", () => {
    const storage = (globalThis.window as { localStorage: StorageLike })
      .localStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, entries: [] }));
    expect(loadBaselineEntries()).toEqual([]);
  });
});

describe("clearBaselineForLocation", () => {
  it("removes only the matching location entries", () => {
    const storage = (globalThis.window as { localStorage: StorageLike })
      .localStorage;
    const entryA = makeEntry({ id: "entry-a", locationId: "loc-1" });
    const entryB = makeEntry({ id: "entry-b", locationId: "loc-2" });
    writeEntries(storage, [entryA, entryB]);

    const updated = clearBaselineForLocation("loc-1");
    expect(updated).toHaveLength(1);
    expect(updated[0]?.locationId).toBe("loc-2");
  });
});
