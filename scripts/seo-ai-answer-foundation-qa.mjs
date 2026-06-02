import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "tools/audits/seo-ai-answer-foundation");
const manifestPath = path.join(root, "packages/champagne-manifests/data/champagne_machine_manifest_full.json");
const approvedFactsPath = path.join(root, "packages/champagne-manifests/data/seo/approved-facts.smh.json");
const localIdentityPath = path.join(root, "packages/champagne-manifests/data/seo/local-identity.smh.json");
const teamRegistryPath = path.join(root, "packages/champagne-manifests/data/seo/team-registry.smh.json");
const aiAnswerRegistryPath = path.join(root, "packages/champagne-manifests/data/seo-ai-answer-foundation/ai-answer-registry.v1.smh.json");
const treatmentFactRegistryPath = path.join(root, "packages/champagne-manifests/data/seo-ai-answer-foundation/treatment-fact-registry.v1.smh.json");
const questionInventoryPath = path.join(root, "packages/champagne-manifests/data/seo-ai-answer-foundation/question-inventory.v1.smh.json");
const voiceSearchPatternRegistryPath = path.join(root, "packages/champagne-manifests/data/seo-ai-answer-foundation/voice-search-pattern-registry.v1.json");
const chatbotAlignmentPath = path.join(root, "packages/champagne-manifests/data/seo-ai-answer-foundation/chatbot-answer-alignment.v1.smh.json");

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

const manifest = readJson(manifestPath);
const approvedFacts = readJson(approvedFactsPath);
const localIdentity = readJson(localIdentityPath);
const teamRegistry = readJson(teamRegistryPath);
const aiAnswerRegistry = readJson(aiAnswerRegistryPath);
const treatmentFactRegistry = readJson(treatmentFactRegistryPath);
const questionInventory = readJson(questionInventoryPath);
const voiceSearchPatternRegistry = readJson(voiceSearchPatternRegistryPath);
const chatbotAlignment = readJson(chatbotAlignmentPath);

const generatedAt = new Date().toISOString();
const pages = Object.values(manifest.pages || {});
const treatmentPages = pages.filter((page) => page.path?.startsWith("/treatments/"));
const answerSurfacePages = treatmentPages.filter((page) => page.answerSurface?.sections?.length);
const answerSurfaceSections = answerSurfacePages.flatMap((page) => page.answerSurface.sections || []);
const answerSurfaceFaqs = answerSurfaceSections.flatMap((section) => section.faqs || []);
const pageSectionTypes = unique(pages.flatMap((page) => (page.sections || []).map((section) => section.type || section.kind || section.component || section.id).filter(Boolean))).sort();
const metadataSurfaceCount = pages.filter((page) => page.label || page.description || page.intro).length;
const schemaSources = [
  "packages/champagne-manifests/src/seo.ts",
  "apps/web/app/layout.tsx",
  "apps/web/app/treatments/[slug]/page.tsx",
  "scripts/seo-schema-graph-qa.mjs"
];

const priorityServiceIds = localIdentity.priorityServices.map((service) => service.id);
const answerIds = new Set(aiAnswerRegistry.entries.map((entry) => entry.id));
const treatmentFactIds = new Set(treatmentFactRegistry.entries.map((entry) => entry.id));
const questionLinkedAnswerIds = questionInventory.questions.map((question) => question.answer_registry_id).filter(Boolean);
const answersByService = Object.fromEntries(priorityServiceIds.map((serviceId) => [serviceId, aiAnswerRegistry.entries.filter((entry) => entry.service === serviceId).length]));
const treatmentFactsByService = Object.fromEntries(priorityServiceIds.map((serviceId) => [serviceId, treatmentFactRegistry.entries.filter((entry) => entry.service === serviceId).length]));
const questionsByService = Object.fromEntries(questionInventory.targetServices.map((serviceId) => [serviceId, questionInventory.questions.filter((entry) => entry.service === serviceId).length]));
const questionsByIntent = Object.fromEntries(questionInventory.supportedIntentTypes.map((intent) => [intent, questionInventory.questions.filter((entry) => entry.intent_type === intent).length]));

const registryErrors = [];
const registryWarnings = [];

if (aiAnswerRegistry.version !== "AI_ANSWER_REGISTRY_V1") registryErrors.push("AI answer registry version mismatch.");
if (treatmentFactRegistry.version !== "TREATMENT_FACT_REGISTRY_V1") registryErrors.push("Treatment fact registry version mismatch.");
if (questionInventory.version !== "QUESTION_INVENTORY_V1") registryErrors.push("Question inventory version mismatch.");
if (voiceSearchPatternRegistry.version !== "VOICE_SEARCH_PATTERN_REGISTRY_V1") registryErrors.push("Voice search pattern registry version mismatch.");
if (chatbotAlignment.version !== "CHATBOT_ANSWER_ALIGNMENT_V1") registryErrors.push("Chatbot alignment registry version mismatch.");

for (const entry of aiAnswerRegistry.entries) {
  for (const required of ["id", "service", "location_scope", "intent_type", "question", "short_answer", "expanded_answer", "evidence_source"]) {
    if (!entry[required] || (Array.isArray(entry[required]) && entry[required].length === 0)) registryErrors.push(`AI answer ${entry.id || "unknown"} missing ${required}.`);
  }
  if (words(entry.short_answer).length > 45) registryWarnings.push(`AI answer ${entry.id} short_answer is over 45 words.`);
  if (words(entry.expanded_answer).length > 120) registryWarnings.push(`AI answer ${entry.id} expanded_answer is over 120 words.`);
}

for (const entry of treatmentFactRegistry.entries) {
  if (!entry.evidence_source?.length) registryErrors.push(`Treatment fact ${entry.id} has no evidence_source.`);
  if (!priorityServiceIds.includes(entry.service)) registryWarnings.push(`Treatment fact ${entry.id} maps to a service outside approved priorityServices.`);
}

for (const question of questionInventory.questions) {
  if (question.answer_registry_id && !answerIds.has(question.answer_registry_id)) registryErrors.push(`Question ${question.id} references missing answer ${question.answer_registry_id}.`);
}

for (const mapping of chatbotAlignment.mappings) {
  for (const answerId of mapping.answer_registry_ids || []) {
    if (!answerIds.has(answerId)) registryErrors.push(`Chatbot alignment ${mapping.id} references missing answer ${answerId}.`);
  }
  for (const treatmentFactId of mapping.treatment_fact_ids || []) {
    if (!treatmentFactIds.has(treatmentFactId)) registryErrors.push(`Chatbot alignment ${mapping.id} references missing treatment fact ${treatmentFactId}.`);
  }
}

const duplicateShortAnswers = Object.entries(aiAnswerRegistry.entries.reduce((acc, entry) => {
  const key = entry.short_answer.trim().toLowerCase();
  acc[key] = [...(acc[key] || []), entry.id];
  return acc;
}, {})).filter(([, ids]) => ids.length > 1).map(([shortAnswer, ids]) => ({ shortAnswer, ids }));

const weakAnswers = aiAnswerRegistry.entries
  .filter((entry) => words(entry.short_answer).length < 8 || words(entry.expanded_answer).length < 18)
  .map((entry) => ({ id: entry.id, shortAnswerWords: words(entry.short_answer).length, expandedAnswerWords: words(entry.expanded_answer).length }));

const overlyLongAnswers = aiAnswerRegistry.entries
  .filter((entry) => words(entry.short_answer).length > 45 || words(entry.expanded_answer).length > 120)
  .map((entry) => ({ id: entry.id, shortAnswerWords: words(entry.short_answer).length, expandedAnswerWords: words(entry.expanded_answer).length }));

const jargonTerms = ["prosthodontic", "occlusion", "periodontal", "endodontic", "orthognathic", "aetiology"];
const jargonHeavyAnswers = aiAnswerRegistry.entries
  .map((entry) => ({ id: entry.id, terms: jargonTerms.filter((term) => textFromValue(entry).toLowerCase().includes(term)) }))
  .filter((entry) => entry.terms.length > 0);

const priorityServicesMissingAnswers = priorityServiceIds.filter((serviceId) => !answersByService[serviceId]);
const priorityServicesMissingTreatmentFacts = priorityServiceIds.filter((serviceId) => !treatmentFactsByService[serviceId]);
const targetServicesMissingQuestions = questionInventory.targetServices.filter((serviceId) => !questionsByService[serviceId]);
const priorityTreatmentPagesMissingAnswerSurface = localIdentity.priorityServices
  .filter((service) => service.routePath?.startsWith("/treatments/"))
  .filter((service) => !treatmentPages.find((page) => page.path === service.routePath)?.answerSurface?.sections?.length)
  .map((service) => ({ service: service.id, routePath: service.routePath }));

const zeroClickAudit = {
  version: "ZERO_CLICK_READINESS_AUDIT_V1",
  generatedAt,
  status: registryErrors.length ? "fail" : "recommendations_only",
  checks: {
    missingAnswerBlocks: priorityServicesMissingAnswers.map((service) => ({ service, recommendation: "Create a reviewed AI_ANSWER_REGISTRY_V1 entry before enabling AI, voice, chatbot or schema output for this service." })),
    missingFaqs: priorityTreatmentPagesMissingAnswerSurface.map((item) => ({ ...item, recommendation: "Add or validate answer-surface FAQ coverage in a future content packet; do not rewrite during foundation mission." })),
    weakAnswers,
    duplicatedAnswers: duplicateShortAnswers,
    overlyLongAnswers,
    jargonHeavyAnswers
  },
  summary: {
    answerRegistryEntries: aiAnswerRegistry.entries.length,
    priorityServiceCount: priorityServiceIds.length,
    priorityServicesWithAnswers: priorityServiceIds.length - priorityServicesMissingAnswers.length,
    answerSurfaceTreatmentPages: answerSurfacePages.length,
    answerSurfaceFaqCount: answerSurfaceFaqs.length
  },
  recommendations: [
    "Prioritise one short direct answer plus one FAQ set for each approved priority service.",
    "Keep clinical suitability, risks, alternatives, fees, duration and recovery claims behind clinician review until approved sources exist.",
    "Map future FAQPage schema only to answers approved_for_schema."
  ]
};

const questionInventoryAudit = {
  version: "QUESTION_INVENTORY_AUDIT_V1",
  generatedAt,
  status: "partial_foundation",
  targetServices: questionInventory.targetServices,
  supportedIntentTypes: questionInventory.supportedIntentTypes,
  totalQuestions: questionInventory.questions.length,
  linkedQuestionCount: questionLinkedAnswerIds.length,
  questionsByService,
  questionsByIntent,
  targetServicesMissingQuestions,
  unmappedQuestions: questionInventory.questions.filter((question) => !question.answer_registry_id).map((question) => question.id),
  recommendations: [
    "Expand to at least one reviewed question per service and intent cluster before mass answer drafting.",
    "Keep question inventory separate from generated page copy to avoid accidental mass rewrites."
  ]
};

const chatbotAlignmentAudit = {
  version: "CHATBOT_ALIGNMENT_AUDIT_V1",
  generatedAt,
  status: registryErrors.length ? "fail" : "alignment_foundation_only",
  runtimeMutation: chatbotAlignment.runtimeMutation,
  mappingCount: chatbotAlignment.mappings.length,
  answerRegistryIdsMapped: unique(chatbotAlignment.mappings.flatMap((mapping) => mapping.answer_registry_ids || [])).length,
  treatmentFactIdsMapped: unique(chatbotAlignment.mappings.flatMap((mapping) => mapping.treatment_fact_ids || [])).length,
  unmappedAnswerRegistryIds: [...answerIds].filter((id) => !chatbotAlignment.mappings.some((mapping) => mapping.answer_registry_ids.includes(id))),
  unmappedTreatmentFactIds: [...treatmentFactIds].filter((id) => !chatbotAlignment.mappings.some((mapping) => mapping.treatment_fact_ids.includes(id))),
  driftRisks: registryErrors,
  recommendations: [
    "Use this mapping as the future chatbot drift detector input; do not connect it to runtime behaviour until separately authorised.",
    "Require every chatbot-approved answer to map back to approved fact references."
  ]
};

const aiReadinessScore = Math.round((
  pct(priorityServiceIds.length - priorityServicesMissingAnswers.length, priorityServiceIds.length) * 0.25 +
  pct(priorityServiceIds.length - priorityServicesMissingTreatmentFacts.length, priorityServiceIds.length) * 0.2 +
  pct(answerSurfacePages.length, treatmentPages.length) * 0.2 +
  pct(questionLinkedAnswerIds.length, questionInventory.questions.length) * 0.15 +
  pct(chatbotAlignmentAudit.answerRegistryIdsMapped, aiAnswerRegistry.entries.length) * 0.1 +
  pct(voiceSearchPatternRegistry.patterns.length, 7) * 0.1
));

const zeroClickReadinessScore = Math.round((
  pct(priorityServiceIds.length - priorityServicesMissingAnswers.length, priorityServiceIds.length) * 0.35 +
  pct(answerSurfacePages.length, treatmentPages.length) * 0.25 +
  pct(answerSurfaceFaqs.length, Math.max(priorityServiceIds.length * 3, 1)) * 0.15 +
  pct(aiAnswerRegistry.entries.length - weakAnswers.length - overlyLongAnswers.length, aiAnswerRegistry.entries.length) * 0.15 +
  pct(questionLinkedAnswerIds.length, questionInventory.questions.length) * 0.1
));

const aiSearchReadinessAudit = {
  version: "AI_SEARCH_READINESS_AUDIT_V1",
  generatedAt,
  status: registryErrors.length ? "fail" : "foundation_ready_with_gaps",
  scores: {
    aiReadinessScore,
    zeroClickReadinessScore
  },
  coverage: {
    answerCoverage: {
      priorityServiceCount: priorityServiceIds.length,
      priorityServicesWithAnswers: priorityServiceIds.length - priorityServicesMissingAnswers.length,
      priorityServicesMissingAnswers,
      answersByService
    },
    factCoverage: {
      treatmentFactEntries: treatmentFactRegistry.entries.length,
      priorityServicesWithTreatmentFacts: priorityServiceIds.length - priorityServicesMissingTreatmentFacts.length,
      priorityServicesMissingTreatmentFacts,
      treatmentFactsByService
    },
    faqCoverage: {
      treatmentPageCount: treatmentPages.length,
      answerSurfaceTreatmentPageCount: answerSurfacePages.length,
      answerSurfaceFaqCount: answerSurfaceFaqs.length,
      priorityTreatmentPagesMissingAnswerSurface
    },
    snippetReadiness: {
      answerEntries: aiAnswerRegistry.entries.length,
      weakAnswerCount: weakAnswers.length,
      overlyLongAnswerCount: overlyLongAnswers.length,
      duplicateShortAnswerCount: duplicateShortAnswers.length
    },
    voiceReadiness: {
      patternCount: voiceSearchPatternRegistry.patterns.length,
      answersApprovedForVoice: aiAnswerRegistry.entries.filter((entry) => entry.approved_for_voice).length
    },
    chatbotReadiness: {
      alignmentMappings: chatbotAlignment.mappings.length,
      runtimeMutation: chatbotAlignment.runtimeMutation,
      unmappedAnswerRegistryIds: chatbotAlignmentAudit.unmappedAnswerRegistryIds,
      unmappedTreatmentFactIds: chatbotAlignmentAudit.unmappedTreatmentFactIds
    }
  },
  registryValidation: {
    status: registryErrors.length ? "fail" : "pass",
    errors: registryErrors,
    warnings: registryWarnings
  }
};

const foundationReport = {
  version: "AI_ANSWER_FOUNDATION_REPORT_V1",
  generatedAt,
  mission: "SEO_AI_ANSWER_AND_ZERO_CLICK_FOUNDATION_V1",
  scopeBoundaries: [
    "Foundation only",
    "No mass content generation",
    "No visual design changes",
    "No chatbot runtime behaviour changes",
    "No PHI, PMS or Dentally integration changes",
    "No launch certification claim"
  ],
  auditedSources: {
    treatmentManifests: {
      source: "packages/champagne-manifests/data/champagne_machine_manifest_full.json",
      treatmentPageCount: treatmentPages.length,
      answerSurfaceTreatmentPageCount: answerSurfacePages.length,
      treatmentAnswerSurfaceFaqCount: answerSurfaceFaqs.length
    },
    contentManifests: {
      pageCount: pages.length,
      metadataSurfaceCount,
      reusableSectionTypeCount: pageSectionTypes.length,
      reusableSectionTypes: pageSectionTypes
    },
    faqStructures: {
      answerSurfaceFaqCount: answerSurfaceFaqs.length,
      pagesWithAnswerSurfaceFaqs: answerSurfacePages.filter((page) => (page.answerSurface.sections || []).some((section) => section.faqs?.length)).length
    },
    metadataSources: [
      "manifest page labels/descriptions/intro fields",
      "apps/web route metadata functions",
      "schema builder defaults"
    ],
    schemaSources,
    approvedFactsSources: [
      path.relative(root, approvedFactsPath),
      path.relative(root, localIdentityPath),
      path.relative(root, teamRegistryPath)
    ]
  },
  architectureAdded: {
    aiAnswerRegistry: path.relative(root, aiAnswerRegistryPath),
    treatmentFactRegistry: path.relative(root, treatmentFactRegistryPath),
    questionInventory: path.relative(root, questionInventoryPath),
    voiceSearchPatternRegistry: path.relative(root, voiceSearchPatternRegistryPath),
    chatbotAnswerAlignment: path.relative(root, chatbotAlignmentPath),
    qaScript: "scripts/seo-ai-answer-foundation-qa.mjs"
  },
  registryStatus: {
    answerRegistryEntries: aiAnswerRegistry.entries.length,
    treatmentFactEntries: treatmentFactRegistry.entries.length,
    questionInventoryEntries: questionInventory.questions.length,
    voicePatterns: voiceSearchPatternRegistry.patterns.length,
    chatbotAlignmentMappings: chatbotAlignment.mappings.length
  },
  scores: {
    aiReadinessScore,
    zeroClickReadinessScore
  },
  majorGapsDiscovered: [
    `${priorityServicesMissingAnswers.length} approved priority services do not yet have AI answer registry entries.`,
    `${priorityServicesMissingTreatmentFacts.length} approved priority services do not yet have treatment fact registry entries.`,
    `${priorityTreatmentPagesMissingAnswerSurface.length} priority treatment routes do not yet expose treatment answer-surface blocks in the manifest audit.`,
    `${questionInventory.questions.filter((question) => !question.answer_registry_id).length} seeded questions are not yet mapped to approved answers.`,
    "Treatment facts for duration, recovery, alternatives and finance are mostly null because approved sources do not yet contain those facts."
  ],
  recommendations: [
    "Run a clinician-reviewed priority-service answer packet next, adding one direct answer and a compact FAQ set per approved priority service.",
    "Populate missing treatment facts only from approved public sources or clinician-reviewed fact registry additions.",
    "Extend schema QA to consume approved_for_schema answers before any FAQPage or Speakable schema expansion."
  ]
};

const nextBuildRecommendation = `# NEXT_BUILD_RECOMMENDATION_V1\n\n## Recommended next mission\n\nRun **SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_V1**.\n\n## Why\n\nThe foundation now exists, but it is intentionally only partially populated. The highest-value next step is a clinician-reviewed, priority-service answer packet that maps each approved priority service to one short direct answer, one expanded answer, a small FAQ set, and approved treatment facts where source evidence exists.\n\n## Guardrails\n\n- Do not perform mass page rewrites.\n- Do not change visual design.\n- Do not mutate chatbot runtime behaviour.\n- Do not invent clinical, fee, duration, recovery or finance claims.\n- Preserve the approved-facts evidence chain for every answer.\n\n## Build order\n\n1. Fill missing AI answer entries for approved priority services.\n2. Add clinician-reviewed treatment facts only where evidence exists.\n3. Map each priority question to an approved answer.\n4. Extend zero-click QA to verify FAQPage and voice-readiness eligibility.\n5. Only then consider schema consumption for entries with approved_for_schema set to true.\n`;

const foundationReportMd = `# AI_ANSWER_FOUNDATION_REPORT_V1\n\n## Mission\n\nSEO_AI_ANSWER_AND_ZERO_CLICK_FOUNDATION_V1.\n\n## Scope boundary\n\nFoundation only. No mass content generation, page redesign, chatbot runtime mutation, PHI, PMS/Dentally integration changes, deployment, or launch certification claim.\n\n## Audit findings\n\n- Treatment manifests audited: ${treatmentPages.length} treatment pages from the machine manifest.\n- Treatment answer surfaces found: ${answerSurfacePages.length}.\n- Existing answer-surface FAQ items found: ${answerSurfaceFaqs.length}.\n- Page/content manifests audited: ${pages.length} pages with ${pageSectionTypes.length} reusable section types detected.\n- Metadata surfaces detected: ${metadataSurfaceCount}.\n- Approved fact sources audited: approved facts, local identity, and team registry.\n- Schema sources detected: ${schemaSources.join(", ")}.\n\n## Architecture added\n\n- AI answer registry: ${path.relative(root, aiAnswerRegistryPath)}.\n- Treatment fact registry: ${path.relative(root, treatmentFactRegistryPath)}.\n- Question inventory: ${path.relative(root, questionInventoryPath)}.\n- Voice search pattern registry: ${path.relative(root, voiceSearchPatternRegistryPath)}.\n- Chatbot answer alignment registry: ${path.relative(root, chatbotAlignmentPath)}.\n- QA/reporting script: scripts/seo-ai-answer-foundation-qa.mjs.\n\n## Registry status\n\n- Answer registry entries: ${aiAnswerRegistry.entries.length}.\n- Treatment fact entries: ${treatmentFactRegistry.entries.length}.\n- Question inventory entries: ${questionInventory.questions.length}.\n- Voice patterns: ${voiceSearchPatternRegistry.patterns.length}.\n- Chatbot alignment mappings: ${chatbotAlignment.mappings.length}.\n\n## Scores\n\n- AI readiness score: ${aiReadinessScore}.\n- Zero-click readiness score: ${zeroClickReadinessScore}.\n\n## Major gaps discovered\n\n${foundationReport.majorGapsDiscovered.map((gap) => `- ${gap}`).join("\n")}\n\n## Recommended next mission\n\nSEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_V1: clinician-reviewed direct-answer and FAQ coverage for approved priority services, with no page redesign and no chatbot runtime mutation.\n`;

writeJson("ZERO_CLICK_READINESS_AUDIT_V1.json", zeroClickAudit);
writeJson("QUESTION_INVENTORY_AUDIT_V1.json", questionInventoryAudit);
writeJson("CHATBOT_ALIGNMENT_AUDIT_V1.json", chatbotAlignmentAudit);
writeJson("AI_SEARCH_READINESS_AUDIT_V1.json", aiSearchReadinessAudit);
writeJson("AI_ANSWER_FOUNDATION_REPORT_V1.json", foundationReport);
writeText("AI_ANSWER_FOUNDATION_REPORT_V1.md", foundationReportMd);
writeText("NEXT_BUILD_RECOMMENDATION_V1.md", nextBuildRecommendation);

const consoleReport = {
  version: "SEO_AI_ANSWER_FOUNDATION_QA_V1",
  generatedAt,
  status: registryErrors.length ? "fail" : "pass",
  aiReadinessScore,
  zeroClickReadinessScore,
  registryErrors,
  registryWarnings,
  outputDir: path.relative(root, outputDir)
};

console.log(JSON.stringify(consoleReport, null, 2));
if (registryErrors.length) process.exit(1);
