import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_TENANT_ID = "default";
const PATIENT_COOKIE = "patientId";
const DEFAULT_SERVICE_URL = "http://localhost:4010";

type ConverseRequest = {
  message?: string;
};

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const patientId = cookieStore.get(PATIENT_COOKIE)?.value;

  if (!patientId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: ConverseRequest;

  try {
    body = (await request.json()) as ConverseRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.message || body.message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const serviceUrl = process.env.PATIENT_AI_SERVICE_URL ?? DEFAULT_SERVICE_URL;

  try {
    const upstreamResponse = await fetch(`${serviceUrl}/v1/converse`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-tenant-id": DEFAULT_TENANT_ID,
        "x-patient-id": patientId
      },
      body: JSON.stringify({ message: body.message })
    });

    const data = (await upstreamResponse.json()) as Record<string, unknown>;

    return NextResponse.json(data, { status: upstreamResponse.status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upstream request failed." },
      { status: 502 }
    );
  }
}
