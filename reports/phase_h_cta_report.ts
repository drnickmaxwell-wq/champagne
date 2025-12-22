/* eslint-disable @typescript-eslint/no-var-requires */
(require as NodeRequire).extensions[".css"] = () => {};

const { getTreatmentPages } = require("../packages/champagne-manifests/src/helpers");
const { getSectionStack } = require("../packages/champagne-sections/src/SectionRegistry");
const { resolveTreatmentMidCTAPlan } = require("../packages/champagne-sections/src/treatmentMidCtaPlan");
const { resolveTreatmentClosingCTAPlan } = require("../packages/champagne-sections/src/treatmentClosingCtaPlan");
const { writeFileSync } = require("fs");
const path = require("path");

function formatList(values: string[]) {
  if (values.length === 0) return "(none)";
  return values.join(", ");
}

function main() {
  const treatments = getTreatmentPages();
  const total = treatments.length;
  let midTwoActions = 0;
  let midOneAction = 0;
  let midDuplicatesRemoved = 0;
  let closingDuplicatesRemoved = 0;
  const singleActionReasons: Record<string, number> = {};
  const examples: {
    slug: string;
    midBefore: string[];
    midAfter: string[];
    closingBefore: string[];
    closingAfter: string[];
  }[] = [];

  treatments.forEach((page: { path: string }) => {
    const sections = getSectionStack(page.path);
    const midSection = sections.find((section: { kind?: string }) => section.kind === "treatment_mid_cta");
    const closingSection = sections.find((section: { kind?: string }) => section.kind === "treatment_closing_cta");

    const midPlan = resolveTreatmentMidCTAPlan(midSection, page.path, 2);
    const midCount = midPlan.resolvedCTAs.length;
    if (midCount >= 2) {
      midTwoActions += 1;
    } else {
      midOneAction += 1;
      const dropReason = midPlan.audit.dropped.length > 0
        ? midPlan.audit.dropped[0]?.reason ?? "filtered"
        : "single unique CTA";
      singleActionReasons[dropReason] = (singleActionReasons[dropReason] ?? 0) + 1;
    }

    midDuplicatesRemoved += midPlan.audit.deduped.buttonsRemoved;

    const closingPlan = resolveTreatmentClosingCTAPlan({ section: closingSection, pageSlug: page.path });
    closingDuplicatesRemoved
      += closingPlan.audit.duplicatesRemoved.buttons + closingPlan.audit.duplicatesRemoved.supportingLines;

    if (examples.length < 10) {
      examples.push({
        slug: page.path,
        midBefore: midPlan.audit.before.buttons.map((button: { resolvedLabel?: string; label?: string }) =>
          button.resolvedLabel ?? button.label ?? "",
        ).filter(Boolean),
        midAfter: midPlan.resolvedCTAs.map((cta: { label: string }) => cta.label),
        closingBefore: closingPlan.audit.beforeButtons
          .map((cta: { label?: string } | string) => (typeof cta === "string" ? cta : cta.label ?? ""))
          .filter(Boolean),
        closingAfter: closingPlan.buttons.map((cta: { label: string }) => cta.label),
      });
    }
  });

  const reasonLines = Object.entries(singleActionReasons)
    .sort((a, b) => b[1] - a[1])
    .map(([reason, count]) => `- ${reason}: ${count}`)
    .join("\n");

  const exampleLines = examples
    .map((example) => {
      return [
        `- ${example.slug}:`,
        `  - Mid before: ${formatList(example.midBefore)}`,
        `  - Mid after: ${formatList(example.midAfter)}`,
        `  - Closing before: ${formatList(example.closingBefore)}`,
        `  - Closing after: ${formatList(example.closingAfter)}`,
      ].join("\n");
    })
    .join("\n");

  const report = `# Phase H CTA Dedupe and Mid Secondary Coverage\n\n`
    + `## Summary\n`
    + `- Added mid-surface secondary CTA support while prioritising manifest and journey definitions.\n`
    + `- Normalised and deduped CTA buttons and supporting lines to prevent repeated labels.\n`
    + `- Audited treatment pages for mid and closing CTA coverage.\n\n`
    + `## Counts\n`
    + `- Total treatment slugs scanned: ${total}\n`
    + `- Mid CTA boxes with 2 actions: ${midTwoActions}\n`
    + `- Mid CTA boxes with 1 action: ${midOneAction}\n`
    + `- Duplicates removed (mid): ${midDuplicatesRemoved}\n`
    + `- Duplicates removed (closing): ${closingDuplicatesRemoved}\n`
    + `- Single-action mid CTA reasons:\n${reasonLines || "- none"}\n\n`
    + `## Examples (labels before → after)\n${exampleLines}`;

  const reportPath = path.join(process.cwd(), "REPORTS/PHASE_H_CTA_DEDUPE_AND_MID_SECONDARY.md");
  writeFileSync(reportPath, report);
  console.log(`Report written to ${reportPath}`);
}

main();
