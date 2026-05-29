import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const ROBOTS_PATH = path.join(ROOT, "apps/web/app/robots.ts");
const SITEMAP_PATH = path.join(ROOT, "apps/web/app/sitemap.ts");
const TREATMENT_INVENTORY_PATH = path.join(ROOT, "REPORTS/TREATMENT_INVENTORY.md");

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

const routeRegex = /\|\s*[^|]+\s*\|\s*[^|]+\s*\|\s*(\/treatments\/[a-z0-9-]+)\s*\|/g;
const treatmentRoutes = new Set();
let match;
while ((match = routeRegex.exec(inventory)) !== null) {
  treatmentRoutes.add(match[1]);
}
if (treatmentRoutes.size < 50) {
  fail("Treatment inventory route extraction found unexpectedly few treatment routes", { count: treatmentRoutes.size });
}
pass(`treatment inventory exposes ${treatmentRoutes.size} treatment routes for SEO coverage review`);

const missingLayoutLine = inventory.match(/Treatments missing section layout: (.+)/);
if (missingLayoutLine) {
  const missingRoutes = missingLayoutLine[1]
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (missingRoutes.length > 0) {
    console.log("SEO_LAUNCH_SAFETY_WARN: Treatment routes missing section layouts; review before launch:");
    for (const route of missingRoutes) console.log(`- ${route}`);
  }
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

if (!inventory.includes("Total treatments: 73")) {
  console.log("SEO_LAUNCH_SAFETY_WARN: Treatment inventory total has changed from the last audited value of 73. Re-run SEO truth audit.");
}

console.log("SEO_LAUNCH_SAFETY_COMPLETE");
