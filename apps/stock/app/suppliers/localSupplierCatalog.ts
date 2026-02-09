export type SupplierCatalogItem = {
  id: string;
  supplierId: string;
  productId: string;
  supplierSku: string;
  supplierPackLabel?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type SupplierCatalogStore = {
  version: 1;
  items: SupplierCatalogItem[];
};

const STORAGE_KEY = "stock.supplierCatalog.v1";

const emptyStore: SupplierCatalogStore = {
  version: 1,
  items: []
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parseOptionalString = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === "string" && value.trim() ? value : undefined;
};

const parseItems = (value: unknown): SupplierCatalogItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const {
      id,
      supplierId,
      productId,
      supplierSku,
      supplierPackLabel,
      notes,
      createdAt,
      updatedAt
    } = entry;
    if (
      typeof id !== "string" ||
      typeof supplierId !== "string" ||
      typeof productId !== "string" ||
      typeof supplierSku !== "string" ||
      typeof createdAt !== "string" ||
      typeof updatedAt !== "string"
    ) {
      return [];
    }
    const trimmedSku = supplierSku.trim();
    if (!trimmedSku) {
      return [];
    }
    return [
      {
        id,
        supplierId,
        productId,
        supplierSku: trimmedSku,
        supplierPackLabel: parseOptionalString(supplierPackLabel),
        notes: parseOptionalString(notes),
        createdAt,
        updatedAt
      }
    ];
  });
};

export const loadSupplierCatalog = (): SupplierCatalogItem[] => {
  if (typeof window === "undefined") {
    return emptyStore.items;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore.items;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return emptyStore.items;
    }
    return parseItems(parsed.items);
  } catch {
    return emptyStore.items;
  }
};

export const saveSupplierCatalog = (items: SupplierCatalogItem[]) => {
  if (typeof window === "undefined") {
    return;
  }
  const payload: SupplierCatalogStore = {
    version: 1,
    items
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const upsertSupplierCatalogItem = (item: SupplierCatalogItem) => {
  const items = loadSupplierCatalog();
  const index = items.findIndex((current) => current.id === item.id);
  const nextItems =
    index >= 0
      ? items.map((current, currentIndex) =>
          currentIndex === index ? item : current
        )
      : [...items, item];
  saveSupplierCatalog(nextItems);
  return nextItems;
};

export const getSupplierCatalogItemsForProduct = (
  productId: string,
  items: SupplierCatalogItem[]
) => {
  return items.filter((item) => item.productId === productId);
};

export const findSupplierCatalogItem = (
  supplierId: string,
  productId: string,
  items: SupplierCatalogItem[]
) => {
  const matches = items.filter(
    (item) => item.supplierId === supplierId && item.productId === productId
  );
  if (matches.length === 0) {
    return undefined;
  }
  return matches.reduce((latest, item) => {
    const latestTime = Date.parse(latest.updatedAt);
    const itemTime = Date.parse(item.updatedAt);
    if (Number.isFinite(itemTime) && Number.isFinite(latestTime)) {
      return itemTime > latestTime ? item : latest;
    }
    return item.updatedAt > latest.updatedAt ? item : latest;
  });
};

export const clearSupplierCatalog = () => {
  if (typeof window === "undefined") {
    return emptyStore.items;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  return emptyStore.items;
};
