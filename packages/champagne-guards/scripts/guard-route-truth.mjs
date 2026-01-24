#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");
process.chdir(repoRoot);

const filePaths = {
  ledger: "reports/structure/route-truth-ledger.v1.json",
  machineManifest: "packages/champagne-manifests/data/champagne_machine_manifest_full.json",
  brandManifest: "packages/champagne-manifests/data/manifest.public.brand.json",
  treatmentJourneys: "packages/champagne-manifests/data/sections/smh/treatment_journeys.json"
};

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeSlug(rawSlug) {
  if (typeof rawSlug !== "string") {
    return null;
  }
  let slug = rawSlug.trim();
  if (!slug) {
    return null;
  }
  if (!slug.startsWith("/")) {
    slug = `/${slug}`;
  }
  if (slug.length > 1) {
    slug = slug.replace(/\/+$/, "");
  }
  return slug;
}

function pathToRouteId(slug) {
  if (slug === "/") {
    return "";
  }
  return slug.replace(/^\/+/, "").replace(/\/+/g, ".");
}

function resolveRedirectRules(ledger) {
  if (Array.isArray(ledger.redirects)) {
    return ledger.redirects;
  }
  if (Array.isArray(ledger.redirectRules)) {
    return ledger.redirectRules;
  }
  if (Array.isArray(ledger.redirect_rules)) {
    return ledger.redirect_rules;
  }
  if (ledger.redirects && Array.isArray(ledger.redirects.rules)) {
    return ledger.redirects.rules;
  }
  if (ledger.redirects || ledger.redirectRules || ledger.redirect_rules) {
    throw new Error("Ledger redirect rules are not in an expected array format.");
  }
  return [];
}

const missingFiles = Object.entries(filePaths)
  .filter(([, value]) => !fs.existsSync(value))
  .map(([key, value]) => `${key}: ${value}`);

if (missingFiles.length) {
  console.error(`❌ Route truth guard failed: missing required files:\n${missingFiles.join("\n")}`);
  process.exit(1);
}

const ledger = readJSON(filePaths.ledger);
const machineManifest = readJSON(filePaths.machineManifest);
const brandManifest = readJSON(filePaths.brandManifest);
const treatmentJourneys = readJSON(filePaths.treatmentJourneys);

let redirectRules = [];
try {
  redirectRules = resolveRedirectRules(ledger);
} catch (error) {
  console.error(`❌ Route truth guard failed: ${error.message}`);
  process.exit(1);
}

const machinePaths = new Set(
  Object.values(machineManifest.pages || {})
    .map((page) => normalizeSlug(page?.path))
    .filter(Boolean)
);

const brandSlugs = new Set(
  (brandManifest.pages || [])
    .map((page) => normalizeSlug(page?.slug))
    .filter(Boolean)
);

const treatmentRouteIds = new Set(
  (treatmentJourneys.treatments || [])
    .map((entry) => entry?.routeId)
    .filter(Boolean)
);

const errors = [];

redirectRules.forEach((rule, index) => {
  const fromRaw = rule?.from ?? rule?.fromPath ?? rule?.source ?? rule?.legacy;
  const toRaw = rule?.to ?? rule?.toPath ?? rule?.destination ?? rule?.target;
  const fromSlug = normalizeSlug(fromRaw);
  const toSlug = normalizeSlug(toRaw);

  if (!fromSlug) {
    errors.push(`❌ Redirect rule ${index + 1} is missing a valid FROM path.`);
    return;
  }

  if (!toSlug) {
    errors.push(`❌ Redirect rule ${index + 1} (${fromSlug}) is missing a valid TO path.`);
    return;
  }

  const routeDir = path.join("apps/web/app", fromSlug === "/" ? "" : fromSlug.replace(/^\/+/, ""));
  const routeTs = path.join(routeDir, "route.ts");
  const routeJs = path.join(routeDir, "route.js");

  if (!fs.existsSync(routeTs) && !fs.existsSync(routeJs)) {
    errors.push(
      `❌ Missing App Router route handler for FROM "${fromSlug}": expected ${routeTs} or ${routeJs}.`
    );
  }

  if (!machinePaths.has(toSlug)) {
    errors.push(`❌ TO path "${toSlug}" is not present in machine manifest pages.`);
  }

  if (brandSlugs.has(fromSlug)) {
    errors.push(`❌ Public brand manifest still contains FROM slug "${fromSlug}".`);
  }

  if (!brandSlugs.has(toSlug)) {
    errors.push(`❌ Public brand manifest is missing TO slug "${toSlug}".`);
  }

  const fromRouteId = pathToRouteId(fromSlug);
  if (fromRouteId && treatmentRouteIds.has(fromRouteId)) {
    errors.push(`❌ Treatment journeys still reference FROM slug "${fromSlug}" (${fromRouteId}).`);
  }

  const legacySlugs = Array.isArray(rule?.legacySlugs)
    ? rule.legacySlugs
    : Array.isArray(rule?.legacy_slugs)
    ? rule.legacy_slugs
    : Array.isArray(rule?.legacyPaths)
    ? rule.legacyPaths
    : Array.isArray(rule?.legacy)
    ? rule.legacy
    : [];

  legacySlugs.forEach((legacyRaw) => {
    const legacySlug = normalizeSlug(legacyRaw);
    if (!legacySlug) {
      return;
    }
    const legacyRouteId = pathToRouteId(legacySlug);
    if (legacyRouteId && treatmentRouteIds.has(legacyRouteId)) {
      errors.push(
        `❌ Treatment journeys still reference legacy slug "${legacySlug}" (${legacyRouteId}).`
      );
    }
  });
});

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("✅ Route truth guard passed.");
process.exit(0);
