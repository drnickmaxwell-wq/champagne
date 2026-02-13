export type ProductSupplierMapping = {
  supplierId: string;
  supplierSku?: string;
  packSize?: string;
  notes?: string;
};

type ProductSupplierMapStore = {
  version: 1;
  mappings: Record<string, ProductSupplierMapping>;
};

const STORAGE_KEY = "stock.productSupplierMap.v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const loadProductSupplierMap = (): Record<string, ProductSupplierMapping> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.mappings)) return {};
    return Object.fromEntries(
      Object.entries(parsed.mappings).filter((entry) => isRecord(entry[1]))
    ) as Record<string, ProductSupplierMapping>;
  } catch {
    return {};
  }
};

export const saveProductSupplierMap = (mappings: Record<string, ProductSupplierMapping>) => {
  if (typeof window === "undefined") return;
  const payload: ProductSupplierMapStore = { version: 1, mappings };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const getMapping = (productId: string) => {
  return loadProductSupplierMap()[productId] ?? null;
};

export const setMapping = (productId: string, mapping: ProductSupplierMapping) => {
  const current = loadProductSupplierMap();
  const next = { ...current, [productId]: mapping };
  saveProductSupplierMap(next);
  return next;
};

export const clearMapping = (productId: string) => {
  const next = { ...loadProductSupplierMap() };
  delete next[productId];
  saveProductSupplierMap(next);
  return next;
};
