import type {
  ChampagnePageManifest,
  ChampagnePageSection,
} from "./core";
import {
  champagneMachineManifest,
  getPageManifestBySlug,
} from "./core";

export function getAllPages(): ChampagnePageManifest[] {
  const pages = champagneMachineManifest.pages ?? {};
  const treatments = champagneMachineManifest.treatments ?? {};
  return [...Object.values(pages), ...Object.values(treatments)];
}

export function getPageManifest(pageSlug: string): ChampagnePageManifest | undefined {
  return getPageManifestBySlug(pageSlug);
}

export interface ChampagneHeroManifest {
  id: string;
  sourcePagePath?: string;
  preset?: string | Record<string, unknown>;
}

export function getHeroManifest(heroIdOrPageSlug: string): ChampagneHeroManifest | undefined {
  const pageManifest = getPageManifestBySlug(heroIdOrPageSlug);
  if (pageManifest?.hero) {
    return normalizeHeroManifest(pageManifest.hero, pageManifest.path);
  }

  const fromHeroId = getAllPages().find((page) => {
    const hero = page.hero;
    if (!hero) return false;
    return typeof hero === "string" ? hero === heroIdOrPageSlug : hero.id === heroIdOrPageSlug;
  });

  if (fromHeroId?.hero) {
    return normalizeHeroManifest(fromHeroId.hero, fromHeroId.path);
  }

  return undefined;
}

function normalizeHeroManifest(
  hero: string | Record<string, unknown>,
  path?: string,
): ChampagneHeroManifest {
  const heroId = typeof hero === "string" ? hero : (hero.id as string | undefined) ?? "";
  return {
    id: heroId || path || "",
    sourcePagePath: path,
    preset: hero,
  };
}

export interface ChampagneSectionManifest {
  id?: string;
  type?: string;
  sourcePagePath?: string;
  definition?: ChampagnePageSection | string;
}

export function getSectionManifest(sectionId: string): ChampagneSectionManifest | undefined {
  for (const page of getAllPages()) {
    const sections = page.sections ?? [];
    const match = sections.find((section) => {
      if (typeof section === "string") {
        return section === sectionId;
      }
      return section.id === sectionId;
    });

    if (match) {
      return {
        id: typeof match === "string" ? match : match.id,
        type: typeof match === "string" ? undefined : match.type,
        sourcePagePath: page.path,
        definition: match,
      };
    }
  }

  return undefined;
}
