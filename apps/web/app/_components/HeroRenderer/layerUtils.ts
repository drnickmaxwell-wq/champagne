import type { HeroMode, HeroRuntimeConfig } from "@champagne/hero";
import { ensureHeroAssetPath } from "@champagne/hero";
import type { CSSProperties } from "react";

export type RuntimeLayer = {
  id?: string;
  role?: string;
  type?: "gradient" | "image" | "video" | "unknown";
  url?: string;
  opacity?: number;
  zIndex?: number;
  blendMode?: CSSProperties["mixBlendMode"];
  prmSafe?: boolean;
  className?: string;
   backgroundSize?: CSSProperties["backgroundSize"];
   backgroundPosition?: CSSProperties["backgroundPosition"];
   backgroundRepeat?: CSSProperties["backgroundRepeat"];
   backgroundColor?: CSSProperties["backgroundColor"];
   maskImage?: CSSProperties["maskImage"];
   maskSize?: CSSProperties["maskSize"];
   maskPosition?: CSSProperties["maskPosition"];
   maskRepeat?: CSSProperties["maskRepeat"];
   objectFit?: CSSProperties["objectFit"];
   warning?: string;
  suppressedReason?: string;
};

export type HeroFlags = { prm?: boolean };

const PLACEHOLDER_ASSET = "/assets/champagne/waves/waves-bg-1920.webp";

const tokenClassNames: Record<string, string> = {
  "gradient.base": "hero-layer hero-surface-layer hero-surface--gradient-field hero-layer--gradient",
  "field.waveBackdrop": "hero-layer hero-surface-layer hero-surface--wave-backdrop hero-layer--wave-backdrop",
  "mask.waveHeader": "hero-layer hero-surface-layer hero-surface--wave-mask hero-layer--wave-mask",
  "field.waveRings": "hero-layer hero-surface-layer hero-surface--wave-field hero-layer--wave-rings",
  "field.dotGrid": "hero-layer hero-surface-layer hero-surface--dot-field hero-layer--dot-grid",
  "overlay.particles": "hero-layer hero-surface-layer hero-surface--particles hero-layer--particles",
  "overlay.filmGrain": "hero-layer hero-surface-layer hero-surface--film-grain hero-layer--grain",
  "overlay.caustics": "hero-layer hero-surface-layer hero-surface--caustics hero-layer--caustics motion",
  "overlay.glassShimmer": "hero-layer hero-surface-layer hero-surface--glass-shimmer hero-layer--motion motion",
  "overlay.goldDust": "hero-layer hero-surface-layer hero-surface--gold-dust hero-layer--motion motion",
  "overlay.particlesDrift": "hero-layer hero-surface-layer hero-surface--particles-drift hero-layer--motion motion",
  "hero.video": "hero-layer hero-surface-layer hero-surface--video hero-layer--video motion",
  "hero.contentFrame": "hero-layer hero-surface-layer hero-surface--content-frame hero-layer--content",
};

const MOTION_ALIAS_MAP: Record<string, string> = {
  "overlay.caustics": "overlay.caustics",
  "overlay.glassShimmer": "overlay.glassShimmer",
  "overlay.goldDust": "overlay.goldDust",
  "overlay.particlesDrift": "overlay.particlesDrift",
  "hero.video": "hero.video",
};

function resolveUrl(entry: any): string | undefined {
  if (!entry) return undefined;
  if (entry.path) return entry.path;
  if (entry.asset?.id) return ensureHeroAssetPath(entry.asset.id) ?? PLACEHOLDER_ASSET;
  if (entry.id) return ensureHeroAssetPath(entry.id) ?? PLACEHOLDER_ASSET;
  return undefined;
}

function mapRuntimeLayer(entry: any): RuntimeLayer {
  const inferredType = entry?.type ?? entry?.mediaType;
  const candidateUrl = entry?.url ?? entry?.path;
  const isVideoPath = typeof candidateUrl === "string" && /\.(mp4|webm|mov)(\?.*)?$/i.test(candidateUrl);
  const isGradient = typeof candidateUrl === "string" && candidateUrl.includes("gradient");
  const resolvedType: RuntimeLayer["type"] = ["gradient", "image", "video"].includes(inferredType)
    ? (inferredType as RuntimeLayer["type"])
    : isVideoPath
      ? "video"
      : isGradient
        ? "gradient"
        : candidateUrl
          ? "image"
          : "unknown";

  return {
    id: entry?.id ?? entry?.token,
    role: entry?.role,
    type: resolvedType,
    url: entry?.url ?? resolveUrl(entry),
    opacity: entry?.opacity,
    zIndex: entry?.zIndex,
    blendMode: entry?.blendMode as CSSProperties["mixBlendMode"],
    prmSafe: entry?.prmSafe,
    className: entry?.className ?? "hero-layer hero-surface-layer",
    backgroundSize: entry?.backgroundSize ?? entry?.size,
    backgroundPosition: entry?.backgroundPosition ?? entry?.position,
    backgroundRepeat: entry?.backgroundRepeat ?? entry?.repeat,
    backgroundColor: entry?.backgroundColor,
    maskImage: entry?.maskImage ?? entry?.mask ?? entry?.maskUrl,
    maskSize: entry?.maskSize,
    maskPosition: entry?.maskPosition,
    maskRepeat: entry?.maskRepeat,
    objectFit: entry?.objectFit,
  } satisfies RuntimeLayer;
}

function buildSurfaceVars(options: {
  surfaces?: any;
  motion?: any;
  filmGrainSettings?: any;
  particles?: boolean;
  filmGrain?: boolean;
  opacityBoost?: number;
}): CSSProperties {
  const { surfaces = {}, motion = {}, filmGrainSettings = {}, particles = true, filmGrain = true } = options;
  const applyBoost = (value?: number) => Math.min(1, (value ?? 1) * (options.opacityBoost ?? 1));
  const gradient = surfaces.gradient ?? "var(--smh-gradient)";
  const shouldShowGrain = Boolean(filmGrain && filmGrainSettings.enabled && (surfaces.grain?.desktop || surfaces.grain?.mobile));
  const shouldShowParticles = Boolean(particles && (surfaces.particles?.path || surfaces.particles?.asset?.id));
  const waveBackdropOpacity = applyBoost(surfaces.background?.desktop?.opacity ?? 0.55);
  const waveBackdropBlend = surfaces.background?.desktop?.blendMode as CSSProperties["mixBlendMode"];
  const grainOpacity = applyBoost((filmGrainSettings.opacity ?? 0.28) * (surfaces.grain?.desktop?.opacity ?? 1));
  const particleOpacity = applyBoost((motion?.particles?.density ?? 1) * (surfaces.particles?.opacity ?? 1) * 0.35);

  return {
    ["--hero-gradient" as string]: gradient,
    ["--hero-wave-mask-desktop" as string]: surfaces.waveMask?.desktop?.path
      ? `url(${surfaces.waveMask.desktop.path})`
      : surfaces.waveMask?.desktop?.asset?.id
        ? `url(${ensureHeroAssetPath(surfaces.waveMask.desktop.asset.id)})`
        : undefined,
    ["--hero-wave-mask-mobile" as string]: surfaces.waveMask?.mobile?.path
      ? `url(${surfaces.waveMask.mobile.path})`
      : surfaces.waveMask?.mobile?.asset?.id
        ? `url(${ensureHeroAssetPath(surfaces.waveMask.mobile.asset.id)})`
        : undefined,
    ["--hero-wave-background-desktop" as string]: surfaces.background?.desktop?.path
      ? `url(${surfaces.background.desktop.path})`
      : surfaces.background?.desktop?.id
        ? `url(${ensureHeroAssetPath(surfaces.background.desktop.id)})`
        : undefined,
    ["--hero-wave-background-mobile" as string]: surfaces.background?.mobile?.path
      ? `url(${surfaces.background.mobile.path})`
      : surfaces.background?.mobile?.id
        ? `url(${ensureHeroAssetPath(surfaces.background.mobile.id)})`
        : undefined,
    ["--hero-overlay-field" as string]: surfaces.overlays?.field?.path
      ? `url(${surfaces.overlays.field.path})`
      : surfaces.overlays?.field?.asset?.id
        ? `url(${ensureHeroAssetPath(surfaces.overlays.field.asset.id)})`
        : undefined,
    ["--hero-overlay-dots" as string]: surfaces.overlays?.dots?.path
      ? `url(${surfaces.overlays.dots.path})`
      : surfaces.overlays?.dots?.asset?.id
        ? `url(${ensureHeroAssetPath(surfaces.overlays.dots.asset.id)})`
        : undefined,
    ["--hero-particles" as string]: shouldShowParticles && surfaces.particles?.path
      ? `url(${surfaces.particles.path})`
      : shouldShowParticles && surfaces.particles?.asset?.id
        ? `url(${ensureHeroAssetPath(surfaces.particles.asset.id)})`
        : undefined,
    ["--hero-grain-desktop" as string]: shouldShowGrain && surfaces.grain?.desktop?.path
      ? `url(${surfaces.grain.desktop.path})`
      : shouldShowGrain && surfaces.grain?.desktop?.asset?.id
        ? `url(${ensureHeroAssetPath(surfaces.grain.desktop.asset.id)})`
        : undefined,
    ["--hero-grain-mobile" as string]: shouldShowGrain && surfaces.grain?.mobile?.path
      ? `url(${surfaces.grain.mobile.path})`
      : shouldShowGrain && surfaces.grain?.mobile?.asset?.id
        ? `url(${ensureHeroAssetPath(surfaces.grain.mobile.asset.id)})`
        : undefined,
    ["--hero-film-grain-opacity" as string]: grainOpacity,
    ["--hero-film-grain-blend" as string]: (surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? undefined,
    ["--hero-particles-opacity" as string]: particleOpacity,
    ["--hero-particles-blend" as string]: (surfaces.particles?.blendMode as CSSProperties["mixBlendMode"]) ?? undefined,
    ["--hero-caustics-overlay" as string]: "url(/assets/champagne/textures/wave-light-overlay.webp)",
    ["--surface-opacity-waveBackdrop" as string]: waveBackdropOpacity,
    ["--surface-blend-waveBackdrop" as string]: waveBackdropBlend,
  };
}

function buildLegacyLayers(
  surfaces: any,
  motion: any,
  filmGrainSettings: any,
  opacityBoost: number,
  options: { particles?: boolean; filmGrain?: boolean; flags: HeroFlags },
): RuntimeLayer[] {
  const gradient = surfaces?.gradient ?? "var(--smh-gradient)";
  const motionEntries = Array.isArray(surfaces?.motion)
    ? surfaces.motion
    : Array.isArray(motion?.entries)
      ? motion.entries
      : Array.isArray(motion)
        ? motion
        : typeof surfaces?.motion === "object"
          ? Object.values(surfaces.motion)
          : [];
  const videoEntry = surfaces?.video?.path ? surfaces.video : surfaces?.video?.hero?.video ?? surfaces?.video;
  const particlesEnabled = options.particles ?? true;
  const filmGrainEnabled = options.filmGrain ?? true;
  const applyBoost = (value?: number) => Math.min(1, (value ?? 1) * opacityBoost);
  const shouldShowGrain = Boolean(
    filmGrainEnabled && filmGrainSettings?.enabled && (surfaces?.grain?.desktop || surfaces?.grain?.mobile),
  );
  const shouldShowParticles = Boolean(
    particlesEnabled && (surfaces?.particles?.path || surfaces?.particles?.asset?.id),
  );
  const causticsOpacity = applyBoost(
    motionEntries.find((entry: any) => entry.id === "overlay.caustics")?.opacity
      ?? surfaces?.overlays?.field?.opacity
      ?? 0.35,
  );
  const waveBackdropOpacity = applyBoost(surfaces?.background?.desktop?.opacity ?? 0.55);
  const waveBackdropBlend = surfaces?.background?.desktop?.blendMode as CSSProperties["mixBlendMode"];
  const surfaceStack = (surfaces?.surfaceStack ?? []).filter((layer: any) => !(layer as any)?.suppressed);
  const grainOpacity = applyBoost(
    (filmGrainSettings?.opacity ?? 0.28) * (surfaces?.grain?.desktop?.opacity ?? 1),
  );
  const particleOpacity = applyBoost(
    (motion?.particles?.density ?? 1) * (surfaces?.particles?.opacity ?? 1) * 0.35,
  );

  const layerStyles: Record<string, Partial<RuntimeLayer>> = {
    "gradient.base": {
      type: "gradient",
      url: gradient,
      prmSafe: true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    "field.waveBackdrop": {
      type: "image",
      url: resolveUrl(surfaces?.background?.desktop),
      opacity: waveBackdropOpacity,
      blendMode: waveBackdropBlend,
      prmSafe: surfaces?.background?.desktop?.prmSafe ?? true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    "mask.waveHeader": {
      type: "image",
      url: resolveUrl(surfaces?.waveMask?.desktop ?? surfaces?.waveMask),
      opacity: applyBoost(surfaces?.waveMask?.desktop?.opacity),
      blendMode: surfaces?.waveMask?.desktop?.blendMode as CSSProperties["mixBlendMode"],
      prmSafe: surfaces?.waveMask?.desktop?.prmSafe ?? true,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top center",
      backgroundSize: "contain",
      maskImage: resolveUrl(surfaces?.waveMask?.desktop ?? surfaces?.waveMask),
      maskRepeat: "no-repeat",
      maskPosition: "top center",
      maskSize: "contain",
      backgroundColor: "var(--bg-ink, #06070c)",
    },
    "field.waveRings": {
      type: "image",
      url: resolveUrl(surfaces?.overlays?.field),
      opacity: applyBoost(surfaces?.overlays?.field?.opacity),
      blendMode: surfaces?.overlays?.field?.blendMode as CSSProperties["mixBlendMode"],
      prmSafe: surfaces?.overlays?.field?.prmSafe,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    "field.dotGrid": {
      type: "image",
      url: resolveUrl(surfaces?.overlays?.dots),
      opacity: applyBoost(surfaces?.overlays?.dots?.opacity),
      blendMode: surfaces?.overlays?.dots?.blendMode as CSSProperties["mixBlendMode"],
      prmSafe: surfaces?.overlays?.dots?.prmSafe,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    "overlay.particles": {
      type: "image",
      url: shouldShowParticles ? resolveUrl(surfaces?.particles) : undefined,
      opacity: particleOpacity,
      blendMode: (surfaces?.particles?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
      prmSafe: surfaces?.particles?.prmSafe ?? true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    "overlay.filmGrain": {
      type: "image",
      url: shouldShowGrain ? resolveUrl(surfaces?.grain?.desktop) : undefined,
      opacity: grainOpacity,
      blendMode: (surfaces?.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "soft-light",
      prmSafe: surfaces?.grain?.desktop?.prmSafe ?? true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    "overlay.caustics": { type: "video", opacity: causticsOpacity, blendMode: "screen", prmSafe: false },
    "overlay.glassShimmer": { type: "video", blendMode: "screen", prmSafe: false },
    "overlay.goldDust": { type: "video", blendMode: "screen", prmSafe: false },
    "overlay.particlesDrift": { type: "video", blendMode: "screen", prmSafe: false },
    "hero.contentFrame": { type: "unknown", prmSafe: true },
  };

  const resolveMotionEntry = (token: string) => {
    const alias = MOTION_ALIAS_MAP[token] ?? token;
    const direct = motionEntries.find((entry: any) => entry?.id === token || entry?.id === alias || entry?.token === alias);
    if (direct) return direct;
    const aliasFromRuntime = motion?.aliases?.[alias];
    if (aliasFromRuntime) return { id: alias, ...aliasFromRuntime };
    const motionFromSurfaces = (surfaces?.motion as Record<string, any>)?.[alias];
    if (motionFromSurfaces) return { id: alias, ...motionFromSurfaces };
    const videoFromSurfaces = (surfaces?.video as Record<string, any>)?.[alias];
    if (videoFromSurfaces) return { id: alias, ...videoFromSurfaces };
    if (alias === "hero.video" && videoEntry) return { id: alias, ...videoEntry };
    return undefined;
  };

  const layers: RuntimeLayer[] = surfaceStack.map((layer: any) => {
    const token = layer.token ?? layer.id ?? "layer";
    const baseStyle = layerStyles[token] ?? { type: "unknown" };
    const motionEntry = resolveMotionEntry(token);
    const isMotionLayer = Boolean(layer.motion || MOTION_ALIAS_MAP[token] || motionEntry?.mediaType === "video");
    const urlFromMotion = motionEntry ? resolveUrl(motionEntry) ?? motionEntry?.path ?? motionEntry?.url : undefined;
    const opacityFromMotion = motionEntry
      ? motionEntry.opacity ?? (motion?.shimmerIntensity ?? 1) * 0.85
      : baseStyle.opacity;

    return {
      id: token,
      role: layer.role,
      className: layer.className ?? tokenClassNames[token] ?? "hero-layer hero-surface-layer",
      type: isMotionLayer ? "video" : baseStyle.type ?? "unknown",
      url: urlFromMotion ?? baseStyle.url,
      opacity: isMotionLayer ? applyBoost(opacityFromMotion) : opacityFromMotion,
      blendMode: motionEntry
        ? (motionEntry.blendMode as CSSProperties["mixBlendMode"])
        : baseStyle.blendMode,
      zIndex: layer.zIndex,
      prmSafe: layer.prmSafe ?? baseStyle.prmSafe ?? motionEntry?.prmSafe,
      backgroundSize: layer.backgroundSize ?? baseStyle.backgroundSize,
      backgroundPosition: layer.backgroundPosition ?? baseStyle.backgroundPosition,
      backgroundRepeat: layer.backgroundRepeat ?? baseStyle.backgroundRepeat,
      backgroundColor: layer.backgroundColor ?? baseStyle.backgroundColor,
      maskImage: layer.maskImage ?? baseStyle.maskImage,
      maskRepeat: layer.maskRepeat ?? baseStyle.maskRepeat,
      maskPosition: layer.maskPosition ?? baseStyle.maskPosition,
      maskSize: layer.maskSize ?? baseStyle.maskSize,
      objectFit: layer.objectFit ?? baseStyle.objectFit ?? (isMotionLayer ? "cover" : undefined),
    } satisfies RuntimeLayer;
  });

  if (videoEntry?.path && !layers.some((layer) => layer.id === "hero.video")) {
    layers.push({
      id: "hero.video",
      role: videoEntry.role ?? "motion",
      type: "video",
      url: videoEntry.path,
      opacity: applyBoost(videoEntry.opacity ?? (motion?.shimmerIntensity ?? 1) * 0.85),
      blendMode: videoEntry.blendMode as CSSProperties["mixBlendMode"],
      className: tokenClassNames["hero.video"] ?? "hero-layer hero-layer--video motion",
      prmSafe: videoEntry.prmSafe,
      objectFit: videoEntry.objectFit ?? "cover",
    });
  }

  motionEntries.forEach((entry: any) => {
    if (layers.some((layer) => layer.id === entry.id)) return;
    layers.push({
      id: entry.id,
      role: entry.role ?? "motion",
      type: "video",
      url: entry.path ?? resolveUrl(entry),
      opacity: applyBoost(entry.opacity ?? (motion?.shimmerIntensity ?? 1) * 0.85),
      blendMode: entry.blendMode as CSSProperties["mixBlendMode"],
      className: entry.className ?? tokenClassNames[entry.id] ?? "hero-layer hero-layer--motion motion",
      prmSafe: entry.prmSafe,
      objectFit: entry.objectFit ?? "cover",
    });
  });

  if (!surfaceStack.some((layer: any) => (layer.token ?? layer.id) === "gradient.base")) {
    layers.unshift({
      id: "gradient.base",
      type: "gradient",
      url: gradient,
      className: tokenClassNames["gradient.base"],
      role: "background",
      prmSafe: true,
    });
  }

  return layers;
}
function buildFallbackLayers(options: {
  flags: HeroFlags;
  particles?: boolean;
  filmGrain?: boolean;
  opacityBoost?: number;
}): RuntimeLayer[] {
  const { flags, particles = true, filmGrain = true, opacityBoost = 1 } = options;
  const prmEnabled = Boolean(flags?.prm);
  const applyBoost = (value?: number) => Math.min(1, (value ?? 1) * opacityBoost);
  const baseGradient = "var(--hero-gradient, var(--smh-gradient))";

  const layers: RuntimeLayer[] = [
    {
      id: "gradient.base",
      type: "gradient",
      role: "background",
      url: baseGradient,
      opacity: 1,
      className: tokenClassNames["gradient.base"],
      prmSafe: true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    {
      id: "field.waveBackdrop",
      type: "image",
      role: "background",
      url: "/assets/champagne/waves/waves-bg-2560.webp",
      opacity: applyBoost(0.72),
      blendMode: "screen",
      className: tokenClassNames["field.waveBackdrop"],
      prmSafe: true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    {
      id: "mask.waveHeader",
      type: "image",
      role: "fx",
      url: "/assets/champagne/waves/wave-mask-desktop.webp",
      opacity: applyBoost(0.75),
      blendMode: "soft-light",
      className: tokenClassNames["mask.waveHeader"],
      prmSafe: true,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "top center",
      backgroundSize: "contain",
      maskImage: "/assets/champagne/waves/wave-mask-desktop.webp",
      maskRepeat: "no-repeat",
      maskPosition: "top center",
      maskSize: "contain",
      backgroundColor: "var(--bg-ink, #06070c)",
    },
    {
      id: "field.waveRings",
      type: "image",
      role: "fx",
      url: "/assets/champagne/waves/wave-field.svg",
      opacity: applyBoost(0.55),
      blendMode: "screen",
      className: tokenClassNames["field.waveRings"],
      prmSafe: true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    {
      id: "field.dotGrid",
      type: "image",
      role: "fx",
      url: "/assets/champagne/waves/wave-dots.svg",
      opacity: applyBoost(0.42),
      blendMode: "soft-light",
      className: tokenClassNames["field.dotGrid"],
      prmSafe: true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  ];

  if (particles) {
    layers.push({
      id: "overlay.particles",
      type: "image",
      role: "fx",
      url: "/assets/champagne/particles/home-hero-particles.webp",
      opacity: applyBoost(0.35),
      blendMode: "screen",
      className: tokenClassNames["overlay.particles"],
      prmSafe: true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    });
  }

  if (filmGrain) {
    layers.push({
      id: "overlay.filmGrain",
      type: "image",
      role: "fx",
      url: "/assets/champagne/film-grain/film-grain-desktop.webp",
      opacity: applyBoost(0.32),
      blendMode: "soft-light",
      className: tokenClassNames["overlay.filmGrain"],
      prmSafe: true,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    });
  }

  if (!prmEnabled) {
    layers.push(
      {
        id: "overlay.caustics",
        type: "video",
      role: "motion",
      url: "/assets/champagne/motion/wave-caustics.webm",
      opacity: applyBoost(0.82),
      blendMode: "screen",
      className: tokenClassNames["overlay.caustics"],
      prmSafe: false,
      objectFit: "cover",
    },
    {
      id: "motion.shimmer",
      type: "video",
      role: "motion",
      url: "/assets/champagne/motion/glass-shimmer.webm",
      opacity: applyBoost(0.55),
      blendMode: "screen",
      className: "hero-layer hero-surface-layer hero-surface--glass-shimmer hero-layer--motion motion",
      prmSafe: false,
      objectFit: "cover",
    },
  );
}

  return layers;
}

export function buildLayerStack(options: {
  runtime?: HeroRuntimeConfig | null;
  mode?: HeroMode;
  particles?: boolean;
  filmGrain?: boolean;
  opacityBoost?: number;
  includeFallback?: boolean;
}) {
  const { runtime, particles, filmGrain, includeFallback = false } = options;
  const opacityBoost = Math.max(options.opacityBoost ?? 1, 0.01);
  const runtimeAny = runtime as any;
  const surfaces = runtimeAny?.surfaces ?? {};
  const motion = runtimeAny?.motion ?? {};
  const filmGrainSettings = runtimeAny?.filmGrain ?? {};
  const gradient = runtimeAny?.gradient ?? surfaces.gradient ?? "var(--smh-gradient)";
  const flags: HeroFlags = runtimeAny?.flags ?? { prm: false };
  const prmEnabled = Boolean(flags.prm);
  const surfaceVars = buildSurfaceVars({
    surfaces,
    motion,
    filmGrainSettings,
    particles,
    filmGrain,
    opacityBoost,
  });
  const runtimeLayers = Array.isArray(runtimeAny?.layers)
    ? (runtimeAny.layers as any[]).map((layer) => mapRuntimeLayer(layer))
    : null;
  const legacyLayers = runtime
    ? buildLegacyLayers(surfaces, motion, filmGrainSettings, opacityBoost, { particles, filmGrain, flags })
    : [];
  const fallbackLayers = includeFallback
    ? buildFallbackLayers({
        flags,
        particles,
        filmGrain,
        opacityBoost,
      })
    : [];

  const candidateLayers = runtimeLayers && runtimeLayers.length > 0
    ? runtimeLayers
    : legacyLayers.length > 0
      ? legacyLayers
      : fallbackLayers;

  const layerDiagnostics: RuntimeLayer[] = [];
  const resolvedLayers: RuntimeLayer[] = [];

  candidateLayers.forEach((layer) => {
    if (!layer) return;
    let suppressedReason: string | undefined;
    let warning: string | undefined;

    if (layer.id === "overlay.particles" && particles === false) {
      suppressedReason = "Particles disabled";
    }
    if (layer.id === "overlay.filmGrain" && filmGrain === false) {
      suppressedReason = "Film grain disabled";
    }
    if (prmEnabled && layer.prmSafe === false) {
      suppressedReason = "Blocked by PRM (unsafe motion)";
    }
    if (prmEnabled && layer.type === "video" && layer.prmSafe !== true) {
      suppressedReason = "Blocked by PRM (video)";
    }
    if (layer.role === "motion" && prmEnabled && layer.prmSafe === false) {
      suppressedReason = "Blocked by PRM (motion role)";
    }
    if (layer.type === "video" && !layer.url) {
      warning = "Missing video path";
    }
    if (layer.type === "gradient" && !layer.url) {
      suppressedReason = "Missing gradient";
    }
    if ((layer.opacity ?? 1) <= 0) {
      suppressedReason = "Zero opacity";
    }

    const layerWithWarning = { ...layer, warning } as RuntimeLayer;

    layerDiagnostics.push({ ...layerWithWarning, suppressedReason });
    if (suppressedReason) return;

    resolvedLayers.push(layerWithWarning);
  });

  if (resolvedLayers.length === 0 && fallbackLayers.length > 0) {
    fallbackLayers.forEach((layer) => layerDiagnostics.push({ ...layer, suppressedReason: undefined }));
    return { resolvedLayers: fallbackLayers, gradient, flags, runtimeLayers, legacyLayers, fallbackLayers, layerDiagnostics, surfaceVars } as const;
  }

  return { resolvedLayers, gradient, flags, runtimeLayers, legacyLayers, fallbackLayers, layerDiagnostics, surfaceVars } as const;
}

