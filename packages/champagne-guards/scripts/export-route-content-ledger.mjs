#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");
process.chdir(repoRoot);

const DEFAULT_OUTPUT = "reports/content/route-content-ledger.v1.json";
const MACHINE_MANIFEST_PATH =
  "packages/champagne-manifests/data/champagne_machine_manifest_full.json";

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) {
    return null;
  }
  return args[index + 1] ?? null;
};

const routeArg = getArgValue("--route");
const includeAll = hasFlag("--all");
const outPath = getArgValue("--out") ?? DEFAULT_OUTPUT;

if (!includeAll && !routeArg) {
  console.error("❌ Missing required flag: --route \"/path\" or --all");
  process.exit(1);
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function escapeJsonPointer(segment) {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}

const skipKeys = new Set([
  "id",
  "instanceId",
  "type",
  "variant",
  "layout",
  "icon",
  "asset",
  "src",
  "alt",
  "href",
  "to",
  "path",
  "slug",
  "route",
  "routeId",
  "token",
  "tokens",
  "theme",
  "className"
]);

function collectEntries(value, context) {
  const { route, sectionJsonPath, jsonPointer, keyPath, entries } = context;

  if (typeof value === "string") {
    if (value.trim().length === 0) {
      return;
    }
    const hash = crypto.createHash("sha256").update(value, "utf8").digest("hex");
    entries.push({
      route,
      sectionJsonPath,
      jsonPointer,
      keyPath,
      currentText: value,
      fingerprint: {
        charCount: value.length,
        startsWith: value.slice(0, 25),
        endsWith: value.slice(-25),
        sha256: hash
      }
    });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      collectEntries(entry, {
        route,
        sectionJsonPath,
        jsonPointer: `${jsonPointer}/${index}`,
        keyPath: `${keyPath}[${index}]`,
        entries
      });
    });
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, entry]) => {
      if (skipKeys.has(key)) {
        return;
      }
      const escapedKey = escapeJsonPointer(key);
      collectEntries(entry, {
        route,
        sectionJsonPath,
        jsonPointer: `${jsonPointer}/${escapedKey}`,
        keyPath: `${keyPath}.${key}`,
        entries
      });
    });
  }
}

function ensureFileExists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing ${label}: ${filePath}`);
    process.exit(1);
  }
}

ensureFileExists(MACHINE_MANIFEST_PATH, "machine manifest");

let machineManifest;
try {
  machineManifest = readJson(MACHINE_MANIFEST_PATH);
} catch (error) {
  console.error(`❌ Failed to read machine manifest: ${error.message}`);
  process.exit(1);
}

const pages = Object.values(machineManifest.pages || {}).filter((page) => {
  return typeof page?.path === "string";
});

const requestedRoute = routeArg ? normalizeSlug(routeArg) : null;
if (routeArg && !requestedRoute) {
  console.error(`❌ Invalid route provided: "${routeArg}"`);
  process.exit(1);
}

let selectedPages = pages;
if (requestedRoute) {
  selectedPages = pages.filter((page) => normalizeSlug(page?.path) === requestedRoute);
  if (!selectedPages.length) {
    console.error(`❌ Route not found in machine manifest: ${requestedRoute}`);
    process.exit(1);
  }
} else {
  selectedPages = pages.filter((page) => Array.isArray(page?.sectionJsonPaths));
}

const routesPayload = selectedPages
  .map((page) => {
    const normalizedRoute = normalizeSlug(page.path);
    if (!normalizedRoute) {
      return null;
    }
    const sectionJsonPaths = Array.isArray(page.sectionJsonPaths) ? page.sectionJsonPaths : [];
    if (!Array.isArray(page.sectionJsonPaths)) {
      console.warn(
        `⚠️ No sectionJsonPaths array for route ${normalizedRoute}; emitting empty entries.`
      );
    }
    const entries = [];

    sectionJsonPaths.forEach((sectionJsonPath) => {
      if (typeof sectionJsonPath !== "string") {
        return;
      }
      const absolutePath = path.resolve(repoRoot, sectionJsonPath);
      ensureFileExists(absolutePath, `section JSON for ${normalizedRoute}`);
      let sectionJson;
      try {
        sectionJson = readJson(absolutePath);
      } catch (error) {
        console.error(`❌ Failed to parse JSON: ${sectionJsonPath}\n${error.message}`);
        process.exit(1);
      }
      collectEntries(sectionJson, {
        route: normalizedRoute,
        sectionJsonPath,
        jsonPointer: "",
        keyPath: "$",
        entries
      });
    });

    entries.sort((a, b) => {
      if (a.route !== b.route) {
        return a.route.localeCompare(b.route);
      }
      if (a.sectionJsonPath !== b.sectionJsonPath) {
        return a.sectionJsonPath.localeCompare(b.sectionJsonPath);
      }
      return a.jsonPointer.localeCompare(b.jsonPointer);
    });

    return {
      route: normalizedRoute,
      sectionJsonPaths,
      entries
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.route.localeCompare(b.route));

const output = {
  schema: "CHAMPAGNE_ROUTE_CONTENT_LEDGER_V1",
  generatedAt: new Date().toISOString(),
  routes: routesPayload
};

const outputDir = path.dirname(outPath);
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

console.log(`✅ Content ledger written to ${outPath}`);
