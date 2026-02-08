import { NextResponse } from "next/server";

const PATIENT_COOKIE = "patientId";
const DEMO_PATIENT_ID = "demo-patient-1";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ patientId: DEMO_PATIENT_ID });
  response.cookies.set(PATIENT_COOKIE, DEMO_PATIENT_ID, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ signedOut: true });
  response.cookies.delete(PATIENT_COOKIE);
  return response;
}
