import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

afterEach(() => {
  vi.restoreAllMocks();
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
      new Response(JSON.stringify({ content: "ok" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = new Request("http://localhost/api/converse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-debug-chat": "1",
      },
      body: JSON.stringify({ text: "hello", pageContext: { pathname: "/team" } }),
    });

    const response = await POST(request);

    expect(fetchMock).toHaveBeenCalledWith("https://engine.test/v1/converse", {
      method: "POST",
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
      headers: {
        "Content-Type": "application/json",
        "x-debug-chat": "0",
      },
      body: JSON.stringify({ text: "hello" }),
    });

    await POST(request);

    expect(fetchMock).toHaveBeenCalledWith("https://engine.test/v1/converse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: "hello", pageContext: undefined }),
    });
  });
});
