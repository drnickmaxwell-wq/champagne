import { BaseChampagneSurface } from "@champagne/hero";
import type { CSSProperties, ReactNode } from "react";
import type { getHeroRuntime } from "@champagne/hero";

const HERO_V2_DEBUG = process.env.NEXT_PUBLIC_HERO_DEBUG === "1";

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
                  transform: translate3d(calc(var(--hero-motion-x, 0) * -1), calc(var(--hero-motion-y, 0) * -1), 0)
                    scale(var(--hero-motion-scale, 1));
                }
                50% {
                  transform: translate3d(var(--hero-motion-x, 0), var(--hero-motion-y, 0), 0)
                    scale(var(--hero-motion-scale, 1));
                }
                100% {
                  transform: translate3d(calc(var(--hero-motion-x, 0) * -1), calc(var(--hero-motion-y, 0) * -1), 0)
                    scale(var(--hero-motion-scale, 1));
                }
              }
              @keyframes heroGoldDustPulse {
                0% {
                  filter: brightness(1) contrast(1);
                }
                50% {
                  filter: brightness(1.2) contrast(1.05);
                }
                100% {
                  filter: brightness(1) contrast(1);
                }
              }
            `,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            if (typeof window === 'undefined') return;
            if (!window.matchMedia || !window.requestAnimationFrame) return;
            const HERO_V2_DEBUG = ${HERO_V2_DEBUG ? "true" : "false"};
            const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
            const handleMotionChange = () => {
              document.documentElement.dataset.heroMotionReduce = motionMedia.matches ? 'true' : 'false';
            };
            handleMotionChange();
            motionMedia.addEventListener?.('change', handleMotionChange);
            if (!HERO_V2_DEBUG) return;
            const logCompositing = (phase) => {
              const textTarget = document.querySelector('[data-hero-root="true"] .hero-content h1, [data-hero-root="true"] .hero-content h2');
              const textRect = textTarget?.getBoundingClientRect();
              console.groupCollapsed('HERO_V2_COMPOSITING');
              console.log(
                'HERO_V2_COMPOSITING_STATE',
                JSON.stringify({
                  phase,
                  hasTextTarget: Boolean(textTarget),
                  textBounds: textRect
                    ? {
                        width: Math.round(textRect.width),
                        height: Math.round(textRect.height),
                      }
                    : null,
                }),
              );
              if (textTarget) {
                console.log(
                  'HERO_V2_TEXT_BOUNDS',
                  JSON.stringify({
                    tagName: textTarget.tagName.toLowerCase(),
                    className: textTarget.getAttribute('class'),
                    width: textRect?.width,
                    height: textRect?.height,
                  }),
                );
              } else {
                console.log('HERO_V2_TEXT_BOUNDS', JSON.stringify({ missing: true }));
              }
              console.groupEnd();
            };
            const scheduleLog = (phase) => {
              requestAnimationFrame(() => logCompositing(phase));
            };
            const logNavigation = (phase) => {
              logCompositing(phase);
              scheduleLog(\`\${phase}-frame\`);
              window.setTimeout(() => logCompositing(\`\${phase}-settled\`), 1400);
            };
            const wrapHistory = (method) => {
              const original = history[method];
              if (typeof original !== 'function') return;
              history[method] = function (...args) {
                const result = original.apply(this, args);
                logNavigation(\`nav-\${method}\`);
                return result;
              };
            };
            wrapHistory('pushState');
            wrapHistory('replaceState');
            window.addEventListener('popstate', () => logNavigation('nav-popstate'));
            if (document.readyState === 'loading') {
              window.addEventListener('load', () => logCompositing('initial'), { once: true });
            } else {
              logCompositing('initial');
            }
          })();`,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              if (typeof window === 'undefined') return;
              const HERO_V2_DEBUG = ${HERO_V2_DEBUG ? "true" : "false"};
              const selector = '.hero-renderer-v2 .hero-surface--motion';
              const getEverRevealed = () => window.__heroMotionEverRevealed === true;
              const setEverRevealed = () => {
                window.__heroMotionEverRevealed = true;
              };
              const resolveTargetOpacity = (video) => {
                if (!(video instanceof HTMLVideoElement)) return null;
                const dataValue = video.dataset.motionTargetOpacity;
                if (dataValue) {
                  const parsed = Number.parseFloat(dataValue);
                  if (!Number.isNaN(parsed)) return parsed;
                }
                const inlineValue = video.style.getPropertyValue('--hero-motion-target-opacity');
                const computedValue = window.getComputedStyle(video).getPropertyValue('--hero-motion-target-opacity');
                const source = inlineValue || computedValue;
                if (source) {
                  const parsed = Number.parseFloat(source);
                  if (!Number.isNaN(parsed)) {
                    video.dataset.motionTargetOpacity = String(parsed);
                    return parsed;
                  }
                }
                return null;
              };
              const applyTargetOpacity = (video) => {
                const target = resolveTargetOpacity(video);
                if (target === null || Number.isNaN(target)) return;
                video.style.opacity = String(target);
                if (HERO_V2_DEBUG) {
                  console.groupCollapsed("HERO_V2_MOTION_REVEAL", {
                    id: video.dataset.surfaceId || "unknown",
                    target,
                    time: performance.now(),
                  });
                  console.groupEnd();
                }
              };
              const reveal = (video) => {
                if (!(video instanceof HTMLVideoElement)) return;
                if (video.dataset.motionReady === 'true') return;
                video.dataset.motionReady = 'true';
                applyTargetOpacity(video);
                setEverRevealed();
              };
              const initVideo = (video) => {
                if (!(video instanceof HTMLVideoElement)) return;
                if (video.dataset.motionInit === 'true') return;
                video.dataset.motionInit = 'true';
                if (getEverRevealed()) {
                  applyTargetOpacity(video);
                  video.dataset.motionReady = 'true';
                  return;
                }
                video.preload = 'auto';
                if (video.readyState >= 2) reveal(video);
                video.addEventListener('loadeddata', () => reveal(video), { once: true });
                video.addEventListener('canplay', () => reveal(video), { once: true });
                video.addEventListener('playing', () => reveal(video), { once: true });
              };
              const init = () => {
                Array.from(document.querySelectorAll(selector)).forEach(initVideo);
              };
              init();
              const start = Date.now();
              const intervalId = window.setInterval(() => {
                init();
                if (Date.now() - start > 2000) window.clearInterval(intervalId);
              }, 250);
            })();`,
          }}
        />
        {children}
      </BaseChampagneSurface>
    </div>
  );
}
