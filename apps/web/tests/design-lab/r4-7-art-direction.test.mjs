import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");
const preview = readFileSync(new URL("../../app/champagne/design-lab/_components/AtelierPreviewDocument.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/champagne/design-lab/atelier-r4.7.css", import.meta.url), "utf8");
const qa = readFileSync(new URL("./r4-7-art-direction-qa.mjs", import.meta.url), "utf8");

test("R4.7 preserves content authority while differentiating the governed Homepage chapters", () => {
  for (const id of ["home.practice.answer", "home.patient.pathways", "home.complex-care", "home.care-process", "home.founder-authority", "home.team-continuity", "home.technology-purpose", "home.heritage-story", "home.visit", "home.focused-faq"]) assert.match(css, new RegExp(id.replaceAll(".", "-")));
  assert.match(atelier, /heroAuthorityConflict: "UNRESOLVED_PRESERVED"/);
  assert.match(atelier, /contentAuthority: "UNCHANGED"/);
  assert.match(preview, /SectionGeometry/);
  assert.doesNotMatch(preview, /patient photograph|staff photograph|testimonial|case result/i);
});

test("four art-direction families compare A and B through the existing Founder decision ledger", () => {
  for (const id of ["home.founder-authority", "home.team-continuity", "home.technology-purpose", "home.heritage-story"]) assert.match(atelier, new RegExp(id.replace(".", "\\.")));
  for (const decision of ["love", "keep", "maybe", "reject"]) assert.match(atelier, new RegExp(`"${decision}"`));
  assert.match(atelier, /ArtDirectionRoom/);
  assert.match(atelier, /artDirections/);
  assert.match(atelier, /productionBinding: false/);
});

test("R4.7 retains true-device evidence and adds focused rendered before-after proof", () => {
  assert.match(qa, /differentiatedChapterIds/);
  assert.match(qa, /R4\.6_RENDERED_BASELINE/);
  assert.match(qa, /R4\.7_ART_DIRECTION/);
  assert.match(qa, /NATIVE_IFRAME_VIEWPORT_SLICE_VERTICAL_STITCH_NO_RESIZE/);
  for (const width of [1440, 768, 1024, 390]) assert.match(qa, new RegExp(`width: ${width}`));
});

test("mobile art direction is explicit rather than inherited stacking", () => {
  assert.match(css, /@media\(max-width:50rem\)/);
  assert.match(css, /dl44-home-founder-authority/);
  assert.match(css, /dl44-home-team-continuity/);
  assert.match(css, /dl44-home-technology-purpose/);
  assert.match(css, /dl44-home-heritage-story/);
  assert.match(css, /grid-template-columns:minmax\(0,1fr\)/);
});
