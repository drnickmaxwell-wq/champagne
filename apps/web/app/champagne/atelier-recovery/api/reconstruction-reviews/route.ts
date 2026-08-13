import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  readReconstructionReviewDataset, reconstructionReviewPersistenceStatus, writeReconstructionReviewDataset,
} from "../../data/reconstruction-review/persistence";

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
  return NextResponse.json({ dataset: await readReconstructionReviewDataset(), persistence: reconstructionReviewPersistenceStatus() }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "CROSS_ORIGIN_A2R_MUTATION_REJECTED" }, { status: 403 });
  if (!reconstructionReviewPersistenceStatus().canonicalWriteEnabled) return NextResponse.json({ error: "AUTHORITATIVE_A2R_WORKTREE_WRITES_DISABLED" }, { status: 403 });
  try {
    const body = await request.json();
    const dataset = await writeReconstructionReviewDataset(body.dataset, body.expectedRevision);
    return NextResponse.json({ dataset, persistence: reconstructionReviewPersistenceStatus() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "INVALID_A2R_REQUEST";
    return NextResponse.json({ error: message }, { status: message === "STALE_A2R_DATASET_REVISION" ? 409 : 400 });
  }
}
