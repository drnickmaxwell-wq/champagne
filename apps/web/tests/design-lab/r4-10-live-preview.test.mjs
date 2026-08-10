import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");
const preview = readFileSync(new URL("../../app/champagne/design-lab/_components/AtelierPreviewDocument.tsx", import.meta.url), "utf8");
const studio = readFileSync(new URL("../../app/champagne/design-lab/_components/FounderDesignStudio.tsx", import.meta.url), "utf8");
const contract = readFileSync(new URL("../../app/champagne/design-lab/data/generative-design-contract.ts", import.meta.url), "utf8");

test("generated webpage and Concierge proposals render reversibly against Golden", () => {
  assert.match(atelier, /Back to Golden/);
  assert.match(atelier, /Golden vs candidate/);
  assert.match(atelier, /previewState\(studioTime, null\)/);
  assert.match(preview, /data-lab-proposal/);
  assert.match(preview, /NOT GOLDEN BASELINE/);
  assert.match(preview, /GoldenConcierge experiment=/);
});

test("Founder exploration tools are explicit and explainable", () => {
  for (const dimension of ["composition", "type-hierarchy", "spacing-rhythm", "media-geometry", "interaction-model", "motion", "density", "mobile-composition"]) assert.match(studio + contract, new RegExp(dimension));
  assert.match(studio, /None of these — try another family/);
  assert.match(studio, /Do not learn from/);
  assert.match(studio, /Reset this signal/);
  assert.match(studio, /Visual Remix Builder/);
});

test("deep links fail closed and future worker contract remains inert", () => {
  for (const room of ["founder-design-studio", "brand-workshop", "concierge-ux", "media-studio"]) assert.match(atelier, new RegExp(room));
  assert.match(contract, /champagne\.weos\.design-worker\.request\.v1/);
  assert.match(contract, /semanticAuthorityMutable: false/);
  assert.match(contract, /productionBinding: false/);
  assert.doesNotMatch(contract + studio, /fetch\(|apiKey|anthropic|openai/i);
});
