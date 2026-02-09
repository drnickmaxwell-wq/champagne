import { DRAFT_STATUS, type DraftStatus } from "./orderDraftStatus";

type OrderDraftStatusEntry = {
  locationId: string;
  status: DraftStatus;
};

type OrderDraftStatusStore = {
  version: 1;
  entries: OrderDraftStatusEntry[];
};

const STORAGE_KEY = "stock.orderDraftStatus.v1";

const emptyStore: OrderDraftStatusStore = {
  version: 1,
  entries: []
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parseStatus = (value: unknown): DraftStatus | null => {
  if (value === DRAFT_STATUS.draft) {
    return DRAFT_STATUS.draft;
  }
  if (value === DRAFT_STATUS.frozen) {
    return DRAFT_STATUS.frozen;
  }
  if (value === DRAFT_STATUS.archived) {
    return DRAFT_STATUS.archived;
  }
  return null;
};

const parseEntries = (value: unknown): OrderDraftStatusEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }
    const { locationId, status } = entry;
    if (typeof locationId !== "string") {
      return [];
    }
    const parsedStatus = parseStatus(status);
    if (!parsedStatus) {
      return [];
    }
    return [
      {
        locationId,
        status: parsedStatus
      }
    ];
  });
};

const loadStore = (): OrderDraftStatusStore => {
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
      entries: parseEntries(parsed.entries)
    };
  } catch {
    return emptyStore;
  }
};

const saveStore = (store: OrderDraftStatusStore) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const getOrderDraftStatus = (locationId: string): DraftStatus => {
  const store = loadStore();
  const entry = store.entries.find((item) => item.locationId === locationId);
  return entry?.status ?? DRAFT_STATUS.draft;
};

export const setOrderDraftStatus = (locationId: string, status: DraftStatus) => {
  const store = loadStore();
  const entries = store.entries.some((item) => item.locationId === locationId)
    ? store.entries.map((item) =>
        item.locationId === locationId ? { ...item, status } : item
      )
    : [...store.entries, { locationId, status }];
  saveStore({ version: 1, entries });
};
