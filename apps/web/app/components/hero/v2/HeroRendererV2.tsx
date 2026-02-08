"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { HeroContentFade, HeroSurfaceStackV2 } from "./HeroV2Client";
import { buildHeroV2Model } from "./buildHeroV2Model";
import type { HeroRendererV2Props, HeroV2Model } from "./HeroRendererV2.types";
import { HeroContentV2, HeroFallback, HeroV2Frame } from "./HeroRendererV2.shared";

const heroV2ModelCache = new Map<string, HeroV2Model>();
let lastResolvedHeroV2Model: HeroV2Model | null = null;

const normalizeHeroPathname = (path?: string) => {
  if (!path) return "/";
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const normalized = trimmed.split("?")[0]?.split("#")[0] ?? "/";
  if (!normalized) return "/";
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};


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
    const modelSnapshot = renderModelRef.current ?? lastResolvedHeroV2Model;
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
  }, [pathnameKey, renderModel]);

  const activeModel = renderModel ?? lastResolvedHeroV2Model;
  if (!activeModel) return <HeroFallback />;

  const resolvedRootStyle = { ...rootStyle, ...activeModel.surfaceStack.surfaceVars };
  const gatedRootStyle = isHeroVisuallyReady
    ? resolvedRootStyle
    : { ...resolvedRootStyle, opacity: 0, visibility: "hidden" as const };
  const motionCount = activeModel.surfaceStack.motionLayers.length;
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
      <HeroContentFade>
        <HeroContentV2 content={activeModel.content} layout={activeModel.layout} />
      </HeroContentFade>
    </HeroV2Frame>
  );
}

export { buildHeroV2Model } from "./buildHeroV2Model";
