import fs from "node:fs";
import path from "node:path";

export const PACKET_TYPES = new Set([
  "website-os-import-envelope",
  "website-os-export-envelope",
  "website-os-safe-patch",
  "live-canvas-safe-edit",
  "evidence-review",
  "rollback-packet",
]);

export const SACRED_ZONE_PREFIXES = [
  "packages/champagne-hero/src/HeroAssetRegistry.ts",
  "packages/champagne-hero/src/hero-engine/HeroConfig.ts",
  "packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts",
  "packages/champagne-hero/src/hero-engine/HeroRuntime.ts",
  "packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts",
  "packages/champagne-manifests/data/hero/sacred_",
  "apps/web/app/components/hero/HeroRenderer.tsx",
];

const FORBIDDEN_TEXT = [/\bPHI\b/i, /patient\s+(name|dob|date of birth|email|phone)/i, /\bDentally\b/i, /\bPMS\b/i, /provider\s*call/i, /production\s+mutation/i];

function add(errors, message) { errors.push(message); }
function isObject(value) { return value && typeof value === "object" && !Array.isArray(value); }
function scan(value) { return JSON.stringify(value ?? ""); }
function touchesSacred(pathname) { return SACRED_ZONE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix)); }

export function validateContractPacket(packet) {
  const errors = [];
  if (!isObject(packet)) return { valid: false, errors: ["Packet must be an object."] };
  if (packet.schemaVersion !== "CHAMPAGNE_CONTRACT_PACKET_V1") add(errors, "schemaVersion must be CHAMPAGNE_CONTRACT_PACKET_V1.");
  if (!PACKET_TYPES.has(packet.packetType)) add(errors, "packetType is not an approved Champagne contract packet type.");

  const authority = packet.authority;
  if (!isObject(authority)) add(errors, "authority is required.");
  else {
    for (const key of ["runtimeMutation", "deployment", "providerCalls", "pmsAccess"]) {
      if (authority[key] !== false) add(errors, `authority.${key} must be false.`);
    }
  }

  const reviewGate = packet.reviewGate;
  if (!isObject(reviewGate)) add(errors, "reviewGate is required.");
  else {
    if (reviewGate.required !== true) add(errors, "reviewGate.required must be true.");
    if (!Array.isArray(reviewGate.reviewers) || reviewGate.reviewers.length === 0) add(errors, "reviewGate.reviewers must name at least one reviewer role.");
    if (!["pending", "approved"].includes(reviewGate.status)) add(errors, "reviewGate.status must be pending or approved.");
  }

  if (!Array.isArray(packet.operations)) add(errors, "operations must be an array.");
  else {
    packet.operations.forEach((operation, index) => {
      if (!isObject(operation)) return add(errors, `operations[${index}] must be an object.`);
      if (!operation.path || typeof operation.path !== "string") add(errors, `operations[${index}].path is required.`);
      if (operation.path && touchesSacred(operation.path)) add(errors, `operations[${index}].path touches a sacred zone: ${operation.path}`);
      if (["deploy", "providerCall", "productionMutation", "pmsWrite"].includes(operation.op)) add(errors, `operations[${index}].op is forbidden: ${operation.op}`);
    });
  }

  const safety = packet.safety;
  if (!isObject(safety)) add(errors, "safety is required.");
  else {
    for (const key of ["containsPhi", "containsPmsData", "mutatesProduction", "touchesSacredZone", "usesSecrets"]) {
      if (safety[key] !== false) add(errors, `safety.${key} must be false.`);
    }
  }

  const haystack = scan({ operations: packet.operations, evidence: packet.evidence, rollback: packet.rollback });
  for (const pattern of FORBIDDEN_TEXT) {
    if (pattern.test(haystack)) add(errors, `Packet contains forbidden authority/sensitive text matching ${pattern}.`);
  }

  return { valid: errors.length === 0, errors };
}

export function readPacket(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function validateFile(filePath) {
  return validateContractPacket(readPacket(filePath));
}

if (process.argv[1] === import.meta.filename) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage: node contracts/champagne-os/contract-validator.mjs <packet.json> [...]");
    process.exit(2);
  }
  let failed = false;
  for (const file of files) {
    const result = validateFile(path.resolve(file));
    if (result.valid) console.log(`PASS ${file}`);
    else {
      failed = true;
      console.error(`FAIL ${file}`);
      for (const error of result.errors) console.error(`- ${error}`);
    }
  }
  process.exit(failed ? 1 : 0);
}
