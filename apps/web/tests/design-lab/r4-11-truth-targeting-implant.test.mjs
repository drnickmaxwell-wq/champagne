import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../app/champagne/design-lab/", import.meta.url);
const adapter = readFileSync(new URL("data/content-bundle-adapter.ts", root), "utf8");
const studio = readFileSync(new URL("_components/FounderDesignStudio.tsx", root), "utf8");
const preview = readFileSync(new URL("_components/AtelierPreviewDocument.tsx", root), "utf8");
const contract = readFileSync(new URL("data/generative-design-contract.ts", root), "utf8");
const bundleBytes = readFileSync(new URL("data/authority/CHAMPAGNE_IMPLANTS_CONTENT_BUNDLE_V1_1.json", root));
const bundle = JSON.parse(bundleBytes);
const backTeach = JSON.parse(readFileSync(new URL("data/atelier-r4.11-back-teach-candidates.json", root), "utf8"));

test("whole-page, semantic-section and component targets resolve without the old Home fallback", () => {
  assert.doesNotMatch(studio, /scope === "whole-page" \? "home\.practice\.answer"/);
  assert.match(studio, /semanticOwner: page\.route/);
  assert.match(studio, /semanticOwner: section\.id/);
  assert.match(studio, /componentId && components\.some/);
  assert.match(studio, /Choose a valid page, section or component/);
  assert.match(contract, /GenerationTargetKind = "page" \| "section" \| "component"/);
  assert.match(preview, /data-whole-page-proposal/);
  assert.match(preview, /data-lab-component/);
});

test("the exact accepted Implant source is immutable, complete and still blocked", () => {
  assert.equal(createHash("sha256").update(bundleBytes).digest("hex"), "45d25648a97b5da1719026756d36ec8e8dcde0c9fba03aad470e75777eb8f33e");
  assert.equal(bundle.provenance.contentHash, "sha256:83d9b76508d583656663c037040274994ec913c04cbb07dfeb3e8ad175fa93ad");
  assert.equal(bundle.bundleId, "smh:route:/treatments/implants:v1");
  assert.equal(bundle.contentVersion, "1.0.0-draft.1");
  assert.equal(bundle.status, "clinical_and_fact_blocked");
  assert.equal(bundle.sections.length, 14);
  assert.equal(bundle.sections.filter((section) => section.enabled).length, 12);
  assert.equal(bundle.answerObjects.length, 18);
  assert.equal(bundle.claims.length, 48);
  assert.equal(bundle.sourceGroups.length, 11);
  assert.match(adapter, /GOVERNED_CONTENT_CLINICAL_AND_FACT_BLOCKED/);
  assert.doesNotMatch(adapter.match(/implants: \{[\s\S]*?\n  bonding:/)?.[0] ?? "", /LAB_SEED_COPY|AWAITING_CHAMPAGNE_CONTENT_BUNDLE_V1/);
});

test("R4.11 remains honest about generation, media, 3D and publication", () => {
  assert.match(studio + contract, /DETERMINISTIC_CODE_NATIVE_PROPOSALS_NOT_AI/);
  assert.match(studio, /no visual understanding|does not visually analyse/i);
  assert.match(studio, /Rotate implemented families/);
  assert.match(preview, /Founder-rejected T0\.1 geometry is not integrated/);
  assert.match(preview, /Real media required/);
  assert.match(preview, /publicationMaturity/);
  assert.doesNotMatch(studio + contract, /fetch\(|apiKey|process\.env|openai|anthropic/i);
});

test("Founder comparison is visual-first while audit detail remains available", () => {
  assert.match(studio, /dl411-primary-candidates/);
  assert.match(studio, /slice\(0, 2\)/);
  assert.match(studio, /dl411-candidate-strip/);
  assert.match(studio, /Technical details/);
  for (const decision of ["love", "keep", "maybe", "reject"]) assert.match(studio, new RegExp(`"${decision}"`));
  assert.match(studio, /Return to Golden/);
  assert.match(studio, /Escape/);
  assert.match(studio, /returnFocus/);
});

test("the bounded back-teach register evaluates every commissioned seam without mutating WEOS", () => {
  assert.equal(backTeach.schema, "CHAMPAGNE_ATELIER_R4_11_BACK_TEACH_CANDIDATE_REGISTER_V1");
  assert.equal(backTeach.productionBinding, false);
  assert.equal(backTeach.weosMutation, false);
  const names = new Set(backTeach.candidates.map((item) => item.capability));
  for (const required of ["semantic page/section/component targeting", "immutable governed-content snapshot", "Golden baseline", "candidate lineage", "decision state", "Tenant Design DNA seam", "responsive proof", "media slots/provenance", "Concierge semantic owner", "optional 3D slot", "approval/promotion state"]) assert.equal(names.has(required), true, required);
  for (const item of backTeach.candidates) assert.match(item.classification, /^(CHAMPAGNE_ONE_OFF|TENANT_NEUTRAL_BACK_TEACH_CANDIDATE)$/);
});
