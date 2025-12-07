import type { ReactNode } from "react";
import "@champagne/tokens";
import { Section_FeatureList } from "./Section_FeatureList";
import { Section_MediaBlock } from "./Section_MediaBlock";
import { Section_TextBlock } from "./Section_TextBlock";
import { getSectionStack } from "./SectionRegistry";

export interface ChampagneSectionRendererProps {
  pageSlug: string;
}

const typeMap: Record<string, () => ReactNode> = {
  text: () => <Section_TextBlock />,
  copy: () => <Section_TextBlock />,
  media: () => <Section_MediaBlock />,
  gallery: () => <Section_MediaBlock />,
  features: () => <Section_FeatureList />,
};

function renderSection(type?: string) {
  if (!type) return <Section_TextBlock />;
  if (typeMap[type]) return typeMap[type]();

  // Coerce common manifest types to placeholders
  if (["copy-block", "story", "faq", "accordion"].includes(type)) return <Section_TextBlock />;
  if (["grid", "gallery", "carousel", "map", "slider"].includes(type)) return <Section_MediaBlock />;
  if (["feature-grid", "steps"].includes(type)) return <Section_FeatureList />;

  return <Section_TextBlock />;
}

export function ChampagneSectionRenderer({ pageSlug }: ChampagneSectionRendererProps) {
  const sections = getSectionStack(pageSlug);

  return (
    <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
      {sections.map((section) => (
        <div key={section.id ?? section.type}>
          {renderSection(section.type)}
        </div>
      ))}
      {sections.length === 0 && (
        <Section_TextBlock />
      )}
    </div>
  );
}
