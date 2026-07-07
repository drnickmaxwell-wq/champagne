import assert from "node:assert/strict";
import test from "node:test";
import { validateFile, validateContractPacket } from "../../contracts/champagne-os/contract-validator.mjs";

const fixture = (name) => new URL(`../../contracts/champagne-os/fixtures/${name}`, import.meta.url).pathname;

test("valid Website OS import and patch packets pass", () => {
  assert.equal(validateFile(fixture("valid-website-os-import-packet.json")).valid, true);
  assert.equal(validateFile(fixture("valid-website-os-patch-proposal.json")).valid, true);
});

test("forbidden authority fails closed", () => {
  const result = validateFile(fixture("invalid-deploy-provider-packet.json"));
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /authority\.deployment|authority\.providerCalls/);
});

test("sacred zones fail closed", () => {
  const result = validateFile(fixture("invalid-sacred-zone-mutation-packet.json"));
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /sacred zone|safety\.touchesSacredZone/);
});

test("PHI and PMS packets fail closed", () => {
  const result = validateFile(fixture("invalid-phi-pms-packet.json"));
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /containsPhi|containsPmsData|pmsAccess|forbidden/i);
});

test("review gates are required", () => {
  const result = validateContractPacket({
    schemaVersion: "CHAMPAGNE_CONTRACT_PACKET_V1",
    packetType: "evidence-review",
    authority: { role: "CONTRACT_SCHEMA_VALIDATOR", runtimeMutation: false, deployment: false, providerCalls: false, pmsAccess: false },
    operations: [],
    safety: { containsPhi: false, containsPmsData: false, mutatesProduction: false, touchesSacredZone: false, usesSecrets: false }
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /reviewGate is required/);
});
