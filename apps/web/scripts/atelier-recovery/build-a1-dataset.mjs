import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { EMPTY_FLAGS } from "../../app/champagne/atelier-recovery/data/preferences/preference-model.mjs";

const runtimeRoot = process.cwd();
const webRoot = runtimeRoot.endsWith(path.join("apps", "web")) ? runtimeRoot : path.join(runtimeRoot, "apps", "web");
const routeRoot = path.join(webRoot, "app/champagne/atelier-recovery");
const registryPath = path.join(routeRoot, "data/archive/v27-registry.json");
const planPath = path.join(routeRoot, "data/recovery/ATELIER_FOUNDER_PREFERENCE_IMPORT_PLAN_V1.json");
const outputPath = path.join(routeRoot, "data/preferences/founder-visual-preferences.v1.json");
const registryBytes = await readFile(registryPath);
const registry = JSON.parse(registryBytes);
const plan = JSON.parse(await readFile(planPath, "utf8"));
const timestamp = "2026-08-11T00:00:00.000Z";
const dataset = {
  schema: "ATELIER_FOUNDER_VISUAL_PREFERENCE_DATASET_V1",
  version: 1,
  datasetRevision: 1,
  authority: "FOUNDER_EXPLICIT_DECISIONS_ONLY",
  productionBinding: false,
  sourceManifest: {
    id: registry.schema,
    sha256: createHash("sha256").update(registryBytes).digest("hex"),
    itemCount: registry.items.length,
  },
  persistence: { mode: "WORKTREE_FILE", browserLocalStorageIsAuthoritative: false, appendOnlyDecisionHistory: true },
  session: { lastCvaId: null, updatedAt: timestamp },
  decisions: plan.exactImports.map((entry) => ({
    decisionId: `EXACT_IMPORT::${entry.cvaId}::${entry.sourceIndex}`,
    cvaId: entry.cvaId,
    status: "CURRENT",
    wholeItemSignal: entry.signal,
    notes: entry.note,
    traits: [],
    flags: { ...EMPTY_FLAGS },
    source: {
      kind: "EXACT_IMPORT",
      identifier: `${entry.source}#${entry.sourceIndex}`,
      provenance: "Exact prior Founder decision imported by ATELIER_FOUNDER_PREFERENCE_IMPORT_PLAN_V1",
      exactMapping: true,
      originalTraitDimensions: entry.traits,
    },
    timestamp,
    version: 1,
    supersedes: null,
  })),
};
const output = `${JSON.stringify(dataset, null, 2)}\n`;
if (process.argv.includes("--check")) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== output) throw new Error("A1 preference dataset is stale; run atelier:a1:generate");
} else {
  await writeFile(outputPath, output);
}
