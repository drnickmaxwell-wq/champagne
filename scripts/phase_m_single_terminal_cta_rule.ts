import type { SectionRegistryEntry } from "../packages/champagne-sections/src/SectionRegistry";
import type { ChampagneTreatmentPage } from "../packages/champagne-manifests/src/helpers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
(require as NodeRequire).extensions[".css"] = () => {};

// Using require keeps the CSS stub in place before dependencies are resolved.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getTreatmentPages } = require("../packages/champagne-manifests/src/helpers");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getSectionStack } = require("../packages/champagne-sections/src/SectionRegistry");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { arbitrateCtaSurfaces, getTerminalWindowSize } = require("../packages/champagne-sections/src/ctaSurfaceArbitrator");

type PageEntry = {
  page: string;
  sections: SectionRegistryEntry[];
  absorbedMid: boolean;
  legacyTerminalBoxes: number;
  terminalBoxesAfter: number;
  legacyAbsorbed: Set<number>;
  absorbedIndices: Set<number>;
  suppressedClosings: Set<number>;
};

function legacyAbsorption(sections: SectionRegistryEntry[]) {
  const closingIndex = sections.findIndex((section) => section.kind === "treatment_closing_cta");
  const midIndex = sections.findIndex((section) => section.kind === "treatment_mid_cta");
  const shouldAbsorb = closingIndex >= 0 && midIndex >= 0 && (midIndex >= sections.length - 2 || midIndex >= closingIndex - 1);
  const absorbed = shouldAbsorb && midIndex >= 0 ? new Set([midIndex]) : new Set<number>();
  return { absorbed, closingIndex, midIndex };
}

function countTerminalCtaBoxes(
  sections: SectionRegistryEntry[],
  absorbedIndices: Set<number>,
  suppressedClosings: Set<number> = new Set<number>(),
) {
  const terminalWindow = getTerminalWindowSize(sections.length);
  const terminalStart = Math.max(0, sections.length - terminalWindow);

  return sections.reduce((count, section, index) => {
    if (index < terminalStart) return count;
    if (absorbedIndices.has(index) || suppressedClosings.has(index)) return count;
    if (section.kind === "treatment_mid_cta" || section.kind === "treatment_closing_cta") return count + 1;
    return count;
  }, 0);
}

function describeSection(section: SectionRegistryEntry) {
  return section.kind ?? section.type ?? "unknown";
}

function formatExample(
  pageSlug: string,
  sections: SectionRegistryEntry[],
  absorbedAfter: Set<number>,
  suppressedClosings: Set<number>,
) {
  const midIndices = sections.reduce<number[]>((list, section, index) => {
    if (section.kind === "treatment_mid_cta") list.push(index);
    return list;
  }, []);
  const closingIndices = sections.reduce<number[]>((list, section, index) => {
    if (section.kind === "treatment_closing_cta") list.push(index);
    return list;
  }, []);
  const sectionOrder = sections.map(describeSection).join(" > ");

  return {
    page: pageSlug,
    sectionOrder,
    midCTAIndices: midIndices,
    closingCTAIndices: closingIndices,
    absorbedMidCTAIndices: Array.from(absorbedAfter.values()).sort((a, b) => a - b),
    suppressedClosingCTAIndices: Array.from(suppressedClosings.values()).sort((a, b) => a - b),
  };
}

function main() {
  const pages = getTreatmentPages() as ChampagneTreatmentPage[];
  const entries: PageEntry[] = pages.map((page) => {
    const sections = getSectionStack(page.path) as SectionRegistryEntry[];
    const legacy = legacyAbsorption(sections);
    const legacyTerminalBoxes = countTerminalCtaBoxes(sections, legacy.absorbed);

    const arbitration = arbitrateCtaSurfaces({ sections, pageSlug: page.path });
    const terminalBoxesAfter = countTerminalCtaBoxes(
      sections,
      arbitration.absorbedMidSectionIndices,
      arbitration.suppressedClosingIndices,
    );
    const absorbedMid = arbitration.absorbedMidSectionIndices.size > 0;

    return {
      page: page.path,
      sections,
      absorbedMid,
      legacyTerminalBoxes,
      terminalBoxesAfter,
      legacyAbsorbed: legacy.absorbed,
      absorbedIndices: arbitration.absorbedMidSectionIndices,
      suppressedClosings: arbitration.suppressedClosingIndices,
    };
  });

  const absorbedPages = entries.filter((entry) => entry.absorbedMid);
  const closingSuppressed = entries.filter((entry) => entry.suppressedClosings.size > 0);
  const beforeTerminalOverflow = entries.filter((entry) => entry.legacyTerminalBoxes > 1);
  const afterTerminalOverflow = entries.filter((entry) => entry.terminalBoxesAfter > 1);

  const examplePool = [...closingSuppressed, ...absorbedPages];
  const examples: ReturnType<typeof formatExample>[] = [];
  const seen = new Set<string>();

  for (const entry of examplePool) {
    if (examples.length >= 10) break;
    if (seen.has(entry.page)) continue;
    seen.add(entry.page);
    examples.push(formatExample(entry.page, entry.sections, entry.absorbedIndices, entry.suppressedClosings));
  }

  const summary = {
    totalTreatmentPages: entries.length,
    absorbedPages: absorbedPages.length,
    terminalOverflowBefore: beforeTerminalOverflow.length,
    terminalOverflowAfter: afterTerminalOverflow.length,
    overflowPagesAfter: afterTerminalOverflow.slice(0, 10).map((entry) => entry.page),
    examples,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main();
export {};
