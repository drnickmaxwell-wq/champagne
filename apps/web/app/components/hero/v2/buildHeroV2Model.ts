import type { CSSProperties, Ref } from "react";
import { ensureHeroAssetPath, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";
import { getHeroBindingForPathnameKey } from "@champagne/manifests/src/helpers";
import heroGlueManifest from "./heroGlue.manifest.json";

export interface HeroRendererV2Props {
  mode?: HeroMode;
  treatmentSlug?: string;
  pageSlugOrPath?: string;
  debug?: boolean;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  diagnosticBoost?: boolean;
  surfaceRef?: Ref<HTMLDivElement>;
  pageCategory?: "home" | "treatment" | "editorial" | "utility" | "marketing" | string;
  rootStyle?: CSSProperties;
  glueVars?: Partial<{
    waveRingsSize: string;
    waveRingsRepeat: string;
    waveRingsPosition: string;
    waveRingsImageRendering: string;
    dotGridSize: string;
    dotGridRepeat: string;
    dotGridPosition: string;
    dotGridImageRendering: string;
  }>;
}

type GlueSource = "manifest" | "override" | "none";

export type HeroV2SurfaceLayerModel = {
  id: string;
  role?: string;
  prmSafe?: boolean;
  className: string;
  style: CSSProperties;
  glueMeta?: {
    source: GlueSource;
    backgroundSize?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    imageRendering?: string;
  };
  contrastFilter?: string;
};

export type HeroV2MotionLayerModel = {
  id: string;
  className?: string;
  path: string;
  style: CSSProperties;
  targetOpacity?: number | null;
};

export type HeroV2SacredBloomModel = {
  style: CSSProperties;
  bloomDebug: boolean;
  baseOpacity: string;
  shape?: string;
  mask?: string;
  contrastFilter?: string;
  glueMeta?: {
    source: GlueSource;
    backgroundSize?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    imageRendering?: string;
  };
};

export type HeroSurfaceStackModel = {
  surfaceVars: CSSProperties;
  prmEnabled: boolean;
  layers: HeroV2SurfaceLayerModel[];
  motionLayers: HeroV2MotionLayerModel[];
  bloomEnabled: boolean;
  heroId?: string;
  variantId?: string;
  boundHeroId?: string;
  boundVariantId?: string;
  effectiveHeroId?: string;
  effectiveVariantId?: string;
  particlesPath?: string;
  particlesOpacity?: number;
  heroVideo?: {
    path: string;
    poster?: string;
    style: CSSProperties;
    targetOpacity?: number | null;
  };
  sacredBloom?: HeroV2SacredBloomModel;
};

export type HeroV2Model = {
  gradient: string;
  layout: Awaited<ReturnType<typeof getHeroRuntime>>["layout"];
  content: Awaited<ReturnType<typeof getHeroRuntime>>["content"];
  surfaceStack: HeroSurfaceStackModel;
};

type GlueRule = {
  backgroundSize?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  imageRendering?: CSSProperties["imageRendering"];
  zIndex?: number | string;
  filter?: string;
  willChange?: string;
};

type GlueManifest = {
  version: number;
  modes: Record<string, Record<string, GlueRule>>;
};

const coerceZ = (value?: number | string | null) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") {
    if (value.includes("var(")) return undefined;
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) return undefined;
    return Math.round(parsed);
  }
  if (!Number.isFinite(value)) return undefined;
  return Math.round(value);
};

const defaultZFor = (id: string) => {
  const defaults = new Map<string, number>([
    ["gradient.base", 1],
    ["field.waveBackdrop", 2],
    ["mask.waveHeader", 3],
    ["field.waveRings", 4],
    ["field.dotGrid", 5],
    ["sacred.motion.waveCaustics", 6],
    ["sacred.motion.glassShimmer", 7],
    ["sacred.motion.particleDrift", 8],
    ["sacred.motion.goldDust", 9],
    ["overlay.sacredBloom", 8],
    ["overlay.particles", 9],
    ["overlay.filmGrain", 10],
    ["hero.contentFrame", 9],
  ]);
  return defaults.get(id) ?? 100;
};

const resolveAssetUrl = (entry?: { path?: string; asset?: { id?: string }; id?: string }) => {
  if (!entry) return undefined;
  if (entry.path) return entry.path;
  if (entry.asset?.id) return ensureHeroAssetPath(entry.asset.id);
  if (entry.id) return ensureHeroAssetPath(entry.id);
  return undefined;
};

const resolveBackgroundGlue = (url?: string) => {
  if (!url) return null;
  const isSvg = url.includes(".svg");
  return {
    backgroundSize: isSvg ? "auto" : "cover",
    backgroundRepeat: isSvg ? "repeat" : "no-repeat",
    backgroundPosition: "center",
  } as const;
};

const resolveBackgroundImage = (url?: string) => (url ? `url("${url}")` : undefined);
const resolvedGlueManifest = heroGlueManifest as GlueManifest;

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const resolveParticlesPath = (entry?: {
  path?: string;
  id?: string;
  asset?: unknown;
}) => {
  if (!entry) return undefined;
  if (entry.path) return entry.path;
  if (entry.asset && typeof entry.asset === "object") {
    const asset = entry.asset as { id?: string; path?: string };
    if (asset.path) return asset.path;
    if (asset.id) return ensureHeroAssetPath(asset.id);
  }
  if (entry.id) return ensureHeroAssetPath(entry.id);
  return undefined;
};

const resolveParticlesOpacity = (entry?: {
  opacity?: number;
  particlesOpacity?: number;
  assetOpacity?: number;
  asset?: unknown;
}) => {
  if (!entry) return undefined;
  if (entry.opacity !== undefined) return entry.opacity;
  if (entry.particlesOpacity !== undefined) return entry.particlesOpacity;
  if (entry.assetOpacity !== undefined) return entry.assetOpacity;
  if (entry.asset && typeof entry.asset === "object" && "opacity" in entry.asset) {
    const assetOpacity = (entry.asset as { opacity?: number }).opacity;
    if (assetOpacity !== undefined) return assetOpacity;
  }
  return undefined;
};

export async function buildHeroV2Model(props: HeroRendererV2Props): Promise<HeroV2Model | null> {
  const {
    pageSlugOrPath,
    debug,
    prm,
    timeOfDay,
    particles,
    filmGrain,
    diagnosticBoost = false,
    pageCategory,
    glueVars,
  } = props;
  const bloomDebug = typeof window !== "undefined" && window.location.search.includes("bloomDebug=1");
  let runtime: Awaited<ReturnType<typeof getHeroRuntime>> | null = null;
  const pathnameKey = normalizeHeroPathname(pageSlugOrPath);
  const isTreatmentPath = pathnameKey.startsWith("/treatments/");
  const isHomePath = pathnameKey === "/";
  const runtimeMode: HeroMode = isTreatmentPath ? "treatment" : "home";
  const runtimeTreatmentSlug = isTreatmentPath ? pathnameKey.split("/")[2] || undefined : undefined;
  const resolvedPageCategory =
    pageCategory ?? (runtimeMode === "home" ? "home" : runtimeMode === "treatment" ? "treatment" : undefined);
  const heroBinding = getHeroBindingForPathnameKey(pathnameKey);
  const boundHeroId = heroBinding?.heroId;
  const boundVariantId = heroBinding?.variantId;
  const runtimeVariantOverride = boundVariantId ?? boundHeroId;
  const resolvedTreatmentSlug = runtimeVariantOverride ? undefined : runtimeTreatmentSlug;
  const bindingMatched = Boolean(runtimeVariantOverride);

  try {
    runtime = await getHeroRuntime({
      mode: runtimeMode,
      treatmentSlug: resolvedTreatmentSlug,
      prm,
      timeOfDay,
      particles,
      filmGrain,
      pageCategory: resolvedPageCategory,
      variantId: runtimeVariantOverride ?? (runtimeMode === "home" ? "default" : undefined),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero runtime failed", error);
    }
  }

  if (!runtime) {
    try {
      runtime = await getHeroRuntime({
        mode: "home",
        treatmentSlug: undefined,
        prm,
        timeOfDay,
        particles,
        filmGrain,
        pageCategory: "home",
        variantId: "default",
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Hero runtime failed (sacred fallback)", error);
      }
    }
  }

  if (!runtime) return null;

  const effectiveHeroId = boundHeroId ?? runtime.id;
  const effectiveVariantId = boundVariantId ?? runtime.variant?.id;

  if (process.env.NODE_ENV !== "production" && (boundHeroId || boundVariantId)) {
    console.info("HERO_BINDING_PROOF", {
      pathname: pathnameKey,
      boundHeroId: boundHeroId ?? null,
      boundVariantId: boundVariantId ?? null,
      effectiveHeroId: effectiveHeroId ?? null,
      effectiveVariantId: effectiveVariantId ?? null,
      resolvedHeroId: runtime.id ?? null,
      resolvedVariantId: runtime.variant?.id ?? null,
      bindingMatched,
    });
  }

  const { content, surfaces, layout, filmGrain: filmGrainSettings } = runtime;
  const bloomEnabled = Boolean(runtime.variant?.allowedSurfaces?.includes("overlay.sacredBloom"));
  const videoDenylist = ["dental-hero-4k.mp4"];
  const isDeniedVideo = (path?: string) => path && videoDenylist.some((item) => path.includes(item));
  const gradient = surfaces.gradient?.trim() || "var(--smh-gradient)";
  const motionEntries = surfaces.motion ?? [];
  const motionAllowlist = process.env.NEXT_PUBLIC_HERO_MOTION_ALLOWLIST?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const hasMotionAllowlist = Boolean(motionAllowlist?.length);
  const prmEnabled = debug ? false : (prm ?? runtime.flags.prm);
  const videoEntry = surfaces.video;
  const heroVideoActive = Boolean(!prmEnabled && videoEntry?.path && !isDeniedVideo(videoEntry.path));
  const runtimeParticles = (runtime as { particles?: { path?: string; opacity?: number } }).particles;
  const runtimeParticlesPath =
    resolveParticlesPath(runtime.surfaces?.particles) ??
    resolveParticlesPath(runtimeParticles);
  const runtimeParticlesOpacity =
    resolveParticlesOpacity(runtime.surfaces?.particles) ??
    resolveParticlesOpacity(runtimeParticles);
  const fallbackParticlesPath = "/assets/champagne/particles/home-hero-particles.webp";
  const resolvedParticlesPath = runtimeParticlesPath ?? fallbackParticlesPath;
  const resolvedParticlesOpacity = runtimeParticlesOpacity ?? 0.14;
  const particlesAssetAvailable = Boolean(resolvedParticlesPath);
  const shouldShowMotion = !prmEnabled;
  const filteredMotionEntries = shouldShowMotion
    ? motionEntries.filter((entry) => {
        if (isDeniedVideo(entry.path)) return false;
        if (heroVideoActive && entry.id?.toLowerCase().includes("fallback")) return false;
        if (hasMotionAllowlist) {
          if (!entry.id) return false;
          return motionAllowlist?.includes(entry.id) ?? false;
        }
        return true;
      })
    : [];
  const motionCausticsActive = filteredMotionEntries.some((entry) => entry.className?.includes("hero-surface--caustics"));
  const motionShimmerActive = filteredMotionEntries.some((entry) => entry.className?.includes("hero-surface--glass-shimmer"));
  const motionGoldDustActive = filteredMotionEntries.some((entry) => entry.className?.includes("hero-surface--gold-dust"));
  const activeMotionIds = new Set(
    filteredMotionEntries.map((entry) => entry.id).filter((id): id is string => Boolean(id)),
  );
  const missingGovernance = new Map<
    string,
    {
      id: string;
      kind: "surface" | "motion";
      missingFields: Set<"opacity" | "blend" | "zIndex">;
      reason: "missing manifest governance";
      action: "disabled; not rendered";
    }
  >();
  const noteMissing = (id: string, field: "opacity" | "blend" | "zIndex", kind: "surface" | "motion") => {
    const existing = missingGovernance.get(id);
    if (existing) {
      existing.missingFields.add(field);
      return;
    }

    missingGovernance.set(id, {
      id,
      kind,
      missingFields: new Set([field]),
      reason: "missing manifest governance",
      action: "disabled; not rendered",
    });
  };

  const grainOpacity = surfaces.grain?.desktop?.opacity;
  const grainAssetAvailable = Boolean(surfaces.grain?.desktop || surfaces.grain?.mobile);
  const particlesGovernanceMissing = particles !== false && particlesAssetAvailable && resolvedParticlesOpacity === undefined;
  const grainGovernanceMissing = filmGrain !== false && grainAssetAvailable && grainOpacity === undefined;
  const shouldShowGrain = Boolean(
    !grainGovernanceMissing && filmGrain !== false && (filmGrainSettings?.enabled ?? false) && grainAssetAvailable,
  );
  const shouldShowParticles = Boolean(!particlesGovernanceMissing && particles !== false && particlesAssetAvailable);
  if (particlesGovernanceMissing) {
    noteMissing("overlay.particles", "opacity", "surface");
  }
  if (grainGovernanceMissing) {
    noteMissing("overlay.filmGrain", "opacity", "surface");
  }
  const waveBackdropEntry = surfaces.background?.desktop as
    | { blendMode?: string | null; opacity?: number | null; zIndex?: number }
    | undefined;
  const waveBackdropOpacity = waveBackdropEntry?.opacity ?? undefined;
  const waveBackdropBlend = waveBackdropEntry?.blendMode as CSSProperties["mixBlendMode"] | undefined;
  const waveBackdropZIndex = waveBackdropEntry?.zIndex;
  const surfaceStack = (surfaces.surfaceStack ?? []).filter((layer) => {
    const token = layer.token ?? layer.id;
    if (layer.suppressed) return false;
    if (token && activeMotionIds.has(token)) return false;
    if (motionCausticsActive && layer.className?.includes("hero-surface--caustics")) return false;
    if (motionShimmerActive && layer.className?.includes("hero-surface--glass-shimmer")) return false;
    if (motionGoldDustActive && layer.className?.includes("hero-surface--gold-dust")) return false;
    if (token === "overlay.sacredBloom" && !bloomEnabled) return false;
    if (token === "overlay.particles" && (!shouldShowParticles || particlesGovernanceMissing)) return false;
    if (token === "overlay.filmGrain" && (!shouldShowGrain || grainGovernanceMissing)) return false;
    return true;
  });
  const resolveMotionStyle = (
    entry?: { blendMode?: string | null; opacity?: number | null; zIndex?: number | string | null },
    id?: string,
  ) => {
    if (!entry) return { style: {}, targetOpacity: null };
    const style: CSSProperties = {};
    const resolvedBlend = entry.blendMode ?? undefined;
    const resolvedOpacity = entry.opacity ?? undefined;
    let targetOpacity: number | null = null;

    if (resolvedOpacity !== undefined && resolvedOpacity !== null) {
      targetOpacity = prmEnabled ? 0 : resolvedOpacity;
      (style as CSSProperties & Record<string, string>)["--hero-motion-target-opacity"] = `${targetOpacity}`;
      (style as CSSProperties & Record<string, string>)["--hero-motion-opacity"] = `${targetOpacity}`;
    } else {
      if (prmEnabled) {
        (style as CSSProperties & Record<string, string>)["--hero-motion-target-opacity"] = "0";
        (style as CSSProperties & Record<string, string>)["--hero-motion-opacity"] = "0";
      }
      if (id) noteMissing(id, "opacity", "motion");
    }

    if (resolvedBlend) {
      style.mixBlendMode = resolvedBlend as CSSProperties["mixBlendMode"];
    } else if (id) {
      noteMissing(id, "blend", "motion");
    }

    if (id) {
      style.zIndex = resolveZIndex(id, entry.zIndex);
    } else if (id) {
      noteMissing(id, "zIndex", "motion");
    }

    return { style, targetOpacity };
  };

  const waveBackdropUrlDesktop = resolveAssetUrl(surfaces.background?.desktop);
  const waveBackdropUrlMobile = resolveAssetUrl(surfaces.background?.mobile);
  const overlayFieldUrl = resolveAssetUrl(surfaces.overlays?.field);
  const overlayDotsUrl = resolveAssetUrl(surfaces.overlays?.dots);
  const particlesUrl = resolvedParticlesPath;
  const grainUrlDesktop = resolveAssetUrl(surfaces.grain?.desktop);
  const grainUrlMobile = resolveAssetUrl(surfaces.grain?.mobile);
  const sacredBloomUrl = "/assets/champagne/textures/wave-light-overlay.webp";
  const waveMaskEntry = surfaces.waveMask?.desktop as
    | { blendMode?: string | null; opacity?: number | null; zIndex?: number }
    | undefined;
  const overlayFieldEntry = surfaces.overlays?.field as
    | { blendMode?: string | null; opacity?: number | null; zIndex?: number }
    | undefined;
  const overlayDotsEntry = surfaces.overlays?.dots as
    | { blendMode?: string | null; opacity?: number | null; zIndex?: number }
    | undefined;
  const particlesEntry = surfaces.particles as
    | { blendMode?: string | null; opacity?: number | null; zIndex?: number }
    | undefined;
  const grainEntry = surfaces.grain?.desktop as
    | { blendMode?: string | null; opacity?: number | null; zIndex?: number }
    | undefined;

  const surfaceVars: CSSProperties = {
    ["--hero-gradient" as string]: gradient,
    ["--hero-wave-mask-desktop" as string]: surfaces.waveMask?.desktop?.path
      ? `url("${surfaces.waveMask.desktop.path}")`
      : surfaces.waveMask?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.waveMask.desktop.asset.id)}")`
        : undefined,
    ["--hero-wave-mask-mobile" as string]: surfaces.waveMask?.mobile?.path
      ? `url("${surfaces.waveMask.mobile.path}")`
      : surfaces.waveMask?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.waveMask.mobile.asset.id)}")`
        : undefined,
    ["--hero-wave-background-desktop" as string]: waveBackdropUrlDesktop ? resolveBackgroundImage(waveBackdropUrlDesktop) : undefined,
    ["--hero-wave-background-mobile" as string]: waveBackdropUrlMobile ? resolveBackgroundImage(waveBackdropUrlMobile) : undefined,
    ["--hero-overlay-field" as string]: overlayFieldUrl ? resolveBackgroundImage(overlayFieldUrl) : undefined,
    ["--hero-overlay-dots" as string]: overlayDotsUrl ? resolveBackgroundImage(overlayDotsUrl) : undefined,
    ["--hero-particles" as string]: shouldShowParticles ? resolveBackgroundImage(resolvedParticlesPath) : undefined,
    ["--hero-grain-desktop" as string]: grainUrlDesktop ? resolveBackgroundImage(grainUrlDesktop) : undefined,
    ["--hero-grain-mobile" as string]: grainUrlMobile ? resolveBackgroundImage(grainUrlMobile) : undefined,
    ["--hero-film-grain-opacity" as string]: shouldShowGrain ? grainOpacity : undefined,
    ["--hero-film-grain-blend" as string]: shouldShowGrain
      ? ((surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? undefined)
      : undefined,
    ["--hero-particles-opacity" as string]: shouldShowParticles ? resolvedParticlesOpacity : undefined,
    ["--hero-caustics-overlay" as string]: "url(/assets/champagne/textures/wave-light-overlay.webp)",
  };

  const diagnosticOutlineStyle: CSSProperties | undefined = diagnosticBoost
    ? { outline: "1px solid var(--champagne-keyline-gold, var(--accentGold_soft))", outlineOffset: "-1px" }
    : undefined;
  const usedZIndexes = new Set<number>();
  const resolveZIndex = (id: string, candidate?: number | string | null) => {
    let resolved = coerceZ(candidate) ?? defaultZFor(id);
    const allowDuplicate = id === "sacred.motion.particleDrift" || id === "sacred.motion.goldDust";
    if (!allowDuplicate) {
      while (usedZIndexes.has(resolved)) {
        resolved += 1;
      }
    }
    usedZIndexes.add(resolved);
    return resolved;
  };

  const waveBackdropGlue = resolveBackgroundGlue(waveBackdropUrlDesktop);
  const overlayFieldGlue = resolveBackgroundGlue(overlayFieldUrl);
  const overlayDotsGlue = resolveBackgroundGlue(overlayDotsUrl);
  const particlesGlue = resolveBackgroundGlue(particlesUrl);
  const grainGlue = resolveBackgroundGlue(grainUrlDesktop);
  const sacredBloomGlue = resolveBackgroundGlue(sacredBloomUrl);
  const glueTelemetry = new Map<
    string,
    {
      source: GlueSource;
      backgroundSize?: string;
      backgroundRepeat?: string;
      backgroundPosition?: string;
      imageRendering?: string;
    }
  >();
  const resolveManifestGlue = (surfaceId: string): GlueRule | undefined => {
    const modeGlue = resolvedGlueManifest.modes?.[runtimeMode];
    return modeGlue?.[surfaceId];
  };
  const normalizeGlue = (glue?: GlueRule | null): GlueRule => {
    if (!glue) return {};
    return {
      ...(glue.backgroundSize ? { backgroundSize: glue.backgroundSize } : {}),
      ...(glue.backgroundRepeat ? { backgroundRepeat: glue.backgroundRepeat } : {}),
      ...(glue.backgroundPosition ? { backgroundPosition: glue.backgroundPosition } : {}),
      ...(glue.imageRendering ? { imageRendering: glue.imageRendering } : {}),
      ...(glue.zIndex !== undefined ? { zIndex: glue.zIndex } : {}),
      ...(glue.filter ? { filter: glue.filter } : {}),
      ...(glue.willChange ? { willChange: glue.willChange } : {}),
    };
  };
  const resolveGlueForSurface = (surfaceId: string, url?: string, overrideGlue?: GlueRule): GlueRule | null => {
    if (!url) {
      glueTelemetry.set(surfaceId, { source: "none" });
      return null;
    }
    const baseGlue = normalizeGlue(resolveBackgroundGlue(url));
    const manifestGlue = normalizeGlue(resolveManifestGlue(surfaceId));
    const overrideGlueNormalized = normalizeGlue(overrideGlue);
    const hasManifest = Boolean(manifestGlue && Object.keys(manifestGlue).length > 0);
    const hasOverride = Boolean(overrideGlue && Object.keys(overrideGlue).length > 0);
    const glue = {
      ...baseGlue,
      ...manifestGlue,
      ...overrideGlueNormalized,
    } satisfies GlueRule;
    const source: GlueSource = hasOverride ? "override" : hasManifest ? "manifest" : "none";

    glueTelemetry.set(surfaceId, {
      source,
      backgroundSize: glue.backgroundSize?.toString(),
      backgroundRepeat: glue.backgroundRepeat?.toString(),
      backgroundPosition: glue.backgroundPosition?.toString(),
      imageRendering: glue.imageRendering?.toString(),
    });

    return glue;
  };
  const waveRingsGlueOverrides: CSSProperties = {
    ...(glueVars?.waveRingsSize ? { backgroundSize: "var(--hero-glue-waveRings-size)" } : {}),
    ...(glueVars?.waveRingsRepeat ? { backgroundRepeat: "var(--hero-glue-waveRings-repeat)" } : {}),
    ...(glueVars?.waveRingsPosition ? { backgroundPosition: "var(--hero-glue-waveRings-position)" } : {}),
    ...(glueVars?.waveRingsImageRendering
      ? { imageRendering: glueVars.waveRingsImageRendering as CSSProperties["imageRendering"] }
      : {}),
  };
  const dotGridGlueOverrides: CSSProperties = {
    ...(glueVars?.dotGridSize ? { backgroundSize: "var(--hero-glue-dotGrid-size)" } : {}),
    ...(glueVars?.dotGridRepeat ? { backgroundRepeat: "var(--hero-glue-dotGrid-repeat)" } : {}),
    ...(glueVars?.dotGridPosition ? { backgroundPosition: "var(--hero-glue-dotGrid-position)" } : {}),
    ...(glueVars?.dotGridImageRendering
      ? { imageRendering: glueVars.dotGridImageRendering as CSSProperties["imageRendering"] }
      : {}),
  };
  const waveBackdropResolvedGlue = resolveGlueForSurface("field.waveBackdrop", waveBackdropUrlDesktop);
  const waveRingsResolvedGlue = resolveGlueForSurface("field.waveRings", overlayFieldUrl, waveRingsGlueOverrides as GlueRule);
  const dotGridResolvedGlue = resolveGlueForSurface("field.dotGrid", overlayDotsUrl, dotGridGlueOverrides as GlueRule);
  const particlesResolvedGlue = resolveGlueForSurface("overlay.particles", particlesUrl);
  const grainResolvedGlue = resolveGlueForSurface("overlay.filmGrain", grainUrlDesktop);
  const sacredBloomResolvedGlue = resolveGlueForSurface("overlay.sacredBloom", sacredBloomUrl);
  const sacredBloomGlueMeta = glueTelemetry.get("overlay.sacredBloom");
  const isHomeMode = isHomePath;
  const contrastGlueFilters = new Map<string, string>();
  const registerContrastFilter = (surfaceId: string, glue?: GlueRule | null) => {
    if (!isHomeMode) return;
    if (glue?.filter) {
      contrastGlueFilters.set(surfaceId, glue.filter);
    }
  };
  registerContrastFilter("field.waveBackdrop", waveBackdropResolvedGlue);
  registerContrastFilter("field.waveRings", waveRingsResolvedGlue);
  registerContrastFilter("field.dotGrid", dotGridResolvedGlue);
  registerContrastFilter("overlay.sacredBloom", sacredBloomResolvedGlue);
  const sacredBloomContrastFilter = contrastGlueFilters.get("overlay.sacredBloom");
  const sacredBloomStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "18% 14%",
    backgroundImage: "var(--hero-caustics-overlay)",
    zIndex: resolveZIndex("overlay.sacredBloom"),
    ...(sacredBloomResolvedGlue ?? sacredBloomGlue ?? {}),
    mixBlendMode: "screen",
    opacity: bloomDebug ? 0.8 : 0.18,
    ...(isHomeMode ? {} : {}),
  };

  const layerStyles: Record<string, CSSProperties> = {
    "gradient.base": {
      zIndex: resolveZIndex("gradient.base"),
    },
    "field.waveBackdrop": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-wave-background-desktop)",
        ...(waveBackdropResolvedGlue ?? waveBackdropGlue ?? {}),
      };

      style.zIndex = resolveZIndex("field.waveBackdrop", waveBackdropZIndex ?? waveBackdropResolvedGlue?.zIndex);
      if (waveBackdropZIndex === undefined || waveBackdropZIndex === null) {
        noteMissing("field.waveBackdrop", "zIndex", "surface");
      }

      if (waveBackdropBlend) {
        style.mixBlendMode = waveBackdropBlend;
      } else {
        noteMissing("field.waveBackdrop", "blend", "surface");
      }

      if (waveBackdropOpacity !== undefined && waveBackdropOpacity !== null) {
        style.opacity = waveBackdropOpacity;
      } else {
        style.opacity = 0;
        noteMissing("field.waveBackdrop", "opacity", "surface");
      }

      return style;
    })(),
    "mask.waveHeader": (() => {
      const style: CSSProperties = {};
      style.zIndex = resolveZIndex("mask.waveHeader", waveMaskEntry?.zIndex);
      if (waveMaskEntry?.zIndex === undefined || waveMaskEntry?.zIndex === null) {
        noteMissing("mask.waveHeader", "zIndex", "surface");
      }

      if (waveMaskEntry?.blendMode) {
        style.mixBlendMode = waveMaskEntry.blendMode as CSSProperties["mixBlendMode"];
      } else {
        noteMissing("mask.waveHeader", "blend", "surface");
      }

      if (waveMaskEntry?.opacity !== undefined && waveMaskEntry?.opacity !== null) {
        style.opacity = waveMaskEntry.opacity;
      } else {
        style.opacity = 0;
        noteMissing("mask.waveHeader", "opacity", "surface");
      }
      return style;
    })(),
    "field.waveRings": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-overlay-field)",
        ...(waveRingsResolvedGlue ?? overlayFieldGlue ?? {}),
      };

      style.zIndex = resolveZIndex("field.waveRings", overlayFieldEntry?.zIndex ?? waveRingsResolvedGlue?.zIndex);
      if (overlayFieldEntry?.zIndex === undefined || overlayFieldEntry?.zIndex === null) {
        noteMissing("field.waveRings", "zIndex", "surface");
      }

      if (overlayFieldEntry?.blendMode) {
        style.mixBlendMode = overlayFieldEntry.blendMode as CSSProperties["mixBlendMode"];
      } else {
        noteMissing("field.waveRings", "blend", "surface");
      }

      if (overlayFieldEntry?.opacity !== undefined && overlayFieldEntry?.opacity !== null) {
        style.opacity = overlayFieldEntry.opacity;
      } else {
        style.opacity = 0;
        noteMissing("field.waveRings", "opacity", "surface");
      }

      return style;
    })(),
    "field.dotGrid": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-overlay-dots)",
        ...(dotGridResolvedGlue ?? overlayDotsGlue ?? {}),
      };

      style.zIndex = resolveZIndex("field.dotGrid", overlayDotsEntry?.zIndex ?? dotGridResolvedGlue?.zIndex);
      if (overlayDotsEntry?.zIndex === undefined || overlayDotsEntry?.zIndex === null) {
        noteMissing("field.dotGrid", "zIndex", "surface");
      }

      if (overlayDotsEntry?.blendMode) {
        style.mixBlendMode = overlayDotsEntry.blendMode as CSSProperties["mixBlendMode"];
      } else {
        noteMissing("field.dotGrid", "blend", "surface");
      }

      if (overlayDotsEntry?.opacity !== undefined && overlayDotsEntry?.opacity !== null) {
        style.opacity = overlayDotsEntry.opacity;
      } else {
        style.opacity = 0;
        noteMissing("field.dotGrid", "opacity", "surface");
      }

      return style;
    })(),
    "overlay.particles": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-particles)",
        ...(particlesResolvedGlue ?? particlesGlue ?? {}),
      };

      style.zIndex = resolveZIndex("overlay.particles", particlesEntry?.zIndex ?? particlesResolvedGlue?.zIndex);
      if ((particlesEntry?.zIndex === undefined || particlesEntry?.zIndex === null) && shouldShowParticles) {
        noteMissing("overlay.particles", "zIndex", "surface");
      }

      if (particlesEntry?.blendMode) {
        style.mixBlendMode = particlesEntry.blendMode as CSSProperties["mixBlendMode"];
      } else if (shouldShowParticles) {
        noteMissing("overlay.particles", "blend", "surface");
      }

      if (particlesEntry?.opacity !== undefined && particlesEntry?.opacity !== null) {
        style.opacity = particlesEntry.opacity;
      } else if (shouldShowParticles) {
        style.opacity = 0;
        noteMissing("overlay.particles", "opacity", "surface");
      }

      return style;
    })(),
    "overlay.filmGrain": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-grain-desktop)",
        ...(grainResolvedGlue ?? grainGlue ?? {}),
      };

      style.zIndex = resolveZIndex("overlay.filmGrain", grainEntry?.zIndex ?? grainResolvedGlue?.zIndex);
      if ((grainEntry?.zIndex === undefined || grainEntry?.zIndex === null) && shouldShowGrain) {
        noteMissing("overlay.filmGrain", "zIndex", "surface");
      }

      if (grainEntry?.blendMode) {
        style.mixBlendMode = grainEntry.blendMode as CSSProperties["mixBlendMode"];
      } else if (shouldShowGrain) {
        noteMissing("overlay.filmGrain", "blend", "surface");
      }

      if (grainOpacity !== undefined && grainOpacity !== null) {
        style.opacity = grainOpacity;
      } else if (shouldShowGrain) {
        style.opacity = 0;
        noteMissing("overlay.filmGrain", "opacity", "surface");
      }

      return style;
    })(),
    "hero.contentFrame": {
      background: "transparent",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
      zIndex: resolveZIndex("hero.contentFrame"),
    },
  };

  const { style: heroVideoStyle, targetOpacity: heroVideoTargetOpacity } = resolveMotionStyle(
    videoEntry ?? undefined,
    "motion.heroVideo",
  );

  const motionEntriesWithStyles = filteredMotionEntries.map((entry, index) => {
    const { style, targetOpacity } = resolveMotionStyle(entry, entry.id ?? `motion-${index}`);

    return { entry, style, targetOpacity };
  });

  const layers: HeroV2SurfaceLayerModel[] = surfaceStack.map((layer) => {
    const resolvedStyle = layer.token ? layerStyles[layer.token] : undefined;
    const inlineStyle = {
      ...(resolvedStyle ?? {}),
      ...diagnosticOutlineStyle,
    };
    const glueMeta = glueTelemetry.get(layer.id) ?? { source: "none" };
    const contrastFilter = contrastGlueFilters.get(layer.id);

    return {
      id: layer.id,
      role: layer.role,
      prmSafe: layer.prmSafe,
      className: layer.className ?? "hero-surface-layer",
      style: inlineStyle,
      glueMeta,
      contrastFilter,
    };
  });

  const motionLayers: HeroV2MotionLayerModel[] = motionEntriesWithStyles
    .filter(({ entry }) => Boolean(entry.id && entry.path))
    .map(({ entry, style, targetOpacity }) => ({
      id: entry.id as string,
      className: entry.className,
      path: entry.path as string,
      style,
      targetOpacity,
    }));

  const heroVideo = !prmEnabled && videoEntry?.path && !isDeniedVideo(videoEntry.path)
    ? {
        path: videoEntry.path,
        poster: surfaces.background?.desktop?.path,
        style: heroVideoStyle,
        targetOpacity: heroVideoTargetOpacity,
      }
    : undefined;

  const sacredBloomModel = bloomEnabled
    ? {
        style: sacredBloomStyle,
        bloomDebug,
        baseOpacity: bloomDebug ? "0.8" : "0.18",
        shape: isHomeMode ? "phase3d" : undefined,
        mask: isHomeMode ? "upper-mid-soft" : undefined,
        contrastFilter: sacredBloomContrastFilter,
        glueMeta: sacredBloomGlueMeta,
      }
    : undefined;

  const surfaceStackModel: HeroSurfaceStackModel = {
    surfaceVars,
    prmEnabled,
    layers,
    motionLayers,
    bloomEnabled,
    heroId: effectiveHeroId,
    variantId: effectiveVariantId,
    boundHeroId,
    boundVariantId,
    effectiveHeroId,
    effectiveVariantId,
    particlesPath: resolvedParticlesPath,
    particlesOpacity: resolvedParticlesOpacity,
    heroVideo,
    sacredBloom: sacredBloomModel,
  };

  return {
    gradient,
    layout,
    content,
    surfaceStack: surfaceStackModel,
  };
}
