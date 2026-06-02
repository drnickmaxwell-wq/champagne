import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "tools/audits/seo-ai-answer-priority-service-packet");
const registryDir = path.join(root, "packages/champagne-manifests/data/seo-ai-answer-foundation");
const aiAnswerRegistryPath = path.join(registryDir, "ai-answer-registry.v1.smh.json");
const treatmentFactRegistryPath = path.join(registryDir, "treatment-fact-registry.v1.smh.json");
const questionInventoryPath = path.join(registryDir, "question-inventory.v1.smh.json");
const chatbotAlignmentPath = path.join(registryDir, "chatbot-answer-alignment.v1.smh.json");
const manifestPath = path.join(root, "packages/champagne-manifests/data/champagne_machine_manifest_full.json");
const foundationAuditPath = path.join(root, "tools/audits/seo-ai-answer-foundation/AI_SEARCH_READINESS_AUDIT_V1.json");
const clinicalApprovalLedgerPath = path.join(root, "tools/audits/clinical-content-approval/CLINICAL_APPROVAL_LEDGER_V1.json");
const clinicalReviewIntervalsPath = path.join(root, "tools/audits/clinical-content-approval/CLINICAL_REVIEW_INTERVALS_V1.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(fileName, payload) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, fileName), `${JSON.stringify(payload, null, 2)}\n`);
}

function writeText(fileName, content) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, fileName), content);
}

function words(value) {
  return String(value || "").trim().split(/\s+/).filter(Boolean);
}

function textFromValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textFromValue).join(" ");
  if (typeof value === "object") return Object.values(value).map(textFromValue).join(" ");
  return String(value);
}

function unique(values) {
  return [...new Set(values)];
}

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

const generatedAt = new Date().toISOString();
const aiAnswerRegistry = readJson(aiAnswerRegistryPath);
const treatmentFactRegistry = readJson(treatmentFactRegistryPath);
const questionInventory = readJson(questionInventoryPath);
const chatbotAlignment = readJson(chatbotAlignmentPath);
const manifest = readJson(manifestPath);
const previousFoundationAudit = fs.existsSync(foundationAuditPath) ? readJson(foundationAuditPath) : null;
const clinicalApprovalLedger = readJson(clinicalApprovalLedgerPath);
const clinicalReviewIntervals = readJson(clinicalReviewIntervalsPath);

const priorityServices = [
  { id: "emergency-dentist", routePath: "/treatments/emergency-dentistry", packetGroup: "emergency dentist" },
  { id: "dental-implants", routePath: "/treatments/implants", packetGroup: "dental implants" },
  { id: "private-dentist", routePath: "/contact", packetGroup: "private dentist / new patient examination" },
  { id: "examinations", routePath: "/treatments/dental-checkups-oral-cancer-screening", packetGroup: "private dentist / new patient examination" },
  { id: "spark-aligners", routePath: "/treatments/clear-aligners-spark", packetGroup: "Spark Aligners / orthodontics" },
  { id: "orthodontics", routePath: "/treatments/orthodontics", packetGroup: "Spark Aligners / orthodontics" },
  { id: "3d-dentistry", routePath: "/treatments/3d-dentistry-and-technology", packetGroup: "3D dentistry / same-day crowns" },
  { id: "same-day-crowns-veneers", routePath: "/treatments/3d-digital-dentistry", packetGroup: "3D dentistry / same-day crowns" },
  { id: "veneers", routePath: "/treatments/veneers", packetGroup: "veneers / cosmetic dentistry" },
  { id: "cosmetic-dentistry", routePath: "/treatments/cosmetic-dentistry", packetGroup: "veneers / cosmetic dentistry" },
  { id: "sedation-anxiety-dentistry", routePath: "/treatments/sedation-dentistry", packetGroup: "sedation / anxiety dentistry" },
  { id: "hygiene-recall", routePath: "/treatments/preventative-and-general-dentistry", packetGroup: "hygiene / recall" }
];

const packetEntries = aiAnswerRegistry.entries.filter((entry) => entry.packet_scope === "SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_V1");
const answersByService = Object.fromEntries(priorityServices.map((service) => [service.id, packetEntries.filter((entry) => entry.service === service.id)]));
const factsByService = Object.fromEntries(priorityServices.map((service) => [service.id, treatmentFactRegistry.entries.filter((entry) => entry.service === service.id)]));
const questionsByService = Object.fromEntries(priorityServices.map((service) => [service.id, questionInventory.questions.filter((entry) => entry.service === service.id)]));
const chatbotMappingsByService = Object.fromEntries(priorityServices.map((service) => [service.id, chatbotAlignment.mappings.filter((mapping) => (mapping.answer_registry_ids || []).some((id) => answersByService[service.id].some((answer) => answer.id === id)))]));
const approvalFlags = ["approved_for_ai", "approved_for_voice", "approved_for_chatbot", "approved_for_schema"];
const approvalLedgerByPacket = new Map((clinicalApprovalLedger.entries || []).map((entry) => [entry.packet, entry]));
const reviewIntervalsByPacket = new Map((clinicalReviewIntervals.records || []).map((record) => [record.content_id, record]));

const errors = [];
const warnings = [];
const bannedClaimPatterns = [
  { pattern: /£|\$|\b\d+\s*(?:gbp|pounds?)\b/i, label: "specific_price" },
  { pattern: /\bguarante(?:e|ed|es)\b/i, label: "guarantee_claim" },
  { pattern: /\bdiagnos(?:e|is|ed|ing)\b/i, label: "diagnosis_language" },
  { pattern: /TODO_REQUIRED_FACT/i, label: "todo_required_fact" },
  { pattern: /\b(patient id|nhs number|dentally|pms|date of birth|dob)\b/i, label: "phi_or_backend_reference" }
];

for (const service of priorityServices) {
  if (!answersByService[service.id].length) errors.push(`Missing priority answer packet for ${service.id}.`);
  if (!factsByService[service.id].length) errors.push(`Missing treatment fact entry for ${service.id}.`);
  if (questionsByService[service.id].length < 3) errors.push(`Fewer than three question mappings for ${service.id}.`);
  if (!chatbotMappingsByService[service.id].length) errors.push(`Missing chatbot alignment mapping for ${service.id}.`);
}

for (const entry of packetEntries) {
  const shortWords = words(entry.short_answer).length;
  const expandedWords = words(entry.expanded_answer).length;
  if (shortWords < 40 || shortWords > 80) errors.push(`${entry.id} short_answer has ${shortWords} words; expected 40-80.`);
  if (expandedWords < 120 || expandedWords > 220) errors.push(`${entry.id} expanded_answer has ${expandedWords} words; expected 120-220.`);
  for (const required of ["service_id", "route_slug", "question", "intent_type", "location_scope", "evidence_source"]) {
    if (!entry[required] || (Array.isArray(entry[required]) && !entry[required].length)) errors.push(`${entry.id} missing ${required}.`);
  }
  if (entry.clinician_review_required !== true) errors.push(`${entry.id} must keep clinician_review_required true as the clinical safety boundary even after governance approval.`);
  const ledgerEntry = approvalLedgerByPacket.get(entry.id);
  const reviewInterval = reviewIntervalsByPacket.get(entry.id);
  const hasApprovalEvidence = ledgerEntry?.review_outcome === "APPROVED" && Boolean(ledgerEntry.reviewer?.name) && Boolean(ledgerEntry.timestamp) && Boolean(reviewInterval?.review_date) && Boolean(reviewInterval?.next_review_date);
  for (const approvalFlag of approvalFlags) {
    if (entry[approvalFlag] === true) {
      if (!hasApprovalEvidence) errors.push(`${entry.id} sets ${approvalFlag} true without approval evidence, reviewer, review date, and next review date.`);
      if (ledgerEntry?.approval_scope?.[approvalFlag] !== true) errors.push(`${entry.id} sets ${approvalFlag} true without ledger recommendation.`);
    }
    if (hasApprovalEvidence && ledgerEntry.approval_scope?.[approvalFlag] === true && entry[approvalFlag] !== true) {
      errors.push(`${entry.id} must enable ${approvalFlag} because the approval ledger recommends enablement.`);
    }
    if (!hasApprovalEvidence && entry[approvalFlag] !== false) errors.push(`${entry.id} must keep ${approvalFlag} false until approval evidence exists.`);
  }
  const text = `${entry.question} ${entry.short_answer} ${entry.expanded_answer}`;
  for (const check of bannedClaimPatterns) {
    if (check.pattern.test(text)) errors.push(`${entry.id} contains banned or gated pattern: ${check.label}.`);
  }
}

for (const fact of treatmentFactRegistry.entries.filter((entry) => priorityServices.some((service) => service.id === entry.service))) {
  for (const unknownField of ["typical_duration", "recovery_category", "finance_availability"]) {
    if (fact[unknownField] !== null) errors.push(`${fact.id} must leave ${unknownField} null unless approved evidence exists.`);
  }
  if (fact.source_status !== "unknown") warnings.push(`${fact.id} source_status is ${fact.source_status}; expected unknown for unapproved duration/recovery/finance facts.`);
}

const linkedQuestionIds = new Set(questionInventory.questions.map((question) => question.answer_registry_id).filter(Boolean));
for (const linkedId of linkedQuestionIds) {
  if (!aiAnswerRegistry.entries.some((entry) => entry.id === linkedId)) errors.push(`Question inventory links missing answer id ${linkedId}.`);
}

const pages = Object.values(manifest.pages || {});
const treatmentPages = pages.filter((page) => page.path?.startsWith("/treatments/"));
const answerSurfacePages = treatmentPages.filter((page) => page.answerSurface?.sections?.length);
const priorityTreatmentRoutes = priorityServices.filter((service) => service.routePath.startsWith("/treatments/"));
const visibleRenderingTodo = priorityTreatmentRoutes
  .filter((service) => !answerSurfacePages.some((page) => page.path === service.routePath))
  .map((service) => ({
    service_id: service.id,
    route_path: service.routePath,
    recommendation: "Future visible rendering mission: add reviewed answer-surface blocks without redesign or full page rewrite."
  }));

const servicesWithPackets = priorityServices.filter((service) => answersByService[service.id].length).map((service) => service.id);
const servicesWithFacts = priorityServices.filter((service) => factsByService[service.id].length).map((service) => service.id);
const servicesWithThreeQuestions = priorityServices.filter((service) => questionsByService[service.id].length >= 3).map((service) => service.id);
const servicesWithChatbotMap = priorityServices.filter((service) => chatbotMappingsByService[service.id].length).map((service) => service.id);
const priorityRoutesWithAnswerSurface = priorityTreatmentRoutes.filter((service) => answerSurfacePages.some((page) => page.path === service.routePath)).map((service) => service.id);

const aiReadinessScore = Math.round((
  pct(servicesWithPackets.length, priorityServices.length) * 0.35 +
  pct(servicesWithFacts.length, priorityServices.length) * 0.2 +
  pct(servicesWithThreeQuestions.length, priorityServices.length) * 0.15 +
  pct(servicesWithChatbotMap.length, priorityServices.length) * 0.15 +
  pct(priorityRoutesWithAnswerSurface.length, priorityTreatmentRoutes.length) * 0.15
));
const zeroClickReadinessScore = Math.round((
  pct(servicesWithPackets.length, priorityServices.length) * 0.4 +
  pct(servicesWithThreeQuestions.length, priorityServices.length) * 0.25 +
  pct(priorityRoutesWithAnswerSurface.length, priorityTreatmentRoutes.length) * 0.25 +
  pct(packetEntries.filter((entry) => entry.approved_for_schema === true).length, Math.max(packetEntries.length, 1)) * 0.1
));

const coverage = {
  version: "SEO_PRIORITY_SERVICE_ANSWER_COVERAGE_V1",
  generatedAt,
  priorityServices: priorityServices.map((service) => ({
    ...service,
    answerPacketIds: answersByService[service.id].map((entry) => entry.id),
    treatmentFactIds: factsByService[service.id].map((entry) => entry.id),
    mappedQuestionCount: questionsByService[service.id].length,
    chatbotAlignmentIds: chatbotMappingsByService[service.id].map((entry) => entry.id),
    hasVisibleAnswerSurface: priorityRoutesWithAnswerSurface.includes(service.id)
  })),
  summary: {
    priorityServiceCount: priorityServices.length,
    servicesWithPackets: servicesWithPackets.length,
    servicesWithFacts: servicesWithFacts.length,
    servicesWithThreeOrMoreQuestions: servicesWithThreeQuestions.length,
    servicesWithChatbotAlignment: servicesWithChatbotMap.length,
    priorityRoutesWithVisibleAnswerSurface: priorityRoutesWithAnswerSurface.length
  }
};

const qaResults = {
  version: "SEO_ZERO_CLICK_PACKET_QA_RESULTS_V1",
  generatedAt,
  status: errors.length ? "fail" : "pass",
  errors,
  warnings,
  checks: {
    answerPacketCount: packetEntries.length,
    shortAnswerWordRange: "40-80",
    expandedAnswerWordRange: "120-220",
    priorityServicesCovered: servicesWithPackets,
    servicesWithVisibleRenderingTodo: visibleRenderingTodo.map((item) => item.service_id),
    linkedQuestionCount: linkedQuestionIds.size,
    unmappedSeedQuestions: questionInventory.questions.filter((question) => !question.answer_registry_id).map((question) => question.id),
    approvedPacketFlagsAcceptedWithEvidence: packetEntries.every((entry) => approvalFlags.every((approvalFlag) => entry[approvalFlag] !== true || (approvalLedgerByPacket.get(entry.id)?.review_outcome === "APPROVED" && approvalLedgerByPacket.get(entry.id)?.approval_scope?.[approvalFlag] === true && Boolean(approvalLedgerByPacket.get(entry.id)?.reviewer?.name) && Boolean(approvalLedgerByPacket.get(entry.id)?.timestamp) && Boolean(reviewIntervalsByPacket.get(entry.id)?.review_date) && Boolean(reviewIntervalsByPacket.get(entry.id)?.next_review_date)))),
    approvedPacketCount: packetEntries.filter((entry) => approvalFlags.every((approvalFlag) => entry[approvalFlag] === true)).length,
    unapprovedPacketIds: packetEntries.filter((entry) => approvalFlags.every((approvalFlag) => entry[approvalFlag] === false)).map((entry) => entry.id)
  },
  scores: {
    previousAiReadinessScore: previousFoundationAudit?.scores?.aiReadinessScore ?? null,
    previousZeroClickReadinessScore: previousFoundationAudit?.scores?.zeroClickReadinessScore ?? null,
    aiReadinessScore,
    zeroClickReadinessScore
  }
};

const factGapTodo = {
  version: "SEO_TREATMENT_FACT_GAP_TODO_V1",
  generatedAt,
  status: "clinician_review_required",
  nullOrUnknownFacts: treatmentFactRegistry.entries
    .filter((entry) => priorityServices.some((service) => service.id === entry.service))
    .map((entry) => ({
      service_id: entry.service,
      treatment_fact_id: entry.id,
      route_path: entry.route_path,
      source_status: entry.source_status,
      null_fields: ["typical_duration", "recovery_category", "alternatives_available", "finance_availability", "consultation_availability", "clinician_types"].filter((field) => entry[field] === null),
      recommendation: "Leave null until approved public source or clinician-reviewed content provides this fact."
    }))
};

const renderingTodo = {
  version: "SEO_VISIBLE_RENDERING_TODO_V1",
  generatedAt,
  status: visibleRenderingTodo.length ? "future_rendering_mission_required" : "no_todo",
  items: visibleRenderingTodo,
  boundary: "No visual rendering changes were made in SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_V1."
};

const report = {
  version: "SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_REPORT_V1",
  generatedAt,
  status: errors.length ? "fail" : "pass_activation_supported",
  mission: "SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_V1",
  scopeBoundary: [
    "Bounded answer-packet registry population only.",
    "No redesign, no mass page rewrite, no chatbot runtime mutation, no PHI/PMS/Dentally, no deployment, and no launch certification claim."
  ],
  filesAudited: [
    path.relative(root, aiAnswerRegistryPath),
    path.relative(root, treatmentFactRegistryPath),
    path.relative(root, questionInventoryPath),
    path.relative(root, chatbotAlignmentPath),
    path.relative(root, manifestPath),
    path.relative(root, clinicalApprovalLedgerPath),
    path.relative(root, clinicalReviewIntervalsPath)
  ],
  answerPacketsAdded: packetEntries.length,
  servicesCovered: servicesWithPackets,
  servicesStillMissing: priorityServices.filter((service) => !servicesWithPackets.includes(service.id)).map((service) => service.id),
  factsLeftNullOrTodo: factGapTodo.nullOrUnknownFacts,
  scores: qaResults.scores,
  visibleRenderingTodoCount: visibleRenderingTodo.length,
  errors,
  warnings
};

const reportMd = `# SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_REPORT_V1\n\n## Mission\n\nSEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_V1.\n\n## Scope boundary\n\nBounded answer-packet population only. No page redesign, no mass treatment rewrite, no chatbot runtime mutation, no PHI, no PMS/Dentally, no deployment, and no launch certification claim.\n\n## Coverage\n\n- Priority answer packets added: ${packetEntries.length}.\n- Priority services covered: ${servicesWithPackets.length}/${priorityServices.length}.\n- Services still missing answer packets: ${report.servicesStillMissing.length ? report.servicesStillMissing.join(", ") : "none"}.\n- Services with at least three mapped questions: ${servicesWithThreeQuestions.length}/${priorityServices.length}.\n- Chatbot alignment mappings present: ${servicesWithChatbotMap.length}/${priorityServices.length}.\n- Priority routes already carrying visible answer surfaces: ${priorityRoutesWithAnswerSurface.length}/${priorityTreatmentRoutes.length}.\n\n## Scores\n\n- Previous AI readiness score: ${qaResults.scores.previousAiReadinessScore ?? "not available"}.\n- Previous zero-click readiness score: ${qaResults.scores.previousZeroClickReadinessScore ?? "not available"}.\n- Packet AI readiness score: ${aiReadinessScore}.\n- Packet zero-click readiness score: ${zeroClickReadinessScore}.\n\n## Facts left null\n\nDuration, recovery, finance, personal suitability, and unapproved alternatives remain null or unknown unless approved public source evidence exists. See SEO_TREATMENT_FACT_GAP_TODO_V1.json.\n\n## Visible rendering TODO\n\n${visibleRenderingTodo.length ? visibleRenderingTodo.map((item) => `- ${item.service_id}: ${item.route_path}`).join("\n") : "- None."}\n\n## QA status\n\nStatus: ${qaResults.status}.\n\n${errors.length ? `Errors:\n${errors.map((error) => `- ${error}`).join("\n")}` : "No packet QA errors detected."}\n`;

const nextBuildRecommendation = `# SEO_NEXT_BUILD_RECOMMENDATION_V1\n\nRecommended next mission: SEO_VISIBLE_ANSWER_SURFACE_RENDERING_V1.\n\n## Why\n\nThe priority service packet registries now contain clinician-reviewable answer packets and question mappings, but most priority treatment routes still do not render visible answer-surface sections in the machine manifest.\n\n## Scope recommendation\n\n- Add reviewed, visible answer-surface blocks only where routes already support the pattern or after a bounded rendering enablement.\n- Keep all clinical answers clinician-review-required until approval.\n- Keep enabled AI, voice, chatbot, and schema flags limited to packets with explicit approval ledger evidence.\n- Preserve the no-redesign and no-mass-rewrite boundary.\n`;

writeJson("SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_REPORT_V1.json", report);
writeText("SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_REPORT_V1.md", reportMd);
writeJson("SEO_PRIORITY_SERVICE_ANSWER_COVERAGE_V1.json", coverage);
writeJson("SEO_ZERO_CLICK_PACKET_QA_RESULTS_V1.json", qaResults);
writeJson("SEO_TREATMENT_FACT_GAP_TODO_V1.json", factGapTodo);
writeJson("SEO_VISIBLE_RENDERING_TODO_V1.json", renderingTodo);
writeText("SEO_NEXT_BUILD_RECOMMENDATION_V1.md", nextBuildRecommendation);

const consoleReport = {
  version: "SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_QA_V1",
  generatedAt,
  status: qaResults.status,
  answerPacketsAdded: packetEntries.length,
  servicesCovered: servicesWithPackets.length,
  priorityServiceCount: priorityServices.length,
  aiReadinessScore,
  zeroClickReadinessScore,
  errors,
  warnings,
  outputDir: path.relative(root, outputDir)
};

console.log(JSON.stringify(consoleReport, null, 2));
if (errors.length) process.exit(1);
