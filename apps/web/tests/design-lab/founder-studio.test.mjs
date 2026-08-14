import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const studio = readFileSync(new URL("../../app/champagne/design-lab/_components/FounderStudio.tsx", import.meta.url), "utf8");
const browser = readFileSync(new URL("../../app/champagne/design-lab/_components/RegistryBrowser.tsx", import.meta.url), "utf8");
const homepage = readFileSync(new URL("../../app/champagne/design-lab/_components/HomepagePrototype.tsx", import.meta.url), "utf8");
const exemplar = readFileSync(new URL("../../app/champagne/design-lab/exemplars/[slug]/page.tsx", import.meta.url), "utf8");

test("Founder home explains the visual path without machine-first language", () => {
  for (const marker of ["Where would you like to start?", "Choose Persian Velvet Blue", "Choose Porcelain", "Build the page", "View complete ideas", "Room 11"]) assert.match(studio, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("material studios compare one candidate against canonical Hero V2 context", () => {
  for (const marker of ["Previous candidate", "Next candidate", "Technical details", "Too dark", "Too clinical"]) assert.match(studio, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("component library is grouped and presents one full-size design", () => {
  assert.match(browser, /Choose a component group/);
  assert.match(browser, /Choose design/);
  assert.match(browser, /dl-component-stage/);
  assert.doesNotMatch(browser, /dl-registry/);
  assert.match(browser, /Technical \/ evidence details/);
});

test("Homepage A and B are code-native Founder previews rather than pasted V27 boards", () => {
  assert.match(exemplar, /HomepagePrototype/);
  assert.match(homepage, /HeroV2LabAdapter/);
  assert.match(homepage, /HomepageA/);
  assert.match(homepage, /HomepageB/);
  assert.doesNotMatch(homepage, /assets\/champagne\/design-lab\/v27/);
  assert.doesNotMatch(homepage, /SOURCE_PREVIEW_UNAVAILABLE/);
  assert.match(homepage, /Founder environmental portrait/);
  assert.match(homepage, /film remains off/i);
});
