#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "tools/audits/route-availability-reconciliation-3d-dentistry");
const generatedAt = new Date().toISOString();
const requestedRoute = "/treatments/3d-dentistry-and-technology";
const relatedRoute = "/treatments/3d-digital-dentistry";
const affectedRoutes = [requestedRoute, relatedRoute];
const baseUrl = process.env.CHAMPAGNE_ROUTE_QA_BASE_URL || "http://localhost:3000";
const runtimeMode = process.env.CHAMPAGNE_ROUTE_QA_RUNTIME === "1";

const machineManifestPath = "packages/champagne-manifests/data/champagne_machine_manifest_full.json";
const localIdentityPath = "packages/champagne-manifests/data/seo/local-identity.smh.json";
const answerRegistryPath = "packages/champagne-manifests/data/seo-ai-answer-foundation/ai-answer-registry.v1.smh.json";
const treatmentFactRegistryPath = "packages/champagne-manifests/data/seo-ai-answer-foundation/treatment-fact-registry.v1.smh.json";
const helperPath = "packages/champagne-manifests/src/helpers.ts";
const sitemapPath = "apps/web/app/sitemap.ts";
const treatmentPagePath = "apps/web/app/treatments/[slug]/page.tsx";
const answerRenderingQaPath = "scripts/seo-visible-answer-surface-rendering-qa.mjs";

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next", "dist", "_imports"].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, results);
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function collectReferences(route) {
  const roots = ["apps", "packages", "scripts"];
  const matches = [];
  for (const root of roots) {
    const rootPath = path.join(repoRoot, root);
    if (!fs.existsSync(rootPath)) continue;
    for (const filePath of walk(rootPath)) {
      const relativePath = path.relative(repoRoot, filePath);
      if (!/\.(ts|tsx|js|jsx|mjs|cjs|json|md)$/.test(relativePath)) continue;
      const content = fs.readFileSync(filePath, "utf8");
      if (!content.includes(route)) continue;
      content.split(/\r?\n/).forEach((line, index) => {
        if (line.includes(route)) {
          matches.push({ file: relativePath, line: index + 1, excerpt: line.trim().slice(0, 260) });
        }
      });
    }
  }
  return matches;
}

function findMachineManifestEntry(route) {
  const manifest = readJson(machineManifestPath);
  const collections = [
    { name: "pages", entries: manifest.pages ?? {} },
    { name: "treatments", entries: manifest.treatments ?? {} },
  ];

  for (const collection of collections) {
    for (const [id, entry] of Object.entries(collection.entries)) {
      if (entry?.path === route) {
        return {
          collection: collection.name,
          id,
          path: entry.path,
          label: entry.label ?? null,
          category: entry.category ?? null,
          hasHeroBinding: Boolean(entry.heroBinding?.heroId),
        };
      }
    }
  }

  return null;
}

function findPriorityService(route) {
  const identity = readJson(localIdentityPath);
  return (identity.priorityServices ?? []).find((entry) => entry.routePath === route) ?? null;
}

function findAnswerRegistryEntry(route) {
  const registry = readJson(answerRegistryPath);
  return (registry.entries ?? []).find((entry) => entry.route_path === route) ?? null;
}

function findTreatmentFactEntry(route) {
  const registry = readJson(treatmentFactRegistryPath);
  return (registry.entries ?? []).find((entry) => entry.route_path === route) ?? null;
}

function routeIdFromPath(route) {
  return route.replace(/^\//, "").replace(/\//g, ".");
}

async function fetchRoute(route) {
  if (!runtimeMode) {
    return { route, url: `${baseUrl}${route}`, status: "not_run", reason: "Set CHAMPAGNE_ROUTE_QA_RUNTIME=1 while a local production server is running to enable HTTP checks." };
  }

  const url = `${baseUrl}${route}`;
  const response = await fetch(url, { redirect: "manual" });
  const text = await response.text();
  return {
    route,
    url,
    status: "run",
    httpStatus: response.status,
    location: response.headers.get("location"),
    contentLength: text.length,
    hasHtml: /<!doctype html|<html/i.test(text),
    hasTreatmentAnswerText: /Treatment answers|data-ai-answer-id|Source metadata/i.test(text),
    hasNotFoundMarker: /Treatment not found|__next_error__|not-found/i.test(text),
  };
}

const helperSource = readText(helperPath);
const sitemapSource = readText(sitemapPath);
const treatmentPageSource = readText(treatmentPagePath);
const answerRenderingQaSource = readText(answerRenderingQaPath);

const referenceAudit = {
  generatedAt,
  routes: Object.fromEntries(affectedRoutes.map((route) => [route, collectReferences(route)])),
  summary: {
    requestedRouteReferenceCount: collectReferences(requestedRoute).length,
    relatedRouteReferenceCount: collectReferences(relatedRoute).length,
  },
};

const canonicalDecision = {
  generatedAt,
  decision: "A_REAL_CANONICAL_ROUTE",
  requestedRoute,
  relatedRoute,
  canonicalRoute: requestedRoute,
  redirectRequired: false,
  rationale: [
    "The machine manifest already contains /treatments/3d-dentistry-and-technology as a page with a treatment path and 3D dentistry label.",
    "SEO local identity, AI answer registry, treatment fact registry, and answer rendering QA reference /treatments/3d-dentistry-and-technology for the distinct 3d-dentistry service.",
    "The related /treatments/3d-digital-dentistry route is separately referenced for same-day crowns/veneers, so redirecting the 3D dentistry route to it would collapse two service mappings.",
  ],
};

const staticQa = affectedRoutes.map((route) => {
  const machineEntry = findMachineManifestEntry(route);
  const priorityService = findPriorityService(route);
  const answerEntry = findAnswerRegistryEntry(route);
  const factEntry = findTreatmentFactEntry(route);
  return {
    route,
    routeId: routeIdFromPath(route),
    machineManifestEntry: machineEntry,
    listedInMachineManifest: Boolean(machineEntry),
    includedByTreatmentPathResolver: Boolean(machineEntry?.path?.startsWith("/treatments/"))
      && helperSource.includes("if (!path || !isTreatmentPath) return undefined;"),
    sitemapSourceUsesAllPages: sitemapSource.includes("getAllPages()"),
    appRouteUsesTreatmentManifestResolver: treatmentPageSource.includes("getTreatmentManifest")
      && treatmentPageSource.includes("ChampagnePageBuilder"),
    priorityServiceId: priorityService?.id ?? null,
    answerRegistryId: answerEntry?.id ?? null,
    treatmentFactId: factEntry?.id ?? null,
    answerRenderingQaServiceCovered: Boolean(priorityService?.id && answerRenderingQaSource.includes(`service: "${priorityService.id}"`)),
  };
});

const runtimeQa = [];
for (const route of affectedRoutes) {
  runtimeQa.push(await fetchRoute(route));
}

const qaResults = {
  generatedAt,
  mode: runtimeMode ? "runtime_and_static" : "static_only",
  baseUrl,
  routes: staticQa,
  runtime: runtimeQa,
  checks: [
    {
      id: "requested_route_has_machine_manifest_entry",
      pass: Boolean(findMachineManifestEntry(requestedRoute)),
    },
    {
      id: "related_route_remains_manifested",
      pass: Boolean(findMachineManifestEntry(relatedRoute)),
    },
    {
      id: "requested_route_has_distinct_seo_answer_mapping",
      pass: Boolean(findPriorityService(requestedRoute) && findAnswerRegistryEntry(requestedRoute) && findTreatmentFactEntry(requestedRoute)),
    },
    {
      id: "related_route_has_distinct_mapping",
      pass: Boolean(findPriorityService(relatedRoute) && findAnswerRegistryEntry(relatedRoute) && findTreatmentFactEntry(relatedRoute)),
    },
    {
      id: "treatment_path_resolver_accepts_treatment_paths_without_category_gate",
      pass: helperSource.includes("if (!path || !isTreatmentPath) return undefined;"),
    },
    {
      id: "runtime_routes_return_non_404_when_enabled",
      pass: runtimeMode ? runtimeQa.every((entry) => entry.httpStatus && entry.httpStatus < 400) : null,
    },
  ],
};

const status = qaResults.checks.every((check) => check.pass !== false) ? "pass" : "fail";
const runtimeReady = runtimeMode && runtimeQa.every((entry) => entry.httpStatus && entry.httpStatus < 400);
const recommendation = runtimeReady
  ? "LIGHTHOUSE_EVIDENCE_CAN_BE_RERUN"
  : "RUN_LOCAL_PRODUCTION_ROUTE_QA_THEN_RERUN_LIGHTHOUSE_EVIDENCE";

const report = {
  generatedAt,
  status,
  recommendation,
  canonicalDecision,
  filesInspected: [
    machineManifestPath,
    localIdentityPath,
    answerRegistryPath,
    treatmentFactRegistryPath,
    helperPath,
    sitemapPath,
    treatmentPagePath,
    answerRenderingQaPath,
  ],
  changedFiles: [helperPath],
  referenceAudit,
  qaResults,
};

const reportMd = `# Route Availability Reconciliation Report V1\n\nGenerated: ${generatedAt}\n\n## Status\n\n${status.toUpperCase()}\n\n## Canonical Decision\n\n${canonicalDecision.decision}\n\nCanonical route: \`${requestedRoute}\`.\n\nRelated route retained: \`${relatedRoute}\`.\n\nRedirect required: ${canonicalDecision.redirectRequired ? "yes" : "no"}.\n\n## Rationale\n\n${canonicalDecision.rationale.map((entry) => `- ${entry}`).join("\n")}\n\n## Bounded Change\n\n- Updated \`${helperPath}\` so App Router treatment resolution accepts manifest entries with paths under \`/treatments/\` even when the manifest category is not literally \`treatment\`.\n- No redesign, copy rewrite, schema engine change, SEO approval flag change, deployment, PHI/PMS/Dentally change, or booking workflow change was performed.\n\n## Route QA\n\n| Route | Manifested | Resolver eligible | Priority service | Answer packet | Treatment fact | Runtime HTTP |\n| --- | --- | --- | --- | --- | --- | ---: |\n${staticQa.map((entry) => {
  const runtime = runtimeQa.find((item) => item.route === entry.route);
  return `| ${entry.route} | ${entry.listedInMachineManifest ? "yes" : "no"} | ${entry.includedByTreatmentPathResolver ? "yes" : "no"} | ${entry.priorityServiceId ?? "n/a"} | ${entry.answerRegistryId ?? "n/a"} | ${entry.treatmentFactId ?? "n/a"} | ${runtime?.httpStatus ?? runtime?.status ?? "n/a"} |`;
}).join("\n")}\n\n## Reference Audit Summary\n\n- \`${requestedRoute}\` references in runtime/source scope: ${referenceAudit.summary.requestedRouteReferenceCount}.\n- \`${relatedRoute}\` references in runtime/source scope: ${referenceAudit.summary.relatedRouteReferenceCount}.\n\n## Recommendation\n\n${recommendation}\n`;

const nextRecommendationMd = `# Next Recommendation V1\n\nGenerated: ${generatedAt}\n\n## Recommendation\n\n${recommendation}\n\n## Notes\n\n- \`${requestedRoute}\` is the intended canonical route for the distinct 3D dentistry service.\n- \`${relatedRoute}\` remains a separate valid route for the same-day crowns/veneers mapping.\n- After local production route QA passes, rerun the Lighthouse/CWV/mobile/accessibility evidence packet to replace the prior 7/8 evidence state.\n`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "ROUTE_AVAILABILITY_RECONCILIATION_REPORT_V1.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outputDir, "ROUTE_AVAILABILITY_RECONCILIATION_REPORT_V1.md"), reportMd);
fs.writeFileSync(path.join(outputDir, "ROUTE_CANONICAL_DECISION_V1.json"), JSON.stringify(canonicalDecision, null, 2));
fs.writeFileSync(path.join(outputDir, "ROUTE_REFERENCE_AUDIT_V1.json"), JSON.stringify(referenceAudit, null, 2));
fs.writeFileSync(path.join(outputDir, "ROUTE_QA_RESULTS_V1.json"), JSON.stringify(qaResults, null, 2));
fs.writeFileSync(path.join(outputDir, "NEXT_RECOMMENDATION_V1.md"), nextRecommendationMd);

if (status !== "pass") {
  console.error(`❌ 3D dentistry route availability QA failed. See ${path.relative(repoRoot, outputDir)}.`);
  process.exit(1);
}

console.log(`✅ 3D dentistry route availability QA ${runtimeMode ? "runtime" : "static"} evidence written to ${path.relative(repoRoot, outputDir)}.`);
