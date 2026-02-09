export type Supplier = {
  id: string;
  name: string;
  notes?: string;
  active: boolean;
};

export type SupplierProductLink = {
  supplierId: string;
  productId: string;
  packSize: number;
  packLabel: string;
};

export type SupplierStore = {
  version: 1;
  suppliers: Supplier[];
  supplierProducts: SupplierProductLink[];
};

export type DraftLineSupplierMeta = {
  supplierId?: string;
  packSize?: number;
  packLabel?: string;
};

const STORAGE_KEY = "stock.suppliers.v1";

const emptyStore: SupplierStore = {
  version: 1,
  suppliers: [],
  supplierProducts: []
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parseOptionalString = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === "string" ? value : undefined;
};

const parsePositiveInteger = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  const parsed = Math.floor(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }
  return parsed;
};

const parseSuppliers = (value: unknown): Supplier[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const { id, name, notes, active } = entry;
    if (typeof id !== "string" || typeof name !== "string") {
      return [];
    }
    const parsedNotes = parseOptionalString(notes);
    const parsedActive = typeof active === "boolean" ? active : true;
    return [
      {
        id,
        name,
        notes: parsedNotes,
        active: parsedActive
      }
    ];
  });
};

const parseSupplierProducts = (value: unknown): SupplierProductLink[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const { supplierId, productId, packSize, packLabel } = entry;
    if (typeof supplierId !== "string" || typeof productId !== "string") {
      return [];
    }
    const parsedPackSize = parsePositiveInteger(packSize);
    if (!parsedPackSize) {
      return [];
    }
    if (typeof packLabel !== "string" || !packLabel.trim()) {
      return [];
    }
    return [
      {
        supplierId,
        productId,
        packSize: parsedPackSize,
        packLabel: packLabel.trim()
      }
    ];
  });
};

export const loadSupplierStore = (): SupplierStore => {
  if (typeof window === "undefined") {
    return emptyStore;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return emptyStore;
    }
    return {
      version: 1,
      suppliers: parseSuppliers(parsed.suppliers),
      supplierProducts: parseSupplierProducts(parsed.supplierProducts)
    };
  } catch {
    return emptyStore;
  }
};

export const saveSupplierStore = (store: SupplierStore) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const upsertSupplier = (supplier: Supplier) => {
  const store = loadSupplierStore();
  const index = store.suppliers.findIndex((current) => current.id === supplier.id);
  const nextSuppliers =
    index >= 0
      ? store.suppliers.map((current, currentIndex) =>
          currentIndex === index ? supplier : current
        )
      : [...store.suppliers, supplier];
  const nextStore: SupplierStore = {
    ...store,
    suppliers: nextSuppliers
  };
  saveSupplierStore(nextStore);
  return nextStore;
};

export const upsertSupplierProduct = (product: SupplierProductLink) => {
  const store = loadSupplierStore();
  const index = store.supplierProducts.findIndex(
    (current) =>
      current.supplierId === product.supplierId &&
      current.productId === product.productId
  );
  const nextProducts =
    index >= 0
      ? store.supplierProducts.map((current, currentIndex) =>
          currentIndex === index ? product : current
        )
      : [...store.supplierProducts, product];
  const nextStore: SupplierStore = {
    ...store,
    supplierProducts: nextProducts
  };
  saveSupplierStore(nextStore);
  return nextStore;
};

export const normalizeDraftLineSupplierMeta = (
  value: unknown
): DraftLineSupplierMeta => {
  if (!isRecord(value)) {
    return {};
  }
  const supplierId =
    typeof value.supplierId === "string" ? value.supplierId : undefined;
  const packLabel =
    typeof value.packLabel === "string" && value.packLabel.trim()
      ? value.packLabel.trim()
      : undefined;
  const packSize =
    value.packSize !== undefined ? parsePositiveInteger(value.packSize) : null;
  return {
    supplierId,
    packLabel,
    packSize: packSize ?? undefined
  };
};

export const clearSupplierStore = () => {
  if (typeof window === "undefined") {
    return emptyStore;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  return emptyStore;
};

const escapeCsvValue = (value: string | number | undefined) => {
  if (value === undefined || value === null) {
    return "";
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const exportSupplierCsv = (store: SupplierStore) => {
  const rows: Array<Array<string | number>> = [
    [
      "recordType",
      "supplierId",
      "supplierName",
      "notes",
      "active",
      "productId",
      "packSize",
      "packLabel"
    ]
  ];

  store.suppliers.forEach((supplier) => {
    rows.push([
      "supplier",
      supplier.id,
      supplier.name,
      supplier.notes ?? "",
      supplier.active ? "true" : "false",
      "",
      "",
      "",
      ""
    ]);
  });

  store.supplierProducts.forEach((product) => {
    rows.push([
      "supplierProduct",
      product.supplierId,
      "",
      "",
      product.productId,
      product.packSize,
      product.packLabel
    ]);
  });

  return rows
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");
};
