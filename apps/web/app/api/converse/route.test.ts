import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.CHATBOT_ENGINE_URL;
  delete process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL;
});

describe("POST /api/converse", () => {
  it("returns 400 when text is missing", async () => {
    const request = new Request("http://localhost/api/converse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "text is required" });
  });

  it("forwards to engine with pageContext and optional debug header", async () => {
    process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL = "https://engine.test";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ content: "ok", certification: "internal" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost/api/converse", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-debug-chat": "1",
      },
      body: JSON.stringify({ text: "hello", pageContext: { pathname: "/team" } }),
    });

    const response = await POST(request);

    expect(fetchMock).toHaveBeenCalledWith("https://engine.test/v1/converse", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-debug-chat": "1",
      },
      body: JSON.stringify({ text: "hello", pageContext: { pathname: "/team" } }),
    });
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ content: "ok" });
  });

  it("does not forward x-debug-chat unless it equals 1", async () => {
    process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL = "https://engine.test";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ content: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost/api/converse", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "x-debug-chat": "0",
      },
      body: JSON.stringify({ text: "hello" }),
    });

    await POST(request);

    expect(fetchMock).toHaveBeenCalledWith("https://engine.test/v1/converse", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: "hello", pageContext: undefined }),
    });
  });

  it("filters forbidden public/runtime metadata and unsafe actions from successful responses", async () => {
    process.env.CHATBOT_ENGINE_URL = "https://engine.test";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          conversationId: " conversation-1 ",
          content: "Captain certification readiness metadata should not render.",
          certification: "DO_NOT_SHOW",
          personality: { mode: "internal" },
          ui: {
            kind: "cards",
            cards: [
              {
                title: "Safe options",
                description: "Use contact or governed handoff routes only.",
                actions: [
                  { type: "link", label: "Contact", href: "/contact" },
                  { type: "link", label: "Codex deploy bridge", href: "/api/dev/codex/deploy" },
                  { type: "postback", label: "Booking request", payload: { kind: "handoff", form: "booking" } },
                  { type: "postback", label: "Recall receptionist", payload: "RECALL" },
                ],
              },
              {
                title: "Dentally certification metadata",
                description: "PMS agent runtime bridge",
              },
            ],
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost/api/converse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "hello" }),
    });

    const response = await POST(request);
    const payload = await response.json();
    const publicText = JSON.stringify(payload);

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      conversationId: "conversation-1",
      content: "I can guide you to safe contact options, but the practice team must advise on personal or urgent concerns.",
      ui: {
        kind: "cards",
        cards: [
          {
            title: "Safe options",
            description: "Use contact or governed handoff routes only.",
            actions: [
              { type: "link", label: "Contact", href: "/contact" },
              { type: "postback", label: "Booking request", payload: JSON.stringify({ kind: "handoff", form: "booking" }) },
            ],
          },
        ],
      },
    });
    expect(publicText).not.toMatch(/certification|personality|codex|deploy|dentally|pms|agent runtime|receptionist|recall|DO_NOT_SHOW/i);
  });

  it("normalizes blocked upstream responses to safe public wording only", async () => {
    process.env.CHATBOT_ENGINE_URL = "https://engine.test";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Captain readiness certification blocked by internal policy" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost/api/converse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "hello" }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({ error: "I could not complete that request just now. Please try again." });
    expect(JSON.stringify(payload)).not.toMatch(/readiness|certification|internal/i);
  });
});
