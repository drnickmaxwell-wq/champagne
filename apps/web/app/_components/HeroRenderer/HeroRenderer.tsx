"use client";

import React, { type CSSProperties, useEffect, useMemo, useState } from "react";
import { BaseChampagneSurface, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";
import { buildLayerStack } from "./layerUtils";

export interface HeroRendererProps {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  debugOpacityBoost?: number;
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

export function HeroRenderer({
  mode = "home",
  treatmentSlug,
  prm,
  timeOfDay,
  particles,
  filmGrain,
  debugOpacityBoost = 1,
}: HeroRendererProps) {
  const runtimeParams = useMemo(
    () => ({ mode, treatmentSlug, prm, timeOfDay, particles, filmGrain }),
    [mode, treatmentSlug, prm, timeOfDay, particles, filmGrain],
  );
  const [runtime, setRuntime] = useState<any>(() => {
    try {
      const result = getHeroRuntime({ ...runtimeParams, variantId: mode === "home" ? "default" : undefined });
      if (result && typeof (result as any).then === "function") return null;
      return result;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Hero runtime failed", error);
      }
      return null;
    }
  });

  useEffect(() => {
    let cancelled = false;
    const result = getHeroRuntime({ ...runtimeParams, variantId: mode === "home" ? "default" : undefined });

    if (result && typeof (result as any).then === "function") {
      (result as Promise<any>)
        .then((value) => {
          if (!cancelled) setRuntime(value);
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production") {
            console.error("Hero runtime failed", error);
          }
          if (!cancelled) setRuntime(null);
        });
    } else {
      setRuntime(result);
    }

    return () => {
      cancelled = true;
    };
  }, [runtimeParams, mode]);

  if (!runtime) return <HeroFallback />;

  const { content, layout } = runtime;
  const { resolvedLayers, gradient } = buildLayerStack({
    runtime,
    mode,
    particles,
    filmGrain,
    opacityBoost: debugOpacityBoost,
    includeFallback: mode === "home",
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
            .hero-renderer .hero-layer--gradient {
              background-repeat: no-repeat;
            }
            .hero-renderer .hero-layer--wave-backdrop,
            .hero-renderer .hero-layer--wave-mask,
            .hero-renderer .hero-layer--wave-rings,
            .hero-renderer .hero-layer--dot-grid,
            .hero-renderer .hero-layer--particles,
            .hero-renderer .hero-layer--grain,
            .hero-renderer .hero-layer--caustics {
              background-repeat: no-repeat;
            }
            .hero-renderer .hero-layer--wave-mask {
              background-size: contain;
              background-position: top center;
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
                padding: clamp(1.5rem, 6vw, 2.5rem);
              }
            }
          `,
        }}
      />

      <div className="hero-layer-stack">
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
