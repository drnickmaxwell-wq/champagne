import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exportPath = path.join(__dirname, "CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json");
const statusPath = path.join(__dirname, "CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1.json");
const exportData = JSON.parse(fs.readFileSync(exportPath, "utf8"));
const status = JSON.parse(fs.readFileSync(statusPath, "utf8"));

const requiredPageFields = [
  "schemaVersion",
  "pageId",
  "sourceRepo",
  "route",
  "pageType",
  "routeGroup",
  "title",
  "h1",
  "metaDescription",
  "canonicalPath",
  "contentBlocks",
  "ctaBlocks",
  "mediaSlots",
  "componentRefs",
  "seoFields",
  "structuredDataFields",
  "sourceFileRefs",
  "riskFlags",
  "rewriteEligibility",
  "mediaPlacementEligibility",
  "bundleEligibility",
  "unknownFields",
  "extractionStatus",
  "extractionBlockers",
  "evidenceRefs",
  "authorityPosture",
  "notes",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(exportData.schemaVersion === "CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1", "Unexpected root schemaVersion");
assert(Array.isArray(exportData.pages), "pages must be an array");
assert(status.exportCreated === true, "status exportCreated must be true");
assert(status.pagesFound === exportData.pages.length, "status pagesFound must match export page count");

const ids = new Set();
const routes = new Set();
for (const page of exportData.pages) {
  for (const field of requiredPageFields) assert(Object.hasOwn(page, field), `Missing page field ${field} on ${page.route ?? page.pageId}`);
  assert(page.schemaVersion === "CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1", `Unexpected page schemaVersion on ${page.route}`);
  assert(!ids.has(page.pageId), `Duplicate pageId ${page.pageId}`);
  assert(!routes.has(page.route), `Duplicate route ${page.route}`);
  ids.add(page.pageId);
  routes.add(page.route);
  const posture = page.authorityPosture;
  for (const key of ["canMutateChampagne", "canApplyRewrite", "canPublish", "canDeploy", "canTouchPhi", "networkCallsAllowed", "providerCallsAllowed", "launchReadyClaimAllowed"]) {
    assert(posture[key] === false, `Authority posture ${key} must be false on ${page.route}`);
  }
}

for (const key of ["repoMutatedExistingFiles", "websiteBehaviourChanged", "contentRewritten", "routesChanged", "metadataChanged", "mediaChanged", "deploymentRun", "phiTouched", "networkCallsMade", "launchReadyClaim"]) {
  assert(status[key] === false, `Status ${key} must be false`);
}

console.log(JSON.stringify({ valid: true, pages: exportData.pages.length, statuses: status.extractionStatusSummary }, null, 2));
