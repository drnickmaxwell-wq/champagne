import type { CSSProperties, ReactNode } from "react";
import { BaseChampagneSurface } from "@champagne/hero";
import type { getHeroRuntime } from "@champagne/hero";

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
    <>
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
                opacity: 0;
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
    </>
  );
}

export function HeroV2Frame({
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

export type { HeroV2FrameProps };
