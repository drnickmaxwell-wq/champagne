import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");
const brand = readFileSync(new URL("../../app/champagne/design-lab/_components/BrandWorkshop.tsx", import.meta.url), "utf8");
const convergence = readFileSync(new URL("../../app/champagne/design-lab/data/atelier-convergence.ts", import.meta.url), "utf8");
const layout = readFileSync(new URL("../../app/champagne/design-lab/layout.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../app/champagne/design-lab/atelier-r4.3.css", import.meta.url), "utf8");

test("R4.3 provides a guided, distinct four-territory Brand Workshop", () => {
  for (const marker of ["Persian Architectural", "Contemporary Editorial", "Warm Heritage", "Luminous Digital", "Brand DNA", "Accent Studio", "Typography Studio", "Rhythm Studio"]) assert.match(`${brand}\n${convergence}`, new RegExp(marker));
  assert.match(atelier, /Open the Brand Workshop/);
  assert.match(layout, /atelier-r4\.3\.css/);
});

test("Founder working decisions persist locally and remain exportable non-production state", () => {
  for (const marker of ["champagne.atelier.r4.3.founder-state", "FOUNDER_WORKING_DIRECTION", "window.localStorage", "brandDecision", "productionBinding: false", "FOUNDER_REVIEW_REQUIRED"]) assert.match(`${atelier}\n${convergence}`, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("every section can project a truthful first-class Media Lens contract", () => {
  for (const marker of ["CHAMPAGNE_MEDIA_SLOT_REGISTRY_V1_ADAPTER_DRAFT", "semanticSectionId", "preferredAspectRatio", "responsiveTreatment", "provenance", "altCaptionSearchIntent", "founderControls", "TEXT_LED_SECTION"]) assert.match(convergence, new RegExp(marker));
  for (const control of ["CHOOSE", "COMPARE", "CROP", "POSITION", "TEXT_LED", "VIDEO", "THREE_D", "REMOVE"]) assert.match(convergence, new RegExp(`\\"${control}\\"`));
  assert.match(atelier, /Media Lens/);
  assert.match(atelier, /Awaiting registry/);
});

test("cross-lane convergence remains contract-gated and fail closed", () => {
  for (const marker of ["Content / Search", "Media", "3D Education", "Concierge", "Media Studio", "3D Experience Studio", "Concierge Experience Room", "Search Lens", "Experience Preview", "RESERVED_FAIL_CLOSED"]) assert.match(convergence, new RegExp(marker));
  assert.match(atelier, /All unavailable capabilities fail closed/);
  assert.match(atelier, /disabled>Opens when contract-ready/);
});

test("R4.3 retains responsive, reduced-motion and forced-colour treatment", () => {
  assert.match(css, /max-width:50rem/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /forced-colors:active/);
  assert.match(brand, /aria-label="Brand workshop areas"/);
  assert.match(atelier, /aria-labelledby="convergence-heading"/);
});
