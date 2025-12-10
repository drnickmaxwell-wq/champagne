import { getSectionLayoutSections } from "@champagne/manifests";
import { computeFxProps, resolveSectionComponent, type SectionComponentProps } from "@champagne/sections";
import SectionShell from "./sections/SectionShell";
import { sectionComponentRegistry } from "../sections";

type PageBuilderProps = {
  pageId: string;
  tenantId?: string;
};

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
    <div
      data-page-builder
      data-route-id={layout.routeId}
      data-tenant-id={layout.tenantId}
      style={{ display: "grid", gap: "1.5rem" }}
    >
      {sections.map((section, index) => {
        const Component = resolveSectionComponent(section.componentId) ?? sectionComponentRegistry[section.componentId];

        if (!Component) {
          console.warn(`[champagne][page-builder] missing component for ${section.componentId}`);
          return null;
        }

        const componentProps: SectionComponentProps = {
          pageId: layout.routeId,
          tenantId: layout.tenantId,
          layout,
          section,
          index,
          fx: computeFxProps(section),
        };

        const fxProps = componentProps.fx ?? {};

        return (
          <div
            key={section.instanceId ?? `${layout.routeId}-${index}`}
            data-component-id={section.componentId}
            data-section-slot={section.slot}
            data-section-order={section.order}
            data-fx-parallax={fxProps.parallax || undefined}
            data-fx-fade={fxProps.fadeIn || undefined}
            data-fx-spotlight={fxProps.spotlight || undefined}
            data-fx-shimmer={fxProps.shimmer || undefined}
          >
            <SectionShell id={section.instanceId}>
              <Component {...componentProps} />
            </SectionShell>
          </div>
        );
      })}
    </div>
  );
}
