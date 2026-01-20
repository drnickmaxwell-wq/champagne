import type {
  ChampagneCTA,
  ChampagneJourneyManifest,
  ChampagneMediaDeckManifest,
  ChampagnePageCTAConfig,
  ChampagnePageManifest,
  ChampagnePageSection,
  ChampagnePageTypeDefaults,
  ChampagneSectionLayout,
  ChampagneSectionLayoutSection,
  ChampagneSectionLibrary,
  ChampagneSectionFxDefaultsManifest,
  ChampagneSectionPrmDefaultsManifest,
  ChampagneStylesManifest,
} from "./core";
import {
  champagneMachineManifest,
  champagneMediaDeckManifests,
  champagneJourneyManifests,
  champagnePageTypeDefaults,
  champagneSectionFxDefaults,
  champagneSectionPrmDefaults,
  champagneSectionLayouts,
  champagneSectionLibrary,
  champagneStylesManifest,
  getPageManifestBySlug,
  getRouteIdFromSlug,
} from "./core";
import ctaIntentHints from "../data/sections/smh/cta_intents.json";
import treatmentJourneyPlan from "../data/sections/smh/treatment_journeys.json";
import sectionManifestSchema from "../schema/section-manifest.schema.json";

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ChampagneCTAIntentConfig {
  label?: string;
  href?: string;
  variant?: string;
}

type TreatmentJourneyPlan = (typeof treatmentJourneyPlan.treatments)[number];

const treatmentJourneyLookup = new Map<string, TreatmentJourneyPlan>(
  Array.isArray(treatmentJourneyPlan.treatments)
    ? treatmentJourneyPlan.treatments.map((entry) => [entry.routeId, entry as TreatmentJourneyPlan])
    : [],
);

const ctaIntentLabelLookup = (ctaIntentHints as { cta_intents?: Record<string, string> }).cta_intents ?? {};

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

const TREATMENT_PATH_PREFIXES = ["/treatments/"];

const TREATMENT_PATH_ALIASES: Record<string, string> = {
  "/treatments/retainers": "/treatments/dental-retainers",
  "/treatments/dental-implants": "/treatments/implants",
  "/treatments/hygiene": "/treatments/preventative-and-general-dentistry",
  "/treatments/3d-printed-implant-restorations": "/treatments/3d-implant-restorations",
  "/treatments/fillings": "/treatments/dental-fillings",
  "/treatments/restorative-fillings": "/treatments/dental-fillings",
};

function normalizeTreatmentPath(value: string) {
  if (value.startsWith("/treatments/")) return value;
  const cleaned = value.replace(/^\//, "");
  return `/treatments/${cleaned}`;
}

function normalizeTreatmentPage(manifest: ChampagnePageManifest): ChampagneTreatmentPage | undefined {
  const path = manifest.path;
  const isTreatmentPath = path && TREATMENT_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
  const isTreatmentCategory = (manifest.category as string | undefined)?.toLowerCase() === "treatment";

  if (!path || !isTreatmentPath || !isTreatmentCategory) return undefined;

  const slug = path
    .split("/")
    .filter(Boolean)
    .pop();

  return {
    ...manifest,
    path,
    slug: slug ?? "",
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

  const hubExtras = ["/dental-checkups-oral-cancer-screening"]
    .map((path) => getPageManifestBySlug(path))
    .filter((entry): entry is ChampagnePageManifest => Boolean(entry?.path));

  for (const entry of hubExtras) {
    const path = entry.path as string;
    if (byPath.has(path)) continue;

    const slug = path
      .split("/")
      .filter(Boolean)
      .pop();

    byPath.set(path, {
      ...entry,
      path,
      slug: slug ?? "",
    });
  }

  return Array.from(byPath.values());
}

export function getTreatmentPages(): ChampagneTreatmentPage[] {
  return collectTreatmentEntries();
}

export function getTreatmentManifest(slugOrPath: string): ChampagneTreatmentPage | undefined {
  const normalizedPath = normalizeTreatmentPath(slugOrPath);
  const entries = collectTreatmentEntries();
  const aliasedPath = TREATMENT_PATH_ALIASES[normalizedPath];

  if (aliasedPath && entries.some((entry) => entry.path === aliasedPath)) {
    return entries.find((entry) => entry.path === aliasedPath);
  }

  return entries.find((entry) => entry.path === normalizedPath);
}

export function resolveTreatmentPathAlias(
  slugOrPath: string,
): { resolvedPath: string; wasAlias: boolean } {
  const normalizedPath = normalizeTreatmentPath(slugOrPath);
  const entries = collectTreatmentEntries();
  const aliasedPath = TREATMENT_PATH_ALIASES[normalizedPath];

  if (aliasedPath && entries.some((entry) => entry.path === aliasedPath)) {
    return { resolvedPath: aliasedPath, wasAlias: true };
  }

  return { resolvedPath: normalizedPath, wasAlias: false };
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

export function getCTAIntentConfigForRoute(routeId: string): Record<string, ChampagneCTAIntentConfig> | undefined {
  const manifest = champagneSectionLayouts.find((entry) => entry.routeId === routeId);
  return (manifest as { cta_intents?: Record<string, ChampagneCTAIntentConfig> } | undefined)?.cta_intents;
}

export function getTreatmentJourneyForRoute(routeId: string): TreatmentJourneyPlan | undefined {
  return treatmentJourneyLookup.get(routeId);
}

export function getCTAIntentLabels(): Record<string, string> {
  return ctaIntentLabelLookup;
}

export interface ChampagneHeroManifest {
  id: string;
  sourcePagePath?: string;
  preset?: string | Record<string, unknown>;
}

const heroFamilyMap: Record<string, string> = {
  "treatments.implants": "hero.treatment.implants",
  "treatments.emergency": "hero.treatment.emergency",
};

function resolveHeroFamily(heroFamily?: string): string | undefined {
  if (!heroFamily) return undefined;
  return heroFamilyMap[heroFamily];
}

function getHeroPresetFromStyles(heroId: string): Record<string, unknown> | undefined {
  const styles = champagneStylesManifest as ChampagneStylesManifest;
  const preset = styles.heroes?.[heroId];
  if (!preset || typeof preset !== "object") return undefined;
  return { id: heroId, ...preset } as Record<string, unknown>;
}

export function getHeroManifest(heroIdOrPageSlug: string): ChampagneHeroManifest | undefined {
  const pageManifest = getPageManifestBySlug(heroIdOrPageSlug);
  if (pageManifest?.hero) {
    return normalizeHeroManifest(pageManifest.hero, pageManifest.path);
  }

  if (pageManifest?.heroFamily) {
    const resolvedHeroId = resolveHeroFamily(pageManifest.heroFamily);
    if (resolvedHeroId) {
      return normalizeHeroManifest({ id: resolvedHeroId }, pageManifest.path);
    }
  }

  if (pageManifest) {
    const category = (pageManifest.category as string | undefined)?.toLowerCase();
    const resolvedFromCategory = (() => {
      if (pageManifest.path === "/") return "sacred_home_hero_v1";
      switch (category) {
        case "treatment":
          return "hero.variant.treatment_v1";
        case "editorial":
          return "hero.variant.editorial_v1";
        case "utility":
          return "hero.variant.utility_v1";
        default:
          return "hero.variant.marketing_v1";
      }
    })();

    if (resolvedFromCategory) {
      return normalizeHeroManifest({ id: resolvedFromCategory }, pageManifest.path);
    }
  }

  const fromHeroId = getAllPages().find((page) => {
    const hero = page.hero;
    if (!hero) return false;
    return typeof hero === "string" ? hero === heroIdOrPageSlug : hero.id === heroIdOrPageSlug;
  });

  if (fromHeroId?.hero) {
    return normalizeHeroManifest(fromHeroId.hero, fromHeroId.path);
  }

  const stylesPreset = getHeroPresetFromStyles(heroIdOrPageSlug);
  if (stylesPreset) {
    return normalizeHeroManifest({ id: heroIdOrPageSlug, ...stylesPreset });
  }

  return undefined;
}

function normalizeHeroManifest(
  hero: string | Record<string, unknown>,
  path?: string,
): ChampagneHeroManifest {
  const heroId = typeof hero === "string" ? hero : (hero.id as string | undefined) ?? "";
  const styledPreset = typeof hero === "string" ? getHeroPresetFromStyles(hero) : hero;
  return {
    id: heroId || path || "",
    sourcePagePath: path,
    preset: styledPreset,
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

export interface ChampagneSectionStyle {
  id: string;
  type?: string;
  surface?: string;
}

export function getSectionStyle(sectionId: string): ChampagneSectionStyle | undefined {
  const styles = (champagneStylesManifest as ChampagneStylesManifest).sections ?? {};
  const entry = styles[sectionId];
  if (!entry) return undefined;
  if (typeof entry !== "object") return { id: sectionId };
  return {
    id: sectionId,
    type: (entry as Record<string, unknown>).type as string | undefined,
    surface: (entry as Record<string, unknown>).surface as string | undefined,
  };
}

export function getSectionCTAReferences(sectionId: string): (ChampagneCTA | string)[] {
  const manifest = getSectionManifest(sectionId);
  if (!manifest?.definition || typeof manifest.definition === "string") return [];
  return normalizeCTAGroup(manifest.definition.ctas);
}

export function getSectionLibrary(): ChampagneSectionLibrary {
  return champagneSectionLibrary as ChampagneSectionLibrary;
}

export function getSectionLayouts(): ChampagneSectionLayout[] {
  return champagneSectionLayouts as ChampagneSectionLayout[];
}

export function getSectionManifestSchema() {
  return sectionManifestSchema;
}

function isSectionLayoutSectionValid(entry: ChampagneSectionLayoutSection | undefined): boolean {
  if (!entry) return false;
  return Boolean(entry.instanceId && entry.componentId && typeof entry.order === "number");
}

export function validateSectionLayoutManifest(layout?: ChampagneSectionLayout): ValidationResult {
  const errors: string[] = [];

  if (!layout || typeof layout !== "object") {
    return { valid: false, errors: ["Layout is missing or not an object"] };
  }

  if (!layout.tenantId) errors.push("tenantId is required");
  if (!layout.routeId) errors.push("routeId is required");
  if (!layout.pageType) errors.push("pageType is required");

  const sections = Array.isArray(layout.sections) ? layout.sections : [];
  if (sections.length === 0) errors.push("sections must be a non-empty array");

  sections.forEach((section, index) => {
    if (!isSectionLayoutSectionValid(section)) {
      errors.push(`section[${index}] is missing required fields (instanceId, componentId, order)`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function getSectionLayoutManifest(
  routeIdOrSlug: string,
  tenantId?: string,
): ChampagneSectionLayout | undefined {
  const routeId = getRouteIdFromSlug(routeIdOrSlug);
  return champagneSectionLayouts.find(
    (layout) => layout.routeId === routeId && (!tenantId || layout.tenantId === tenantId),
  );
}

export function getSectionLayoutSections(
  routeIdOrSlug: string,
  tenantId?: string,
): { layout?: ChampagneSectionLayout; sections: ChampagneSectionLayoutSection[]; validation: ValidationResult } {
  const layout = getSectionLayoutManifest(routeIdOrSlug, tenantId);
  const validation = validateSectionLayoutManifest(layout);

  const sections = Array.isArray(layout?.sections)
    ? [...layout.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return { layout, sections, validation };
}

export function getPageTypeDefaults(): ChampagnePageTypeDefaults {
  return champagnePageTypeDefaults as ChampagnePageTypeDefaults;
}

export function getSectionFxDefaults(): ChampagneSectionFxDefaultsManifest {
  return champagneSectionFxDefaults as ChampagneSectionFxDefaultsManifest;
}

export function getSectionPrmDefaults(): ChampagneSectionPrmDefaultsManifest {
  return champagneSectionPrmDefaults as ChampagneSectionPrmDefaultsManifest;
}

export function getJourneys(): ChampagneJourneyManifest[] {
  return champagneJourneyManifests as ChampagneJourneyManifest[];
}

export function getJourneyManifest(journeyId: string): ChampagneJourneyManifest | undefined {
  return (champagneJourneyManifests as ChampagneJourneyManifest[]).find(
    (journey) => journey.journeyId === journeyId,
  );
}

export function getMediaDecks(): ChampagneMediaDeckManifest[] {
  return champagneMediaDeckManifests as ChampagneMediaDeckManifest[];
}

export function getMediaDeck(mediaDeckId: string): ChampagneMediaDeckManifest | undefined {
  return (champagneMediaDeckManifests as ChampagneMediaDeckManifest[]).find(
    (entry) => entry.mediaDeckId === mediaDeckId,
  );
}
