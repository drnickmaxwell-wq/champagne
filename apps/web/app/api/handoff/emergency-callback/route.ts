import { NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited, resolveClientIp } from "../_shared";

const EmergencyCallbackSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(40),
  preferredContactTime: z.string().trim().max(140).optional(),
  issueSummary: z.string().trim().max(280).optional(),
  consent: z.literal(true),
  honeypot: z.string().trim().max(0).optional(),
  startedAt: z.number(),
  tenantId: z.string().trim().min(1).max(80).optional(),
});

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const webhookUrl = process.env.HANDOFF_EMERGENCY_WEBHOOK_URL;
  if (!webhookUrl) {
    console.info(`[handoff-emergency] requestId=${requestId} status=missing_webhook`);
    return NextResponse.json(
      { error: "Emergency handoff is not configured." },
      { status: 500 },
    );
  }

  const clientIp = resolveClientIp(request);
  if (isRateLimited(clientIp)) {
    console.info(`[handoff-emergency] requestId=${requestId} status=rate_limited`);
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = EmergencyCallbackSchema.safeParse(payload);

  if (!parsed.success) {
    console.info(`[handoff-emergency] requestId=${requestId} status=invalid`);
    return NextResponse.json({ error: "Invalid emergency request." }, { status: 400 });
  }

  if (parsed.data.honeypot && parsed.data.honeypot.trim().length > 0) {
    console.info(`[handoff-emergency] requestId=${requestId} status=bot_blocked`);
    return NextResponse.json({ error: "Invalid emergency request." }, { status: 400 });
  }

  const now = Date.now();
  const elapsedMs = now - parsed.data.startedAt;
  if (elapsedMs < 1500 || elapsedMs > 1000 * 60 * 60 * 2) {
    console.info(`[handoff-emergency] requestId=${requestId} status=bot_timing`);
    return NextResponse.json({ error: "Invalid emergency request." }, { status: 400 });
  }

  const tenantId = parsed.data.tenantId ?? "default";

  const forwardPayload = {
    requestId,
    tenantId,
    name: parsed.data.name,
    phone: parsed.data.phone,
    preferredContactTime: parsed.data.preferredContactTime || undefined,
    issueSummary: parsed.data.issueSummary || undefined,
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
      console.info(`[handoff-emergency] requestId=${requestId} status=webhook_failed`);
      return NextResponse.json({ error: "Failed to send request." }, { status: 502 });
    }

    console.info(`[handoff-emergency] requestId=${requestId} status=ok`);
    return NextResponse.json({ ok: true });
  } catch {
    console.info(`[handoff-emergency] requestId=${requestId} status=webhook_error`);
    return NextResponse.json({ error: "Failed to send request." }, { status: 502 });
  }
}
