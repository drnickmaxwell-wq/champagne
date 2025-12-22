import type { SectionRegistryEntry } from "./SectionRegistry";

function isPlanningAnchor(section: SectionRegistryEntry) {
  const source = `${section.id ?? ""} ${section.type ?? ""} ${section.title ?? ""}`.toLowerCase();
  return /process|timeline|plan|step|option|approach|stages/.test(source);
}

function findPreferredMidIndex(sections: SectionRegistryEntry[]) {
  const faqIndex = sections.findIndex((entry) => entry.kind === "treatment_faq_block");
  const closingIndex = sections.findIndex((entry) => entry.kind === "treatment_closing_cta");
  const planningIndex = sections.findIndex(isPlanningAnchor);
  const optionsIndex = sections.findIndex((entry) => /option|choice|compare/i.test(entry.title ?? entry.id ?? ""));

  let target = planningIndex >= 0 ? planningIndex + 1 : optionsIndex >= 0 ? optionsIndex + 1 : Math.max(1, Math.floor(sections.length / 3));

  if (faqIndex >= 0 && target > faqIndex) {
    target = faqIndex;
  }

  if (closingIndex >= 0 && target >= closingIndex - 1) {
    target = Math.max(1, closingIndex - 2);
  }

  return Math.max(1, Math.min(target, sections.length));
}

export function normalizeSectionsForMidCTA(sections: SectionRegistryEntry[]) {
  const midSections = sections.filter((section) => section.kind === "treatment_mid_cta");
  if (midSections.length === 0) {
    return { ordered: sections, suppressedIds: new Set<string>() };
  }

  const baseSections = sections.filter((section) => section.kind !== "treatment_mid_cta");
  const preferredIndex = findPreferredMidIndex(baseSections);
  const ordered = [...baseSections];
  ordered.splice(Math.min(preferredIndex, ordered.length), 0, midSections[0]);
  const suppressedIds = new Set<string>(midSections.slice(1).map((entry) => entry.id ?? entry.type ?? ""));

  return { ordered, suppressedIds };
}
