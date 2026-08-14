import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contractUrl = new URL("../../app/champagne/design-lab/data/architectural-closing-contract.v1.json", import.meta.url);
const contract = JSON.parse(readFileSync(contractUrl, "utf8"));
const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");

test("architectural closing stays a truthful Lab proposal", () => {
  assert.equal(contract.status, "LAB_PROPOSAL_AWAITING_AUTHENTIC_FOUNDER_PHOTOGRAPH");
  assert.equal(contract.evidenceLevel, "CONCEPT");
  assert.equal(contract.productionBinding, false);
  assert.equal(contract.interimConceptMedia.authenticStMarysHouse, false);
  assert.equal(contract.interimConceptMedia.mustDisplayDisclosure, true);
  assert.match(atelier, /fictional architecture · not St Mary’s House/);
});

test("future regeneration preserves truth, provenance and responsive derivatives", () => {
  for (const phrase of [
    "Replace only the fictional architecture",
    "do not recolour the whole building gold",
    "Do not invent doors, windows, steps, signage, accessibility features",
    "Record the original photograph",
    "never bind production automatically"
  ]) assert.match(contract.regenerationInstruction, new RegExp(phrase));

  assert.deepEqual(contract.allowedPlacements, ["PRE_FOOTER_CLOSING_SECTION", "FULL_FOOTER"]);
  assert.equal(contract.treatments.some((item) => item.id === "GILDED_BRAND_GOLD"), true);
  assert.equal(contract.requiredDerivatives.includes("mobile-320"), true);
  assert.equal(contract.provenanceLedgerFields.includes("generatedRegions"), true);
});

test("Atelier exports the full architectural contract and Founder selections", () => {
  assert.match(atelier, /champagne\.atelier\.handoff\.v3/);
  assert.match(atelier, /architecturalClosingContract/);
  assert.match(atelier, /selectedPlacement: closingPlacement/);
  assert.match(atelier, /selectedTreatment: closingTreatment/);
  assert.match(atelier, /GILDED_BRAND_GOLD/);
  assert.match(atelier, /FULL_FOOTER/);
});
