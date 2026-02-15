import { NextResponse } from "next/server";

type ConverseRequest = {
  text?: unknown;
  pageContext?: unknown;
};

function getEngineBaseUrl(): string {
  return process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL ?? "";
}

function resolveDebugHeader(request: Request): Record<string, string> {
  const debugHeader = request.headers.get("x-debug-chat");
  return debugHeader === "1" ? { "x-debug-chat": "1" } : {};
}

async function parseRequestBody(request: Request): Promise<ConverseRequest | null> {
  try {
    return (await request.json()) as ConverseRequest;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const body = await parseRequestBody(request);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const engineBaseUrl = getEngineBaseUrl();
  if (!engineBaseUrl) {
    return NextResponse.json({ error: "engine is unavailable" }, { status: 503 });
  }

  const upstreamResponse = await fetch(`${engineBaseUrl}/v1/converse`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...resolveDebugHeader(request),
    },
    body: JSON.stringify({ text, pageContext: body?.pageContext }),
  });

  const payload = await upstreamResponse.json();
  return NextResponse.json(payload, { status: upstreamResponse.status });
}
