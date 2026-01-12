import type { CSSProperties, Ref } from "react";
import { BaseChampagneSurface, ensureHeroAssetPath, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";
import heroGlueManifest from "./heroGlue.manifest.json";

export interface HeroRendererV2Props {
  mode?: HeroMode;
  treatmentSlug?: string;
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

type GlueRule = {
  backgroundSize?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  imageRendering?: CSSProperties["imageRendering"];
};

type GlueManifest = {
  version: number;
  modes: Record<string, Record<string, GlueRule>>;
};

type GlueSource = "manifest" | "override" | "none";

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

function HeroFallback() {
  return (
    <BaseChampagneSurface
      variant="inkGlass"
      disableInternalOverlays
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

export async function HeroRendererV2({
  mode = "home",
  treatmentSlug,
  prm,
  timeOfDay,
  particles,
  filmGrain,
  diagnosticBoost = false,
  surfaceRef,
  pageCategory,
  rootStyle,
  glueVars,
}: HeroRendererV2Props) {
  let runtime: Awaited<ReturnType<typeof getHeroRuntime>> | null = null;
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
  const gradient = surfaces.gradient?.trim() || "var(--smh-gradient)";
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
    if (token === "overlay.particles" && (!shouldShowParticles || particlesGovernanceMissing)) return false;
    if (token === "overlay.filmGrain" && (!shouldShowGrain || grainGovernanceMissing)) return false;
    return true;
  });
  const resolveMotionStyle = (entry?: { blendMode?: string | null; opacity?: number | null; zIndex?: number }, id?: string) => {
    if (!entry) return {};
    const style: CSSProperties = {};
    const resolvedBlend = entry.blendMode ?? undefined;
    const resolvedOpacity = entry.opacity ?? undefined;

    if (resolvedOpacity !== undefined && resolvedOpacity !== null) {
      style.opacity = resolvedOpacity;
    } else {
      style.opacity = 0;
      if (id) noteMissing(id, "opacity", "motion");
    }

    if (resolvedBlend) {
      style.mixBlendMode = resolvedBlend as CSSProperties["mixBlendMode"];
    } else if (id) {
      noteMissing(id, "blend", "motion");
    }

    if (typeof entry.zIndex === "number") {
      style.zIndex = entry.zIndex;
    } else if (id) {
      noteMissing(id, "zIndex", "motion");
    }

    return style;
  };

  const waveBackdropUrlDesktop = resolveAssetUrl(surfaces.background?.desktop);
  const waveBackdropUrlMobile = resolveAssetUrl(surfaces.background?.mobile);
  const overlayFieldUrl = resolveAssetUrl(surfaces.overlays?.field);
  const overlayDotsUrl = resolveAssetUrl(surfaces.overlays?.dots);
  const particlesUrl = resolveAssetUrl(surfaces.particles);
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
    ["--hero-particles" as string]: shouldShowParticles && particlesUrl ? resolveBackgroundImage(particlesUrl) : undefined,
    ["--hero-grain-desktop" as string]: grainUrlDesktop ? resolveBackgroundImage(grainUrlDesktop) : undefined,
    ["--hero-grain-mobile" as string]: grainUrlMobile ? resolveBackgroundImage(grainUrlMobile) : undefined,
    ["--hero-film-grain-opacity" as string]: shouldShowGrain ? grainOpacity : undefined,
    ["--hero-film-grain-blend" as string]: shouldShowGrain
      ? ((surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? undefined)
      : undefined,
    ["--hero-particles-opacity" as string]: shouldShowParticles ? particleOpacity : undefined,
    ["--hero-caustics-overlay" as string]: "url(/assets/champagne/textures/wave-light-overlay.webp)",
  };

  const diagnosticOutlineStyle: CSSProperties | undefined = diagnosticBoost
    ? { outline: "1px solid var(--champagne-keyline-gold, var(--accentGold_soft))", outlineOffset: "-1px" }
    : undefined;

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
    const modeGlue = resolvedGlueManifest.modes?.[mode];
    return modeGlue?.[surfaceId];
  };
  const normalizeGlue = (glue?: GlueRule | null) => {
    if (!glue) return {};
    return {
      ...(glue.backgroundSize ? { backgroundSize: glue.backgroundSize } : {}),
      ...(glue.backgroundRepeat ? { backgroundRepeat: glue.backgroundRepeat } : {}),
      ...(glue.backgroundPosition ? { backgroundPosition: glue.backgroundPosition } : {}),
      ...(glue.imageRendering ? { imageRendering: glue.imageRendering } : {}),
    } satisfies GlueRule;
  };
  const resolveGlueForSurface = (surfaceId: string, url?: string, overrideGlue?: GlueRule) => {
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
  const sacredBloomMask = "radial-gradient(circle at 20% 18%, var(--text-high) 0%, transparent 65%)";
  const isHomeMode = mode === "home";
  const sacredBloomStyle: CSSProperties = {
    backgroundImage: resolveBackgroundImage(sacredBloomUrl),
    ...(sacredBloomResolvedGlue ?? sacredBloomGlue ?? {}),
    mixBlendMode: "soft-light",
    opacity: 0.22,
    ...(isHomeMode
      ? {
          maskImage: sacredBloomMask,
          WebkitMaskImage: sacredBloomMask,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "cover",
          WebkitMaskSize: "cover",
        }
      : {}),
  };

  const layerStyles: Record<string, CSSProperties> = {
    "gradient.base": {},
    "field.waveBackdrop": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-wave-background-desktop)",
        ...(waveBackdropResolvedGlue ?? waveBackdropGlue ?? {}),
      };

      if (typeof waveBackdropZIndex === "number") {
        style.zIndex = waveBackdropZIndex;
      } else {
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
      if (typeof waveMaskEntry?.zIndex === "number") {
        style.zIndex = waveMaskEntry.zIndex;
      } else {
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

      if (typeof overlayFieldEntry?.zIndex === "number") {
        style.zIndex = overlayFieldEntry.zIndex;
      } else {
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

      if (typeof overlayDotsEntry?.zIndex === "number") {
        style.zIndex = overlayDotsEntry.zIndex;
      } else {
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

      if (typeof particlesEntry?.zIndex === "number") {
        style.zIndex = particlesEntry.zIndex;
      } else if (shouldShowParticles) {
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

      if (typeof grainEntry?.zIndex === "number") {
        style.zIndex = grainEntry.zIndex;
      } else if (shouldShowGrain) {
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
    },
  };

  const surfaceInlineStyles = new Map<string, CSSProperties>();
  const surfaceGlueMeta = new Map<
    string,
    {
      source: GlueSource;
      backgroundSize?: string;
      backgroundRepeat?: string;
      backgroundPosition?: string;
      imageRendering?: string;
    }
  >();
  surfaceStack.forEach((layer) => {
    const resolvedStyle = layer.token ? layerStyles[layer.token] : undefined;
    const inlineStyle = { ...(resolvedStyle ?? {}), ...diagnosticOutlineStyle };

    surfaceInlineStyles.set(layer.id, inlineStyle);
    surfaceGlueMeta.set(layer.id, glueTelemetry.get(layer.id) ?? { source: "none" });
  });

  const heroVideoStyle = resolveMotionStyle(videoEntry ?? undefined, "motion.heroVideo");

  const motionEntriesWithStyles = filteredMotionEntries.map((entry, index) => {
    const style = resolveMotionStyle(entry, entry.id ?? `motion-${index}`);

    return { entry, style };
  });

  return (
    <div
      className="hero-renderer hero-renderer-v2 hero-optical-isolation"
      data-hero-renderer="v2"
      data-hero-root="true"
      style={rootStyle}
    >
      <BaseChampagneSurface
        variant="plain"
        disableInternalOverlays
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
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .hero-renderer-v2 {
                position: relative;
                color: var(--text-high);
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
              }
              .hero-renderer-v2.hero-optical-isolation > div[aria-hidden]:nth-of-type(1),
              .hero-renderer-v2.hero-optical-isolation > div[aria-hidden]:nth-of-type(2) {
                background: none !important;
                opacity: 0 !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
              }
              .hero-renderer-v2 .hero-surface-stack {
                position: absolute;
                inset: 0;
              }
              .hero-renderer-v2 .hero-layer,
              .hero-renderer-v2 .hero-surface-layer {
                position: absolute;
                inset: 0;
              }
              .hero-renderer-v2 .hero-layer.motion,
              .hero-renderer-v2 .hero-surface-layer.hero-surface--motion {
                object-fit: cover;
                width: 100%;
                height: 100%;
                pointer-events: none;
              }
              .hero-renderer-v2 .hero-surface-layer {
                pointer-events: none;
              }
              .hero-renderer-v2 .hero-content {
                position: relative;
                z-index: 10;
                display: grid;
                gap: 1rem;
                max-width: ${layout.maxWidth ? `${layout.maxWidth}px` : "960px"};
                padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
                transform: translateY(${layout.verticalOffset ?? "0px"});
              }
              @media (max-width: 640px) {
                .hero-renderer-v2 [data-surface-id="field.waveBackdrop"] {
                  background-image: var(--hero-wave-background-mobile);
                }
                .hero-renderer-v2 [data-surface-id="overlay.filmGrain"] {
                  background-image: var(--hero-grain-mobile);
                }
                .hero-renderer-v2 .hero-content {
                  padding: ${layout.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
                }
                .hero-renderer-v2 {
                  min-height: 68vh;
                }
              }
              @media (prefers-reduced-motion: reduce) {
                .hero-renderer-v2 .hero-layer.motion,
                .hero-renderer-v2 .hero-surface--motion { display: none; }
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
          const glueMeta = surfaceGlueMeta.get(layer.id);

          return (
            <div
              key={layer.id}
              data-surface-id={layer.id}
              data-surface-role={layer.role}
              data-prm-safe={layer.prmSafe ? "true" : undefined}
              data-glue-source={glueMeta?.source}
              data-glue-size={glueMeta?.backgroundSize}
              data-glue-repeat={glueMeta?.backgroundRepeat}
              data-glue-position={glueMeta?.backgroundPosition}
              data-glue-image-rendering={glueMeta?.imageRendering}
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
        <div
          data-surface-id="overlay.sacredBloom"
          data-surface-role="fx"
          data-bloom-shape={isHomeMode ? "phase3b" : undefined}
          data-bloom-mask={isHomeMode ? "top-left-falloff" : undefined}
          data-glue-source={sacredBloomGlueMeta?.source}
          data-glue-size={sacredBloomGlueMeta?.backgroundSize}
          data-glue-repeat={sacredBloomGlueMeta?.backgroundRepeat}
          data-glue-position={sacredBloomGlueMeta?.backgroundPosition}
          data-glue-image-rendering={sacredBloomGlueMeta?.imageRendering}
          className="hero-surface-layer"
          aria-hidden="true"
          style={sacredBloomStyle}
        />
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
                background: "var(--surface-gold-soft)",
                color: "var(--text-high)",
                border: "1px solid var(--champagne-keyline-gold)",
                textDecoration: "none",
                boxShadow: "var(--shadow-soft)",
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
                background: "var(--surface-ink-soft)",
                color: "var(--text-high)",
                border: "1px solid var(--champagne-keyline-gold)",
                textDecoration: "none",
              }}
            >
              {content.secondaryCta.label}
            </a>
          )}
        </div>
        </div>
      </BaseChampagneSurface>
    </div>
  );
}
