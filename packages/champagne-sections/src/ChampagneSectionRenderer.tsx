import { Fragment, type ReactNode } from "react";
import "@champagne/tokens";
import type { ChampagneCTAConfig } from "@champagne/cta";
import { ChampagneCTAGroup } from "@champagne/cta";
import { Section_FeatureList } from "./Section_FeatureList";
import { Section_MediaBlock } from "./Section_MediaBlock";
import { Section_FAQ } from "./Section_FAQ";
import { Section_ClinicianInsight } from "./Section_ClinicianInsight";
import { Section_PatientStoriesRail } from "./Section_PatientStoriesRail";
import { Section_TextBlock } from "./Section_TextBlock";
import { Section_TreatmentClosingCTA } from "./Section_TreatmentClosingCTA";
import { Section_TreatmentMidCTA } from "./Section_TreatmentMidCTA";
import { Section_TreatmentMediaFeature } from "./Section_TreatmentMediaFeature";
import { Section_TreatmentOverviewRich } from "./Section_TreatmentOverviewRich";
import { Section_TreatmentRoutingCards } from "./Section_TreatmentRoutingCards";
import { Section_TreatmentToolsTrio } from "./Section_TreatmentToolsTrio";
import { getSectionStack } from "./SectionRegistry";
import type { SectionRegistryEntry } from "./SectionRegistry";
import { Section_GoogleReviews } from "./Section_GoogleReviews";
import { arbitrateCtaSurfaces } from "./ctaSurfaceArbitrator";
import { normalizeSectionsForMidCTA } from "./ctaPlacement";

export interface ChampagneSectionRendererProps {
  pageSlug: string;
  midPageCTAs?: ChampagneCTAConfig[];
  footerCTAs?: ChampagneCTAConfig[];
  previewMode?: boolean;
}

type SectionComponent = (props: {
  section: SectionRegistryEntry;
  ctas?: ChampagneCTAConfig[];
  footerCTAs?: ChampagneCTAConfig[];
  pageSlug?: string;
  usedMidCtaHrefs?: string[];
  absorbedMidCtas?: ChampagneCTAConfig[];
}) => ReactNode;

const typeMap: Record<string, SectionComponent> = {
  text: (props) => <Section_TextBlock {...props} />,
  copy: (props) => <Section_TextBlock {...props} />,
  media: (props) => <Section_MediaBlock {...props} />,
  gallery: (props) => <Section_MediaBlock {...props} />,
  features: (props) => <Section_FeatureList {...props} />,
  treatment_overview_rich: (props) => <Section_TreatmentOverviewRich {...props} />,
  treatment_media_feature: (props) => <Section_TreatmentMediaFeature {...props} />,
  treatment_tools_trio: (props) => <Section_TreatmentToolsTrio {...props} />,
  routing_cards: (props) => <Section_TreatmentRoutingCards {...props} />,
  clinician_insight: (props) => <Section_ClinicianInsight {...props} />,
  patient_stories_rail: (props) => <Section_PatientStoriesRail {...props} />,
  treatment_mid_cta: (props) => <Section_TreatmentMidCTA {...props} />,
  treatment_faq_block: (props) => <Section_FAQ {...props} />,
  treatment_closing_cta: (props) => <Section_TreatmentClosingCTA {...props} />,
  reviews: (props) => <Section_GoogleReviews {...props} />,
};

function isClosingCTA(section: SectionRegistryEntry) {
  const kind = section.kind ?? section.type;
  const definition = section.definition as { type?: string; componentId?: string } | undefined;
  const componentId = (definition?.componentId ?? (section as { componentId?: string }).componentId) ?? "";
  const definitionType = definition?.type;

  return (
    kind === "treatment_closing_cta"
    || componentId === "treatment.cta"
    || definitionType === "treatment_closing_cta"
    || kind === "cta"
  );
}

function enforceSingleClosingCTA(sections: SectionRegistryEntry[]) {
  const closingIndices = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => isClosingCTA(section))
    .map(({ index }) => index);

  if (closingIndices.length <= 1) {
    return { ordered: sections, suppressed: new Set<number>() } as const;
  }

  // Keep the terminal CTA closest to the end of the stack and drop earlier duplicates.
  const keepIndex = closingIndices[closingIndices.length - 1];
  const suppressed = new Set<number>(closingIndices.filter((index) => index !== keepIndex));
  const ordered = sections.filter((_, index) => !suppressed.has(index));

  return { ordered, suppressed } as const;
}

function renderSection(
  section: SectionRegistryEntry,
  footerCTAs?: ChampagneCTAConfig[],
  pageSlug?: string,
  usedMidCtaHrefs?: string[],
  absorbedMidCtas?: ChampagneCTAConfig[],
) {
  const key = section.kind ?? section.type;
  const component = key ? typeMap[key] : undefined;
  if (component) {
    const props = key === "treatment_closing_cta"
      ? {
          section,
          ctas: footerCTAs && footerCTAs.length > 0 ? footerCTAs : undefined,
          footerCTAs,
          pageSlug,
          usedMidCtaHrefs,
          absorbedMidCtas,
        }
      : key === "treatment_mid_cta"
        ? { section, pageSlug }
        : { section };
    return component(props);
  }

  if (["copy-block", "story", "faq", "accordion"].includes(section.type ?? "")) {
    return <Section_TextBlock section={section} />;
  }
  if (["grid", "gallery", "carousel", "map", "slider"].includes(section.type ?? "")) {
    return <Section_MediaBlock section={section} />;
  }
  if (["feature-grid", "steps"].includes(section.type ?? "")) {
    return <Section_FeatureList section={section} />;
  }

  return <Section_TextBlock section={section} />;
}

export function ChampagneSectionRenderer({ pageSlug, midPageCTAs, footerCTAs, previewMode }: ChampagneSectionRendererProps) {
  const sections = getSectionStack(pageSlug);
  const isTreatmentPage = pageSlug.includes("/treatments/");
  const { ordered: withSingleClosing } = isTreatmentPage ? enforceSingleClosingCTA(sections) : { ordered: sections };
  const { ordered: normalizedSections } = normalizeSectionsForMidCTA(withSingleClosing);
  const hasManifestMidCTA = normalizedSections.some((section) => section.kind === "treatment_mid_cta");
  const hasMidPageCTAs = !hasManifestMidCTA && (midPageCTAs?.length ?? 0) > 0;
  const midInsertIndex = hasMidPageCTAs ? Math.max(1, Math.ceil(normalizedSections.length / 2)) : -1;
  const hasClosingCTASection = normalizedSections.some((section) => section.kind === "treatment_closing_cta");
  const arbitration = arbitrateCtaSurfaces({ sections: normalizedSections, pageSlug });
  const usedMidCtaHrefs = hasMidPageCTAs
    ? (midPageCTAs ?? []).map((cta) => cta.href).filter(Boolean)
    : arbitration.renderedMidCtaHrefs;
  const absorbedMidCtas = hasMidPageCTAs ? undefined : arbitration.absorbedMidCtas;

  return (
    <div style={{ display: "grid", gap: "clamp(1.2rem, 2.4vw, 2rem)", marginTop: "0.5rem" }}>
      <div
        style={{
          display: "grid",
          gap: "clamp(1rem, 2vw, 1.75rem)",
          maxWidth: "1080px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {normalizedSections.map((section, index) => {
          if (arbitration.absorbedMidSectionIndices.has(index) && section.kind === "treatment_mid_cta") return null;
          if (arbitration.suppressedClosingIndices.has(index) && section.kind === "treatment_closing_cta") return null;
          return (
            <Fragment key={section.id ?? section.type ?? `${pageSlug}-section-${index}`}>
              <div>{renderSection(section, footerCTAs, pageSlug, usedMidCtaHrefs, absorbedMidCtas)}</div>
              {hasMidPageCTAs && index === midInsertIndex - 1 && (
                <ChampagneCTAGroup
                  ctas={midPageCTAs}
                  label="Mid-page CTAs"
                  showDebug={previewMode}
                  defaultVariant="secondary"
                />
              )}
            </Fragment>
          );
        })}
        {normalizedSections.length === 0 && <Section_TextBlock />}
        {normalizedSections.length === 0 && hasMidPageCTAs && (
          <ChampagneCTAGroup
            ctas={midPageCTAs}
            label="Mid-page CTAs"
            showDebug={previewMode}
            defaultVariant="secondary"
          />
        )}
        {footerCTAs && footerCTAs.length > 0 && !hasClosingCTASection && (
          <ChampagneCTAGroup
            ctas={footerCTAs}
            label="Footer CTAs"
            direction="row"
            defaultVariant="ghost"
            showDebug={previewMode}
          />
        )}
      </div>
    </div>
  );
}
