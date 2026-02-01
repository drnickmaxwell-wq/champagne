import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();

const readJson = async (relativePath) => {
  const data = await fs.readFile(path.join(rootDir, relativePath), "utf8");
  return JSON.parse(data);
};

const writeTextFile = async (relativePath, content) => {
  const fullPath = path.join(rootDir, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf8");
};

const normalizeRouteToFilename = (route) => {
  if (route === "/") return "home.txt";
  const trimmed = route.replace(/^\//, "").replace(/\/$/, "");
  return `${trimmed.replace(/\//g, "-")}.txt`;
};

const isUrlLike = (value) => {
  const trimmed = value.trim();
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("www.")
  );
};

const TEXT_KEYS = new Set([
  "title",
  "heading",
  "headline",
  "eyebrow",
  "overline",
  "strapline",
  "subtitle",
  "subheading",
  "body",
  "copy",
  "text",
  "description",
  "summary",
  "content",
  "intro",
  "label",
  "note",
  "cta",
  "ctaLabel",
  "buttonLabel",
  "footnote",
  "caption",
  "bullets",
  "highlights",
  "question",
  "answer",
]);

const collectTextFromValue = (value, key, output, seen) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!TEXT_KEYS.has(key)) return;
    if (isUrlLike(trimmed)) return;
    if (seen.has(trimmed)) return;
    seen.add(trimmed);
    output.push(trimmed);
    return;
  }

  if (Array.isArray(value)) {
    const allStrings = value.every((item) => typeof item === "string");
    if (allStrings && TEXT_KEYS.has(key)) {
      value.forEach((item) => {
        if (typeof item !== "string") return;
        const trimmed = item.trim();
        if (!trimmed || isUrlLike(trimmed) || seen.has(trimmed)) return;
        seen.add(trimmed);
        output.push(trimmed);
      });
      return;
    }

    value.forEach((item) => {
      if (item && typeof item === "object") {
        collectTextFromObject(item, output, seen);
      }
    });
    return;
  }

  if (value && typeof value === "object") {
    collectTextFromObject(value, output, seen);
  }
};

const collectTextFromObject = (obj, output, seen) => {
  if (!obj || typeof obj !== "object") return;
  for (const [key, value] of Object.entries(obj)) {
    collectTextFromValue(value, key, output, seen);
  }
};

const extractSectionText = (section) => {
  const output = [];
  const seen = new Set();
  collectTextFromObject(section, output, seen);
  return output;
};

const hasTextFields = (section) => {
  if (!section || typeof section !== "object") return false;
  const stack = [section];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      if (TEXT_KEYS.has(key)) return true;
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item && typeof item === "object") stack.push(item);
        });
      } else if (value && typeof value === "object") {
        stack.push(value);
      }
    }
  }
  return false;
};

const sectionLabel = (section) => {
  return (
    section?.type ||
    section?.componentId ||
    section?.title ||
    section?.heading ||
    section?.id ||
    "section"
  );
};

const main = async () => {
  const liveRoutes = await readJson("content-scope/live-pages.json");
  const manifest = await readJson(
    "packages/champagne-manifests/data/champagne_machine_manifest_full.json",
  );
  const pageIndexTruth = await readJson("_truth_output/page_index_truth.json");

  const pages = manifest?.pages ?? {};
  const pagesByPath = new Map(
    Object.entries(pages)
      .map(([key, page]) => [page?.path, { key, page }])
      .filter(([route]) => Boolean(route)),
  );

  const truthByRoute = new Map(
    pageIndexTruth
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => [entry.route, entry]),
  );

  const failures = [];
  const routeSourceTypes = [];
  const unsupportedSections = [];

  let exportedCount = 0;

  for (const route of liveRoutes) {
    const pageEntry = pagesByPath.get(route);
    if (!pageEntry) {
      failures.push({ route, reason: "No manifest page entry for route" });
      continue;
    }

    const { key: pageKey, page } = pageEntry;
    const truthEntry = truthByRoute.get(route);
    const contentSources = Array.isArray(truthEntry?.contentSources)
      ? truthEntry.contentSources
      : [];

    const sourceTypes = new Set();
    const sectionsInOrder = [];

    if (contentSources.length === 0 && Array.isArray(page?.sections)) {
      sourceTypes.add("manifest_inline_sections");
      sectionsInOrder.push(
        ...page.sections.map((section) => ({
          source: "manifest_inline_sections",
          section,
        })),
      );
    } else {
      for (const source of contentSources) {
        if (source?.type === "manifest") {
          if (Array.isArray(page?.sections)) {
            sourceTypes.add("manifest_inline_sections");
            sectionsInOrder.push(
              ...page.sections.map((section) => ({
                source: "manifest_inline_sections",
                section,
              })),
            );
          }
        }

        if (source?.type === "section_json") {
          sourceTypes.add("section_json");
          const filePath = source.filePath;
          if (!filePath) {
            failures.push({ route, reason: "section_json missing filePath" });
            continue;
          }

          const relativePath = path.isAbsolute(filePath)
            ? path.relative(rootDir, filePath)
            : filePath;
          const sectionData = await readJson(relativePath);
          if (Array.isArray(sectionData?.sections)) {
            sectionsInOrder.push(
              ...sectionData.sections.map((section) => ({
                source: "section_json",
                section,
              })),
            );
          } else {
            failures.push({
              route,
              reason: `section_json missing sections array in ${relativePath}`,
            });
          }
        }
      }
    }

    routeSourceTypes.push({
      route,
      pageKey,
      sources: Array.from(sourceTypes).sort(),
    });

    const outputLines = [];
    for (const { section } of sectionsInOrder) {
      const label = sectionLabel(section);
      const textLines = extractSectionText(section);
      const hasFields = hasTextFields(section);
      if (textLines.length === 0 && !hasFields) {
        continue;
      }
      outputLines.push(`=== SECTION: ${label} ===`);
      if (textLines.length === 0 && hasFields) {
        unsupportedSections.push({ route, sectionType: label });
      }
      outputLines.push(...textLines, "");
    }

    const outputFile = path.join("page-truth", normalizeRouteToFilename(route));
    await writeTextFile(outputFile, outputLines.join("\n").trimEnd() + "\n");
    exportedCount += 1;
  }

  const reportLines = [];
  reportLines.push("# Page Truth Export Report");
  reportLines.push("");
  reportLines.push(`- Total live routes: ${liveRoutes.length}`);
  reportLines.push(`- Exported count: ${exportedCount}`);
  reportLines.push(`- Failures: ${failures.length}`);
  reportLines.push("");

  if (failures.length > 0) {
    reportLines.push("## Failures");
    reportLines.push("");
    failures.forEach((failure) => {
      reportLines.push(`- \`${failure.route}\` — ${failure.reason}`);
    });
    reportLines.push("");
  }

  reportLines.push("## Route source types");
  reportLines.push("");
  reportLines.push("| Route | Page key | Source types |");
  reportLines.push("| --- | --- | --- |");
  routeSourceTypes.forEach(({ route, pageKey, sources }) => {
    const sourceList = sources.length > 0 ? sources.join(", ") : "(none)";
    reportLines.push(`| \`${route}\` | \`${pageKey}\` | ${sourceList} |`);
  });
  reportLines.push("");

  if (unsupportedSections.length > 0) {
    reportLines.push("## Unsupported section types");
    reportLines.push("");
    unsupportedSections.forEach((entry) => {
      reportLines.push(`- \`${entry.route}\` — UNSUPPORTED SECTION TYPE: ${entry.sectionType}`);
    });
    reportLines.push("");
  }

  await writeTextFile("reports/page_truth_export_report.md", reportLines.join("\n"));
};

main().catch((error) => {
  console.error("[export-page-truth] failed", error);
  process.exit(1);
});
