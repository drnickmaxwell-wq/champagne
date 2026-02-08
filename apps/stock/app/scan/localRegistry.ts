export const unitTypeOptions = ["each", "pack", "box", "ml", "g"] as const;
export type UnitType = (typeof unitTypeOptions)[number];

export const categoryOptions = [
  "consumable",
  "implant-related",
  "sterile",
  "other"
] as const;
export type ProductCategory = (typeof categoryOptions)[number];

export type LocalProduct = {
  id: string;
  name: string;
  unitType: UnitType;
  category: ProductCategory;
  requiresBatchTracking: boolean;
  barcode: string;
  createdAt: string;
};

export type BarcodeBinding = {
  barcode: string;
  productId: string;
  createdAt: string;
};

export type LocalBarcodeRegistry = {
  version: 1;
  products: LocalProduct[];
  bindings: BarcodeBinding[];
};

const STORAGE_KEY = "stock.localBarcodeRegistry.v1";

const emptyRegistry: LocalBarcodeRegistry = {
  version: 1,
  products: [],
  bindings: []
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isUnitType = (value: unknown): value is UnitType => {
  return (
    typeof value === "string" &&
    unitTypeOptions.some((option) => option === value)
  );
};

const isCategory = (value: unknown): value is ProductCategory => {
  return (
    typeof value === "string" &&
    categoryOptions.some((option) => option === value)
  );
};

const parseProducts = (value: unknown): LocalProduct[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const { id, name, unitType, category, requiresBatchTracking, barcode, createdAt } = entry;
    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      !isUnitType(unitType) ||
      !isCategory(category) ||
      typeof requiresBatchTracking !== "boolean" ||
      typeof barcode !== "string" ||
      typeof createdAt !== "string"
    ) {
      return [];
    }
    return [
      {
        id,
        name,
        unitType,
        category,
        requiresBatchTracking,
        barcode,
        createdAt
      }
    ];
  });
};

const parseBindings = (value: unknown): BarcodeBinding[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const { barcode, productId, createdAt } = entry;
    if (
      typeof barcode !== "string" ||
      typeof productId !== "string" ||
      typeof createdAt !== "string"
    ) {
      return [];
    }
    return [
      {
        barcode,
        productId,
        createdAt
      }
    ];
  });
};

export const loadLocalBarcodeRegistry = (): LocalBarcodeRegistry => {
  if (typeof window === "undefined") {
    return emptyRegistry;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyRegistry;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return emptyRegistry;
    }
    return {
      version: 1,
      products: parseProducts(parsed.products),
      bindings: parseBindings(parsed.bindings)
    };
  } catch {
    return emptyRegistry;
  }
};

export const saveLocalBarcodeRegistry = (registry: LocalBarcodeRegistry) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
};
