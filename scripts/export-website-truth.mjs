import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const rootDir = process.cwd();
const appDir = path.join(rootDir, "apps/web/app");
const siteOrigin = "https://www.smhdental.co.uk";
const generatedAt = new Date().toISOString();

const fileExists = async (relativePath) => {
  try {
    await fs.access(path.join(rootDir, relativePath));
    return true;
  } catch {
    return false;
  }
};

const readText = async (relativePath) => fs.readFile(path.join(rootDir, relativePath), "utf8");
const readJsonOptional = async (relativePath, fallback) => {
  try {
    return JSON.parse(await readText(relativePath));
  } catch {
    return fallback;
  }
};

const readTextOptional = async (relativePath, fallback = "") => {
  try {
    return await readText(relativePath);
  } catch {
    return fallback;
  }
};

const writeJson = async (relativePath, value) => {
  const fullPath = path.join(rootDir, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

const hashValue = (value) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);

const walkFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
};

const normalizeRoutePath = (routePath) => {
  if (!routePath || routePath === "/") return "/";
  return `/${routePath.replace(/^\/+|\/+$/g, "")}`;
};

const appFileToRoute = (fullPath) => {
  const relative = path.relative(appDir, fullPath).split(path.sep).join("/");
  const parts = relative.split("/");
  const leaf = parts.pop();
  if (leaf !== "page.tsx" && leaf !== "route.ts") return null;
  const visibleParts = parts.filter((part) => !/^\(.+\)$/.test(part));
  return {
    route: normalizeRoutePath(visibleParts.join("/")),
    kind: leaf === "route.ts" ? "api_or_route_handler" : "page",
    sourceFile: path.relative(rootDir, fullPath).split(path.sep).join("/"),
    dynamic: visibleParts.some((part) => part.startsWith("[") && part.endsWith("]")),
  };
};

const routeSpecificity = (route) => {
  if (route === "/") return 0;
  return route.split("/").filter(Boolean).length;
};

const routeMatchesPattern = (route, pattern) => {
  if (route === pattern) return true;
  const routeParts = route.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);
  if (routeParts.length !== patternParts.length) return false;
  return patternParts.every((part, index) => part.startsWith("[") || part === routeParts[index]);
};

const flattenValues = (value, callback, pointer = "") => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => flattenValues(item, callback, `${pointer}/${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, nested]) => flattenValues(nested, callback, `${pointer}/${key}`));
    return;
  }
  callback(value, pointer);
};

const isInternalPath = (value) => typeof value === "string" && /^\/[a-zA-Z0-9]/.test(value);

const collectInternalLinksFromValue = (value, route, source, output) => {
  flattenValues(value, (leaf, pointer) => {
    if (!isInternalPath(leaf)) return;
    output.push({ from: route, to: leaf, source, pointer });
  });
};

const extractRouteMetadata = (route, manifestPage, matchedAppRoute, rootMetadataPresent) => {
  const title = manifestPage?.label ?? manifestPage?.title ?? null;
  const description = manifestPage?.description ?? manifestPage?.intro ?? null;
  const canonicalPath = manifestPage?.path ?? (!route.includes("[") ? route : null);
  const sourceFile = matchedAppRoute?.sourceFile ?? null;
  return {
    title,
    description,
    canonicalUrl: canonicalPath ? `${siteOrigin}${canonicalPath}` : null,
    source: sourceFile ? "app_metadata_or_manifest_inference" : "manifest_inference",
    sourceFile,
    hasRouteMetadataHook: Boolean(sourceFile && metadataSourceByFile.get(sourceFile)?.hasMetadataExport),
    hasRootFallbackMetadata: rootMetadataPresent,
  };
};

const inferSchema = (route, classification, matchedAppRoute) => {
  const schemas = ["Dentist", "LocalBusiness", "WebSite"];
  const sourceFile = matchedAppRoute?.sourceFile ?? null;
  const sourceMetadata = sourceFile ? metadataSourceByFile.get(sourceFile) : null;
  if (classification.routeFamily === "treatment_detail") {
    schemas.push("WebPage", "Service", "BreadcrumbList");
  } else if (route === "/contact") {
    schemas.push("ContactPage");
  } else if (classification.routeFamily === "team_detail") {
    schemas.push("ProfilePage", "Person");
  } else if (classification.routeFamily === "legal") {
    schemas.push("WebPage");
  } else if (classification.publicness === "public") {
    schemas.push("WebPage");
  }
  return {
    discoverable: schemas.length > 0,
    schemaTypes: Array.from(new Set(schemas)),
    sourceFile,
    hasRouteJsonLdScript: Boolean(sourceMetadata?.hasJsonLdScript),
    evidence: sourceMetadata?.hasJsonLdScript
      ? "Route source contains an application/ld+json script; payload is not rendered by this static export."
      : "Inferred from layout.tsx global JSON-LD plus route page JSON-LD patterns; payloads are not rendered by this static export.",
  };
};

const classifyRoute = (route, routeKind, manifestPage) => {
  const lower = route.toLowerCase();
  const isApi = lower.startsWith("/api/");
  const isChampagne = lower.startsWith("/champagne/");
  const isHeroLab = /hero-(asset-lab|debug|lab|preview)/.test(lower);
  const isDebug = isChampagne && /(debug|lab|preview|asset-lab)/.test(lower);
  const isPatientPortal = lower === "/patient-portal";
  const isTreatmentDetail = lower.startsWith("/treatments/") || route === "/treatments/[slug]";
  const isTreatmentHub = lower === "/treatments";
  const isLegal = lower.startsWith("/legal/");
  const isSupport = ["/contact", "/fees", "/finance", "/downloads", "/practice-plan", "/video-consultation"].includes(lower);
  const publicness = isApi || isDebug ? "internal" : isPatientPortal ? "private" : "public";
  let launchState = "public_launch_candidate";
  if (isApi) launchState = "launch_excluded_api";
  else if (isDebug) launchState = "launch_excluded_debug_internal";
  else if (isPatientPortal) launchState = "launch_excluded_private_patient_portal";
  else if (isTreatmentDetail || isTreatmentHub) launchState = "launch_candidate_treatment_review_required";
  else if (isSupport) launchState = "launch_candidate_support_review_required";
  else if (isLegal) launchState = "launch_candidate_legal_review_required";

  return {
    publicness,
    routeFamily: isApi
      ? "api"
      : routeKind === "api_or_route_handler"
        ? "route_handler"
        : isHeroLab
        ? "hero_lab_debug_preview"
        : isDebug
          ? "champagne_debug_internal"
          : isPatientPortal
            ? "patient_portal"
            : isTreatmentDetail
              ? "treatment_detail"
              : isTreatmentHub
                ? "treatment_hub"
                : isLegal
                  ? "legal"
                  : isSupport
                    ? "support"
                    : lower.startsWith("/team/")
                      ? "team_detail"
                      : lower === "/team"
                        ? "team_hub"
                        : manifestPage?.category ?? "public_page",
    launchState,
    excludedFromLaunchIndex: publicness !== "public",
  };
};

const metadataSourceByFile = new Map();

const main = async () => {
  const packageJson = await readJsonOptional("package.json", {});
  const liveRoutes = await readJsonOptional("content-scope/live-pages.json", []);
  const pageIndexTruth = await readJsonOptional("_truth_output/page_index_truth.json", []);
  const pageContentTruth = await readJsonOptional("_truth_output/page_content_truth.json", []);
  const ctaTextTruth = await readJsonOptional("_truth_output/cta_text_truth.json", []);
  const contentReadiness = await readJsonOptional("reports/content_readiness_report.json", null);
  const routeLedger = await readJsonOptional("reports/structure/route-truth-ledger.v1.json", null);
  const manifest = await readJsonOptional("packages/champagne-manifests/data/champagne_machine_manifest_full.json", {});

  const appFiles = (await walkFiles(appDir)).filter((file) => /\.(tsx|ts)$/.test(file));
  for (const file of appFiles) {
    const sourceFile = path.relative(rootDir, file).split(path.sep).join("/");
    const text = await fs.readFile(file, "utf8");
    metadataSourceByFile.set(sourceFile, {
      hasMetadataExport: /export\s+(const\s+metadata|async\s+function\s+generateMetadata|function\s+generateMetadata)/.test(text),
      hasJsonLdScript: /application\/ld\+json/.test(text),
    });
  }

  const appRoutes = appFiles.map(appFileToRoute).filter(Boolean);
  const manifestPages = manifest?.pages ?? {};
  const manifestRoutes = Object.entries(manifestPages)
    .filter(([, page]) => page?.path)
    .map(([pageId, page]) => ({ pageId, page, route: page.path }));
  const manifestByRoute = new Map(manifestRoutes.map((entry) => [entry.route, entry]));

  const appRouteByPattern = new Map(appRoutes.map((entry) => [entry.route, entry]));
  const findMatchingAppRoute = (route) => {
    const exact = appRouteByPattern.get(route);
    if (exact) return exact;
    return appRoutes
      .filter((candidate) => candidate.kind === "page" && routeMatchesPattern(route, candidate.route))
      .sort((a, b) => routeSpecificity(b.route) - routeSpecificity(a.route))[0] ?? null;
  };

  const routeSet = new Set([
    ...appRoutes.map((entry) => entry.route),
    ...manifestRoutes.map((entry) => entry.route),
    ...liveRoutes,
  ]);

  const sitemapExists = await fileExists("apps/web/app/sitemap.ts");
  const robotsExists = await fileExists("apps/web/app/robots.ts");
  const sitemapText = await readTextOptional("apps/web/app/sitemap.ts");
  const robotsText = await readTextOptional("apps/web/app/robots.ts");
  const layoutText = await readText("apps/web/app/layout.tsx");
  const rootMetadataPresent = /export\s+const\s+metadata/.test(layoutText);

  const internalLinks = [];
  const faqBlocks = [];
  const ctaMap = [];
  const mediaInventory = [];

  const routeInventory = Array.from(routeSet)
    .sort((a, b) => a.localeCompare(b))
    .map((route) => {
      const manifestEntry = manifestByRoute.get(route);
      const matchedAppRoute = findMatchingAppRoute(route);
      const appRoute = appRouteByPattern.get(route);
      const routeKind = appRoute?.kind ?? matchedAppRoute?.kind ?? "manifest_or_truth_route";
      const classification = classifyRoute(route, routeKind, manifestEntry?.page);
      const pageTruthFile = route === "/" ? "page-truth/home.txt" : `page-truth/${route.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-")}.txt`;

      if (manifestEntry?.page) {
        collectInternalLinksFromValue(manifestEntry.page, route, "machine_manifest_page", internalLinks);
        const sections = Array.isArray(manifestEntry.page.sections) ? manifestEntry.page.sections : [];
        for (const [index, section] of sections.entries()) {
          if (section?.type?.toLowerCase().includes("faq") || Array.isArray(section?.faqs)) {
            faqBlocks.push({
              route,
              sectionId: section.id ?? null,
              sectionType: section.type ?? null,
              questionCount: Array.isArray(section.faqs) ? section.faqs.length : null,
              source: "machine_manifest_page.sections",
            });
          }
          const ctas = section?.ctas ?? section?.buttons ?? section?.actions;
          if (ctas) ctaMap.push({ route, source: `section:${section.id ?? index}`, ctas });
          const media = section?.media ?? section?.image ?? section?.images ?? section?.mediaHint ?? null;
          if (media) {
            mediaInventory.push({
              route,
              sectionId: section.id ?? null,
              sectionType: section.type ?? null,
              media,
            });
          }
        }
        if (manifestEntry.page.ctas) ctaMap.push({ route, source: "page.ctas", ctas: manifestEntry.page.ctas });
      }

      return {
        route,
        appRoutePattern: matchedAppRoute?.route ?? null,
        sourceFiles: Array.from(
          new Set([
            appRoute?.sourceFile,
            matchedAppRoute?.sourceFile,
            manifestEntry ? "packages/champagne-manifests/data/champagne_machine_manifest_full.json" : null,
          ].filter(Boolean)),
        ),
        routeKind,
        dynamic: Boolean(appRoute?.dynamic ?? matchedAppRoute?.dynamic),
        inLivePages: liveRoutes.includes(route),
        inMachineManifest: Boolean(manifestEntry),
        pageId: manifestEntry?.pageId ?? null,
        classification,
        metadata: extractRouteMetadata(route, manifestEntry?.page, matchedAppRoute, rootMetadataPresent),
        schema: inferSchema(route, classification, matchedAppRoute),
        pageTruth: {
          file: pageTruthFile,
          exists: false,
          pageContentTruthEntries: pageContentTruth.filter((entry) => entry.route === route).length,
        },
        contentReadiness: contentReadiness?.pages?.find((entry) => entry.route === route) ?? null,
      };
    });

  for (const route of routeInventory) {
    route.pageTruth.exists = await fileExists(route.pageTruth.file);
  }

  const sitemapPublicRoutes = routeInventory.filter((entry) => entry.classification.publicness === "public" && !entry.route.includes("[")).map((entry) => entry.route);
  const sitemapHasLastModified = /lastModified/.test(sitemapText);
  const sitemapHasChangeFrequency = /changeFrequency/.test(sitemapText);
  const sitemapHasPriority = /priority/.test(sitemapText);
  const sitemapExcludedPrefixes = ["/champagne/", "/api/"].filter((prefix) => sitemapText.includes(prefix));
  const sitemapExcludedPaths = ["/patient-portal"].filter((excludedPath) => sitemapText.includes(excludedPath));
  const sitemapEnriched = sitemapExists && sitemapHasChangeFrequency && sitemapHasPriority && sitemapExcludedPrefixes.length === 2 && sitemapExcludedPaths.length === 1;
  const sitemapStatus = {
    exists: sitemapExists,
    sourceFile: sitemapExists ? "apps/web/app/sitemap.ts" : null,
    productionOrigin: siteOrigin,
    excludesPrefixes: sitemapExcludedPrefixes,
    excludesPaths: sitemapExcludedPaths,
    inferredPublicRouteCount: sitemapPublicRoutes.length,
    hasLastModified: sitemapHasLastModified,
    hasChangeFrequency: sitemapHasChangeFrequency,
    hasPriority: sitemapHasPriority,
    enriched: sitemapEnriched,
    weakness: sitemapEnriched ? null : "Sitemap export is missing one or more launch SEO fields or private-route exclusions.",
  };

  const robotsExplicitDisallows = ["/champagne/", "/api/", "/patient-portal"].filter((excludedPath) => robotsText.includes(excludedPath));
  const robotsStatus = {
    exists: robotsExists,
    sourceFile: robotsExists ? "apps/web/app/robots.ts" : null,
    productionAllowsRoot: robotsExists && /allow:\s*["']\/["']/.test(robotsText),
    productionExplicitDisallows: robotsExplicitDisallows,
    nonProductionDisallowsAll: robotsExists && /disallow:\s*["']\/["']/.test(robotsText),
    sitemapAdvertised: robotsExists && robotsText.includes("sitemap.xml") ? `${siteOrigin}/sitemap.xml` : null,
    hardened: robotsExists && robotsExplicitDisallows.length === 3 && robotsText.includes("process.env.VERCEL_ENV === \"production\"") && robotsText.includes("sitemap.xml"),
    weakness: robotsExists && robotsExplicitDisallows.length === 3 ? null : "Production robots does not explicitly disallow all internal/private launch-excluded paths.",
  };

  const treatmentManifestInventory = manifestRoutes
    .filter(({ route }) => route === "/treatments" || route.startsWith("/treatments/"))
    .map(({ pageId, page, route }) => ({
      route,
      pageId,
      label: page.label ?? null,
      category: page.category ?? null,
      hero: page.hero ?? null,
      heroBinding: page.heroBinding ?? null,
      sectionCount: Array.isArray(page.sections) ? page.sections.length : null,
      surface: page.surface ?? null,
    }));

  const pageTextInventory = {
    pageTruthFiles: (await fs.readdir(path.join(rootDir, "page-truth")).catch(() => [])).filter((name) => name.endsWith(".txt")).length,
    pageContentTruthEntries: pageContentTruth.length,
    pageIndexTruthEntries: pageIndexTruth.length,
    missingPageTruthRoutes: routeInventory
      .filter((entry) => entry.inLivePages && !entry.pageTruth.exists)
      .map((entry) => entry.route),
  };

  const buildGuardStatusSummary = {
    scriptsPresent: {
      "guard:hero": Boolean(packageJson?.scripts?.["guard:hero"]),
      "guard:canon": Boolean(packageJson?.scripts?.["guard:canon"]),
      verify: Boolean(packageJson?.scripts?.verify),
      "export:page-truth": Boolean(packageJson?.scripts?.["export:page-truth"]),
      "export:website-truth": Boolean(packageJson?.scripts?.["export:website-truth"]),
    },
    availableReports: [],
  };
  for (const relativePath of [
    "reports/content_readiness_report.json",
    "reports/structure/route-truth-ledger.v1.json",
    "reports/RESOLVED_TRUTH.json",
    "reports/MANIFEST_TRUTH.json",
  ]) {
    if (await fileExists(relativePath)) buildGuardStatusSummary.availableReports.push(relativePath);
  }

  const readinessSummary = contentReadiness?.summary ?? null;
  const blockers = [];
  const addBlocker = (code, severity, message, evidence) => blockers.push({ code, severity, message, evidence });
  addBlocker("NO_CLEAN_LAUNCH_ASSERTION", "info", "This export is an evidence layer only and does not certify clean launch readiness.", null);
  if (!sitemapExists) addBlocker("SITEMAP_MISSING", "critical", "Sitemap file was not discovered.", "apps/web/app/sitemap.ts");
  else if (!sitemapStatus.enriched) addBlocker("SITEMAP_WEAK_METADATA", "warning", sitemapStatus.weakness, sitemapStatus.sourceFile);
  if (!robotsExists) addBlocker("ROBOTS_MISSING", "critical", "Robots file was not discovered.", "apps/web/app/robots.ts");
  else if (!robotsStatus.hardened) addBlocker("ROBOTS_WEAK_EXCLUSIONS", "warning", robotsStatus.weakness, robotsStatus.sourceFile);
  if (!rootMetadataPresent) addBlocker("ROOT_METADATA_MISSING", "critical", "Root metadata export was not discovered.", "apps/web/app/layout.tsx");
  const legalWeak = routeInventory.filter(
    (entry) =>
      entry.classification.routeFamily === "legal" &&
      !entry.route.includes("[") &&
      (!entry.metadata.hasRouteMetadataHook || !entry.metadata.canonicalUrl || !entry.schema.hasRouteJsonLdScript),
  );
  if (legalWeak.length > 0) {
    addBlocker("LEGAL_METADATA_WEAK", "warning", "Legal routes are present but route-specific metadata/canonical/schema was not discovered consistently.", legalWeak.map((entry) => ({ route: entry.route, metadata: entry.metadata, schema: entry.schema })));
  }
  const privateRoutes = routeInventory.filter((entry) => entry.classification.publicness !== "public");
  if (privateRoutes.length > 0) {
    addBlocker("LAUNCH_EXCLUDED_ROUTES_PRESENT", "info", "Debug/internal/API/private routes are present and must stay launch-excluded.", privateRoutes.map((entry) => ({ route: entry.route, state: entry.classification.launchState })));
  }
  if (readinessSummary?.REWRITE || readinessSummary?.POLISH) {
    addBlocker("CONTENT_READINESS_NOT_GREEN", "warning", "Content readiness report contains POLISH/REWRITE routes.", readinessSummary);
  }
  const missingTruth = pageTextInventory.missingPageTruthRoutes;
  if (missingTruth.length > 0) {
    addBlocker("PAGE_TRUTH_MISSING_FOR_LIVE_ROUTES", "warning", "Some live routes do not have page-truth text exports.", missingTruth);
  }

  const report = {
    version: "WEBSITE_TRUTH_EXPORT_REPORT_V1",
    generatedAt,
    contract: {
      file: "ops/contracts/WEBSITE_TRUTH_EXPORT_CONTRACT_V1.json",
      version: "CHAMPAGNE_WEBSITE_TRUTH_EXPORT_CONTRACT_V1",
    },
    sourceFingerprint: hashValue({
      liveRoutes,
      manifestStatus: manifest?.status,
      manifestVersion: manifest?.version,
      appRouteCount: appRoutes.length,
    }),
    routeInventory,
    routeClassificationSummary: routeInventory.reduce((acc, entry) => {
      acc[entry.classification.launchState] = (acc[entry.classification.launchState] ?? 0) + 1;
      return acc;
    }, {}),
    sitemapStatus,
    robotsStatus,
    treatmentManifestInventory,
    pageTextInventory,
    internalLinkInventory: {
      count: internalLinks.length,
      links: internalLinks,
    },
    faqBlockInventory: {
      count: faqBlocks.length,
      blocks: faqBlocks,
    },
    ctaMap: {
      manifestEntries: ctaMap.length,
      ctaTextTruthEntries: ctaTextTruth.length,
      entries: ctaMap,
    },
    imageMediaMetadata: {
      count: mediaInventory.length,
      entries: mediaInventory,
    },
    buildGuardStatusSummary,
    contentFreshnessReviewMetadata: {
      contentReadinessSummary: readinessSummary,
      routeLedgerGeneratedAt: routeLedger?.generatedAt ?? null,
      manifestReportGeneratedAt: (await readJsonOptional("reports/MANIFESTS_REPORT.json", null))?.generatedAt ?? null,
    },
    launchBlockersDetected: blockers,
    readyForLaunch: false,
    readyForPrReview: blockers.every((blocker) => blocker.severity !== "critical"),
  };

  const contract = {
    version: "CHAMPAGNE_WEBSITE_TRUTH_EXPORT_CONTRACT_V1",
    generatedAt,
    purpose: "Champagne-side static website truth export contract for the frontier dominance agent repo.",
    producer: {
      repo: "drnickmaxwell-wq/champagne",
      script: "scripts/export-website-truth.mjs",
      report: "reports/WEBSITE_TRUTH_EXPORT_REPORT_V1.json",
    },
    requiredReportFile: "reports/WEBSITE_TRUTH_EXPORT_REPORT_V1.json",
    requiredFields: [
      "routeInventory",
      "public/private/debug/internal/API route classification",
      "metadata per route where discoverable",
      "canonical URL per route where discoverable",
      "schema emitted per route where discoverable",
      "sitemap status",
      "robots status",
      "treatment manifest inventory",
      "page text/page truth inventory",
      "internal link inventory if discoverable",
      "FAQ block inventory if discoverable",
      "CTA map if discoverable",
      "image/media metadata if discoverable",
      "build/guard status summary if available from reports",
      "content freshness/review metadata if present",
      "launch blockers detected",
    ],
    routeClassificationStates: [
      "public_launch_candidate",
      "launch_candidate_treatment_review_required",
      "launch_candidate_support_review_required",
      "launch_candidate_legal_review_required",
      "launch_excluded_debug_internal",
      "launch_excluded_api",
      "launch_excluded_private_patient_portal",
    ],
    launchSafetyRules: {
      neverClaimCleanLaunch: true,
      classifyAsLaunchExcluded: ["/champagne/*", "/api/*", "/patient-portal", "hero labs/debug/preview routes"],
      classifyAsReviewRequired: ["treatment pages", "support pages", "legal pages if present"],
      blockersRequiredWhenWeakOrMissing: ["sitemap", "robots", "root metadata", "support metadata", "legal metadata"],
    },
    reportShape: {
      version: "string",
      generatedAt: "ISO-8601 string",
      routeInventory: "array of per-route evidence objects",
      sitemapStatus: "object",
      robotsStatus: "object",
      treatmentManifestInventory: "array",
      pageTextInventory: "object",
      launchBlockersDetected: "array",
      readyForLaunch: "boolean; expected false unless a separate launch audit proves otherwise",
      readyForPrReview: "boolean based on export generation completeness, not launch readiness",
    },
  };

  await writeJson("ops/contracts/WEBSITE_TRUTH_EXPORT_CONTRACT_V1.json", contract);
  await writeJson("reports/WEBSITE_TRUTH_EXPORT_REPORT_V1.json", report);

  console.log(`[export-website-truth] wrote ops/contracts/WEBSITE_TRUTH_EXPORT_CONTRACT_V1.json`);
  console.log(`[export-website-truth] wrote reports/WEBSITE_TRUTH_EXPORT_REPORT_V1.json`);
  console.log(`[export-website-truth] routes=${routeInventory.length} blockers=${blockers.length} readyForPrReview=${report.readyForPrReview}`);
};

main().catch((error) => {
  console.error("[export-website-truth] failed", error);
  process.exit(1);
});
