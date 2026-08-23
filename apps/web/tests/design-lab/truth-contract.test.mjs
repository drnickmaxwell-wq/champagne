import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const contracts = readFileSync(new URL("../../app/champagne/design-lab/data/contracts.ts", import.meta.url), "utf8");
const flows = readFileSync(new URL("../../app/champagne/design-lab/data/flows.ts", import.meta.url), "utf8");
const specimen = readFileSync(new URL("../../app/champagne/design-lab/_components/SectionSpecimen.tsx", import.meta.url), "utf8");

test("capabilities fail closed and new concepts stay classified", () => {
  for (const capability of ["cases", "reviews", "finance", "film", "threeD", "media", "access"]) assert.match(contracts, new RegExp(`${capability}: false`));
  assert.equal((contracts.match(/CDC-[A-Z0-9-]+-V1/g) ?? []).length, 5);
  assert.match(contracts, /productionBinding: false/);
  assert.match(specimen, /SOURCE_PREVIEW_UNAVAILABLE/);
});

test("3D is exactly implant education with a static transcript", () => {
  assert.match(flows, /id === "implants\.components-3d"/);
  assert.match(flows, /CD3D-IMPLANT-EDU-V1/);
  assert.match(flows, /No patient-specific simulation/);
  assert.match(specimen, /Static broad-stage educational transcript/);
});

test("Founder and team ownership remain separate", () => {
  assert.match(flows, /"home\.founder-authority"/);
  assert.match(flows, /"home\.team-continuity"/);
  assert.match(flows, /FOUNDER_ENVIRONMENTAL_V1/);
  assert.match(flows, /TEAM_GROUP_V1/);
});
