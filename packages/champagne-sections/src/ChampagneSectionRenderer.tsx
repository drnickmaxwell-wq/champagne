import { Fragment, type ReactNode } from "react";
import "@champagne/tokens";
import type { ChampagneCTAConfig } from "@champagne/cta";
import { ChampagneCTAGroup } from "@champagne/cta";
import { Section_FeatureList } from "./Section_FeatureList";
import { Section_MediaBlock } from "./Section_MediaBlock";
import { Section_TextBlock } from "./Section_TextBlock";
import { getSectionStack } from "./SectionRegistry";
import type { SectionRegistryEntry } from "./SectionRegistry";

export interface ChampagneSectionRendererProps {
  pageSlug: string;
  midPageCTAs?: ChampagneCTAConfig[];
  previewMode?: boolean;
}

type SectionComponent = (props: { section: SectionRegistryEntry }) => ReactNode;

const typeMap: Record<string, SectionComponent> = {
  text: (props) => <Section_TextBlock {...props} />,
  copy: (props) => <Section_TextBlock {...props} />,
  media: (props) => <Section_MediaBlock {...props} />,
  gallery: (props) => <Section_MediaBlock {...props} />,
  features: (props) => <Section_FeatureList {...props} />,
};

function renderSection(section: SectionRegistryEntry) {
  const key = section.kind ?? section.type;
  const component = key ? typeMap[key] : undefined;
  if (component) return component({ section });

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

export function ChampagneSectionRenderer({ pageSlug, midPageCTAs, previewMode }: ChampagneSectionRendererProps) {
  const sections = getSectionStack(pageSlug);
  const hasMidPageCTAs = (midPageCTAs?.length ?? 0) > 0;
  const midInsertIndex = hasMidPageCTAs ? Math.max(1, Math.ceil(sections.length / 2)) : -1;

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
        {sections.map((section, index) => (
          <Fragment key={section.id ?? section.type ?? `${pageSlug}-section-${index}`}>
            <div>{renderSection(section)}</div>
            {hasMidPageCTAs && index === midInsertIndex - 1 && (
              <ChampagneCTAGroup
                ctas={midPageCTAs}
                label="Mid-page CTAs"
                showDebug={previewMode}
                defaultPreset="secondary"
              />
            )}
          </Fragment>
        ))}
        {sections.length === 0 && <Section_TextBlock />}
        {sections.length === 0 && hasMidPageCTAs && (
          <ChampagneCTAGroup
            ctas={midPageCTAs}
            label="Mid-page CTAs"
            showDebug={previewMode}
            defaultPreset="secondary"
          />
        )}
      </div>
    </div>
  );
}
