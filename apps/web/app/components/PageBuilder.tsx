import type { ReactNode } from "react";
import type { ChampagneSectionLayoutSection } from "@champagne/manifests";
import { getSectionLayoutSections } from "@champagne/manifests";
import type { SectionComponentProps } from "@champagne/sections";
import { resolveSectionComponent } from "@champagne/sections";

import { sectionComponentRegistry } from "../sections";

type PageBuilderProps = {
  pageId: string;
  tenantId?: string;
};

function SectionShell({ section, children }: { section: ChampagneSectionLayoutSection; children?: ReactNode }) {
  return (
    <section
      id={section.instanceId}
      data-component-id={section.componentId}
      data-section-slot={section.slot}
      data-section-order={section.order}
      style={{
        padding: "clamp(1.25rem, 3vw, 2rem)",
        border: "1px solid var(--champagne-keyline-gold, currentColor)",
        borderRadius: "var(--radius-lg, 18px)",
        background: "color-mix(in srgb, var(--bg-ink, transparent) 78%, transparent)",
      }}
    >
      {children}
    </section>
  );
}

export default function PageBuilder({ pageId, tenantId = "smh-dental" }: PageBuilderProps) {
  const { layout, sections, validation } = getSectionLayoutSections(pageId, tenantId);

  if (!layout) {
    console.warn(`[champagne][page-builder] layout not found for ${pageId}`);
    return null;
  }

  if (!validation.valid) {
    console.warn(
      `[champagne][page-builder] layout validation issues for ${layout.routeId}: ${validation.errors.join(", ")}`,
    );
  }

  return (
    <div data-page-builder data-route-id={layout.routeId} data-tenant-id={layout.tenantId} style={{ display: "grid", gap: "1.5rem" }}>
      {sections.map((section, index) => {
        const Component = resolveSectionComponent(section.componentId, sectionComponentRegistry);

        if (!Component) {
          return null;
        }

        const componentProps: SectionComponentProps = {
          pageId: layout.routeId,
          tenantId: layout.tenantId,
          layout,
          section,
          index,
        };

        return (
          <SectionShell key={section.instanceId ?? `${layout.routeId}-${index}`} section={section}>
            <Component {...componentProps} />
          </SectionShell>
        );
      })}
    </div>
  );
}
