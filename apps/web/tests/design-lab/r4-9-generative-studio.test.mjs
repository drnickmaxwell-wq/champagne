import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contract = readFileSync(new URL("../../app/champagne/design-lab/data/generative-design-contract.ts", import.meta.url), "utf8");
const studio = readFileSync(new URL("../../app/champagne/design-lab/_components/FounderDesignStudio.tsx", import.meta.url), "utf8");
const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");

test("generation is deterministic, Lab-only and production inert", () => {
  assert.match(contract, /DETERMINISTIC_CODE_NATIVE_PROPOSALS_NOT_AI/);
  assert.match(contract, /label: "LAB_GENERATED_PROPOSAL"/);
  assert.match(contract, /productionBinding: false/);
  assert.match(contract, /FUTURE_CONTRACT_ONLY/);
  assert.doesNotMatch(contract + studio, /fetch\(|openai|anthropic|apiKey|process\.env/i);
});

test("webpage and Concierge foundries expose every authorised surface and mode", () => {
  for (const surface of ["whole-page", "semantic-section", "component", "invitation", "shell", "answer", "source", "navigation", "3d-handoff", "human-handoff", "mobile", "closing"]) assert.match(contract, new RegExp(`"${surface}"`));
  for (const mode of ["COMPLETELY_NEW", "MORE_LIKE_THIS", "CHANGE_ONE_THING", "REMIX", "REFERENCE_LED", "SURPRISE_ME", "NONE_OF_THESE"]) assert.match(contract + studio, new RegExp(mode));
  assert.match(studio, /UX_LOGIC_AUTHORITY ≠ VISUAL_STYLE_AUTHORITY/);
});

test("Founder decisions, DNA, lineage and governed export are connected", () => {
  for (const decision of ["love", "keep", "maybe", "reject"]) assert.match(studio, new RegExp(`"${decision}"`));
  assert.match(studio, /explicitInputOnly/);
  assert.match(studio, /parentId/);
  assert.match(atelier, /founderGenerativeDesign: founderDesignStudio/);
});

test("accepted Golden preview implementation remains outside R4.9 mutation", () => {
  assert.match(atelier, /TruthfulPreviewFrame/);
  assert.match(atelier, /ExperienceRooms/);
  assert.match(atelier, /Generate &amp; explore/);
});
