export type ExpiryActionStatus = "none" | "quarantine" | "disposed";

export type ExpiryActionRecord = {
  status: ExpiryActionStatus;
  updatedAt: string;
  note?: string;
};

type ExpiryActionsStore = {
  version: 1;
  actions: Record<string, ExpiryActionRecord>;
};

const STORAGE_KEY = "stock.expiryActions.v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const lotKey = (lotId: string, expiryDate: string) => `${lotId}::${expiryDate}`;

export const loadExpiryActions = (): Record<string, ExpiryActionRecord> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.actions)) return {};
    return parsed.actions as Record<string, ExpiryActionRecord>;
  } catch {
    return {};
  }
};

const save = (actions: Record<string, ExpiryActionRecord>) => {
  if (typeof window === "undefined") return;
  const payload: ExpiryActionsStore = { version: 1, actions };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const getStatus = (lotId: string, expiryDate: string): ExpiryActionStatus => {
  return loadExpiryActions()[lotKey(lotId, expiryDate)]?.status ?? "none";
};

export const setStatus = (
  lotId: string,
  expiryDate: string,
  status: ExpiryActionStatus,
  note?: string
) => {
  const key = lotKey(lotId, expiryDate);
  const next = { ...loadExpiryActions() };
  if (status === "none") {
    delete next[key];
  } else {
    next[key] = {
      status,
      updatedAt: new Date().toISOString(),
      note
    };
  }
  save(next);
  return next;
};

export const clear = (lotId: string, expiryDate: string) => {
  return setStatus(lotId, expiryDate, "none");
};
