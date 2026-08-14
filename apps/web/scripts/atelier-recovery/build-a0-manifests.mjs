import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDir, "../..");
const repoRoot = path.resolve(webRoot, "../..");
const routeData = path.join(webRoot, "app/champagne/atelier-recovery/data");
const authorityRoot = path.join(repoRoot, "contracts/atelier-recovery/authority");
const publicRoot = path.join(webRoot, "public");
const checkOnly = process.argv.includes("--check");

const readJson = async (relativePath) => JSON.parse(await readFile(path.join(routeData, relativePath), "utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;

async function emit(relativePath, value) {
  const target = path.join(routeData, relativePath);
  const next = stableJson(value);
  if (checkOnly) {
    const current = await readFile(target, "utf8");
    if (current !== next) throw new Error(`${relativePath} is stale; run atelier:a0:generate`);
    return;
  }
  await writeFile(target, next);
}

const registry = await readJson("archive/v27-registry.json");
const preserved = JSON.parse(await readFile(path.join(authorityRoot, "evidence/CHAMPAGNE_FOUNDER_VISUAL_TASTE_INTERVIEW_RESPONSE_V1_36_OF_38.json"), "utf8"));
const closure = JSON.parse(await readFile(path.join(authorityRoot, "CHAMPAGNE_FOUNDER_VISUAL_TASTE_INTERVIEW_RESPONSE_V1_38_OF_38_CLOSED.json"), "utf8"));

if (registry.items.length !== 331) throw new Error(`Expected 331 archive records, found ${registry.items.length}`);

const registryById = new Map(registry.items.map((item) => [item.id, item]));
const decisionRows = [
  ...preserved.decisions.map((decision, index) => ({ ...decision, source: preserved.schema, sourceIndex: index })),
  ...closure.closureDecisions.map((decision, index) => ({ ...decision, source: closure.schema, sourceIndex: index })),
];

if (decisionRows.length !== 38) throw new Error(`Expected 38 exact decisions, found ${decisionRows.length}`);
if (new Set(decisionRows.map((decision) => decision.id)).size !== 38) throw new Error("Exact decision IDs are not unique");
for (const decision of decisionRows) {
  if (!registryById.has(decision.id)) throw new Error(`Decision ${decision.id} is absent from the stable CVA registry`);
}

const inventory = [];
for (const item of registry.items) {
  const assetPath = `assets/champagne/design-lab/v27/${item.id}.png`;
  const bytes = await readFile(path.join(publicRoot, assetPath));
  inventory.push({
    cvaId: item.id,
    assetPath: `/${assetPath}`,
    sha256: sha256(bytes),
    bytes: bytes.length,
    labRoom: item.labRoom,
    sourceArchivePath: item.provenance.archivePath,
    parentBoard: item.provenance.parentBoard,
    crop: item.provenance.crop,
    implementationAvailable: false,
    usableInPageComposition: false,
    productionBinding: false,
  });
}

await emit("archive/ATELIER_A0_PRESERVED_ARCHIVE_INVENTORY_V1.json", {
  schema: "ATELIER_A0_PRESERVED_ARCHIVE_INVENTORY_V1",
  cleanBase: "a00f718a93710028b364930566d7f6a44483bc25",
  forensicSourceHead: "cc3f7fabff0af8ec6137c0a778b557e5bf79fb9e",
  count: inventory.length,
  registrySchemaVersion: registry.schemaVersion,
  productionBinding: false,
  items: inventory,
});

await emit("recovery/ATELIER_FOUNDER_PREFERENCE_IMPORT_PLAN_V1.json", {
  schema: "ATELIER_FOUNDER_PREFERENCE_IMPORT_PLAN_V1",
  targetSchema: "ATELIER_FOUNDER_VISUAL_PREFERENCE_DATASET_V1",
  policy: {
    speculativeMappingsAllowed: false,
    parentApprovalPropagatesToChildren: false,
    browserLocalStorageAuthoritative: false,
  },
  sources: [
    { id: "CHAMPAGNE_FOUNDER_VISUAL_TASTE_INTERVIEW_RESPONSE_V1_36_OF_38", classification: "EXACT_IMPORTABLE", candidateCount: 36, reason: "Exact stable CVA IDs with explicit Founder signals, traits and notes." },
    { id: "CHAMPAGNE_FOUNDER_VISUAL_TASTE_INTERVIEW_RESPONSE_V1_38_OF_38_CLOSED", classification: "EXACT_IMPORTABLE", candidateCount: 2, reason: "Two exact closure decisions with stable CVA IDs." },
    { id: "CHAMPAGNE_FOUNDER_BRAND_DNA_V1@1.0.0", classification: "TRAIT_ONLY", candidateCount: 0, reason: "Canonical cross-component Brand and Anti-DNA evidence; broad rules do not create child-item ratings." },
    { id: "FAMILY_F_F02_F06_F08_F09_F10", classification: "PARENT_ONLY_DO_NOT_PROPAGATE", candidateCount: 0, reason: "Approved family/component evidence lacks a proven one-to-one mapping to child CVA records." },
    { id: "FOUNDER_CTA_EXPLORATION_BOARD_RESPONSES", classification: "PARENT_ONLY_DO_NOT_PROPAGATE", candidateCount: 0, reason: "Board-level approval cannot be converted into child CTA decisions without exact stable identity evidence." },
    { id: "FOUNDER_FOOTER_EXPLORATION_BOARD_RESPONSES", classification: "PARENT_ONLY_DO_NOT_PROPAGATE", candidateCount: 0, reason: "Only exact footer CVA decisions already present in the 36-decision ledger are importable." },
    { id: "PROVISIONAL_12_OF_38_EVIDENCE", classification: "REJECTED_SOURCE", candidateCount: 0, reason: "Explicitly provisional and superseded by the settled 38-of-38 authority." },
    { id: "UNATTRIBUTED_CONVERSATION_SUMMARIES", classification: "AMBIGUOUS_REQUIRES_FOUNDER", candidateCount: 0, reason: "No immutable source artefact and stable item mapping; do not fabricate an import." }
  ],
  exactImports: decisionRows.map((decision) => ({
    cvaId: decision.id,
    classification: "EXACT_IMPORTABLE",
    signal: decision.signal,
    traits: decision.traits,
    note: decision.note,
    source: decision.source,
    sourceIndex: decision.sourceIndex,
  })),
  counts: {
    exactImportable: 38,
    parentOnlyDoNotPropagate: 3,
    traitOnly: 1,
    ambiguousRequiresFounder: 1,
    rejectedSource: 1,
  },
});

console.log(checkOnly ? "A0 generated manifests are current" : "A0 generated manifests written");
