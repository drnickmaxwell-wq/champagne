import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const rootDir = process.cwd();
const exportTimestamp = new Date().toISOString();

const targets = [
  { requestedRoute: "/treatments/composite-bonding", canonicalRoute: "/treatments/composite-bonding" },
  { requestedRoute: "/treatments/dental-crowns", canonicalRoute: "/treatments/dental-crowns" },
  { requestedRoute: "/treatments/clear-aligners", canonicalRoute: "/treatments/clear-aligners" },
  { requestedRoute: "/treatments/full-arch-dental-implants", canonicalRoute: "/treatments/implants-full-arch" },
  { requestedRoute: "/treatments/implant-aftercare", canonicalRoute: "/treatments/implant-aftercare" },
];

const readJson = async (relativePath, fallback = null) => {
  try {
    return JSON.parse(await fs.readFile(path.join(rootDir, relativePath), "utf8"));
  } catch {
    return fallback;
  }
};

const readText = async (relativePath, fallback = null) => {
  try {
    return await fs.readFile(path.join(rootDir, relativePath), "utf8");
  } catch {
    return fallback;
  }
};

const writeText = async (relativePath, text) => {
  const fullPath = path.join(rootDir, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, text, "utf8");
};

const sha256Text = (text) => createHash("sha256").update(text.replace(/\r\n/g, "\n"), "utf8").digest("hex");
const routeToTruthFile = (route) => `page-truth/${route.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-")}.txt`;
const routeSlug = (route) => route.split("/").filter(Boolean).join("-");
const relativePath = (filePath) => !filePath ? null : path.isAbsolute(filePath) ? path.relative(rootDir, filePath).split(path.sep).join("/") : filePath;

const collectSourceText = (pageContentTruth, route) => {
  const entries = pageContentTruth.filter((entry) => entry?.route === route && typeof entry.currentText === "string");
  const text = entries.map((entry) => entry.currentText).join("\n\n").trimEnd();
  return { entries, text: text ? `${text}\n` : "" };
};

const main = async () => {
  const manifest = await readJson("packages/champagne-manifests/data/champagne_machine_manifest_full.json", { pages: {} });
  const pageIndexTruth = await readJson("_truth_output/page_index_truth.json", []);
  const pageContentTruth = await readJson("_truth_output/page_content_truth.json", []);
  const websiteTruth = await readJson("reports/WEBSITE_TRUTH_EXPORT_REPORT_V1.json", null);
  const schemaQa = await readJson("reports/SEO_SCHEMA_GRAPH_QA_REPORT_V1.json", null);
  const answerFoundationQa = await readJson("reports/SEO_AI_ANSWER_FOUNDATION_QA_REPORT_V1.json", null);
  const answerPacketQa = await readJson("reports/SEO_AI_ANSWER_PRIORITY_SERVICE_PACKET_QA_REPORT_V1.json", null);

  const pagesByRoute = new Map(Object.entries(manifest.pages ?? {}).filter(([, page]) => page?.path).map(([pageId, page]) => [page.path, { pageId, page }]));
  const indexByRoute = new Map(pageIndexTruth.map((entry) => [entry.route, entry]));
  const inventoryByRoute = new Map((websiteTruth?.routeInventory ?? []).map((entry) => [entry.route, entry]));
  const answerByRoute = new Map((websiteTruth?.answerSurfaceCoverage?.entries ?? []).map((entry) => [entry.route, entry]));

  const pages = [];
  for (const target of targets) {
    const { requestedRoute, canonicalRoute } = target;
    const pageEntry = pagesByRoute.get(canonicalRoute);
    const indexEntry = indexByRoute.get(canonicalRoute);
    const inventory = inventoryByRoute.get(canonicalRoute);
    const answer = answerByRoute.get(canonicalRoute);
    const source = collectSourceText(pageContentTruth, canonicalRoute);
    const pageTruthFile = routeToTruthFile(canonicalRoute);
    const renderedText = await readText(pageTruthFile, null);
    const sourceFilePath = relativePath(indexEntry?.contentSources?.find((entry) => entry.type === "section_json")?.filePath)
      ?? relativePath(indexEntry?.contentSources?.[0]?.filePath)
      ?? "packages/champagne-manifests/data/champagne_machine_manifest_full.json";

    if (source.text) {
      await writeText(`page-truth/treatment-source-hashes/${routeSlug(requestedRoute)}.txt`, source.text);
    }

    const blockerReasons = [];
    if (!pageEntry) blockerReasons.push(`Canonical route ${canonicalRoute} is not present in the treatment manifest.`);
    if (!source.text) blockerReasons.push("Current source text could not be extracted from _truth_output/page_content_truth.json.");
    if (!renderedText) blockerReasons.push(`Current rendered/page-truth text export is not available at ${pageTruthFile}.`);
    if (answer?.validation && !answer.validation.valid) blockerReasons.push(`Answer surface incomplete: ${answer.validation.errors?.join("; ") || "validation failed"}`);
    if (inventory?.metadata && !inventory.metadata.canonicalUrl) blockerReasons.push("Canonical URL metadata could not be inferred.");
    if (inventory?.schema && !inventory.schema.discoverable) blockerReasons.push("Schema inventory is not discoverable for this route.");

    const sourceTextAvailable = Boolean(source.text);
    const answerSurfaceStatus = answer?.validation?.valid ? "PASS" : answer?.validation?.frameworkPresent ? "PARTIAL" : "MISSING";
    const schemaStatus = inventory?.schema?.discoverable ? "PASS_INFERRED_OR_EMITTED" : "MISSING";
    const canonicalStatus = inventory?.metadata?.canonicalUrl ? "PASS" : "MISSING";
    const localSeoStatus = inventory?.metadata?.title && inventory?.metadata?.description ? "PASS" : "PARTIAL";
    const conversionStatus = source.text && /book|consult|call|appointment|enquiry|contact/i.test(source.text) ? "PASS_SOURCE_CTA_TEXT_PRESENT" : "PARTIAL_NO_CTA_TEXT_MATCH";

    const implementationReadiness = !sourceTextAvailable ? "BLOCKED"
      : blockerReasons.length > 0 ? "PARTIAL"
      : "READY_FOR_AGENT_STAGING";

    pages.push({
      route: requestedRoute,
      canonicalRoute,
      treatmentFamily: pageEntry?.page?.category ?? indexEntry?.treatmentGroup ?? "treatment_detail",
      sourceFilePath,
      sourceTextAvailable,
      currentSourceTextHash: sourceTextAvailable ? sha256Text(source.text) : null,
      currentRenderedTextHash: renderedText ? sha256Text(renderedText) : null,
      answerSurfaceStatus,
      schemaStatus,
      canonicalStatus,
      localSeoStatus,
      conversionStatus,
      sourceExcerptOrTextLocation: sourceTextAvailable
        ? { textExport: `page-truth/treatment-source-hashes/${routeSlug(requestedRoute)}.txt`, sourceEntryCount: source.entries.length, firstJsonPointer: source.entries[0]?.jsonPointer ?? null }
        : null,
      exportTimestamp,
      blockerReasons,
      implementationReadiness,
    });
  }

  const report = {
    version: "WEBSITE_OS_TREATMENT_SOURCE_TRUTH_HASH_EXPORT_V1",
    repository: "drnickmaxwell-wq/champagne",
    exportTimestamp,
    mission: "Source-truth and current-text hash export only; no treatment content mutation or rewrite authority granted.",
    hashAlgorithm: "sha256 over UTF-8 text with CRLF converted to LF only",
    inputs: {
      pageIndexTruth: "_truth_output/page_index_truth.json",
      pageContentTruth: "_truth_output/page_content_truth.json",
      pageTruthDirectory: "page-truth/",
      websiteTruthReport: "reports/WEBSITE_TRUTH_EXPORT_REPORT_V1.json",
      schemaQaReportAvailable: Boolean(schemaQa),
      answerFoundationQaReportAvailable: Boolean(answerFoundationQa),
      answerPacketQaReportAvailable: Boolean(answerPacketQa),
    },
    pages,
    summary: {
      targetCount: pages.length,
      readyForAgentStaging: pages.filter((page) => page.implementationReadiness === "READY_FOR_AGENT_STAGING").map((page) => page.route),
      partial: pages.filter((page) => page.implementationReadiness === "PARTIAL").map((page) => ({ route: page.route, blockerReasons: page.blockerReasons })),
      blocked: pages.filter((page) => page.implementationReadiness === "BLOCKED").map((page) => ({ route: page.route, blockerReasons: page.blockerReasons })),
    },
    nonAuthority: {
      contentRewritten: false,
      publicPublicationAuthorityGranted: false,
      clinicalReviewBypassed: false,
      humanApprovalBypassed: false,
      phiOrPmsFieldsAdded: false,
    },
  };

  await writeText("reports/WEBSITE_OS_TREATMENT_SOURCE_TRUTH_HASH_EXPORT_V1.json", `${JSON.stringify(report, null, 2)}\n`);

  const md = [
    "# Website OS Treatment Source Truth Hash Export V1",
    "",
    `- Repository: \`${report.repository}\``,
    `- Export timestamp: \`${exportTimestamp}\``,
    `- Hash algorithm: ${report.hashAlgorithm}`,
    "- Authority: truth/export only; no rewrite, publication, clinical approval, chatbot, behavioural capture, PHI, PMS, or patient-data authority granted.",
    "",
    "## Summary",
    "",
    `- Target pages: ${report.summary.targetCount}`,
    `- Ready for agent staging: ${report.summary.readyForAgentStaging.length}`,
    `- Partial: ${report.summary.partial.length}`,
    `- Blocked: ${report.summary.blocked.length}`,
    "",
    "## Page export matrix",
    "",
    "| Route | Canonical route | Source hash | Rendered hash | Answer surface | Schema | Canonical | Local SEO | Conversion | Readiness | Blockers |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...pages.map((page) => `| \`${page.route}\` | \`${page.canonicalRoute}\` | \`${page.currentSourceTextHash ?? "MISSING"}\` | \`${page.currentRenderedTextHash ?? "MISSING"}\` | ${page.answerSurfaceStatus} | ${page.schemaStatus} | ${page.canonicalStatus} | ${page.localSeoStatus} | ${page.conversionStatus} | ${page.implementationReadiness} | ${page.blockerReasons.length ? page.blockerReasons.join("; ") : "None"} |`),
    "",
    "## Source text locations",
    "",
    ...pages.map((page) => `- \`${page.route}\`: ${page.sourceExcerptOrTextLocation?.textExport ?? "BLOCKED"} from \`${page.sourceFilePath}\`.`),
    "",
  ].join("\n");

  await writeText("reports/WEBSITE_OS_TREATMENT_SOURCE_TRUTH_HASH_EXPORT_V1.md", md);

  console.log(`[export-treatment-source-truth-hashes] wrote reports/WEBSITE_OS_TREATMENT_SOURCE_TRUTH_HASH_EXPORT_V1.json`);
  console.log(`[export-treatment-source-truth-hashes] wrote reports/WEBSITE_OS_TREATMENT_SOURCE_TRUTH_HASH_EXPORT_V1.md`);
  console.log(`[export-treatment-source-truth-hashes] ready=${report.summary.readyForAgentStaging.length} partial=${report.summary.partial.length} blocked=${report.summary.blocked.length}`);
};

main().catch((error) => {
  console.error("[export-treatment-source-truth-hashes] failed", error);
  process.exit(1);
});
