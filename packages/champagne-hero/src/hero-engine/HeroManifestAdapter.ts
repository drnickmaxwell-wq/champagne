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
    motionAllowlist?: string[];
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

function normalizeMotionAllowlist(entry: unknown): string[] | undefined {
  if (!Array.isArray(entry)) return undefined;
  const filtered = entry.filter(assertString);
  return filtered.length > 0 ? filtered : undefined;
}

function normalizeSurfaceTokens(
  surfaces?: HeroSurfaceTokenConfig,
  motionAllowlist?: string[],
): HeroSurfaceTokenConfig | undefined {
  if (!surfaces) return undefined;
  const normalizedMotion = Array.isArray(surfaces.motion)
    ? motionAllowlist
      ? surfaces.motion.filter((entry) => typeof entry === "string" && motionAllowlist.includes(entry))
      : surfaces.motion
    : undefined;
  const video = surfaces.video === "__OFF__" ? undefined : surfaces.video;
  return {
    ...surfaces,
    motion: normalizedMotion,
    video,
  };
}

function normalizeBaseManifest(manifest: SacredHeroBaseManifest): HeroBaseConfig {
  const id = assertString(manifest.id) ? manifest.id : "sacred-home-hero";
  const content: HeroContentConfig = manifest.content ?? {};
  const motionAllowlist = normalizeMotionAllowlist(manifest.defaults?.motionAllowlist);
  const defaults = normalizeSurfaceTokens(manifest.defaults?.surfaces, motionAllowlist) ?? {};
  return {
    id,
    tone: manifest.defaults?.tone,
    content,
    defaultSurfaces: defaults,
    motionAllowlist,
    layout: manifest.defaults?.layout,
    filmGrain: manifest.defaults?.filmGrain,
  };
}

function normalizeVariants(
  manifest: SacredHeroVariantsManifest,
  manifestSource?: string,
  motionAllowlist?: string[],
): HeroVariantConfig[] {
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
      surfaces: normalizeSurfaceTokens((variant as HeroVariantConfig).surfaces, motionAllowlist),
      layout: (variant as HeroVariantConfig).layout,
      motion: (variant as HeroVariantConfig).motion,
      filmGrain: (variant as HeroVariantConfig).filmGrain,
    }));
}

function normalizeWeatherManifest(
  manifest: SacredHeroWeatherManifest,
  motionAllowlist?: string[],
): SacredHeroWeatherManifest {
  return Object.fromEntries(
    Object.entries(manifest).map(([key, value]) => {
      if (!value || typeof value !== "object") return [key, value];
      return [
        key,
        {
          ...value,
          surfaces: normalizeSurfaceTokens((value as { surfaces?: HeroSurfaceTokenConfig }).surfaces, motionAllowlist),
        },
      ];
    }),
  );
}

export function loadSacredHeroManifests(): SacredHeroManifests {
  const base = normalizeBaseManifest(baseManifest as SacredHeroBaseManifest);
  const surfaceMap = buildSurfaceDefinitionMap(surfacesManifest);
  const variants = [
    ...normalizeVariants(
      variantsManifest as SacredHeroVariantsManifest,
      "packages/champagne-manifests/data/hero/sacred_hero_variants.json",
      base.motionAllowlist,
    ),
    ...normalizeVariants(
      marketingVariantManifest as unknown as SacredHeroVariantsManifest,
      "packages/champagne-manifests/data/hero/hero.variant.marketing_v1.json",
      base.motionAllowlist,
    ),
    ...normalizeVariants(
      treatmentVariantManifest as unknown as SacredHeroVariantsManifest,
      "packages/champagne-manifests/data/hero/hero.variant.treatment_v1.json",
      base.motionAllowlist,
    ),
    ...normalizeVariants(
      editorialVariantManifest as unknown as SacredHeroVariantsManifest,
      "packages/champagne-manifests/data/hero/hero.variant.editorial_v1.json",
      base.motionAllowlist,
    ),
    ...normalizeVariants(
      utilityVariantManifest as unknown as SacredHeroVariantsManifest,
      "packages/champagne-manifests/data/hero/hero.variant.utility_v1.json",
      base.motionAllowlist,
    ),
  ];
  const weather = normalizeWeatherManifest((weatherManifest as SacredHeroWeatherManifest) ?? {}, base.motionAllowlist);

  return {
    base,
    surfaces: surfaceMap,
    variants,
    weather,
  };
}
