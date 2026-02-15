import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetHandoffRateLimitStateForTests } from "../_shared";
import { POST } from "./route";

function validPayload(startedAt = Date.now() - 2_000) {
  return {
    name: "Jane Doe",
    phone: "07123456789",
    email: "jane@example.com",
    contactMethod: "email",
    enquiry: "I am new to the practice",
    consent: true,
    honeypot: "",
    startedAt,
  };
}

beforeEach(() => {
  process.env.HANDOFF_NEW_PATIENT_WEBHOOK_URL = "https://webhook.test/new-patient";
  process.env.HANDOFF_RATE_LIMIT_WINDOW_MS = "60000";
  process.env.HANDOFF_RATE_LIMIT_MAX = "5";
  resetHandoffRateLimitStateForTests();
  vi.spyOn(console, "info").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.HANDOFF_NEW_PATIENT_WEBHOOK_URL;
  delete process.env.HANDOFF_RATE_LIMIT_WINDOW_MS;
  delete process.env.HANDOFF_RATE_LIMIT_MAX;
  resetHandoffRateLimitStateForTests();
});

describe("POST /api/handoff/new-patient", () => {
  it("rejects invalid schema payload", async () => {
    const request = new Request("http://localhost/api/handoff/new-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "21.21.21.21" },
      body: JSON.stringify({ name: "Jane", consent: true, startedAt: Date.now() - 2_000, contactMethod: "email" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid new patient request." });
  });

  it("rejects honeypot and timing failures", async () => {
    const honeypotRequest = new Request("http://localhost/api/handoff/new-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "22.22.22.22" },
      body: JSON.stringify({ ...validPayload(), honeypot: "bot" }),
    });

    const honeypotResponse = await POST(honeypotRequest);
    expect(honeypotResponse.status).toBe(400);
    await expect(honeypotResponse.json()).resolves.toEqual({ error: "Invalid new patient request." });

    const timingRequest = new Request("http://localhost/api/handoff/new-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "23.23.23.23" },
      body: JSON.stringify(validPayload(Date.now() - 500)),
    });

    const timingResponse = await POST(timingRequest);
    expect(timingResponse.status).toBe(400);
    await expect(timingResponse.json()).resolves.toEqual({ error: "Invalid new patient request." });
  });

  it("returns 429 with canonical body when rate-limited", async () => {
    process.env.HANDOFF_RATE_LIMIT_MAX = "1";
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const firstRequest = new Request("http://localhost/api/handoff/new-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "24.24.24.24" },
      body: JSON.stringify(validPayload()),
    });

    const secondRequest = new Request("http://localhost/api/handoff/new-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "24.24.24.24" },
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

    const request = new Request("http://localhost/api/handoff/new-patient", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "25.25.25.25" },
      body: JSON.stringify(validPayload()),
    });

    const response = await POST(request);

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "Failed to send request." });
  });
});
