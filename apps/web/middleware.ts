import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Placeholder environment validation middleware.
// TODO: Replace with real runtime checks for required environment variables.
export function middleware(_request: NextRequest) {
  // Example: read an app environment flag (safe stub only).
  const _env = process.env.NEXT_PUBLIC_APP_ENV ?? "dev";
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};