import { NextResponse } from "next/server";
import { z } from "zod";

const RATE_LIMIT_WINDOW_MS = Number(process.env.HANDOFF_RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MAX = Number(process.env.HANDOFF_RATE_LIMIT_MAX ?? 5);

type RateLimitState = {
  hits: Map<string, number[]>;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  __handoffRateLimitState?: RateLimitState;
};

const rateLimitState: RateLimitState =
  globalForRateLimit.__handoffRateLimitState ??
  (globalForRateLimit.__handoffRateLimitState = { hits: new Map() });

const NewPatientSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(5).max(40).nullable().optional(),
    email: z.string().trim().email().nullable().optional(),
    contactMethod: z.enum(["phone", "sms", "email"]),
    enquiry: z.string().trim().max(280).optional(),
    consent: z.literal(true),
    honeypot: z.string().trim().max(0).optional(),
    startedAt: z.number(),
    tenantId: z.string().trim().min(1).max(80).optional(),
  })
  .refine((data) => !!data.phone || !!data.email, {
    message: "Phone or email is required.",
  });

const resolveClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
};

const isRateLimited = (clientIp: string) => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = rateLimitState.hits.get(clientIp)?.filter((ts) => ts > windowStart) ?? [];
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitState.hits.set(clientIp, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitState.hits.set(clientIp, timestamps);
  return false;
};

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const webhookUrl = process.env.HANDOFF_NEW_PATIENT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.info(`[handoff-new-patient] requestId=${requestId} status=missing_webhook`);
    return NextResponse.json(
      { error: "New patient handoff is not configured." },
      { status: 500 },
    );
  }

  const clientIp = resolveClientIp(request);
  if (isRateLimited(clientIp)) {
    console.info(`[handoff-new-patient] requestId=${requestId} status=rate_limited`);
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = NewPatientSchema.safeParse(payload);

  if (!parsed.success) {
    console.info(`[handoff-new-patient] requestId=${requestId} status=invalid`);
    return NextResponse.json({ error: "Invalid new patient request." }, { status: 400 });
  }

  if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
    console.info(`[handoff-new-patient] requestId=${requestId} status=bot_blocked`);
    return NextResponse.json({ error: "Invalid new patient request." }, { status: 400 });
  }

  const now = Date.now();
  const elapsedMs = now - parsed.data.startedAt;
  if (elapsedMs < 1500 || elapsedMs > 1000 * 60 * 60 * 2) {
    console.info(`[handoff-new-patient] requestId=${requestId} status=bot_timing`);
    return NextResponse.json({ error: "Invalid new patient request." }, { status: 400 });
  }

  const tenantId = parsed.data.tenantId ?? "default";

  const forwardPayload = {
    requestId,
    tenantId,
    name: parsed.data.name,
    phone: parsed.data.phone ?? undefined,
    email: parsed.data.email ?? undefined,
    contactMethod: parsed.data.contactMethod,
    enquiry: parsed.data.enquiry || undefined,
    consent: parsed.data.consent,
    submittedAt: new Date(now).toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forwardPayload),
    });

    if (!response.ok) {
      console.info(`[handoff-new-patient] requestId=${requestId} status=webhook_failed`);
      return NextResponse.json({ error: "Failed to send request." }, { status: 502 });
    }

    console.info(`[handoff-new-patient] requestId=${requestId} status=ok`);
    return NextResponse.json({ ok: true });
  } catch {
    console.info(`[handoff-new-patient] requestId=${requestId} status=webhook_error`);
    return NextResponse.json({ error: "Failed to send request." }, { status: 502 });
  }
}
