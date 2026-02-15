export const CONCIERGE_SESSION_STORAGE_KEY = "champagne_concierge_v1";

const MAX_VISITED_PATHS = 25;
const MAX_SUMMARY_LENGTH = 240;

export type IntentStage = "BROWSE" | "CONSIDER" | "READY" | "URGENT";

export type ConciergeSessionState = {
  visitedPaths: string[];
  lastSeenPath: string;
  intentStage: IntentStage;
  sessionSummary: string;
};

const DEFAULT_STATE: ConciergeSessionState = {
  visitedPaths: [],
  lastSeenPath: "/",
  intentStage: "BROWSE",
  sessionSummary: "",
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

function sanitizePath(pathname: string): string {
  const path = pathname.trim();
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function saveSessionState(next: ConciergeSessionState): ConciergeSessionState {
  const storage = getStorage();
  if (!storage) {
    return next;
  }

  storage.setItem(CONCIERGE_SESSION_STORAGE_KEY, JSON.stringify(next));
  return next;
}

function parseSessionState(raw: string | null): ConciergeSessionState {
  if (!raw) {
    return { ...DEFAULT_STATE };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ConciergeSessionState>;
    const visitedPaths = Array.isArray(parsed.visitedPaths)
      ? parsed.visitedPaths.filter((value): value is string => typeof value === "string").slice(-MAX_VISITED_PATHS)
      : [];

    return {
      visitedPaths,
      lastSeenPath: typeof parsed.lastSeenPath === "string" ? sanitizePath(parsed.lastSeenPath) : DEFAULT_STATE.lastSeenPath,
      intentStage: isIntentStage(parsed.intentStage) ? parsed.intentStage : DEFAULT_STATE.intentStage,
      sessionSummary: typeof parsed.sessionSummary === "string" ? parsed.sessionSummary : DEFAULT_STATE.sessionSummary,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function isIntentStage(value: unknown): value is IntentStage {
  return value === "BROWSE" || value === "CONSIDER" || value === "READY" || value === "URGENT";
}

export function getSessionState(): ConciergeSessionState {
  const storage = getStorage();
  return parseSessionState(storage?.getItem(CONCIERGE_SESSION_STORAGE_KEY) ?? null);
}

export function updateVisitedPath(pathname: string): ConciergeSessionState {
  const state = getSessionState();
  const normalized = sanitizePath(pathname);
  const dedupedPaths = state.visitedPaths.filter((path) => path !== normalized);
  const visitedPaths = [...dedupedPaths, normalized].slice(-MAX_VISITED_PATHS);

  return saveSessionState({
    ...state,
    visitedPaths,
    lastSeenPath: normalized,
  });
}

export function setIntentStage(stage: IntentStage): ConciergeSessionState {
  const state = getSessionState();
  return saveSessionState({
    ...state,
    intentStage: stage,
  });
}

export function getIntentStage(): IntentStage {
  return getSessionState().intentStage;
}

export function sanitizeSessionSummary(summary: string): string {
  const trimmed = summary.trim();
  if (!trimmed || trimmed.length > MAX_SUMMARY_LENGTH) {
    return "";
  }

  const withoutEmails = trimmed.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]");
  const withoutPhones = withoutEmails.replace(/\b(?:\+?\d[\d().\s-]{7,}\d)\b/g, "[redacted-phone]");
  const withoutDobNumeric = withoutPhones.replace(/\b(?:0?[1-9]|1[0-2])[/-](?:0?[1-9]|[12]\d|3[01])[/-](?:19|20)?\d{2}\b/g, "[redacted-dob]");
  const withoutDobIso = withoutDobNumeric.replace(/\b(?:19|20)\d{2}[/-](?:0?[1-9]|1[0-2])[/-](?:0?[1-9]|[12]\d|3[01])\b/g, "[redacted-dob]");

  return withoutDobIso.length <= MAX_SUMMARY_LENGTH ? withoutDobIso : "";
}

export function setSessionSummary(summary: string): ConciergeSessionState {
  const state = getSessionState();
  const sessionSummary = sanitizeSessionSummary(summary);

  return saveSessionState({
    ...state,
    sessionSummary,
  });
}

const URGENT_KEYWORDS = ["emergency", "urgent", "bleeding", "severe pain", "anaphylaxis", "asap", "immediately"];
const BOOKING_KEYWORDS = ["book", "booking", "schedule", "appointment", "consult", "consultation", "reserve"];
const COST_KEYWORDS = ["cost", "price", "pricing", "finance", "financing", "payment", "payments", "fee", "fees"];
const TREATMENT_KEYWORDS = [
  "treatment",
  "botox",
  "filler",
  "laser",
  "peel",
  "facial",
  "morpheus",
  "injectable",
  "microneedling",
  "skin",
];

function containsKeyword(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword));
}

export function classifyIntentStage(message: string): IntentStage {
  const normalized = message.toLowerCase();

  if (containsKeyword(normalized, URGENT_KEYWORDS)) {
    return "URGENT";
  }

  if (containsKeyword(normalized, BOOKING_KEYWORDS)) {
    return "READY";
  }

  if (containsKeyword(normalized, COST_KEYWORDS) && containsKeyword(normalized, TREATMENT_KEYWORDS)) {
    return "CONSIDER";
  }

  return "BROWSE";
}
