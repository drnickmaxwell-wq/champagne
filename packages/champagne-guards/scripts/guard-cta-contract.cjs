const { arbitrateCtaSurfaces } = require("../../champagne-sections/src/ctaSurfaceArbitrator");
const { getSectionStack } = require("../../champagne-sections/src/SectionRegistry");
const { normalizeSectionsForMidCTA } = require("../../champagne-sections/src/ctaPlacement");
const { resolveTreatmentMidCTAPlan } = require("../../champagne-sections/src/treatmentMidCtaPlan");
const { resolveTreatmentClosingCTAPlan } = require("../../champagne-sections/src/treatmentClosingCtaPlan");
const { getTreatmentPages } = require("../../champagne-manifests/src/helpers");

const pages = getTreatmentPages();

const contractSummary = {
  scanned: 0,
  dropped: 0,
  invalid: 0,
  selfLinks: 0,
  labelMismatches: 0,
  alternativeMismatches: 0,
};

const selfLinkIssues = [];
const semanticIssues = [];
const invalidTargets = [];
const missingClosing = [];
const duplicateClosing = [];
const surfaceMap = [];

pages.forEach((page) => {
  const sections = getSectionStack(page.path);
  const { ordered } = normalizeSectionsForMidCTA(sections);
  const arbitration = arbitrateCtaSurfaces({ sections: ordered, pageSlug: page.path });

  const midEntries = ordered
    .map((section, index) => (section.kind === "treatment_mid_cta" ? { section, index } : undefined))
    .filter(Boolean);

  const midPlans = midEntries.map((entry) => ({ index: entry.index, plan: resolveTreatmentMidCTAPlan(entry.section, page.path) }));
  const renderedMid = midPlans.filter((entry) => !arbitration.absorbedMidSectionIndices.has(entry.index));
  const renderedMidButtons = renderedMid.flatMap((entry) => entry.plan.resolvedCTAs);

  const closingEntries = ordered
    .map((section, index) => (section.kind === "treatment_closing_cta" ? { section, index } : undefined))
    .filter(Boolean);

  const closingPlans = closingEntries.map((entry) => ({
    index: entry.index,
    plan: resolveTreatmentClosingCTAPlan({
      section: entry.section,
      pageSlug: page.path,
      usedHrefs: renderedMidButtons.map((cta) => cta.href),
      absorbedMidCtas: arbitration.absorbedMidCtas,
    }),
  }));

  const visibleClosings = closingPlans.filter((entry) => !arbitration.suppressedClosingIndices.has(entry.index));
  const visibleClosingButtons = visibleClosings.flatMap((entry) => entry.plan.buttons);

  const closingIndices = visibleClosings.map((entry) => entry.index);
  const midIndex = renderedMid.length > 0 ? renderedMid[0].index : -1;

  surfaceMap.push({
    path: page.path,
    slug: page.slug,
    midIndex,
    closingIndices,
    midButtons: renderedMidButtons.map((cta) => ({ label: cta.label, href: cta.href })),
    closingButtons: visibleClosingButtons.map((cta) => ({ label: cta.label, href: cta.href })),
    midAudit: renderedMid[0]?.plan.audit.contract,
    closingAudit: visibleClosings[0]?.plan.audit.contract,
  });

  const audits = [];
  renderedMid.forEach((entry) => entry.plan.audit.contract && audits.push(entry.plan.audit.contract));
  visibleClosings.forEach((entry) => entry.plan.audit.contract && audits.push(entry.plan.audit.contract));

  audits.forEach((audit) => {
    contractSummary.scanned += audit.scanned;
    contractSummary.dropped += audit.dropped.length;
    contractSummary.invalid += audit.invalidTargets.length;
    contractSummary.selfLinks += audit.selfLinks.length;
    contractSummary.labelMismatches += audit.labelMismatches.length;
    contractSummary.alternativeMismatches += audit.alternativeMismatches.length;

    audit.selfLinks.forEach((issue) => selfLinkIssues.push(`${page.path}: ${issue.href ?? "unknown"} (${issue.label ?? "CTA"})`));
    audit.invalidTargets.forEach((issue) => invalidTargets.push(`${page.path}: ${issue.href ?? ""} — ${issue.reason ?? "invalid"}`));
    audit.labelMismatches.forEach((issue) =>
      semanticIssues.push(`${page.path}: ${issue.href ?? ""} expected '${issue.expected}' got '${issue.received}'`),
    );
    audit.alternativeMismatches.forEach((issue) =>
      semanticIssues.push(
        `${page.path}: ${issue.href ?? ""} has alternatives label without alternative relationship (${issue.relationship})`,
      ),
    );
  });

  if (visibleClosings.length === 0) {
    missingClosing.push(page.path);
  }
  if (visibleClosings.length > 1) {
    duplicateClosing.push(page.path);
  }
});

const fs = require("node:fs");
const path = require("node:path");
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const reportsDir = path.join(repoRoot, "REPORTS");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

const reportLines = [
  `# CTA Contract Audit`,
  ``,
  `- Scanned CTAs: ${contractSummary.scanned}`,
  `- Dropped: ${contractSummary.dropped}`,
  `- Invalid targets: ${contractSummary.invalid}`,
  `- Self-links: ${contractSummary.selfLinks}`,
  `- Label mismatches: ${contractSummary.labelMismatches}`,
  `- Alternative label mismatches: ${contractSummary.alternativeMismatches}`,
  `- Pages missing closing CTA: ${missingClosing.length}`,
  `- Pages with duplicate closing CTA: ${duplicateClosing.length}`,
];
fs.writeFileSync(path.join(reportsDir, "CTA_CONTRACT_AUDIT.md"), reportLines.join("\n"));

fs.writeFileSync(
  path.join(reportsDir, "CTA_SELF_LINKS.md"),
  selfLinkIssues.length ? selfLinkIssues.map((line) => `- ${line}`).join("\n") : "All clear.",
);

fs.writeFileSync(
  path.join(reportsDir, "CTA_SEMANTICS_AUDIT.md"),
  semanticIssues.length ? semanticIssues.map((line) => `- ${line}`).join("\n") : "All semantic templates aligned.",
);

const surfaceLines = [
  "# Treatment CTA Surface Map",
  "| Treatment | Mid index | Closing indices | Mid CTAs | Closing CTAs |",
  "| --- | --- | --- | --- | --- |",
  ...surfaceMap.map((entry) => {
    const midLabels = entry.midButtons.map((cta) => `${cta.label} (${cta.href})`).join("<br />") || "-";
    const closingLabels = entry.closingButtons.map((cta) => `${cta.label} (${cta.href})`).join("<br />") || "-";
    return `| ${entry.path} | ${entry.midIndex >= 0 ? entry.midIndex : "-"} | ${
      entry.closingIndices.length > 0 ? entry.closingIndices.join(", ") : "-"
    } | ${midLabels} | ${closingLabels} |`;
  }),
];
fs.writeFileSync(path.join(reportsDir, "TREATMENT_CTA_SURFACE_MAP.md"), surfaceLines.join("\n"));

const fillingsReport = [
  `# FILLINGS_PAGE_ADDED`,
  `- slug: /treatments/dental-fillings`,
  `- routeId: treatments.dental-fillings`,
  `- manifest: packages/champagne-manifests/data/sections/smh/treatments.dental-fillings.json`,
  `- machine manifest entry: packages/champagne-manifests/data/champagne_machine_manifest_full.json`,
];
fs.writeFileSync(path.join(reportsDir, "FILLINGS_PAGE_ADDED.md"), fillingsReport.join("\n"));

const errors = [];
if (contractSummary.selfLinks > 0) errors.push(`Self-links detected (${contractSummary.selfLinks})`);
if (contractSummary.invalid > 0) errors.push(`Invalid CTA targets detected (${contractSummary.invalid})`);
if (contractSummary.labelMismatches > 0) errors.push(`Label mismatches detected (${contractSummary.labelMismatches})`);
if (contractSummary.alternativeMismatches > 0)
  errors.push(`Alternative label semantics mismatched (${contractSummary.alternativeMismatches})`);
if (missingClosing.length > 0) errors.push(`Missing closing CTA on ${missingClosing.length} pages`);
if (duplicateClosing.length > 0) errors.push(`Duplicate closing CTAs on ${duplicateClosing.length} pages`);

if (errors.length > 0) {
  if (invalidTargets.length > 0) {
    console.error("Invalid CTA targets detail:\n" + invalidTargets.join("\n"));
  }
  if (semanticIssues.length > 0) {
    console.error("Semantic CTA label issues:\n" + semanticIssues.join("\n"));
  }
  throw new Error("CTA contract guard failed:\n" + errors.map((err) => `- ${err}`).join("\n"));
}

console.log("CTA contract guard passed.");
