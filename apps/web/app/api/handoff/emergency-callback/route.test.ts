import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetHandoffRateLimitStateForTests } from "../_shared";
import { POST } from "./route";

function validPayload(startedAt = Date.now() - 2_000) {
  return {
    name: "Jane Doe",
    phone: "07123456789",
    preferredContactTime: "Afternoon",
    issueSummary: "Severe discomfort",
    consent: true,
    honeypot: "",
    startedAt,
  };
}

beforeEach(() => {
  process.env.HANDOFF_EMERGENCY_WEBHOOK_URL = "https://webhook.test/emergency";
  process.env.HANDOFF_RATE_LIMIT_WINDOW_MS = "60000";
  process.env.HANDOFF_RATE_LIMIT_MAX = "5";
  resetHandoffRateLimitStateForTests();
  vi.spyOn(console, "info").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.HANDOFF_EMERGENCY_WEBHOOK_URL;
  delete process.env.HANDOFF_RATE_LIMIT_WINDOW_MS;
  delete process.env.HANDOFF_RATE_LIMIT_MAX;
  resetHandoffRateLimitStateForTests();
});

describe("POST /api/handoff/emergency-callback", () => {
  it("rejects invalid schema payload", async () => {
    const request = new Request("http://localhost/api/handoff/emergency-callback", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "11.11.11.11" },
      body: JSON.stringify({ consent: true, startedAt: Date.now() - 2_000 }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid emergency request." });
  });

  it("rejects honeypot and timing failures", async () => {
    const honeypotRequest = new Request("http://localhost/api/handoff/emergency-callback", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "12.12.12.12" },
      body: JSON.stringify({ ...validPayload(), honeypot: "bot" }),
    });

    const honeypotResponse = await POST(honeypotRequest);
    expect(honeypotResponse.status).toBe(400);
    await expect(honeypotResponse.json()).resolves.toEqual({ error: "Invalid emergency request." });

    const timingRequest = new Request("http://localhost/api/handoff/emergency-callback", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "13.13.13.13" },
      body: JSON.stringify(validPayload(Date.now() - 500)),
    });

    const timingResponse = await POST(timingRequest);
    expect(timingResponse.status).toBe(400);
    await expect(timingResponse.json()).resolves.toEqual({ error: "Invalid emergency request." });
  });

  it("returns 429 with canonical body when rate-limited", async () => {
    process.env.HANDOFF_RATE_LIMIT_MAX = "1";
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const firstRequest = new Request("http://localhost/api/handoff/emergency-callback", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "14.14.14.14" },
      body: JSON.stringify(validPayload()),
    });

    const secondRequest = new Request("http://localhost/api/handoff/emergency-callback", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "14.14.14.14" },
      body: JSON.stringify(validPayload()),
    });

    const firstResponse = await POST(firstRequest);
    expect(firstResponse.status).toBe(200);

    const secondResponse = await POST(secondRequest);
    expect(secondResponse.status).toBe(429);
    await expect(secondResponse.json()).resolves.toEqual({ error: "Too many requests." });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("normalizes webhook failures to 502", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("upstream fail", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost/api/handoff/emergency-callback", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "15.15.15.15" },
      body: JSON.stringify(validPayload()),
    });

    const response = await POST(request);

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "Failed to send request." });
  });
});
