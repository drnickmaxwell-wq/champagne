"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { HeroContentV2, HeroV2Frame, type HeroRendererV2Props, type HeroV2Model } from "../components/hero/v2/HeroRendererV2";
import { HeroSurfaceStackV2 } from "../components/hero/v2/HeroV2Client";
import { buildHeroV2Model } from "../components/hero/v2/buildHeroV2Model";

const CROSSFADE_DURATION_MS = 380;

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

type HeroOrchestratorV2Props = HeroRendererV2Props & {
  initialModel: HeroV2Model | null;
};

export function HeroOrchestratorV2({
  initialModel,
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
  debug,
}: HeroOrchestratorV2Props) {
  const rawPathname = usePathname();
  const searchParams = useSearchParams();
  const pathnameKey = useMemo(() => normalizeHeroPathname(rawPathname), [rawPathname]);
  const debugEnabled = debug ?? (searchParams?.has("heroDebug") ?? false);
  const [currentModel, setCurrentModel] = useState<HeroV2Model | null>(initialModel);
  const [prevModel, setPrevModel] = useState<HeroV2Model | null>(null);
  const [crossfadeOpacity, setCrossfadeOpacity] = useState(1);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const currentModelRef = useRef<HeroV2Model | null>(initialModel);
  const lastGoodModelRef = useRef<HeroV2Model | null>(initialModel);
  const transitionRef = useRef<{
    rafId: number | null;
    rafId2: number | null;
    timeoutId: number | null;
  }>({
    rafId: null,
    rafId2: null,
    timeoutId: null,
  });

  useEffect(() => {
    if (!currentModel) return;
    currentModelRef.current = currentModel;
    lastGoodModelRef.current = currentModel;
  }, [currentModel]);

  useEffect(() => {
    let isActive = true;
    const transitionState = transitionRef.current;

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
      if (!currentModelRef.current) {
        setCurrentModel(nextModel);
        return;
      }

      if (transitionState.rafId) {
        cancelAnimationFrame(transitionState.rafId);
      }
      if (transitionState.rafId2) {
        cancelAnimationFrame(transitionState.rafId2);
      }
      if (transitionState.timeoutId) {
        window.clearTimeout(transitionState.timeoutId);
      }

      setPrevModel(currentModelRef.current);
      setCurrentModel(nextModel);
      setIsCrossfading(true);
      setCrossfadeOpacity(0);
      transitionState.rafId = requestAnimationFrame(() => {
        transitionState.rafId2 = requestAnimationFrame(() => {
          setCrossfadeOpacity(1);
        });
      });
      transitionState.timeoutId = window.setTimeout(() => {
        setPrevModel(null);
        setIsCrossfading(false);
      }, CROSSFADE_DURATION_MS);
    });

    return () => {
      isActive = false;
      if (transitionState.rafId) {
        cancelAnimationFrame(transitionState.rafId);
        transitionState.rafId = null;
      }
      if (transitionState.rafId2) {
        cancelAnimationFrame(transitionState.rafId2);
        transitionState.rafId2 = null;
      }
      if (transitionState.timeoutId) {
        window.clearTimeout(transitionState.timeoutId);
        transitionState.timeoutId = null;
      }
    };
  }, [debugEnabled, diagnosticBoost, filmGrain, glueVars, mode, pageCategory, particles, pathnameKey, prm, timeOfDay, treatmentSlug]);

  const effectiveModel = currentModel ?? lastGoodModelRef.current;

  if (!effectiveModel) {
    return null;
  }

  const resolvedRootStyle = { ...rootStyle, ...effectiveModel.surfaceStack.surfaceVars };
  const motionCount = effectiveModel.surfaceStack.motionLayers.length;
  const surfaceWrapperStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    transition: "opacity 360ms ease-in-out",
    pointerEvents: "none",
  };

  return (
    <HeroV2Frame
      layout={effectiveModel.layout}
      gradient={effectiveModel.gradient}
      rootStyle={resolvedRootStyle}
      heroId={effectiveModel.surfaceStack.heroId}
      variantId={effectiveModel.surfaceStack.variantId}
      particlesPath={effectiveModel.surfaceStack.particlesPath}
      particlesOpacity={effectiveModel.surfaceStack.particlesOpacity}
      motionCount={motionCount}
      prm={effectiveModel.surfaceStack.prmEnabled}
      debug={debugEnabled}
    >
      {prevModel ? (
        <>
          <div
            style={{
              ...surfaceWrapperStyle,
              opacity: isCrossfading ? 1 - crossfadeOpacity : 0,
            }}
          >
            <HeroSurfaceStackV2 {...prevModel.surfaceStack} />
          </div>
          <div
            style={{
              ...surfaceWrapperStyle,
              opacity: isCrossfading ? crossfadeOpacity : 1,
            }}
          >
            <HeroSurfaceStackV2 surfaceRef={surfaceRef} {...effectiveModel.surfaceStack} />
          </div>
        </>
      ) : (
        <div style={surfaceWrapperStyle}>
          <HeroSurfaceStackV2 surfaceRef={surfaceRef} {...effectiveModel.surfaceStack} />
        </div>
      )}
      <HeroContentV2 content={effectiveModel.content} layout={effectiveModel.layout} />
    </HeroV2Frame>
  );
}
