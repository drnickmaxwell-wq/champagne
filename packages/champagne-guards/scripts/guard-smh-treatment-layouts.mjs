import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "..", "..");
const manifestPath = path.join(
  repoRoot,
  "packages",
  "champagne-manifests",
  "data",
  "champagne_machine_manifest_full.json"
);
const corePath = path.join(repoRoot, "packages", "champagne-manifests", "src", "core.ts");

const manifestRaw = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestRaw);
const pages = manifest.pages ?? {};
const treatmentPages = Object.values(pages).filter(
  (page) => typeof page?.path === "string" && page.path.startsWith("/treatments/")
);
const treatmentSlugs = treatmentPages
  .map((page) => page.path.slice("/treatments/".length))
  .filter(Boolean);

const coreContents = fs.readFileSync(corePath, "utf8");
const importRegex =
  /import\s+(\w+)\s+from\s+["']\.\.\/data\/sections\/smh\/treatments\.([^"']+)\.json["'];/g;
const importsBySlug = new Map();
let importMatch = null;

while ((importMatch = importRegex.exec(coreContents)) !== null) {
  const identifier = importMatch[1];
  const slug = importMatch[2];
  if (!importsBySlug.has(slug)) {
    importsBySlug.set(slug, new Set());
  }
  importsBySlug.get(slug).add(identifier);
}

const layoutsMatch = coreContents.match(
  /export\s+const\s+champagneSectionLayouts:[\s\S]*?=\s*\[([\s\S]*?)\];/m
);

if (!layoutsMatch) {
  console.error("SMH treatment layout guard failed: champagneSectionLayouts array not found.");
  process.exit(1);
}

const layoutBody = layoutsMatch[1];
const layoutIdentifiers = new Set();
const layoutEntryRegex = /\b([A-Za-z0-9_]+)\b\s+as\s+ChampagneSectionLayout/g;
let layoutMatch = null;

while ((layoutMatch = layoutEntryRegex.exec(layoutBody)) !== null) {
  layoutIdentifiers.add(layoutMatch[1]);
}

const missing = [];

for (const slug of treatmentSlugs) {
  const issues = [];
  const importSet = importsBySlug.get(slug);

  if (!importSet) {
    issues.push("missing import in core.ts");
  } else {
    const hasLayoutEntry = Array.from(importSet).some((identifier) =>
      layoutIdentifiers.has(identifier)
    );

    if (!hasLayoutEntry) {
      issues.push("imported identifier not present in champagneSectionLayouts");
    }
  }

  if (issues.length > 0) {
    missing.push({ slug, issues });
  }
}

if (missing.length > 0) {
  console.error("SMH treatment layout guard failed. Missing or unwired slugs:");
  for (const entry of missing) {
    console.error(`- ${entry.slug}: ${entry.issues.join("; ")}`);
  }
  process.exit(1);
}

console.log(
  `SMH treatment layout guard passed (${treatmentSlugs.length} treatment pages checked).`
);
