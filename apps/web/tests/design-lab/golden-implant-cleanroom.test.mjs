import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const repository = new URL("../../../../", import.meta.url);
const lab = new URL("apps/web/app/champagne/design-lab/", repository);
const page = readFileSync(new URL("golden-implant-cleanroom/page.tsx", lab), "utf8");
const css = readFileSync(new URL("golden-implant-cleanroom/page.module.css", lab), "utf8");
const packageJson = JSON.parse(readFileSync(new URL("apps/web/package.json", repository), "utf8"));
const trace = JSON.parse(readFileSync(new URL("data/golden-implant-cleanroom-trace.v1.json", lab), "utf8"));
const content = JSON.parse(readFileSync(new URL("data/authority/CHAMPAGNE_IMPLANTS_CONTENT_BUNDLE_V1_1.json", lab), "utf8"));

test("cleanroom page preserves the Sacred Hero adapter and every governed Implant chapter", () => {
  assert.match(page, /HeroV2LabAdapter route="\/treatments\/dental-implants"/);
  assert.doesNotMatch(page, /HeroMount|HeroRenderer|HeroAssetRegistry/);
  for (const section of content.sections.filter((candidate) => candidate.enabled)) {
    assert.match(page, new RegExp(section.sectionId.replaceAll(".", "\\.")));
  }
});

test("canonical Playfair Display and Inter variable fonts are loaded locally", () => {
  assert.match(page, /import "@fontsource-variable\/inter"/);
  assert.match(page, /import "@fontsource-variable\/playfair-display"/);
  assert.equal(packageJson.dependencies["@fontsource-variable/inter"], "5.2.8");
  assert.equal(packageJson.dependencies["@fontsource-variable/playfair-display"], "5.2.8");
  assert.match(css, /"Inter Variable"/);
  assert.match(css, /"Playfair Display Variable"/);
});

test("page uses the actual archive wave and canonical token system without generated Implant media", () => {
  for (const token of ["--brand-magenta", "--brand-teal", "--brand-gold", "--surface-0", "--smh-ink-navy"]) {
    assert.match(css, new RegExp(token));
  }
  assert.match(css, /waves-bg-1600\.webp/);
  assert.doesNotMatch(css, /wave-field\.svg|wave-gold-dust\.png/);
  assert.doesNotMatch(page, /Premium Dental Implant Education Mockup|IMPLANT-ED-0[1-5]|procedural anatomy asset/);
  assert.doesNotMatch(page + css, /stageOrbit|questionRings|balanceHalo|openingConstellation/);
});

test("reference trace contains only positively rated source families and stays non-production", () => {
  const approved = new Set([
    "CVA-SECTION-B011-E01", "CVA-SURFACE-B038-E02", "CVA-SECTION-B032-E01", "CVA-SURFACE-B038-E04",
    "CVA-SECTION-B029-E03", "CVA-SEQUENCE-B009-E01", "CVA-SECTION-B034-E04", "F06", "F02",
    "CVA-SECTION-B011-E02", "CVA-BAND-B020-E03", "CVA-FOOTER-F03-E02"
  ]);
  assert.equal(trace.productionBinding, false);
  assert.equal(trace.heroMutation, false);
  assert.ok(trace.records.length >= 6);
  for (const record of trace.records) {
    assert.deepEqual(Object.keys(record), ["sourceCva", "compositionSignature", "implementedPageDecision"]);
    for (const source of record.sourceCva) assert.ok(approved.has(source), `Unapproved trace source: ${source}`);
  }
});

test("comparison and FAQ remain semantic and mobile flow is intentional", () => {
  assert.match(page, /<table>/);
  assert.match(page, /<details/);
  assert.match(css, /@media\s*\(max-width:\s*40rem\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
