"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BaseChampagneSurface, ensureHeroAssetPath, getHeroRuntime, type HeroMode, type HeroTimeOfDay } from "@champagne/hero";
import { getHeroBindingForPathnameKey } from "@champagne/manifests/src/helpers";
import heroGlueManifest from "./heroGlue.manifest.json";
import { HeroContentFade, HeroSurfaceStackV2 } from "./HeroV2Client";

const HERO_V2_DEBUG = process.env.NEXT_PUBLIC_HERO_DEBUG === "1";
const heroV2ModelCache = new Map<string, HeroV2Model>();

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

type GlueRule = {
  backgroundSize?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  imageRendering?: CSSProperties["imageRendering"];
  zIndex?: number | string;
  filter?: string;
  willChange?: string;
};

type GlueManifest = {
  version: number;
  modes: Record<string, Record<string, GlueRule>>;
};

type GlueSource = "manifest" | "override" | "none";

const coerceZ = (value?: number | string | null) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") {
    if (value.includes("var(")) return undefined;
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) return undefined;
    return Math.round(parsed);
  }
  if (!Number.isFinite(value)) return undefined;
  return Math.round(value);
};

const defaultZFor = (id: string) => {
  const defaults = new Map<string, number>([
    ["gradient.base", 1],
    ["field.waveBackdrop", 2],
    ["mask.waveHeader", 3],
    ["field.waveRings", 4],
    ["field.dotGrid", 5],
    ["sacred.motion.waveCaustics", 6],
    ["sacred.motion.glassShimmer", 7],
    ["sacred.motion.particleDrift", 8],
    ["sacred.motion.goldDust", 9],
    ["overlay.sacredBloom", 8],
    ["overlay.particles", 9],
    ["overlay.filmGrain", 10],
    ["hero.contentFrame", 9],
  ]);
  return defaults.get(id) ?? 100;
};

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

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const resolveParticlesPath = (entry?: {
  path?: string;
  id?: string;
  asset?: unknown;
}) => {
  if (!entry) return undefined;
  if (entry.path) return entry.path;
  if (entry.asset && typeof entry.asset === "object") {
    const asset = entry.asset as { id?: string; path?: string };
    if (asset.path) return asset.path;
    if (asset.id) return ensureHeroAssetPath(asset.id);
  }
  if (entry.id) return ensureHeroAssetPath(entry.id);
  return undefined;
};

const resolveParticlesOpacity = (entry?: {
  opacity?: number;
  particlesOpacity?: number;
  assetOpacity?: number;
  asset?: unknown;
}) => {
  if (!entry) return undefined;
  if (entry.opacity !== undefined) return entry.opacity;
  if (entry.particlesOpacity !== undefined) return entry.particlesOpacity;
  if (entry.assetOpacity !== undefined) return entry.assetOpacity;
  if (entry.asset && typeof entry.asset === "object" && "opacity" in entry.asset) {
    const assetOpacity = (entry.asset as { opacity?: number }).opacity;
    if (assetOpacity !== undefined) return assetOpacity;
  }
  return undefined;
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
                color: var(--text-high);
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                --hero-motion-duration: 42s;
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
                opacity: 0 !important;
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

export async function buildHeroV2Model(props: HeroRendererV2Props): Promise<HeroV2Model | null> {
  const {
    pageSlugOrPath,
    debug,
    prm,
    timeOfDay,
    particles,
    filmGrain,
    diagnosticBoost = false,
    pageCategory,
    glueVars,
  } = props;
  const bloomDebug = typeof window !== "undefined" && window.location.search.includes("bloomDebug=1");
  let runtime: Awaited<ReturnType<typeof getHeroRuntime>> | null = null;
  const pathnameKey = normalizeHeroPathname(pageSlugOrPath);
  const isTreatmentPath = pathnameKey.startsWith("/treatments/");
  const isHomePath = pathnameKey === "/";
  const runtimeMode: HeroMode = isTreatmentPath ? "treatment" : "home";
  const runtimeTreatmentSlug = isTreatmentPath ? pathnameKey.split("/")[2] || undefined : undefined;
  const resolvedPageCategory =
    pageCategory ?? (runtimeMode === "home" ? "home" : runtimeMode === "treatment" ? "treatment" : undefined);
  const heroBinding = getHeroBindingForPathnameKey(pathnameKey);
  const boundHeroId = heroBinding?.heroId;
  const boundVariantId = heroBinding?.variantId;
  const runtimeVariantOverride = boundVariantId ?? boundHeroId;
  const resolvedTreatmentSlug = runtimeVariantOverride ? undefined : runtimeTreatmentSlug;
  const bindingMatched = Boolean(runtimeVariantOverride);

  try {
    runtime = await getHeroRuntime({
      mode: runtimeMode,
      treatmentSlug: resolvedTreatmentSlug,
      prm,
      timeOfDay,
      particles,
      filmGrain,
      pageCategory: resolvedPageCategory,
      variantId: runtimeVariantOverride ?? (runtimeMode === "home" ? "default" : undefined),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Hero runtime failed", error);
    }
  }

  if (!runtime) return null;

  const effectiveHeroId = boundHeroId ?? runtime.id;
  const effectiveVariantId = boundVariantId ?? runtime.variant?.id;

  if (process.env.NODE_ENV !== "production" && (boundHeroId || boundVariantId)) {
    console.info("HERO_BINDING_PROOF", {
      pathname: pathnameKey,
      boundHeroId: boundHeroId ?? null,
      boundVariantId: boundVariantId ?? null,
      effectiveHeroId: effectiveHeroId ?? null,
      effectiveVariantId: effectiveVariantId ?? null,
      resolvedHeroId: runtime.id ?? null,
      resolvedVariantId: runtime.variant?.id ?? null,
      bindingMatched,
    });
  }

  const { content, surfaces, layout, filmGrain: filmGrainSettings } = runtime;
  const bloomEnabled = Boolean(runtime.variant?.allowedSurfaces?.includes("overlay.sacredBloom"));
  const videoDenylist = ["dental-hero-4k.mp4"];
  const isDeniedVideo = (path?: string) => path && videoDenylist.some((item) => path.includes(item));
  const gradient = surfaces.gradient?.trim() || "var(--smh-gradient)";
  const motionEntries = surfaces.motion ?? [];
  const motionAllowlist = process.env.NEXT_PUBLIC_HERO_MOTION_ALLOWLIST?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const hasMotionAllowlist = Boolean(motionAllowlist?.length);
  const prmEnabled = debug ? false : (prm ?? runtime.flags.prm);
  const videoEntry = surfaces.video;
  const heroVideoActive = Boolean(!prmEnabled && videoEntry?.path && !isDeniedVideo(videoEntry.path));
  const runtimeParticles = (runtime as { particles?: { path?: string; opacity?: number } }).particles;
  const runtimeParticlesPath =
    resolveParticlesPath(runtime.surfaces?.particles) ??
    resolveParticlesPath(runtimeParticles);
  const runtimeParticlesOpacity =
    resolveParticlesOpacity(runtime.surfaces?.particles) ??
    resolveParticlesOpacity(runtimeParticles);
  const fallbackParticlesPath = "/assets/champagne/particles/home-hero-particles.webp";
  const resolvedParticlesPath = runtimeParticlesPath ?? fallbackParticlesPath;
  const resolvedParticlesOpacity = runtimeParticlesOpacity ?? 0.14;
  const particlesAssetAvailable = Boolean(resolvedParticlesPath);
  const shouldShowMotion = !prmEnabled;
  const filteredMotionEntries = shouldShowMotion
    ? motionEntries.filter((entry) => {
        if (isDeniedVideo(entry.path)) return false;
        if (heroVideoActive && entry.id?.toLowerCase().includes("fallback")) return false;
        if (hasMotionAllowlist) {
          if (!entry.id) return false;
          return motionAllowlist?.includes(entry.id) ?? false;
        }
        return true;
      })
    : [];
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
  const particlesGovernanceMissing = particles !== false && particlesAssetAvailable && resolvedParticlesOpacity === undefined;
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
    if (token === "overlay.sacredBloom" && !bloomEnabled) return false;
    if (token === "overlay.particles" && (!shouldShowParticles || particlesGovernanceMissing)) return false;
    if (token === "overlay.filmGrain" && (!shouldShowGrain || grainGovernanceMissing)) return false;
    return true;
  });
  const resolveMotionStyle = (
    entry?: { blendMode?: string | null; opacity?: number | null; zIndex?: number | string | null },
    id?: string,
  ) => {
    if (!entry) return { style: {}, targetOpacity: null };
    const style: CSSProperties = {};
    const resolvedBlend = entry.blendMode ?? undefined;
    const resolvedOpacity = entry.opacity ?? undefined;
    let targetOpacity: number | null = null;

    if (resolvedOpacity !== undefined && resolvedOpacity !== null) {
      targetOpacity = prmEnabled ? 0 : resolvedOpacity;
      (style as CSSProperties & Record<string, string>)["--hero-motion-target-opacity"] = `${targetOpacity}`;
      (style as CSSProperties & Record<string, string>)["--hero-motion-opacity"] = `${targetOpacity}`;
    } else {
      if (prmEnabled) {
        (style as CSSProperties & Record<string, string>)["--hero-motion-target-opacity"] = "0";
        (style as CSSProperties & Record<string, string>)["--hero-motion-opacity"] = "0";
      }
      if (id) noteMissing(id, "opacity", "motion");
    }

    if (resolvedBlend) {
      style.mixBlendMode = resolvedBlend as CSSProperties["mixBlendMode"];
    } else if (id) {
      noteMissing(id, "blend", "motion");
    }

    if (id) {
      style.zIndex = resolveZIndex(id, entry.zIndex);
    } else if (id) {
      noteMissing(id, "zIndex", "motion");
    }

    return { style, targetOpacity };
  };

  const waveBackdropUrlDesktop = resolveAssetUrl(surfaces.background?.desktop);
  const waveBackdropUrlMobile = resolveAssetUrl(surfaces.background?.mobile);
  const overlayFieldUrl = resolveAssetUrl(surfaces.overlays?.field);
  const overlayDotsUrl = resolveAssetUrl(surfaces.overlays?.dots);
  const particlesUrl = resolvedParticlesPath;
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
    ["--hero-particles" as string]: shouldShowParticles ? resolveBackgroundImage(resolvedParticlesPath) : undefined,
    ["--hero-grain-desktop" as string]: grainUrlDesktop ? resolveBackgroundImage(grainUrlDesktop) : undefined,
    ["--hero-grain-mobile" as string]: grainUrlMobile ? resolveBackgroundImage(grainUrlMobile) : undefined,
    ["--hero-film-grain-opacity" as string]: shouldShowGrain ? grainOpacity : undefined,
    ["--hero-film-grain-blend" as string]: shouldShowGrain
      ? ((surfaces.grain?.desktop?.blendMode as CSSProperties["mixBlendMode"]) ?? undefined)
      : undefined,
    ["--hero-particles-opacity" as string]: shouldShowParticles ? resolvedParticlesOpacity : undefined,
    ["--hero-caustics-overlay" as string]: "url(/assets/champagne/textures/wave-light-overlay.webp)",
  };

  const diagnosticOutlineStyle: CSSProperties | undefined = diagnosticBoost
    ? { outline: "1px solid var(--champagne-keyline-gold, var(--accentGold_soft))", outlineOffset: "-1px" }
    : undefined;
  const usedZIndexes = new Set<number>();
  const resolveZIndex = (id: string, candidate?: number | string | null) => {
    let resolved = coerceZ(candidate) ?? defaultZFor(id);
    const allowDuplicate = id === "sacred.motion.particleDrift" || id === "sacred.motion.goldDust";
    if (!allowDuplicate) {
      while (usedZIndexes.has(resolved)) {
        resolved += 1;
      }
    }
    usedZIndexes.add(resolved);
    return resolved;
  };

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
    const modeGlue = resolvedGlueManifest.modes?.[runtimeMode];
    return modeGlue?.[surfaceId];
  };
  const normalizeGlue = (glue?: GlueRule | null): GlueRule => {
    if (!glue) return {};
    return {
      ...(glue.backgroundSize ? { backgroundSize: glue.backgroundSize } : {}),
      ...(glue.backgroundRepeat ? { backgroundRepeat: glue.backgroundRepeat } : {}),
      ...(glue.backgroundPosition ? { backgroundPosition: glue.backgroundPosition } : {}),
      ...(glue.imageRendering ? { imageRendering: glue.imageRendering } : {}),
      ...(glue.zIndex !== undefined ? { zIndex: glue.zIndex } : {}),
      ...(glue.filter ? { filter: glue.filter } : {}),
      ...(glue.willChange ? { willChange: glue.willChange } : {}),
    };
  };
  const resolveGlueForSurface = (surfaceId: string, url?: string, overrideGlue?: GlueRule): GlueRule | null => {
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
  const isHomeMode = isHomePath;
  const contrastGlueFilters = new Map<string, string>();
  const registerContrastFilter = (surfaceId: string, glue?: GlueRule | null) => {
    if (!isHomeMode) return;
    if (glue?.filter) {
      contrastGlueFilters.set(surfaceId, glue.filter);
    }
  };
  registerContrastFilter("field.waveBackdrop", waveBackdropResolvedGlue);
  registerContrastFilter("field.waveRings", waveRingsResolvedGlue);
  registerContrastFilter("field.dotGrid", dotGridResolvedGlue);
  registerContrastFilter("overlay.sacredBloom", sacredBloomResolvedGlue);
  const sacredBloomContrastFilter = contrastGlueFilters.get("overlay.sacredBloom");
  const sacredBloomStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "18% 14%",
    backgroundImage: "var(--hero-caustics-overlay)",
    zIndex: resolveZIndex("overlay.sacredBloom"),
    ...(sacredBloomResolvedGlue ?? sacredBloomGlue ?? {}),
    mixBlendMode: "screen",
    opacity: bloomDebug ? 0.8 : 0.18,
    ...(isHomeMode ? {} : {}),
  };

  const layerStyles: Record<string, CSSProperties> = {
    "gradient.base": {
      zIndex: resolveZIndex("gradient.base"),
    },
    "field.waveBackdrop": (() => {
      const style: CSSProperties = {
        backgroundImage: "var(--hero-wave-background-desktop)",
        ...(waveBackdropResolvedGlue ?? waveBackdropGlue ?? {}),
      };

      style.zIndex = resolveZIndex("field.waveBackdrop", waveBackdropZIndex ?? waveBackdropResolvedGlue?.zIndex);
      if (waveBackdropZIndex === undefined || waveBackdropZIndex === null) {
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
      style.zIndex = resolveZIndex("mask.waveHeader", waveMaskEntry?.zIndex);
      if (waveMaskEntry?.zIndex === undefined || waveMaskEntry?.zIndex === null) {
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

      style.zIndex = resolveZIndex("field.waveRings", overlayFieldEntry?.zIndex ?? waveRingsResolvedGlue?.zIndex);
      if (overlayFieldEntry?.zIndex === undefined || overlayFieldEntry?.zIndex === null) {
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

      style.zIndex = resolveZIndex("field.dotGrid", overlayDotsEntry?.zIndex ?? dotGridResolvedGlue?.zIndex);
      if (overlayDotsEntry?.zIndex === undefined || overlayDotsEntry?.zIndex === null) {
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

      style.zIndex = resolveZIndex("overlay.particles", particlesEntry?.zIndex ?? particlesResolvedGlue?.zIndex);
      if ((particlesEntry?.zIndex === undefined || particlesEntry?.zIndex === null) && shouldShowParticles) {
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

      style.zIndex = resolveZIndex("overlay.filmGrain", grainEntry?.zIndex ?? grainResolvedGlue?.zIndex);
      if ((grainEntry?.zIndex === undefined || grainEntry?.zIndex === null) && shouldShowGrain) {
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
      zIndex: resolveZIndex("hero.contentFrame"),
    },
  };

  const { style: heroVideoStyle, targetOpacity: heroVideoTargetOpacity } = resolveMotionStyle(
    videoEntry ?? undefined,
    "motion.heroVideo",
  );

  const motionEntriesWithStyles = filteredMotionEntries.map((entry, index) => {
    const { style, targetOpacity } = resolveMotionStyle(entry, entry.id ?? `motion-${index}`);

    return { entry, style, targetOpacity };
  });

  const layers: HeroV2SurfaceLayerModel[] = surfaceStack.map((layer) => {
    const resolvedStyle = layer.token ? layerStyles[layer.token] : undefined;
    const inlineStyle = {
      ...(resolvedStyle ?? {}),
      ...diagnosticOutlineStyle,
    };
    const glueMeta = glueTelemetry.get(layer.id) ?? { source: "none" };
    const contrastFilter = contrastGlueFilters.get(layer.id);

    return {
      id: layer.id,
      role: layer.role,
      prmSafe: layer.prmSafe,
      className: layer.className ?? "hero-surface-layer",
      style: inlineStyle,
      glueMeta,
      contrastFilter,
    };
  });

  const motionLayers: HeroV2MotionLayerModel[] = motionEntriesWithStyles
    .filter(({ entry }) => Boolean(entry.id && entry.path))
    .map(({ entry, style, targetOpacity }) => ({
      id: entry.id as string,
      className: entry.className,
      path: entry.path as string,
      style,
      targetOpacity,
    }));

  const heroVideo = !prmEnabled && videoEntry?.path && !isDeniedVideo(videoEntry.path)
    ? {
        path: videoEntry.path,
        poster: surfaces.background?.desktop?.path,
        style: heroVideoStyle,
        targetOpacity: heroVideoTargetOpacity,
      }
    : undefined;

  const sacredBloomModel = bloomEnabled
    ? {
        style: sacredBloomStyle,
        bloomDebug,
        baseOpacity: bloomDebug ? "0.8" : "0.18",
        shape: isHomeMode ? "phase3d" : undefined,
        mask: isHomeMode ? "upper-mid-soft" : undefined,
        contrastFilter: sacredBloomContrastFilter,
        glueMeta: sacredBloomGlueMeta,
      }
    : undefined;

  const surfaceStackModel: HeroSurfaceStackModel = {
    surfaceVars,
    prmEnabled,
    layers,
    motionLayers,
    bloomEnabled,
    heroId: effectiveHeroId,
    variantId: effectiveVariantId,
    boundHeroId,
    boundVariantId,
    effectiveHeroId,
    effectiveVariantId,
    particlesPath: resolvedParticlesPath,
    particlesOpacity: resolvedParticlesOpacity,
    heroVideo,
    sacredBloom: sacredBloomModel,
  };

  return {
    gradient,
    layout,
    content,
    surfaceStack: surfaceStackModel,
  };
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
  const [currentModel, setCurrentModel] = useState<HeroV2Model | null>(null);
  const [incomingModel, setIncomingModel] = useState<HeroV2Model | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentModelRef = useRef<HeroV2Model | null>(null);
  const transitionRef = useRef<{ timeoutId: number | null; rafId: number | null }>({
    timeoutId: null,
    rafId: null,
  });
  const debugEnabled = searchParams?.has("heroDebug") ?? false;

  useEffect(() => {
    currentModelRef.current = currentModel;
  }, [currentModel]);

  useEffect(() => {
    let isActive = true;
    const transitionState = transitionRef.current;
    const cached = heroV2ModelCache.get(pathnameKey);
    if (cached && !currentModelRef.current) {
      setCurrentModel(cached);
    }
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
      heroV2ModelCache.set(pathnameKey, nextModel);
      if (!currentModelRef.current) {
        setCurrentModel(nextModel);
        return;
      }
      setIncomingModel(nextModel);
      setIsTransitioning(false);
      if (transitionState.rafId) {
        cancelAnimationFrame(transitionState.rafId);
      }
      transitionState.rafId = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      if (transitionState.timeoutId) {
        window.clearTimeout(transitionState.timeoutId);
      }
      transitionState.timeoutId = window.setTimeout(() => {
        setCurrentModel(nextModel);
        setIncomingModel(null);
        setIsTransitioning(false);
      }, 240);
    });

    return () => {
      isActive = false;
      if (transitionState.rafId) {
        cancelAnimationFrame(transitionState.rafId);
        transitionState.rafId = null;
      }
      if (transitionState.timeoutId) {
        window.clearTimeout(transitionState.timeoutId);
        transitionState.timeoutId = null;
      }
    };
  }, [debugEnabled, diagnosticBoost, filmGrain, glueVars, mode, pageCategory, particles, pathnameKey, prm, timeOfDay, treatmentSlug]);

  useEffect(() => {
    if (!debugEnabled) return;
    if (!currentModel) return;
    const logOpacity = () => {
      const firstMotion = document.querySelector(".hero-renderer-v2 .hero-surface--motion") as HTMLElement | null;
      const computedOpacity = firstMotion ? getComputedStyle(firstMotion).opacity : null;
      console.info("HERO_V2_MOTION_OPACITY_PROOF", {
        pathname: pathnameKey,
        prm: currentModel.surfaceStack.prmEnabled,
        motionCount: currentModel.surfaceStack.motionLayers.length,
        firstMotionOpacity: computedOpacity,
      });
    };
    const frameId = requestAnimationFrame(logOpacity);
    return () => cancelAnimationFrame(frameId);
  }, [currentModel, debugEnabled, pathnameKey]);

  if (!currentModel) return <HeroFallback />;

  const resolvedRootStyle = { ...rootStyle, ...currentModel.surfaceStack.surfaceVars };
  const motionCount = currentModel.surfaceStack.motionLayers.length;
  const overlayData = {
    pathname: pathnameKey,
    heroId: currentModel.surfaceStack.heroId ?? "",
    variantId: currentModel.surfaceStack.variantId ?? "",
    boundHeroId: currentModel.surfaceStack.boundHeroId ?? "",
    boundVariantId: currentModel.surfaceStack.boundVariantId ?? "",
    effectiveHeroId: currentModel.surfaceStack.effectiveHeroId ?? "",
    effectiveVariantId: currentModel.surfaceStack.effectiveVariantId ?? "",
    particlesPath: currentModel.surfaceStack.particlesPath ?? "",
    particlesOpacity: currentModel.surfaceStack.particlesOpacity ?? "",
    motionCount,
    prm: currentModel.surfaceStack.prmEnabled,
  };
  const surfaceWrapperBaseStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    transition: "opacity 220ms ease",
  };

  return (
    <HeroV2Frame
      layout={currentModel.layout}
      gradient={currentModel.gradient}
      rootStyle={resolvedRootStyle}
      heroId={currentModel.surfaceStack.heroId}
      variantId={currentModel.surfaceStack.variantId}
      particlesPath={currentModel.surfaceStack.particlesPath}
      particlesOpacity={currentModel.surfaceStack.particlesOpacity}
      motionCount={motionCount}
      prm={currentModel.surfaceStack.prmEnabled}
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
      <div
        style={{
          ...surfaceWrapperBaseStyle,
          opacity: incomingModel ? (isTransitioning ? 0 : 1) : 1,
        }}
      >
        <HeroSurfaceStackV2 surfaceRef={surfaceRef} {...currentModel.surfaceStack} />
      </div>
      {incomingModel ? (
        <div
          style={{
            ...surfaceWrapperBaseStyle,
            opacity: isTransitioning ? 1 : 0,
          }}
        >
          <HeroSurfaceStackV2 {...incomingModel.surfaceStack} />
        </div>
      ) : null}
      <HeroContentFade>
        <HeroContentV2 content={currentModel.content} layout={currentModel.layout} />
      </HeroContentFade>
    </HeroV2Frame>
  );
}
