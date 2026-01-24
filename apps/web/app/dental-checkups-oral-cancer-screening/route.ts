import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL("/treatments/dental-checkups-oral-cancer-screening", request.url);
  return NextResponse.redirect(url, 301);
}

export function HEAD(request: Request) {
  const url = new URL("/treatments/dental-checkups-oral-cancer-screening", request.url);
  return NextResponse.redirect(url, 301);
}
