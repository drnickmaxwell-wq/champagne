import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  classifyIntentStage,
  CONCIERGE_SESSION_STORAGE_KEY,
  deriveTopicHintsFromPathname,
  getSessionState,
  setIntentStage,
  updateVisitedPath,
} from "./sessionMemory";

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

beforeEach(() => {
  vi.useRealTimers();
  Object.defineProperty(globalThis, "window", {
    value: { sessionStorage: new MemoryStorage() },
    writable: true,
    configurable: true,
  });
});

describe("classifyIntentStage", () => {
  it("returns URGENT for emergency-like keywords", () => {
    expect(classifyIntentStage("I have severe pain and need urgent help")).toBe("URGENT");
  });

  it("returns READY for booking keywords", () => {
    expect(classifyIntentStage("Can I schedule a consultation this week?")).toBe("READY");
  });

  it("returns CONSIDER for price+treated area signals", () => {
    expect(classifyIntentStage("What is the price for laser treatment?"))
      .toBe("CONSIDER");
  });

  it("returns BROWSE when no stronger signal exists", () => {
    expect(classifyIntentStage("Tell me about skin rejuvenation options")).toBe("BROWSE");
  });
});

describe("deriveTopicHintsFromPathname", () => {
  it("derives deterministic hints only from pathname tokens", () => {
    const hints = deriveTopicHintsFromPathname("/treatments/laser-skin-tightening");

    expect(hints).toEqual(["treatments", "laser", "skin", "tightening"]);
  });

  it("caps and filters unsafe tokens", () => {
    const hints = deriveTopicHintsFromPathname("/a/a1/aa-bb-cc-dd-ee-ff-gg-hh-ii-jj-kk-123");

    expect(hints).toHaveLength(10);
    expect(hints.every((token) => /^[a-z0-9]+$/.test(token))).toBe(true);
    expect(hints).not.toContain("a");
  });
});

describe("session storage state", () => {
  it("dedupes revisits and caps path history at 25", () => {
    for (let index = 0; index < 30; index += 1) {
      updateVisitedPath(`/page-${index}`);
    }

    updateVisitedPath("/page-28");

    const state = getSessionState();
    expect(state.visitedPaths.length).toBe(25);
    expect(state.visitedPaths.at(-1)).toBe("/page-28");
    expect(state.visitedPaths.filter((path) => path === "/page-28")).toHaveLength(1);
    expect(state.lastSeenPath).toBe("/page-28");
  });

  it("maintains capped pageSignals keyed by sanitized pathname", () => {
    vi.useFakeTimers();

    for (let index = 0; index < 30; index += 1) {
      vi.setSystemTime(new Date(2026, 0, 1, 0, 0, index));
      updateVisitedPath(`/path-${index}`);
    }

    vi.setSystemTime(new Date(2026, 0, 1, 0, 1, 0));
    updateVisitedPath("path-29");

    const state = getSessionState();

    expect(Object.keys(state.pageSignals)).toHaveLength(25);
    expect(state.pageSignals["/path-29"]?.visits).toBe(2);
    expect(state.pageSignals["/path-29"]?.lastVisitedAt).toBe(Date.now());
    expect(state.pageSignals["/path-0"]).toBeUndefined();
  });

  it("stores only safe page-derived memory fields, never user message text", () => {
    const userMessage = "This is urgent, my email is private@example.com and phone 415-555-0000";

    updateVisitedPath("/concierge/laser-treatment");
    setIntentStage(classifyIntentStage(userMessage));

    const rawState = window.sessionStorage.getItem(CONCIERGE_SESSION_STORAGE_KEY);
    expect(rawState).not.toBeNull();
    expect(rawState).not.toContain(userMessage);
    expect(rawState).not.toContain("private@example.com");

    const parsed = JSON.parse(rawState ?? "{}");
    expect(parsed).toMatchObject({
      lastSeenPath: "/concierge/laser-treatment",
      intentStage: "URGENT",
    });
    expect(parsed.topicHints).toEqual(["concierge", "laser", "treatment"]);
    expect(Object.keys(parsed.pageSignals)).toEqual(["/concierge/laser-treatment"]);
    expect(parsed.sessionSummary).toBeUndefined();
  });

  it("stores state under concierge session key", () => {
    updateVisitedPath("/treatment");
    expect(window.sessionStorage.getItem(CONCIERGE_SESSION_STORAGE_KEY)).not.toBeNull();
  });
});
