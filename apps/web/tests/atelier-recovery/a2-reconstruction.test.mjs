import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(testDir, "../..");
const routeRoot = path.join(webRoot, "app/champagne/atelier-recovery");
const readJson = async (relative) => JSON.parse(await readFile(path.join(routeRoot, relative), "utf8"));

const corpus = await readJson("data/corpus/CHAMPAGNE_FOUNDER_VISUAL_CORPUS_V1.json");
const matrix = await readJson("data/reconstruction/ATELIER_RECONSTRUCTION_CANDIDATE_MATRIX_V1.json");
const index = await readJson("data/reconstruction/ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1.json");
const registry = await readJson("data/archive/v27-registry.json");
const datasetText = await readFile(path.join(routeRoot, "data/preferences/founder-visual-preferences.v1.json"), "utf8");
const componentSource = await readFile(path.join(routeRoot, "components/a2/ReconstructedComponents.tsx"), "utf8");
const librarySource = await readFile(path.join(routeRoot, "components/a2/ReconstructionLibrary.tsx"), "utf8");
const componentCss = await readFile(path.join(routeRoot, "components/a2/reconstructed.module.css"), "utf8");

test("canonical corpus freezes the complete exported Founder dataset", () => {
  assert.equal(corpus.schema, "CHAMPAGNE_FOUNDER_VISUAL_CORPUS_V1");
  assert.equal(corpus.frozenDatasetRevision, 558);
  assert.equal(corpus.counts.totalReviewedItems, 331);
  assert.equal(corpus.counts.remainingUnrated, 0);
  assert.deepEqual({ LOVE: corpus.counts.LOVE, LIKE: corpus.counts.LIKE, MAYBE: corpus.counts.MAYBE, NOT_ME: corpus.counts.NOT_ME }, { LOVE: 125, LIKE: 88, MAYBE: 114, NOT_ME: 4 });
  assert.equal(corpus.counts.totalHistoricalRecords, 595);
  assert.equal(corpus.counts.supersededRecords, 264);
  assert.equal(corpus.sourceDatasetSha256, createHash("sha256").update(datasetText).digest("hex"));
  assert.equal(corpus.founderDataset.decisions.length, 595);
});

test("supersession chain and current identities are lossless", () => {
  const decisions = corpus.founderDataset.decisions;
  const byDecisionId = new Map(decisions.map((decision) => [decision.decisionId, decision]));
  const current = decisions.filter((decision) => decision.status === "CURRENT");
  assert.equal(new Set(decisions.map((decision) => decision.decisionId)).size, decisions.length);
  assert.equal(new Set(current.map((decision) => decision.cvaId)).size, 331);
  for (const decision of decisions) {
    if (!decision.supersedes) continue;
    const predecessor = byDecisionId.get(decision.supersedes);
    assert.ok(predecessor, decision.decisionId);
    assert.equal(predecessor.cvaId, decision.cvaId, decision.decisionId);
    assert.ok(predecessor.version < decision.version, decision.decisionId);
  }
});

test("candidate matrix covers every required semantic cluster and selects a bounded diverse kernel", () => {
  const roles = new Set(matrix.clusters.map((cluster) => cluster.semanticRole));
  for (const role of ["SECTION_CHAPTER_COMPOSITIONS", "CTA_COMPONENTS", "COMPARISON_OPTIONS_COMPONENTS", "REASSURANCE_TRUST_STRIPS", "INFORMATION_CARDS_EDITORIAL_PANELS", "TRANSITION_WAVE_BANDS", "FOOTER_COMPONENTS", "PAGE_SEQUENCE_COMPLEX_LAYOUT_REFERENCES", "MOBILE_SPECIFIC_REFERENCES"]) assert.ok(roles.has(role), role);
  assert.equal(matrix.selectedA2Kernel.length, 8);
  assert.equal(new Set(matrix.selectedA2Kernel.map((item) => item.semanticRole)).size >= 6, true);
  assert.ok(matrix.strongReferencesNotForced.some((item) => item.cvaId === "CVA-SECTION-B029-E03" && /3D\/CBCT/.test(item.reason)));
});

test("every indexed reconstruction links a real source and declares adaptive experimental contracts", () => {
  assert.equal(index.maturity, "EXPERIMENTAL_RECONSTRUCTION");
  assert.equal(index.productionBinding, false);
  assert.deepEqual(index.supportedViewports, [1440, 1024, 768, 390]);
  assert.equal(index.components.length, 8);
  const registryIds = new Set(registry.items.map((item) => item.id));
  for (const component of index.components) {
    assert.ok(registryIds.has(component.sourceCvaId), component.componentId);
    assert.match(component.sourceAsset, new RegExp(`${component.sourceCvaId}\\.png$`));
    assert.ok(component.contentSlots.length > 0, component.componentId);
    assert.ok(component.accessibility.length >= 4, component.componentId);
    assert.deepEqual(Object.keys(component.responsiveBehaviour), ["390", "768", "1024", "1440"]);
  }
});

test("reconstructed component bodies are code-native and cannot render source PNGs", () => {
  assert.equal(componentSource.includes("<img"), false);
  assert.equal(componentSource.includes(".png"), false);
  assert.match(librarySource, /SOURCE PNG/);
  assert.match(librarySource, /data-testid="a2-component-render"/);
  assert.equal((librarySource.match(/<img/g) ?? []).length, 1, "only the source-evidence pane may use an image");
});

test("A2 styling uses canonical tokens and adaptive container rules", () => {
  assert.equal(/#[0-9a-f]{3,8}\b/i.test(componentCss), false, "no raw colour literals");
  for (const token of ["--brand-magenta", "--brand-teal", "--champagne-keyline-gold", "--surface-0", "--surface-ink"]) assert.match(componentCss, new RegExp(token), token);
  assert.match(componentCss, /@container \(max-width: 800px\)/);
  assert.match(componentCss, /@container \(max-width: 30rem\)/);
});

test("legacy four-family and full-page generation fallbacks remain unreachable", () => {
  const joined = `${componentSource}\n${librarySource}`;
  for (const forbidden of ["generateProposalSet", "HeroRenderer", "four-family", "productionBinding=true", "legacyFamily"]) assert.equal(joined.includes(forbidden), false, forbidden);
});
