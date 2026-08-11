import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../app/champagne/design-lab/", import.meta.url);
const page = readFileSync(new URL("golden-implant-cleanroom/page.tsx", root), "utf8");
const css = readFileSync(new URL("golden-implant-cleanroom/page.module.css", root), "utf8");
const trace = JSON.parse(readFileSync(new URL("data/golden-implant-cleanroom-trace.v1.json", root), "utf8"));
const content = JSON.parse(readFileSync(new URL("data/authority/CHAMPAGNE_IMPLANTS_CONTENT_BUNDLE_V1_1.json", root), "utf8"));

test("cleanroom page preserves the Sacred Hero adapter and every governed Implant chapter", () => {
  assert.match(page, /HeroV2LabAdapter route="\/treatments\/dental-implants"/);
  assert.doesNotMatch(page, /HeroMount|HeroRenderer|HeroAssetRegistry/);
  for (const section of content.sections.filter((section) => section.enabled)) assert.match(page, new RegExp(section.sectionId.replace(".", "\\.")));
});

test("page uses the canonical archive-derived wave and colour system without generated Implant media", () => {
  for (const token of ["--brand-magenta", "--brand-teal", "--brand-gold", "--surface-0", "--surface-ink"]) assert.match(css, new RegExp(token));
  assert.match(css, /wave-field\.svg/);
  assert.match(css, /wave-gold-dust\.png/);
  assert.doesNotMatch(page, /Premium Dental Implant Education Mockup|IMPLANT-ED-0[1-5]|procedural anatomy asset/);
});

test("reference trace is internal, finite and explicitly non-production", () => {
  assert.equal(trace.productionBinding, false);
  assert.equal(trace.heroMutation, false);
  assert.ok(trace.records.length >= 5);
  for (const record of trace.records) assert.deepEqual(Object.keys(record), ["sourceCva", "compositionSignature", "implementedPageDecision"]);
});

test("comparison and FAQ remain semantic and mobile flow is intentional", () => {
  assert.match(page, /<table>/);
  assert.match(page, /<details/);
  assert.match(css, /@media\(max-width:40rem\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});
