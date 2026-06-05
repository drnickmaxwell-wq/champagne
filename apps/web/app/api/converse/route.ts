import { NextResponse } from "next/server";

type ConverseRequest = {
  text?: unknown;
  pageContext?: unknown;
};

type ConverseCardAction = {
  type?: unknown;
  label?: unknown;
  href?: unknown;
  payload?: unknown;
};

type ConverseCard = {
  title?: unknown;
  description?: unknown;
  body?: unknown;
  actions?: unknown;
};

type ConversePayload = {
  conversationId?: unknown;
  content?: unknown;
  ui?: {
    kind?: unknown;
    cards?: unknown;
  };
};

type SafeConverseAction =
  | { type: "link"; label: string; href: string }
  | { type: "postback"; label: string; payload: string };

type SafeConverseCard = {
  title?: string;
  description?: string;
  actions?: SafeConverseAction[];
};

type SafeConversePayload = {
  conversationId?: string;
  content: string;
  ui?: {
    kind: "cards";
    cards: SafeConverseCard[];
  };
};

const SAFE_PUBLIC_LINK_HREFS = new Set(["/contact"]);

const SAFE_FALLBACK_CONTENT =
  "I can guide you to safe contact options, but the practice team must advise on personal or urgent concerns.";

const FORBIDDEN_PUBLIC_RESPONSE_PATTERN =
  /(?:certification|readiness|personality|codex|agent\s+(?:execution|runtime|bridge)|dev\s+(?:execution|bridge|console)|dentally|pms|receptionist|recall|treatment coordinator|model\s+(?:call|activation)|memory|personalisation|personalization|phi|personal health information)/i;

function isSafeUserFacingText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && !FORBIDDEN_PUBLIC_RESPONSE_PATTERN.test(value);
}

function stringifySafeHandoffPayload(payload: unknown): string | null {
  if (typeof payload === "string") {
    return isSafeHandoffPayload(payload) ? payload : null;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const parsed = payload as { kind?: unknown; form?: unknown; type?: unknown };
  if (parsed.kind === "handoff" && parsed.form === "booking") {
    return JSON.stringify({ kind: "handoff", form: "booking" });
  }

  if (parsed.kind === "handoff" && parsed.form === "emergency_callback") {
    return JSON.stringify({ kind: "handoff", form: "emergency_callback" });
  }

  if (parsed.kind === "handoff" && parsed.form === "new_patient") {
    return JSON.stringify({ kind: "handoff", form: "new_patient" });
  }

  if (parsed.type === "BOOKING") {
    return "BOOKING";
  }

  if (parsed.type === "EMERGENCY_CALLBACK") {
    return "EMERGENCY_CALLBACK";
  }

  if (parsed.type === "NEW_PATIENT") {
    return "NEW_PATIENT";
  }

  return null;
}

function isSafeHandoffPayload(payload: string): boolean {
  const normalized = payload.trim();
  return normalized === "BOOKING_REQUEST"
    || normalized === "BOOKING"
    || normalized === "EMERGENCY_CALLBACK"
    || normalized === "NEW_PATIENT";
}

function isSafePublicLink(href: unknown): href is string {
  if (typeof href !== "string") return false;
  return SAFE_PUBLIC_LINK_HREFS.has(href) || href.startsWith("/contact?") || href.startsWith("/contact#");
}

function sanitizeConverseAction(action: ConverseCardAction): SafeConverseAction | null {
  if (!isSafeUserFacingText(action.label)) {
    return null;
  }

  if (action.type === "link" && isSafePublicLink(action.href)) {
    return { type: "link", label: action.label, href: action.href };
  }

  if (action.type === "postback") {
    const safePayload = stringifySafeHandoffPayload(action.payload);
    if (safePayload) {
      return { type: "postback", label: action.label, payload: safePayload };
    }
  }

  return null;
}

function sanitizeConverseCard(card: ConverseCard): SafeConverseCard | null {
  const title = isSafeUserFacingText(card.title) ? card.title : undefined;
  const descriptionSource = card.description ?? card.body;
  const description = isSafeUserFacingText(descriptionSource) ? descriptionSource : undefined;
  const actions = Array.isArray(card.actions)
    ? card.actions
      .filter((action): action is ConverseCardAction => Boolean(action) && typeof action === "object")
      .map(sanitizeConverseAction)
      .filter((action): action is SafeConverseAction => Boolean(action))
    : undefined;

  if (!title && !description && !actions?.length) {
    return null;
  }

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(actions?.length ? { actions } : {}),
  };
}

function sanitizeConversePayload(payload: unknown): SafeConversePayload {
  const parsed = payload && typeof payload === "object" ? payload as ConversePayload : {};
  const content = isSafeUserFacingText(parsed.content) ? parsed.content : SAFE_FALLBACK_CONTENT;
  const cards = parsed.ui?.kind === "cards" && Array.isArray(parsed.ui.cards)
    ? parsed.ui.cards
      .filter((card): card is ConverseCard => Boolean(card) && typeof card === "object")
      .map(sanitizeConverseCard)
      .filter((card): card is SafeConverseCard => Boolean(card))
    : [];

  return {
    ...(typeof parsed.conversationId === "string" && parsed.conversationId.trim().length > 0
      ? { conversationId: parsed.conversationId.trim() }
      : {}),
    content,
    ...(cards.length ? { ui: { kind: "cards" as const, cards } } : {}),
  };
}

function safePublicErrorMessage(status: number): string {
  if (status === 429) {
    return "Concierge is a little busy right now. Please try again in a moment.";
  }

  if (status >= 500) {
    return "Concierge is briefly unavailable. Please try again shortly.";
  }

  return "I could not complete that request just now. Please try again.";
}

function getEngineBaseUrl(): string {
  return process.env.CHATBOT_ENGINE_URL ?? process.env.NEXT_PUBLIC_CHATBOT_ENGINE_URL ?? "";
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

  const payload = await upstreamResponse.json().catch(() => null);

  if (!upstreamResponse.ok) {
    return NextResponse.json({ error: safePublicErrorMessage(upstreamResponse.status) }, { status: upstreamResponse.status });
  }

  return NextResponse.json(sanitizeConversePayload(payload), { status: upstreamResponse.status });
}
