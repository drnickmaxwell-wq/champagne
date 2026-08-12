import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { EMPTY_FLAGS, validateDataset } from "../../app/champagne/atelier-recovery/data/preferences/preference-model.mjs";

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
  const current = JSON.parse(await readFile(outputPath, "utf8"));
  validateDataset(current, registry.items.map((item) => item.id), dataset.sourceManifest.sha256);
  for (const imported of dataset.decisions) {
    const preserved = current.decisions.find((decision) => decision.decisionId === imported.decisionId);
    if (!preserved) throw new Error(`A1 exact import missing: ${imported.decisionId}`);
    const { status: _expectedStatus, ...expectedEvidence } = imported;
    const { status: _currentStatus, ...currentEvidence } = preserved;
    if (JSON.stringify(currentEvidence) !== JSON.stringify(expectedEvidence)) throw new Error(`A1 exact import changed: ${imported.decisionId}`);
  }
} else {
  const current = JSON.parse(await readFile(outputPath, "utf8").catch(() => "null"));
  if (current?.datasetRevision > 1) throw new Error("Refusing to overwrite append-only Founder review evidence; use a bounded reconciliation transaction");
  await writeFile(outputPath, output);
}
