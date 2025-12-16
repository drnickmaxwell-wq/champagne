import baseManifest from "../../../champagne-manifests/data/hero/sacred_hero_base.json" assert { type: "json" };
import surfacesManifest from "../../../champagne-manifests/data/hero/sacred_hero_surfaces.json" assert { type: "json" };
import variantsManifest from "../../../champagne-manifests/data/hero/sacred_hero_variants.json" assert { type: "json" };
import weatherManifest from "../../../champagne-manifests/data/hero/sacred_hero_weather.json" assert { type: "json" };
import marketingVariantManifest from "../../../champagne-manifests/data/hero/hero.variant.marketing_v1.json" assert { type: "json" };
import treatmentVariantManifest from "../../../champagne-manifests/data/hero/hero.variant.treatment_v1.json" assert { type: "json" };
import editorialVariantManifest from "../../../champagne-manifests/data/hero/hero.variant.editorial_v1.json" assert { type: "json" };
import utilityVariantManifest from "../../../champagne-manifests/data/hero/hero.variant.utility_v1.json" assert { type: "json" };
import type {
  HeroBaseConfig,
  HeroContentConfig,
  HeroFilmGrainSettings,
  HeroLayoutConfig,
  HeroMotionTuning,
  HeroSurfaceTokenConfig,
  HeroTimeOfDay,
  HeroVariantConfig,
} from "./HeroConfig";
import type { HeroSurfaceDefinitionMap } from "./HeroSurfaceMap";
import { buildSurfaceDefinitionMap } from "./HeroSurfaceMap";

interface SacredHeroBaseManifest {
  id?: string;
  content?: HeroContentConfig;
  defaults?: {
    tone?: string;
    surfaces?: HeroSurfaceTokenConfig;
    layout?: HeroLayoutConfig;
    filmGrain?: HeroFilmGrainSettings;
  };
}

interface SacredHeroVariantsManifest {
  variants?: HeroVariantConfig[];
}

type SacredHeroWeatherManifest = Partial<
  Record<
    HeroTimeOfDay,
    { tone?: string; surfaces?: HeroSurfaceTokenConfig; layout?: HeroLayoutConfig; motion?: HeroMotionTuning; filmGrain?: HeroFilmGrainSettings }
  >
>;

export interface SacredHeroManifests {
  base: HeroBaseConfig;
  surfaces: HeroSurfaceDefinitionMap;
  variants: HeroVariantConfig[];
  weather: SacredHeroWeatherManifest;
}

function assertString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function normalizeBaseManifest(manifest: SacredHeroBaseManifest): HeroBaseConfig {
  const id = assertString(manifest.id) ? manifest.id : "sacred-home-hero";
  const content: HeroContentConfig = manifest.content ?? {};
  const defaults: HeroSurfaceTokenConfig = manifest.defaults?.surfaces ?? {};
  return {
    id,
    tone: manifest.defaults?.tone,
    content,
    defaultSurfaces: defaults,
    layout: manifest.defaults?.layout,
    filmGrain: manifest.defaults?.filmGrain,
  };
}

function normalizeVariants(manifest: SacredHeroVariantsManifest, manifestSource?: string): HeroVariantConfig[] {
  if (!Array.isArray(manifest.variants)) return [];
  return manifest.variants
    .filter((variant) => variant && typeof variant === "object")
    .map((variant) => ({
      id: assertString((variant as HeroVariantConfig).id) ? (variant as HeroVariantConfig).id : "default",
      manifestSource: (variant as HeroVariantConfig).manifestSource ?? manifestSource,
      allowedSurfaces: Array.isArray((variant as HeroVariantConfig).allowedSurfaces)
        ? ((variant as HeroVariantConfig).allowedSurfaces ?? []).filter(assertString)
        : undefined,
      label: (variant as HeroVariantConfig).label,
      tone: (variant as HeroVariantConfig).tone,
      treatmentSlug: (variant as HeroVariantConfig).treatmentSlug,
      timeOfDay: (variant as HeroVariantConfig).timeOfDay,
      energyMode: (variant as HeroVariantConfig).energyMode,
      content: (variant as HeroVariantConfig).content,
      surfaces: (variant as HeroVariantConfig).surfaces,
      layout: (variant as HeroVariantConfig).layout,
      motion: (variant as HeroVariantConfig).motion,
      filmGrain: (variant as HeroVariantConfig).filmGrain,
    }));
}

export function loadSacredHeroManifests(): SacredHeroManifests {
  const base = normalizeBaseManifest(baseManifest as SacredHeroBaseManifest);
  const surfaceMap = buildSurfaceDefinitionMap(surfacesManifest);
  const variants = [
    ...normalizeVariants(variantsManifest as SacredHeroVariantsManifest, "packages/champagne-manifests/data/hero/sacred_hero_variants.json"),
    ...normalizeVariants(
      marketingVariantManifest as unknown as SacredHeroVariantsManifest,
      "packages/champagne-manifests/data/hero/hero.variant.marketing_v1.json",
    ),
    ...normalizeVariants(
      treatmentVariantManifest as unknown as SacredHeroVariantsManifest,
      "packages/champagne-manifests/data/hero/hero.variant.treatment_v1.json",
    ),
    ...normalizeVariants(
      editorialVariantManifest as unknown as SacredHeroVariantsManifest,
      "packages/champagne-manifests/data/hero/hero.variant.editorial_v1.json",
    ),
    ...normalizeVariants(
      utilityVariantManifest as unknown as SacredHeroVariantsManifest,
      "packages/champagne-manifests/data/hero/hero.variant.utility_v1.json",
    ),
  ];
  const weather = (weatherManifest as SacredHeroWeatherManifest) ?? {};

  return {
    base,
    surfaces: surfaceMap,
    variants,
    weather,
  };
}
