import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const manifestPath = path.join(
  repoRoot,
  "packages/champagne-manifests/data/champagne_machine_manifest_full.json",
);
const buildModelPath = path.join(
  repoRoot,
  "apps/web/app/components/hero/v2/buildHeroV2Model.ts",
);
const reportsDir = path.join(repoRoot, "REPORTS");
const jsonReportPath = path.join(reportsDir, "HERO_V2_MODEL_COVERAGE_V1.json");
const mdReportPath = path.join(reportsDir, "HERO_V2_MODEL_COVERAGE_V1.md");

const normalizePathname = (inputPath = "/") => {
  const raw = String(inputPath ?? "");
  const trimmed = raw.trim();
  if (!trimmed) return "/";
  const noHash = trimmed.split("#")[0] ?? "/";
  const noQuery = noHash.split("?")[0] ?? "/";
  const ensured = noQuery.startsWith("/") ? noQuery : `/${noQuery}`;
  if (ensured.length > 1 && ensured.endsWith("/")) {
    return ensured.slice(0, -1);
  }
  return ensured || "/";
};

const sha256File = async (filePath) => {
  const data = await fs.readFile(filePath);
  return createHash("sha256").update(data).digest("hex");
};

const loadBuildHeroV2Model = async () => {
  const require = createRequire(import.meta.url);
  const { Module } = require("module");
  const webNodeModules = path.join(repoRoot, "apps/web/node_modules");
  process.env.NODE_PATH = [webNodeModules, process.env.NODE_PATH]
    .filter(Boolean)
    .join(path.delimiter);
  Module._initPaths();
  if (require.extensions) {
    require.extensions[".css"] = () => {};
  }
  process.env.TS_NODE_PROJECT = path.join(repoRoot, "tsconfig.base.json");
  process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
    module: "CommonJS",
    moduleResolution: "Node",
    jsx: "react-jsx",
  });
  require("ts-node/register/transpile-only");
  require("tsconfig-paths/register");
  const mod = require(buildModelPath);
  return mod?.buildHeroV2Model ?? mod?.default ?? null;
};

const collectRoutes = (manifest) => {
  const routes = new Map();
  const addRoute = (rawPath, source) => {
    const pathnameKey = normalizePathname(rawPath);
    if (!pathnameKey) return;
    if (!routes.has(pathnameKey)) {
      routes.set(pathnameKey, { pathnameKey, sources: new Set() });
    }
    routes.get(pathnameKey).sources.add(source);
  };

  const pages = manifest?.pages ? Object.values(manifest.pages) : [];
  pages.forEach((page) => addRoute(page?.path, "pages"));

  const treatments = manifest?.treatments ? Object.values(manifest.treatments) : [];
  treatments.forEach((treatment) => addRoute(treatment?.path, "treatments"));

  const treatmentGroups = manifest?.treatmentGroups
    ? Object.values(manifest.treatmentGroups)
    : [];
  treatmentGroups.forEach((group) => {
    if (group?.hub) addRoute(group.hub, "treatmentGroups.hub");
  });

  return { routes: Array.from(routes.values()), pages, treatments };
};

const deriveProps = ({ pathnameKey, pageCategory, manifestCategory }) => {
  let mode;
  let treatmentSlug;
  let derivedCategory = pageCategory ?? manifestCategory ?? "utility";
  if (pathnameKey.startsWith("/treatments/")) {
    mode = "treatment";
    treatmentSlug = pathnameKey.split("/")[2] || undefined;
    derivedCategory = "treatment";
  } else if (pathnameKey === "/") {
    mode = "home";
    derivedCategory = "home";
  }
  return { mode, treatmentSlug, pageCategory: derivedCategory };
};

const buildCategoryLookup = (pages) => {
  const lookup = new Map();
  pages.forEach((page) => {
    if (!page?.path) return;
    const normalized = normalizePathname(page.path);
    lookup.set(normalized, page.category);
  });
  return lookup;
};

const run = async () => {
  const inputs = [
    { path: manifestPath, sha256: await sha256File(manifestPath) },
    { path: buildModelPath, sha256: await sha256File(buildModelPath) },
  ];

  const manifestRaw = await fs.readFile(manifestPath, "utf-8");
  const manifest = JSON.parse(manifestRaw);
  const { routes, pages } = collectRoutes(manifest);
  const categoryLookup = buildCategoryLookup(pages);

  let buildHeroV2Model;
  let importError = null;
  try {
    buildHeroV2Model = await loadBuildHeroV2Model();
    if (!buildHeroV2Model) {
      importError = "UNKNOWN — EVIDENCE NOT PRESENT: buildHeroV2Model export missing";
    }
  } catch (error) {
    importError = `UNKNOWN — EVIDENCE NOT PRESENT: ${error?.message ?? String(error)}`;
  }

  const routeReports = [];
  if (importError) {
    console.warn(importError);
  }

  for (const route of routes.sort((a, b) => a.pathnameKey.localeCompare(b.pathnameKey))) {
    const manifestCategory = categoryLookup.get(route.pathnameKey);
    const derived = deriveProps({
      pathnameKey: route.pathnameKey,
      pageCategory: null,
      manifestCategory,
    });

    let model = null;
    let modelError = null;
    if (!importError && buildHeroV2Model) {
      try {
        model = await buildHeroV2Model({
          pageSlugOrPath: route.pathnameKey,
          mode: derived.mode,
          treatmentSlug: derived.treatmentSlug,
          pageCategory: derived.pageCategory,
        });
      } catch (error) {
        modelError = `buildHeroV2Model error: ${error?.message ?? String(error)}`;
      }
    }

    const modelPayload = model
      ? {
          isNull: false,
          heroId: model.surfaceStack?.heroId ?? null,
          variantId: model.surfaceStack?.variantId ?? null,
          motionCount: model.surfaceStack?.motionLayers?.length ?? null,
          particlesPath: model.surfaceStack?.particlesPath ?? null,
        }
      : {
          isNull: true,
          heroId: null,
          variantId: null,
          motionCount: null,
          particlesPath: null,
        };

    const notes = [];
    if (modelError) notes.push(modelError);
    if (importError) notes.push(importError);

    routeReports.push({
      path: route.pathnameKey,
      pathnameKey: route.pathnameKey,
      manifestCategory: manifestCategory ?? null,
      derived,
      model: modelPayload,
      flashRisk: modelPayload.isNull,
      notes,
    });
  }

  const report = {
    schema: "HERO_V2_MODEL_COVERAGE_V1",
    generatedAt: new Date().toISOString(),
    inputs,
    routes: routeReports,
    notes: importError ? [importError] : [],
  };

  await fs.mkdir(reportsDir, { recursive: true });
  await fs.writeFile(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);

  const totalRoutes = routeReports.length;
  const nullRoutes = routeReports.filter((route) => route.model?.isNull);
  const nonNullRoutes = routeReports.filter((route) => !route.model?.isNull);
  const sampleNonNull = nonNullRoutes.slice(0, 12);

  const flashRows = nullRoutes.length
    ? nullRoutes
        .map(
          (route) =>
            `| ${route.path} | ${route.derived.pageCategory ?? ""} | ${route.manifestCategory ?? ""} |`,
        )
        .join("\n")
    : "| (none) |  |  |";

  const sampleRows = sampleNonNull.length
    ? sampleNonNull
        .map(
          (route) =>
            `| ${route.path} | ${route.model.heroId ?? ""} | ${route.model.variantId ?? ""} |`,
        )
        .join("\n")
    : "| (none) |  |  |";

  const markdown = `# HERO V2 Model Coverage v1

Generated: ${report.generatedAt}

## Totals
- Total routes: ${totalRoutes}
- Non-null models: ${nonNullRoutes.length}
- Null models: ${nullRoutes.length}

## Flash-risk routes (null model)
| Path | Derived category | Manifest category |
| --- | --- | --- |
${flashRows}

## Sample non-null routes
| Path | Hero ID | Variant ID |
| --- | --- | --- |
${sampleRows}
`;

  await fs.writeFile(mdReportPath, markdown);

  console.log(
    `HERO_V2_MODEL_COVERAGE_V1: ${totalRoutes} routes, ${nonNullRoutes.length} non-null, ${nullRoutes.length} null.`,
  );
};

run().catch((error) => {
  console.error("HERO_V2_MODEL_COVERAGE_V1_FAILED", error);
  process.exitCode = 1;
});
