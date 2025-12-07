import type { ChampagnePageSection } from "@champagne/manifests";
import { getSectionStackForPage } from "@champagne/manifests";

export interface SectionRegistryEntry {
  id: string;
  type?: string;
  definition?: ChampagnePageSection | string;
}

export function getSectionStack(pageSlug: string): SectionRegistryEntry[] {
  const rawSections = getSectionStackForPage(pageSlug) ?? [];

  return rawSections.map((section, index) => {
    if (typeof section === "string") {
      return { id: section, definition: section };
    }

    return {
      id: section.id ?? `${pageSlug}-section-${index}`,
      type: section.type,
      definition: section,
    };
  });
}
