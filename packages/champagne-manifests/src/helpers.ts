import type {
  ChampagneCTA,
  ChampagnePageCTAConfig,
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

export interface ChampagneTreatmentPage extends ChampagnePageManifest {
  path: string;
  slug: string;
}

function normalizeTreatmentPage(manifest: ChampagnePageManifest): ChampagneTreatmentPage | undefined {
  const path = manifest.path;
  if (!path || !path.startsWith("/treatments/")) return undefined;

  return {
    ...manifest,
    path,
    slug: path.replace("/treatments/", ""),
  };
}

function collectTreatmentEntries(): ChampagneTreatmentPage[] {
  const collections = [champagneMachineManifest.pages ?? {}, champagneMachineManifest.treatments ?? {}];
  const byPath = new Map<string, ChampagneTreatmentPage>();

  for (const collection of collections) {
    Object.values(collection).forEach((entry) => {
      const normalized = normalizeTreatmentPage(entry);
      if (!normalized) return;
      if (!byPath.has(normalized.path)) {
        byPath.set(normalized.path, normalized);
      }
    });
  }

  return Array.from(byPath.values());
}

export function getTreatmentPages(): ChampagneTreatmentPage[] {
  return collectTreatmentEntries();
}

export function getTreatmentManifest(slugOrPath: string): ChampagneTreatmentPage | undefined {
  const normalizedPath = slugOrPath.startsWith("/treatments/")
    ? slugOrPath
    : `/treatments/${slugOrPath.replace(/^\//, "")}`;

  return collectTreatmentEntries().find((entry) => entry.path === normalizedPath);
}

export interface ChampagneCTASlots {
  heroCTAs: (ChampagneCTA | string)[];
  midPageCTAs: (ChampagneCTA | string)[];
  footerCTAs: (ChampagneCTA | string)[];
}

function normalizeCTAGroup(entry?: (ChampagneCTA | string)[]) {
  if (!entry) return [] as (ChampagneCTA | string)[];
  return entry.filter(Boolean) as (ChampagneCTA | string)[];
}

export function getCTASlotsForPage(pageSlug: string): ChampagneCTASlots {
  const manifest = getPageManifestBySlug(pageSlug);
  const ctas: ChampagnePageCTAConfig | undefined = manifest?.ctas;

  return {
    heroCTAs: normalizeCTAGroup(ctas?.heroCTAs),
    midPageCTAs: normalizeCTAGroup(ctas?.midPageCTAs),
    footerCTAs: normalizeCTAGroup(ctas?.footerCTAs),
  };
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

export function getSectionCTAReferences(sectionId: string): (ChampagneCTA | string)[] {
  const manifest = getSectionManifest(sectionId);
  if (!manifest?.definition || typeof manifest.definition === "string") return [];
  return normalizeCTAGroup(manifest.definition.ctas);
}
