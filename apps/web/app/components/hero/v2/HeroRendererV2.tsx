"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BaseChampagneSurface } from "@champagne/hero";
import type { HeroMode, HeroTimeOfDay, getHeroRuntime } from "@champagne/hero";
import { HeroContentFade, HeroSurfaceStackV2 } from "./HeroV2Client";
import { buildHeroV2Model } from "./buildHeroV2Model";

const HERO_V2_DEBUG = process.env.NEXT_PUBLIC_HERO_DEBUG === "1";
const heroV2ModelCache = new Map<string, HeroV2Model>();
let lastResolvedHeroV2Model: HeroV2Model | null = null;

export interface HeroRendererV2Props {
  mode?: HeroMode;
  treatmentSlug?: string;
  pageSlugOrPath?: string;
  debug?: boolean;
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

export type HeroV2SurfaceLayerModel = {
  id: string;
  role?: string;
  prmSafe?: boolean;
  className: string;
  style: CSSProperties;
  glueMeta?: {
    source: GlueSource;
    backgroundSize?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    imageRendering?: string;
  };
  contrastFilter?: string;
};

export type HeroV2MotionLayerModel = {
  id: string;
  className?: string;
  path: string;
  style: CSSProperties;
  targetOpacity?: number | null;
};

export type HeroV2SacredBloomModel = {
  style: CSSProperties;
  bloomDebug: boolean;
  baseOpacity: string;
  shape?: string;
  mask?: string;
  contrastFilter?: string;
  glueMeta?: {
    source: GlueSource;
    backgroundSize?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    imageRendering?: string;
  };
};

export type HeroSurfaceStackModel = {
  surfaceVars: CSSProperties;
  prmEnabled: boolean;
  layers: HeroV2SurfaceLayerModel[];
  motionLayers: HeroV2MotionLayerModel[];
  bloomEnabled: boolean;
  heroId?: string;
  variantId?: string;
  boundHeroId?: string;
  boundVariantId?: string;
  effectiveHeroId?: string;
  effectiveVariantId?: string;
  particlesPath?: string;
  particlesOpacity?: number;
  heroVideo?: {
    path: string;
    poster?: string;
    style: CSSProperties;
    targetOpacity?: number | null;
  };
  sacredBloom?: HeroV2SacredBloomModel;
};

export type HeroV2Model = {
  gradient: string;
  layout: Awaited<ReturnType<typeof getHeroRuntime>>["layout"];
  content: Awaited<ReturnType<typeof getHeroRuntime>>["content"];
  surfaceStack: HeroSurfaceStackModel;
};

type GlueSource = "manifest" | "override" | "none";

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};


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
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            if (typeof window === 'undefined') return;
            const HERO_V2_DEBUG = ${HERO_V2_DEBUG ? "true" : "false"};
            if (!HERO_V2_DEBUG) return;
            const logStacking = () => {
              const content = document.querySelector('.hero-renderer-v2 .hero-content');
              const surface = document.querySelector('.hero-renderer-v2 [data-surface-id="hero.contentFrame"]');
              const contentZ = content ? window.getComputedStyle(content).zIndex : 'missing';
              const surfaceZ = surface ? window.getComputedStyle(surface).zIndex : 'missing';
              let hit = { tag: 'missing', surfaceId: null, className: null };
              if (content instanceof HTMLElement) {
                const rect = content.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const topEl = document.elementFromPoint(centerX, centerY);
                if (topEl) {
                  hit = {
                    tag: topEl.tagName.toLowerCase(),
                    surfaceId: topEl.getAttribute('data-surface-id'),
                    className: topEl.getAttribute('class'),
                  };
                }
              }
              console.groupCollapsed('HERO_V2_STACK_DIAGNOSTIC');
              console.log('HERO_V2_STACK_DATA', {
                contentZIndex: contentZ,
                surfaceZIndex: surfaceZ,
                elementFromPoint: hit,
              });
              console.groupEnd();
            };
            if (document.readyState === 'loading') {
              window.addEventListener('load', () => requestAnimationFrame(logStacking), { once: true });
            } else {
              requestAnimationFrame(logStacking);
            }
          })();`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            if (typeof window === 'undefined') return;
            const HERO_V2_DEBUG = ${HERO_V2_DEBUG ? "true" : "false"};
            const params = new URLSearchParams(window.location.search);
            const heroTruthEnabled = params.get('heroTruth') === '1';
            if (!HERO_V2_DEBUG && !heroTruthEnabled) return;
            const logTruthTable = () => {
              const heroRoot = document.querySelector('.hero-renderer-v2[data-hero-root="true"]');
              if (!heroRoot) {
                console.groupCollapsed('HERO_V2_TRUTH_TABLE');
                console.log('HERO_V2_TRUTH_TABLE_DATA', { found: false });
                console.groupEnd();
                return;
              }
              const surfaceElements = Array.from(heroRoot.querySelectorAll('[data-surface-id]'));
              const rows = surfaceElements.map((element) => {
                const styles = window.getComputedStyle(element);
                const isVideo = element instanceof HTMLVideoElement;
                const currentSrc = isVideo ? element.currentSrc : null;
                return {
                  id: element.getAttribute('data-surface-id') ?? 'unknown',
                  opacity: styles.opacity,
                  mixBlendMode: styles.mixBlendMode,
                  zIndex: styles.zIndex,
                  backgroundImage: currentSrc || styles.backgroundImage,
                  filter: styles.filter,
                  visibility: styles.visibility,
                  display: styles.display,
                };
              });
              console.groupCollapsed('HERO_V2_TRUTH_TABLE');
              console.table(rows);
              const content = heroRoot.querySelector('.hero-content');
              const contentZIndex = content ? window.getComputedStyle(content).zIndex : 'missing';
              console.log('HERO_V2_TRUTH_CONTENT_ZINDEX', contentZIndex);
              console.groupEnd();
            };
            const schedule = () => window.setTimeout(logTruthTable, 1500);
            if (document.readyState === 'loading') {
              window.addEventListener('load', schedule, { once: true });
            } else {
              schedule();
            }
          })();`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            if (typeof window === 'undefined') return;
            const HERO_V2_DEBUG = ${HERO_V2_DEBUG ? "true" : "false"};
            if (!HERO_V2_DEBUG) return;
            if (window.__heroV2CompositingLogInstalled) return;
            window.__heroV2CompositingLogInstalled = true;
            const getCompositingData = (label, element) => {
              if (!(element instanceof Element)) {
                return { label, found: false };
              }
              const style = window.getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              const backdropFilter = style.backdropFilter || style.getPropertyValue('backdrop-filter');
              const webkitBackdropFilter = style.getPropertyValue('-webkit-backdrop-filter');
              return {
                label,
                found: true,
                tagName: element.tagName.toLowerCase(),
                className: element.getAttribute('class'),
                transform: style.transform,
                filter: style.filter,
                backdropFilter,
                webkitBackdropFilter,
                willChange: style.willChange,
                contain: style.contain,
                isolation: style.isolation,
                rect: {
                  width: rect.width,
                  height: rect.height,
                },
              };
            };
            const resolveHeader = () =>
              document.querySelector('header') ||
              document.querySelector('[data-header]') ||
              document.querySelector('[data-nav]') ||
              document.querySelector('nav');
            const resolveBelowHero = (heroRoot) => {
              if (!(heroRoot instanceof Element)) return null;
              const sibling = heroRoot.nextElementSibling;
              if (sibling) return sibling;
              const parent = heroRoot.parentElement;
              if (!parent) return null;
              const children = Array.from(parent.children);
              const heroIndex = children.indexOf(heroRoot);
              return heroIndex >= 0 ? children[heroIndex + 1] ?? null : null;
            };
            const resolveTextTarget = (root) => {
              if (!(root instanceof Element)) return null;
              return (
                root.querySelector('.hero-content h1, .hero-content h2, .hero-content p') ||
                root.querySelector('h1, h2, h3, p, span')
              );
            };
            const logCompositing = (phase) => {
              const heroRoot = document.querySelector('.hero-renderer-v2[data-hero-root="true"]');
              const surfaceStack = heroRoot?.querySelector('.hero-surface-stack') ?? null;
              const header = resolveHeader();
              const main = document.querySelector('main');
              const belowHero = resolveBelowHero(heroRoot);
              const content = heroRoot?.querySelector('.hero-content') ?? null;
              const textTarget = resolveTextTarget(belowHero || main || document.body);
              const textRect = textTarget ? textTarget.getBoundingClientRect() : null;
              const resolveZIndexSnapshot = (surfaceId) => {
                if (!(heroRoot instanceof Element)) return 'missing';
                const element = heroRoot.querySelector('[data-surface-id="' + surfaceId + '"]');
                if (!(element instanceof Element)) return 'missing';
                return window.getComputedStyle(element).zIndex;
              };
              console.groupCollapsed('HERO_V2_COMPOSITING_DIAGNOSTIC');
              console.log('HERO_V2_COMPOSITING_PHASE', {
                phase,
                time: performance.now(),
                path: window.location.pathname,
              });
              const compositingData = [
                getCompositingData('hero-root', heroRoot),
                getCompositingData('hero-surface-stack', surfaceStack),
                getCompositingData('header-or-nav', header),
                getCompositingData('main', main),
                getCompositingData('below-hero', belowHero),
              ];
              console.log('HERO_V2_COMPOSITING_DATA', JSON.stringify(compositingData));
              console.log('HERO_V2_ZINDEX_SNAPSHOT', {
                phase,
                content: content instanceof Element ? window.getComputedStyle(content).zIndex : 'missing',
                'sacred.motion.particleDrift': resolveZIndexSnapshot('sacred.motion.particleDrift'),
                'sacred.motion.goldDust': resolveZIndexSnapshot('sacred.motion.goldDust'),
              });
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

export function HeroContentV2({
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
  const searchParams = useSearchParams();
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
  const [renderModel, setRenderModel] = useState<HeroV2Model | null>(() => lastResolvedHeroV2Model);
  const renderModelRef = useRef<HeroV2Model | null>(lastResolvedHeroV2Model);
  const [isHeroVisuallyReady, setIsHeroVisuallyReady] = useState(false);
  const visualReadyRef = useRef(false);
  const debugEnabled = searchParams?.get("heroDebug") === "1";

  useEffect(() => {
    renderModelRef.current = renderModel;
    if (renderModel) {
      lastResolvedHeroV2Model = renderModel;
    }
  }, [renderModel]);

  useEffect(() => {
    visualReadyRef.current = isHeroVisuallyReady;
  }, [isHeroVisuallyReady]);

  useEffect(() => {
    if (!debugEnabled) return;
    const modelSnapshot = renderModelRef.current ?? lastResolvedHeroV2Model;
    const heroIdentityKey =
      modelSnapshot?.surfaceStack.variantId ??
      modelSnapshot?.surfaceStack.heroId ??
      (modelSnapshot?.surfaceStack.boundVariantId
        ? `binding:${modelSnapshot.surfaceStack.boundVariantId}`
        : undefined) ??
      (pageCategory ? `category:${pageCategory}` : undefined);
    const heroId = modelSnapshot?.surfaceStack.heroId ?? "undefined";
    const variantId = modelSnapshot?.surfaceStack.variantId ?? "undefined";
    const hasModel = Boolean(modelSnapshot);
    const renderedMode = hasModel ? "FRAME" : "FALLBACK";
    const cssInjected = document.querySelector(".hero-renderer-v2 style") ? "yes" : "no";
    const timeMs = Math.round(performance.now());
    console.info(
      `[HERO_DIAG] t=${timeMs} path=${pathnameKey} hasModel=${hasModel} identity=${
        heroIdentityKey ?? "undefined"
      } heroId=${heroId} variantId=${variantId} render=${renderedMode} css=${cssInjected}`,
    );
  }, [debugEnabled, pageCategory, pathnameKey]);

  useEffect(() => {
    let isActive = true;
    const cached = heroV2ModelCache.get(pathnameKey);
    if (cached) {
      setRenderModel(cached);
    }
    const buildStart = performance.now();
    void buildHeroV2Model({
      mode,
      treatmentSlug,
      pageSlugOrPath: pathnameKey,
      debug: debugEnabled,
      prm,
      timeOfDay,
      particles,
      filmGrain,
      diagnosticBoost,
      pageCategory,
      glueVars,
    }).then((nextModel) => {
      if (!isActive) return;
      if (!nextModel) return;
      if (debugEnabled) {
        const readyTime = performance.now();
        const startTime = Math.round(buildStart);
        const readyMs = Math.round(readyTime);
        const deltaMs = Math.round(readyTime - buildStart);
        console.info(
          `[HERO_DIAG_MODEL] path=${pathnameKey} start=${startTime} ready=${readyMs} dt=${deltaMs}`,
        );
      }
      heroV2ModelCache.set(pathnameKey, nextModel);
      setRenderModel(nextModel);
    });

    return () => {
      isActive = false;
    };
  }, [debugEnabled, diagnosticBoost, filmGrain, glueVars, mode, pageCategory, particles, pathnameKey, prm, timeOfDay, treatmentSlug]);

  useEffect(() => {
    if (!debugEnabled) return;
    const modelSnapshot = renderModelRef.current ?? lastResolvedHeroV2Model;
    if (!modelSnapshot) return;
    const logOpacity = () => {
      const firstMotion = document.querySelector(".hero-renderer-v2 .hero-surface--motion") as HTMLElement | null;
      const computedOpacity = firstMotion ? getComputedStyle(firstMotion).opacity : null;
      console.info("HERO_V2_MOTION_OPACITY_PROOF", {
        pathname: pathnameKey,
        prm: modelSnapshot.surfaceStack.prmEnabled,
        motionCount: modelSnapshot.surfaceStack.motionLayers.length,
        firstMotionOpacity: computedOpacity,
      });
    };
    const frameId = requestAnimationFrame(logOpacity);
    return () => cancelAnimationFrame(frameId);
  }, [debugEnabled, pathnameKey]);

  useEffect(() => {
    if (!debugEnabled) return;
    const logTransitionOpacity = () => {
      const firstMotion = document.querySelector(".hero-renderer-v2 .hero-surface--motion") as HTMLElement | null;
      const computedStyle = firstMotion ? getComputedStyle(firstMotion) : null;
      console.info("HERO_V2_NAV_MOTION_OPACITY_PROOF", {
        pathname: pathnameKey,
        dataReady: firstMotion?.dataset.ready ?? null,
        motionReady: firstMotion?.dataset.motionReady ?? null,
        firstMotionOpacity: computedStyle?.opacity ?? null,
        firstMotionTransform: computedStyle?.transform ?? null,
        firstMotionAnimationName: computedStyle?.animationName ?? null,
        firstMotionAnimationDuration: computedStyle?.animationDuration ?? null,
        firstMotionAnimationDelay: computedStyle?.animationDelay ?? null,
      });
    };
    const timeoutId = window.setTimeout(() => requestAnimationFrame(logTransitionOpacity), 0);
    return () => window.clearTimeout(timeoutId);
  }, [debugEnabled, pathnameKey]);

  useEffect(() => {
    if (!debugEnabled) return;
    let frameId = 0;
    let hiddenFrames = 0;
    let visibilityFlips = 0;
    let lastVisibility: string | null = null;
    let minOpacity = 1;
    const start = performance.now();
    const sample = () => {
      const root = document.querySelector<HTMLElement>(".hero-renderer-v2[data-hero-root=\"true\"]");
      if (root) {
        const styles = getComputedStyle(root);
        const opacityValue = Number.parseFloat(styles.opacity || "1");
        const visibility = styles.visibility || "visible";
        minOpacity = Math.min(minOpacity, Number.isNaN(opacityValue) ? 1 : opacityValue);
        if (lastVisibility !== null && visibility !== lastVisibility) {
          visibilityFlips += 1;
        }
        lastVisibility = visibility;
        if (opacityValue <= 0 || visibility !== "visible") {
          hiddenFrames += 1;
        }
      }
      if (performance.now() - start < 500) {
        frameId = requestAnimationFrame(sample);
        return;
      }
      console.info(
        `[HERO_NAV_VIS_PROBE] path=${pathnameKey} hiddenFrames=${hiddenFrames} minOpacity=${minOpacity} visibilityFlips=${visibilityFlips}`,
      );
    };
    frameId = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(frameId);
  }, [debugEnabled, pathnameKey]);

  useEffect(() => {
    const modelSnapshot = renderModel ?? lastResolvedHeroV2Model;
    if (!modelSnapshot) {
      setIsHeroVisuallyReady(false);
      return;
    }
    setIsHeroVisuallyReady(false);
    if (modelSnapshot.surfaceStack.prmEnabled) {
      setIsHeroVisuallyReady(true);
      return;
    }
    const root = document.querySelector(".hero-renderer-v2[data-hero-root=\"true\"]");
    if (!(root instanceof HTMLElement)) return;
    const motionVideos = Array.from(root.querySelectorAll<HTMLVideoElement>(".hero-surface--motion"));
    if (motionVideos.length === 0) {
      setIsHeroVisuallyReady(true);
      return;
    }
    let remaining = motionVideos.length;
    let isActive = true;
    const frameCallbacks = new Map<HTMLVideoElement, number>();
    const markReady = () => {
      if (!isActive) return;
      remaining -= 1;
      if (remaining <= 0) {
        setIsHeroVisuallyReady(true);
      }
    };
    const onPlaying = () => markReady();
    const onTimeUpdate = () => markReady();
    motionVideos.forEach((video) => {
      if ("requestVideoFrameCallback" in video && typeof video.requestVideoFrameCallback === "function") {
        const id = video.requestVideoFrameCallback(() => markReady());
        frameCallbacks.set(video, id);
      }
      video.addEventListener("playing", onPlaying, { once: true });
      video.addEventListener("timeupdate", onTimeUpdate, { once: true });
    });
    return () => {
      isActive = false;
      motionVideos.forEach((video) => {
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("timeupdate", onTimeUpdate);
        const callbackId = frameCallbacks.get(video);
        if (callbackId !== undefined && "cancelVideoFrameCallback" in video) {
          video.cancelVideoFrameCallback(callbackId);
        }
      });
    };
  }, [renderModel]);

  const activeModel = renderModel ?? lastResolvedHeroV2Model;
  if (!activeModel) return <HeroFallback />;

  const resolvedRootStyle = { ...rootStyle, ...activeModel.surfaceStack.surfaceVars };
  const gatedRootStyle = isHeroVisuallyReady
    ? resolvedRootStyle
    : { ...resolvedRootStyle, opacity: 0, visibility: "hidden" as const };
  const motionCount = activeModel.surfaceStack.motionLayers.length;
  const heroIdentityKey =
    activeModel.surfaceStack.variantId ??
    activeModel.surfaceStack.heroId ??
    (activeModel.surfaceStack.boundVariantId
      ? `binding:${activeModel.surfaceStack.boundVariantId}`
      : undefined) ??
    (pageCategory ? `category:${pageCategory}` : undefined);
  const overlayData = {
    pathname: pathnameKey,
    heroId: activeModel.surfaceStack.heroId ?? "",
    variantId: activeModel.surfaceStack.variantId ?? "",
    boundHeroId: activeModel.surfaceStack.boundHeroId ?? "",
    boundVariantId: activeModel.surfaceStack.boundVariantId ?? "",
    effectiveHeroId: activeModel.surfaceStack.effectiveHeroId ?? "",
    effectiveVariantId: activeModel.surfaceStack.effectiveVariantId ?? "",
    particlesPath: activeModel.surfaceStack.particlesPath ?? "",
    particlesOpacity: activeModel.surfaceStack.particlesOpacity ?? "",
    motionCount,
    prm: activeModel.surfaceStack.prmEnabled,
  };

  return (
    <HeroV2Frame
      layout={activeModel.layout}
      gradient={activeModel.gradient}
      rootStyle={gatedRootStyle}
      heroId={activeModel.surfaceStack.heroId}
      variantId={activeModel.surfaceStack.variantId}
      particlesPath={activeModel.surfaceStack.particlesPath}
      particlesOpacity={activeModel.surfaceStack.particlesOpacity}
      motionCount={motionCount}
      prm={activeModel.surfaceStack.prmEnabled}
      debug={debugEnabled}
    >
      {debugEnabled ? (
        <div
          style={{
            position: "fixed",
            top: "8px",
            left: "8px",
            zIndex: 9999,
            pointerEvents: "none",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
            fontSize: "10px",
            lineHeight: 1.4,
            padding: "6px 8px",
            borderRadius: "6px",
            background: "var(--surface-ink)",
            color: "var(--text-high)",
            boxShadow: "var(--shadow-soft)",
            opacity: 0.92,
            whiteSpace: "pre",
          }}
        >
          {`pathname: ${overlayData.pathname}\nboundHeroId: ${overlayData.boundHeroId}\nboundVariantId: ${overlayData.boundVariantId}\neffectiveHeroId: ${overlayData.effectiveHeroId}\neffectiveVariantId: ${overlayData.effectiveVariantId}\nheroId: ${overlayData.heroId}\nvariantId: ${overlayData.variantId}\nparticlesPath: ${overlayData.particlesPath}\nparticlesOpacity: ${overlayData.particlesOpacity}\nmotionCount: ${overlayData.motionCount}\nprm: ${overlayData.prm}`}
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0 }}>
        <HeroSurfaceStackV2 surfaceRef={surfaceRef} {...activeModel.surfaceStack} />
      </div>
      <HeroContentFade contentKey={heroIdentityKey ?? null}>
        <HeroContentV2 content={activeModel.content} layout={activeModel.layout} />
      </HeroContentFade>
    </HeroV2Frame>
  );
}

export { buildHeroV2Model } from "./buildHeroV2Model";
