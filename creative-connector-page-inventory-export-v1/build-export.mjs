import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const rel = (absolutePath) => path.relative(repoRoot, absolutePath).split(path.sep).join("/");
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));

const manifestPath = "packages/champagne-manifests/data/champagne_machine_manifest_full.json";
const pageIndexPath = "_truth_output/page_index_truth.json";
const pageContentPath = "_truth_output/page_content_truth.json";
const appRoot = path.join(repoRoot, "apps/web/app");
const schemaVersion = "CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1";
const sourceRepo = "champagne";
const recommendedImportTarget = "agent Creative Connector Phase 13 Champagne Inventory Import";

const manifest = readJson(manifestPath);
const pageIndex = readJson(pageIndexPath);
const pageContentTruth = readJson(pageContentPath);

const contentTruthByRoute = new Map();
for (const entry of pageContentTruth) {
  if (!contentTruthByRoute.has(entry.route)) contentTruthByRoute.set(entry.route, []);
  contentTruthByRoute.get(entry.route).push(entry);
}

function walkFiles(dir, predicate, output = []) {
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (dirent.name === "node_modules" || dirent.name === ".next") continue;
    const absolute = path.join(dir, dirent.name);
    if (dirent.isDirectory()) walkFiles(absolute, predicate, output);
    else if (predicate(absolute)) output.push(absolute);
  }
  return output;
}

function routePatternFromPageFile(absoluteFile) {
  const relative = rel(absoluteFile);
  const appRelative = relative
    .replace(/^apps\/web\/app\//, "")
    .replace(/(^|\/)page\.tsx$/, "");
  const visibleParts = appRelative.split("/").filter((part) => part && !(part.startsWith("(") && part.endsWith(")")));
  return `/${visibleParts.join("/")}`.replace(/\/index$/, "") || "/";
}

const pageSourcePatterns = walkFiles(appRoot, (file) => file.endsWith("/page.tsx"))
  .map((absolute) => ({ pattern: routePatternFromPageFile(absolute), sourceFile: rel(absolute) }))
  .sort((a, b) => b.pattern.split("/").length - a.pattern.split("/").length);

const routeHandlers = walkFiles(appRoot, (file) => file.endsWith("/route.ts")).map((absolute) => rel(absolute));

function routeMatches(route, pattern) {
  if (route === pattern) return true;
  const routeParts = route.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);
  if (routeParts.length !== patternParts.length) return false;
  return patternParts.every((part, index) => (part.startsWith("[") && part.endsWith("]")) || part === routeParts[index]);
}

function matchPageSource(route) {
  return pageSourcePatterns.find(({ pattern }) => routeMatches(route, pattern)) ?? null;
}

function stableIdFromRoute(route) {
  if (route === "/") return "champagne_page_home";
  return `champagne_page_${route.replace(/^\//, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`.toLowerCase();
}

function pageTypeFor(page) {
  if (page.path === "/") return "home";
  if (page.path?.startsWith("/treatments/")) return "treatment_detail";
  if (page.path === "/treatments") return "treatment_hub";
  if (page.path?.startsWith("/team/")) return "team_detail";
  if (page.path === "/team") return "team_hub";
  if (page.path?.startsWith("/legal/")) return "legal";
  if (["/contact", "/fees", "/patient-portal"].includes(page.path)) return "utility";
  return page.category ?? "public_page";
}

function routeGroupFor(route) {
  if (route === "/") return "root";
  const first = route.split("/").filter(Boolean)[0];
  if (first === "treatments") return "treatments";
  if (first === "team") return "team";
  if (first === "legal") return "legal";
  if (["about", "contact", "fees", "blog", "patient-portal", "smile-gallery"].includes(first)) return first;
  return "site";
}

function compactText(value, max = 280) {
  if (typeof value !== "string") return null;
  const oneLine = value.replace(/\s+/g, " ").trim();
  if (!oneLine) return null;
  return oneLine.length > max ? `${oneLine.slice(0, max - 1)}…` : oneLine;
}

function extractContentBlocks(page) {
  return (page.sections ?? []).map((section, index) => ({
    blockId: section.id ?? `section_${index}`,
    order: index,
    type: section.type ?? "manifest-section-ref",
    label: section.label ?? null,
    title: section.title ?? null,
    summary: compactText(section.copy ?? section.strapline ?? section.intro ?? section.description),
    itemCount: Array.isArray(section.items) ? section.items.length : Array.isArray(section.faqs) ? section.faqs.length : Array.isArray(section.stories) ? section.stories.length : null,
    extractionConfidence: section.type ? "HIGH" : "PARTIAL_REFERENCE_ONLY",
    evidenceRef: `${manifestPath}#${page.path || page.id}/sections/${index}`,
  }));
}

function extractCtaBlocks(page) {
  const ctas = [];
  const grouped = page.ctas ?? {};
  for (const [slot, values] of Object.entries(grouped)) {
    if (!Array.isArray(values)) continue;
    values.forEach((value, index) => ctas.push({
      ctaId: typeof value === "string" ? value : value?.id ?? `${slot}_${index}`,
      slot,
      text: typeof value === "string" ? null : value?.label ?? value?.text ?? value?.title ?? null,
      href: typeof value === "string" ? null : value?.href ?? value?.url ?? value?.to ?? null,
      source: "manifest.ctas",
      evidenceRef: `${manifestPath}#${page.path || page.id}/ctas/${slot}/${index}`,
      extractionConfidence: typeof value === "string" ? "PARTIAL_ID_ONLY" : "HIGH",
    }));
  }
  (page.sections ?? []).forEach((section, sectionIndex) => {
    if (!Array.isArray(section.ctas)) return;
    section.ctas.forEach((cta, index) => ctas.push({
      ctaId: cta?.id ?? `${section.id ?? `section_${sectionIndex}`}_cta_${index}`,
      slot: section.type ?? section.id ?? "section_cta",
      text: cta?.label ?? cta?.text ?? cta?.title ?? null,
      href: cta?.href ?? cta?.url ?? cta?.to ?? null,
      source: "manifest.sections.ctas",
      evidenceRef: `${manifestPath}#${page.path || page.id}/sections/${sectionIndex}/ctas/${index}`,
      extractionConfidence: "HIGH",
    }));
  });
  return ctas;
}

function extractMediaSlots(page) {
  const slots = [];
  if (page.hero || page.heroBinding) {
    slots.push({
      slotId: "hero",
      type: "hero",
      title: page.label ?? null,
      mediaHint: page.hero ?? null,
      heroBinding: page.heroBinding ?? null,
      source: "manifest.hero",
      evidenceRef: `${manifestPath}#${page.path || page.id}/hero`,
      confidence: "HIGH_BINDING_PRESENT",
    });
  }
  (page.sections ?? []).forEach((section, index) => {
    const hasMedia = section.type === "media" || section.type === "map" || section.mediaHint || section.image || section.video || section.media;
    if (!hasMedia) return;
    slots.push({
      slotId: section.id ?? `media_${index}`,
      type: section.type ?? "media",
      title: section.title ?? null,
      mediaHint: section.mediaHint ?? section.image ?? section.video ?? section.media ?? null,
      source: "manifest.sections",
      evidenceRef: `${manifestPath}#${page.path || page.id}/sections/${index}`,
      confidence: section.mediaHint || section.image || section.video || section.media ? "HIGH" : "STRUCTURAL_SLOT_ONLY",
    });
  });
  return slots;
}

function extractComponentRefs(page, sourceFile) {
  const refs = new Set();
  if (sourceFile) refs.add(sourceFile);
  refs.add("apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx");
  refs.add("packages/champagne-sections/src/ChampagneSectionRenderer.tsx");
  if (page.hero || page.heroBinding) refs.add("packages/champagne-hero/src/ChampagneHeroFrame.tsx");
  for (const section of page.sections ?? []) {
    if (section.type) refs.add(`section-type:${section.type}`);
    else if (section.id) refs.add(`section-ref:${section.id}`);
  }
  return Array.from(refs).sort();
}

function structuredDataFor(page, pageType, sourceFile) {
  const fields = [];
  if (pageType === "treatment_detail") fields.push("Treatment schema graph via buildTreatmentSchemaGraph(pageSlug, title, description)");
  else if (pageType === "team_detail") fields.push("Team member profile schema graph via buildTeamMemberProfileSchema(manifest.path, name)");
  else fields.push("WebPage JSON-LD pattern where route source emits application/ld+json");
  return {
    fields,
    sourceFile,
    extractionConfidence: sourceFile ? "ROUTE_SOURCE_PATTERN_IDENTIFIED" : "PARTIAL_NO_ROUTE_SOURCE_MATCH",
  };
}

function riskFlagsFor(page, extractionStatus, hasTruth) {
  const flags = [];
  const lowerPath = (page.path ?? "").toLowerCase();
  const category = (page.category ?? "").toLowerCase();
  if (category === "treatment" || lowerPath.startsWith("/treatments/") || /dental|implant|tooth|teeth|facial|skin|clinical/.test(`${lowerPath} ${page.label ?? ""}`.toLowerCase())) {
    flags.push("CLINICAL_CONTENT_REVIEW_REQUIRED");
  }
  if (lowerPath.startsWith("/legal/")) flags.push("LEGAL_CONTENT_REVIEW_REQUIRED");
  if (lowerPath === "/patient-portal") flags.push("PRIVATE_PATIENT_PORTAL_REVIEW_REQUIRED");
  if (!hasTruth) flags.push("NO_PAGE_TRUTH_EXPORT_EVIDENCE");
  if (extractionStatus !== "EXTRACTED_DECLARED") flags.push("PARTIAL_EXTRACTION_REVIEW_REQUIRED");
  return Array.from(new Set(flags));
}

const pageIndexRoutes = new Set(pageIndex.map((entry) => entry.route));
const manifestPages = Object.values(manifest.pages).filter((page) => page?.path).sort((a, b) => a.path.localeCompare(b.path));

const pages = manifestPages.map((page) => {
  const matchedSource = matchPageSource(page.path);
  const sourceFile = matchedSource?.sourceFile ?? null;
  const contentTruth = contentTruthByRoute.get(page.path) ?? [];
  const hasTruth = pageIndexRoutes.has(page.path);
  const contentBlocks = extractContentBlocks(page);
  const ctaBlocks = extractCtaBlocks(page);
  const mediaSlots = extractMediaSlots(page);
  const pageType = pageTypeFor(page);
  const unknownFields = [];
  const extractionBlockers = [];
  if (!sourceFile) {
    unknownFields.push({ field: "sourceFileRefs.pageSource", reason: "No matching app/page.tsx route source was identified by static route pattern matching." });
    extractionBlockers.push("NO_MATCHING_APP_PAGE_SOURCE");
  }
  unknownFields.push({ field: "h1", reason: "No explicit H1 was extracted; manifest labels and section titles were not treated as H1 without renderer execution." });
  if (!page.description && !page.intro) unknownFields.push({ field: "metaDescription", reason: "Manifest does not expose description or intro for this route." });
  if (!hasTruth) extractionBlockers.push("ROUTE_NOT_PRESENT_IN_EXISTING_PAGE_TRUTH_INDEX");
  const hasPartialBlocks = contentBlocks.some((block) => block.extractionConfidence !== "HIGH");
  if (hasPartialBlocks) extractionBlockers.push("SECTION_REFERENCE_WITHOUT_INLINE_CONTENT");
  const extractionStatus = extractionBlockers.length === 0 ? "EXTRACTED_DECLARED" : "PARTIAL";

  return {
    schemaVersion,
    pageId: stableIdFromRoute(page.path),
    sourceRepo,
    route: page.path,
    pageType,
    routeGroup: routeGroupFor(page.path),
    title: page.label ?? page.title ?? null,
    h1: "UNKNOWN",
    metaDescription: page.description ?? page.intro ?? null,
    canonicalPath: page.path,
    contentBlocks,
    ctaBlocks,
    mediaSlots,
    componentRefs: extractComponentRefs(page, sourceFile),
    seoFields: {
      title: page.label ?? page.title ?? null,
      description: page.description ?? page.intro ?? null,
      canonicalPath: page.path,
      openGraphPattern: sourceFile ? "Route source metadata mirrors title/description/url where implemented." : "UNKNOWN",
      twitterPattern: sourceFile ? "Route source metadata sets summary_large_image where implemented." : "UNKNOWN",
      sourceConfidence: sourceFile ? "MANIFEST_PLUS_ROUTE_SOURCE" : "MANIFEST_ONLY",
    },
    structuredDataFields: structuredDataFor(page, pageType, sourceFile),
    sourceFileRefs: Array.from(new Set([
      manifestPath,
      sourceFile,
      hasTruth ? pageIndexPath : null,
      contentTruth.length ? pageContentPath : null,
      ...((page.sections ?? []).some((section) => !section.type) && page.path.startsWith("/treatments/")
        ? [`packages/champagne-manifests/data/sections/smh/treatments.${page.path.replace("/treatments/", "")}.json`]
        : []),
    ].filter(Boolean))).sort(),
    riskFlags: riskFlagsFor(page, extractionStatus, hasTruth),
    rewriteEligibility: {
      eligible: false,
      reason: "Inventory/export only. Creative Connector import must not rewrite Champagne content.",
    },
    mediaPlacementEligibility: {
      eligible: false,
      reason: "Inventory/export only. Media placement changes require separate authorization and must not occur during import.",
      slotCount: mediaSlots.length,
    },
    bundleEligibility: {
      eligible: true,
      reason: "Read-only page read-model import candidate; not a publish/apply/deploy bundle.",
    },
    unknownFields,
    extractionStatus,
    extractionBlockers,
    evidenceRefs: [
      `${manifestPath}#pages.${page.id}`,
      hasTruth ? `${pageIndexPath}#route=${page.path}` : null,
      contentTruth.length ? `${pageContentPath}#route=${page.path}` : null,
      sourceFile,
    ].filter(Boolean),
    authorityPosture: {
      canMutateChampagne: false,
      canApplyRewrite: false,
      canPublish: false,
      canDeploy: false,
      canTouchPhi: false,
      networkCallsAllowed: false,
      providerCallsAllowed: false,
      launchReadyClaimAllowed: false,
    },
    notes: [
      "Generated by static source inspection from existing manifests, route files, and existing page-truth exports.",
      hasTruth ? "Route is present in existing page-truth index." : "Route exists in manifest but is absent from existing page-truth index; marked partial.",
    ],
  };
});

const statusSummary = pages.reduce((acc, page) => {
  acc[page.extractionStatus] = (acc[page.extractionStatus] ?? 0) + 1;
  return acc;
}, {});

const output = {
  schemaVersion,
  sourceRepo,
  createdAt: new Date().toISOString(),
  generationMode: "STATIC_SOURCE_INSPECTION_ONLY",
  networkCallsMade: false,
  websiteBehaviourChanged: false,
  routeSourcePatterns: pageSourcePatterns,
  nonPageRouteHandlersObserved: routeHandlers,
  sourceFilesRead: [
    "AGENTS.md",
    "README.md",
    "package.json",
    manifestPath,
    pageIndexPath,
    pageContentPath,
    "apps/web/app/**/page.tsx",
    "apps/web/app/sitemap.ts",
    "apps/web/app/robots.ts",
    "packages/champagne-manifests/data/seo/**",
  ],
  recommendedImportTarget,
  pages,
};

const reportLines = [];
const pageTypes = pages.reduce((acc, page) => {
  acc[page.pageType] = (acc[page.pageType] ?? 0) + 1;
  return acc;
}, {});
const partialPages = pages.filter((page) => page.extractionStatus !== "EXTRACTED_DECLARED");
const clinicalPages = pages.filter((page) => page.riskFlags.includes("CLINICAL_CONTENT_REVIEW_REQUIRED"));
const mediaSlotCount = pages.reduce((sum, page) => sum + page.mediaSlots.length, 0);
const ctaCount = pages.reduce((sum, page) => sum + page.ctaBlocks.length, 0);

reportLines.push("# Champagne Page Inventory Export V1");
reportLines.push("");
reportLines.push("## No-mutation posture");
reportLines.push("This export was generated by static repository inspection only. It creates a read-only inventory directory and does not change Champagne website source files, routes, metadata, media, content, runtime behaviour, deployment state, PHI, or provider integrations.");
reportLines.push("");
reportLines.push("## Summary");
reportLines.push(`- Pages found: ${pages.length}`);
reportLines.push(`- Page types: ${Object.entries(pageTypes).map(([key, count]) => `${key} (${count})`).join(", ")}`);
reportLines.push(`- Extraction coverage: ${Object.entries(statusSummary).map(([key, count]) => `${key} (${count})`).join(", ")}`);
reportLines.push(`- Clinical/treatment-review risk pages: ${clinicalPages.length}`);
reportLines.push(`- CTA blocks recorded: ${ctaCount}`);
reportLines.push(`- Media slots recorded: ${mediaSlotCount}`);
reportLines.push("");
reportLines.push("## Routes found");
for (const page of pages) {
  reportLines.push(`- ${page.route} — ${page.pageType} — ${page.extractionStatus}`);
}
reportLines.push("");
reportLines.push("## Blocked or partial pages");
if (partialPages.length === 0) {
  reportLines.push("- None.");
} else {
  for (const page of partialPages) {
    reportLines.push(`- ${page.route}: ${page.extractionBlockers.join(", ")}`);
  }
}
reportLines.push("");
reportLines.push("## Unknown fields and extraction caveats");
reportLines.push("- H1 values are set to UNKNOWN for every page because H1 was not explicitly extracted from runtime-rendered markup; manifest labels and section titles were not treated as H1.");
reportLines.push("- Meta descriptions use manifest description/intro fields where present; missing values are preserved as null rather than guessed.");
reportLines.push("- Treatment detail pages may contain section references whose runtime default content is resolved through the page builder/section system; those pages are marked PARTIAL when inline content could not be fully declared from the primary manifest.");
reportLines.push("- Four manifest treatment routes are absent from the existing page-truth index and are therefore marked PARTIAL: /treatments/cosmetic-dentistry, /treatments/preventive-dentistry, /treatments/surgically-guided-implants, /treatments/teeth-replacement.");
reportLines.push("- Media slots are recorded only for explicit hero bindings, media/map section types, or manifest media hints; no visual guesses, screenshots, or browser crawls were used.");
reportLines.push("- SEO/schema extraction is based on static metadata/JSON-LD patterns and manifest values. Payloads were not browser-rendered.");
reportLines.push("");
reportLines.push("## Files or patterns not safely interpreted");
reportLines.push("- Runtime renderer output was not executed; component-level H1 and final rendered schema payload details remain unconfirmed.");
reportLines.push("- Dynamic catch-all behaviour in apps/web/app/(site)/[page]/page.tsx is represented through manifest route matching, not by crawling.");
reportLines.push("- API/route handlers are listed as observed non-page route handlers in the JSON export but are not emitted as page objects.");
reportLines.push("");
reportLines.push("## Import posture for Creative Connector OS");
reportLines.push(`- Recommended import target: ${recommendedImportTarget}`);
reportLines.push("- Import must treat this as a read-only page read-model source and must not mutate Champagne.");

const status = {
  schemaVersion: "CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1",
  exportCreated: true,
  repoMutatedExistingFiles: false,
  websiteBehaviourChanged: false,
  contentRewritten: false,
  routesChanged: false,
  metadataChanged: false,
  mediaChanged: false,
  deploymentRun: false,
  phiTouched: false,
  networkCallsMade: false,
  pagesFound: pages.length,
  extractionStatusSummary: statusSummary,
  recommendedImportTarget,
  launchReadyClaim: false,
};

const importInstructions = `# Champagne Page Inventory Import Instructions for Agent V1

## Export location

Read these files from the Champagne repository without mutating Champagne:

- creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json
- creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_REPORT_V1.md
- creative-connector-page-inventory-export-v1/CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1.json

## Expected schema shape

The JSON export root contains schemaVersion, sourceRepo, generationMode, routeSourcePatterns, nonPageRouteHandlersObserved, sourceFilesRead, recommendedImportTarget, and pages.
Each pages[] object contains schemaVersion, pageId, sourceRepo, route, pageType, routeGroup, title, h1, metaDescription, canonicalPath, contentBlocks, ctaBlocks, mediaSlots, componentRefs, seoFields, structuredDataFields, sourceFileRefs, riskFlags, rewriteEligibility, mediaPlacementEligibility, bundleEligibility, unknownFields, extractionStatus, extractionBlockers, evidenceRefs, authorityPosture, and notes.

## Known partial/unknown extraction caveats

- h1 is intentionally UNKNOWN unless explicitly extracted; do not infer it from title or labels during import.
- PARTIAL pages must retain extractionBlockers and unknownFields.
- Clinical/treatment pages carry CLINICAL_CONTENT_REVIEW_REQUIRED and must not be treated as approved rewrite candidates.
- Four manifest treatment routes are not present in the existing page-truth index and remain partial evidence records.
- Media slots represent structural inventory only; they are not placement instructions.
- The export did not render pages, crawl the site, call providers, or make network requests.

## Suggested validation rules

- Validate schemaVersion equals CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1 at root and on every page.
- Validate pageId and route are unique.
- Validate authorityPosture.canMutateChampagne, canApplyRewrite, canPublish, canDeploy, canTouchPhi, networkCallsAllowed, providerCallsAllowed, and launchReadyClaimAllowed are all false for every page.
- Validate status flags keep repoMutatedExistingFiles, websiteBehaviourChanged, contentRewritten, routesChanged, metadataChanged, mediaChanged, deploymentRun, phiTouched, networkCallsMade, and launchReadyClaim false.
- Preserve unknownFields, extractionBlockers, evidenceRefs, and riskFlags verbatim in the imported read model.

## Suggested next agent prompt path

Use: agent Creative Connector Phase 13 Champagne Inventory Import.
Import the JSON as a read-only Champagne page read-model contract source. Do not mutate the Champagne repository. Do not rewrite content, alter routes, change media, deploy, publish, touch PHI, call providers, or claim launch readiness.
`;

fs.writeFileSync(path.join(__dirname, "CHAMPAGNE_PAGE_INVENTORY_EXPORT_V1.json"), `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(path.join(__dirname, "CHAMPAGNE_PAGE_INVENTORY_EXPORT_REPORT_V1.md"), `${reportLines.join("\n")}\n`);
fs.writeFileSync(path.join(__dirname, "CHAMPAGNE_PAGE_INVENTORY_EXPORT_STATUS_V1.json"), `${JSON.stringify(status, null, 2)}\n`);
fs.writeFileSync(path.join(__dirname, "CHAMPAGNE_PAGE_INVENTORY_IMPORT_INSTRUCTIONS_FOR_AGENT_V1.md"), importInstructions);

console.log(JSON.stringify({ pagesFound: pages.length, extractionStatusSummary: statusSummary, filesWritten: 4 }, null, 2));
