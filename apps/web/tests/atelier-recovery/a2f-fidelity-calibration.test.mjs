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

const calibration = await readJson("data/reconstruction/ATELIER_A2H_HYBRID_FIDELITY_CALIBRATION_V1.json");
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

test("A2H continues PR 875 at the exact authorised head and scopes exactly three references", () => {
  assert.deepEqual(calibration.parent, { pr: 875, head: "9a70c2626d528a9d612adfc39682fdf04a8f7843", tree: "19580d69e2b1b0d2c832e23c22a6e0473fadbd76" });
  assert.deepEqual(calibration.sources.map((item) => [item.sourceCvaId, item.componentId, item.nativeDimensions.width, item.nativeDimensions.height]), expected);
  assert.equal(calibration.frozenNotRebuiltComponentCount, 5);
  assert.equal(calibration.authority.readyForFounderReconstructionReview, false);
  assert.equal(calibration.authority.a3Authorised, false);
});

test("the hybrid strategy retires general pure-CSS pixel reconstruction without using a source PNG body", () => {
  assert.equal(calibration.strategy.pureCssPixelReconstructionAsGeneralStrategy, "RETIRED");
  assert.equal(calibration.strategy.architecture, "LIVE_SEMANTIC_COMPONENT_PLUS_SOURCE_DERIVED_DECORATIVE_VISUAL_LAYERS");
  assert.equal(calibration.strategy.completeSourcePngAsLiveBody, false);
  assert.equal(calibration.strategy.semanticContentBakedIntoDecorativeAssets, false);
  assert.equal(components.includes("<img"), false);
  assert.equal(components.includes(".png"), false);
  assert.equal(componentCss.includes("/assets/champagne/design-lab/v27/"), false);
  assert.equal((library.match(/<img/g) ?? []).length, 1, "only the source-evidence pane may render the source PNG");
});

test("native source dimensions and item-level Founder authority stay exact", async () => {
  const current = new Map(founderDataset.decisions.filter((item) => item.status === "CURRENT").map((item) => [item.cvaId, item]));
  for (const [cvaId, componentId, width, height] of expected) {
    const source = calibration.sources.find((item) => item.componentId === componentId);
    const buffer = await readFile(path.join(publicRoot, `assets/champagne/design-lab/v27/${cvaId}.png`));
    assert.deepEqual(pngDimensions(buffer), { width, height }, cvaId);
    assert.equal(createHash("sha256").update(buffer).digest("hex"), source.sourceSha256);
    assert.equal(current.get(cvaId).wholeItemSignal, "LOVE");
    assert.equal(current.get(cvaId).notes, source.authoritativeFounderNote);
  }
  assert.equal(current.get("CVA-BAND-B020-E03").flags.wrongColours, false);
  assert.equal(current.get("CVA-FOOTER-F03-E02").flags.wrongColours, false);
  assert.match(current.get("CVA-SECTION-B029-E05").notes, /blue is not the persian blue/i);
});

test("every derived layer is immutable, web-native and declared non-semantic", async () => {
  assert.equal(calibration.derivedAssets.length, 9);
  for (const asset of calibration.derivedAssets) {
    const buffer = await readFile(path.join(publicRoot, "assets/champagne/atelier-recovery/a2h", asset.name));
    assert.equal(buffer.toString("ascii", 0, 4), "RIFF", asset.name);
    assert.equal(buffer.toString("ascii", 8, 12), "WEBP", asset.name);
    assert.equal(createHash("sha256").update(buffer).digest("hex"), asset.sha256, asset.name);
    assert.equal(asset.containsSemanticContent, false, asset.name);
    assert.match(componentCss, new RegExp(asset.name.replace(".", "\\.")), asset.name);
  }
  for (const marker of ["source-derived-persian-surface", "source-derived-luminous-field", "source-derived-edge-currents", "source-derived-heritage-illustration", "source-derived-wave-transition", "source-derived-particle-field"]) assert.match(components, new RegExp(marker));
});

test("headings, copy, navigation, actions and labels remain live semantic slots", () => {
  for (const element of ["<h2", "<h3", "<p", "<ul", "<li", "<a", "<nav", "aria-label", "aria-labelledby"]) assert.match(components, new RegExp(element));
  for (const source of calibration.sources) assert.ok(source.liveSemanticSlots.length >= 2, source.componentId);
  assert.match(library, /LIVE HYBRID · semantic code \+ source-derived decoration/);
});

test("Founder A2R stays byte-stable at zero and every later gate remains closed", () => {
  assert.equal(createHash("sha256").update(reconstructionReviews).digest("hex"), "919988c97b0abc64ad1ba40f63e79cf9a28459b2b53842e064fc9fde87e2562c");
  assert.equal(JSON.parse(reconstructionReviews).reviews.length, 0);
  assert.match(library, /reviews\.length !== 0/);
  assert.match(library, /DIRECTOR_HYBRID_FIDELITY_PASS_FOR_FOUNDER_REVIEW = NOT GRANTED/);
  assert.equal(calibration.terminal, "MAIN_DIRECTORATE_HYBRID_FIDELITY_REVIEW_REQUIRED");
});

test("the source-measured workbench remains available without an artistic score", () => {
  for (const value of ["SIDE_BY_SIDE", "SPLIT", "OVERLAY", "BLINK", "Source overlay opacity", "Locked zoom and pan", "source/native", "exact viewport", "Director fidelity checklist"]) assert.match(library, new RegExp(value, "i"));
  assert.equal(calibration.strategy.automatedArtisticPassScore, false);
  assert.equal(calibration.sources.every((item) => item.status === "HYBRID_IMPLEMENTED_DIRECTOR_REVIEW_REQUIRED"), true);
});

test("source-derived fidelity replaces the former generated current and wave loops", () => {
  assert.doesNotMatch(components, /length: 46|length: 19|footerWavePath|footerWaveFill/);
  assert.doesNotMatch(componentCss, /spectrumCurrents > i|spectrumCurrents b|footerWave path/);
  assert.match(componentCss, /spectrum-edge-currents\.webp/);
  assert.match(componentCss, /footer-wave-transition\.webp/);
  assert.match(componentCss, /@container \(max-width: 600px\)/);
  assert.equal(/#[0-9a-f]{3,8}\b/i.test(componentCss), false);
});
