import "server-only";
import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import componentIndex from "../reconstruction/ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1.json";
import initialDataset from "./founder-reconstruction-reviews.v1.json";
import { validateReconstructionReviewDataset } from "./reconstruction-review-model.mjs";

const runtimeRoot = process.cwd();
const webRoot = runtimeRoot.endsWith(path.join("apps", "web")) ? runtimeRoot : path.join(runtimeRoot, "apps", "web");
export const RECONSTRUCTION_REVIEW_DATASET_PATH = path.join(webRoot, "app/champagne/atelier-recovery/data/reconstruction-review/founder-reconstruction-reviews.v1.json");

export function reconstructionReviewWorktreePersistenceEnabled() {
  return process.env.CHAMPAGNE_ATELIER_LOCAL_WORK_MODE === "A2R_EXPLICIT_WRITE"
    && process.env.ATELIER_WORKTREE_FILE_PERSISTENCE === "ENABLED"
    && process.env.NODE_ENV === "development"
    && !process.env.VERCEL
    && !process.env.VERCEL_ENV
    && !process.env.CI;
}

export function reconstructionReviewPersistenceStatus() {
  return {
    mode: reconstructionReviewWorktreePersistenceEnabled() ? "WORKTREE_FILE_PERSISTENCE" : "BROWSER_WORKING_COPY",
    canonicalWriteEnabled: reconstructionReviewWorktreePersistenceEnabled(),
    browserStateIsCanonical: false,
    sourcePreferenceCorpusMutable: false,
    productionBinding: false,
  } as const;
}

export async function readReconstructionReviewDataset() {
  if (!reconstructionReviewWorktreePersistenceEnabled()) return initialDataset;
  const parsed = JSON.parse(await readFile(RECONSTRUCTION_REVIEW_DATASET_PATH, "utf8"));
  return validateReconstructionReviewDataset(parsed, componentIndex);
}

export async function writeReconstructionReviewDataset(input: unknown, expectedRevision: number) {
  if (!reconstructionReviewWorktreePersistenceEnabled()) throw new Error("AUTHORITATIVE_A2R_WORKTREE_WRITES_DISABLED");
  const dataset = validateReconstructionReviewDataset(input, componentIndex);
  const current = JSON.parse(await readFile(RECONSTRUCTION_REVIEW_DATASET_PATH, "utf8"));
  if (current.datasetRevision !== expectedRevision) throw new Error("STALE_A2R_DATASET_REVISION");
  if (dataset.datasetRevision !== expectedRevision + 1) throw new Error("INVALID_NEXT_A2R_DATASET_REVISION");
  const temporaryPath = `${RECONSTRUCTION_REVIEW_DATASET_PATH}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(dataset, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  await rename(temporaryPath, RECONSTRUCTION_REVIEW_DATASET_PATH);
  return dataset;
}
