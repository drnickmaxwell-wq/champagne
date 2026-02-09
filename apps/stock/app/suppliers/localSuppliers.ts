export type Supplier = {
  id: string;
  name: string;
  notes?: string;
  minOrderPence?: string;
  deliveryDays?: string;
  contact?: string;
};

export type SupplierProduct = {
  supplierId: string;
  productId: string;
  supplierSku?: string;
  unitPricePence: number;
  packSize?: number;
  lastUpdatedISO: string;
};

export type SupplierStore = {
  version: 1;
  suppliers: Supplier[];
  supplierProducts: SupplierProduct[];
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

const parseOptionalInteger = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  const parsed = Math.floor(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return undefined;
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
    const { id, name, notes, minOrderPence, deliveryDays, contact } = entry;
    if (typeof id !== "string" || typeof name !== "string") {
      return [];
    }
    const parsedNotes = parseOptionalString(notes);
    const parsedMinOrder = parseOptionalString(minOrderPence);
    const parsedDeliveryDays = parseOptionalString(deliveryDays);
    const parsedContact = parseOptionalString(contact);
    return [
      {
        id,
        name,
        notes: parsedNotes,
        minOrderPence: parsedMinOrder,
        deliveryDays: parsedDeliveryDays,
        contact: parsedContact
      }
    ];
  });
};

const parseSupplierProducts = (value: unknown): SupplierProduct[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const {
      supplierId,
      productId,
      supplierSku,
      unitPricePence,
      packSize,
      lastUpdatedISO
    } = entry;
    if (
      typeof supplierId !== "string" ||
      typeof productId !== "string" ||
      typeof unitPricePence !== "number" ||
      !Number.isFinite(unitPricePence) ||
      typeof lastUpdatedISO !== "string"
    ) {
      return [];
    }
    const parsedUnitPrice = Math.floor(unitPricePence);
    if (!Number.isInteger(parsedUnitPrice) || parsedUnitPrice < 0) {
      return [];
    }
    const parsedPackSize = parseOptionalInteger(packSize);
    const parsedSku = parseOptionalString(supplierSku);
    return [
      {
        supplierId,
        productId,
        supplierSku: parsedSku,
        unitPricePence: parsedUnitPrice,
        packSize: parsedPackSize,
        lastUpdatedISO
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

export const upsertSupplierProduct = (product: SupplierProduct) => {
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
      "minOrderPence",
      "deliveryDays",
      "contact",
      "productId",
      "supplierSku",
      "unitPricePence",
      "packSize",
      "lastUpdatedISO"
    ]
  ];

  store.suppliers.forEach((supplier) => {
    rows.push([
      "supplier",
      supplier.id,
      supplier.name,
      supplier.notes ?? "",
      supplier.minOrderPence ?? "",
      supplier.deliveryDays ?? "",
      supplier.contact ?? "",
      "",
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
      "",
      "",
      "",
      product.productId,
      product.supplierSku ?? "",
      product.unitPricePence,
      product.packSize ?? "",
      product.lastUpdatedISO
    ]);
  });

  return rows
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");
};

export const getBestSupplierPrice = (
  productId: string,
  supplierProducts: SupplierProduct[]
) => {
  let best: SupplierProduct | null = null;
  for (const product of supplierProducts) {
    if (product.productId !== productId) {
      continue;
    }
    if (!best || product.unitPricePence < best.unitPricePence) {
      best = product;
    }
  }
  return best;
};
