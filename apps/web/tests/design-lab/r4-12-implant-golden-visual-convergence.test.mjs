import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../app/champagne/design-lab/", import.meta.url);
const preview = readFileSync(new URL("_components/AtelierPreviewDocument.tsx", root), "utf8");
const generation = readFileSync(new URL("data/generative-design-contract.ts", root), "utf8");
const css = readFileSync(new URL("atelier-r4.12.css", root), "utf8");
const backTeach = JSON.parse(readFileSync(new URL("data/atelier-r4.11-back-teach-candidates.json", root), "utf8"));
const dispositions = JSON.parse(readFileSync(new URL("data/atelier-r4.14-assumption-disposition.json", root), "utf8"));

test("the historical four-family R4.12 study remains isolated while R4.14 supersedes it", () => {
  for (const title of ["Persian Architectural", "Architectural Editorial Hybrid", "Mineral Gallery Promenade"]) assert.doesNotMatch(generation, new RegExp(title));
  assert.match(generation, /Canonical Champagne Implant Page/);
  assert.match(generation, /input\.pageKey === "implants"/);
  assert.match(generation, /input\.targetKind === "page"/);
  for (const family of ["aperture", "folio", "luminous", "monolith"]) assert.match(css, new RegExp(`data-whole-page-proposal=${family}`));
  assert.equal(dispositions.dispositions.find(item => item.assumption === "FOUR_ABSTRACT_IMPLANT_PAGE_FAMILIES").disposition, "SUPERSEDED");
});

test("full-page treatments preserve governed content and honest missing capabilities", () => {
  assert.match(preview, /state\.sections\.map/);
  assert.match(preview, /Real media required · provenance-safe composition/);
  assert.match(preview, /no synthetic patient or practice image/);
  assert.match(preview, /Founder-rejected T0\.1 geometry is not integrated/);
  assert.match(preview, /Champagne medical art direction pending/);
  assert.match(preview, /Sources and review notes/);
  assert.match(preview, /publicationMaturity/);
  assert.doesNotMatch(preview, /testimonial|case result|success rate/i);
});

test("R4.12 supplies hierarchy, responsive collapse and reduced-motion safety", () => {
  assert.match(preview, /ImplantChapterRail/);
  assert.match(css, /section:nth-of-type/);
  assert.match(css, /@media\(max-width:900px\)/);
  assert.match(css, /@media\(max-width:520px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});

test("only reusable visual principles enter the inert back-teach register", () => {
  const map = new Map(backTeach.candidates.map(item => [item.capability, item.classification]));
  for (const capability of ["page-level candidate comparison", "alternating visual-chapter rhythm", "editorial evidence host", "provenance-aware media composition", "governed 3D exhibition slot"]) assert.equal(map.get(capability), "TENANT_NEUTRAL_BACK_TEACH_CANDIDATE");
  assert.equal(map.get("R4.12 Implant visual territories"), "CHAMPAGNE_ONE_OFF");
  assert.equal(backTeach.weosMutation, false);
  assert.equal(backTeach.productionBinding, false);
});
