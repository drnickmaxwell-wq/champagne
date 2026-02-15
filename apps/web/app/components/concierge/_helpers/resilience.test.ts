import { describe, expect, it } from "vitest";
import {
  PRIVACY_TRIPWIRE_PREFIX,
  buildConverseHeaders,
  createCooldownUntil,
  getCooldownRemainingSeconds,
  isBlockedHttpStatus,
  isBlockedNetworkError,
  isPrivacyTripwireContent,
  isRateLimit429Payload,
} from "./resilience";

describe("resilience helpers", () => {
  it("detects 429 rate limit payload and exposes cooldown seconds", () => {
    expect(isRateLimit429Payload(429, { error: "rate limit exceeded" })).toBe(true);
    const until = createCooldownUntil(1_000, 20);
    expect(getCooldownRemainingSeconds(until, 1_000)).toBe(20);
  });

  it("detects blocked http and network failures", () => {
    expect(isBlockedHttpStatus(403)).toBe(true);
    expect(isBlockedNetworkError(new TypeError("Failed to fetch"))).toBe(true);
  });

  it("detects privacy tripwire prefix for text-only rendering", () => {
    expect(isPrivacyTripwireContent(`${PRIVACY_TRIPWIRE_PREFIX} please avoid personal details.`)).toBe(true);
  });

  it("keeps debug header gated off by default", () => {
    expect(buildConverseHeaders({ debugEnabled: false, isDev: true })).toEqual({
      "Content-Type": "application/json",
    });
    expect(buildConverseHeaders({ debugEnabled: true, isDev: false })).toEqual({
      "Content-Type": "application/json",
    });
  });
});
