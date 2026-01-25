import { readFileSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const inputFiles = [
  "apps/web/app/layout.tsx",
  "packages/champagne-manifests/data/champagne_machine_manifest_full.json",
  "packages/champagne-hero/src/hero-engine/HeroRuntime.ts",
  "apps/web/app/components/hero/v2/buildHeroV2Model.ts",
  "packages/champagne-manifests/src/helpers.ts",
];

const readText = (relativePath) => readFileSync(path.join(repoRoot, relativePath), "utf8");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const hashFile = (relativePath) => {
  const content = readText(relativePath);
  return sha256(content);
};

const normalizeHeroPathname = (inputPath) => {
  if (!inputPath) return "/";
  const trimmed = inputPath.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const normalizeRouteKey = (input) => {
  if (!input) return "/";
  const trimmed = input.split("#")[0]?.split("?")[0]?.trim();
  if (!trimmed) return "/";
  let normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized.toLowerCase();
};

const resolveVariantIdForCategory = (category) => {
  if (!category) return undefined;
  switch (category) {
    case "home":
      return "default";
    case "treatment":
      return "hero.variant.treatment_v1";
    case "editorial":
      return "hero.variant.editorial_v1";
    case "utility":
      return "hero.variant.utility_v1";
    case "marketing":
      return "hero.variant.marketing_v1";
    default:
      return "hero.variant.marketing_v1";
  }
};

const deriveLayoutRouting = ({ pathname, manifestCategory }) => {
  let pageCategory;
  let mode;
  let treatmentSlug;

  if (pathname.startsWith("/treatments/")) {
    mode = "treatment";
    treatmentSlug = pathname.split("/")[2] || undefined;
    pageCategory = "treatment";
  } else if (pathname.startsWith("/team/")) {
    pageCategory = "profile";
  } else if (pathname === "/team") {
    pageCategory = "utility";
  } else if (pathname === "/about") {
    pageCategory = "utility";
  } else if (pathname === "/contact") {
    pageCategory = "utility";
  } else if (pathname === "/blog") {
    pageCategory = "editorial";
  } else if (pathname === "/treatments") {
    pageCategory = "utility";
  } else if (pathname === "/fees") {
    pageCategory = "utility";
  } else if (pathname === "/smile-gallery") {
    pageCategory = "utility";
  } else if (pathname === "/") {
    pageCategory = "home";
  } else {
    pageCategory = manifestCategory;
  }

  return { pageCategory, mode, treatmentSlug };
};

const toCategoryKey = (value) => (value === undefined ? "undefined" : String(value));

const extractSnippet = (fileText, anchor, maxLines = 30) => {
  const lines = fileText.split("\n");
  const index = lines.findIndex((line) => line.includes(anchor));
  if (index === -1) return "";
  const snippet = lines.slice(index, index + maxLines);
  return snippet.join("\n");
};

const main = () => {
  const manifestPath = "packages/champagne-manifests/data/champagne_machine_manifest_full.json";
  const manifest = JSON.parse(readText(manifestPath));

  const pages = manifest.pages ?? {};
  const treatments = manifest.treatments ?? {};
  const treatmentGroups = Array.isArray(manifest.treatmentGroups) ? manifest.treatmentGroups : [];

  const heroBindingMap = new Map();
  const addHeroBinding = (entry) => {
    if (!entry?.path) return;
    const binding = entry.heroBinding;
    if (!binding?.heroId) return;
    heroBindingMap.set(normalizeRouteKey(entry.path), {
      heroId: binding.heroId,
      variantId: binding.variantId ?? null,
    });
  };

  Object.values(pages).forEach(addHeroBinding);
  Object.values(treatments).forEach(addHeroBinding);

  const treatmentGroupHubs = new Set(
    treatmentGroups
      .map((group) => group?.hub)
      .filter((hub) => typeof hub === "string" && hub.length > 0),
  );

  const allRoutes = [];
  const addRoute = (entry, fallbackId) => {
    if (!entry?.path) return;
    allRoutes.push({
      id: entry.id ?? fallbackId ?? null,
      path: entry.path,
      manifestCategory: entry.category ?? null,
    });
  };

  Object.entries(pages).forEach(([key, entry]) => addRoute(entry, key));
  Object.entries(treatments).forEach(([key, entry]) => addRoute(entry, key));

  const routes = allRoutes
    .map((route) => {
      const pathKey = normalizeHeroPathname(route.path);
      const layoutDerived = deriveLayoutRouting({
        pathname: route.path,
        manifestCategory: route.manifestCategory ?? undefined,
      });
      const heroBinding = heroBindingMap.get(normalizeRouteKey(pathKey)) ?? null;
      const boundHeroId = heroBinding?.heroId ?? null;
      const boundVariantId = heroBinding?.variantId ?? null;
      const runtimeVariantOverride = boundVariantId ?? boundHeroId;

      const derivedMode =
        layoutDerived.mode ??
        (layoutDerived.pageCategory === "treatment" ? "treatment" : layoutDerived.pageCategory === "home" ? "home" : "home");
      const derivedTreatmentSlug = layoutDerived.treatmentSlug;
      const mappedVariantIdFromCategory = resolveVariantIdForCategory(layoutDerived.pageCategory ?? derivedMode);

      let selectionMode = "unknown";
      if (heroBinding) {
        selectionMode = "bindingOverride";
      } else if (mappedVariantIdFromCategory) {
        selectionMode = "categoryMapped";
      } else if (derivedMode === "treatment" && derivedTreatmentSlug) {
        selectionMode = "treatmentSlugMatch";
      }

      let predictedVariantId = null;
      if (selectionMode === "bindingOverride") {
        predictedVariantId = runtimeVariantOverride ?? null;
      } else if (selectionMode === "categoryMapped") {
        predictedVariantId = mappedVariantIdFromCategory ?? null;
      } else if (selectionMode === "treatmentSlugMatch") {
        predictedVariantId = null;
      }

      let heroIdentityKey = "unknown";
      if (selectionMode === "bindingOverride") {
        heroIdentityKey = `binding:${runtimeVariantOverride ?? "unknown"}`;
      } else if (selectionMode === "categoryMapped") {
        heroIdentityKey = `category:${mappedVariantIdFromCategory ?? "unknown"}`;
      } else if (selectionMode === "treatmentSlugMatch") {
        heroIdentityKey = `treatmentSlug:${derivedTreatmentSlug ?? "unknown"}`;
      }

      const notes = [];
      if (boundHeroId && !boundVariantId) {
        notes.push("heroBinding specifies heroId without variantId; runtime override may not match a variant id directly");
      }
      if (!layoutDerived.pageCategory) {
        notes.push("layout-derived pageCategory is undefined; category mapping uses runtime mode fallback");
      }
      if (selectionMode === "categoryMapped" && derivedMode === "treatment" && derivedTreatmentSlug) {
        notes.push(
          "treatment route uses category-mapped variant; HeroRuntime may fallback to base if mapped variant treatmentSlug mismatches",
        );
      }
      if (selectionMode === "treatmentSlugMatch") {
        notes.push("variant id depends on manifest treatmentSlug match; no explicit variant id available from inputs");
      }

      return {
        id: route.id,
        path: route.path,
        manifestCategory: route.manifestCategory,
        layoutDerived,
        isTreatmentGroupHub: treatmentGroupHubs.has(route.path),
        heroBinding: heroBinding ? { heroId: heroBinding.heroId, variantId: heroBinding.variantId } : null,
        runtimeSelectionPrediction: {
          mappedVariantIdFromCategory,
          selectionMode,
          predictedVariantId,
        },
        heroIdentityKey,
        notes,
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));

  const categoryCounts = routes.reduce((acc, route) => {
    const key = toCategoryKey(route.manifestCategory ?? "undefined");
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const inputs = inputFiles.map((filePath) => ({
    path: filePath,
    sha256: hashFile(filePath),
  }));

  const reportJson = {
    schema: "SMH_HERO_ROUTING_CONTRACT_V1",
    generatedAt: new Date().toISOString(),
    inputs,
    summary: {
      totalRoutes: routes.length,
      heroBindingCount: heroBindingMap.size,
      treatmentGroupsCount: treatmentGroups.length,
      categoryCounts,
    },
    routes,
  };

  const reportsDir = path.join(repoRoot, "REPORTS");
  mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, "HERO_ROUTING_CONTRACT_V1.json");
  writeFileSync(jsonPath, JSON.stringify(reportJson, null, 2));

  const layoutText = readText("apps/web/app/layout.tsx");
  const heroModelText = readText("apps/web/app/components/hero/v2/buildHeroV2Model.ts");
  const heroRuntimeText = readText("packages/champagne-hero/src/hero-engine/HeroRuntime.ts");

  const layoutSnippet = extractSnippet(layoutText, "if (pathname.startsWith(\"/treatments/\"))", 30);
  const bindingSnippet = extractSnippet(heroModelText, "const heroBinding = getHeroBindingForPathnameKey", 30);
  const runtimeSnippet = extractSnippet(heroRuntimeText, "function resolveVariantIdForCategory", 30);

  const treatmentGroupRows = treatmentGroups
    .map((group) => `| ${group.id ?? ""} | ${group.label ?? ""} | ${group.hub ?? ""} |`)
    .join("\n");

  const heroBindingRows = routes
    .filter((route) => route.heroBinding)
    .map(
      (route) =>
        `| ${route.path} | ${route.heroBinding?.heroId ?? ""} | ${route.heroBinding?.variantId ?? ""} |`,
    )
    .join("\n");

  const allowedCategories = new Set(["home", "treatment", "utility", "editorial", "marketing"]);
  const riskRows = routes
    .filter((route) => !allowedCategories.has(route.layoutDerived.pageCategory ?? ""))
    .map(
      (route) =>
        `| ${route.path} | ${route.layoutDerived.pageCategory ?? ""} | ${route.manifestCategory ?? ""} |`,
    )
    .join("\n");

  const mdLines = [
    "# HERO ROUTING CONTRACT V1",
    "",
    "## How derived",
    "",
    "### layout.tsx category logic",
    "```ts",
    layoutSnippet,
    "```",
    "",
    "### buildHeroV2Model binding override",
    "```ts",
    bindingSnippet,
    "```",
    "",
    "### HeroRuntime resolveVariantIdForCategory",
    "```ts",
    runtimeSnippet,
    "```",
    "",
    "## Treatment Groups",
    "| id | label | hub |",
    "| --- | --- | --- |",
    treatmentGroupRows || "| (none) | | |",
    "",
    "## Routes with heroBinding",
    "| path | heroId | variantId |",
    "| --- | --- | --- |",
    heroBindingRows || "| (none) | | |",
    "",
    "## Routes with non-standard layoutDerived.pageCategory",
    "| path | layoutDerived.pageCategory | manifestCategory |",
    "| --- | --- | --- |",
    riskRows || "| (none) | | |",
    "",
  ];

  const mdPath = path.join(reportsDir, "HERO_ROUTING_CONTRACT_V1.md");
  writeFileSync(mdPath, mdLines.join("\n"));

  return { jsonPath, mdPath };
};

const { jsonPath, mdPath } = main();

if (process.env.NODE_ENV !== "production") {
  const jsonStats = statSync(jsonPath);
  const mdStats = statSync(mdPath);
  console.log(`HERO_ROUTING_CONTRACT_V1.json ${jsonStats.size} bytes`);
  console.log(`HERO_ROUTING_CONTRACT_V1.md ${mdStats.size} bytes`);
}
