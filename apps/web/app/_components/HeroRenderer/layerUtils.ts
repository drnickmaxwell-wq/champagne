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
  suppressedReason?: string;
};

export type HeroFlags = { prm?: boolean };

function resolveUrl(entry: any): string | undefined {
  if (!entry) return undefined;
  if (entry.path) return entry.path;
  if (entry.asset?.id) return ensureHeroAssetPath(entry.asset.id);
  if (entry.id) return ensureHeroAssetPath(entry.id);
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
    className: entry?.className ?? "hero-layer",
  } satisfies RuntimeLayer;
}

function buildLegacyLayers(
  surfaces: any,
  motion: any,
  filmGrainSettings: any,
  opacityBoost: number,
  options: { particles?: boolean; filmGrain?: boolean; flags: HeroFlags },
): RuntimeLayer[] {
  const gradient = surfaces?.gradient ?? "var(--smh-gradient)";
  const motionEntries = surfaces?.motion ?? [];
  const videoEntry = surfaces?.video;
  const particlesEnabled = options.particles ?? true;
  const filmGrainEnabled = options.filmGrain ?? true;
  const applyBoost = (value?: number) => Math.min(1, (value ?? 1) * opacityBoost);
  const shouldShowGrain = Boolean(
    filmGrainEnabled && filmGrainSettings?.enabled && (surfaces?.grain?.desktop || surfaces?.grain?.mobile),
  );
  const shouldShowParticles = Boolean(particlesEnabled && surfaces?.particles?.path);
  const causticsOpacity = applyBoost(
    motionEntries.find((entry: any) => entry.id === "overlay.caustics")?.opacity
      ?? surfaces?.overlays?.field?.opacity
      ?? 0.35,
  );
  const waveBackdropOpacity = applyBoost(surfaces?.background?.desktop?.opacity ?? 0.55);
  const waveBackdropBlend = surfaces?.background?.desktop?.blendMode as CSSProperties["mixBlendMode"];
  const surfaceStack = (surfaces?.surfaceStack ?? []).filter((layer: any) => {
    const token = layer.token ?? layer.id;
    if (layer.suppressed) return false;
    if (token === "overlay.particles" && !shouldShowParticles) return false;
    if (token === "overlay.filmGrain" && !shouldShowGrain) return false;
    return true;
  });
  const grainOpacity = applyBoost(
    (filmGrainSettings?.opacity ?? 0.28) * (surfaces?.grain?.desktop?.opacity ?? 1),
  );
  const particleOpacity = applyBoost(
    (motion?.particles?.density ?? 1) * (surfaces?.particles?.opacity ?? 1) * 0.35,
  );

  const tokenClassNames: Record<string, string> = {
    "gradient.base": "hero-layer hero-layer--gradient",
    "field.waveBackdrop": "hero-layer hero-layer--wave-backdrop",
    "mask.waveHeader": "hero-layer hero-layer--wave-mask",
    "field.waveRings": "hero-layer hero-layer--wave-rings",
    "field.dotGrid": "hero-layer hero-layer--dot-grid",
    "overlay.particles": "hero-layer hero-layer--particles",
    "overlay.filmGrain": "hero-layer hero-layer--grain",
    "overlay.caustics": "hero-layer hero-layer--caustics motion",
    "overlay.glassShimmer": "hero-layer hero-layer--motion motion",
    "overlay.goldDust": "hero-layer hero-layer--motion motion",
    "overlay.particlesDrift": "hero-layer hero-layer--motion motion",
    "hero.video": "hero-layer hero-layer--video motion",
    "hero.contentFrame": "hero-layer hero-layer--content",
  };

  const layerStyles: Record<string, Partial<RuntimeLayer>> = {
    "gradient.base": { type: "gradient", url: gradient, prmSafe: true },
    "field.waveBackdrop": {
      type: "image",
      url: resolveUrl(surfaces?.background?.desktop),
      opacity: waveBackdropOpacity,
      blendMode: waveBackdropBlend ?? "screen",
      prmSafe: surfaces?.background?.desktop?.prmSafe,
    },
    "mask.waveHeader": {
      type: "image",
      url: resolveUrl(surfaces?.waveMask?.desktop),
      opacity: applyBoost(surfaces?.waveMask?.desktop?.opacity),
      blendMode: surfaces?.waveMask?.desktop?.blendMode as CSSProperties["mixBlendMode"],
      prmSafe: surfaces?.waveMask?.desktop?.prmSafe,
    },
    "field.waveRings": {
      type: "image",
      url: resolveUrl(surfaces?.overlays?.field),
      opacity: applyBoost(surfaces?.overlays?.field?.opacity),
      blendMode: surfaces?.overlays?.field?.blendMode as CSSProperties["mixBlendMode"],
      prmSafe: surfaces?.overlays?.field?.prmSafe,
    },
    "field.dotGrid": {
      type: "image",
      url: resolveUrl(surfaces?.overlays?.dots),
      opacity: applyBoost(surfaces?.overlays?.dots?.opacity),
      blendMode: surfaces?.overlays?.dots?.blendMode as CSSProperties["mixBlendMode"],
      prmSafe: surfaces?.overlays?.dots?.prmSafe,
    },
    "overlay.particles": {
      type: "image",
      url: shouldShowParticles ? resolveUrl(surfaces?.particles) : undefined,
      opacity: particleOpacity,
      blendMode: (surfaces?.particles?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
      prmSafe: surfaces?.particles?.prmSafe ?? true,
    },
    "overlay.filmGrain": {
      type: "image",
      url: shouldShowGrain ? resolveUrl(surfaces?.grain?.desktop) : undefined,
      opacity: grainOpacity,
      blendMode: (surfaces?.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "soft-light",
      prmSafe: surfaces?.grain?.desktop?.prmSafe ?? true,
    },
    "overlay.caustics": { type: "video", opacity: causticsOpacity, blendMode: "screen", prmSafe: false },
    "overlay.glassShimmer": { type: "video", blendMode: "screen", prmSafe: false },
    "overlay.goldDust": { type: "video", blendMode: "screen", prmSafe: false },
    "overlay.particlesDrift": { type: "video", blendMode: "screen", prmSafe: false },
    "hero.contentFrame": { type: "unknown", prmSafe: true },
  };

  const layers: RuntimeLayer[] = surfaceStack.map((layer: any) => {
    const token = layer.token ?? layer.id ?? "layer";
    const baseStyle = layerStyles[token] ?? { type: "unknown" };
    const motionEntry = motionEntries.find((entry: any) => entry.id === token);
    const urlFromStyle = baseStyle.url ?? resolveUrl(motionEntry);
    const opacityFromMotion = motionEntry
      ? motionEntry.opacity ?? (motion?.shimmerIntensity ?? 1) * 0.85
      : baseStyle.opacity;
    return {
      id: token,
      role: layer.role,
      className: layer.className ?? tokenClassNames[token] ?? "hero-layer",
      type: motionEntry ? "video" : baseStyle.type ?? "unknown",
      url: motionEntry?.path ?? urlFromStyle,
      opacity: motionEntry ? applyBoost(opacityFromMotion) : opacityFromMotion,
      blendMode: motionEntry
        ? (motionEntry.blendMode as CSSProperties["mixBlendMode"])
        : baseStyle.blendMode,
      zIndex: layer.zIndex,
      prmSafe: layer.prmSafe ?? baseStyle.prmSafe,
    } satisfies RuntimeLayer;
  });

  if (videoEntry?.path) {
    layers.push({
      id: "hero.video",
      role: videoEntry.role ?? "motion",
      type: "video",
      url: videoEntry.path,
      opacity: applyBoost(videoEntry.opacity ?? (motion?.shimmerIntensity ?? 1) * 0.85),
      blendMode: videoEntry.blendMode as CSSProperties["mixBlendMode"],
      className: tokenClassNames["hero.video"] ?? "hero-layer hero-layer--video motion",
      prmSafe: videoEntry.prmSafe,
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
      className: "hero-layer hero-layer--gradient",
      prmSafe: true,
    },
    {
      id: "field.waveBackdrop",
      type: "image",
      role: "background",
      url: "/assets/champagne/waves/waves-bg-2560.webp",
      opacity: applyBoost(0.72),
      blendMode: "screen",
      className: "hero-layer hero-layer--wave-backdrop",
      prmSafe: true,
    },
    {
      id: "mask.waveHeader",
      type: "image",
      role: "fx",
      url: "/assets/champagne/waves/wave-mask-desktop.webp",
      opacity: applyBoost(0.75),
      blendMode: "soft-light",
      className: "hero-layer hero-layer--wave-mask",
      prmSafe: true,
    },
    {
      id: "field.waveRings",
      type: "image",
      role: "fx",
      url: "/assets/champagne/waves/wave-field.svg",
      opacity: applyBoost(0.55),
      blendMode: "screen",
      className: "hero-layer hero-layer--wave-rings",
      prmSafe: true,
    },
    {
      id: "field.dotGrid",
      type: "image",
      role: "fx",
      url: "/assets/champagne/waves/wave-dots.svg",
      opacity: applyBoost(0.42),
      blendMode: "soft-light",
      className: "hero-layer hero-layer--dot-grid",
      prmSafe: true,
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
      className: "hero-layer hero-layer--particles",
      prmSafe: true,
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
      className: "hero-layer hero-layer--grain",
      prmSafe: true,
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
        className: "hero-layer hero-layer--caustics motion",
        prmSafe: false,
      },
      {
        id: "motion.shimmer",
        type: "video",
        role: "motion",
        url: "/assets/champagne/motion/glass-shimmer.webm",
        opacity: applyBoost(0.55),
        blendMode: "screen",
        className: "hero-layer hero-layer--motion motion",
        prmSafe: false,
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
  // PRM is treated as "unsafe motion" whenever the runtime marks a layer as prmSafe=false
  // or when the layer is a video without explicit prmSafe=true.
  const resolvedLayers: RuntimeLayer[] = candidateLayers.filter((layer) => {
    if (!layer) return false;
    if (layer.id === "overlay.particles" && particles === false) {
      layerDiagnostics.push({ ...layer, suppressedReason: "Particles disabled" });
      return false;
    }
    if (layer.id === "overlay.filmGrain" && filmGrain === false) {
      layerDiagnostics.push({ ...layer, suppressedReason: "Film grain disabled" });
      return false;
    }
    if (prmEnabled && layer.prmSafe === false) {
      layerDiagnostics.push({ ...layer, suppressedReason: "Blocked by PRM (unsafe motion)" });
      return false;
    }
    if (prmEnabled && layer.type === "video" && layer.prmSafe !== true) {
      layerDiagnostics.push({ ...layer, suppressedReason: "Blocked by PRM (video)" });
      return false;
    }
    if (layer.role === "motion" && prmEnabled && layer.prmSafe === false) {
      layerDiagnostics.push({ ...layer, suppressedReason: "Blocked by PRM (motion role)" });
      return false;
    }
    if (layer.type === "video" && !layer.url) {
      layerDiagnostics.push({ ...layer, suppressedReason: "Missing video path" });
      return false;
    }
    if (layer.type === "gradient" && !layer.url) {
      layerDiagnostics.push({ ...layer, suppressedReason: "Missing gradient" });
      return false;
    }
    if ((layer.opacity ?? 1) <= 0) {
      layerDiagnostics.push({ ...layer, suppressedReason: "Zero opacity" });
      return false;
    }
    layerDiagnostics.push({ ...layer, suppressedReason: undefined });
    return true;
  });

  return { resolvedLayers, gradient, flags, runtimeLayers, legacyLayers, fallbackLayers, layerDiagnostics } as const;
}
