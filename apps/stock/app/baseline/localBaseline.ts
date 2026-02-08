export type BaselineCountEntry = {
  id: string;
  locationId: string;
  locationName?: string;
  productId: string;
  productName: string;
  barcode: string;
  countedUnits: number;
  updatedAt: string;
};

type LocalBaselineStore = {
  version: 1;
  entries: BaselineCountEntry[];
};

const STORAGE_KEY = "stock.localBaseline.v1";

const emptyStore: LocalBaselineStore = {
  version: 1,
  entries: []
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parseEntries = (value: unknown): BaselineCountEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const {
      id,
      locationId,
      locationName,
      productId,
      productName,
      barcode,
      countedUnits,
      updatedAt
    } = entry;
    if (
      typeof id !== "string" ||
      typeof locationId !== "string" ||
      typeof productId !== "string" ||
      typeof productName !== "string" ||
      typeof barcode !== "string" ||
      typeof countedUnits !== "number" ||
      typeof updatedAt !== "string"
    ) {
      return [];
    }
    if (locationName !== undefined && typeof locationName !== "string") {
      return [];
    }
    if (!Number.isFinite(countedUnits)) {
      return [];
    }
    return [
      {
        id,
        locationId,
        locationName,
        productId,
        productName,
        barcode,
        countedUnits,
        updatedAt
      }
    ];
  });
};

export const loadBaselineEntries = (): BaselineCountEntry[] => {
  if (typeof window === "undefined") {
    return emptyStore.entries;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyStore.entries;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return emptyStore.entries;
    }
    return parseEntries(parsed.entries);
  } catch {
    return emptyStore.entries;
  }
};

export const saveBaselineEntries = (entries: BaselineCountEntry[]) => {
  if (typeof window === "undefined") {
    return;
  }
  const payload: LocalBaselineStore = {
    version: 1,
    entries
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const upsertBaselineEntry = (entry: BaselineCountEntry) => {
  const entries = loadBaselineEntries();
  const index = entries.findIndex(
    (current) =>
      current.locationId === entry.locationId &&
      current.productId === entry.productId
  );
  let nextEntries: BaselineCountEntry[];
  if (index >= 0) {
    nextEntries = entries.map((current, currentIndex) =>
      currentIndex === index ? entry : current
    );
  } else {
    nextEntries = [...entries, entry];
  }
  saveBaselineEntries(nextEntries);
  return nextEntries;
};

export const getBaselineForLocation = (locationId: string) => {
  return loadBaselineEntries()
    .filter((entry) => entry.locationId === locationId)
    .sort((a, b) => a.productName.localeCompare(b.productName));
};

export const clearBaselineForLocation = (locationId: string) => {
  const entries = loadBaselineEntries();
  const nextEntries = entries.filter((entry) => entry.locationId !== locationId);
  saveBaselineEntries(nextEntries);
  return nextEntries;
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

export const exportBaselineCsv = (locationId: string) => {
  const entries = getBaselineForLocation(locationId);
  const rows = [
    [
      "locationId",
      "locationName",
      "productId",
      "productName",
      "barcode",
      "countedUnits",
      "updatedAt"
    ],
    ...entries.map((entry) => [
      entry.locationId,
      entry.locationName ?? "",
      entry.productId,
      entry.productName,
      entry.barcode,
      entry.countedUnits,
      entry.updatedAt
    ])
  ];
  return rows
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");
};
