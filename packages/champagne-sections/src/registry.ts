import type { ChampagneSectionLayoutSection } from "@champagne/manifests";

import type { SectionComponent, SectionComponentRegistry } from "./types";

export function resolveSectionComponent(
  componentId: string,
  registry: SectionComponentRegistry,
): SectionComponent | undefined {
  const component = registry[componentId];
  if (!component) {
    console.warn(`[champagne][sections] missing component for ${componentId}`);
    return undefined;
  }
  return component;
}

export function sortSectionsByOrder(sections: ChampagneSectionLayoutSection[] = []) {
  return [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
