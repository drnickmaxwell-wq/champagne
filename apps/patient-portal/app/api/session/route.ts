import { NextResponse } from "next/server";

import {
  getStubCookieOptions,
  isStubAuthEnabled,
  STUB_AUTH_DISABLED_MESSAGE,
  STUB_AUTH_DISABLED_STATUS,
} from "./stub-auth";

const PATIENT_COOKIE = "patientId";
const DEMO_PATIENT_ID = "demo-patient-1";

export const runtime = "nodejs";

export async function POST() {
  if (!isStubAuthEnabled()) {
    return NextResponse.json(
      { error: STUB_AUTH_DISABLED_MESSAGE },
      { status: STUB_AUTH_DISABLED_STATUS }
    );
  }
  const response = NextResponse.json({ patientId: DEMO_PATIENT_ID });
  response.cookies.set(
    PATIENT_COOKIE,
    DEMO_PATIENT_ID,
    getStubCookieOptions()
  );
  return response;
}

export async function DELETE() {
  if (!isStubAuthEnabled()) {
    return NextResponse.json(
      { error: STUB_AUTH_DISABLED_MESSAGE },
      { status: STUB_AUTH_DISABLED_STATUS }
    );
  }
  const response = NextResponse.json({ signedOut: true });
  response.cookies.delete(PATIENT_COOKIE);
  return response;
}
