export type LocalSupplier = {
  id: string;
  name: string;
  orderingEmail?: string;
  cutoffNotes?: string;
  phone?: string;
  createdAt: string;
};

type SupplierStore = {
  version: 1;
  suppliers: LocalSupplier[];
};

const STORAGE_KEY = "stock.suppliers.v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseSuppliers = (value: unknown): LocalSupplier[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const { id, name, orderingEmail, cutoffNotes, phone, createdAt } = entry;
    if (typeof id !== "string" || typeof name !== "string" || typeof createdAt !== "string") {
      return [];
    }
    if (orderingEmail !== undefined && typeof orderingEmail !== "string") return [];
    if (cutoffNotes !== undefined && typeof cutoffNotes !== "string") return [];
    if (phone !== undefined && typeof phone !== "string") return [];
    return [{ id, name, orderingEmail, cutoffNotes, phone, createdAt }];
  });
};

export const loadLocalSuppliers = (): LocalSupplier[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) return [];
    return parseSuppliers(parsed.suppliers);
  } catch {
    return [];
  }
};

export const saveLocalSuppliers = (suppliers: LocalSupplier[]) => {
  if (typeof window === "undefined") return;
  const payload: SupplierStore = { version: 1, suppliers };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const addLocalSupplier = (draft: Omit<LocalSupplier, "id" | "createdAt">) => {
  const next: LocalSupplier = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `supplier-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...draft
  };
  const suppliers = [...loadLocalSuppliers(), next];
  saveLocalSuppliers(suppliers);
  return suppliers;
};

export const updateLocalSupplier = (supplierId: string, update: Partial<LocalSupplier>) => {
  const suppliers = loadLocalSuppliers().map((supplier) =>
    supplier.id === supplierId ? { ...supplier, ...update, id: supplier.id, createdAt: supplier.createdAt } : supplier
  );
  saveLocalSuppliers(suppliers);
  return suppliers;
};

export const removeLocalSupplier = (supplierId: string) => {
  const suppliers = loadLocalSuppliers().filter((supplier) => supplier.id !== supplierId);
  saveLocalSuppliers(suppliers);
  return suppliers;
};
