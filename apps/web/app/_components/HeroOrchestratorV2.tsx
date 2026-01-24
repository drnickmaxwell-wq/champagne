"use client";

import { useEffect, useRef, useState, type ReactNode, type ReactPortal } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  HeroContentV2,
  HeroFallback,
  HeroV2Frame,
  type HeroRendererV2Props,
  type HeroV2Model,
} from "../components/hero/v2/HeroRendererV2";
import { HeroContentFade, HeroSurfaceStackV2 } from "../components/hero/v2/HeroV2Client";
import { buildHeroV2Model } from "../components/hero/v2/buildHeroV2Model";

const { createPortal } = require("react-dom") as {
  createPortal: (children: ReactNode, container: Element | DocumentFragment) => ReactPortal;
};

const HERO_SWAP_FADE = process.env.NEXT_PUBLIC_HERO_SWAP_FADE === "1";
const heroV2ModelCache = new Map<string, HeroV2Model>();

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

export function HeroOrchestratorV2(props: HeroRendererV2Props) {
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
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [currentModel, setCurrentModel] = useState<HeroV2Model | null>(null);
  const [prevModel, setPrevModel] = useState<HeroV2Model | null>(null);
  const [incomingModel, setIncomingModel] = useState<HeroV2Model | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [crossfadeOpacity, setCrossfadeOpacity] = useState(1);
  const currentModelRef = useRef<HeroV2Model | null>(null);
  const lastGoodModelRef = useRef<HeroV2Model | null>(null);
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
  const debugEnabled = searchParams?.has("heroDebug") ?? false;

  useEffect(() => {
    setPortalRoot(document.getElementById("hero-v2-orchestrator-root"));
  }, []);

  useEffect(() => {
    currentModelRef.current = currentModel;
    if (currentModel) {
      lastGoodModelRef.current = currentModel;
    }
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
  }, [debugEnabled, diagnosticBoost, filmGrain, glueVars, mode, pageCategory, particles, pathnameKey, prm, timeOfDay, treatmentSlug]);

  if (!portalRoot) return null;

  const displayModel = currentModel ?? lastGoodModelRef.current;

  if (!displayModel) {
    return createPortal(<HeroFallback />, portalRoot);
  }

  const resolvedRootStyle = { ...rootStyle, ...displayModel.surfaceStack.surfaceVars };
  const motionCount = displayModel.surfaceStack.motionLayers.length;
  const overlayData = {
    pathname: pathnameKey,
    heroId: displayModel.surfaceStack.heroId ?? "",
    variantId: displayModel.surfaceStack.variantId ?? "",
    boundHeroId: displayModel.surfaceStack.boundHeroId ?? "",
    boundVariantId: displayModel.surfaceStack.boundVariantId ?? "",
    effectiveHeroId: displayModel.surfaceStack.effectiveHeroId ?? "",
    effectiveVariantId: displayModel.surfaceStack.effectiveVariantId ?? "",
    particlesPath: displayModel.surfaceStack.particlesPath ?? "",
    particlesOpacity: displayModel.surfaceStack.particlesOpacity ?? "",
    motionCount,
    prm: displayModel.surfaceStack.prmEnabled,
  };
  const surfaceWrapperBaseStyle = {
    position: "absolute" as const,
    inset: 0,
    transition: "opacity 220ms ease",
  };
  const crossfadeWrapperStyle = {
    position: "absolute" as const,
    inset: 0,
    transition: "opacity 360ms ease-in-out",
    background: "var(--hero-gradient, var(--smh-gradient))",
    pointerEvents: "none" as const,
  };

  return createPortal(
    <HeroV2Frame
      layout={displayModel.layout}
      gradient={displayModel.gradient}
      rootStyle={resolvedRootStyle}
      heroId={displayModel.surfaceStack.heroId}
      variantId={displayModel.surfaceStack.variantId}
      particlesPath={displayModel.surfaceStack.particlesPath}
      particlesOpacity={displayModel.surfaceStack.particlesOpacity}
      motionCount={motionCount}
      prm={displayModel.surfaceStack.prmEnabled}
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
            <HeroSurfaceStackV2 surfaceRef={surfaceRef} {...displayModel.surfaceStack} />
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
            <HeroSurfaceStackV2 surfaceRef={surfaceRef} {...displayModel.surfaceStack} />
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
        <HeroContentV2 content={displayModel.content} layout={displayModel.layout} />
      </HeroContentFade>
    </HeroV2Frame>,
    portalRoot,
  );
}
