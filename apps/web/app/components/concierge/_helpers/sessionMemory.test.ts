import { beforeEach, describe, expect, it } from "vitest";
import {
  classifyIntentStage,
  CONCIERGE_SESSION_STORAGE_KEY,
  getSessionState,
  sanitizeSessionSummary,
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
  Object.defineProperty(globalThis, "window", {
    value: { sessionStorage: new MemoryStorage() },
    writable: true,
    configurable: true,
  });
});

describe("sanitizeSessionSummary", () => {
  it("redacts email, phone, and dob patterns", () => {
    const input = "Contact me at hello@example.com or +1 (415) 555-1212, DOB 08/12/1990";
    const sanitized = sanitizeSessionSummary(input);

    expect(sanitized).not.toContain("hello@example.com");
    expect(sanitized).not.toContain("415");
    expect(sanitized).not.toContain("08/12/1990");
    expect(sanitized).toContain("[redacted-email]");
    expect(sanitized).toContain("[redacted-phone]");
    expect(sanitized).toContain("[redacted-dob]");
  });

  it("blocks summaries longer than 240 characters", () => {
    const longSummary = "a".repeat(241);
    expect(sanitizeSessionSummary(longSummary)).toBe("");
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

describe("updateVisitedPath", () => {
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

  it("stores state under concierge session key", () => {
    updateVisitedPath("/treatment");
    expect(window.sessionStorage.getItem(CONCIERGE_SESSION_STORAGE_KEY)).not.toBeNull();
  });
});
