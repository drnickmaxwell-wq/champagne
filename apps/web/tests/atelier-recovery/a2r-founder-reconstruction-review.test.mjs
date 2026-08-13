import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  applyReconstructionReview, currentReconstructionReviewMap, deriveReconstructionReviewProgress,
  EMPTY_FIDELITY_FLAGS, FIDELITY_FLAG_KEYS, validateReconstructionReviewDataset,
} from "../../app/champagne/atelier-recovery/data/reconstruction-review/reconstruction-review-model.mjs";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const routeRoot = path.resolve(testDir, "../../app/champagne/atelier-recovery");
const read = (relative) => readFile(path.join(routeRoot, relative), "utf8");
const readJson = async (relative) => JSON.parse(await read(relative));
const index = await readJson("data/reconstruction/ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1.json");
const seed = await readJson("data/reconstruction-review/founder-reconstruction-reviews.v1.json");
const sourceCorpus = await read("data/preferences/founder-visual-preferences.v1.json");
const sourceCorpusHash = createHash("sha256").update(sourceCorpus).digest("hex");
const librarySource = await read("components/a2/ReconstructionLibrary.tsx");
const routeSource = await read("api/reconstruction-reviews/route.ts");
const persistenceSource = await read("data/reconstruction-review/persistence.ts");

test("A2R seed is a separate empty review authority pinned to accepted PR 873", () => {
  const validated = validateReconstructionReviewDataset(seed, index);
  assert.equal(validated.authority, "FOUNDER_RECONSTRUCTION_FIDELITY_DECISIONS_ONLY");
  assert.deepEqual(validated.sourceKernel, {
    id: "A2_RECONSTRUCTION_KERNEL_V1", pr: 873,
    head: "4e923e69aa41f43d0ce7b6496ef812d7ebbc944c",
    tree: "b65f7e79acd76217df25569e8cedcafc18598d72",
    componentCount: 8, componentIndexSchema: "ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1",
  });
  assert.equal(validated.productionBinding, false);
  assert.equal(validated.persistence.sourcePreferenceCorpusMutable, false);
  assert.equal(validated.reviews.length, 0);
});

test("source preference and reconstruction fidelity remain independent authorities", () => {
  const component = index.components.find((item) => item.founderSignal === "LOVE");
  assert.ok(component);
  const failed = applyReconstructionReview(seed, index, component.componentId, {
    disposition: "FAIL", fidelityFlags: { ...EMPTY_FIDELITY_FLAGS, tooGeneric: true },
    founderNote: "The original is LOVE but this reconstruction has become flat and generic.",
    reviewedResponsiveViewports: [1440, 1024, 768, 390],
  }, "2026-08-13T21:00:00.000Z");
  const review = currentReconstructionReviewMap(failed).get(component.componentId);
  assert.equal(review.sourceFounderRating, "LOVE");
  assert.equal(review.disposition, "FAIL");
  assert.equal(review.founderNote, "The original is LOVE but this reconstruction has become flat and generic.");
  assert.deepEqual(review.reviewedResponsiveViewports, [1440, 1024, 768, 390]);
  assert.equal(createHash("sha256").update(sourceCorpus).digest("hex"), sourceCorpusHash);
});

test("all fourteen fidelity flags are exact and supersession remains append-only", () => {
  assert.equal(FIDELITY_FLAG_KEYS.length, 14);
  const component = index.components[0];
  const first = applyReconstructionReview(seed, index, component.componentId, {
    disposition: "REFINE", fidelityFlags: { ...EMPTY_FIDELITY_FLAGS, lostColour: true },
    founderNote: "Retain this note verbatim.", reviewedResponsiveViewports: [1440],
  }, "2026-08-13T21:01:00.000Z");
  const second = applyReconstructionReview(first, index, component.componentId, {
    disposition: "APPROVE", reviewedResponsiveViewports: [1440, 390],
  }, "2026-08-13T21:02:00.000Z");
  assert.equal(second.reviews.length, 2);
  assert.equal(second.reviews[0].status, "SUPERSEDED");
  assert.equal(second.reviews[1].status, "CURRENT");
  assert.equal(second.reviews[1].supersedes, second.reviews[0].reviewId);
  assert.equal(second.reviews[1].founderNote, "Retain this note verbatim.");
  assert.equal(second.reviews[1].fidelityFlags.lostColour, true);
});

test("integrity checks reject altered lineage, unknown fields and broken history", () => {
  for (const mutate of [
    (value) => { value.productionBinding = true; },
    (value) => { value.sourceKernel.head = "wrong"; },
    (value) => { value.persistence.sourcePreferenceCorpusMutable = true; },
    (value) => { value.unrecognised = true; },
  ]) {
    const candidate = structuredClone(seed); mutate(candidate);
    assert.throws(() => validateReconstructionReviewDataset(candidate, index), /INVALID_FOUNDER_RECONSTRUCTION_REVIEW_DATASET/);
  }
  const component = index.components[0];
  const first = applyReconstructionReview(seed, index, component.componentId, { disposition: "REFINE" }, "2026-08-13T21:03:00.000Z");
  const second = applyReconstructionReview(first, index, component.componentId, { disposition: "FAIL" }, "2026-08-13T21:04:00.000Z");
  second.reviews[1].supersedes = null;
  assert.throws(() => validateReconstructionReviewDataset(second, index), /broken supersession link/);
});

test("progress reports only current dispositions and leaves A3 gated", () => {
  let dataset = seed;
  for (const [position, component] of index.components.entries()) dataset = applyReconstructionReview(dataset, index, component.componentId, {
    disposition: position < 2 ? "APPROVE" : position < 5 ? "REFINE" : "FAIL",
  }, `2026-08-13T21:${String(10 + position).padStart(2, "0")}:00.000Z`);
  assert.deepEqual(deriveReconstructionReviewProgress(dataset, index), {
    counts: { APPROVE: 2, REFINE: 3, FAIL: 3, UNREVIEWED: 0 }, complete: 8, remaining: 0, total: 8,
  });
  assert.match(librarySource, /RECONSTRUCTION_KERNEL_GAP/);
  assert.match(librarySource, /A3 remains unauthorised/);
});

test("Atelier review surface has the required rapid workflow and keeps PNGs evidence-only", () => {
  for (const text of ["ONLY_UNREVIEWED", "APPROVED", "REFINE", "FAILED", "Previous", "Next", "Open source full size", "Verbatim Founder note"]) assert.match(librarySource, new RegExp(text));
  for (const disposition of ["APPROVE", "REFINE", "FAIL"]) assert.match(librarySource, new RegExp(disposition));
  assert.equal((librarySource.match(/<img/g) ?? []).length, 1, "only source evidence may render an image");
  assert.match(librarySource, /No source PNG in component body/);
  assert.match(librarySource, /source-preference corpus/);
});

test("A2R persistence is explicit, atomic, optimistic and same-origin guarded", () => {
  assert.match(persistenceSource, /A2R_EXPLICIT_WRITE/);
  assert.match(persistenceSource, /randomUUID/);
  assert.match(persistenceSource, /rename\(temporaryPath/);
  assert.match(persistenceSource, /STALE_A2R_DATASET_REVISION/);
  assert.match(routeSource, /CROSS_ORIGIN_A2R_MUTATION_REJECTED/);
  assert.match(routeSource, /AUTHORITATIVE_A2R_WORKTREE_WRITES_DISABLED/);
  assert.equal(persistenceSource.includes("founder-visual-preferences.v1.json"), false);
});
