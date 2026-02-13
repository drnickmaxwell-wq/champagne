export type OrderBasketItem = {
  productId: string;
  qty: number;
  notes?: string;
};

type OrderBasketStore = {
  version: 1;
  items: OrderBasketItem[];
};

const STORAGE_KEY = "stock.orderBasket.v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeQty = (qty: number) => {
  if (!Number.isFinite(qty)) {
    return 0;
  }
  return Math.max(0, Math.floor(qty));
};

const parseItems = (value: unknown): OrderBasketItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }

    const { productId, qty, notes } = entry;
    if (typeof productId !== "string" || typeof qty !== "number") {
      return [];
    }
    if (notes !== undefined && typeof notes !== "string") {
      return [];
    }

    const normalizedQty = normalizeQty(qty);
    if (normalizedQty <= 0) {
      return [];
    }

    return [{ productId, qty: normalizedQty, ...(notes?.trim() ? { notes: notes.trim() } : {}) }];
  });
};

export const loadOrderBasket = (): OrderBasketItem[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return [];
    }
    return parseItems(parsed.items);
  } catch {
    return [];
  }
};

export const saveOrderBasket = (items: OrderBasketItem[]) => {
  if (typeof window === "undefined") {
    return;
  }
  const sanitized = items
    .map((item) => ({
      productId: item.productId,
      qty: normalizeQty(item.qty),
      ...(item.notes?.trim() ? { notes: item.notes.trim() } : {})
    }))
    .filter((item) => item.productId && item.qty > 0);
  const payload: OrderBasketStore = {
    version: 1,
    items: sanitized
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const upsertOrderBasketItem = (item: OrderBasketItem) => {
  const nextQty = normalizeQty(item.qty);
  const existing = loadOrderBasket();

  if (!item.productId || nextQty <= 0) {
    const filtered = existing.filter((entry) => entry.productId !== item.productId);
    saveOrderBasket(filtered);
    return filtered;
  }

  const next = existing.some((entry) => entry.productId === item.productId)
    ? existing.map((entry) =>
        entry.productId === item.productId
          ? {
              ...entry,
              qty: nextQty,
              ...(item.notes?.trim() ? { notes: item.notes.trim() } : {})
            }
          : entry
      )
    : [
        ...existing,
        {
          productId: item.productId,
          qty: nextQty,
          ...(item.notes?.trim() ? { notes: item.notes.trim() } : {})
        }
      ];

  saveOrderBasket(next);
  return next;
};

export const removeOrderBasketItem = (productId: string) => {
  const next = loadOrderBasket().filter((entry) => entry.productId !== productId);
  saveOrderBasket(next);
  return next;
};

export const clearOrderBasket = () => {
  saveOrderBasket([]);
  return [];
};
