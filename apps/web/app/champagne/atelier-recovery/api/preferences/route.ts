import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { persistenceStatus, readPreferenceDataset, writePreferenceDataset } from "../../data/preferences/persistence";

export const dynamic = "force-dynamic";

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  const incomingHost = request.headers.get("host");
  const originHost = origin ? new URL(origin).host : null;
  return Boolean(originHost
    && (originHost === incomingHost || originHost === request.nextUrl.host)
    && (!fetchSite || fetchSite === "same-origin"));
}

export async function GET() {
  return NextResponse.json({ dataset: await readPreferenceDataset(), persistence: persistenceStatus() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "CROSS_ORIGIN_MUTATION_REJECTED" }, { status: 403 });
  if (!persistenceStatus().canonicalWriteEnabled) return NextResponse.json({ error: "AUTHORITATIVE_WORKTREE_WRITES_DISABLED" }, { status: 403 });
  try {
    const body = await request.json();
    const dataset = await writePreferenceDataset(body.dataset, body.expectedRevision);
    return NextResponse.json({ dataset, persistence: persistenceStatus() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "INVALID_REQUEST";
    return NextResponse.json({ error: message }, { status: message === "STALE_DATASET_REVISION" ? 409 : 400 });
  }
}
