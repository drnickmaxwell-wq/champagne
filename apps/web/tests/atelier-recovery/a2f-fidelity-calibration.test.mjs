import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(testDir, "../..");
const routeRoot = path.join(webRoot, "app/champagne/atelier-recovery");
const publicRoot = path.join(webRoot, "public");
const read = (relative) => readFile(path.join(routeRoot, relative));
const readText = async (relative) => (await read(relative)).toString("utf8");
const readJson = async (relative) => JSON.parse(await readText(relative));

const calibration = await readJson("data/reconstruction/ATELIER_A2F_RECONSTRUCTION_FIDELITY_CALIBRATION_V1.json");
const index = await readJson("data/reconstruction/ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1.json");
const founderDataset = await readJson("data/preferences/founder-visual-preferences.v1.json");
const reconstructionReviews = await read("data/reconstruction-review/founder-reconstruction-reviews.v1.json");
const components = await readText("components/a2/ReconstructedComponents.tsx");
const componentCss = await readText("components/a2/reconstructed.module.css");
const library = await readText("components/a2/ReconstructionLibrary.tsx");

const expected = [
  ["CVA-SECTION-B029-E05", "A2-DECISION-CLARITY-01", 836, 257],
  ["CVA-BAND-B020-E03", "A2-SPECTRUM-CLOSING-BAND-01", 820, 188],
  ["CVA-FOOTER-F03-E02", "A2-PORCELAIN-DESCENT-FOOTER-01", 1167, 279],
];

function pngDimensions(buffer) {
  assert.equal(buffer.toString("ascii", 1, 4), "PNG");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test("A2F is pinned to PR 874 and scopes exactly three calibration references", () => {
  assert.deepEqual(calibration.parent, { pr: 874, head: "a10fe4530dc4d9c4ee9d7edc9b9659be4665dffa", tree: "0cdf9727d7014df6c04f740d999b83bb6224aaa6" });
  assert.deepEqual(calibration.calibrationSet.map((item) => [item.sourceCvaId, item.componentId, item.nativeDimensions.width, item.nativeDimensions.height]), expected);
  assert.equal(calibration.frozenNotRepairedComponentCount, 5);
  assert.equal(calibration.authority.readyForFounderReconstructionReview, false);
  assert.equal(calibration.authority.a3Authorised, false);
});

test("native PNG dimensions are truthful and sources remain evidence-only", async () => {
  for (const [cvaId, , width, height] of expected) {
    const buffer = await readFile(path.join(publicRoot, `assets/champagne/design-lab/v27/${cvaId}.png`));
    assert.deepEqual(pngDimensions(buffer), { width, height }, cvaId);
  }
  assert.equal(components.includes("<img"), false);
  assert.equal(components.includes(".png"), false);
  assert.equal((library.match(/<img/g) ?? []).length, 1);
});

test("exact Founder evidence controls the three source calibrations", () => {
  const current = new Map(founderDataset.decisions.filter((item) => item.status === "CURRENT").map((item) => [item.cvaId, item]));
  for (const item of calibration.calibrationSet) {
    const decision = current.get(item.sourceCvaId);
    assert.ok(decision, item.sourceCvaId);
    assert.equal(decision.wholeItemSignal, "LOVE");
    assert.equal(decision.notes, item.authoritativeFounderNote);
  }
  assert.equal(current.get("CVA-BAND-B020-E03").flags.wrongColours, false);
  assert.equal(current.get("CVA-FOOTER-F03-E02").flags.wrongColours, false);
  assert.match(current.get("CVA-SECTION-B029-E05").notes, /blue is not the persian blue/i);
});

test("Founder A2R dataset stays byte-stable at zero reviews", () => {
  assert.equal(createHash("sha256").update(reconstructionReviews).digest("hex"), "919988c97b0abc64ad1ba40f63e79cf9a28459b2b53842e064fc9fde87e2562c");
  assert.equal(JSON.parse(reconstructionReviews).reviews.length, 0);
  assert.match(library, /reviews\.length !== 0/);
});

test("Director workbench provides comparison tools without an artistic score or promotion", () => {
  for (const value of ["SIDE_BY_SIDE", "SPLIT", "OVERLAY", "BLINK", "Source overlay opacity", "Locked zoom and pan", "source/native", "exact viewport", "Director fidelity checklist"]) assert.match(library, new RegExp(value, "i"));
  for (const value of ["Shape / silhouette", "Proportions", "Layering", "Surfaces", "Colour distribution", "Typography hierarchy", "Spacing", "Negative space", "Wave / detail", "Density"]) assert.match(library, new RegExp(value.replace("/", "\\/")));
  assert.equal(calibration.comparisonWorkbench.automatedArtisticPassScore, false);
  assert.equal(calibration.calibrationSet.every((item) => item.directorFidelityPass === false && item.stage2 === "BLOCKED_PENDING_DIRECTOR_FIDELITY_PASS"), true);
  assert.match(library, /DIRECTOR_FIDELITY_PASS_FOR_FOUNDER_REVIEW = NOT GRANTED/);
});

test("A2 index stays generated and separate A2F metadata carries the Director gate", () => {
  assert.equal(index.components.every((item) => item.status === "IMPLEMENTED_AWAITING_FOUNDER_REVIEW"), true);
  assert.deepEqual(calibration.calibrationSet.map((item) => item.componentId), expected.map((item) => item[1]));
  assert.equal(calibration.frozenNotRepairedComponentCount, 5);
  assert.equal(/#[0-9a-f]{3,8}\b/i.test(componentCss), false);
  for (const token of ["--brand-magenta", "--brand-teal", "--champagne-keyline-gold", "--surface-0", "--surface-ink"]) assert.match(componentCss, new RegExp(token));
});

test("native correction preserves source-led density and declares the footer asset gap", () => {
  assert.match(components, /length: 46/);
  assert.match(components, /length: 19/);
  assert.match(components, /footerWaveFill/);
  assert.match(componentCss, /grid-template-columns: \.95fr 1\.23fr 1\.2fr 1\.02fr 1\.38fr/);
  assert.match(componentCss, /top: 6\.22cqi/);
  assert.match(componentCss, /@container \(max-width: 600px\)/);
  assert.doesNotMatch(componentCss, /@container \(max-width: (?:52rem|800px)\)/);
  assert.match(calibration.calibrationSet.find((item) => item.componentId === "A2-PORCELAIN-DESCENT-FOOTER-01").knownGaps.join(" "), /FOOTER_HERITAGE_ILLUSTRATION_ASSET_GAP/);
});
