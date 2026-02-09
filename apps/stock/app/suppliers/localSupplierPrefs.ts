export type ProductSupplierPreference = {
  productId: string;
  preferredSupplierId: string;
  createdAt: string;
  updatedAt: string;
};

type ProductSupplierPreferenceStore = {
  version: 1;
  preferences: ProductSupplierPreference[];
};

const STORAGE_KEY = "stock.productSupplierPrefs.v1";

const emptyStore: ProductSupplierPreferenceStore = {
  version: 1,
  preferences: []
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parsePreferences = (value: unknown): ProductSupplierPreference[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const { productId, preferredSupplierId, createdAt, updatedAt } = entry;
    if (
      typeof productId !== "string" ||
      typeof preferredSupplierId !== "string" ||
      typeof createdAt !== "string" ||
      typeof updatedAt !== "string"
    ) {
      return [];
    }
    if (!preferredSupplierId.trim()) {
      return [];
    }
    return [
      {
        productId,
        preferredSupplierId: preferredSupplierId.trim(),
        createdAt,
        updatedAt
      }
    ];
  });
};

export const loadProductSupplierPreferences = (): ProductSupplierPreference[] => {
  if (typeof window === "undefined") {
    return emptyStore.preferences;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore.preferences;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return emptyStore.preferences;
    }
    return parsePreferences(parsed.preferences);
  } catch {
    return emptyStore.preferences;
  }
};

export const saveProductSupplierPreferences = (
  preferences: ProductSupplierPreference[]
) => {
  if (typeof window === "undefined") {
    return;
  }
  const payload: ProductSupplierPreferenceStore = {
    version: 1,
    preferences
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const upsertProductSupplierPreference = (
  preference: ProductSupplierPreference
) => {
  const preferences = loadProductSupplierPreferences();
  const index = preferences.findIndex(
    (current) => current.productId === preference.productId
  );
  const next =
    index >= 0
      ? preferences.map((current, currentIndex) =>
          currentIndex === index ? preference : current
        )
      : [...preferences, preference];
  saveProductSupplierPreferences(next);
  return next;
};

export const clearProductSupplierPreference = (productId: string) => {
  const preferences = loadProductSupplierPreferences();
  const next = preferences.filter((pref) => pref.productId !== productId);
  saveProductSupplierPreferences(next);
  return next;
};

export const getPreferredSupplierId = (
  productId: string,
  preferences: ProductSupplierPreference[]
) => {
  return preferences.find((pref) => pref.productId === productId)
    ?.preferredSupplierId;
};
