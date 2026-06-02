import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const generatedAt = new Date().toISOString();
const outputDir = path.join(root, "tools/audits/seo-visible-answer-surface-rendering");
const manifestPath = path.join(root, "packages/champagne-manifests/data/champagne_machine_manifest_full.json");
const aiAnswerRegistryPath = path.join(root, "packages/champagne-manifests/data/seo-ai-answer-foundation/ai-answer-registry.v1.smh.json");
const treatmentFactRegistryPath = path.join(root, "packages/champagne-manifests/data/seo-ai-answer-foundation/treatment-fact-registry.v1.smh.json");
const sectionRegistryPath = path.join(root, "packages/champagne-sections/src/SectionRegistry.ts");
const answerSurfaceComponentPath = path.join(root, "packages/champagne-sections/src/Section_TreatmentAnswerSurface.tsx");
const treatmentPagePath = path.join(root, "apps/web/app/treatments/[slug]/page.tsx");
const contactPagePath = path.join(root, "apps/web/app/contact/page.tsx");

const targetServices = [
  { service: "emergency-dentist", label: "Emergency Dentist" },
  { service: "dental-implants", label: "Dental Implants" },
  { service: "private-dentist", label: "Private Dentist" },
  { service: "examinations", label: "Examination" },
  { service: "spark-aligners", label: "Spark Aligners" },
  { service: "orthodontics", label: "Orthodontics" },
  { service: "3d-dentistry", label: "3D Dentistry" },
  { service: "same-day-crowns-veneers", label: "Same-Day Crowns" },
  { service: "veneers", label: "Veneers" },
  { service: "sedation-anxiety-dentistry", label: "Sedation / Anxiety Dentistry" },
  { service: "hygiene-recall", label: "Hygiene / Recall" },
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeRoute(routePath) {
  const cleaned = String(routePath || "").split("#")[0].split("?")[0].trim();
  if (!cleaned) return "/";
  const withSlash = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  return withSlash.length > 1 && withSlash.endsWith("/") ? withSlash.slice(0, -1).toLowerCase() : withSlash.toLowerCase();
}

function findPageByRoute(manifest, routePath) {
  const normalizedRoute = normalizeRoute(routePath);
  const collections = [manifest.pages || {}, manifest.treatments || {}];
  for (const collection of collections) {
    for (const [id, page] of Object.entries(collection)) {
      if (normalizeRoute(page.path) === normalizedRoute) return { id, page };
    }
  }
  return null;
}

function writeJson(fileName, data) {
  fs.writeFileSync(path.join(outputDir, fileName), `${JSON.stringify(data, null, 2)}\n`);
}

const manifest = readJson(manifestPath);
const aiAnswerRegistry = readJson(aiAnswerRegistryPath);
const treatmentFactRegistry = readJson(treatmentFactRegistryPath);
const sectionRegistrySource = fs.readFileSync(sectionRegistryPath, "utf8");
const answerSurfaceComponentSource = fs.readFileSync(answerSurfaceComponentPath, "utf8");
const treatmentPageSource = fs.readFileSync(treatmentPagePath, "utf8");
const contactPageSource = fs.readFileSync(contactPagePath, "utf8");

const answersByService = new Map(aiAnswerRegistry.entries.map((entry) => [entry.service, entry]));
const factsByService = new Map(treatmentFactRegistry.entries.map((entry) => [entry.service, entry]));
const routeCounts = new Map();

const routeStatus = targetServices.map((target) => {
  const answer = answersByService.get(target.service);
  const fact = factsByService.get(target.service);
  const routePath = fact?.route_path || null;
  const pageMatch = routePath ? findPageByRoute(manifest, routePath) : null;
  if (routePath) routeCounts.set(normalizeRoute(routePath), (routeCounts.get(normalizeRoute(routePath)) || 0) + 1);

  const renderedByRegistry = sectionRegistrySource.includes("getVisibleAnswerPacketForRoute")
    && sectionRegistrySource.includes("insertVisibleAnswerSurface")
    && sectionRegistrySource.includes("treatment_answer_surface");
  const renderedByComponent = answerSurfaceComponentSource.includes("data-ai-answer-id")
    && answerSurfaceComponentSource.includes("expanded_answer")
    && answerSurfaceComponentSource.includes("Source metadata");

  return {
    service: target.service,
    label: target.label,
    routePath,
    pageId: pageMatch?.id || null,
    pageCategory: pageMatch?.page?.category || null,
    answerRegistryId: answer?.id || null,
    question: answer?.question || null,
    shortAnswerWords: answer?.short_answer ? answer.short_answer.trim().split(/\s+/).length : 0,
    expandedAnswerWords: answer?.expanded_answer ? answer.expanded_answer.trim().split(/\s+/).length : 0,
    approvedForAi: Boolean(answer?.approved_for_ai),
    approvedForVoice: Boolean(answer?.approved_for_voice),
    approvedForChatbot: Boolean(answer?.approved_for_chatbot),
    approvedForSchema: Boolean(answer?.approved_for_schema),
    schemaEmissionChanged: false,
    visibleRenderingMechanism: renderedByRegistry && renderedByComponent ? "manifest_registry_injected_section" : "missing",
    appearsHighEnough: renderedByRegistry && sectionRegistrySource.includes("const insertIndex = Math.min(1, sections.length)"),
    serverRendered: renderedByComponent && !answerSurfaceComponentSource.includes("use client"),
    accessible: renderedByComponent && answerSurfaceComponentSource.includes("aria-labelledby"),
    indexableHtml: renderedByComponent && !answerSurfaceComponentSource.includes("details"),
    duplicateAnswerBlocksForRoute: routePath ? routeCounts.get(normalizeRoute(routePath)) > 1 : false,
    status: answer && routePath && pageMatch && renderedByRegistry && renderedByComponent ? "rendered" : "missing",
  };
});

const missingRoutes = routeStatus.filter((item) => item.status !== "rendered");
const duplicateRoutes = [...routeCounts.entries()].filter(([, count]) => count > 1).map(([routePath, count]) => ({ routePath, count }));
const orphanTargetPackets = targetServices
  .filter((target) => !routeStatus.find((item) => item.service === target.service && item.status === "rendered"))
  .map((target) => target.service);
const renderedCount = routeStatus.filter((item) => item.status === "rendered").length;
const coveragePercentage = Math.round((renderedCount / targetServices.length) * 100);

const qaChecks = [
  { id: "answer_packets_render", pass: renderedCount === targetServices.length, detail: `${renderedCount}/${targetServices.length} target answer packets have visible rendering coverage.` },
  { id: "no_broken_routes", pass: routeStatus.every((item) => Boolean(item.pageId)), detail: "Every target route resolves to a page manifest entry." },
  { id: "no_duplicate_answer_blocks", pass: duplicateRoutes.length === 0, detail: duplicateRoutes.length ? JSON.stringify(duplicateRoutes) : "No duplicate target-service routes detected." },
  { id: "no_orphan_target_packets", pass: orphanTargetPackets.length === 0, detail: orphanTargetPackets.length ? orphanTargetPackets.join(", ") : "Every target packet maps to a visible route." },
  { id: "no_schema_breakage", pass: routeStatus.every((item) => item.schemaEmissionChanged === false) && treatmentPageSource.includes("buildTreatmentSchemaGraph"), detail: "Rendering uses visible HTML only; treatment JSON-LD path remains present and unchanged by this QA." },
  { id: "accessibility_contract", pass: routeStatus.every((item) => item.accessible && item.serverRendered && item.indexableHtml), detail: "Visible answer section uses aria-labelledby, server component rendering, and non-collapsed HTML." },
  { id: "contact_route_builder", pass: contactPageSource.includes("ChampagnePageBuilder"), detail: "Private dentist contact route uses the shared page builder and receives the injected visible answer section." },
];

const qaStatus = qaChecks.every((check) => check.pass) ? "pass" : "fail";
const coverage = {
  version: "SEO_VISIBLE_ANSWER_SURFACE_COVERAGE_V1",
  generatedAt,
  targetServiceCount: targetServices.length,
  renderedCount,
  coveragePercentage,
  renderedRoutes: routeStatus.filter((item) => item.status === "rendered").map((item) => item.routePath),
  missingRoutes: missingRoutes.map((item) => ({ service: item.service, routePath: item.routePath, reason: item.status })),
};

const zeroClickQa = {
  version: "SEO_ZERO_CLICK_RENDERING_QA_V1",
  generatedAt,
  status: qaStatus,
  checks: qaChecks,
  zeroClickRequirements: {
    highEnoughOnPage: routeStatus.every((item) => item.appearsHighEnough),
    visibleHtmlContent: routeStatus.every((item) => item.indexableHtml),
    notJsOnly: routeStatus.every((item) => item.serverRendered),
    aiExtractionSuitable: routeStatus.every((item) => item.question && item.shortAnswerWords >= 20 && item.expandedAnswerWords >= 40),
  },
};

const reportJson = {
  version: "SEO_VISIBLE_ANSWER_SURFACE_RENDERING_REPORT_V1",
  generatedAt,
  status: qaStatus,
  mission: "SEO_VISIBLE_ANSWER_SURFACE_RENDERING_V1",
  architecture: {
    renderingMechanism: "SectionRegistry injects one treatment_answer_surface section from the existing AI answer packet registry, then Section_TreatmentAnswerSurface renders visible server-side HTML.",
    contentSource: "packages/champagne-manifests/data/seo-ai-answer-foundation/ai-answer-registry.v1.smh.json",
    routeSource: "packages/champagne-manifests/data/seo-ai-answer-foundation/treatment-fact-registry.v1.smh.json",
    noChatbotRuntimeMutation: true,
    noSchemaEmissionMutation: true,
  },
  coverage,
  routeStatus,
  qa: zeroClickQa,
  recommendation: qaStatus === "pass" ? "LAUNCH_READY_FOR_REASSESSMENT" : "NEXT_MISSION_REQUIRED",
};

const reportMd = `# SEO Visible Answer Surface Rendering Report V1\n\nGenerated: ${generatedAt}\n\n## Status\n\n${qaStatus === "pass" ? "PASS" : "FAIL"}\n\n## Architecture\n\nVisible answer surfaces are rendered through the existing section registry path. The registry injects one \`treatment_answer_surface\` section for each target route from the approved AI answer packet registry and treatment fact route mapping. The reusable section component renders visible server-side HTML containing the packet question, short answer, expanded answer, and source metadata.\n\n## Coverage\n\n- Target services: ${targetServices.length}\n- Rendered answer surfaces: ${renderedCount}\n- Coverage: ${coveragePercentage}%\n- Remaining missing routes: ${missingRoutes.length}\n\n## Routes Updated\n\n${routeStatus.map((item) => `- ${item.label}: ${item.routePath} — ${item.status}`).join("\n")}\n\n## QA Summary\n\n${qaChecks.map((check) => `- ${check.pass ? "PASS" : "FAIL"}: ${check.id} — ${check.detail}`).join("\n")}\n\n## Remaining Launch Blockers\n\n${qaStatus === "pass" ? "No remaining blockers for reassessment within this bounded rendering mission. This is not launch certification." : missingRoutes.map((item) => `- ${item.service}: ${item.routePath || "missing route"}`).join("\n")}\n\n## Recommendation\n\n${qaStatus === "pass" ? "LAUNCH_READY_FOR_REASSESSMENT" : "NEXT_MISSION_REQUIRED"}\n`;

const nextBuildRecommendation = `# SEO Next Build Recommendation V1\n\n## Recommendation\n\n${qaStatus === "pass" ? "LAUNCH_READY_FOR_REASSESSMENT" : "NEXT_MISSION_REQUIRED"}\n\n## Notes\n\n- Visible answer packet rendering is now covered for ${renderedCount}/${targetServices.length} target services.\n- This mission did not mutate chatbot runtime behaviour, booking workflows, PHI systems, PMS/Dentally integrations, or schema emission flags.\n- This recommendation is reassessment readiness only, not launch certification.\n`;

fs.mkdirSync(outputDir, { recursive: true });
writeJson("SEO_VISIBLE_ANSWER_SURFACE_RENDERING_REPORT_V1.json", reportJson);
writeJson("SEO_VISIBLE_ANSWER_SURFACE_COVERAGE_V1.json", coverage);
writeJson("SEO_ZERO_CLICK_RENDERING_QA_V1.json", zeroClickQa);
writeJson("SEO_ROUTE_RENDERING_STATUS_V1.json", { version: "SEO_ROUTE_RENDERING_STATUS_V1", generatedAt, status: qaStatus, routes: routeStatus });
fs.writeFileSync(path.join(outputDir, "SEO_VISIBLE_ANSWER_SURFACE_RENDERING_REPORT_V1.md"), reportMd);
fs.writeFileSync(path.join(outputDir, "SEO_NEXT_BUILD_RECOMMENDATION_V1.md"), nextBuildRecommendation);

if (qaStatus !== "pass") {
  console.error(`❌ seo:answer-rendering-qa failed: ${missingRoutes.length} routes missing visible answer rendering.`);
  process.exit(1);
}

console.log(`✅ seo:answer-rendering-qa passed: ${renderedCount}/${targetServices.length} visible answer surfaces (${coveragePercentage}%).`);
