import type { SectionComponentRegistry, SectionComponentProps, SectionRegistryEntry } from "@champagne/sections";
import {
  Section_FAQ,
  Section_FeatureList,
  Section_MediaBlock,
  Section_TreatmentClosingCTA,
  Section_TreatmentOverviewRich,
} from "@champagne/sections";

function normalizeTitle(value?: string) {
  if (!value) return undefined;
  return value.replace(/[._]/g, " ");
}

function toRegistryEntry(section: SectionComponentProps["section"]): SectionRegistryEntry {
  return {
    id: section.instanceId,
    type: section.componentId,
    title: normalizeTitle(section.variantId) ?? normalizeTitle(section.componentId),
    eyebrow: section.seoRole ?? section.slot,
    definition: section as unknown as SectionRegistryEntry["definition"],
  } satisfies SectionRegistryEntry;
}

export const sectionComponentRegistry: SectionComponentRegistry = {
  section_treatment_intro: ({ section }) => <Section_TreatmentOverviewRich section={toRegistryEntry(section)} />,
  section_before_after_grid: ({ section }) => <Section_MediaBlock section={toRegistryEntry(section)} />,
  section_implant_steps: ({ section }) => <Section_FeatureList section={toRegistryEntry(section)} />,
  section_finance_summary: ({ section }) => <Section_FeatureList section={toRegistryEntry(section)} />,
  section_faq: ({ section }) => <Section_FAQ section={toRegistryEntry(section)} />,
  section_contact_cta: ({ section }) => <Section_TreatmentClosingCTA section={toRegistryEntry(section)} />,
};
