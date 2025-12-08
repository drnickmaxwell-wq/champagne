import type {
  HeroContentConfig,
  HeroRuntimeConfig,
  HeroSurfaceConfig,
  HeroSurfaceTokenConfig,
  HeroTimeOfDay,
  HeroVariantConfig,
} from "./HeroConfig";
import { loadSacredHeroManifests } from "./HeroManifestAdapter";
import {
  combineSurfaceTokens,
  mapSurfaceTokensToAssets,
  resolveHeroSurfaceAssets,
} from "./HeroSurfaceMap";

interface RuntimeOptions {
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
}

function pickVariant(variants: HeroVariantConfig[], options: RuntimeOptions): HeroVariantConfig | undefined {
  if (!variants.length) return undefined;
  if (options.treatmentSlug) {
    const treatmentMatch = variants.find((variant) => variant.treatmentSlug === options.treatmentSlug);
    if (treatmentMatch) return treatmentMatch;
  }

  if (options.timeOfDay) {
    const timeMatch = variants.find((variant) => variant.timeOfDay === options.timeOfDay);
    if (timeMatch) return timeMatch;
  }

  return variants.find((variant) => variant.id === "default") ?? variants[0];
}

function mergeContent(base: HeroContentConfig, variant?: Partial<HeroContentConfig>): HeroContentConfig {
  return {
    ...base,
    ...variant,
    cta: variant?.cta ?? base.cta,
    secondaryCta: variant?.secondaryCta ?? base.secondaryCta,
  };
}

function mergeSurfaceConfig(
  base: HeroSurfaceTokenConfig,
  weather?: HeroSurfaceTokenConfig,
  variant?: HeroSurfaceTokenConfig,
): HeroSurfaceTokenConfig {
  return combineSurfaceTokens(base, weather, variant);
}

function applyPrm(surface: HeroSurfaceConfig, prm?: boolean): HeroSurfaceConfig {
  if (!prm) return surface;
  return {
    ...surface,
    motion: [],
    video: undefined,
  };
}

export async function getHeroRuntime(options: RuntimeOptions = {}): Promise<HeroRuntimeConfig> {
  const manifests = loadSacredHeroManifests();
  const selectedVariant = pickVariant(manifests.variants, options);
  const weatherConfig = options.timeOfDay ? manifests.weather[options.timeOfDay] : undefined;

  const mergedSurfaceTokens = mergeSurfaceConfig(
    manifests.base.defaultSurfaces,
    weatherConfig?.surfaces,
    selectedVariant?.surfaces,
  );

  const assetIds = mapSurfaceTokensToAssets(mergedSurfaceTokens, manifests.surfaces);
  const resolvedSurfaces = resolveHeroSurfaceAssets(applyPrm(assetIds, options.prm));
  const tone = selectedVariant?.tone ?? weatherConfig?.tone ?? manifests.base.tone;
  const content = mergeContent(manifests.base.content, selectedVariant?.content);

  return {
    id: manifests.base.id,
    tone,
    content,
    surfaces: resolvedSurfaces,
    variant: selectedVariant,
    flags: {
      prm: Boolean(options.prm),
      timeOfDay: options.timeOfDay,
      treatmentSlug: options.treatmentSlug,
    },
  };
}
