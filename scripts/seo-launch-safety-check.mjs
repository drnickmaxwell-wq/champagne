import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const ROBOTS_PATH = path.join(ROOT, "apps/web/app/robots.ts");
const SITEMAP_PATH = path.join(ROOT, "apps/web/app/sitemap.ts");
const TREATMENT_INVENTORY_PATH = path.join(ROOT, "REPORTS/TREATMENT_INVENTORY.md");
const MACHINE_MANIFEST_PATH = path.join(ROOT, "packages/champagne-manifests/data/champagne_machine_manifest_full.json");
const MANIFEST_CORE_PATH = path.join(ROOT, "packages/champagne-manifests/src/core.ts");

const fail = (message, details = undefined) => {
  console.error(`SEO_LAUNCH_SAFETY_FAIL: ${message}`);
  if (details !== undefined) console.error(JSON.stringify(details, null, 2));
  process.exit(1);
};

const pass = (message) => console.log(`SEO_LAUNCH_SAFETY_PASS: ${message}`);

const read = (filePath) => {
  if (!fs.existsSync(filePath)) fail(`Missing required file: ${path.relative(ROOT, filePath)}`);
  return fs.readFileSync(filePath, "utf8");
};

const readJson = (filePath) => {
  try {
    return JSON.parse(read(filePath));
  } catch (error) {
    fail(`Could not parse JSON file: ${path.relative(ROOT, filePath)}`, {
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

const normalizeSlug = (slug) => {
  if (!slug) return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
};

const getRouteIdFromSlug = (slug) => {
  const normalized = normalizeSlug(slug).replace(/^\//, "").replace(/\/$/, "");
  if (!normalized) return "home";
  return normalized.replace(/\//g, ".");
};

const getTreatmentRoutesFromMachineManifest = () => {
  const machineManifest = readJson(MACHINE_MANIFEST_PATH);
  const byRoute = new Map();

  for (const collection of [machineManifest.pages ?? {}, machineManifest.treatments ?? {}]) {
    for (const entry of Object.values(collection)) {
      if (!entry?.path?.startsWith("/treatments/")) continue;
      if (!byRoute.has(entry.path)) byRoute.set(entry.path, entry);
    }
  }

  return [...byRoute.keys()].sort((a, b) => a.localeCompare(b));
};

const getRegisteredTreatmentSectionLayouts = () => {
  const manifestCoreSource = read(MANIFEST_CORE_PATH);
  const importByVariable = new Map();
  const importRegex = /import\s+(sectionLayout\w+)\s+from\s+"(\.\.\/data\/sections\/smh\/treatments\.[^"]+\.json)";/g;
  let importMatch;

  while ((importMatch = importRegex.exec(manifestCoreSource)) !== null) {
    const [, variableName, importPath] = importMatch;
    importByVariable.set(variableName, path.join(ROOT, "packages/champagne-manifests", importPath.replace(/^\.\.\//, "")));
  }

  const layoutArrayMatch = manifestCoreSource.match(/export const champagneSectionLayouts:[\s\S]*?= \[([\s\S]*?)\];/);
  if (!layoutArrayMatch) fail("Could not locate champagneSectionLayouts registry in packages/champagne-manifests/src/core.ts");

  const layouts = new Map();
  const registeredVariableRegex = /(sectionLayout\w+)\s+as ChampagneSectionLayout/g;
  let registeredMatch;
  while ((registeredMatch = registeredVariableRegex.exec(layoutArrayMatch[1])) !== null) {
    const variableName = registeredMatch[1];
    const layoutPath = importByVariable.get(variableName);
    if (!layoutPath) continue;

    const layout = readJson(layoutPath);
    if (!layout?.routeId?.startsWith("treatments.")) continue;
    layouts.set(layout.routeId, {
      file: path.relative(ROOT, layoutPath),
      sectionCount: Array.isArray(layout.sections) ? layout.sections.length : 0,
    });
  }

  return layouts;
};

const robots = read(ROBOTS_PATH);
const sitemap = read(SITEMAP_PATH);
const inventory = read(TREATMENT_INVENTORY_PATH);

if (!robots.includes(CANONICAL_ORIGIN)) fail("robots.ts does not use the production canonical origin");
if (!robots.includes("process.env.VERCEL_ENV === \"production\"")) {
  fail("robots.ts must only allow indexing for Vercel production");
}
if (!robots.includes("disallow: \"/\"")) fail("robots.ts must disallow non-production indexing");
for (const required of ["/champagne/", "/api/", "/patient-portal"]) {
  if (!robots.includes(required)) fail(`robots.ts does not explicitly disallow ${required}`);
}
if (!robots.includes("sitemap.xml")) fail("robots.ts must advertise sitemap.xml");
pass("robots.ts production/non-production indexing posture and private-path disallows look safe");

if (!sitemap.includes(CANONICAL_ORIGIN)) fail("sitemap.ts does not use the production canonical origin");
for (const required of ["/champagne/", "/api/", "/patient-portal"]) {
  if (!sitemap.includes(required)) fail(`sitemap.ts does not explicitly exclude ${required}`);
}
if (!sitemap.includes("getAllPages()")) fail("sitemap.ts must be generated from the canonical page manifest");
for (const required of ["changeFrequency", "priority", "lastModified"]) {
  if (!sitemap.includes(required)) fail(`sitemap.ts does not include ${required} enrichment`);
}
pass("sitemap.ts canonical origin, manifest source, enrichment fields, and private-path exclusions look safe");

const legalRouteFiles = [
  "apps/web/app/(champagne)/legal/privacy/page.tsx",
  "apps/web/app/(champagne)/legal/[slug]/page.tsx",
];
for (const relativePath of legalRouteFiles) {
  const legalSource = read(path.join(ROOT, relativePath));
  if (!legalSource.includes("Metadata")) fail(`${relativePath} does not expose route metadata`);
  if (!legalSource.includes("canonical")) fail(`${relativePath} does not expose canonical metadata`);
  if (!legalSource.includes("application/ld+json")) fail(`${relativePath} does not emit JSON-LD schema`);
}
pass("legal routes expose metadata, canonical, and JSON-LD schema evidence");

const treatmentRoutes = new Set(getTreatmentRoutesFromMachineManifest());
if (treatmentRoutes.size < 50) {
  fail("Treatment manifest route extraction found unexpectedly few treatment routes", { count: treatmentRoutes.size });
}
pass(`machine manifest exposes ${treatmentRoutes.size} treatment routes for SEO coverage review`);

const registeredTreatmentLayouts = getRegisteredTreatmentSectionLayouts();
const missingLayoutRoutes = [...treatmentRoutes].filter((route) => !registeredTreatmentLayouts.has(getRouteIdFromSlug(route)));
if (missingLayoutRoutes.length > 0) {
  console.log("SEO_LAUNCH_SAFETY_WARN: Treatment routes missing registered section layouts; review before launch:");
  for (const route of missingLayoutRoutes) console.log(`- ${route}`);
} else {
  pass(`all ${treatmentRoutes.size} treatment routes have registered section layouts`);
}

const cannibalisationClusters = [
  {
    cluster: "implants",
    routes: [...treatmentRoutes].filter((route) => route.includes("implant") || route.includes("teeth-in-a-day") || route.includes("sinus-lift"))
  },
  {
    cluster: "cosmetic",
    routes: [...treatmentRoutes].filter((route) => /veneers|bonding|whitening|smile/.test(route))
  },
  {
    cluster: "orthodontics",
    routes: [...treatmentRoutes].filter((route) => /aligners|braces|orthodontics|retainers/.test(route))
  },
  {
    cluster: "emergency",
    routes: [...treatmentRoutes].filter((route) => /emergency|toothache|abscess|trauma|knocked-out|broken|lost-crowns/.test(route))
  }
];

console.log("SEO_LAUNCH_SAFETY_INFO: High-risk cannibalisation clusters to audit for one-intent-per-page:");
for (const cluster of cannibalisationClusters) {
  console.log(`- ${cluster.cluster}: ${cluster.routes.length} route(s)`);
  for (const route of cluster.routes.slice(0, 20)) console.log(`  - ${route}`);
}

const inventoryTotalMatch = inventory.match(/Total treatments:\s*(\d+)/);
const inventoryTotal = inventoryTotalMatch ? Number(inventoryTotalMatch[1]) : undefined;
if (inventoryTotal !== treatmentRoutes.size) {
  console.log("SEO_LAUNCH_SAFETY_WARN: Treatment inventory total does not match live machine manifest. Refresh REPORTS/TREATMENT_INVENTORY.md.");
  console.log(`- inventory: ${inventoryTotal ?? "unknown"}`);
  console.log(`- machine manifest: ${treatmentRoutes.size}`);
}

console.log("SEO_LAUNCH_SAFETY_COMPLETE");
