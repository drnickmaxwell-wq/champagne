import { NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited, resolveClientIp } from "../_shared";

const BookingRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().nullable().optional(),
  contactMethod: z.enum(["phone", "sms", "email"]),
  timeWindow: z.string().trim().min(1).max(140),
  reason: z.string().trim().min(1).max(280),
  consent: z.literal(true),
  honeypot: z.string().trim().max(0).optional(),
  startedAt: z.number(),
  tenantId: z.string().trim().min(1).max(80).optional(),
});

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const webhookUrl = process.env.HANDOFF_BOOKING_WEBHOOK_URL;
  if (!webhookUrl) {
    console.info(`[handoff-booking] requestId=${requestId} status=missing_webhook`);
    return NextResponse.json(
      { error: "Booking handoff is not configured." },
      { status: 500 },
    );
  }

  const clientIp = resolveClientIp(request);
  if (isRateLimited(clientIp)) {
    console.info(`[handoff-booking] requestId=${requestId} status=rate_limited`);
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = BookingRequestSchema.safeParse(payload);

  if (!parsed.success) {
    console.info(`[handoff-booking] requestId=${requestId} status=invalid`);
    return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
  }

  if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
    console.info(`[handoff-booking] requestId=${requestId} status=bot_blocked`);
    return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
  }

  const now = Date.now();
  const elapsedMs = now - parsed.data.startedAt;
  if (elapsedMs < 1500 || elapsedMs > 1000 * 60 * 60 * 2) {
    console.info(`[handoff-booking] requestId=${requestId} status=bot_timing`);
    return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
  }

  const tenantId = parsed.data.tenantId ?? "default";

  const forwardPayload = {
    requestId,
    tenantId,
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email ?? undefined,
    contactMethod: parsed.data.contactMethod,
    timeWindow: parsed.data.timeWindow,
    reason: parsed.data.reason,
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
      console.info(`[handoff-booking] requestId=${requestId} status=webhook_failed`);
      return NextResponse.json({ error: "Failed to send request." }, { status: 502 });
    }

    console.info(`[handoff-booking] requestId=${requestId} status=ok`);
    return NextResponse.json({ ok: true });
  } catch {
    console.info(`[handoff-booking] requestId=${requestId} status=webhook_error`);
    return NextResponse.json({ error: "Failed to send request." }, { status: 502 });
  }
}
