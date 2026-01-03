import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_CHAMPAGNE_ROUTES !== "true"
  ) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/champagne/:path*"],
};
