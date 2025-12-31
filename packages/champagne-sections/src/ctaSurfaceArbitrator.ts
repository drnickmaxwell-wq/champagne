import type { ChampagneCTAConfig } from "@champagne/cta";
import type { SectionRegistryEntry } from "./SectionRegistry";
import { resolveTreatmentMidCTAPlan, type MidCTAPlanResult } from "./treatmentMidCtaPlan";

const TERMINAL_WINDOW_RATIO = 0.25;
const TERMINAL_WINDOW_MIN = 3;
const LIGHT_SEPARATOR_KINDS = new Set(["treatment_faq_block", "reviews"]);

function isClosingSection(section: SectionRegistryEntry) {
  const kind = section.kind ?? section.type;
  const definition = section.definition as { type?: string; componentId?: string } | undefined;
  const componentId = (definition?.componentId ?? (section as { componentId?: string }).componentId) ?? "";
  const definitionType = definition?.type;

  return (
    kind === "treatment_closing_cta"
    || kind === "cta"
    || componentId === "treatment.cta"
    || definitionType === "treatment_closing_cta"
  );
}

function isWithinTerminalZone(index: number, totalSections: number) {
  const terminalWindow = getTerminalWindowSize(totalSections);
  const terminalStartIndex = Math.max(0, totalSections - terminalWindow);
  return index >= terminalStartIndex;
}

function hasOnlyLightSeparators(sections: SectionRegistryEntry[], start: number, end: number) {
  if (end <= start + 1) return true;
  return sections.slice(start + 1, end).every((section) => {
    const separatorKind = section.kind ?? section.type;
    return separatorKind ? LIGHT_SEPARATOR_KINDS.has(separatorKind) : false;
  });
}

function shouldAbsorbMidCTA({
  midIndex,
  closingIndex,
  sections,
}: {
  midIndex: number;
  closingIndex: number;
  sections: SectionRegistryEntry[];
}): boolean {
  if (midIndex < 0 || closingIndex < 0 || midIndex > closingIndex) return false;
  const withinTerminal = isWithinTerminalZone(midIndex, sections.length);
  const tightlyStacked = closingIndex - midIndex <= 2;
  const lightlySeparated = closingIndex - midIndex <= 3 && hasOnlyLightSeparators(sections, midIndex, closingIndex);

  return withinTerminal || tightlyStacked || lightlySeparated;
}

export function getTerminalWindowSize(sectionCount: number) {
  if (sectionCount <= 0) return TERMINAL_WINDOW_MIN;
  return Math.max(TERMINAL_WINDOW_MIN, Math.ceil(sectionCount * TERMINAL_WINDOW_RATIO));
}

export interface CTASurfaceArbitrationResult {
  absorbedMidSectionIndices: Set<number>;
  absorbedMidCtas: ChampagneCTAConfig[];
  renderedMidCtaHrefs: string[];
  closingIndex: number;
  suppressedClosingIndices: Set<number>;
}

export function arbitrateCtaSurfaces({
  sections,
  pageSlug,
}: {
  sections: SectionRegistryEntry[];
  pageSlug?: string;
}): CTASurfaceArbitrationResult {
  const closingIndices = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => isClosingSection(section))
    .map(({ index }) => index);
  const closingIndex = closingIndices.length > 0 ? closingIndices[closingIndices.length - 1] : -1;
  const suppressedClosingIndices = new Set<number>();
  closingIndices.forEach((index) => {
    if (index === closingIndex) return;
    suppressedClosingIndices.add(index);
  });
  const midSections: { section: SectionRegistryEntry; index: number; plan?: MidCTAPlanResult }[] = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.kind === "treatment_mid_cta")
    .map((entry) => ({ ...entry, plan: resolveTreatmentMidCTAPlan(entry.section, pageSlug) }));

  const absorbedMidSectionIndices = new Set<number>();
  const absorbedMidCtas: ChampagneCTAConfig[] = [];

  midSections.forEach((entry) => {
    if (shouldAbsorbMidCTA({
      midIndex: entry.index,
      closingIndex,
      sections,
    })) {
      absorbedMidSectionIndices.add(entry.index);
      absorbedMidCtas.push(...(entry.plan?.resolvedCTAs ?? []));
    }
  });

  const renderedMidCtaHrefs = midSections
    .filter((entry) => !absorbedMidSectionIndices.has(entry.index))
    .flatMap((entry) => entry.plan?.resolvedCTAs ?? [])
    .map((cta) => cta.href)
    .filter((href): href is string => Boolean(href));

  return {
    absorbedMidSectionIndices,
    absorbedMidCtas,
    renderedMidCtaHrefs,
    closingIndex,
    suppressedClosingIndices,
  };
}
