import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  applyReview, currentDecisionMap, deriveIndex, deriveProgress, EMPTY_FLAGS, FLAG_KEYS,
  TRAIT_SIGNALS, undoLast, validateDataset,
} from "../../app/champagne/atelier-recovery/data/preferences/preference-model.mjs";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(testDir, "../..");
const routeRoot = path.join(webRoot, "app/champagne/atelier-recovery");
const readJson = async (relative) => JSON.parse(await readFile(path.join(routeRoot, relative), "utf8"));
const registry = await readJson("data/archive/v27-registry.json");
const initial = await readJson("data/preferences/founder-visual-preferences.v1.json");
const archive = registry.items.map((item) => ({ id: item.id, labRoom: item.labRoom, family: item.family, parentBoard: item.provenance.parentBoard }));
const ids = archive.map((item) => item.id);

test("revision 21 reconciles 331 archive items, 51 distinct ratings and 58 history records", () => {
  const dataset = validateDataset(initial, ids, initial.sourceManifest.sha256);
  const progress = deriveProgress(dataset, archive);
  assert.equal(archive.length, 331);
  assert.equal(dataset.datasetRevision, 21);
  assert.equal(dataset.decisions.length, 58);
  assert.equal(currentDecisionMap(dataset).size, 51);
  assert.equal(progress.decided, 51);
  assert.equal(progress.remaining, 280);
  assert.equal(Object.values(progress.categories).reduce((sum, category) => sum + category.total, 0), 331);
});

test("all 38 imports remain exact append-only evidence without inferred trait polarity", async () => {
  const plan = await readJson("data/recovery/ATELIER_FOUNDER_PREFERENCE_IMPORT_PLAN_V1.json");
  const imports = initial.decisions.filter((decision) => decision.source.kind === "EXACT_IMPORT");
  assert.equal(plan.exactImports.length, 38);
  assert.equal(imports.length, 38);
  for (const imported of plan.exactImports) {
    const decision = imports.find((entry) => entry.decisionId === `EXACT_IMPORT::${imported.cvaId}::${imported.sourceIndex}`);
    assert.ok(decision, imported.cvaId);
    assert.equal(decision.wholeItemSignal, imported.signal, imported.cvaId);
    assert.equal(decision.notes, imported.note, imported.cvaId);
    assert.equal(decision.source.kind, "EXACT_IMPORT");
    assert.equal(decision.source.identifier, `${imported.source}#${imported.sourceIndex}`);
    assert.deepEqual(decision.source.originalTraitDimensions, imported.traits);
    assert.deepEqual(decision.traits, [], "mentioned dimensions must not become invented positive/negative ratings");
  }
});

test("Founder Decisions 51 through 57 are current with their explicit refinement boundaries", () => {
  const map = currentDecisionMap(initial);
  const expected = [
    ["CVA-SECTION-B029-E02", "LOVE", "LOVE LOVE LOVE again more diagrams like this"],
    ["CVA-SECTION-B029-E03", "LOVE", "my favorite!! LOVE LOVE LOVE MORE LOVE - need more of these for ALL treatment pages, classic but modern and just my brand. maybe some designs with porcelain as well and more brand colours?"],
    ["CVA-HERITAGE-B039-E01", "LOVE", "no its not . i know what picvture it is and will LOVE it"],
    ["CVA-HERITAGE-B040-E01", "LOVE", "LOVE LOVE as the actual building is my practice building St Mary's House. The cta could be better. ALSO LIKE to see this modernised slightly and even with more brand colours."],
    ["CVA-SECTION-B031-E02", "LIKE", ""],
    ["CVA-SURFACE-B038-E05", "MAYBE", "MAYBE not as nice as others, slightly boring"],
    ["CVA-SECTION-B029-E05", "LOVE", "LOVE but blue is not the persian blue i want, but love the use of brand colours to brighten"],
  ];
  for (const [cvaId, signal, notes] of expected) {
    assert.equal(map.get(cvaId)?.wholeItemSignal, signal, cvaId);
    assert.equal(map.get(cvaId)?.notes, notes, cvaId);
  }
  assert.equal(map.get("CVA-SECTION-B029-E03")?.flags.keepConcept, true);
  assert.equal(map.get("CVA-HERITAGE-B040-E01")?.flags.needsRefinement, true);
  assert.equal(map.get("CVA-SURFACE-B038-E05")?.flags.needsRefinement, true);
  assert.equal(map.get("CVA-SECTION-B029-E05")?.flags.wrongColours, true);
});

test("rating an unrated item persists without implying trait evidence", () => {
  const unrated = archive.find((item) => !currentDecisionMap(initial).has(item.id));
  const next = applyReview(initial, unrated.id, { wholeItemSignal: "LOVE" }, "2026-08-11T01:00:00.000Z");
  const decision = currentDecisionMap(next).get(unrated.id);
  assert.equal(decision.wholeItemSignal, "LOVE");
  assert.deepEqual(decision.traits, []);
  assert.equal(next.datasetRevision, initial.datasetRevision + 1);
});

test("editing an exact import preserves its immutable predecessor in supersession history", () => {
  const imported = initial.decisions.find((decision) => decision.source.kind === "EXACT_IMPORT" && decision.status === "CURRENT");
  const next = applyReview(initial, imported.cvaId, { wholeItemSignal: "NOT_ME" }, "2026-08-11T01:01:00.000Z");
  const records = next.decisions.filter((decision) => decision.cvaId === imported.cvaId);
  assert.equal(records.length, 2);
  assert.equal(records[0].source.kind, "EXACT_IMPORT");
  assert.equal(records[0].status, "SUPERSEDED");
  assert.equal(records[1].status, "CURRENT");
  assert.equal(records[1].supersedes, records[0].decisionId);
});

test("all trait signals, flags and verbatim notes round-trip", () => {
  const cvaId = archive.find((item) => !currentDecisionMap(initial).has(item.id)).id;
  const traits = TRAIT_SIGNALS.map((signal, index) => ({ dimension: ["colour", "composition", "geometry", "typography"][index], signal, note: index === 0 ? "wrong colour, lovely shape" : "" }));
  const flags = Object.fromEntries(FLAG_KEYS.map((key, index) => [key, index % 2 === 0]));
  const note = "love the shape but colour is wrong — keep  spacing & punctuation!";
  const next = applyReview(initial, cvaId, { wholeItemSignal: "LIKE", traits, flags, notes: note }, "2026-08-11T01:02:00.000Z");
  const checked = validateDataset(next, ids, initial.sourceManifest.sha256);
  const decision = currentDecisionMap(checked).get(cvaId);
  assert.deepEqual(decision.traits, traits);
  assert.deepEqual(decision.flags, flags);
  assert.equal(decision.notes, note);
});

test("undo creates a new supersession record and restores the previous state", () => {
  const cvaId = initial.decisions[0].cvaId;
  const changed = applyReview(initial, cvaId, { wholeItemSignal: "NOT_ME", notes: "temporary" }, "2026-08-12T01:03:00.000Z");
  const undone = undoLast(changed, "2026-08-12T01:04:00.000Z");
  const current = currentDecisionMap(undone).get(cvaId);
  assert.equal(current.wholeItemSignal, initial.decisions[0].wholeItemSignal);
  assert.equal(current.notes, initial.decisions[0].notes);
  assert.equal(current.source.kind, "SUPERSESSION");
  assert.equal(undone.decisions.filter((decision) => decision.cvaId === cvaId).length, 3);
});

test("derived future-consumer index is deterministic and retains explicit evidence only", () => {
  const first = deriveIndex(initial, archive);
  const second = deriveIndex(initial, archive);
  assert.deepEqual(first, second);
  assert.equal(first.length, 331);
  assert.equal(first.filter((row) => row.wholeItemSignal !== "UNRATED").length, 51);
  assert.ok(first.every((row) => "notePresent" in row && "currentDecisionVersion" in row));
});

test("malformed, unknown, duplicate-current and stale datasets fail closed", () => {
  assert.throws(() => validateDataset({ ...initial, version: 2 }, ids, initial.sourceManifest.sha256), /stale or unknown/);
  assert.throws(() => validateDataset({ ...initial, surprise: true }, ids, initial.sourceManifest.sha256), /unknown root field/);
  assert.throws(() => validateDataset({ ...initial, sourceManifest: { ...initial.sourceManifest, sha256: "0".repeat(64) } }, ids, initial.sourceManifest.sha256), /manifest identity/);
  const unknown = structuredClone(initial); unknown.decisions[0].cvaId = "CVA-UNKNOWN-E01";
  assert.throws(() => validateDataset(unknown, ids, initial.sourceManifest.sha256), /unknown CVA/);
  const duplicate = structuredClone(initial); duplicate.decisions.push({ ...duplicate.decisions[0], decisionId: "duplicate" });
  assert.throws(() => validateDataset(duplicate, ids, initial.sourceManifest.sha256), /duplicate current/);
  const unsafe = structuredClone(initial); unsafe.decisions[0].notes = "<img src=x onerror=alert(1)>";
  assert.equal(validateDataset(unsafe, ids, initial.sourceManifest.sha256).decisions[0].notes, unsafe.decisions[0].notes, "notes remain inert text data");
});

test("persistence is fixed-path, explicit-local, atomic and deployed-mode fail-closed", async () => {
  const source = await readFile(path.join(routeRoot, "data/preferences/persistence.ts"), "utf8");
  const route = await readFile(path.join(routeRoot, "api/preferences/route.ts"), "utf8");
  assert.match(source, /PREFERENCE_DATASET_PATH = path\.join/);
  assert.match(source, /A1_EXPLICIT_WRITE/);
  assert.match(source, /NODE_ENV === "development"/);
  assert.match(source, /!process\.env\.VERCEL/);
  assert.match(source, /randomUUID/);
  assert.match(source, /rename\(temporaryPath, PREFERENCE_DATASET_PATH\)/);
  assert.equal(source.includes("request"), false, "browser input cannot select a path");
  assert.match(route, /CROSS_ORIGIN_MUTATION_REJECTED/);
  assert.match(route, /AUTHORITATIVE_WORKTREE_WRITES_DISABLED/);
});

test("A1 leaves reconstruction, page generation and production binding unreachable", async () => {
  const source = await readFile(path.join(routeRoot, "RecoveryWorkspace.tsx"), "utf8");
  for (const forbidden of ["generateProposalSet", "HeroRenderer", "CREATE_NEW_CHAMPAGNE_COMPONENT", "productionBinding=true"]) assert.equal(source.includes(forbidden), false, forbidden);
  assert.match(source, /NO COMPONENT RECONSTRUCTION · NO PAGE DESIGN/);
  assert.match(source, /data-production-binding="false"/);
  assert.deepEqual(EMPTY_FLAGS, { keepConcept: false, needsRefinement: false, needsUpgrade: false, wrongColours: false, wrongTypography: false, wrongImagery: false, wrongGeometry: false, wrongComposition: false, wrongInteraction: false });
});
