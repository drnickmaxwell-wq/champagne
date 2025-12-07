import type { ReactNode } from "react";
import "@champagne/tokens";
import { Section_FeatureList } from "./Section_FeatureList";
import { Section_MediaBlock } from "./Section_MediaBlock";
import { Section_TextBlock } from "./Section_TextBlock";
import { getSectionStack } from "./SectionRegistry";
import type { SectionRegistryEntry } from "./SectionRegistry";

export interface ChampagneSectionRendererProps {
  pageSlug: string;
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
  const component = section.type ? typeMap[section.type] : undefined;
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

export function ChampagneSectionRenderer({ pageSlug }: ChampagneSectionRendererProps) {
  const sections = getSectionStack(pageSlug);

  return (
    <div style={{ display: "grid", gap: "clamp(1rem, 2vw, 1.75rem)", marginTop: "0.5rem" }}>
      {sections.map((section) => (
        <div key={section.id ?? section.type}>{renderSection(section)}</div>
      ))}
      {sections.length === 0 && <Section_TextBlock />}
    </div>
  );
}
