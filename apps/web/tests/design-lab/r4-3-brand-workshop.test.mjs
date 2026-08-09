import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");
const brand = readFileSync(new URL("../../app/champagne/design-lab/_components/BrandWorkshop.tsx", import.meta.url), "utf8");
const convergence = readFileSync(new URL("../../app/champagne/design-lab/data/atelier-convergence.ts", import.meta.url), "utf8");
const media = readFileSync(new URL("../../app/champagne/design-lab/data/media-slot-adapter.ts", import.meta.url), "utf8");
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
  for (const marker of ["semanticSectionId", "resolvedSlotId", "aspectRatio", "responsive", "provenance", "searchIntent", "fallback", "TEXT_LED"]) assert.match(media, new RegExp(marker));
  for (const control of ["Use this image", "Try another asset", "Set focal point", "Crop differently", "Use video", "Use 3D instead", "Leave text-led"]) assert.match(media, new RegExp(control));
  assert.match(atelier, /Media Lens/);
  assert.match(atelier, /Resolved slot/);
});

test("cross-lane convergence records contract arrivals without production binding", () => {
  for (const marker of ["Content / Search", "Media", "3D Education", "Concierge", "Media Studio", "3D Experience Studio", "Concierge Experience Room", "Search Lens", "Experience Preview", "FROZEN_SYNTHETIC_FIXTURE"]) assert.match(convergence, new RegExp(marker));
  assert.match(atelier, /productionBinding: false/);
});

test("R4.3 retains responsive, reduced-motion and forced-colour treatment", () => {
  assert.match(css, /max-width:50rem/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /forced-colors:active/);
  assert.match(brand, /aria-label="Brand workshop areas"/);
  assert.match(atelier, /ExperienceRooms/);
});
