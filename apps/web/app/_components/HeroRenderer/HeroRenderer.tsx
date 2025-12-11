"use client";

import React, { type CSSProperties } from "react";
import {
  BaseChampagneSurface,
  ensureHeroAssetPath,
  getHeroRuntime,
  type HeroMode,
  type HeroTimeOfDay,
} from "@champagne/hero";

export interface HeroRendererProps {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  debugOpacityBoost?: number;
}

type RuntimeLayer = {
  id?: string;
  role?: string;
  type?: "gradient" | "image" | "video" | "unknown";
  url?: string;
  opacity?: number;
  zIndex?: number;
  blendMode?: CSSProperties["mixBlendMode"];
  prmSafe?: boolean;
  className?: string;
};

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
        <span
          style={{
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-medium)",
          }}
        >
          Champagne Dentistry
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", lineHeight: 1.1 }}>
          A calm, cinematic hero is loading.
        </h1>
        <p
          style={{
            color: "var(--text-medium)",
            maxWidth: "720px",
            lineHeight: 1.6,
          }}
        >
          Sacred hero assets are unavailable. Showing a safe gradient surface
          until the manifest is ready.
        </p>
      </div>
    </BaseChampagneSurface>
  );
}

function resolveUrl(entry: any): string | undefined {
  if (!entry) return undefined;
  if (entry.path) return entry.path;
  if (entry.asset?.id) return ensureHeroAssetPath(entry.asset.id);
  if (entry.id) return ensureHeroAssetPath(entry.id);
  return undefined;
}

function buildLegacyLayers(
  surfaces: any,
  motion: any,
  filmGrainSettings: any,
  opacityBoost: number,
): RuntimeLayer[] {
  const gradient = surfaces?.gradient ?? "var(--smh-gradient)";
  const motionEntries = surfaces?.motion ?? [];
  const videoEntry = surfaces?.video;
  const shouldShowGrain = Boolean(
    filmGrainSettings?.enabled && (surfaces?.grain?.desktop || surfaces?.grain?.mobile),
  );
  const shouldShowParticles = Boolean(
    (motion?.particles?.density ?? 0) > 0 && surfaces?.particles?.path,
  );
  const applyBoost = (value?: number) => Math.min(1, (value ?? 1) * opacityBoost);
  const causticsOpacity = applyBoost(
    motionEntries.find((entry: any) => entry.id === "overlay.caustics")?.opacity ??
      surfaces?.overlays?.field?.opacity ??
      0.35,
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

  const layerStyles: Record<string, Partial<RuntimeLayer>> = {
    "gradient.base": { type: "gradient", url: gradient },
    "field.waveBackdrop": {
      type: "image",
      url: resolveUrl(surfaces?.background?.desktop),
      opacity: waveBackdropOpacity,
      blendMode: waveBackdropBlend ?? "screen",
    },
    "mask.waveHeader": {
      type: "image",
      url: resolveUrl(surfaces?.waveMask?.desktop),
      opacity: applyBoost(surfaces?.waveMask?.desktop?.opacity),
      blendMode: surfaces?.waveMask?.desktop?.blendMode as CSSProperties["mixBlendMode"],
    },
    "field.waveRings": {
      type: "image",
      url: resolveUrl(surfaces?.overlays?.field),
      opacity: applyBoost(surfaces?.overlays?.field?.opacity),
      blendMode: surfaces?.overlays?.field?.blendMode as CSSProperties["mixBlendMode"],
    },
    "field.dotGrid": {
      type: "image",
      url: resolveUrl(surfaces?.overlays?.dots),
      opacity: applyBoost(surfaces?.overlays?.dots?.opacity),
      blendMode: surfaces?.overlays?.dots?.blendMode as CSSProperties["mixBlendMode"],
    },
    "overlay.particles": {
      type: "image",
      url: shouldShowParticles ? resolveUrl(surfaces?.particles) : undefined,
      opacity: particleOpacity,
      blendMode: (surfaces?.particles?.blendMode as CSSProperties["mixBlendMode"]) ?? "screen",
    },
    "overlay.filmGrain": {
      type: "image",
      url: shouldShowGrain ? resolveUrl(surfaces?.grain?.desktop) : undefined,
      opacity: grainOpacity,
      blendMode: (surfaces?.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? "soft-light",
    },
    "overlay.caustics": { type: "video", opacity: causticsOpacity, blendMode: "screen" },
    "hero.contentFrame": { type: "unknown" },
  };

  const layers: RuntimeLayer[] = surfaceStack.map((layer: any) => {
    const token = layer.token ?? layer.id ?? "layer";
    const baseStyle = layerStyles[token] ?? { type: "unknown" };
    const motionEntry = motionEntries.find((entry: any) => entry.id === token);
    const urlFromStyle = baseStyle.url ?? resolveUrl(motionEntry);
    return {
      id: token,
      role: layer.role,
      className: layer.className ?? "hero-layer",
      type: motionEntry ? "video" : baseStyle.type ?? "unknown",
      url: motionEntry?.path ?? urlFromStyle,
      opacity: motionEntry
        ? motionEntry.opacity ?? (motion?.shimmerIntensity ?? 1) * 0.85
        : baseStyle.opacity,
      blendMode: motionEntry
        ? (motionEntry.blendMode as CSSProperties["mixBlendMode"])
        : baseStyle.blendMode,
      zIndex: layer.zIndex,
      prmSafe: layer.prmSafe,
    } satisfies RuntimeLayer;
  });

  if (videoEntry?.path) {
    layers.push({
      id: "motion.heroVideo",
      role: videoEntry.role ?? "motion",
      type: "video",
      url: videoEntry.path,
      opacity: videoEntry.opacity ?? (motion?.shimmerIntensity ?? 1) * 0.85,
      blendMode: videoEntry.blendMode as CSSProperties["mixBlendMode"],
      className: "hero-layer hero-layer--video",
      prmSafe: videoEntry.prmSafe,
    });
  }

  motionEntries.forEach((entry: any) => {
    if (layers.some((layer) => layer.id === entry.id)) return;
    layers.push({
      id: entry.id,
      role: entry.role ?? "motion",
      type: "video",
      url: entry.path,
      opacity: entry.opacity ?? (motion?.shimmerIntensity ?? 1) * 0.85,
      blendMode: entry.blendMode as CSSProperties["mixBlendMode"],
      className: entry.className ?? "hero-layer hero-layer--motion",
      prmSafe: entry.prmSafe,
    });
  });

  return layers;
}

export function HeroRenderer({
  mode = "home",
  treatmentSlug,
  prm,
  timeOfDay,
  particles,
  filmGrain,
  debugOpacityBoost = 1,
}: HeroRendererProps) {
  let runtime: any = null;

  try {
    runtime = getHeroRuntime({
      mode,
      treatmentSlug,
      prm,
      timeOfDay,
      particles,
      filmGrain,
      variantId: mode === "home" ? "default" : undefined,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero runtime failed", error);
    }
  }

  if (!runtime) return <HeroFallback />;

  const { content, layout } = runtime;
  const runtimeAny = runtime as any;
  const opacityBoost = Math.max(debugOpacityBoost, 0.01);
  const surfaces = runtimeAny.surfaces ?? {};
  const motion = runtimeAny.motion ?? {};
  const filmGrainSettings = runtimeAny.filmGrain ?? {};
  const gradient = runtimeAny.gradient ?? surfaces.gradient ?? "var(--smh-gradient)";
  const prmEnabled = Boolean(runtimeAny.flags?.prm);

  const resolvedLayers: RuntimeLayer[] = (
    Array.isArray(runtimeAny.layers) && runtimeAny.layers.length > 0
      ? (runtimeAny.layers as RuntimeLayer[])
      : buildLegacyLayers(surfaces, motion, filmGrainSettings, opacityBoost)
  ).filter((layer) => {
    if (!layer) return false;
    if (prmEnabled && layer.type === "video" && layer.prmSafe === false) return false;
    if (layer.role === "motion" && prmEnabled && layer.prmSafe === false) return false;
    if (layer.type === "video" && !layer.url) return false;
    return true;
  });

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        minHeight: "72vh",
        display: "grid",
        alignItems: layout?.contentAlign === "center" ? "center" : "stretch",
        overflow: "hidden",
        background: "var(--hero-gradient, var(--smh-gradient))",
        ["--hero-gradient" as string]: gradient,
      }}
      className="hero-renderer"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-renderer {
              position: relative;
              color: var(--text-high);
            }
            .hero-renderer .hero-layer-stack {
              position: absolute;
              inset: 0;
              z-index: 0;
            }
            .hero-renderer .hero-layer {
              position: absolute;
              inset: 0;
              z-index: 0;
              background-size: cover;
              background-position: center;
              pointer-events: none;
            }
            .hero-renderer .hero-layer.video,
            .hero-renderer .hero-layer.motion {
              object-fit: cover;
              width: 100%;
              height: 100%;
            }
            .hero-renderer [data-layer-role="fx"] {
              mix-blend-mode: screen;
            }
            .hero-renderer .hero-content {
              position: relative;
              z-index: 2;
              display: grid;
              gap: 1rem;
              max-width: ${layout?.maxWidth ? `${layout.maxWidth}px` : "960px"};
              padding: ${layout?.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              transform: translateY(${layout?.verticalOffset ?? "0px"});
            }
            @media (max-width: 640px) {
              .hero-renderer .hero-content {
                padding: ${layout?.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
              }
              .hero-renderer {
                min-height: 68vh;
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-renderer .hero-layer.video,
              .hero-renderer .hero-layer.motion { display: none; }
            }
          `,
        }}
      />

      <div
        aria-hidden
        className="hero-layer-stack"
        data-prm={prmEnabled ? "true" : "false"}
        style={{ ["--hero-gradient" as string]: gradient }}
      >
        {resolvedLayers.map((layer) => {
          const commonStyle: CSSProperties = {
            mixBlendMode: layer.blendMode,
            opacity: layer.opacity ?? 1,
            zIndex: layer.zIndex,
          };

          if (layer.type === "video") {
            const className = layer.className
              ? `hero-layer video motion ${layer.className}`
              : "hero-layer video motion";
            return (
              <video
                key={layer.id}
                className={className}
                autoPlay
                playsInline
                loop
                muted
                preload="metadata"
                data-layer-id={layer.id}
                data-layer-role={layer.role}
                style={commonStyle}
              >
                <source src={layer.url} />
              </video>
            );
          }

          const backgroundImage = layer.type === "gradient" ? layer.url : layer.url ? `url(${layer.url})` : undefined;
          const className = layer.className ? `hero-layer ${layer.className}` : "hero-layer";

          return (
            <div
              key={layer.id}
              className={className}
              data-layer-id={layer.id}
              data-layer-role={layer.role}
              style={{ ...commonStyle, backgroundImage }}
            />
          );
        })}
      </div>

      <div
        className="hero-content"
        style={{
          justifyItems: layout?.contentAlign === "center" ? "center" : "start",
          textAlign: layout?.contentAlign === "center" ? "center" : "start",
        }}
      >
        {content?.eyebrow && (
          <span
            style={{
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-medium)",
            }}
          >
            {content.eyebrow}
          </span>
        )}
        {content?.headline && (
          <h1
            style={{
              fontSize: "clamp(2.2rem, 3.2vw, 3rem)",
              lineHeight: 1.05,
            }}
          >
            {content.headline}
          </h1>
        )}
        {content?.subheadline && (
          <p
            style={{
              color: "var(--text-medium)",
              fontSize: "1.08rem",
              lineHeight: 1.6,
              maxWidth: "820px",
            }}
          >
            {content.subheadline}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {content?.cta && (
            <a
              href={content.cta.href}
              style={{
                padding: "0.9rem 1.6rem",
                borderRadius: "var(--radius-md)",
                background:
                  "var(--surface-gold-soft, rgba(255, 215, 137, 0.16))",
                color: "var(--text-high)",
                border:
                  "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.45))",
                textDecoration: "none",
                boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
              }}
            >
              {content.cta.label}
            </a>
          )}
          {content?.secondaryCta && (
            <a
              href={content.secondaryCta.href}
              style={{
                padding: "0.9rem 1.2rem",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-ink-soft, rgba(6,7,12,0.35))",
                color: "var(--text-high)",
                border:
                  "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.3))",
                textDecoration: "none",
              }}
            >
              {content.secondaryCta.label}
            </a>
          )}
        </div>
      </div>
    </BaseChampagneSurface>
  );
}
