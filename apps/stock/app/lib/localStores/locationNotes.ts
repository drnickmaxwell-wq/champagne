export type LocationNoteStore = {
  version: 1;
  notes: Record<string, string>;
};

const STORAGE_KEY = "stock.locationNotes.v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const loadLocationNotes = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.notes)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed.notes).filter((entry): entry is [string, string] => {
        return typeof entry[0] === "string" && typeof entry[1] === "string";
      })
    );
  } catch {
    return {};
  }
};

export const saveLocationNotes = (notes: Record<string, string>) => {
  if (typeof window === "undefined") {
    return;
  }
  const payload: LocationNoteStore = {
    version: 1,
    notes
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const getNote = (locationId: string) => {
  return loadLocationNotes()[locationId] ?? "";
};

export const setNote = (locationId: string, note: string) => {
  const current = loadLocationNotes();
  const next = { ...current };
  const trimmed = note.trim();
  if (trimmed.length === 0) {
    delete next[locationId];
  } else {
    next[locationId] = note;
  }
  saveLocationNotes(next);
  return next;
};

export const clearNotes = () => {
  saveLocationNotes({});
};
