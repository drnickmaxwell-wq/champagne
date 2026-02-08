export type LocalStockLot = {
  id: string;
  productId: string;
  locationId: string | null;
  barcode: string;
  batchNumber: string;
  expiryDate: string;
  notes?: string;
  createdAt: string;
};

type LocalLotStore = {
  version: 1;
  lots: LocalStockLot[];
};

export type ExpiryStatus = "expired" | "near-expiry" | "ok" | "unknown";

const STORAGE_KEY = "stock.localLots.v1";

const emptyStore: LocalLotStore = {
  version: 1,
  lots: []
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parseDateParts = (value: string) => {
  const parts = value.split("-");
  if (parts.length !== 3) {
    return null;
  }
  const [yearRaw, monthRaw, dayRaw] = parts;
  const year = Number.parseInt(yearRaw, 10);
  const month = Number.parseInt(monthRaw, 10);
  const day = Number.parseInt(dayRaw, 10);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    year < 1970 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }
  return { year, month, day };
};

const toUtcStart = (date: Date) => {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

const parseExpiryDate = (value: string) => {
  const parsed = parseDateParts(value);
  if (!parsed) {
    return null;
  }
  return Date.UTC(parsed.year, parsed.month - 1, parsed.day);
};

const parseLots = (value: unknown): LocalStockLot[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const {
      id,
      productId,
      locationId,
      barcode,
      batchNumber,
      expiryDate,
      notes,
      createdAt
    } = entry;
    if (
      typeof id !== "string" ||
      typeof productId !== "string" ||
      (typeof locationId !== "string" && locationId !== null) ||
      typeof barcode !== "string" ||
      typeof batchNumber !== "string" ||
      typeof expiryDate !== "string" ||
      typeof createdAt !== "string"
    ) {
      return [];
    }
    if (notes !== undefined && typeof notes !== "string") {
      return [];
    }
    return [
      {
        id,
        productId,
        locationId,
        barcode,
        batchNumber,
        expiryDate,
        notes,
        createdAt
      }
    ];
  });
};

export const loadLocalLots = (): LocalStockLot[] => {
  if (typeof window === "undefined") {
    return emptyStore.lots;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore.lots;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return emptyStore.lots;
    }
    return parseLots(parsed.lots);
  } catch {
    return emptyStore.lots;
  }
};

export const saveLocalLots = (lots: LocalStockLot[]) => {
  if (typeof window === "undefined") {
    return;
  }
  const payload: LocalLotStore = {
    version: 1,
    lots
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const addLocalLot = (lot: LocalStockLot) => {
  const nextLots = [...loadLocalLots(), lot];
  saveLocalLots(nextLots);
  return nextLots;
};

export const getLotsForProduct = (productId: string) => {
  return loadLocalLots()
    .filter((lot) => lot.productId === productId)
    .sort((a, b) => {
      const aDate = parseExpiryDate(a.expiryDate) ?? 0;
      const bDate = parseExpiryDate(b.expiryDate) ?? 0;
      return aDate - bDate;
    });
};

export const getExpiryStatus = (
  expiryDate: string,
  now: Date = new Date(),
  nearDays = 30
): ExpiryStatus => {
  const expiryTime = parseExpiryDate(expiryDate);
  if (expiryTime === null) {
    return "unknown";
  }
  const today = toUtcStart(now);
  if (expiryTime < today) {
    return "expired";
  }
  const nearCutoff = today + nearDays * 24 * 60 * 60 * 1000;
  if (expiryTime <= nearCutoff) {
    return "near-expiry";
  }
  return "ok";
};

export const getLotsNearExpiry = (days = 30) => {
  const now = new Date();
  return loadLocalLots()
    .map((lot) => {
      const expiryTime = parseExpiryDate(lot.expiryDate);
      return expiryTime === null ? null : { lot, expiryTime };
    })
    .filter((entry): entry is { lot: LocalStockLot; expiryTime: number } =>
      Boolean(entry)
    )
    .filter(({ expiryTime }) => {
      const today = toUtcStart(now);
      return expiryTime <= today + days * 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => a.expiryTime - b.expiryTime)
    .map(({ lot }) => lot);
};
