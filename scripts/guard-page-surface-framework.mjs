import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const generatedAt = new Date().toISOString();

const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
const writeJson = (relativePath, value) => {
  const fullPath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const fullPath = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(fullPath) : [fullPath];
});

const supportedPageFamilies = [
  "treatment",
  "concern",
  "comparison",
  "cost",
  "guide",
  "local",
  "trust_review",
  "clinician",
  "technology",
];

const supportedSectionKinds = [
  "direct_answer",
  "clinical_reassurance",
  "comparison_table",
  "cost_fee_logic",
  "fee_grid",
  "faq",
  "related_treatments",
  "cta",
  "clinician_expertise",
  "local_shoreham_context",
  "evidence_review_metadata",
  "safety_limitations",
  "alternatives",
  "process",
  "aftercare",
  "review_status",
];

const requiredFields = [
  "schemaVersion",
  "pageFamily",
  "canonicalRoute",
  "routeOwner",
  "primaryEntity",
  "secondaryEntities",
  "targetQueries",
  "targetIntent",
  "localMarket",
  "directAnswer",
  "sections",
  "faqs",
  "schemaRequirements",
  "internalLinks",
  "cta",
  "clinicianExpertise",
  "evidenceReviewMetadata",
  "clinicalReviewStatus",
  "forbiddenClaims",
  "launchBlockers",
];

const fieldShape = Object.fromEntries(requiredFields.map((field) => [field, { required: true }]));

const routeFamilies = [
  {
    pageFamily: "treatment",
    canonicalPattern: "/treatments/[slug]",
    routeOwner: "existing treatment route",
    appRouteAlreadyExists: true,
    futurePublicRouteAllowed: true,
    launchState: "existing_treatment_review_required",
    notes: "Existing treatment pages remain the only live answer-surface implementation family today.",
  },
  {
    pageFamily: "concern",
    canonicalPattern: "/concerns/[slug]",
    routeOwner: "future manifest/page-builder concern family",
    appRouteAlreadyExists: false,
    futurePublicRouteAllowed: true,
    launchState: "framework_ready_not_launch_ready",
    notes: "Reserved for future manifest-driven concern pages only; this mission must not create the route.",
  },
  {
    pageFamily: "comparison",
    canonicalPattern: "/compare/[slug]",
    routeOwner: "future manifest/page-builder comparison family",
    appRouteAlreadyExists: false,
    futurePublicRouteAllowed: true,
    launchState: "framework_ready_not_launch_ready",
    requiredGuards: ["COMPARISON_PAGE_GUARD_V1"],
    notes: "Requires balanced comparison table, alternatives, safety limitations, and evidence metadata.",
  },
  {
    pageFamily: "cost",
    canonicalPattern: "/costs/[slug]",
    routeOwner: "future manifest/page-builder cost family",
    appRouteAlreadyExists: false,
    futurePublicRouteAllowed: true,
    launchState: "framework_ready_not_launch_ready",
    requiredGuards: ["COST_FEE_PAGE_GUARD_V1"],
    notes: "Requires assessment caveats and must not invent precise prices or fee promises.",
  },
  {
    pageFamily: "guide",
    canonicalPattern: "/guides/[slug]",
    routeOwner: "future manifest/page-builder guide family",
    appRouteAlreadyExists: false,
    futurePublicRouteAllowed: true,
    launchState: "framework_ready_not_launch_ready",
    notes: "Reserved for evidence-reviewed guide pages; route creation remains blocked.",
  },
  {
    pageFamily: "local",
    canonicalPattern: "/local/[slug]",
    routeOwner: "future manifest/page-builder local family",
    appRouteAlreadyExists: false,
    futurePublicRouteAllowed: false,
    launchState: "blocked_until_shoreham_primary_or_evidence_backed",
    requiredGuards: ["LOCAL_ANTI_DOORWAY_GUARD_V1"],
    notes: "Pattern is documented as reserved but not allowed for secondary-town doorway pages. Any future local page must be Shoreham-primary or backed by real local evidence.",
  },
  {
    pageFamily: "trust_review",
    canonicalPattern: "/reviews",
    alternatePattern: "/trust",
    routeOwner: "future manifest/page-builder trust/review family",
    appRouteAlreadyExists: false,
    futurePublicRouteAllowed: true,
    launchState: "framework_ready_not_launch_ready",
    requiredGuards: ["EVIDENCE_REVIEW_METADATA_CONTRACT_V1"],
    notes: "Review metadata must prove source, consent/safety posture, and must not fabricate reviews.",
  },
  {
    pageFamily: "clinician",
    canonicalPattern: "/team/[slug]",
    routeOwner: "existing clinician route pattern",
    appRouteAlreadyExists: true,
    futurePublicRouteAllowed: true,
    launchState: "existing_route_requires_profile_review",
    notes: "Existing clinician pattern may adopt PAGE_SURFACE_V1 later without adding a new route family.",
  },
  {
    pageFamily: "technology",
    canonicalPattern: "/technology/[slug]",
    routeOwner: "future manifest/page-builder technology family",
    appRouteAlreadyExists: false,
    futurePublicRouteAllowed: true,
    launchState: "framework_ready_not_launch_ready",
    notes: "Reserved for technology pages with evidence and clinical review metadata; route creation remains blocked.",
  },
];

const sectionKindCompatibility = {
  treatment: ["direct_answer", "clinical_reassurance", "cost_fee_logic", "faq", "related_treatments", "cta", "clinician_expertise", "local_shoreham_context", "evidence_review_metadata", "safety_limitations", "alternatives", "process", "aftercare", "review_status"],
  concern: ["direct_answer", "clinical_reassurance", "faq", "related_treatments", "cta", "clinician_expertise", "local_shoreham_context", "evidence_review_metadata", "safety_limitations", "alternatives", "process", "review_status"],
  comparison: ["direct_answer", "clinical_reassurance", "comparison_table", "faq", "related_treatments", "cta", "clinician_expertise", "evidence_review_metadata", "safety_limitations", "alternatives", "review_status"],
  cost: ["direct_answer", "clinical_reassurance", "cost_fee_logic", "fee_grid", "faq", "related_treatments", "cta", "clinician_expertise", "local_shoreham_context", "evidence_review_metadata", "safety_limitations", "review_status"],
  guide: ["direct_answer", "clinical_reassurance", "faq", "related_treatments", "cta", "clinician_expertise", "evidence_review_metadata", "safety_limitations", "alternatives", "process", "aftercare", "review_status"],
  local: ["direct_answer", "clinical_reassurance", "faq", "related_treatments", "cta", "clinician_expertise", "local_shoreham_context", "evidence_review_metadata", "safety_limitations", "review_status"],
  trust_review: ["direct_answer", "clinical_reassurance", "faq", "cta", "clinician_expertise", "evidence_review_metadata", "safety_limitations", "review_status"],
  clinician: ["direct_answer", "clinical_reassurance", "faq", "cta", "clinician_expertise", "evidence_review_metadata", "review_status"],
  technology: ["direct_answer", "clinical_reassurance", "faq", "related_treatments", "cta", "clinician_expertise", "evidence_review_metadata", "safety_limitations", "process", "review_status"],
};

const pageSurfaceContract = {
  schemaVersion: "PAGE_SURFACE_V1",
  generatedAt,
  purpose: "Generalized manifest/page-builder answer-surface framework for treatment and future ROI page families. This contract is framework infrastructure only and does not create public routes or certify launch readiness.",
  launchPosture: "framework_ready_not_launch_ready",
  supportedPageFamilies,
  requiredFields,
  fieldShape,
  supportedSectionKinds,
  requiredSectionSupport: supportedSectionKinds,
  sectionKindCompatibility,
  requiredGuardBehavior: [
    "Local pages must be blocked unless Shoreham-primary or evidence-backed.",
    "Secondary town doorway pages must be blocked.",
    "Comparison pages must require balanced, non-misleading comparison sections.",
    "Cost pages must require no fake price specificity and clear assessment/fee caveats.",
    "Evidence/review metadata must not allow fabricated reviews or unsupported evidence.",
    "New page families are framework-ready only, not launch-ready.",
    "No new public route may be created by this framework mission.",
  ],
  forbiddenClaims: [
    "Guaranteed outcomes",
    "Same-day suitability promises without assessment",
    "Fake review counts or fabricated review text",
    "Unsupported superiority claims",
    "Precise prices presented without assessment caveats",
    "Secondary-town doorway relevance without evidence",
  ],
  implementationStatus: {
    existingTreatmentAnswerSurface: "present_treatment_only",
    generalizedPageSurface: "contract_seeded",
    nonTreatmentPublicPagesCreated: false,
  },
};

const routeCanonContract = {
  version: "PAGE_FAMILY_ROUTE_CANON_V1",
  generatedAt,
  purpose: "Route-family canon for current and future manifest-driven page families. This registry reserves future patterns without creating Next.js public routes.",
  noNewPublicRoutesCreated: true,
  routeFamilies,
  hardBlocks: [
    "Do not create /concerns/[slug] in this mission.",
    "Do not create /compare/[slug] in this mission.",
    "Do not create /costs/[slug] in this mission.",
    "Do not create /guides/[slug] in this mission.",
    "Do not create secondary-town /local/[slug] doorway pages.",
  ],
};

const evidenceContract = {
  version: "EVIDENCE_REVIEW_METADATA_CONTRACT_V1",
  generatedAt,
  purpose: "Evidence/review metadata seed for PAGE_SURFACE_V1 pages. This contract blocks fabricated reviews, unsupported evidence, and unreviewed clinical claims.",
  appliesToPageFamilies: supportedPageFamilies,
  requiredFields: [
    "sourceType",
    "sourceCitation",
    "evidenceSummary",
    "lastReviewed",
    "reviewedBy",
    "nextReviewDue",
    "unsupportedEvidenceForbidden",
    "fabricatedReviewsForbidden",
  ],
  allowedSourceTypes: ["clinical_guideline", "practice_policy", "clinician_review", "first_party_review_platform", "regulatory_source", "manufacturer_documentation", "none_framework_only"],
  reviewSafetyRules: {
    fabricatedReviewsForbidden: true,
    unsupportedEvidenceForbidden: true,
    noPatientIdentifiersWithoutGovernedConsent: true,
    noReviewTextWithoutSourceAttribution: true,
    noAggregateRatingWithoutSourceAndDate: true,
    noClinicalClaimWithoutReviewerOrEvidence: true,
  },
  frameworkOnlyDefault: {
    sourceType: "none_framework_only",
    launchAllowed: false,
    launchBlocker: "EVIDENCE_REVIEW_METADATA_REQUIRED",
  },
};

writeJson("ops/contracts/PAGE_SURFACE_V1.json", pageSurfaceContract);
writeJson("ops/contracts/PAGE_FAMILY_ROUTE_CANON_V1.json", routeCanonContract);
writeJson("ops/contracts/EVIDENCE_REVIEW_METADATA_CONTRACT_V1.json", evidenceContract);

const requiredRoutePublicPrefixes = ["/concerns/", "/compare/", "/costs/", "/guides/", "/local/", "/technology/"];
const appRouteFiles = walk(path.join(root, "apps/web/app")).filter((file) => /\/(page\.tsx|route\.ts)$/.test(file));
const appRouteRelativeFiles = appRouteFiles.map((file) => path.relative(root, file).split(path.sep).join("/"));
const forbiddenRouteFiles = appRouteRelativeFiles.filter((relativePath) => /apps\/web\/app\/(concerns|compare|costs|guides|local|technology)\//.test(relativePath));
const dynamicTrustRouteFiles = appRouteRelativeFiles.filter((relativePath) => /apps\/web\/app\/(reviews|trust)\//.test(relativePath));
const noNewPublicRoutesCreated = forbiddenRouteFiles.length === 0 && dynamicTrustRouteFiles.length === 0;

const missingRouteCanonFamilies = supportedPageFamilies.filter((family) => !routeFamilies.some((entry) => entry.pageFamily === family));
const missingCompatibilityFamilies = supportedPageFamilies.filter((family) => !sectionKindCompatibility[family]?.length);
const missingCompatibilityKinds = Object.fromEntries(
  Object.entries(sectionKindCompatibility).map(([family, kinds]) => [family, kinds.filter((kind) => !supportedSectionKinds.includes(kind))]),
);

const guardCoverage = {
  SECTION_KIND_COMPATIBILITY_GUARD_V1: {
    seeded: true,
    report: "reports/SECTION_KIND_COMPATIBILITY_GUARD_REPORT_V1.json",
    checks: ["every supported page family has allowed section kinds", "every referenced section kind exists in PAGE_SURFACE_V1"],
  },
  LOCAL_ANTI_DOORWAY_GUARD_V1: {
    seeded: true,
    report: "reports/LOCAL_ANTI_DOORWAY_GUARD_REPORT_V1.json",
    checks: ["/local/[slug] reserved but blocked until Shoreham-primary or evidence-backed", "secondary-town doorway pages blocked"],
  },
  COMPARISON_PAGE_GUARD_V1: {
    seeded: true,
    report: "reports/COMPARISON_COST_PAGE_GUARD_REPORT_V1.json",
    checks: ["comparison_table required", "balanced and non-misleading sections required", "evidence metadata required"],
  },
  COST_FEE_PAGE_GUARD_V1: {
    seeded: true,
    report: "reports/COMPARISON_COST_PAGE_GUARD_REPORT_V1.json",
    checks: ["cost_fee_logic and fee_grid required", "fake price specificity blocked", "assessment and fee caveats required"],
  },
  EVIDENCE_REVIEW_METADATA_CONTRACT_V1: {
    seeded: true,
    contract: "ops/contracts/EVIDENCE_REVIEW_METADATA_CONTRACT_V1.json",
    checks: ["fabricated reviews forbidden", "unsupported evidence forbidden", "framework-only pages not launch-ready"],
  },
};

const baseReport = {
  generatedAt,
  noNewPublicRoutesCreated,
  forbiddenRouteFiles,
  supportedPageFamilies,
  supportedSectionKinds,
  launchPosture: "framework_ready_not_launch_ready",
};

writeJson("reports/PAGE_SURFACE_AND_ROUTE_CANON_FRAMEWORK_REPORT_V1.json", {
  version: "PAGE_SURFACE_AND_ROUTE_CANON_FRAMEWORK_REPORT_V1",
  ...baseReport,
  contracts: [
    "ops/contracts/PAGE_SURFACE_V1.json",
    "ops/contracts/PAGE_FAMILY_ROUTE_CANON_V1.json",
    "ops/contracts/EVIDENCE_REVIEW_METADATA_CONTRACT_V1.json",
  ],
  routeCanon: routeFamilies,
  requiredFieldsPresentInContract: requiredFields,
  missingRouteCanonFamilies,
  frameworkReadyPageFamilies: supportedPageFamilies.filter((family) => family !== "treatment"),
  launchReadyPageFamilies: [],
  existingPublicRouteFamilies: routeFamilies.filter((entry) => entry.appRouteAlreadyExists).map((entry) => entry.pageFamily),
  guardCoverage,
  remainingBlockers: [
    "No non-treatment PAGE_SURFACE_V1 manifests exist yet.",
    "Future public route files remain blocked until dedicated implementation missions.",
    "Comparison, cost, local, evidence/review guards are seeded as contracts/reports, not wired as package scripts.",
    "Clinical and evidence review metadata must be populated before launch review.",
  ],
});

writeJson("reports/SECTION_KIND_COMPATIBILITY_GUARD_REPORT_V1.json", {
  version: "SECTION_KIND_COMPATIBILITY_GUARD_V1",
  ...baseReport,
  sectionKindCompatibility,
  missingCompatibilityFamilies,
  missingCompatibilityKinds,
  pass: missingCompatibilityFamilies.length === 0 && Object.values(missingCompatibilityKinds).every((items) => items.length === 0),
});

writeJson("reports/LOCAL_ANTI_DOORWAY_GUARD_REPORT_V1.json", {
  version: "LOCAL_ANTI_DOORWAY_GUARD_V1",
  ...baseReport,
  routePattern: "/local/[slug]",
  allowedOnlyIf: ["primary market is Shoreham-by-Sea", "or page has verifiable local evidence that is not secondary-town doorway stuffing"],
  blockedPatterns: ["/local/brighton", "/local/worthing", "/local/lancing", "/local/southwick"],
  secondaryTownDoorwayPagesBlocked: true,
  currentLocalPublicRoutesCreated: forbiddenRouteFiles.filter((file) => file.includes("/local/")),
  pass: noNewPublicRoutesCreated,
});

writeJson("reports/COMPARISON_COST_PAGE_GUARD_REPORT_V1.json", {
  version: "COMPARISON_COST_PAGE_GUARD_V1",
  ...baseReport,
  comparisonGuard: {
    requiresSectionKinds: ["direct_answer", "comparison_table", "clinical_reassurance", "alternatives", "safety_limitations", "evidence_review_metadata", "review_status"],
    balancedNonMisleadingRequired: true,
    unsupportedSuperiorityClaimsBlocked: true,
    launchState: "framework_ready_not_launch_ready",
  },
  costFeeGuard: {
    requiresSectionKinds: ["direct_answer", "cost_fee_logic", "fee_grid", "clinical_reassurance", "safety_limitations", "evidence_review_metadata", "review_status"],
    fakePriceSpecificityBlocked: true,
    assessmentCaveatsRequired: true,
    feeCaveatsRequired: true,
    launchState: "framework_ready_not_launch_ready",
  },
  pass: noNewPublicRoutesCreated,
});

const failures = [];
if (missingRouteCanonFamilies.length > 0) failures.push({ code: "MISSING_ROUTE_CANON_FAMILIES", details: missingRouteCanonFamilies });
if (missingCompatibilityFamilies.length > 0) failures.push({ code: "MISSING_COMPATIBILITY_FAMILIES", details: missingCompatibilityFamilies });
if (!Object.values(missingCompatibilityKinds).every((items) => items.length === 0)) failures.push({ code: "UNKNOWN_SECTION_KINDS", details: missingCompatibilityKinds });
if (!noNewPublicRoutesCreated) failures.push({ code: "NEW_PUBLIC_ROUTE_FILES_BLOCKED", details: forbiddenRouteFiles });

if (failures.length > 0) {
  console.error("PAGE_SURFACE_FRAMEWORK_GUARD_FAIL");
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}

console.log(`PAGE_SURFACE_FRAMEWORK_GUARD_PASS families=${supportedPageFamilies.length} noNewPublicRoutesCreated=${noNewPublicRoutesCreated}`);
