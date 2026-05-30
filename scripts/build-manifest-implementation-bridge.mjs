import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const rootDir = process.cwd();
const generatedAt = new Date().toISOString();

const readJson = async (relativePath) => JSON.parse(await fs.readFile(path.join(rootDir, relativePath), "utf8"));
const readText = async (relativePath) => fs.readFile(path.join(rootDir, relativePath), "utf8");
const writeJson = async (relativePath, value) => {
  const fullPath = path.join(rootDir, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};
const hashValue = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);

const manifestPath = "packages/champagne-manifests/data/champagne_machine_manifest_full.json";
const sectionRegistryPath = "packages/champagne-sections/src/SectionRegistry.ts";
const sectionRendererPath = "packages/champagne-sections/src/ChampagneSectionRenderer.tsx";
const pageBuilderPath = "apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx";
const treatmentRoutePath = "apps/web/app/treatments/[slug]/page.tsx";
const sitemapPath = "apps/web/app/sitemap.ts";
const robotsPath = "apps/web/app/robots.ts";
const truthExportPath = "scripts/export-website-truth.mjs";
const answerSurfacePath = "packages/champagne-manifests/src/answerSurface.ts";
const answerSurfaceGuardPath = "scripts/guard-treatment-answer-surface.mjs";
const seoGuardPath = "scripts/seo-launch-safety-check.mjs";

const manifest = await readJson(manifestPath);
const sectionRegistrySource = await readText(sectionRegistryPath);
const sectionRendererSource = await readText(sectionRendererPath);
const pageBuilderSource = await readText(pageBuilderPath);
const treatmentRouteSource = await readText(treatmentRoutePath);
const sitemapSource = await readText(sitemapPath);
const robotsSource = await readText(robotsPath);
const truthExportSource = await readText(truthExportPath);
const answerSurfaceSource = await readText(answerSurfacePath);
const answerSurfaceGuardSource = await readText(answerSurfaceGuardPath);
const seoGuardSource = await readText(seoGuardPath);
const websiteTruth = await readJson("reports/WEBSITE_TRUTH_EXPORT_REPORT_V1.json").catch(() => null);

const pages = Object.entries(manifest.pages ?? {}).map(([id, page]) => ({ id, ...page })).filter((page) => page.path);
const routePrefixes = ["concerns", "compare", "costs", "guides", "local", "trust", "reviews", "clinician", "technology"];
const existingRoutesByFamily = Object.fromEntries(routePrefixes.map((family) => [family, pages.filter((page) => {
  if (family === "trust") return page.path.startsWith("/trust") || page.path.startsWith("/reviews");
  if (family === "reviews") return page.path.startsWith("/reviews");
  if (family === "clinician") return page.path.startsWith("/team") || page.category === "team";
  return page.path.startsWith(`/${family}`);
}).map((page) => page.path).sort()]));

const existingPublicRouteFamilies = {
  treatment: pages.filter((page) => page.path.startsWith("/treatments/")).length,
  treatmentHub: pages.filter((page) => page.path === "/treatments").length,
  team: existingRoutesByFamily.clinician,
  technology: existingRoutesByFamily.technology,
  support: pages.filter((page) => ["/fees", "/contact", "/about", "/smile-gallery"].includes(page.path)).map((page) => page.path).sort(),
};

const routePatterns = {
  manifestLookup: {
    file: pageBuilderPath,
    evidence: [
      "getPageManifestBySlug(slug)",
      "champagneMachineManifest.pages?.[slug]",
      "champagneMachineManifest.treatments?.[slug]",
    ],
    supportsArbitraryManifestPaths: pageBuilderSource.includes("getPageManifestBySlug") && pageBuilderSource.includes("getSectionStack(pagePath)"),
  },
  treatmentDynamicRoute: {
    file: treatmentRoutePath,
    pattern: "/treatments/[slug]",
    usesManifest: treatmentRouteSource.includes("getTreatmentManifest"),
    emitsJsonLd: treatmentRouteSource.includes("application/ld+json"),
    canonicalizesAliases: treatmentRouteSource.includes("resolveTreatmentPathAlias") && treatmentRouteSource.includes("permanentRedirect"),
  },
  routeCanonObservation: "Non-treatment dynamic families do not currently have route files; manifest entries alone are not reachable unless a route exists or an existing safe fixture pattern is extended.",
};

const sectionKinds = [
  "text",
  "media",
  "features",
  "routing_cards",
  "treatment_overview_rich",
  "treatment_media_feature",
  "treatment_tools_trio",
  "clinician_insight",
  "patient_stories_rail",
  "people_grid",
  "treatment_mid_cta",
  "treatment_faq_block",
  "treatment_closing_cta",
  "reviews",
  "treatment_answer_surface",
];

const compatibilityRows = [
  {
    requirement: "direct answer",
    currentSupport: "partial",
    compatibleSectionKinds: ["treatment_answer_surface", "text", "treatment_overview_rich"],
    currentLimitations: ["treatment_answer_surface is named, ordered, validated, and guarded as treatment-only", "No generalized page-answer surface renderer exists for concerns/compare/costs/guides"],
    missingSectionKinds: ["page_answer_surface"],
  },
  {
    requirement: "clinical reassurance",
    currentSupport: "true",
    compatibleSectionKinds: ["clinician_insight", "features", "treatment_overview_rich", "text"],
    currentLimitations: ["Treatment naming is embedded in some section kinds but content can be manifest-driven"],
    missingSectionKinds: [],
  },
  {
    requirement: "comparison table",
    currentSupport: "partial",
    compatibleSectionKinds: ["features", "routing_cards", "text"],
    currentLimitations: ["No explicit comparison/table schema or table renderer is registered", "Feature lists can approximate cards but not governed comparison tables"],
    missingSectionKinds: ["comparison_table"],
  },
  {
    requirement: "cost/fee logic",
    currentSupport: "partial",
    compatibleSectionKinds: ["treatment_answer_surface", "features", "text"],
    currentLimitations: ["answerSurface has cost_fee_logic but it is treatment-only", "No governed fee-grid/cost-explainer kind for non-treatment cost pages"],
    missingSectionKinds: ["cost_fee_logic", "fee_grid"],
  },
  {
    requirement: "FAQ",
    currentSupport: "true",
    compatibleSectionKinds: ["treatment_faq_block", "text"],
    currentLimitations: ["Registered FAQ renderer is treatment-named but can render manifest FAQ arrays"],
    missingSectionKinds: [],
  },
  {
    requirement: "related treatments",
    currentSupport: "true",
    compatibleSectionKinds: ["routing_cards", "treatment_mid_cta", "treatment_closing_cta"],
    currentLimitations: ["CTA relation/canonical checks are treatment-oriented and may need generalized route relation rules for non-treatment destinations"],
    missingSectionKinds: [],
  },
  {
    requirement: "CTA",
    currentSupport: "true",
    compatibleSectionKinds: ["treatment_mid_cta", "treatment_closing_cta"],
    currentLimitations: ["Names are treatment-specific; reusable CTA behavior exists but new page families need guard coverage to avoid duplicate terminal CTAs"],
    missingSectionKinds: [],
  },
  {
    requirement: "clinician expertise",
    currentSupport: "true",
    compatibleSectionKinds: ["clinician_insight", "people_grid", "text"],
    currentLimitations: ["Clinician pages already exist under /team; new clinician-family pages must avoid duplicate /team intent"],
    missingSectionKinds: [],
  },
  {
    requirement: "local Shoreham context",
    currentSupport: "partial",
    compatibleSectionKinds: ["treatment_answer_surface", "text", "features"],
    currentLimitations: ["answerSurface validates primaryGeography for treatment pages only", "No anti-doorway guard for /local or location variants beyond answer-surface stuffing checks"],
    missingSectionKinds: ["local_context", "local_page_safety"],
  },
  {
    requirement: "evidence/review metadata",
    currentSupport: "partial",
    compatibleSectionKinds: ["reviews", "patient_stories_rail", "treatment_answer_surface"],
    currentLimitations: ["Review/freshness metadata is present inside treatment answerSurface review sections but not generalized as page-level evidence metadata", "No Review/FAQ schema export contract for new families"],
    missingSectionKinds: ["evidence_review_metadata"],
  },
];

const compatibilityMatrix = {
  version: "SECTION_KIND_COMPATIBILITY_MATRIX_V1",
  generatedAt,
  purpose: "Audit existing section-kind compatibility for governed high-ROI page briefs without creating routes or content.",
  evidence: {
    sectionRegistry: sectionRegistryPath,
    sectionRenderer: sectionRendererPath,
    detectedKinds: sectionKinds.filter((kind) => sectionRegistrySource.includes(kind) || sectionRendererSource.includes(kind)),
    rendererHasTypeMap: sectionRendererSource.includes("typeMap"),
  },
  requirements: compatibilityRows,
  missingSectionKinds: Array.from(new Set(compatibilityRows.flatMap((row) => row.missingSectionKinds))).sort(),
  conclusion: "Existing sections can partially assemble new brief pages, but direct answers, comparison tables, cost logic, local safety, and evidence metadata need generalized, guarded section/page-surface contracts before public implementation.",
};

const familyOwnership = {
  concerns: {
    currentlyOwnedBy: "none",
    proposedOwner: manifestPath,
    proposedManifestCollection: "pages",
    proposedSectionLayoutFamily: "packages/champagne-manifests/data/sections/smh/concerns.<slug>.json",
    routeNeeded: "/concerns/[slug] or a manifest-safe generalized dynamic route",
    status: "needs_framework",
  },
  compare: {
    currentlyOwnedBy: "none",
    proposedOwner: manifestPath,
    proposedManifestCollection: "pages",
    proposedSectionLayoutFamily: "packages/champagne-manifests/data/sections/smh/compare.<slug>.json",
    routeNeeded: "/compare/[slug] or a manifest-safe generalized dynamic route",
    status: "needs_framework",
  },
  costs: {
    currentlyOwnedBy: "none; /fees exists as support page",
    proposedOwner: manifestPath,
    proposedManifestCollection: "pages",
    proposedSectionLayoutFamily: "packages/champagne-manifests/data/sections/smh/costs.<slug>.json",
    routeNeeded: "/costs/[slug] or a manifest-safe generalized dynamic route",
    status: "needs_framework",
  },
  guides: {
    currentlyOwnedBy: "none; /blog exists as support/editorial page",
    proposedOwner: manifestPath,
    proposedManifestCollection: "pages",
    proposedSectionLayoutFamily: "packages/champagne-manifests/data/sections/smh/guides.<slug>.json",
    routeNeeded: "/guides/[slug] or a manifest-safe generalized dynamic route",
    status: "needs_framework",
  },
  local: {
    currentlyOwnedBy: "none",
    proposedOwner: manifestPath,
    proposedManifestCollection: "pages",
    proposedSectionLayoutFamily: "packages/champagne-manifests/data/sections/smh/local.<slug>.json",
    routeNeeded: "/local/[slug] only after doorway-safety guard exists",
    status: "needs_guard",
  },
  "trust/review": {
    currentlyOwnedBy: "partial via reviews/patient stories sections; no /trust or /reviews route family",
    proposedOwner: manifestPath,
    proposedManifestCollection: "pages",
    proposedSectionLayoutFamily: "packages/champagne-manifests/data/sections/smh/trust.<slug>.json",
    routeNeeded: "/trust/[slug] or explicit non-duplicative support routes",
    status: "needs_framework",
  },
  clinician: {
    currentlyOwnedBy: "existing /team and /team/[slug] app routes plus pages manifest team entries",
    proposedOwner: manifestPath,
    proposedManifestCollection: "pages",
    proposedSectionLayoutFamily: "packages/champagne-manifests/data/sections/smh/clinician.<slug>.json only if not duplicating /team",
    routeNeeded: "prefer existing /team canonical unless a non-duplicate route-canon decision is approved",
    status: "partial",
  },
  technology: {
    currentlyOwnedBy: "existing /technology manifest entry and app route coverage via /(site)/[page] if matched",
    proposedOwner: manifestPath,
    proposedManifestCollection: "pages",
    proposedSectionLayoutFamily: "packages/champagne-manifests/data/sections/smh/technology.<slug>.json for child pages only after route canon is approved",
    routeNeeded: "child technology routes need explicit route canon; hub exists",
    status: "partial",
  },
};

const requiredEntryPipeline = {
  sitemap: {
    file: sitemapPath,
    currentObservation: sitemapSource.includes("getAllPages") || sitemapSource.includes("getTreatmentPages") ? "manifest-derived sitemap evidence present" : "manual sitemap evidence requires review",
    requiredChangeBeforePages: "New public families must be manifest-derived and explicitly excluded from private/debug route filters.",
  },
  robotsSafety: {
    file: robotsPath,
    currentObservation: robotsSource.includes("/patient-portal") && robotsSource.includes("/champagne/") ? "private/debug disallows present" : "robots exclusions require review",
    requiredChangeBeforePages: "New route families must not weaken production allow/disallow behavior and must be covered by guard:seo-launch-safety.",
  },
  pageTruthExport: {
    files: ["scripts/export-page-truth.mjs", truthExportPath],
    currentObservation: truthExportSource.includes("pageTruth") ? "website truth export expects page-truth files per route" : "page truth integration not discovered",
    requiredChangeBeforePages: "New route families need deterministic page-truth generation and missing-truth reporting.",
  },
  websiteTruthExport: {
    file: truthExportPath,
    currentObservation: truthExportSource.includes("routeInventory") && truthExportSource.includes("manifestRoutes") ? "route inventory is built from app routes, manifest routes, and live pages" : "route inventory requires review",
    requiredChangeBeforePages: "Classify new families, schema, metadata, internal links, and launch blockers without asserting launch readiness.",
  },
  schemaExport: {
    files: [treatmentRoutePath, truthExportPath],
    currentObservation: treatmentRouteSource.includes("Service") && treatmentRouteSource.includes("BreadcrumbList") ? "treatment route emits WebPage/Service/BreadcrumbList JSON-LD" : "route JSON-LD requires review",
    requiredChangeBeforePages: "Add schema contracts per family before routes: WebPage plus FAQPage/Article/MedicalWebPage-like service-safe equivalents only where appropriate; no unsupported claims.",
  },
  internalLinks: {
    file: truthExportPath,
    currentObservation: truthExportSource.includes("collectInternalLinksFromValue") ? "manifest internal links are exported from manifest values" : "internal link extraction requires review",
    requiredChangeBeforePages: "New family links need relation rules to avoid cannibalisation and duplicate route families.",
  },
  routeCanon: {
    files: [treatmentRoutePath, pageBuilderPath],
    currentObservation: routePatterns.treatmentDynamicRoute.canonicalizesAliases ? "treatment aliases canonicalize; non-treatment families have no equivalent" : "canonical alias handling requires review",
    requiredChangeBeforePages: "Define canonical family ownership, aliases, and duplicate-intent guard before creating routes.",
  },
  contentReadinessReports: {
    files: [truthExportPath, "reports/content_readiness_report.json"],
    currentObservation: truthExportSource.includes("CONTENT_READINESS_NOT_GREEN") ? "website truth export consumes content readiness summary" : "content readiness integration requires review",
    requiredChangeBeforePages: "Add new page families to readiness report inputs before public routes enter sitemap.",
  },
};

const requiredGuardsBeforeImplementation = [
  "guard:hero",
  "guard:canon",
  "verify",
  "guard:seo-launch-safety",
  "guard:treatment-answer-surface (or generalized guard:page-answer-surface before non-treatment direct answers)",
  "new guard:page-family-route-canon",
  "new guard:page-brief-manifest-contract",
  "new guard:section-kind-compatibility",
  "new guard:local-doorway-safety before /local pages",
  "new guard:schema-family-safety before JSON-LD for new families",
];

const briefRoutes = [
  {
    canonicalRoute: "/concerns/broken-tooth",
    family: "concerns",
    canImplementWithCurrentManifest: "partial",
    requiredManifestFamily: "pages + concerns section layout family (not currently wired)",
    requiredSectionKinds: ["page_answer_surface", "clinical_reassurance", "treatment_faq_block", "routing_cards", "treatment_closing_cta", "local_context", "evidence_review_metadata"],
    missingSectionKinds: ["page_answer_surface", "local_context", "evidence_review_metadata"],
    requiredSchemaTypes: ["WebPage", "FAQPage", "BreadcrumbList"],
    requiredTruthExportFields: ["routeInventory", "metadata", "schema", "pageTruth", "internalLinkInventory", "faqBlockInventory", "contentFreshnessReviewMetadata"],
    requiredGuards: ["guard:page-brief-manifest-contract", "guard:page-answer-surface", "guard:seo-launch-safety", "guard:canon"],
    implementationRisk: "medium",
    recommendation: "needs_framework",
  },
  {
    canonicalRoute: "/compare/dental-implants-vs-bridges",
    family: "compare",
    canImplementWithCurrentManifest: "partial",
    requiredManifestFamily: "pages + compare section layout family (not currently wired)",
    requiredSectionKinds: ["page_answer_surface", "comparison_table", "clinical_reassurance", "routing_cards", "treatment_faq_block", "treatment_closing_cta", "evidence_review_metadata"],
    missingSectionKinds: ["page_answer_surface", "comparison_table", "evidence_review_metadata"],
    requiredSchemaTypes: ["WebPage", "FAQPage", "BreadcrumbList"],
    requiredTruthExportFields: ["routeInventory", "metadata", "schema", "pageTruth", "internalLinkInventory", "faqBlockInventory", "contentFreshnessReviewMetadata"],
    requiredGuards: ["guard:page-brief-manifest-contract", "guard:page-answer-surface", "guard:section-kind-compatibility", "guard:seo-launch-safety", "guard:canon"],
    implementationRisk: "high",
    recommendation: "needs_framework",
  },
  {
    canonicalRoute: "/costs/dental-implant-cost",
    family: "costs",
    canImplementWithCurrentManifest: "partial",
    requiredManifestFamily: "pages + costs section layout family (not currently wired)",
    requiredSectionKinds: ["page_answer_surface", "cost_fee_logic", "fee_grid", "clinical_reassurance", "treatment_faq_block", "treatment_closing_cta", "evidence_review_metadata"],
    missingSectionKinds: ["page_answer_surface", "cost_fee_logic", "fee_grid", "evidence_review_metadata"],
    requiredSchemaTypes: ["WebPage", "FAQPage", "BreadcrumbList"],
    requiredTruthExportFields: ["routeInventory", "metadata", "schema", "pageTruth", "faqBlockInventory", "ctaMap", "contentFreshnessReviewMetadata"],
    requiredGuards: ["guard:page-brief-manifest-contract", "guard:fee-claim-safety", "guard:page-answer-surface", "guard:seo-launch-safety", "guard:canon"],
    implementationRisk: "high",
    recommendation: "needs_guard",
  },
  {
    canonicalRoute: "/guides/how-dental-implants-work",
    family: "guides",
    canImplementWithCurrentManifest: "partial",
    requiredManifestFamily: "pages + guides section layout family (not currently wired)",
    requiredSectionKinds: ["page_answer_surface", "features", "treatment_media_feature", "clinician_insight", "treatment_faq_block", "routing_cards", "evidence_review_metadata"],
    missingSectionKinds: ["page_answer_surface", "evidence_review_metadata"],
    requiredSchemaTypes: ["Article", "WebPage", "FAQPage", "BreadcrumbList"],
    requiredTruthExportFields: ["routeInventory", "metadata", "schema", "pageTruth", "internalLinkInventory", "faqBlockInventory", "contentFreshnessReviewMetadata"],
    requiredGuards: ["guard:page-brief-manifest-contract", "guard:page-answer-surface", "guard:schema-family-safety", "guard:seo-launch-safety", "guard:canon"],
    implementationRisk: "medium",
    recommendation: "needs_framework",
  },
  {
    canonicalRoute: "/compare/private-dentist-vs-nhs-dentist",
    family: "compare",
    canImplementWithCurrentManifest: "partial",
    requiredManifestFamily: "pages + compare section layout family (not currently wired)",
    requiredSectionKinds: ["page_answer_surface", "comparison_table", "clinical_reassurance", "local_context", "treatment_faq_block", "treatment_closing_cta", "evidence_review_metadata"],
    missingSectionKinds: ["page_answer_surface", "comparison_table", "local_context", "evidence_review_metadata"],
    requiredSchemaTypes: ["WebPage", "FAQPage", "BreadcrumbList"],
    requiredTruthExportFields: ["routeInventory", "metadata", "schema", "pageTruth", "internalLinkInventory", "faqBlockInventory", "contentFreshnessReviewMetadata"],
    requiredGuards: ["guard:page-brief-manifest-contract", "guard:page-answer-surface", "guard:comparison-neutrality", "guard:seo-launch-safety", "guard:canon"],
    implementationRisk: "high",
    recommendation: "needs_framework",
  },
];

const pageBriefMapping = {
  version: "PAGE_BRIEF_TO_MANIFEST_MAPPING_V1",
  generatedAt,
  purpose: "Map generated CONTENT_BRIEF_GENERATION_ENGINE_V1 routes to existing Champagne manifest architecture without creating pages.",
  noNewPublicPagesCreated: true,
  manifestArchitecture: {
    primaryManifest: manifestPath,
    currentCollections: Object.keys(manifest).filter((key) => typeof manifest[key] === "object"),
    existingTreatmentOwnership: "packages/champagne-manifests/data/champagne_machine_manifest_full.json pages entries plus treatment section layout JSON under packages/champagne-manifests/data/sections/smh/treatments.<slug>.json",
    builderEvidence: routePatterns.manifestLookup,
  },
  familyOwnership,
  generatedBriefRoutes: briefRoutes,
};

const answerSurfaceAudit = {
  files: [answerSurfacePath, "packages/champagne-sections/src/Section_TreatmentAnswerSurface.tsx", answerSurfaceGuardPath],
  currentModel: "TreatmentAnswerSurface",
  versionRequired: answerSurfaceSource.includes("TREATMENT_ANSWER_SURFACE_V1") ? "TREATMENT_ANSWER_SURFACE_V1" : null,
  requiredSectionIdsTreatmentOnly: answerSurfaceSource.includes("TREATMENT_ANSWER_SURFACE_REQUIRED_SECTION_IDS"),
  rendererTreatmentOnly: sectionRendererSource.includes("treatment_answer_surface") && sectionRendererSource.includes("Section_TreatmentAnswerSurface"),
  guardTreatmentOnly: answerSurfaceGuardSource.includes("guard-treatment-answer-surface") || answerSurfaceGuardPath.includes("treatment-answer-surface"),
  supportsNonTreatmentPagesNow: false,
  needsGeneralizedPageSurface: true,
  recommendedGeneralization: "Add PAGE_ANSWER_SURFACE_V1 or PAGE_SURFACE_V1 as a separate manifest contract with family-specific required sections and a new guard before any non-treatment brief route is created.",
};

const implementationBridge = {
  version: "CHAMPAGNE_MANIFEST_IMPLEMENTATION_BRIDGE_V1",
  generatedAt,
  purpose: "Audit/planning bridge between governed content briefs and Champagne's manifest/page-builder/section architecture. This file does not authorize route creation, launch, deploy, or content rewrites.",
  safety: {
    noNewPublicPagesCreated: true,
    noLaunchReadinessClaim: true,
    noMutationDeployMergeAuthority: true,
    noDuplicateRouteFamilies: true,
    noDoorwayLocalSpam: true,
    preserveManifestDrivenArchitecture: true,
    preserveSectionDrivenArchitecture: true,
    heroBehaviorChanged: false,
    visualDesignChanged: false,
    phiPmsPatientWorkflowsTouched: false,
  },
  evidenceFiles: {
    packageJson: "package.json",
    appRoutes: "apps/web/app/**/page.tsx",
    pageBuilder: pageBuilderPath,
    treatmentRoute: treatmentRoutePath,
    manifests: "packages/champagne-manifests/**",
    sections: "packages/champagne-sections/**",
    websiteTruthExportScript: truthExportPath,
    websiteTruthExportReport: "reports/WEBSITE_TRUTH_EXPORT_REPORT_V1.json",
    sitemap: sitemapPath,
    robots: robotsPath,
    answerSurface: answerSurfacePath,
    treatmentAnswerSurfaceGuard: answerSurfaceGuardPath,
    seoLaunchSafetyGuard: seoGuardPath,
  },
  sourceFingerprint: hashValue({
    manifestPages: pages.length,
    existingPublicRouteFamilies,
    sectionKinds,
    websiteTruthVersion: websiteTruth?.version ?? null,
  }),
  existingArchitecture: {
    appRoutePatterns: routePatterns,
    existingPublicRouteFamilies,
    currentSectionKinds: sectionKinds,
    manifestPageCount: pages.length,
    treatmentPageCount: pages.filter((page) => page.path.startsWith("/treatments/")).length,
    websiteTruthRouteCount: websiteTruth?.routeInventory?.length ?? null,
  },
  familySupport: Object.fromEntries(Object.entries(familyOwnership).map(([family, value]) => [family, {
    canImplementWithCurrentManifest: value.status === "partial" ? "partial" : value.status === "needs_guard" ? "partial" : "false",
    owner: value.proposedOwner,
    manifestCollection: value.proposedManifestCollection,
    existingRoutes: existingRoutesByFamily[family] ?? existingRoutesByFamily[family.split("/")[0]] ?? [],
    routeNeeded: value.routeNeeded,
    status: value.status,
  }])),
  sectionCompatibilityReport: "reports/SECTION_KIND_COMPATIBILITY_MATRIX_V1.json",
  pageBriefMappingReport: "reports/PAGE_BRIEF_TO_MANIFEST_MAPPING_V1.json",
  answerSurfaceAudit,
  entryPipeline: requiredEntryPipeline,
  requiredGuardsBeforeImplementation,
  conclusion: "Do not create the generated brief routes yet. The manifest system is strong for treatment pages and partially reusable, but new page families need route-canon, generalized page-surface, section-kind, schema, truth-export, and family safety guards before implementation.",
};

const readinessReport = {
  version: "NEW_PAGE_IMPLEMENTATION_READINESS_REPORT_V1",
  generatedAt,
  purpose: "Readiness assessment for future high-ROI page-family implementation without route creation or launch certification.",
  readyForLaunch: false,
  readyForPrReview: true,
  noNewPublicPagesCreated: true,
  implementableNowSummary: {
    concerns: "partial",
    compare: "partial",
    costs: "partial",
    guides: "partial",
    local: "partial-with-guard-blocker",
    "trust/review": "partial",
    clinician: "partial-existing-team-canon-first",
    technology: "partial-existing-hub-canon-first",
  },
  blockingFrameworkPieces: [
    "Generalized PAGE_ANSWER_SURFACE_V1/PAGE_SURFACE_V1 contract and renderer for non-treatment pages",
    "Manifest family ownership conventions for concerns/compare/costs/guides/local/trust pages",
    "Dynamic route canon pattern for non-treatment manifest pages without bypassing ChampagnePageBuilder",
    "Comparison table section kind and guard",
    "Cost/fee logic section kind and fee-claim safety guard",
    "Local context section kind plus anti-doorway/local-spam guard",
    "Evidence/review metadata contract and schema mapping",
    "Truth export updates for new route families, schema, page-truth, internal links, and content readiness",
    "Sitemap/robots guard coverage for new public families",
  ],
  requiredGuardsBeforePageCreation: requiredGuardsBeforeImplementation,
  generatedBriefRouteAssessments: briefRoutes,
  recommendedNextMission: {
    name: "PAGE_SURFACE_AND_ROUTE_CANON_FRAMEWORK_V1",
    scope: [
      "Create contracts/guards only for PAGE_ANSWER_SURFACE_V1 and page-family route canon",
      "Extend truth-export classification for concerns/compare/costs/guides/local/trust without creating live routes",
      "Add section-kind guard coverage for comparison/cost/local/evidence requirements",
      "Keep hero, visuals, public routes, and content unchanged",
    ],
  },
};

await writeJson("ops/contracts/CHAMPAGNE_MANIFEST_IMPLEMENTATION_BRIDGE_V1.json", {
  version: "CHAMPAGNE_MANIFEST_IMPLEMENTATION_BRIDGE_V1",
  generatedAt,
  purpose: implementationBridge.purpose,
  requiredReports: [
    "reports/CHAMPAGNE_MANIFEST_IMPLEMENTATION_BRIDGE_REPORT_V1.json",
    "reports/PAGE_BRIEF_TO_MANIFEST_MAPPING_V1.json",
    "reports/SECTION_KIND_COMPATIBILITY_MATRIX_V1.json",
    "reports/NEW_PAGE_IMPLEMENTATION_READINESS_REPORT_V1.json",
  ],
  safety: implementationBridge.safety,
  requiredFieldsPerGeneratedBriefRoute: [
    "canImplementWithCurrentManifest",
    "canonicalRoute",
    "requiredManifestFamily",
    "requiredSectionKinds",
    "missingSectionKinds",
    "requiredSchemaTypes",
    "requiredTruthExportFields",
    "requiredGuards",
    "implementationRisk",
    "recommendation",
  ],
  allowedRecommendations: ["implement_now", "needs_framework", "needs_guard", "do_not_create"],
  launchSafetyRules: {
    neverClaimLaunchCertification: true,
    noPublicRoutesInBridgeMission: true,
    preserveManifestDrivenArchitecture: true,
    preserveSectionDrivenArchitecture: true,
    noDoorwayLocalSpam: true,
    noDuplicateRouteFamilies: true,
  },
});
await writeJson("reports/CHAMPAGNE_MANIFEST_IMPLEMENTATION_BRIDGE_REPORT_V1.json", implementationBridge);
await writeJson("reports/PAGE_BRIEF_TO_MANIFEST_MAPPING_V1.json", pageBriefMapping);
await writeJson("reports/SECTION_KIND_COMPATIBILITY_MATRIX_V1.json", compatibilityMatrix);
await writeJson("reports/NEW_PAGE_IMPLEMENTATION_READINESS_REPORT_V1.json", readinessReport);

console.log("[manifest-implementation-bridge] wrote ops/contracts/CHAMPAGNE_MANIFEST_IMPLEMENTATION_BRIDGE_V1.json");
console.log("[manifest-implementation-bridge] wrote reports/CHAMPAGNE_MANIFEST_IMPLEMENTATION_BRIDGE_REPORT_V1.json");
console.log("[manifest-implementation-bridge] wrote reports/PAGE_BRIEF_TO_MANIFEST_MAPPING_V1.json");
console.log("[manifest-implementation-bridge] wrote reports/SECTION_KIND_COMPATIBILITY_MATRIX_V1.json");
console.log("[manifest-implementation-bridge] wrote reports/NEW_PAGE_IMPLEMENTATION_READINESS_REPORT_V1.json");
console.log("[manifest-implementation-bridge] no public routes created; readyForPrReview=true readyForLaunch=false");
