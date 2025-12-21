import { writeFileSync } from "fs";
import { getSectionStyle, getTreatmentPages } from "../packages/champagne-manifests/src/helpers";
import { getSectionStackForPage } from "../packages/champagne-manifests/src/core";
import { resolveTreatmentMidCTAPlan } from "../packages/champagne-sections/src/treatmentMidCtaPlan";
import type { SectionRegistryEntry } from "../packages/champagne-sections/src/SectionRegistry";

interface SectionDefinition {
  id: string;
  type?: string;
  kind: string;
  title?: string;
  strapline?: string;
  ctas?: { id?: string; label?: string; href?: string; preset?: string; variant?: string }[];
}

function sentenceCase(input?: string) {
  if (!input) return "";
  return input
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const specializedKinds: Record<string, string> = {
  treatment_mid_cta: "treatment_mid_cta",
  cta: "treatment_mid_cta",
};

function deriveKind(type?: string) {
  if (!type) return "text";
  if (specializedKinds[type]) return specializedKinds[type];
  if (["routing_cards", "navigation_grid"].includes(type)) return "routing_cards";
  if (["feature-grid", "steps", "features", "feature-list", "pricing"].includes(type)) return "features";
  return "text";
}

function normalizeSection(section: unknown, pageSlug: string, index: number): SectionDefinition {
  const isString = typeof section === "string";
  const sectionId = isString ? (section as string) : (section as { id?: string }).id ?? `${pageSlug}-section-${index}`;
  const style = getSectionStyle(sectionId as string);
  const rawType = isString ? style?.type : (section as { type?: string }).type ?? style?.type;
  const kind = deriveKind(rawType as string | undefined);
  const definition = isString ? {} : (section as Record<string, unknown>);
  const title = (definition.title as string | undefined)
    ?? (definition.label as string | undefined)
    ?? sentenceCase(sectionId || `Section ${index + 1}`);

  return {
    id: sectionId as string,
    type: rawType as string | undefined,
    kind,
    title,
    strapline: definition.strapline as string | undefined,
    ctas: (definition.ctas as { id?: string; label?: string; href?: string; preset?: string; variant?: string }[] | undefined)
      ?? undefined,
  } satisfies SectionDefinition;
}

function renderButtonRows(buttons: ReturnType<typeof resolveTreatmentMidCTAPlan>["audit"]["before"]["buttons"]) {
  if (!buttons.length) return "| _None_ |  |  |  |  |  |\n";
  return buttons
    .map((button) =>
      [
        button.label ?? "",
        button.href ?? "",
        button.resolvedHref ?? "",
        button.resolvedLabel ?? "",
        button.status,
        button.invalidReason ?? "",
      ]
        .map((value) => value || "")
        .map((value) => value.replace(/\n/g, " "))
        .map((value) => value || "")
        .join(" | "),
    )
    .map((row) => `| ${row} |`)
    .join("\n");
}

function buildReport() {
  const treatments = getTreatmentPages();
  const results = treatments.map((page) => {
    const rawSections = getSectionStackForPage(page.path) ?? [];
    const normalizedSections = rawSections.map((section, index) => normalizeSection(section, page.path, index));
    const section = normalizedSections.find((entry) => entry.kind === "treatment_mid_cta");
    const plan = resolveTreatmentMidCTAPlan(section as unknown as SectionRegistryEntry | undefined, page.path);
    return { slug: page.slug, path: page.path, audit: plan.audit };
  });

  const totals = results.reduce(
    (acc, entry) => {
      acc.invalidBefore += entry.audit.before.invalidHrefCount;
      acc.invalidAfter += entry.audit.after.invalidHrefCount;
      acc.rawBefore += entry.audit.before.rawLabelCount;
      acc.rawAfter += entry.audit.after.rawLabelCount;
      acc.dropped.push(
        ...entry.audit.dropped.map((drop) => ({ ...drop, slug: entry.slug })),
      );
      if (entry.audit.usedFallbackDefaults) {
        acc.fallbacks.push(entry.slug);
      }
      return acc;
    },
    { invalidBefore: 0, invalidAfter: 0, rawBefore: 0, rawAfter: 0, dropped: [] as { slug: string; id?: string; label?: string; href?: string; reason: string }[], fallbacks: [] as string[] },
  );

  const lines: string[] = [];
  lines.push("# Mid CTA Hygiene Report");
  lines.push("");
  lines.push("## Summary");
  lines.push(`- Invalid hrefs before: ${totals.invalidBefore}`);
  lines.push(`- Invalid hrefs after: ${totals.invalidAfter}`);
  lines.push(`- Raw labels before: ${totals.rawBefore}`);
  lines.push(`- Raw labels after: ${totals.rawAfter}`);
  lines.push(`- Pages using fallback defaults: ${totals.fallbacks.length ? totals.fallbacks.join(", ") : "None"}`);
  if (totals.dropped.length) {
    lines.push("- Dropped CTAs: " + totals.dropped.map((drop) => `${drop.slug} → ${drop.href ?? drop.label ?? drop.id ?? "cta"} (${drop.reason})`).join(", "));
  } else {
    lines.push("- Dropped CTAs: None");
  }
  lines.push("");

  lines.push("## BEFORE");
  lines.push("");
  results.forEach((entry) => {
    lines.push(`### ${entry.slug}`);
    lines.push("");
    lines.push("| Label (raw) | Href (raw) | Resolved href | Resolved label | Status | Reason |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    lines.push(renderButtonRows(entry.audit.before.buttons));
    lines.push("");
  });

  lines.push("## AFTER");
  lines.push("");
  results.forEach((entry) => {
    lines.push(`### ${entry.slug}`);
    lines.push("");
    lines.push("| Label (raw) | Href (raw) | Resolved href | Resolved label | Status | Reason |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    lines.push(renderButtonRows(entry.audit.after.buttons));
    lines.push("");
  });

  const destination = "REPORTS/MID_CTA_HYGIENE_REPORT.md";
  writeFileSync(destination, lines.join("\n"));
}

buildReport();
