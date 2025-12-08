import baseManifest from "../../../champagne-manifests/data/hero/sacred_hero_base.json" assert { type: "json" };
import surfacesManifest from "../../../champagne-manifests/data/hero/sacred_hero_surfaces.json" assert { type: "json" };
import variantsManifest from "../../../champagne-manifests/data/hero/sacred_hero_variants.json" assert { type: "json" };
import weatherManifest from "../../../champagne-manifests/data/hero/sacred_hero_weather.json" assert { type: "json" };
import type {
  HeroBaseConfig,
  HeroContentConfig,
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
  };
}

interface SacredHeroVariantsManifest {
  variants?: HeroVariantConfig[];
}

type SacredHeroWeatherManifest = Partial<Record<HeroTimeOfDay, { tone?: string; surfaces?: HeroSurfaceTokenConfig }>>;

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
  };
}

function normalizeVariants(manifest: SacredHeroVariantsManifest): HeroVariantConfig[] {
  if (!Array.isArray(manifest.variants)) return [];
  return manifest.variants
    .filter((variant) => variant && typeof variant === "object")
    .map((variant) => ({
      id: assertString((variant as HeroVariantConfig).id) ? (variant as HeroVariantConfig).id : "default",
      label: (variant as HeroVariantConfig).label,
      tone: (variant as HeroVariantConfig).tone,
      treatmentSlug: (variant as HeroVariantConfig).treatmentSlug,
      timeOfDay: (variant as HeroVariantConfig).timeOfDay,
      content: (variant as HeroVariantConfig).content,
      surfaces: (variant as HeroVariantConfig).surfaces,
    }));
}

export function loadSacredHeroManifests(): SacredHeroManifests {
  const base = normalizeBaseManifest(baseManifest as SacredHeroBaseManifest);
  const surfaceMap = buildSurfaceDefinitionMap(surfacesManifest);
  const variants = normalizeVariants(variantsManifest as SacredHeroVariantsManifest);
  const weather = (weatherManifest as SacredHeroWeatherManifest) ?? {};

  return {
    base,
    surfaces: surfaceMap,
    variants,
    weather,
  };
}
