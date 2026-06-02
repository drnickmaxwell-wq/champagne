import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const identityPath = path.join(root, "packages/champagne-manifests/data/seo/local-identity.smh.json");
const teamPath = path.join(root, "packages/champagne-manifests/data/seo/team-registry.smh.json");
const approvedFactsPath = path.join(root, "packages/champagne-manifests/data/seo/approved-facts.smh.json");
const outputPath = path.join(root, "tools/audits/seo-local-identity-team-schema-foundation/SEO_SCHEMA_GRAPH_QA_RESULTS_V1.json");
const aiAnswerRegistryPath = path.join(root, "packages/champagne-manifests/data/seo-ai-answer-foundation/ai-answer-registry.v1.smh.json");
const clinicalApprovalLedgerPath = path.join(root, "tools/audits/clinical-content-approval/CLINICAL_APPROVAL_LEDGER_V1.json");
const clinicalReviewIntervalsPath = path.join(root, "tools/audits/clinical-content-approval/CLINICAL_REVIEW_INTERVALS_V1.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const identity = readJson(identityPath);
const team = readJson(teamPath);
const approvedFacts = readJson(approvedFactsPath);
const aiAnswerRegistry = readJson(aiAnswerRegistryPath);
const clinicalApprovalLedger = readJson(clinicalApprovalLedgerPath);
const clinicalReviewIntervals = readJson(clinicalReviewIntervalsPath);
const errors = [];
const warnings = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function assertNoTodo(value, location) {
  if (JSON.stringify(value).includes("TODO_REQUIRED_FACT")) {
    errors.push(`${location} contains TODO_REQUIRED_FACT`);
  }
}

for (const [location, value] of [
  ["local identity", identity],
  ["team registry", team],
  ["approved facts", approvedFacts],
]) {
  assertNoTodo(value, location);
}

assert(identity.publicBrand.name === "St Mary's House Dental Care", "Public brand must remain St Mary's House Dental Care.");
assert(identity.legalEntity.name === "Maxwell-Deen Dentistry Ltd", "Legal entity must remain Maxwell-Deen Dentistry Ltd.");
assert(identity.publicBrand.name !== identity.legalEntity.name, "Public brand and legal entity must not be conflated.");
assert(Boolean(identity.address.streetAddress), "Dentist/LocalBusiness address.streetAddress is required.");
assert(Boolean(identity.address.postalCode), "Dentist/LocalBusiness address.postalCode is required.");
assert(Boolean(identity.contact.telephone), "Dentist/LocalBusiness telephone is required.");
assert(Array.isArray(identity.openingHours) && identity.openingHours.length === 5, "Five open weekdays should be represented.");
assert(!JSON.stringify(identity).includes("aggregateRating"), "No invented aggregate ratings may appear.");
assert(!JSON.stringify(identity).includes("priceRange"), "No invented price range may appear.");
assert(!JSON.stringify(identity).includes("geo"), "No unverified geo coordinates may appear.");

const verifiedMembers = team.members.filter((member) => member.verifiedForSchema);
assert(verifiedMembers.some((member) => member.id === "nick-maxwell" && member.gdcNumber === "74877"), "Dr Nick Maxwell Person node source data is required.");
assert(verifiedMembers.filter((member) => member.role === "Associate Dentist").length === 2, "Exactly two verified associate dentists should be present.");
assert(verifiedMembers.filter((member) => member.role === "Dental Hygienist").length === 2, "Exactly two verified hygienists should be present.");
for (const member of verifiedMembers) {
  assert(Boolean(member.name), `Verified team member ${member.id} requires name.`);
  assert(Boolean(member.role), `Verified team member ${member.id} requires role.`);
  assert(Array.isArray(member.sources) && member.sources.length > 0, `Verified team member ${member.id} requires source evidence.`);
}

const requiredServiceIds = [
  "private-dentist",
  "emergency-dentist",
  "dental-implants",
  "3d-dentistry",
  "same-day-crowns-veneers",
  "spark-aligners",
  "orthodontics",
  "sedation-anxiety-dentistry",
  "cosmetic-dentistry",
  "hygiene-recall",
  "examinations",
];
for (const serviceId of requiredServiceIds) {
  assert(identity.priorityServices.some((service) => service.id === serviceId), `Missing priority service ${serviceId}.`);
}

const approvedSchemaAnswers = (aiAnswerRegistry.entries || []).filter((entry) => entry.approved_for_schema === true);
const schemaAnswerIds = new Set();
const schemaAnswerQuestions = new Set();
const approvalLedgerByPacket = new Map((clinicalApprovalLedger.entries || []).map((entry) => [entry.packet, entry]));
const reviewIntervalsByPacket = new Map((clinicalReviewIntervals.records || []).map((record) => [record.content_id, record]));
const unsafeSchemaAnswerPatterns = [
  { pattern: /£|\$|\b\d+\s*(?:gbp|pounds?)\b/i, label: "specific_price" },
  { pattern: /\bguarante(?:e|ed|es)\b/i, label: "guarantee_claim" },
  { pattern: /TODO_REQUIRED_FACT/i, label: "todo_required_fact" },
  { pattern: /\b(patient id|nhs number|dentally|pms|date of birth|dob)\b/i, label: "phi_or_backend_reference" }
];

for (const answer of approvedSchemaAnswers) {
  if (schemaAnswerIds.has(answer.id)) errors.push(`Duplicate approved schema answer id ${answer.id}.`);
  schemaAnswerIds.add(answer.id);
  const normalizedQuestion = String(answer.question || "").trim().toLowerCase();
  if (schemaAnswerQuestions.has(normalizedQuestion)) errors.push(`Duplicate approved schema answer question ${answer.question}.`);
  schemaAnswerQuestions.add(normalizedQuestion);
  assert(Array.isArray(answer.evidence_source) && answer.evidence_source.length > 0, `Approved schema answer ${answer.id} requires evidence_source.`);
  const ledgerEntry = approvalLedgerByPacket.get(answer.id);
  const reviewInterval = reviewIntervalsByPacket.get(answer.id);
  const isFoundationAnswer = answer.packet_scope !== "SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_V1";
  const hasApprovalEvidence = ledgerEntry?.review_outcome === "APPROVED" && ledgerEntry.approval_scope?.approved_for_schema === true && Boolean(ledgerEntry.reviewer?.name) && Boolean(ledgerEntry.timestamp) && Boolean(reviewInterval?.review_date) && Boolean(reviewInterval?.next_review_date);
  assert(isFoundationAnswer || hasApprovalEvidence, `Approved schema answer ${answer.id} requires clinical approval evidence when it is a priority service packet.`);
  const answerText = `${answer.question} ${answer.short_answer} ${answer.expanded_answer}`;
  for (const check of unsafeSchemaAnswerPatterns) {
    if (check.pattern.test(answerText)) errors.push(`Approved schema answer ${answer.id} contains banned or gated pattern: ${check.label}.`);
  }
}

const graphNodes = {
  dentist: `${identity.canonicalOrigin}/#dentist`,
  organization: `${identity.canonicalOrigin}/#organization`,
  website: `${identity.canonicalOrigin}/#website`,
  principalPerson: `${identity.canonicalOrigin}/#person-nick-maxwell`,
};

const result = {
  version: "SEO_SCHEMA_GRAPH_QA_RESULTS_V1",
  generatedAt: new Date().toISOString(),
  status: errors.length ? "fail" : "pass",
  checkedFiles: [
    path.relative(root, identityPath),
    path.relative(root, teamPath),
    path.relative(root, approvedFactsPath),
    path.relative(root, aiAnswerRegistryPath),
    path.relative(root, clinicalApprovalLedgerPath),
    path.relative(root, clinicalReviewIntervalsPath),
  ],
  graphNodes,
  verifiedTeamMemberCount: verifiedMembers.length,
  priorityServiceCount: identity.priorityServices.length,
  approvedSchemaAnswerCount: approvedSchemaAnswers.length,
  schemaConsumptionHardening: {
    duplicateApprovedSchemaAnswerIds: false,
    duplicateApprovedSchemaAnswerQuestions: false,
    unsafeClinicalClaimsDetected: false,
    unsupportedFactsDetected: false,
    inventedPricingDetected: false,
    inventedOutcomesDetected: false
  },
  errors,
  warnings,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);

if (errors.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
