import type {
  HeroContentConfig,
  HeroFilmGrainSettings,
  HeroLayoutConfig,
  HeroMode,
  HeroMotionTuning,
  HeroRuntimeConfig,
  HeroSurfaceConfig,
  ResolvedHeroSurfaceConfig,
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
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  variantId?: string;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  pageCategory?: string;
}

const DEFAULT_LAYOUT: HeroLayoutConfig = {
  contentAlign: "start",
  maxWidth: 960,
  verticalOffset: "0px",
  padding: "clamp(2rem, 4vw, 3.5rem)",
};

const DEFAULT_MOTION: Required<HeroMotionTuning> = {
  parallaxDepth: 18,
  shimmerIntensity: 1,
  particleDrift: 1,
  energyMode: "balanced",
  particles: {
    density: 1,
    speed: 1,
    curve: "sway",
  },
};

function resolvePrmFlag(options: RuntimeOptions): boolean {
  if (typeof options.prm === "boolean") return options.prm;
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return false;
}

function pickVariant(variants: HeroVariantConfig[], options: RuntimeOptions): HeroVariantConfig | undefined {
  if (!variants.length) return undefined;
  if (options.variantId) {
    const explicitMatch = variants.find((variant) => variant.id === options.variantId);
    if (explicitMatch) return explicitMatch;
  }
  if ((options.mode ?? "home") === "treatment" && options.treatmentSlug) {
    const treatmentMatch = variants.find((variant) => variant.treatmentSlug === options.treatmentSlug);
    if (treatmentMatch) return treatmentMatch;
  }

  if (options.timeOfDay) {
    const timeMatch = variants.find((variant) => variant.timeOfDay === options.timeOfDay);
    if (timeMatch) return timeMatch;
  }

  return variants.find((variant) => variant.id === "default") ?? variants[0];
}

function resolveVariantIdForCategory(category?: string): string | undefined {
  if (!category) return undefined;
  switch (category) {
    case "home":
      return "default";
    case "treatment":
      return "hero.variant.treatment_v1";
    case "editorial":
      return "hero.variant.editorial_v1";
    case "utility":
      return "hero.variant.utility_v1";
    case "marketing":
      return "hero.variant.marketing_v1";
    default:
      return "hero.variant.marketing_v1";
  }
}

function filterSurfacesByAllowlist(
  surfaces: ResolvedHeroSurfaceConfig,
  allowed?: string[],
): ResolvedHeroSurfaceConfig {
  if (!allowed || allowed.length === 0) return surfaces;
  const allowedSet = new Set(allowed);
  const isAllowed = (id?: string | null) => (id ? allowedSet.has(id) : false);

  const grainAllowed = allowedSet.has("overlay.filmGrain");

  return {
    waveMask: isAllowed("mask.waveHeader")
      ? surfaces.waveMask
      : { desktop: undefined, mobile: undefined },
    background: isAllowed("field.waveBackdrop")
      ? surfaces.background
      : { desktop: undefined, mobile: undefined },
    gradient: isAllowed("gradient.base") ? surfaces.gradient : undefined,
    overlays: {
      dots: isAllowed("field.dotGrid") ? surfaces.overlays?.dots : undefined,
      field: isAllowed("field.waveRings") ? surfaces.overlays?.field : undefined,
    },
    particles: isAllowed("overlay.particles") ? surfaces.particles : undefined,
    grain: {
      desktop: grainAllowed ? surfaces.grain?.desktop : undefined,
      mobile: grainAllowed ? surfaces.grain?.mobile : undefined,
    },
    motion: (surfaces.motion ?? []).filter((entry) => isAllowed(entry?.id ?? entry?.asset?.id)),
    video: isAllowed(surfaces.video?.id ?? surfaces.video?.asset?.id)
      ? surfaces.video
      : undefined,
    surfaceStack: (surfaces.surfaceStack ?? []).filter((layer) => isAllowed(layer.token ?? layer.id)),
  };
}

function mergeContent(base: HeroContentConfig, variant?: Partial<HeroContentConfig>): HeroContentConfig {
  return {
    ...base,
    ...variant,
    cta: variant?.cta ?? base.cta,
    secondaryCta: variant?.secondaryCta ?? base.secondaryCta,
  };
}

function mergeLayout(
  base?: HeroLayoutConfig,
  weather?: HeroLayoutConfig,
  variant?: HeroLayoutConfig,
): HeroLayoutConfig {
  return {
    ...DEFAULT_LAYOUT,
    ...base,
    ...weather,
    ...variant,
  };
}

function mergeMotion(
  base?: HeroMotionTuning,
  weather?: HeroMotionTuning,
  variant?: HeroMotionTuning,
  options?: RuntimeOptions,
): HeroMotionTuning {
  const merged: HeroMotionTuning = {
    ...DEFAULT_MOTION,
    ...base,
    ...weather,
    ...variant,
    energyMode: variant?.energyMode ?? weather?.energyMode ?? base?.energyMode ?? DEFAULT_MOTION.energyMode,
    particles: {
      ...DEFAULT_MOTION.particles,
      ...base?.particles,
      ...weather?.particles,
      ...variant?.particles,
    },
  };

  if (options?.particles === false) {
    merged.particles = {
      ...merged.particles,
      density: 0,
      speed: 0,
    };
  }

  const prm = resolvePrmFlag(options ?? {});
  if (prm) {
    merged.parallaxDepth = 0;
    merged.shimmerIntensity = (merged.shimmerIntensity ?? 1) * 0.35;
    merged.particleDrift = (merged.particleDrift ?? 1) * 0.4;
  }

  return merged;
}

function mergeFilmGrain(
  base?: HeroFilmGrainSettings,
  weather?: HeroFilmGrainSettings,
  variant?: HeroFilmGrainSettings,
  options?: RuntimeOptions,
): HeroFilmGrainSettings {
  const merged: HeroFilmGrainSettings = {
    ...base,
    ...weather,
    ...variant,
  };

  if (options?.filmGrain === false) {
    merged.enabled = false;
  }

  if (resolvePrmFlag(options ?? {}) && typeof merged.opacity === "number") {
    merged.opacity = merged.opacity * 0.65;
    if (merged.enabled !== false) {
      merged.enabled = merged.enabled ?? true;
    }
  }

  return merged;
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
  const disabledMotion = new Set(["overlay.glassShimmer", "overlay.caustics", "overlay.particlesDrift", "overlay.goldDust"]);
  return {
    ...surface,
    motion: surface.motion?.filter((entry) => !disabledMotion.has(entry?.id ?? "")),
    video: surface.video?.prmSafe ? surface.video : undefined,
  };
}

export async function getHeroRuntime(options: RuntimeOptions = {}): Promise<HeroRuntimeConfig> {
  const manifests = loadSacredHeroManifests();
  const mode: HeroMode = options.mode ?? "home";
  const prmFlag = resolvePrmFlag(options);
  const mappedVariantId = options.variantId ?? resolveVariantIdForCategory(options.pageCategory ?? mode);
  const variantCandidate = pickVariant(manifests.variants, { ...options, variantId: mappedVariantId });
  const weatherConfig = options.timeOfDay ? manifests.weather[options.timeOfDay] : undefined;
  const shouldFallbackToBase =
    mode === "treatment" && Boolean(options.treatmentSlug) && variantCandidate?.treatmentSlug !== options.treatmentSlug;
  const selectedVariant = shouldFallbackToBase ? undefined : variantCandidate;

  if (shouldFallbackToBase && process.env.NODE_ENV !== "production") {
    console.warn(
      `[hero] No sacred variant found for treatment slug "${options.treatmentSlug}". Falling back to home hero visuals.`,
    );
  }

  const mergedSurfaceTokens = mergeSurfaceConfig(
    manifests.base.defaultSurfaces,
    weatherConfig?.surfaces,
    selectedVariant?.surfaces,
  );

  const assetIds = mapSurfaceTokensToAssets(mergedSurfaceTokens, manifests.surfaces, { prm: prmFlag });
  const resolvedSurfaces = filterSurfacesByAllowlist(
    resolveHeroSurfaceAssets(applyPrm(assetIds, prmFlag)),
    selectedVariant?.allowedSurfaces,
  );
  const tone = selectedVariant?.tone ?? weatherConfig?.tone ?? manifests.base.tone;
  const content = mergeContent(manifests.base.content, selectedVariant?.content);
  const layout = mergeLayout(manifests.base.layout, weatherConfig?.layout, selectedVariant?.layout);
  const motion = mergeMotion(manifests.base.motion, weatherConfig?.motion, selectedVariant?.motion, options);
  const filmGrain = mergeFilmGrain(manifests.base.filmGrain, weatherConfig?.filmGrain, selectedVariant?.filmGrain, options);
  const energyMode = selectedVariant?.energyMode ?? motion.energyMode;

  return {
    id: manifests.base.id,
    tone,
    content,
    surfaces: resolvedSurfaces,
    layout,
    motion,
    filmGrain,
    energyMode,
    manifestSources: [
      "packages/champagne-manifests/data/hero/sacred_hero_base.json",
      "packages/champagne-manifests/data/hero/sacred_hero_surfaces.json",
      selectedVariant?.manifestSource ?? "packages/champagne-manifests/data/hero/sacred_hero_variants.json",
    ],
    variant: selectedVariant,
    flags: {
      prm: prmFlag,
      mode,
      timeOfDay: options.timeOfDay,
      treatmentSlug: options.treatmentSlug,
    },
  };
}
