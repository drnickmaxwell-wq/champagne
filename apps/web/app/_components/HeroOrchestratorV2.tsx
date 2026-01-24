"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
// @ts-expect-error -- react-dom types are not wired in this workspace.
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import type { HeroMode } from "@champagne/hero";
import { getPageManifest } from "@champagne/manifests";
import { isBrandHeroEnabled } from "../featureFlags";
import {
  HeroContentV2,
  HeroFallback,
  HeroV2Frame,
  type HeroV2Model,
} from "../components/hero/v2/HeroRendererV2";
import { buildHeroV2Model } from "../components/hero/v2/buildHeroV2Model";
import { HeroContentFade, HeroSurfaceStackV2 } from "../components/hero/v2/HeroV2Client";

const HERO_SWAP_FADE = process.env.NEXT_PUBLIC_HERO_SWAP_FADE === "1";
const heroV2ModelCache = new Map<string, HeroV2Model>();

const normalizeFlag = (flag?: string) =>
  (flag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();

const HERO_PERSIST_ENABLED = normalizeFlag(process.env.NEXT_PUBLIC_HERO_PERSIST) === "1";
const HERO_ENGINE_NORMALIZED = normalizeFlag(process.env.NEXT_PUBLIC_HERO_ENGINE);

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

const getHeroContextForPathname = (pathname: string) => {
  let pageCategory: string | undefined;
  let mode: HeroMode | undefined;
  let treatmentSlug: string | undefined;

  if (pathname.startsWith("/treatments/")) {
    mode = "treatment";
    treatmentSlug = pathname.split("/")[2] || undefined;
    pageCategory = "treatment";
  } else if (pathname.startsWith("/team/")) {
    pageCategory = "profile";
  } else if (pathname === "/team") {
    pageCategory = "utility";
  } else if (pathname === "/about") {
    pageCategory = "utility";
  } else if (pathname === "/contact") {
    pageCategory = "utility";
  } else if (pathname === "/blog") {
    pageCategory = "editorial";
  } else if (pathname === "/treatments") {
    pageCategory = "utility";
  } else if (pathname === "/fees") {
    pageCategory = "utility";
  } else if (pathname === "/smile-gallery") {
    pageCategory = "utility";
  } else if (pathname === "/") {
    pageCategory = "home";
  } else {
    pageCategory = (getPageManifest(pathname) as { category?: string })?.category;
  }

  return { mode, treatmentSlug, pageCategory };
};

export function HeroOrchestratorV2() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathnameKey = normalizeHeroPathname(pathname);
  const debugEnabled = searchParams?.has("heroDebug") ?? false;
  const isPublicPage = !pathnameKey.startsWith("/champagne/");
  const isHeroEnabled = isBrandHeroEnabled();
  const isHeroEngineV2 = HERO_ENGINE_NORMALIZED === "v2";
  const shouldRender = HERO_PERSIST_ENABLED && isHeroEngineV2 && isHeroEnabled && isPublicPage;
  const heroContext = useMemo(() => getHeroContextForPathname(pathnameKey), [pathnameKey]);
  const [currentModel, setCurrentModel] = useState<HeroV2Model | null>(null);
  const [prevModel, setPrevModel] = useState<HeroV2Model | null>(null);
  const [incomingModel, setIncomingModel] = useState<HeroV2Model | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [crossfadeOpacity, setCrossfadeOpacity] = useState(1);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const currentModelRef = useRef<HeroV2Model | null>(null);
  const transitionRef = useRef<{
    timeoutId: number | null;
    rafId: number | null;
    crossfadeTimeoutId: number | null;
    crossfadeRafId: number | null;
    crossfadeRafId2: number | null;
  }>({
    timeoutId: null,
    rafId: null,
    crossfadeTimeoutId: null,
    crossfadeRafId: null,
    crossfadeRafId2: null,
  });

  useEffect(() => {
    if (!shouldRender) {
      setMountNode(null);
      return;
    }
    setMountNode(document.getElementById("hero-v2-orchestrator-root"));
  }, [shouldRender]);

  useEffect(() => {
    currentModelRef.current = currentModel;
  }, [currentModel]);

  useEffect(() => {
    if (!shouldRender) {
      setCurrentModel(null);
      setPrevModel(null);
      setIncomingModel(null);
      setIsTransitioning(false);
      setIsCrossfading(false);
      setCrossfadeOpacity(1);
      return;
    }

    let isActive = true;
    const transitionState = transitionRef.current;
    const cached = heroV2ModelCache.get(pathnameKey);
    if (cached && !currentModelRef.current) {
      setCurrentModel(cached);
    }

    void buildHeroV2Model({
      mode: heroContext.mode,
      treatmentSlug: heroContext.treatmentSlug,
      pageSlugOrPath: pathnameKey,
      debug: debugEnabled,
      pageCategory: heroContext.pageCategory,
    }).then((nextModel) => {
      if (!isActive) return;
      if (!nextModel) return;
      heroV2ModelCache.set(pathnameKey, nextModel);
      if (!currentModelRef.current) {
        setCurrentModel(nextModel);
        return;
      }
      if (HERO_SWAP_FADE) {
        if (transitionState.crossfadeRafId) {
          cancelAnimationFrame(transitionState.crossfadeRafId);
        }
        if (transitionState.crossfadeRafId2) {
          cancelAnimationFrame(transitionState.crossfadeRafId2);
        }
        if (transitionState.crossfadeTimeoutId) {
          window.clearTimeout(transitionState.crossfadeTimeoutId);
        }
        setIncomingModel(null);
        setIsTransitioning(false);
        setPrevModel(currentModelRef.current);
        setCurrentModel(nextModel);
        setIsCrossfading(true);
        setCrossfadeOpacity(0);
        transitionState.crossfadeRafId = requestAnimationFrame(() => {
          transitionState.crossfadeRafId2 = requestAnimationFrame(() => {
            setCrossfadeOpacity(1);
          });
        });
        transitionState.crossfadeTimeoutId = window.setTimeout(() => {
          setPrevModel(null);
          setIsCrossfading(false);
        }, 380);
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
      if (transitionState.crossfadeRafId) {
        cancelAnimationFrame(transitionState.crossfadeRafId);
        transitionState.crossfadeRafId = null;
      }
      if (transitionState.crossfadeRafId2) {
        cancelAnimationFrame(transitionState.crossfadeRafId2);
        transitionState.crossfadeRafId2 = null;
      }
      if (transitionState.crossfadeTimeoutId) {
        window.clearTimeout(transitionState.crossfadeTimeoutId);
        transitionState.crossfadeTimeoutId = null;
      }
    };
  }, [debugEnabled, heroContext, pathnameKey, shouldRender]);

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

  if (!shouldRender || !mountNode) return null;

  if (!currentModel) {
    return createPortal(<HeroFallback />, mountNode);
  }

  const resolvedRootStyle = { ...currentModel.surfaceStack.surfaceVars };
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
  const crossfadeWrapperStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    transition: "opacity 360ms ease-in-out",
    background: "var(--hero-gradient, var(--smh-gradient))",
    pointerEvents: "none",
  };

  const content = (
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
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
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
      {prevModel ? (
        <>
          <div
            style={{
              ...crossfadeWrapperStyle,
              opacity: isCrossfading ? 1 - crossfadeOpacity : 0,
            }}
          >
            <HeroSurfaceStackV2 {...prevModel.surfaceStack} />
          </div>
          <div
            style={{
              ...crossfadeWrapperStyle,
              opacity: isCrossfading ? crossfadeOpacity : 1,
            }}
          >
            <HeroSurfaceStackV2 {...currentModel.surfaceStack} />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              ...surfaceWrapperBaseStyle,
              opacity: incomingModel ? (isTransitioning ? 0 : 1) : 1,
            }}
          >
            <HeroSurfaceStackV2 {...currentModel.surfaceStack} />
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
        </>
      )}
      <HeroContentFade>
        <HeroContentV2 content={currentModel.content} layout={currentModel.layout} />
      </HeroContentFade>
    </HeroV2Frame>
  );

  return createPortal(content, mountNode);
}
