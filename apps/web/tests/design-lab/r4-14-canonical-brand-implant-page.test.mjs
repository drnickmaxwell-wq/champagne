import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../app/champagne/design-lab/", import.meta.url);
const preview = readFileSync(new URL("_components/AtelierPreviewDocument.tsx", root), "utf8");
const generation = readFileSync(new URL("data/generative-design-contract.ts", root), "utf8");
const css = readFileSync(new URL("atelier-r4.14.css", root), "utf8");
const dispositions = JSON.parse(readFileSync(new URL("data/atelier-r4.14-assumption-disposition.json", root), "utf8"));
const trace = JSON.parse(readFileSync(new URL("data/atelier-r4.14-back-teach.json", root), "utf8"));

test("R4.14 consumes one canonical Implant composition rather than four theme families", () => {
  assert.match(generation, /Canonical Champagne Implant Page/);
  assert.doesNotMatch(generation, /Persian Architectural|Architectural Editorial Hybrid|Mineral Gallery Promenade/);
  assert.match(preview, /data-r414-canonical/);
  assert.match(css, /data-r414-canonical="implant-page"/);
});

test("the existing Hero adapter is preserved and R4.14 begins after the Hero boundary", () => {
  assert.match(preview, /state\.page === "implants" && item\.id === "implants\.hero"\) \? heroes\[state\.page\]/);
  assert.match(css, /data-semantic-id="implants\.hero"/);
  assert.doesNotMatch(css, /ARCHITECTURAL MEDIA APERTURE|INTRODUCTORY ARCHITECTURAL COMPOSITION/);
});

test("page-context CTA alternatives remain interactive and keep governed labels", () => {
  for (const label of ["Wave Luxe", "Porcelain Editorial", "Signature Wave Motion"]) assert.match(preview, new RegExp(label));
  assert.match(preview, /aria-pressed=\{selected === option\.id\}/);
  assert.match(preview, /item\.ctas\?\.map/);
  assert.match(css, /data-cta-family="wave-luxe"/);
  assert.match(css, /data-cta-family="porcelain-editorial"/);
  assert.match(css, /data-cta-family="signature-wave-motion"/);
});

test("media and 3D remain truthful future seams with rejected assets excluded", () => {
  assert.match(preview, /Champagne medical art direction pending/);
  assert.match(preview, /IMPLANT-ED-01–05 are not integrated/);
  assert.match(preview, /Rejected procedural anatomy/);
  assert.match(preview, /no synthetic patient or practice image/);
  assert.doesNotMatch(preview, /Premium Dental Implant Education Mockup|Interactive dental implant anatomy exhibit|Accessible dental implant concept overview/);
});

test("conflicting Atelier assumptions are explicitly stale or superseded", () => {
  assert.equal(dispositions.brandAuthority, "CHAMPAGNE_FOUNDER_BRAND_DNA_V1@1.0.0");
  assert.ok(dispositions.dispositions.every(item => ["STALE", "SUPERSEDED"].includes(item.disposition)));
  assert.equal(dispositions.dispositions.find(item => item.assumption === "ARCHITECTURE_AS_PRIMARY_BRAND").disposition, "SUPERSEDED");
});

test("machine back-teach preserves the four-stage evidence chain without mutating WEOS", () => {
  assert.equal(trace.weosMutation, false);
  assert.equal(trace.implementationBinding, false);
  assert.ok(trace.records.length >= 5);
  for (const record of trace.records) assert.deepEqual(Object.keys(record), ["brandDnaInput", "pageDecision", "renderedResult", "founderResponse"]);
  assert.ok(trace.records.every(record => record.founderResponse === null));
});

test("the canonical palette and responsive contracts are visible in the page layer", () => {
  for (const token of ["--brand-magenta", "--brand-teal", "--brand-gold", "--atelier-persian", "--atelier-porcelain"]) assert.match(css, new RegExp(token));
  assert.match(css, /@media\(max-width:900px\)/);
  assert.match(css, /@media\(max-width:520px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});
