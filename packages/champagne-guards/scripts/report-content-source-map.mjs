import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..", "..", "..");

const relativeToRoot = (targetPath) => path.relative(repoRoot, targetPath);

const readJsonIfExists = (absolutePath) => {
  if (!fs.existsSync(absolutePath)) {
    return null;
  }

  const raw = fs.readFileSync(absolutePath, "utf8");
  return JSON.parse(raw);
};

const machineManifestPath = path.join(
  repoRoot,
  "packages",
  "champagne-manifests",
  "data",
  "champagne_machine_manifest_full.json"
);
const brandManifestPath = path.join(
  repoRoot,
  "packages",
  "champagne-manifests",
  "data",
  "manifest.public.brand.json"
);
const treatmentJourneysPath = path.join(
  repoRoot,
  "packages",
  "champagne-manifests",
  "data",
  "sections",
  "smh",
  "treatment_journeys.json"
);
const routeTruthLedgerPath = path.join(
  repoRoot,
  "reports",
  "structure",
  "route-truth-ledger.v1.json"
);

const machineManifest = readJsonIfExists(machineManifestPath);
const brandManifest = readJsonIfExists(brandManifestPath);
const treatmentJourneys = readJsonIfExists(treatmentJourneysPath);
const routeTruthLedger = readJsonIfExists(routeTruthLedgerPath);

const inputs = {
  machineManifest: machineManifest ? relativeToRoot(machineManifestPath) : null,
  brandManifest: brandManifest ? relativeToRoot(brandManifestPath) : null,
  treatmentJourneys: treatmentJourneys ? relativeToRoot(treatmentJourneysPath) : null,
  routeTruthLedger: routeTruthLedger ? relativeToRoot(routeTruthLedgerPath) : null,
};

const treatmentRouteIndex = new Map();
if (treatmentJourneys?.treatments) {
  treatmentJourneys.treatments.forEach((treatment, index) => {
    if (treatment?.routeId) {
      treatmentRouteIndex.set(treatment.routeId, index);
    }
  });
}

const sectionJsonKind = "sectionJson";
const machineManifestKind = "machineManifest";
const brandManifestKind = "brandManifest";
const smhSectionKind = "smhSection";
const codeResolverKind = "codeResolver";

const inlineKeys = ["sections", "content", "blocks", "hero"];

const buildRouteId = (routePath, page) => {
  if (page?.routeId) {
    return page.routeId;
  }

  if (typeof routePath === "string" && routePath.startsWith("/treatments/")) {
    const slug = routePath.replace("/treatments/", "").split("/").filter(Boolean).join(".");
    return `treatments.${slug}`;
  }

  if (page?.id) {
    return page.id;
  }

  if (routePath === "/") {
    return "home";
  }

  if (typeof routePath === "string") {
    return routePath.replace(/^\//, "").replace(/\//g, ".");
  }

  return null;
};

const hasInlineContent = (page) => {
  if (!page || typeof page !== "object") {
    return false;
  }

  return inlineKeys.some((key) => {
    if (!(key in page)) {
      return false;
    }

    const value = page[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value && typeof value === "object";
  });
};

const listInlineKeys = (page) =>
  inlineKeys.filter((key) => {
    if (!(key in page)) {
      return false;
    }

    const value = page[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value && typeof value === "object";
  });

const routes = [];
const routeIndex = new Map();

const addRouteEntry = (entry) => {
  if (!entry.route) {
    return;
  }

  if (!routeIndex.has(entry.route)) {
    routeIndex.set(entry.route, entry);
    routes.push(entry);
  }
};

const appDir = path.join(repoRoot, "apps", "web", "app");
const dynamicRouteEntries = [];

const walkDir = (dirPath) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  entries.forEach((entry) => {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDir(entryPath);
    } else if (entry.isFile() && entry.name === "page.tsx") {
      dynamicRouteEntries.push(entryPath);
    }
  });
};

if (fs.existsSync(appDir)) {
  walkDir(appDir);
}

const normalizeRouteSegments = (segments) =>
  segments.filter((segment) => segment && !segment.startsWith("("));

const buildRoutePattern = (pagePath) => {
  const relativePath = path.relative(appDir, pagePath);
  const segments = normalizeRouteSegments(relativePath.split(path.sep));
  const pageIndex = segments.lastIndexOf("page.tsx");
  const routeSegments =
    pageIndex === -1 ? segments : segments.slice(0, pageIndex);
  if (routeSegments.length === 0) {
    return "/";
  }
  return `/${routeSegments.join("/")}`;
};

if (machineManifest?.pages) {
  Object.entries(machineManifest.pages).forEach(([pageKey, page]) => {
    const routePath = page?.path ?? null;
    const routeId = buildRouteId(routePath, page);
    const machineManifestPointer = `/pages/${pageKey}`;

    const evidence = {
      why: "",
      files: [
        {
          path: relativeToRoot(machineManifestPath),
          kind: machineManifestKind,
          pointers: [machineManifestPointer],
        },
      ],
      machineManifestPath: machineManifestPointer,
      brandManifestPath: null,
    };

    let sourceType = "machine_manifest_only_unknown_shape";

    if (Array.isArray(page?.sectionJsonPaths) && page.sectionJsonPaths.length > 0) {
      sourceType = "machine_manifest_sectionJsonPaths";
      evidence.why = "sectionJsonPaths present";
      page.sectionJsonPaths.forEach((sectionPath, index) => {
        evidence.files.push({
          path: sectionPath,
          kind: sectionJsonKind,
          pointers: [`${machineManifestPointer}/sectionJsonPaths/${index}`],
        });
      });
    } else if (hasInlineContent(page)) {
      const inlineMatches = listInlineKeys(page);
      sourceType = "machine_manifest_inline_sections";
      evidence.why = `inline keys: ${inlineMatches.join(", ")}`;
      inlineMatches.forEach((key) => {
        evidence.files.push({
          path: relativeToRoot(machineManifestPath),
          kind: machineManifestKind,
          pointers: [`${machineManifestPointer}/${key}`],
        });
      });
    } else if (
      typeof routePath === "string" &&
      routePath.startsWith("/treatments/")
    ) {
      if (routeId && treatmentRouteIndex.has(routeId)) {
        const index = treatmentRouteIndex.get(routeId);
        sourceType = "smh_treatment_layout_resolved";
        evidence.why = "treatment_journeys route match";
        evidence.files.push({
          path: relativeToRoot(treatmentJourneysPath),
          kind: smhSectionKind,
          pointers: [`/treatments/${index}`],
        });
      } else {
        sourceType = "dynamic_route_builder_resolved";
        evidence.why = "treatments route resolved via builder";
      }
      evidence.files.push({
        path: "apps/web/app/treatments/[slug]/page.tsx",
        kind: codeResolverKind,
        pointers: ["resolveTreatment"],
      });
      evidence.files.push({
        path: "apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx",
        kind: codeResolverKind,
        pointers: ["ChampagnePageBuilder"],
      });
    } else {
      sourceType = "machine_manifest_only_unknown_shape";
      evidence.why = "no sectionJsonPaths or inline content keys";
    }

    addRouteEntry({
      route: routePath,
      routeId,
      pageKey,
      sourceType,
      evidence,
      notes: [],
    });
  });
}

const dynamicRoutePatterns = new Set();
const staticRoutePatterns = new Map();
dynamicRouteEntries.forEach((pagePath) => {
  const routePattern = buildRoutePattern(pagePath);
  staticRoutePatterns.set(routePattern, pagePath);
  if (routePattern.includes("[")) {
    dynamicRoutePatterns.add(routePattern);
  }
});

dynamicRoutePatterns.forEach((routePattern) => {
  if (routeIndex.has(routePattern)) {
    return;
  }

  const files = [];
  const routeId = buildRouteId(routePattern, null);
  let why = "dynamic route resolved via builder";

  if (routePattern.startsWith("/treatments/")) {
    why = "dynamic treatments route resolved via getTreatmentManifest";
    files.push({
      path: "apps/web/app/treatments/[slug]/page.tsx",
      kind: codeResolverKind,
      pointers: ["resolveTreatment"],
    });
  }

  files.push({
    path: "apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx",
    kind: codeResolverKind,
    pointers: ["ChampagnePageBuilder"],
  });

  addRouteEntry({
    route: routePattern,
    routeId,
    pageKey: null,
    sourceType: "dynamic_route_builder_resolved",
    evidence: {
      why,
      files,
      machineManifestPath: null,
      brandManifestPath: null,
    },
    notes: [],
  });
});

staticRoutePatterns.forEach((pagePath, routePattern) => {
  if (routeIndex.has(routePattern)) {
    return;
  }

  if (routePattern.includes("[")) {
    return;
  }

  addRouteEntry({
    route: routePattern,
    routeId: buildRouteId(routePattern, null),
    pageKey: null,
    sourceType: "unknown",
    evidence: {
      why: "page file exists outside manifest inventory",
      files: [
        {
          path: relativeToRoot(pagePath),
          kind: "unknown",
          pointers: ["page.tsx"],
        },
      ],
      machineManifestPath: null,
      brandManifestPath: null,
    },
    notes: [],
  });
});

if (brandManifest?.pages) {
  brandManifest.pages.forEach((page, index) => {
    const slug = page?.slug;
    if (!slug) {
      return;
    }

    if (routeIndex.has(slug)) {
      return;
    }

    const routeId = buildRouteId(slug, { id: page?.id });

    addRouteEntry({
      route: slug,
      routeId,
      pageKey: null,
      sourceType: "brand_manifest_only",
      evidence: {
        why: "slug listed in brand manifest only",
        files: [
          {
            path: relativeToRoot(brandManifestPath),
            kind: brandManifestKind,
            pointers: [`/pages/${index}`],
          },
        ],
        machineManifestPath: null,
        brandManifestPath: `/pages/${index}`,
      },
      notes: [],
    });
  });
}

const redirectRoutes = [
  {
    route: "/dental-checkups-oral-cancer-screening",
    file: "apps/web/app/dental-checkups-oral-cancer-screening/route.ts",
  },
];

redirectRoutes.forEach((redirect) => {
  if (routeIndex.has(redirect.route)) {
    return;
  }

  addRouteEntry({
    route: redirect.route,
    routeId: buildRouteId(redirect.route, null),
    pageKey: null,
    sourceType: "redirect_handler_only",
    evidence: {
      why: "route handler redirects with no page.tsx",
      files: [
        {
          path: redirect.file,
          kind: codeResolverKind,
          pointers: ["NextResponse.redirect"],
        },
      ],
      machineManifestPath: null,
      brandManifestPath: null,
    },
    notes: [],
  });
});

routes.sort((a, b) => (a.route || "").localeCompare(b.route || ""));

const stats = {
  totalRoutes: routes.length,
  bySourceType: {},
  unknownCount: 0,
};

routes.forEach((route) => {
  stats.bySourceType[route.sourceType] =
    (stats.bySourceType[route.sourceType] || 0) + 1;
  if (route.sourceType === "unknown") {
    stats.unknownCount += 1;
  }
});

const report = {
  schema: "CHAMPAGNE_CONTENT_SOURCE_MAP_V1",
  generatedAt: new Date().toISOString(),
  repoRootAssumed: repoRoot,
  inputs,
  stats,
  routes,
};

const outputDir = path.join(repoRoot, "reports", "structure");
const outputPath = path.join(
  outputDir,
  "content-source-map.v1.json"
);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(`Report written to ${relativeToRoot(outputPath)}`);
console.log(`Total routes: ${stats.totalRoutes}`);
