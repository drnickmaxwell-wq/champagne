import type { CSSProperties, Ref } from "react";
import { BaseChampagneSurface, ensureHeroAssetPath, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";

const sacredSurfacesManifest =
  process.env.NODE_ENV !== "production"
    ? require("../../../../../packages/champagne-manifests/data/hero/sacred_hero_surfaces.json")
    : null;

function normalizeGradientCss(input?: string): string {
  if (!input || !input.trim()) return "var(--smh-gradient)";
  const trimmed = input.trim();
  const lowered = trimmed.toLowerCase();

  if (
    trimmed.startsWith("var(") ||
    lowered.includes("linear-gradient(") ||
    lowered.includes("radial-gradient(") ||
    lowered.includes("conic-gradient(")
  ) {
    return trimmed;
  }

  return "var(--smh-gradient)";
}

export interface HeroRendererProps {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  diagnosticBoost?: boolean;
  surfaceRef?: Ref<HTMLDivElement>;
  pageCategory?: "home" | "treatment" | "editorial" | "utility" | "marketing" | string;
}

function HeroFallback() {
  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        background: "var(--smh-gradient)",
        minHeight: "48vh",
        display: "grid",
        alignItems: "center",
        padding: "clamp(2rem, 5vw, 3.5rem)",
      }}
    >
      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "960px" }}>
        <span style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>
          Champagne Dentistry
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", lineHeight: 1.1 }}>
          A calm, cinematic hero is loading.
        </h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "720px", lineHeight: 1.6 }}>
          Sacred hero assets are unavailable. Showing a safe gradient surface until the manifest is ready.
        </p>
      </div>
    </BaseChampagneSurface>
  );
}

export async function HeroRenderer({
  mode = "home",
  treatmentSlug,
  prm,
  timeOfDay,
  particles,
  filmGrain,
  diagnosticBoost = false,
  surfaceRef,
  pageCategory,
}: HeroRendererProps) {
  let runtime: Awaited<ReturnType<typeof getHeroRuntime>> | null = null;
  // TODO: Wire treatmentSlug directly from the treatment page router when that context is available.
  const resolvedPageCategory = pageCategory ?? (mode === "home" ? "home" : mode === "treatment" ? "treatment" : undefined);

  try {
    runtime = await getHeroRuntime({
      mode,
      treatmentSlug,
      prm,
      timeOfDay,
      particles,
      filmGrain,
      pageCategory: resolvedPageCategory,
      variantId: mode === "home" ? "default" : undefined,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero runtime failed", error);
    }
  }

  if (!runtime) return <HeroFallback />;

  const { content, surfaces, layout, filmGrain: filmGrainSettings } = runtime;
  const videoDenylist = ["dental-hero-4k.mp4"];
  const isDeniedVideo = (path?: string) => path && videoDenylist.some((item) => path.includes(item));
  const gradient = normalizeGradientCss(surfaces.gradient);
  const motionEntries = surfaces.motion ?? [];
  const prmEnabled = prm ?? runtime.flags.prm;
  const videoEntry = surfaces.video;
  const heroVideoActive = Boolean(!prmEnabled && videoEntry?.path && !isDeniedVideo(videoEntry.path));
  const particleOpacity = surfaces.particles?.opacity;
  const particlesAssetAvailable = Boolean(surfaces.particles?.path || surfaces.particles?.asset?.id);
  const filteredMotionEntries = motionEntries.filter((entry) => {
    if (isDeniedVideo(entry.path)) return false;
    if (heroVideoActive && entry.id?.toLowerCase().includes("fallback")) return false;
    return true;
  });
  const motionCausticsActive = filteredMotionEntries.some((entry) =>
    entry.className?.includes("hero-surface--caustics"),
  );
  const motionShimmerActive = filteredMotionEntries.some((entry) =>
    entry.className?.includes("hero-surface--glass-shimmer"),
  );
  const motionGoldDustActive = filteredMotionEntries.some((entry) =>
    entry.className?.includes("hero-surface--gold-dust"),
  );
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
  const grainOpacity = filmGrainSettings?.opacity ?? surfaces.grain?.desktop?.opacity;
  const grainAssetAvailable = Boolean(surfaces.grain?.desktop || surfaces.grain?.mobile);
  const particlesGovernanceMissing = particles !== false && particlesAssetAvailable && particleOpacity === undefined;
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
  const waveBackdropOpacity = surfaces.background?.desktop?.opacity;
  const waveBackdropBlend = surfaces.background?.desktop?.blendMode as CSSProperties["mixBlendMode"];
  const surfaceStack = (surfaces.surfaceStack ?? []).filter((layer) => {
    const token = layer.token ?? layer.id;
    if (layer.suppressed) return false;
    if (token === "mask.waveHeader" || layer.className?.includes("hero-surface--wave-mask")) return false;
    if (token && activeMotionIds.has(token)) return false;
    if (motionCausticsActive && layer.className?.includes("hero-surface--caustics")) return false;
    if (motionShimmerActive && layer.className?.includes("hero-surface--glass-shimmer")) return false;
    if (motionGoldDustActive && layer.className?.includes("hero-surface--gold-dust")) return false;
    if (token === "overlay.particles" && (!shouldShowParticles || particlesGovernanceMissing)) return false;
    if (token === "overlay.filmGrain" && (!shouldShowGrain || grainGovernanceMissing)) return false;
    return true;
  });
  const resolveMotionOpacity = (value?: number) => (value === undefined ? undefined : value);
  const diagnosticOutlineStyle: CSSProperties | undefined = diagnosticBoost
    ? { outline: "1px solid var(--champagne-keyline-gold, var(--accentGold_soft))", outlineOffset: "-1px" }
    : undefined;

  const isDeMilkMode = mode === "home" || mode === "treatment";
  const layerOpacityTuning: Record<
    string,
    | {
        multiplier?: number;
        cap?: number;
        screenBlendOverride?: CSSProperties["mixBlendMode"];
      }
    | undefined
  > = {
    "field.waveBackdrop": { multiplier: 0.62, cap: 0.2 },
    "field.waveRings": { multiplier: 0.78, cap: 0.24 },
    "field.dotGrid": { multiplier: 0.6, cap: 0.2 },
    "overlay.particles": { multiplier: 0.7, cap: 0.08 },
    "overlay.caustics": { multiplier: 0.6, cap: 0.1, screenBlendOverride: "soft-light" },
    "overlay.glassShimmer": { multiplier: 0.6, cap: 0.1, screenBlendOverride: "soft-light" },
    "overlay.goldDust": { multiplier: 0.6, cap: 0.1, screenBlendOverride: "soft-light" },
    "overlay.filmGrain": { multiplier: 1, cap: 0.06 },
  };

  const applyBlendTuning = (id: string, blendMode?: CSSProperties["mixBlendMode"]) => {
    if (!isDeMilkMode || !blendMode) return blendMode;
    const tuning = layerOpacityTuning[id];
    if (tuning?.screenBlendOverride && blendMode === "screen") {
      return tuning.screenBlendOverride;
    }
    return blendMode;
  };

  const applyOpacityTuning = (id: string, value?: number, blendMode?: CSSProperties["mixBlendMode"]) => {
    if (!isDeMilkMode || value === undefined) return value;
    const tuning = layerOpacityTuning[id];
    if (!tuning) return value;
    const multiplier = tuning.multiplier ?? 1;
    const capped = Math.min(value * multiplier, tuning.cap ?? 1);
    if (blendMode === "screen" && tuning.cap !== undefined) {
      return Math.min(capped, tuning.cap);
    }
    return capped;
  };

  const resolveMotionStyle = (
    entry?: { blendMode?: string | null; opacity?: number | null; zIndex?: number },
    id?: string,
  ) => {
    if (!entry) return {};
    const style: CSSProperties = {};
    const tunedBlend = applyBlendTuning(id ?? "", entry.blendMode as CSSProperties["mixBlendMode"] | undefined);

    if (entry.opacity !== undefined && entry.opacity !== null) {
      style.opacity = resolveMotionOpacity(applyOpacityTuning(id ?? "", entry.opacity, tunedBlend));
    } else {
      style.opacity = 0;
      if (id) noteMissing(id, "opacity", "motion");
    }

    if (tunedBlend) {
      style.mixBlendMode = tunedBlend;
    } else if (id) {
      noteMissing(id, "blend", "motion");
      style.opacity = 0;
    }

    if (typeof entry.zIndex === "number") {
      style.zIndex = entry.zIndex;
    } else if (id) {
      noteMissing(id, "zIndex", "motion");
    }

    return style;
  };

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
    ["--hero-wave-background-desktop" as string]: surfaces.background?.desktop?.path
      ? `url("${surfaces.background.desktop.path}")`
      : surfaces.background?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.background.desktop.asset.id)}")`
        : surfaces.background?.desktop?.id
          ? `url("${ensureHeroAssetPath(surfaces.background.desktop.id)}")`
          : undefined,
    ["--hero-wave-background-mobile" as string]: surfaces.background?.mobile?.path
      ? `url("${surfaces.background.mobile.path}")`
      : surfaces.background?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.background.mobile.asset.id)}")`
        : surfaces.background?.mobile?.id
          ? `url("${ensureHeroAssetPath(surfaces.background.mobile.id)}")`
          : undefined,
    ["--hero-overlay-field" as string]: surfaces.overlays?.field?.path
      ? `url("${surfaces.overlays.field.path}")`
      : surfaces.overlays?.field?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.overlays.field.asset.id)}")`
        : undefined,
    ["--hero-overlay-dots" as string]: surfaces.overlays?.dots?.path
      ? `url("${surfaces.overlays.dots.path}")`
      : surfaces.overlays?.dots?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.overlays.dots.asset.id)}")`
        : undefined,
    ["--hero-particles" as string]: shouldShowParticles && surfaces.particles?.path
      ? `url("${surfaces.particles.path}")`
      : shouldShowParticles && surfaces.particles?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.particles.asset.id)}")`
        : undefined,
    ["--hero-grain-desktop" as string]: surfaces.grain?.desktop?.path
      ? `url("${surfaces.grain.desktop.path}")`
      : surfaces.grain?.desktop?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.grain.desktop.asset.id)}")`
        : undefined,
    ["--hero-grain-mobile" as string]: surfaces.grain?.mobile?.path
      ? `url("${surfaces.grain.mobile.path}")`
      : surfaces.grain?.mobile?.asset?.id
        ? `url("${ensureHeroAssetPath(surfaces.grain.mobile.asset.id)}")`
        : undefined,
    ["--hero-film-grain-opacity" as string]: shouldShowGrain ? grainOpacity : undefined,
    ["--hero-film-grain-blend" as string]: shouldShowGrain
      ? ((surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? undefined)
      : undefined,
    ["--hero-particles-opacity" as string]: shouldShowParticles ? particleOpacity : undefined,
    ["--hero-caustics-overlay" as string]: "url(/assets/champagne/textures/wave-light-overlay.webp)",
  };

  if (process.env.NODE_ENV !== "production") {
    const surfaceVarsRecord = surfaceVars as Record<string, unknown>;
    const diagnosticSurfaceVars = {
      waveBackgroundDesktop: surfaceVarsRecord["--hero-wave-background-desktop"],
      waveBackgroundMobile: surfaceVarsRecord["--hero-wave-background-mobile"],
      waveMaskDesktop: surfaceVarsRecord["--hero-wave-mask-desktop"],
      waveMaskMobile: surfaceVarsRecord["--hero-wave-mask-mobile"],
      overlayField: surfaceVarsRecord["--hero-overlay-field"],
      overlayDots: surfaceVarsRecord["--hero-overlay-dots"],
      particles: surfaceVarsRecord["--hero-particles"],
      grainDesktop: surfaceVarsRecord["--hero-grain-desktop"],
      grainMobile: surfaceVarsRecord["--hero-grain-mobile"],
    };

    console.debug("HeroRenderer surface vars", diagnosticSurfaceVars);
  }

  const layerStyles: Record<string, CSSProperties> = {
    "gradient.base": { zIndex: 1 },
    "field.waveBackdrop": (() => {
      const style: CSSProperties = { zIndex: 2 };
      let missingForLayer = false;

      const tunedBlend = applyBlendTuning("field.waveBackdrop", waveBackdropBlend);
      if (tunedBlend) {
        style.mixBlendMode = tunedBlend;
      } else {
        noteMissing("field.waveBackdrop", "blend", "surface");
        missingForLayer = true;
      }

      if (waveBackdropOpacity !== undefined) {
        const tunedOpacity = applyOpacityTuning("field.waveBackdrop", waveBackdropOpacity, tunedBlend);
        style.opacity = missingForLayer ? 0 : tunedOpacity;
      } else {
        style.opacity = 0;
        noteMissing("field.waveBackdrop", "opacity", "surface");
        missingForLayer = true;
      }

      return style;
    })(),
    "mask.waveHeader": {
      ...(surfaces.waveMask?.desktop?.blendMode
        ? { mixBlendMode: surfaces.waveMask.desktop.blendMode as CSSProperties["mixBlendMode"] }
        : {}),
      ...(surfaces.waveMask?.desktop?.opacity !== undefined
        ? { opacity: surfaces.waveMask.desktop.opacity }
        : {}),
    },
    "field.waveRings": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-overlay-field)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 3,
      };
      let missingForLayer = false;

      const tunedBlend = applyBlendTuning(
        "field.waveRings",
        surfaces.overlays?.field?.blendMode as CSSProperties["mixBlendMode"] | undefined,
      );
      if (tunedBlend) {
        style.mixBlendMode = tunedBlend;
      } else {
        noteMissing("field.waveRings", "blend", "surface");
        missingForLayer = true;
      }

      if (surfaces.overlays?.field?.opacity !== undefined) {
        const tunedOpacity = applyOpacityTuning("field.waveRings", surfaces.overlays.field.opacity, tunedBlend);
        style.opacity = missingForLayer ? 0 : tunedOpacity;
      } else {
        style.opacity = 0;
        noteMissing("field.waveRings", "opacity", "surface");
        missingForLayer = true;
      }

      return style;
    })(),
    "field.dotGrid": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-overlay-dots)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 4,
      };
      let missingForLayer = false;

      const tunedBlend = applyBlendTuning(
        "field.dotGrid",
        surfaces.overlays?.dots?.blendMode as CSSProperties["mixBlendMode"] | undefined,
      );
      if (tunedBlend) {
        style.mixBlendMode = tunedBlend;
      } else {
        noteMissing("field.dotGrid", "blend", "surface");
        missingForLayer = true;
      }

      if (surfaces.overlays?.dots?.opacity !== undefined) {
        const tunedOpacity = applyOpacityTuning("field.dotGrid", surfaces.overlays.dots.opacity, tunedBlend);
        style.opacity = missingForLayer ? 0 : tunedOpacity;
      } else {
        style.opacity = 0;
        noteMissing("field.dotGrid", "opacity", "surface");
        missingForLayer = true;
      }

      return style;
    })(),
    "overlay.particles": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-particles)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 5,
      };
      let missingForLayer = false;

      const tunedBlend = applyBlendTuning(
        "overlay.particles",
        surfaces.particles?.blendMode as CSSProperties["mixBlendMode"] | undefined,
      );
      if (tunedBlend) {
        style.mixBlendMode = tunedBlend;
      } else if (shouldShowParticles) {
        noteMissing("overlay.particles", "blend", "surface");
        missingForLayer = true;
      }

      if (particleOpacity !== undefined) {
        const tunedOpacity = applyOpacityTuning("overlay.particles", particleOpacity, tunedBlend);
        style.opacity = missingForLayer ? 0 : tunedOpacity;
      } else if (shouldShowParticles) {
        style.opacity = 0;
        noteMissing("overlay.particles", "opacity", "surface");
        missingForLayer = true;
      }

      return style;
    })(),
    "overlay.filmGrain": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-grain-desktop)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: 7,
      };
      let missingForLayer = false;

      if (surfaces.grain?.desktop?.blendMode) {
        style.mixBlendMode = surfaces.grain.desktop.blendMode as CSSProperties["mixBlendMode"];
      } else if (shouldShowGrain) {
        noteMissing("overlay.filmGrain", "blend", "surface");
        missingForLayer = true;
      }

      if (grainOpacity !== undefined) {
        style.opacity = missingForLayer ? 0 : grainOpacity;
      } else if (shouldShowGrain) {
        style.opacity = 0;
        noteMissing("overlay.filmGrain", "opacity", "surface");
        missingForLayer = true;
      }

      return style;
    })(),
    "hero.contentFrame": {
      background: "transparent",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  };

  const surfaceInlineStyles = new Map<string, CSSProperties>();
  const surfaceDebug = surfaceStack.map((layer, index) => {
    const resolvedStyle = layer.token ? layerStyles[layer.token] : undefined;
    const inlineStyle = { ...(resolvedStyle ?? {}), ...diagnosticOutlineStyle };

    surfaceInlineStyles.set(layer.id, inlineStyle);

    return {
      id: layer.id,
      role: layer.role,
      order: index,
      resolved: {
        opacity: (resolvedStyle?.opacity as number | undefined) ?? null,
        blendMode: (resolvedStyle?.mixBlendMode as string | undefined) ?? null,
        zIndex: (resolvedStyle?.zIndex as number | undefined) ?? null,
      },
    };
  });

  const heroVideoStyle = resolveMotionStyle(videoEntry ?? undefined, "motion.heroVideo");
  const heroVideoDebug = videoEntry
    ? [
        {
          id: "motion.heroVideo",
          order: surfaceStack.length,
          resolved: {
            opacity: resolveMotionOpacity(videoEntry.opacity ?? undefined) ?? null,
            blendMode: videoEntry.blendMode ?? null,
            zIndex: (videoEntry as { zIndex?: number }).zIndex ?? null,
          },
        },
      ]
    : [];

  const motionInlineStyles = new Map<string, CSSProperties>();
  const motionEntriesWithStyles = filteredMotionEntries.map((entry, index) => {
    const style = resolveMotionStyle(entry, entry.id ?? `motion-${index}`);
    motionInlineStyles.set(entry.id ?? `motion-${index}`, style);
    const motionEntryZIndex = (entry as { zIndex?: number }).zIndex ?? null;

    return {
      entry,
      style,
      debug: {
        id: entry.id,
        order: surfaceStack.length + heroVideoDebug.length + index,
        resolved: {
          opacity: resolveMotionOpacity(entry.opacity ?? undefined) ?? null,
          blendMode: entry.blendMode ?? null,
          zIndex: motionEntryZIndex,
        },
      },
    };
  });

  const surfaceIdsRendered = [
    ...surfaceStack.map((layer) => layer.id),
    ...(!prmEnabled && videoEntry?.path && !isDeniedVideo(videoEntry.path) ? ["motion.heroVideo"] : []),
    ...(!prmEnabled
      ? motionEntriesWithStyles.map(({ entry }) => entry.id).filter((id): id is string => Boolean(id))
      : []),
  ];

  const manifestStackOrder =
    process.env.NODE_ENV !== "production" && sacredSurfacesManifest?.surfaceStack
      ? new Map<string, number>(
          (sacredSurfacesManifest.surfaceStack as { id: string }[]).map((entry, index) => [entry.id, index]),
        )
      : null;

  const manifestLookup = (id: string) => {
    if (!sacredSurfacesManifest) return { opacity: null, blendMode: null, zIndex: null };

    const manifest = sacredSurfacesManifest as Record<string, unknown>;
    const waveBackgrounds = manifest.waveBackgrounds as Record<string, { desktop?: { opacity?: number; blendMode?: string } }>;
    const overlays = manifest.overlays as Record<string, { opacity?: number; blendMode?: string }>;
    const particlesManifest = manifest.particles as Record<string, { opacity?: number; blendMode?: string }>;
    const grainManifest = manifest.grain as Record<string, { opacity?: number; blendMode?: string }>;
    const motionManifest = manifest.motion as Record<string, { opacity?: number; blendMode?: string }>;
    const videoManifest = manifest.video as Record<string, { opacity?: number; blendMode?: string }>;

    const zIndex = manifestStackOrder?.get(id) ?? null;

    const backgroundEntry = waveBackgrounds?.[id]?.desktop;
    if (backgroundEntry) {
      return { opacity: backgroundEntry.opacity ?? null, blendMode: backgroundEntry.blendMode ?? null, zIndex };
    }

    const overlayEntry = overlays?.[id];
    if (overlayEntry) {
      return { opacity: overlayEntry.opacity ?? null, blendMode: overlayEntry.blendMode ?? null, zIndex };
    }

    const particleEntry = particlesManifest?.[id];
    if (particleEntry) {
      return { opacity: particleEntry.opacity ?? null, blendMode: particleEntry.blendMode ?? null, zIndex };
    }

    const grainEntry = grainManifest?.[id];
    if (grainEntry) {
      return { opacity: grainEntry.opacity ?? null, blendMode: grainEntry.blendMode ?? null, zIndex };
    }

    const motionEntry = motionManifest?.[id];
    if (motionEntry) {
      return { opacity: motionEntry.opacity ?? null, blendMode: motionEntry.blendMode ?? null, zIndex };
    }

    const videoKey = id === "motion.heroVideo" ? "hero.video" : id;
    const videoEntry = videoManifest?.[videoKey];

    if (videoEntry) {
      return { opacity: videoEntry.opacity ?? null, blendMode: videoEntry.blendMode ?? null, zIndex };
    }

    return { opacity: null, blendMode: null, zIndex };
  };

  const manifestSources = [
    { type: "surfaces", path: runtime.manifestSources?.[1] ?? "packages/champagne-manifests/data/hero/sacred_hero_surfaces.json", present: true },
    { type: "motion", path: runtime.manifestSources?.[1] ?? "packages/champagne-manifests/data/hero/sacred_hero_surfaces.json", present: true },
    { type: "base", path: runtime.manifestSources?.[0] ?? null, present: Boolean(runtime.manifestSources?.[0]) },
    { type: "variants", path: runtime.manifestSources?.[2] ?? null, present: Boolean(runtime.manifestSources?.[2]) },
  ];
  const structuralSurfaceIds = new Set(["gradient.base", "hero.contentFrame"]);
  const canonicalSurfaceIds = [
    "gradient.base",
    "field.waveBackdrop",
    "field.waveRings",
    "field.dotGrid",
    "overlay.particles",
    "overlay.filmGrain",
    "hero.contentFrame",
  ];
  const canonicalMotionIds = ["overlay.caustics", "overlay.glassShimmer", "overlay.goldDust"];

  const resolvedSurfaces = canonicalSurfaceIds.map((id) => {
    const manifest = manifestLookup(id);
    const resolvedEntry = surfaceDebug.find((entry) => entry.id === id) ?? null;
    const inline = surfaceInlineStyles.get(id);
    const disabled = !surfaceIdsRendered.includes(id);
    const structural = structuralSurfaceIds.has(id);
    const opacitySource = manifest.opacity !== null ? "manifest" : "none";
    const blendSource = manifest.blendMode !== null ? "manifest" : "none";
    const zIndexSource = manifest.zIndex !== null ? "manifest" : "none";

    return {
      id,
      manifestOpacity: manifest.opacity,
      manifestBlend: manifest.blendMode,
      manifestZ: manifest.zIndex,
      opacitySource,
      blendSource,
      zIndexSource,
      resolvedOpacity: disabled ? 0 : resolvedEntry?.resolved.opacity ?? null,
      resolvedBlend: disabled ? null : resolvedEntry?.resolved.blendMode ?? null,
      resolvedZ: resolvedEntry?.resolved.zIndex ?? null,
      inlineOpacity: inline?.opacity ?? null,
      inlineBlend: inline?.mixBlendMode ?? null,
      inlineZ: inline?.zIndex ?? null,
      rendered: surfaceIdsRendered.includes(id),
      disabled,
      structural,
    };
  });

  const resolvedMotions = canonicalMotionIds.map((id) => {
    const manifest = manifestLookup(id);
    const inline = motionInlineStyles.get(id);
    const debugEntry = motionEntriesWithStyles.find(({ entry }) => entry.id === id)?.debug ?? null;
    const disabled = !surfaceIdsRendered.includes(id);
    const opacitySource = manifest.opacity !== null ? "manifest" : "none";
    const blendSource = manifest.blendMode !== null ? "manifest" : "none";
    const zIndexSource = manifest.zIndex !== null ? "manifest" : "none";

    return {
      id,
      manifestOpacity: manifest.opacity,
      manifestBlend: manifest.blendMode,
      manifestZ: manifest.zIndex,
      opacitySource,
      blendSource,
      zIndexSource,
      resolvedOpacity: disabled ? 0 : debugEntry?.resolved.opacity ?? null,
      resolvedBlend: disabled ? null : debugEntry?.resolved.blendMode ?? null,
      resolvedZ: debugEntry?.resolved.zIndex ?? null,
      inlineOpacity: inline?.opacity ?? null,
      inlineBlend: inline?.mixBlendMode ?? null,
      inlineZ: inline?.zIndex ?? null,
      rendered: surfaceIdsRendered.includes(id),
      disabled,
      structural: false,
    };
  });

  const missingGovernanceReceipts = Array.from(missingGovernance.values()).map((entry) => ({
    id: entry.id,
    kind: entry.kind,
    missingFields: Array.from(entry.missingFields),
    reason: entry.reason,
    action: entry.action,
  }));

  const heroDebugPayload =
    process.env.NODE_ENV !== "production"
      ? {
          heroId: runtime.id,
          manifestSources,
          surfaceIdsRendered,
          resolvedSurfaces,
          resolvedMotions,
          missingGovernance: missingGovernanceReceipts,
        }
      : null;

  const resolveVsInlineScript =
    process.env.NODE_ENV !== "production" ? (
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            if (typeof window === 'undefined') return;
            const params = new URLSearchParams(window.location.search);
            if (!params.has('heroDebug') || params.get('heroDebug') !== '1') return;
            const payload = ${JSON.stringify(heroDebugPayload)};
            if (!payload) return;
            try {
              const hero = document.querySelector('.hero-renderer');
              const readInline = (el) => ({
                opacity: el?.style?.opacity || null,
                mixBlendMode: el?.style?.mixBlendMode || null,
                zIndex: el?.style?.zIndex || null,
              });
              const readComputed = (el) => {
                if (!el) return { opacity: null, mixBlendMode: null, zIndex: null };
                const cs = window.getComputedStyle(el);
                return { opacity: cs.opacity, mixBlendMode: cs.mixBlendMode, zIndex: cs.zIndex };
              };

              const domSurfaces = payload.resolvedSurfaces.map((surface) => {
                const el = hero ? hero.querySelector('[data-surface-id="' + surface.id + '"]') : null;
                return { id: surface.id, inline: readInline(el), computed: readComputed(el) };
              });

              const domMotions = payload.resolvedMotions.map((motion) => {
                const el = hero ? hero.querySelector('[data-surface-id="' + motion.id + '"]') : null;
                return { id: motion.id, inline: readInline(el), computed: readComputed(el) };
              });

              const normalizeNumber = (value) => {
                if (value === null || value === undefined || value === '') return null;
                const num = Number(value);
                if (Number.isNaN(num)) return value;
                return Number(num.toFixed(3));
              };

              const normalizeString = (value) => (value === null || value === undefined || value === '' ? null : value);
              const assertions = [];

              const compareEntry = (entry, domEntry) => {
                if (entry.structural || entry.disabled) return;

                const manifestOpacity = normalizeNumber(entry.manifestOpacity);
                const resolvedOpacity = normalizeNumber(entry.resolvedOpacity);
                const inlineOpacity = normalizeNumber(domEntry.inline.opacity);
                const computedOpacity = normalizeNumber(domEntry.computed.opacity);

                const manifestBlend = normalizeString(entry.manifestBlend);
                const resolvedBlend = normalizeString(entry.resolvedBlend);
                const inlineBlend = normalizeString(domEntry.inline.mixBlendMode);
                const computedBlend = normalizeString(domEntry.computed.mixBlendMode);

                const manifestZ = normalizeNumber(entry.manifestZ);
                const resolvedZ = normalizeNumber(entry.resolvedZ);
                const inlineZ = normalizeNumber(domEntry.inline.zIndex);
                const computedZ = normalizeNumber(domEntry.computed.zIndex);

                if (entry.opacitySource === 'manifest') {
                  assertions.push({
                    id: entry.id,
                    field: 'opacity',
                    source: entry.opacitySource,
                    structural: entry.structural,
                    disabled: entry.disabled,
                    manifest: manifestOpacity,
                    resolved: resolvedOpacity,
                    inline: inlineOpacity,
                    computed: computedOpacity,
                    match: manifestOpacity === null ? computedOpacity === null : manifestOpacity === computedOpacity,
                  });
                }

                if (entry.blendSource === 'manifest') {
                  assertions.push({
                    id: entry.id,
                    field: 'blend',
                    source: entry.blendSource,
                    structural: entry.structural,
                    disabled: entry.disabled,
                    manifest: manifestBlend,
                    resolved: resolvedBlend,
                    inline: inlineBlend,
                    computed: computedBlend,
                    match: manifestBlend === null ? computedBlend === null : manifestBlend === computedBlend,
                  });
                }

                if (entry.zIndexSource === 'manifest') {
                  assertions.push({
                    id: entry.id,
                    field: 'zIndex',
                    source: entry.zIndexSource,
                    structural: entry.structural,
                    disabled: entry.disabled,
                    manifest: manifestZ,
                    resolved: resolvedZ,
                    inline: inlineZ,
                    computed: computedZ,
                    match: manifestZ === null ? computedZ === null : manifestZ === computedZ,
                  });
                }
              };

              payload.resolvedSurfaces.forEach((entry) => {
                const domEntry = domSurfaces.find((item) => item.id === entry.id) || { inline: {}, computed: {} };
                compareEntry(entry, domEntry);
              });

              payload.resolvedMotions.forEach((entry) => {
                const domEntry = domMotions.find((item) => item.id === entry.id) || { inline: {}, computed: {} };
                compareEntry(entry, domEntry);
              });

              const diffs = assertions
                .filter((a) => !a.match)
                .map((a) => ({
                  id: a.id,
                  field: a.field,
                  source: a.source,
                  structural: a.structural,
                  disabled: a.disabled,
                  manifest: a.manifest,
                  resolved: a.resolved,
                  inline: a.inline,
                  computed: a.computed,
                }));

              const receipts = {
                heroId: payload.heroId,
                manifestSources: payload.manifestSources,
                surfaceIdsRendered: payload.surfaceIdsRendered,
                resolvedSurfaces: payload.resolvedSurfaces,
                resolvedMotions: payload.resolvedMotions,
                domSurfaces,
                domMotions,
                diffs,
                missingGovernance: payload.missingGovernance,
              };

              window.__CHAMPAGNE_HERO_DEBUG__ = receipts;

              console.log('CHAMPAGNE_HERO_RECEIPTS_JSON=' + JSON.stringify(receipts));
              console.table(
                assertions.map((a) => ({
                  id: a.id,
                  field: a.field,
                  source: a.source,
                  structural: a.structural,
                  disabled: a.disabled,
                  manifest: a.manifest,
                  computed: a.computed,
                  match: a.match,
                })),
              );
            } catch (error) {
              window.__CHAMPAGNE_HERO_DEBUG__ = { heroId: payload.heroId, error: String(error) };
              console.error('CHAMPAGNE_HERO_RECEIPTS_ERROR', error);
            }
          })();`,
        }}
      />
    ) : null;

  return (
    <BaseChampagneSurface
      variant="plain"
      style={{
        minHeight: "72vh",
        display: "grid",
        alignItems: layout.contentAlign === "center" ? "center" : "stretch",
        overflow: "hidden",
        backgroundImage: "none",
        backgroundColor: "transparent",
        boxShadow: "none",
        borderRadius: 0,
        ["--hero-gradient" as string]: gradient,
        ["--glass-opacity" as string]: 0,
        ["--champagne-sheen-alpha" as string]: 0,
        ["--champagne-glass-bg" as string]: "",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }}
      className="hero-renderer hero-optical-isolation"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-renderer {
              position: relative;
              color: var(--text-high);
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }
            .hero-renderer.hero-optical-isolation > div[aria-hidden]:nth-of-type(1),
            .hero-renderer.hero-optical-isolation > div[aria-hidden]:nth-of-type(2) {
              background: none !important;
              opacity: 0 !important;
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }
            .hero-renderer .hero-surface-stack {
              position: absolute;
              inset: 0;
            }
            .hero-renderer .hero-layer,
            .hero-renderer .hero-surface-layer {
              position: absolute;
              inset: 0;
            }
            .hero-renderer .hero-surface-layer.hero-surface--wave-backdrop {
              background-image: var(--hero-wave-background-desktop);
              background-size: cover;
              background-position: center;
              mask-image: var(--hero-wave-mask-desktop);
              -webkit-mask-image: var(--hero-wave-mask-desktop);
              mask-repeat: no-repeat;
              -webkit-mask-repeat: no-repeat;
              mask-size: cover;
              -webkit-mask-size: cover;
              mask-position: center;
              -webkit-mask-position: center;
            }
            .hero-renderer [data-surface-id="field.waveBackdrop"],
            .hero-renderer [data-surface-id="field.waveRings"],
            .hero-renderer [data-surface-id="field.dotGrid"] {
              mask-image: var(--hero-wave-mask-desktop);
              -webkit-mask-image: var(--hero-wave-mask-desktop);
              mask-repeat: no-repeat;
              -webkit-mask-repeat: no-repeat;
              mask-size: cover;
              -webkit-mask-size: cover;
              mask-position: center;
              -webkit-mask-position: center;
            }
            .hero-renderer .hero-layer.motion,
            .hero-renderer .hero-surface-layer.hero-surface--motion {
              object-fit: cover;
              width: 100%;
              height: 100%;
              pointer-events: none;
            }
            .hero-surface-layer {
              pointer-events: none;
            }
            .hero-renderer .hero-content {
              position: relative;
              z-index: 10;
              display: grid;
              gap: 1rem;
              max-width: ${layout.maxWidth ? `${layout.maxWidth}px` : "960px"};
              padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              transform: translateY(${layout.verticalOffset ?? "0px"});
            }
            @media (max-width: 640px) {
              .hero-renderer .hero-surface-layer.hero-surface--wave-backdrop {
                background-image: var(--hero-wave-background-mobile);
                mask-image: var(--hero-wave-mask-mobile);
                -webkit-mask-image: var(--hero-wave-mask-mobile);
              }
              .hero-renderer [data-surface-id="field.waveBackdrop"],
              .hero-renderer [data-surface-id="field.waveRings"],
              .hero-renderer [data-surface-id="field.dotGrid"] {
                mask-image: var(--hero-wave-mask-mobile);
                -webkit-mask-image: var(--hero-wave-mask-mobile);
              }
              .hero-renderer [data-surface-id="overlay.filmGrain"] {
                background-image: var(--hero-grain-mobile);
              }
              .hero-renderer .hero-content {
                padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              }
              .hero-renderer {
                min-height: 68vh;
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-renderer .hero-layer.motion,
              .hero-renderer .hero-surface--motion { display: none; }
            }
          `,
        }}
      />

      <div
        aria-hidden
        className="hero-surface-stack"
        ref={surfaceRef}
        data-prm={prmEnabled ? "true" : "false"}
        style={surfaceVars}
      >
        {surfaceStack.map((layer) => {
          const inlineStyle = surfaceInlineStyles.get(layer.id);

          return (
            <div
              key={layer.id}
              data-surface-id={layer.id}
              data-surface-role={layer.role}
              data-prm-safe={layer.prmSafe ? "true" : undefined}
              className={layer.className ?? "hero-surface-layer"}
              style={inlineStyle}
            />
          );
        })}

        {!prmEnabled && videoEntry?.path && !isDeniedVideo(videoEntry.path) && (
          <video
            className="hero-surface-layer hero-surface--motion"
            autoPlay
            playsInline
            loop
            muted
            preload="metadata"
            poster={surfaces.background?.desktop?.path}
            data-surface-id="motion.heroVideo"
            style={heroVideoStyle}
          >
            <source src={videoEntry.path} />
          </video>
        )}

        {!prmEnabled &&
          motionEntriesWithStyles.map(({ entry, style }) => (
            <video
              key={entry.id}
              className={`hero-surface-layer hero-surface--motion${entry.className ? ` ${entry.className}` : ""}`}
              autoPlay
              playsInline
              loop
              muted
              preload="metadata"
              data-surface-id={entry.id}
              style={style}
            >
              <source src={entry.path} />
            </video>
          ))}

      </div>

      <div
        className="hero-content"
        style={{
          justifyItems: layout.contentAlign === "center" ? "center" : "start",
          textAlign: layout.contentAlign === "center" ? "center" : "start",
        }}
      >
        {content.eyebrow && (
          <span style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            {content.eyebrow}
          </span>
        )}
        {content.headline && (
          <h1 style={{ fontSize: "clamp(2.2rem, 3.2vw, 3rem)", lineHeight: 1.05 }}>
            {content.headline}
          </h1>
        )}
        {content.subheadline && (
          <p style={{ color: "var(--text-medium)", fontSize: "1.08rem", lineHeight: 1.6, maxWidth: "820px" }}>
            {content.subheadline}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {content.cta && (
            <a
              href={content.cta.href}
              style={{
                padding: "0.9rem 1.6rem",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-gold-soft, rgba(255, 215, 137, 0.16))",
                color: "var(--text-high)",
                border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.45))",
                textDecoration: "none",
                boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
              }}
            >
              {content.cta.label}
            </a>
          )}
          {content.secondaryCta && (
            <a
              href={content.secondaryCta.href}
              style={{
                padding: "0.9rem 1.2rem",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-ink-soft, rgba(6,7,12,0.35))",
                color: "var(--text-high)",
                border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.3))",
                textDecoration: "none",
              }}
            >
              {content.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
      {resolveVsInlineScript}
    </BaseChampagneSurface>
  );
}
