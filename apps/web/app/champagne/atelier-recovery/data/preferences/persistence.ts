import "server-only";
import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import archiveRegistry from "../archive/v27-registry.json";
import initialDataset from "./founder-visual-preferences.v1.json";
import { validateDataset } from "./preference-model.mjs";

const runtimeRoot = process.cwd();
const webRoot = runtimeRoot.endsWith(path.join("apps", "web")) ? runtimeRoot : path.join(runtimeRoot, "apps", "web");
export const PREFERENCE_DATASET_PATH = path.join(webRoot, "app/champagne/atelier-recovery/data/preferences/founder-visual-preferences.v1.json");

export function worktreePersistenceEnabled() {
  return process.env.CHAMPAGNE_ATELIER_LOCAL_WORK_MODE === "A1_EXPLICIT_WRITE"
    && process.env.ATELIER_WORKTREE_FILE_PERSISTENCE === "ENABLED"
    && process.env.NODE_ENV === "development"
    && !process.env.VERCEL
    && !process.env.VERCEL_ENV
    && !process.env.CI;
}

export function persistenceStatus() {
  return {
    mode: worktreePersistenceEnabled() ? "WORKTREE_FILE_PERSISTENCE" : "BROWSER_WORKING_COPY",
    canonicalWriteEnabled: worktreePersistenceEnabled(),
    browserStateIsCanonical: false,
    productionBinding: false,
  } as const;
}

export async function readPreferenceDataset() {
  if (!worktreePersistenceEnabled()) return initialDataset;
  const parsed = JSON.parse(await readFile(PREFERENCE_DATASET_PATH, "utf8"));
  return validateDataset(parsed, archiveRegistry.items.map((item) => item.id), initialDataset.sourceManifest.sha256);
}

export async function writePreferenceDataset(input: unknown, expectedRevision: number) {
  if (!worktreePersistenceEnabled()) throw new Error("AUTHORITATIVE_WORKTREE_WRITES_DISABLED");
  const dataset = validateDataset(input, archiveRegistry.items.map((item) => item.id), initialDataset.sourceManifest.sha256);
  const current = JSON.parse(await readFile(PREFERENCE_DATASET_PATH, "utf8"));
  if (current.datasetRevision !== expectedRevision) throw new Error("STALE_DATASET_REVISION");
  if (dataset.datasetRevision !== expectedRevision + 1) throw new Error("INVALID_NEXT_DATASET_REVISION");
  const temporaryPath = `${PREFERENCE_DATASET_PATH}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(dataset, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  await rename(temporaryPath, PREFERENCE_DATASET_PATH);
  return dataset;
}
