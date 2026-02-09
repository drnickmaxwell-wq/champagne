import type { ProductSupplierPreference } from "./localSupplierPrefs";
import type { SupplierCatalogItem } from "./localSupplierCatalog";

export const orderingMethodOptions = [
  "PHONE",
  "EMAIL",
  "PORTAL",
  "REP"
] as const;

export type SupplierOrderingMethod = (typeof orderingMethodOptions)[number];

export type SupplierContact = {
  phone?: string;
  email?: string;
  portalUrl?: string;
  notes?: string;
};

export type Supplier = {
  id: string;
  name: string;
  orderingMethod: SupplierOrderingMethod;
  contact: SupplierContact;
  createdAt: string;
  updatedAt: string;
};

type SupplierStore = {
  version: 1;
  suppliers: Supplier[];
};

const STORAGE_KEY = "stock.suppliers.v1";

const emptyStore: SupplierStore = {
  version: 1,
  suppliers: []
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isOrderingMethod = (value: unknown): value is SupplierOrderingMethod => {
  return (
    typeof value === "string" &&
    orderingMethodOptions.some((option) => option === value)
  );
};

const parseOptionalString = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === "string" && value.trim() ? value : undefined;
};

const parseContact = (value: unknown): SupplierContact | null => {
  if (!isRecord(value)) {
    return null;
  }
  return {
    phone: parseOptionalString(value.phone),
    email: parseOptionalString(value.email),
    portalUrl: parseOptionalString(value.portalUrl),
    notes: parseOptionalString(value.notes)
  };
};

const parseSuppliers = (value: unknown): Supplier[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const { id, name, orderingMethod, contact, createdAt, updatedAt } = entry;
    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      !isOrderingMethod(orderingMethod) ||
      typeof createdAt !== "string" ||
      typeof updatedAt !== "string"
    ) {
      return [];
    }
    const parsedContact = parseContact(contact);
    if (!parsedContact) {
      return [];
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
      return [];
    }
    return [
      {
        id,
        name: trimmedName,
        orderingMethod,
        contact: parsedContact,
        createdAt,
        updatedAt
      }
    ];
  });
};

export const loadSuppliers = (): Supplier[] => {
  if (typeof window === "undefined") {
    return emptyStore.suppliers;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore.suppliers;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return emptyStore.suppliers;
    }
    return parseSuppliers(parsed.suppliers);
  } catch {
    return emptyStore.suppliers;
  }
};

export const saveSuppliers = (suppliers: Supplier[]) => {
  if (typeof window === "undefined") {
    return;
  }
  const payload: SupplierStore = {
    version: 1,
    suppliers
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const upsertSupplier = (supplier: Supplier) => {
  const suppliers = loadSuppliers();
  const index = suppliers.findIndex((current) => current.id === supplier.id);
  const nextSuppliers =
    index >= 0
      ? suppliers.map((current, currentIndex) =>
          currentIndex === index ? supplier : current
        )
      : [...suppliers, supplier];
  saveSuppliers(nextSuppliers);
  return nextSuppliers;
};

export const clearSuppliers = () => {
  if (typeof window === "undefined") {
    return emptyStore.suppliers;
  }
  window.localStorage.removeItem(STORAGE_KEY);
  return emptyStore.suppliers;
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

export const exportSupplierCsv = (
  suppliers: Supplier[],
  catalogItems: SupplierCatalogItem[],
  preferences: ProductSupplierPreference[]
) => {
  const rows: Array<Array<string | number>> = [
    [
      "recordType",
      "supplierId",
      "supplierName",
      "orderingMethod",
      "contactPhone",
      "contactEmail",
      "contactPortalUrl",
      "contactNotes",
      "productId",
      "supplierSku",
      "supplierPackLabel",
      "mappingNotes",
      "preferredSupplierId"
    ]
  ];

  suppliers.forEach((supplier) => {
    rows.push([
      "supplier",
      supplier.id,
      supplier.name,
      supplier.orderingMethod,
      supplier.contact.phone ?? "",
      supplier.contact.email ?? "",
      supplier.contact.portalUrl ?? "",
      supplier.contact.notes ?? "",
      "",
      "",
      "",
      "",
      ""
    ]);
  });

  catalogItems.forEach((item) => {
    rows.push([
      "catalogItem",
      item.supplierId,
      "",
      "",
      "",
      "",
      "",
      "",
      item.productId,
      item.supplierSku,
      item.supplierPackLabel ?? "",
      item.notes ?? "",
      ""
    ]);
  });

  preferences.forEach((preference) => {
    rows.push([
      "preferredSupplier",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      preference.productId,
      "",
      "",
      "",
      preference.preferredSupplierId
    ]);
  });

  return rows
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");
};
