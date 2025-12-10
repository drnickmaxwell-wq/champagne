"use client";

import React from "react";
import { BaseChampagneSurface, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";

export interface HeroRendererProps {
  mode?: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
}

function HeroFallback() {
  return (
    <BaseChampagneSurface
      variant="inkGlass"
      className="hero-renderer"
      style={{
        minHeight: "72vh",
        display: "grid",
        alignItems: "center",
        padding: "clamp(2rem, 4vw, 3.5rem)",
        background: "var(--hero-gradient, var(--smh-gradient))",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <span
          style={{
            display: "inline-block",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontSize: "0.78rem",
            color: "var(--text-medium)",
          }}
        >
          Champagne Dentistry
        </span>
        <h1 style={{ fontSize: "clamp(2.4rem, 3.3vw, 3.2rem)", lineHeight: 1.05, marginTop: "0.5rem" }}>
          Your Luxury Smile Awaits
        </h1>
        <p style={{ color: "var(--text-medium)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "760px", marginTop: "0.85rem" }}>
          Private dental care with calm precision, comfort-first technology, and a signature Champagne finish.
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
  particles = true,
  filmGrain = true,
}: HeroRendererProps) {
  let runtime;
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
      // eslint-disable-next-line no-console
      console.error("Hero runtime failed", error);
    }
  }

  if (!runtime) return <HeroFallback />;

  const { content, layout, layers, flags } = runtime;

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      className="hero-renderer"
      style={{
        position: "relative",
        minHeight: "72vh",
        display: "grid",
        alignItems: layout?.contentAlign === "center" ? "center" : "stretch",
        overflow: "hidden",
        background: "var(--hero-gradient, var(--smh-gradient))",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .hero-renderer {
            color: var(--text-high);
          }
          .hero-renderer .hero-layer-stack {
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
          }
          .hero-renderer .hero-layer {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
          .hero-renderer .hero-layer--image {
            background-size: cover;
            background-position: center;
          }
          .hero-renderer .hero-layer--video {
            object-fit: cover;
          }
          .hero-renderer .hero-content {
            position: relative;
            z-index: 10;
            display: grid;
            gap: 1rem;
            max-width: ${layout?.maxWidth ? `${layout.maxWidth}px` : "960px"};
            margin: 0 auto;
            padding: ${layout?.padding ?? "clamp(2rem, 4vw, 3.5rem)"};
            text-align: left;
            justify-items: ${layout?.contentAlign === "center" ? "center" : "flex-start"};
          }
          @media (max-width: 768px) {
            .hero-renderer {
              min-height: 68vh;
            }
            .hero-renderer .hero-content {
              padding: ${layout?.padding ?? "clamp(2rem, 5vw, 3rem)"};
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .hero-renderer .hero-layer--video {
              display: none;
            }
          }
        `,
        }}
      />

      <div className="hero-layer-stack" data-prm={flags.prm ? "true" : "false"}>
        {layers.map((layer) => {
          if (layer.type === "gradient") {
            return (
              <div
                key={layer.id}
                className="hero-layer hero-layer--gradient"
                style={{
                  zIndex: layer.zIndex,
                  opacity: layer.opacity,
                  mixBlendMode: layer.blendMode,
                  background: "var(--hero-gradient, var(--smh-gradient))",
                }}
                aria-hidden
              />
            );
          }

          if (layer.type === "image") {
            return (
              <div
                key={layer.id}
                className={`hero-layer hero-layer--image hero-layer--${layer.role ?? "background"}`}
                style={{
                  zIndex: layer.zIndex,
                  opacity: layer.opacity,
                  mixBlendMode: layer.blendMode,
                  backgroundImage: layer.url ? `url(${layer.url})` : undefined,
                }}
                aria-hidden
              />
            );
          }

          if (layer.type === "video" && !flags.prm) {
            return (
              <video
                key={layer.id}
                className={`hero-layer hero-layer--video hero-layer--${layer.role ?? "fx"}`}
                autoPlay
                playsInline
                muted
                loop
                preload="metadata"
                style={{
                  zIndex: layer.zIndex,
                  opacity: layer.opacity,
                  mixBlendMode: layer.blendMode,
                }}
              >
                {layer.url && <source src={layer.url} />}
              </video>
            );
          }

          return null;
        })}
      </div>

      <div className="hero-content">
        {content.eyebrow && (
          <span
            style={{
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontSize: "0.78rem",
              color: "var(--text-medium)",
            }}
          >
            {content.eyebrow}
          </span>
        )}

        {content.headline && (
          <h1 style={{ fontSize: "clamp(2.4rem, 3.3vw, 3.2rem)", lineHeight: 1.05 }}>
            {content.headline}
          </h1>
        )}

        {content.subheadline && (
          <p style={{ color: "var(--text-medium)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: "760px" }}>
            {content.subheadline}
          </p>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          {content.cta && (
            <a
              href={content.cta.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.9rem 1.9rem",
                borderRadius: "999px",
                background: "var(--button-primary-gradient, var(--smh-gradient))",
                color: "var(--text-on-accent, #fff)",
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 18px 38px rgba(0,0,0,0.28)",
                gap: "0.5rem",
              }}
            >
              {content.cta.label}
            </a>
          )}

          {content.secondaryCta && (
            <a
              href={content.secondaryCta.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.9rem 1.9rem",
                borderRadius: "999px",
                background: "color-mix(in srgb, var(--bg-ink) 40%, transparent)",
                color: "var(--text-high)",
                border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.4))",
                textDecoration: "none",
                gap: "0.5rem",
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
