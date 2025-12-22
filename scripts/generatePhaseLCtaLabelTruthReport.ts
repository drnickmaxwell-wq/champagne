import fs from "fs";
import path from "path";
import { getTreatmentPages, type ChampagneTreatmentPage } from "../packages/champagne-manifests/src/helpers";
import { getSectionStack } from "../packages/champagne-sections/src/SectionRegistry";
import { resolveTreatmentMidCTAPlan } from "../packages/champagne-sections/src/treatmentMidCtaPlan";
import { resolveTreatmentClosingCTAPlan } from "../packages/champagne-sections/src/treatmentClosingCtaPlan";
import {
  getCtaLabelTruthAudit,
  resetCtaLabelTruthAudit,
  type LabelTruthRewrite,
} from "../packages/champagne-sections/src/ctaLabelTruth";

function formatRewriteSummary(rewrites: LabelTruthRewrite[]) {
  const counter = rewrites.reduce<Record<string, { count: number; sample: LabelTruthRewrite }>>((acc, rewrite) => {
    const key = `${rewrite.before ?? "(empty)"}|${rewrite.after}|${rewrite.href ?? ""}`;
    if (!acc[key]) {
      acc[key] = { count: 0, sample: rewrite };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  return Object.values(counter)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .map((entry) => ({ ...entry.sample, count: entry.count }));
}

function buildExamples(examples: { page: string; mid: { label: string; href: string }[]; closing: { label: string; href: string }[] }[]) {
  return examples
    .map((example) => {
      const midLines = example.mid.map((cta) => `    - ${cta.label} (${cta.href})`).join("\n");
      const closingLines = example.closing.map((cta) => `    - ${cta.label} (${cta.href})`).join("\n");
      return [
        `- ${example.page}:`,
        `  Mid CTAs:`,
        midLines || "    - None",
        `  Closing CTAs:`,
        closingLines || "    - None",
      ].join("\n");
    })
    .join("\n");
}

function generateReport() {
  resetCtaLabelTruthAudit();
  const treatmentPages = getTreatmentPages();
  const examples: { page: string; mid: { label: string; href: string }[]; closing: { label: string; href: string }[] }[] = [];

  treatmentPages.forEach((page: ChampagneTreatmentPage) => {
    const sections = getSectionStack(page.path);
    const midSection = sections.find((section) => section.kind === "treatment_mid_cta");
    const closingSection = sections.find((section) => section.kind === "treatment_closing_cta");

    const midPlan = resolveTreatmentMidCTAPlan(midSection, page.path);
    const closingPlan = resolveTreatmentClosingCTAPlan({
      section: closingSection,
      pageSlug: page.path,
      usedHrefs: midPlan.resolvedCTAs.map((cta) => cta.href),
    });

    if (examples.length < 15) {
      examples.push({
        page: page.path,
        mid: midPlan.resolvedCTAs.map((cta) => ({ label: cta.label, href: cta.href })),
        closing: closingPlan.buttons.map((cta) => ({ label: cta.label, href: cta.href })),
      });
    }
  });

  const audit = getCtaLabelTruthAudit();
  const rewriteSummary = formatRewriteSummary(audit.rewrites);
  const reportLines = [
    "# Phase L CTA Label Truth Lock",
    "",
    `Total CTAs scanned: ${audit.scanned}`,
    `Labels rewritten: ${audit.rewritten}`,
    "",
    "## Top rewrites",
    ...rewriteSummary.map(
      (entry) => `- ${entry.before ?? "(empty)"} → ${entry.after} (${entry.href ?? ""}) — ${entry.count}x`,
    ),
    "",
    "## Ambiguous cases",
    ...(audit.ambiguous.length
      ? audit.ambiguous.map((entry) => `- ${entry.label ?? "(no label)"} (${entry.href ?? "(no href)"})`)
      : ["- None"]),
    "",
    "## Examples",
    buildExamples(examples),
  ];

  const outputPath = path.join("REPORTS", "PHASE_L_CTA_LABEL_TRUTH_LOCK.md");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, reportLines.join("\n"));
}

generateReport();
