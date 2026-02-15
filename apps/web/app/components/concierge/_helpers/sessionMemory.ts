export const CONCIERGE_SESSION_STORAGE_KEY = "champagne_concierge_v1";

const MAX_VISITED_PATHS = 25;
const MAX_TOPIC_HINTS = 10;
const MAX_PAGE_SIGNALS = 25;
const MAX_VISITS_PER_PATH = 99;

type PageSignal = {
  visits: number;
  lastVisitedAt: number;
};

export type IntentStage = "BROWSE" | "CONSIDER" | "READY" | "URGENT";

export type ConciergeSessionState = {
  visitedPaths: string[];
  lastSeenPath: string;
  intentStage: IntentStage;
  topicHints: string[];
  pageSignals: Record<string, PageSignal>;
};

const DEFAULT_STATE: ConciergeSessionState = {
  visitedPaths: [],
  lastSeenPath: "/",
  intentStage: "BROWSE",
  topicHints: [],
  pageSignals: {},
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

    const topicHints = Array.isArray(parsed.topicHints)
      ? parsed.topicHints
        .filter((value): value is string => typeof value === "string")
        .map((token) => token.trim().toLowerCase())
        .filter((token) => isSafeTopicToken(token))
        .slice(-MAX_TOPIC_HINTS)
      : [];

    const rawPageSignals = parsed.pageSignals && typeof parsed.pageSignals === "object" && !Array.isArray(parsed.pageSignals)
      ? parsed.pageSignals
      : {};

    const pageSignals = Object.fromEntries(
      Object.entries(rawPageSignals)
        .filter((entry) => typeof entry[0] === "string" && isPageSignal(entry[1]))
        .map(([path, value]) => {
          const signal = value as PageSignal;
          return [sanitizePath(path), { visits: Math.min(Math.max(signal.visits, 0), MAX_VISITS_PER_PATH), lastVisitedAt: signal.lastVisitedAt }];
        })
        .slice(-MAX_PAGE_SIGNALS),
    );

    return {
      visitedPaths,
      lastSeenPath: typeof parsed.lastSeenPath === "string" ? sanitizePath(parsed.lastSeenPath) : DEFAULT_STATE.lastSeenPath,
      intentStage: isIntentStage(parsed.intentStage) ? parsed.intentStage : DEFAULT_STATE.intentStage,
      topicHints,
      pageSignals,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function isPageSignal(value: unknown): value is PageSignal {
  return Boolean(
    value
      && typeof value === "object"
      && typeof (value as PageSignal).visits === "number"
      && Number.isFinite((value as PageSignal).visits)
      && typeof (value as PageSignal).lastVisitedAt === "number"
      && Number.isFinite((value as PageSignal).lastVisitedAt),
  );
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
  const currentSignal = state.pageSignals[normalized];
  const nextPageSignals = {
    ...state.pageSignals,
    [normalized]: {
      visits: Math.min((currentSignal?.visits ?? 0) + 1, MAX_VISITS_PER_PATH),
      lastVisitedAt: Date.now(),
    },
  };

  const pageSignals = Object.fromEntries(
    Object.entries(nextPageSignals)
      .sort(([, left], [, right]) => left.lastVisitedAt - right.lastVisitedAt)
      .slice(-MAX_PAGE_SIGNALS),
  );

  const topicHints = mergeTopicHints(state.topicHints, deriveTopicHintsFromPathname(normalized));

  return saveSessionState({
    ...state,
    visitedPaths,
    lastSeenPath: normalized,
    topicHints,
    pageSignals,
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

function isSafeTopicToken(token: string): boolean {
  return /^[a-z0-9]+$/.test(token) && token.length >= 2;
}

export function deriveTopicHintsFromPathname(pathname: string): string[] {
  const normalized = sanitizePath(pathname).toLowerCase();
  const uniqueTokens = new Set<string>();

  normalized
    .split("/")
    .flatMap((segment) => segment.split("-"))
    .map((segment) => segment.trim())
    .filter(Boolean)
    .forEach((segment) => {
      if (isSafeTopicToken(segment)) {
        uniqueTokens.add(segment);
      }
    });

  return [...uniqueTokens].slice(0, MAX_TOPIC_HINTS);
}

function mergeTopicHints(existingHints: string[], nextHints: string[]): string[] {
  const deduped = [...existingHints, ...nextHints].reduce<string[]>((accumulator, token) => {
    if (accumulator.includes(token)) {
      return accumulator;
    }

    return [...accumulator, token];
  }, []);

  return deduped.slice(-MAX_TOPIC_HINTS);
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
