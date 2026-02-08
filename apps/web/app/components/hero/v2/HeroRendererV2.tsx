"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BaseChampagneSurface } from "@champagne/hero";
import type { getHeroRuntime } from "@champagne/hero";
import { HeroContentFade, HeroSurfaceStackV2 } from "./HeroV2Client";
import { buildHeroV2Model } from "./buildHeroV2Model";
import type { HeroRendererV2Props, HeroV2Model } from "./HeroRendererV2.types";

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

type HeroV2FrameProps = {
  layout: Awaited<ReturnType<typeof getHeroRuntime>>["layout"];
  gradient: string;
  rootStyle?: CSSProperties;
  heroId?: string;
  variantId?: string;
  particlesPath?: string;
  particlesOpacity?: number;
  motionCount?: number;
  prm?: boolean;
  debug?: boolean;
  children: ReactNode;
};

function HeroV2StyleBlock({ layout }: { layout: Awaited<ReturnType<typeof getHeroRuntime>>["layout"] }) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
              .hero-renderer-v2 {
                position: relative;
                min-height: 72vh;
                color: var(--text-high);
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                --hero-motion-duration: 42s;
                contain: layout paint;
                overflow: hidden;
                font-size: 1rem;
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
                z-index: 0;
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
                animation-name: heroMotionTide;
                animation-duration: var(--hero-motion-duration, 42s);
                animation-timing-function: ease-in-out;
                animation-iteration-count: infinite;
                transform-origin: center;
                will-change: transform;
                opacity: var(--hero-motion-opacity, var(--hero-motion-default-opacity, 0.2));
                transition: opacity 220ms ease;
              }
              .hero-renderer-v2 .hero-surface--motion[data-ready!="true"] {
                opacity: var(--hero-motion-opacity, var(--hero-motion-default-opacity, 0.2));
              }
              .hero-renderer-v2 .hero-surface--motion.hero-surface--caustics {
                --hero-motion-x: -1.1%;
                --hero-motion-y: 0.8%;
                --hero-motion-scale: 1.02;
              }
              .hero-renderer-v2 .hero-surface--motion.hero-surface--glass-shimmer {
                --hero-motion-x: 0.9%;
                --hero-motion-y: -0.7%;
                --hero-motion-scale: 1.015;
              }
              .hero-renderer-v2 .hero-surface--motion.hero-surface--gold-dust {
                --hero-motion-x: 0.6%;
                --hero-motion-y: 1%;
                --hero-motion-scale: 1.01;
                filter: brightness(1) contrast(1);
                animation-name: heroMotionTide, heroGoldDustPulse;
                animation-duration: var(--hero-motion-duration, 42s), 24s;
                animation-timing-function: ease-in-out, ease-in-out;
                animation-iteration-count: infinite, infinite;
                animation-delay: 0s, 6s;
              }
              .hero-renderer-v2 .hero-surface--motion.hero-surface--particles-drift {
                --hero-motion-x: -0.7%;
                --hero-motion-y: -0.9%;
                --hero-motion-scale: 1.008;
              }
              .hero-renderer-v2 .hero-surface-layer {
                pointer-events: none;
              }
              .hero-renderer-v2 .hero-content {
                position: relative;
                z-index: 50;
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
              @keyframes heroMotionTide {
                0% {
                  transform: translate3d(0, 0, 0) scale(1);
                }
                50% {
                  transform: translate3d(var(--hero-motion-x, 0), var(--hero-motion-y, 0), 0)
                    scale(var(--hero-motion-scale, 1));
                }
                100% {
                  transform: translate3d(0, 0, 0) scale(1);
                }
              }
              @keyframes heroGoldDustPulse {
                0%,
                70%,
                100% {
                  filter: brightness(1) contrast(1);
                }
                78% {
                  filter: brightness(1.2) contrast(1.26);
                }
                84% {
                  filter: brightness(1.08) contrast(1.12);
                }
              }
            `,
      }}
    />
  );
}

function HeroV2Frame({
  layout,
  gradient,
  rootStyle,
  heroId,
  variantId,
  particlesPath,
  particlesOpacity,
  motionCount,
  prm,
  debug,
  children,
}: HeroV2FrameProps) {
  const dataAttributes = debug
    ? {
        "data-hero-id": heroId || undefined,
        "data-variant-id": variantId || undefined,
        "data-particles-path": particlesPath || undefined,
        "data-particles-opacity": particlesOpacity !== undefined ? `${particlesOpacity}` : undefined,
        "data-motion-count": motionCount !== undefined ? `${motionCount}` : undefined,
        "data-prm": prm !== undefined ? `${prm}` : undefined,
      }
    : {};

  return (
    <div
      className="hero-renderer hero-renderer-v2 hero-optical-isolation"
      data-hero-renderer="v2"
      data-hero-root="true"
      style={rootStyle}
      {...dataAttributes}
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
          ["--hero-motion-default-opacity" as string]: prm ? "0" : "0.2",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
        }}
      >
        <HeroV2StyleBlock layout={layout} />
        {children}
      </BaseChampagneSurface>
    </div>
  );
}

function HeroContentV2({
  content,
  layout,
}: {
  content: Awaited<ReturnType<typeof getHeroRuntime>>["content"];
  layout: Awaited<ReturnType<typeof getHeroRuntime>>["layout"];
}) {
  return (
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
  );
}


export function HeroRendererV2(props: HeroRendererV2Props) {
  const rawPathname = usePathname();
  const pathnameKey = normalizeHeroPathname(rawPathname);
  const {
    mode,
    treatmentSlug,
    prm,
    timeOfDay,
    particles,
    filmGrain,
    diagnosticBoost,
    pageCategory,
    glueVars,
    rootStyle,
    surfaceRef,
  } = props;
  const [renderModel, setRenderModel] = useState<HeroV2Model | null>(null);

  useEffect(() => {
    let isActive = true;
    void buildHeroV2Model({
      mode,
      treatmentSlug,
      pageSlugOrPath: pathnameKey,
      debug: props.debug,
      prm,
      timeOfDay,
      particles,
      filmGrain,
      diagnosticBoost,
      pageCategory,
      glueVars,
    }).then((nextModel) => {
      if (!isActive) return;
      setRenderModel(nextModel);
    });

    return () => {
      isActive = false;
    };
  }, [diagnosticBoost, filmGrain, glueVars, mode, pageCategory, particles, pathnameKey, prm, timeOfDay, treatmentSlug, props.debug]);

  if (!renderModel) return null;

  const resolvedRootStyle = { ...rootStyle, ...renderModel.surfaceStack.surfaceVars };
  const motionCount = renderModel.surfaceStack.motionLayers.length;

  return (
    <HeroV2Frame
      layout={renderModel.layout}
      gradient={renderModel.gradient}
      rootStyle={resolvedRootStyle}
      heroId={renderModel.surfaceStack.heroId}
      variantId={renderModel.surfaceStack.variantId}
      particlesPath={renderModel.surfaceStack.particlesPath}
      particlesOpacity={renderModel.surfaceStack.particlesOpacity}
      motionCount={motionCount}
      prm={renderModel.surfaceStack.prmEnabled}
      debug={props.debug}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        <HeroSurfaceStackV2 surfaceRef={surfaceRef} {...renderModel.surfaceStack} />
      </div>
      <HeroContentFade>
        <HeroContentV2 content={renderModel.content} layout={renderModel.layout} />
      </HeroContentFade>
    </HeroV2Frame>
  );
}

export { buildHeroV2Model } from "./buildHeroV2Model";
