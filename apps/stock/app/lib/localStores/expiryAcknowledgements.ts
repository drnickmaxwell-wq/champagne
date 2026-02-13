export type ExpiryAckStore = {
  version: 1;
  acknowledged: Record<string, boolean>;
};

const STORAGE_KEY = "stock.expiryAck.v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const buildKey = (lotId: string, expiryDate: string) => `${lotId}::${expiryDate}`;

export const loadExpiryAcknowledgements = (): Record<string, boolean> => {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.acknowledged)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed.acknowledged).filter((entry): entry is [string, boolean] => {
        return typeof entry[0] === "string" && typeof entry[1] === "boolean";
      })
    );
  } catch {
    return {};
  }
};

export const isAcknowledged = (lotId: string, expiryDate: string) => {
  return Boolean(loadExpiryAcknowledgements()[buildKey(lotId, expiryDate)]);
};

export const setAcknowledged = (lotId: string, expiryDate: string, value: boolean) => {
  const current = loadExpiryAcknowledgements();
  const key = buildKey(lotId, expiryDate);
  const next = { ...current, [key]: value };
  if (!value) {
    delete next[key];
  }
  if (typeof window !== "undefined") {
    const payload: ExpiryAckStore = {
      version: 1,
      acknowledged: next
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
  return next;
};
