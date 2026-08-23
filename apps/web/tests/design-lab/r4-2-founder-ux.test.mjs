import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const atelier = readFileSync(new URL("../../app/champagne/design-lab/_components/Atelier.tsx", import.meta.url), "utf8");
const adapter = readFileSync(new URL("../../app/champagne/design-lab/data/content-bundle-adapter.ts", import.meta.url), "utf8");
const implantBundle = JSON.parse(readFileSync(new URL("../../app/champagne/design-lab/data/authority/CHAMPAGNE_IMPLANTS_CONTENT_BUNDLE_V1_1.json", import.meta.url), "utf8"));
const css = readFileSync(new URL("../../app/champagne/design-lab/atelier-r4.2.css", import.meta.url), "utf8");

const codeIds = [...adapter.matchAll(/section\("((?:home|bonding)\.[a-z0-9.-]+)"/g)].map((match) => match[1]);
const ids = [...codeIds, ...implantBundle.sections.map((section) => section.sectionId)];

test("R4.2 presents a guided Founder-first Atelier home", () => {
  for (const marker of ["Where would you like to begin?", "Develop the brand", "Design pages", "Explore designs", "Ask Atelier", "Compare and compose"]) {
    assert.match(atelier, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(atelier, /Advanced evidence and machine handoff/);
});

test("content adapter holds the true 13, 14 and 13 stable jobs", () => {
  assert.equal(ids.filter((id) => id.startsWith("home.")).length, 13);
  assert.equal(ids.filter((id) => id.startsWith("implants.")).length, 14);
  assert.equal(ids.filter((id) => id.startsWith("bonding.")).length, 13);
  assert.equal(new Set(ids).size, 40);
  for (const marker of ["CHAMPAGNE_CONTENT_BUNDLE_V1_ADAPTER_V1", "CONTENT_SEARCH_ORIENTATION_V1", "LAB_SEED_COPY", "AWAITING_CHAMPAGNE_CONTENT_BUNDLE_V1"]) assert.match(adapter, new RegExp(marker));
});

test("capability-gated truth remains fail closed", () => {
  assert.match(adapter, /proof: false/);
  assert.match(adapter, /threeD: false/);
  assert.equal(implantBundle.sections.find((section) => section.sectionId === "implants.components-3d").capabilityOffBehavior.includes("static"), true);
  assert.match(adapter, /home\.proof/);
  assert.equal(implantBundle.sections.find((section) => section.sectionId === "implants.case-evidence").enabled, false);
  assert.match(atelier, /Interactive 3D remains off/);
});

test("proposal saving and Founder decision ledger are real exported state", () => {
  for (const marker of ["saveProposal", "setProposals", "Save proposal into brief", "decisionLedger: decisions", "FOUNDER_REVIEW_REQUIRED"]) assert.match(atelier, new RegExp(marker));
  assert.match(atelier, /disabled=\{!proposalRequest\.trim\(\)\}/);
});

test("R4.2 retains responsive and accessibility surfaces", () => {
  assert.match(atelier, /aria-label="Page"/);
  assert.match(atelier, /aria-labelledby="proposal-heading"/);
  assert.match(css, /max-width:44rem/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /forced-colors:active/);
});
