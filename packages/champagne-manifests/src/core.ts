import machineManifestData from "../data/champagne_machine_manifest_full.json";
import navManifestData from "../data/manifest.nav.main.json";
import publicBrandManifest from "../data/manifest.public.brand.json";
import stylesManifest from "../data/manifest.styles.champagne.json";
import manusImportManifest from "../data/manus_import_unified_manifest_20251104.json";
import mediaDeckImplants from "../data/media-decks/media-deck.implants.json";
import journeySmileMakeover from "../data/journey.smile-makeover.json";
import sectionPageDefaults from "../data/sections/page-type.defaults.json";
import sectionFxDefaults from "../data/sections/section-fx.defaults.json";
import sectionPrmDefaults from "../data/sections/section-prm.defaults.json";
import sectionLibraryData from "../data/sections/section-library.json";
import sectionLayoutAligners from "../data/sections/smh/treatments.aligners.json";
import sectionLayoutFullArchImplants from "../data/sections/smh/treatments.implants-full-arch.json";
import sectionLayoutMultiImplant from "../data/sections/smh/treatments.implants-multiple-teeth.json";
import sectionLayoutSingleImplant from "../data/sections/smh/treatments.implants-single-tooth.json";
import sectionLayoutImplants from "../data/sections/smh/treatments.implants.json";
import sectionLayoutVeneers from "../data/sections/smh/treatments.veneers.json";

export type ChampagneManifestStatus = "unavailable" | "stub" | "ready";

export interface ChampagnePageSection {
  id?: string;
  type?: string;
  label?: string;
  ctas?: (ChampagneCTA | string)[];
  [key: string]: unknown;
}

export interface ChampagneCTA {
  id?: string;
  label?: string;
  href?: string;
  preset?: string;
  [key: string]: unknown;
}

export interface ChampagnePageCTAConfig {
  heroCTAs?: (ChampagneCTA | string)[];
  midPageCTAs?: (ChampagneCTA | string)[];
  footerCTAs?: (ChampagneCTA | string)[];
  [key: string]: unknown;
}

export interface ChampagnePageManifest {
  id?: string;
  path?: string;
  hero?: string | Record<string, unknown>;
  sections?: ChampagnePageSection[] | string[];
  surface?: string;
  category?: string;
  label?: string;
  ctas?: ChampagnePageCTAConfig;
  [key: string]: unknown;
}

export interface ChampagneMachineManifest {
  id: string;
  note?: string;
  status: ChampagneManifestStatus | string;
  version: string;
  pages?: Record<string, ChampagnePageManifest>;
  treatments?: Record<string, ChampagnePageManifest>;
  [key: string]: unknown;
}

export interface ChampagneManifestRegistry {
  core: ChampagneMachineManifest;
  public?: unknown;
  styles?: unknown;
  manusImport?: unknown;
}

export interface ChampagneStylesManifest {
  heroes?: Record<string, unknown>;
  sections?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ChampagneSectionLibraryEntry {
  id: string;
  componentId: string;
  importPath?: string;
  defaultVariantId?: string;
  pageTypes?: string[];
  seoRole?: string;
  layoutRole?: string;
  brandTier?: string[];
  tokens?: Record<string, unknown>;
}

export interface ChampagneSectionLibrary {
  tenantId: string;
  version?: string;
  sections: ChampagneSectionLibraryEntry[];
}

export interface ChampagneSectionLayoutVisibility {
  minBreakpoint?: string;
  maxBreakpoint?: string;
  featureFlags?: string[];
}

export interface ChampagneSectionLayoutSection {
  instanceId: string;
  componentId: string;
  variantId?: string;
  order: number;
  slot?: string;
  seoRole?: string;
  visibility?: ChampagneSectionLayoutVisibility;
  propsRef?: string;
  experiments?: { abTestId?: string; variantKey?: string };
  [key: string]: unknown;
}

export interface ChampagneSectionLayout {
  tenantId: string;
  routeId: string;
  pageType: string;
  version?: string;
  sections: ChampagneSectionLayoutSection[];
}

export interface ChampagnePageTypeDefault {
  pageType: string;
  routeId: string;
  tenantId: string;
  sectionOrder: string[];
}

export interface ChampagnePageTypeDefaults {
  version?: string;
  pageDefaults?: ChampagnePageTypeDefault[];
}

export interface ChampagneJourneyStep {
  id: string;
  componentId: string;
  variantId?: string;
  order?: number;
  uiHints?: { layout?: string; emotionalLightingPreset?: string; persona?: string };
  eventsOnComplete?: string[];
}

export interface ChampagneJourneyTransitionConditions {
  quizAnswersInclude?: string[];
  tagsInclude?: string[];
}

export interface ChampagneJourneyTransition {
  on: string;
  targetStateId: string;
  conditions?: ChampagneJourneyTransitionConditions;
}

export interface ChampagneJourneyState {
  id: string;
  label: string;
  kind?: "educational" | "calming" | "exploratory" | "post-consult" | "finance";
  steps: ChampagneJourneyStep[];
  transitions?: ChampagneJourneyTransition[];
}

export interface ChampagneJourneyManifest {
  journeyId: string;
  tenantId: string;
  label?: string;
  description?: string;
  entryConditions?: { routes?: string[]; tags?: string[] };
  states: ChampagneJourneyState[];
  exitConditions?: { onCompletedStates?: string[] };
}

export interface ChampagneMediaDeckManifest {
  mediaDeckId: string;
  tenantId: string;
  usage: { primaryRouteId?: string; context?: string[] };
  assets: {
    heroLoop?: string;
    heroStill?: string;
    backgroundLoops?: string[];
    broll?: string[];
    viewer3d?: string[];
  };
  prmVariants?: { staticHero?: string; staticBackgrounds?: string[] };
  captions?: { id: string; label: string; usageHint?: string }[];
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  priority?: number;
  status?: "live" | "stub";
}

export interface ChampagneNavigationManifest {
  items?: NavItem[];
  [key: string]: unknown;
}

export interface ChampagneSectionFxDefaultsEntry {
  parallax?: boolean | number;
  fadeIn?: boolean;
  spotlight?: boolean;
  shimmer?: boolean;
}

export interface ChampagneSectionFxDefaultsManifest {
  id: string;
  description?: string;
  version?: number;
  fxDefaults?: Record<string, ChampagneSectionFxDefaultsEntry>;
}

export interface ChampagneSectionPrmDefaultsEntry {
  reduceParallaxTo?: number;
  disableShimmer?: boolean;
  disableSpotlight?: boolean;
  softFadeOnly?: boolean;
}

export interface ChampagneSectionPrmDefaultsManifest {
  id: string;
  description?: string;
  version?: number;
  prmRules?: Record<string, ChampagneSectionPrmDefaultsEntry>;
}

const champagneMachineManifest: ChampagneMachineManifest = machineManifestData;
const champagneStylesManifest: ChampagneStylesManifest = stylesManifest;
const champagneNavigationManifest: ChampagneNavigationManifest = {
  ...navManifestData,
  items: (navManifestData.items ?? []).map((item) => ({
    ...item,
    status: item.status === "stub" ? "stub" : item.status === "live" ? "live" : undefined,
  })),
};

const registry: ChampagneManifestRegistry = {
  core: champagneMachineManifest,
  public: publicBrandManifest,
  styles: stylesManifest,
  manusImport: manusImportManifest,
};

export const champagneSectionLibrary: ChampagneSectionLibrary = sectionLibraryData;
export const champagneSectionLayouts: ChampagneSectionLayout[] = [
  sectionLayoutMultiImplant as ChampagneSectionLayout,
  sectionLayoutSingleImplant as ChampagneSectionLayout,
  sectionLayoutFullArchImplants as ChampagneSectionLayout,
  sectionLayoutImplants as ChampagneSectionLayout,
  sectionLayoutVeneers as ChampagneSectionLayout,
  sectionLayoutAligners as ChampagneSectionLayout,
];
export const champagnePageTypeDefaults: ChampagnePageTypeDefaults = sectionPageDefaults;
export const champagneSectionFxDefaults: ChampagneSectionFxDefaultsManifest = sectionFxDefaults;
export const champagneSectionPrmDefaults: ChampagneSectionPrmDefaultsManifest = sectionPrmDefaults;
export const champagneJourneyManifests: ChampagneJourneyManifest[] = [
  journeySmileMakeover as ChampagneJourneyManifest,
];
export const champagneMediaDeckManifests: ChampagneMediaDeckManifest[] = [
  mediaDeckImplants as ChampagneMediaDeckManifest,
];

type StatusCarrier = { status?: ChampagneManifestStatus | string };

const manifestStatuses = [
  champagneMachineManifest.status,
  (registry.public as StatusCarrier | undefined)?.status,
  (registry.styles as StatusCarrier | undefined)?.status,
  (registry.manusImport as StatusCarrier | undefined)?.status,
];

const allReady = manifestStatuses.every((status) => status === "ready");

export const champagneManifestStatus: ChampagneManifestStatus = allReady
  ? "ready"
  : champagneMachineManifest.status === "ready"
    ? "stub"
    : "unavailable";

export const champagneManifestsReady = champagneManifestStatus === "ready";

export const champagneManifestRegistry: ChampagneManifestRegistry = registry;
export { champagneStylesManifest };

const pageCollections = [
  champagneMachineManifest.pages ?? {},
  champagneMachineManifest.treatments ?? {},
];

function normalizeSlug(slug: string): string {
  if (!slug) return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function getRouteIdFromSlug(slug: string): string {
  const normalized = normalizeSlug(slug).replace(/^\//, "").replace(/\/$/, "");
  if (!normalized) return "home";
  return normalized.replace(/\//g, ".");
}

const sectionComponentTypeMap: Record<string, string> = {
  section_treatment_intro: "treatment_overview_rich",
  section_before_after_grid: "gallery",
  section_implant_steps: "features",
  section_finance_summary: "features",
  section_faq: "treatment_faq_block",
  section_contact_cta: "treatment_closing_cta",
  "treatment.heroIntro": "treatment_overview_rich",
  "treatment.trustSignals": "features",
  "treatment.whatAreImplants": "treatment_media_feature",
  "treatment.whoIsItFor": "features",
  "treatment.processTimeline": "features",
  "treatment.technology": "treatment_media_feature",
  "treatment.aftercareRisks": "features",
  "treatment.faq": "treatment_faq_block",
  "treatment.cta": "treatment_closing_cta",
};

function buildSectionsFromLayout(manifest: ChampagneSectionLayout): ChampagnePageSection[] {
  const sortedSections = [...(manifest.sections ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return sortedSections
    .filter((section) => !section.componentId?.startsWith("hero_"))
    .map((section, index) => {
      const { instanceId, componentId, variantId, order, slot, seoRole, visibility, propsRef, experiments, ...definition } =
        section;
      const type = sectionComponentTypeMap[section.componentId] ?? section.componentId;
      return {
        id: instanceId || `${manifest.routeId}-section-${index + 1}`,
        type,
        componentId,
        variantId,
        order,
        slot,
        seoRole,
        visibility,
        propsRef,
        experiments,
        ...definition,
      } satisfies ChampagnePageSection;
    });
}

function getSectionLayoutByRoute(routeId: string): ChampagneSectionLayout | undefined {
  return champagneSectionLayouts.find((entry) => entry.routeId === routeId);
}

function getPageTypeDefault(routeId: string): ChampagnePageTypeDefault | undefined {
  return champagnePageTypeDefaults.pageDefaults?.find((entry) => entry.routeId === routeId);
}

function buildSectionsFromDefaults(pageDefault: ChampagnePageTypeDefault): ChampagnePageSection[] {
  return (pageDefault.sectionOrder ?? []).map((componentId, index) => ({
    id: `${pageDefault.routeId}-section-${index + 1}`,
    type: componentId,
    componentId,
    order: (index + 1) * 10,
  }));
}

export function getMainNavItems(): NavItem[] {
  const items = champagneNavigationManifest.items ?? [];
  return [...items].sort((a, b) => {
    const priorityA = a.priority ?? Number.MAX_SAFE_INTEGER;
    const priorityB = b.priority ?? Number.MAX_SAFE_INTEGER;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.label.localeCompare(b.label);
  });
}

export function getPageManifestBySlug(slug: string): ChampagnePageManifest | undefined {
  const normalizedSlug = normalizeSlug(slug);

  for (const collection of pageCollections) {
    const match = Object.values(collection).find((entry) => entry.path === normalizedSlug);
    if (match) return match;
  }
  return undefined;
}

export function getHeroPresetForPage(slug: string): string | Record<string, unknown> | undefined {
  return getPageManifestBySlug(slug)?.hero;
}

export function getSectionStackForPage(slug: string): (ChampagnePageSection | string)[] | undefined {
  const normalizedSlug = normalizeSlug(slug);
  const routeId = getRouteIdFromSlug(normalizedSlug);

  const sectionLayout = getSectionLayoutByRoute(routeId);
  if (sectionLayout) {
    return buildSectionsFromLayout(sectionLayout);
  }

  const pageManifest = getPageManifestBySlug(normalizedSlug);
  if (pageManifest?.sections) {
    return pageManifest.sections;
  }

  const defaultEntry = getPageTypeDefault(routeId);
  if (defaultEntry) {
    return buildSectionsFromDefaults(defaultEntry);
  }

  return undefined;
}

export { champagneMachineManifest };
