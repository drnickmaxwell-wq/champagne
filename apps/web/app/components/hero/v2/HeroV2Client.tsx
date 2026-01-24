"use client";

import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { CSSProperties, Ref } from "react";
import { BloomDriver } from "./BloomDriver";
import type { HeroSurfaceStackModel } from "./HeroRendererV2";

const HERO_V2_DEBUG = process.env.NEXT_PUBLIC_HERO_DEBUG === "1";
const HERO_CONTENT_FADE_ENABLED = process.env.NEXT_PUBLIC_HERO_CONTENT_FADE !== "0";

type HeroSurfaceStackV2Props = HeroSurfaceStackModel & {
  surfaceRef?: Ref<HTMLDivElement>;
};

const isHeroTruthEnabled = () => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("heroTruth") === "1";
};

function HeroSurfaceStackV2Base({
  surfaceVars,
  prmEnabled,
  layers,
  motionLayers,
  heroVideo,
  sacredBloom,
  surfaceRef,
  bloomEnabled,
  heroId: _heroId,
  variantId: _variantId,
}: HeroSurfaceStackV2Props) {
  const instanceId = useRef(`v2-stack-${Math.random().toString(36).slice(2, 10)}`);
  const pathname = usePathname();
  const handleVideoReady = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    event.currentTarget.dataset.ready = "true";
  };

  void pathname;

  useEffect(() => {
    if (!HERO_V2_DEBUG) return;
    if (isHeroTruthEnabled()) return;
    const stackId = instanceId.current;
    console.groupCollapsed("HERO_V2_MOUNT");
    console.log("HERO_V2_MOUNT_DATA", { id: stackId, pathname: window.location.pathname });
    console.groupEnd();

    const logBackgrounds = () => {
      const heroRoot = document.querySelector("[data-hero-root=\"true\"]");
      const heroContainer = heroRoot?.closest("[data-hero-engine]") ?? heroRoot;
      const belowHero = heroContainer?.nextElementSibling ?? heroRoot?.nextElementSibling;
      const payload = {
        documentElement: document.documentElement ? getComputedStyle(document.documentElement).backgroundColor : "NOT_FOUND",
        body: document.body ? getComputedStyle(document.body).backgroundColor : "NOT_FOUND",
        main: document.querySelector("main")
          ? getComputedStyle(document.querySelector("main") as HTMLElement).backgroundColor
          : "NOT_FOUND",
        belowHero: belowHero ? getComputedStyle(belowHero as HTMLElement).backgroundColor : "NOT_FOUND",
      };
      console.groupCollapsed("HERO_V2_BACKGROUND_SOURCES");
      console.log("HERO_V2_BACKGROUND_SOURCES_DATA", payload);
      console.groupEnd();
    };

    const logContentVisibility = () => {
      const content = document.querySelector(".hero-renderer-v2 .hero-content") as HTMLElement | null;
      if (!content) {
        console.groupCollapsed("HERO_V2_CONTENT_VISIBILITY");
        console.log("HERO_V2_CONTENT_VISIBILITY_DATA", { found: false });
        console.groupEnd();
        return;
      }
      const styles = getComputedStyle(content);
      const rect = content.getBoundingClientRect();
      console.groupCollapsed("HERO_V2_CONTENT_VISIBILITY");
      console.log("HERO_V2_CONTENT_VISIBILITY_DATA", {
        found: true,
        opacity: styles.opacity,
        visibility: styles.visibility,
        zIndex: styles.zIndex,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      });
      console.groupEnd();
    };

    const logMotionInit = () => {
      const videos = Array.from(
        document.querySelectorAll<HTMLVideoElement>(".hero-renderer-v2 .hero-surface--motion"),
      );
      if (videos.length === 0) {
        console.groupCollapsed("HERO_V2_MOTION_INIT");
        console.log("HERO_V2_MOTION_INIT_DATA", { found: false });
        console.groupEnd();
        return;
      }
      videos.forEach((video) => {
        const styles = getComputedStyle(video);
        console.groupCollapsed("HERO_V2_MOTION_INIT");
        console.log("HERO_V2_MOTION_INIT_DATA", {
          id: video.dataset.surfaceId ?? "unknown",
          opacity: styles.opacity,
          visibility: styles.visibility,
          zIndex: styles.zIndex,
          opacityIsZero: Number.parseFloat(styles.opacity || "0") <= 0.01,
        });
        console.groupEnd();
      });
    };

    const logFrame = () => {
      logBackgrounds();
      logContentVisibility();
      logMotionInit();
    };
    const frameId = requestAnimationFrame(logFrame);

    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>(".hero-renderer-v2 .hero-surface--motion"),
    );
    const events: Array<keyof HTMLMediaElementEventMap> = [
      "loadeddata",
      "canplay",
      "playing",
      "waiting",
      "stalled",
      "error",
    ];
    const handlers = new Map<HTMLVideoElement, Map<string, EventListener>>();
    videos.forEach((video) => {
      const videoHandlers = new Map<string, EventListener>();
      events.forEach((eventName) => {
        const handler = () => {
          console.groupCollapsed("HERO_V2_MOTION_EVENT");
          console.log("HERO_V2_MOTION_EVENT_DATA", {
            id: video.dataset.surfaceId ?? "unknown",
            event: eventName,
            time: performance.now(),
            readyState: video.readyState,
          });
          console.groupEnd();
        };
        video.addEventListener(eventName, handler);
        videoHandlers.set(eventName, handler);
      });
      handlers.set(video, videoHandlers);
    });

    return () => {
      cancelAnimationFrame(frameId);
      handlers.forEach((videoHandlers, video) => {
        videoHandlers.forEach((handler, eventName) => {
          video.removeEventListener(eventName, handler);
        });
      });
      console.groupCollapsed("HERO_V2_UNMOUNT");
      console.log("HERO_V2_UNMOUNT_DATA", { id: stackId, pathname: window.location.pathname });
      console.groupEnd();
    };
  }, []);

  useEffect(() => {
    if (!HERO_V2_DEBUG) return;
    if (isHeroTruthEnabled()) return;
    const logTruth = () => {
      const heroRoot = document.querySelector("[data-hero-root=\"true\"]");
      const heroMount =
        heroRoot?.closest(".hero-renderer-v2") ?? heroRoot?.closest("[data-hero-engine]") ?? heroRoot;
      const surfaceElements = heroMount
        ? Array.from(heroMount.querySelectorAll<HTMLElement>("[data-surface-id]"))
        : [];
      const surfaces = surfaceElements.map((element) => {
        const styles = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const dataset = Object.fromEntries(Object.entries(element.dataset));
        const video = element instanceof HTMLVideoElement ? element : null;
        return {
          surfaceId: element.dataset.surfaceId ?? "unknown",
          tagName: element.tagName.toLowerCase(),
          computed: {
            zIndex: styles.zIndex,
            opacity: styles.opacity,
            mixBlendMode: styles.mixBlendMode,
            filter: styles.filter,
            transform: styles.transform,
            willChange: styles.willChange,
          },
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          video: video
            ? {
                currentSrc: video.currentSrc,
                readyState: video.readyState,
                paused: video.paused,
                currentTime: video.currentTime,
              }
            : null,
          dataset,
        };
      });
      console.log("HERO_V2_TRUTH_SURFACES", {
        pathname,
        scrollY: window.scrollY,
        heroMountFound: Boolean(heroMount),
        surfaceCount: surfaces.length,
        surfaces,
      });

      const content = document.querySelector(".hero-renderer-v2 .hero-content") as HTMLElement | null;
      if (content) {
        const contentStyles = getComputedStyle(content);
        const rect = content.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const topElement = document.elementFromPoint(centerX, centerY) as HTMLElement | null;
        console.log("HERO_V2_TRUTH_CONTENT", {
          pathname,
          scrollY: window.scrollY,
          computed: {
            zIndex: contentStyles.zIndex,
            opacity: contentStyles.opacity,
            visibility: contentStyles.visibility,
            mixBlendMode: contentStyles.mixBlendMode,
            filter: contentStyles.filter,
            transform: contentStyles.transform,
          },
          rect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          },
          topElement: topElement
            ? {
                tagName: topElement.tagName.toLowerCase(),
                className: topElement.className,
                surfaceId: topElement.dataset?.surfaceId ?? null,
              }
            : null,
        });
      } else {
        console.log("HERO_V2_TRUTH_CONTENT", {
          pathname,
          scrollY: window.scrollY,
          found: false,
        });
      }

      const heroContainer = heroRoot?.closest("[data-hero-engine]") ?? heroRoot;
      const belowHero = heroContainer?.nextElementSibling ?? heroRoot?.nextElementSibling;
      const main = document.querySelector("main") as HTMLElement | null;
      console.log("HERO_V2_TRUTH_BG", {
        pathname,
        scrollY: window.scrollY,
        documentElement: document.documentElement
          ? {
              backgroundColor: getComputedStyle(document.documentElement).backgroundColor,
              backgroundImage: getComputedStyle(document.documentElement).backgroundImage,
            }
          : "NOT_FOUND",
        body: document.body
          ? {
              backgroundColor: getComputedStyle(document.body).backgroundColor,
              backgroundImage: getComputedStyle(document.body).backgroundImage,
            }
          : "NOT_FOUND",
        main: main
          ? {
              backgroundColor: getComputedStyle(main).backgroundColor,
              backgroundImage: getComputedStyle(main).backgroundImage,
            }
          : "NOT_FOUND",
        belowHero: belowHero
          ? {
              backgroundColor: getComputedStyle(belowHero as HTMLElement).backgroundColor,
              backgroundImage: getComputedStyle(belowHero as HTMLElement).backgroundImage,
            }
          : "NOT_FOUND",
      });
    };

    const timeoutId = window.setTimeout(logTruth, 1500);
    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    if (!isHeroTruthEnabled()) return;
    const heroRoot =
      document.querySelector(".hero-renderer-v2") ?? document.querySelector("[data-hero-engine=\"v2\"]");
    if (!heroRoot) {
      console.log("HERO_V2_TRUTH_SURFACES", [{ exists: false }]);
      console.log("HERO_V2_TRUTH_CONTENT", { exists: false });
      console.log("HERO_V2_TRUTH_BG", { exists: false });
      return;
    }

    const surfaceElements = Array.from(heroRoot.querySelectorAll<HTMLElement>("[data-surface-id]"));
    const surfaces = surfaceElements.map((element) => {
      const styles = getComputedStyle(element);
      const maskImage = styles.maskImage !== "none" ? styles.maskImage : styles.webkitMaskImage;
      return {
        id: element.dataset.surfaceId ?? "unknown",
        role: element.dataset.surfaceRole ?? null,
        opacity: styles.opacity,
        mixBlendMode: styles.mixBlendMode,
        zIndex: styles.zIndex,
        backgroundImage: styles.backgroundImage,
        maskImage,
        isVideo: element instanceof HTMLVideoElement,
      };
    });
    console.log("HERO_V2_TRUTH_SURFACES", surfaces);

    const content = document.querySelector(".hero-renderer-v2 .hero-content") as HTMLElement | null;
    if (content) {
      const contentStyles = getComputedStyle(content);
      console.log("HERO_V2_TRUTH_CONTENT", {
        exists: true,
        zIndex: contentStyles.zIndex,
        opacity: contentStyles.opacity,
        transform: contentStyles.transform,
        filter: contentStyles.filter,
        pointerEvents: contentStyles.pointerEvents,
      });
    } else {
      console.log("HERO_V2_TRUTH_CONTENT", { exists: false });
    }

    const surfaceIds = [
      "gradient.base",
      "field.waveBackdrop",
      "mask.waveHeader",
      "field.waveRings",
      "field.dotGrid",
      "overlay.particles",
      "overlay.filmGrain",
    ];
    const backgroundPayload = surfaceIds.reduce<Record<string, {
      opacity: string;
      mixBlendMode: string;
      zIndex: string;
      backgroundImage: string;
      maskImage: string;
    }>>((acc, id) => {
      const element = heroRoot.querySelector<HTMLElement>(`[data-surface-id="${id}"]`);
      if (!element) return acc;
      const styles = getComputedStyle(element);
      const maskImage = styles.maskImage !== "none" ? styles.maskImage : styles.webkitMaskImage;
      acc[id] = {
        opacity: styles.opacity,
        mixBlendMode: styles.mixBlendMode,
        zIndex: styles.zIndex,
        backgroundImage: styles.backgroundImage,
        maskImage,
      };
      return acc;
    }, {});
    console.log("HERO_V2_TRUTH_BG", backgroundPayload);
  }, [pathname]);

  return (
    <>
      {bloomEnabled ? <BloomDriver /> : null}
      <div
        aria-hidden
        className="hero-surface-stack"
        ref={surfaceRef}
        data-prm={prmEnabled ? "true" : "false"}
        data-v2-composite-stabilized="true"
        data-v2-contain="paint"
        data-v2-willchange="transform"
        data-v2-persistent-stack="true"
        data-v2-stack-instance={instanceId.current}
        data-v2-bloom-driver-active={bloomEnabled ? "true" : "false"}
        style={surfaceVars}
      >
        {layers.map((layer) => (
          <div
            key={layer.id}
            data-surface-id={layer.id}
            data-surface-role={layer.role}
            data-prm-safe={layer.prmSafe ? "true" : undefined}
            data-contrast-glue={layer.contrastFilter ? "phase3c" : undefined}
            data-contrast-filter={layer.contrastFilter}
            data-glue-source={layer.glueMeta?.source}
            data-glue-size={layer.glueMeta?.backgroundSize}
            data-glue-repeat={layer.glueMeta?.backgroundRepeat}
            data-glue-position={layer.glueMeta?.backgroundPosition}
            data-glue-image-rendering={layer.glueMeta?.imageRendering}
            className={layer.className}
            style={layer.style}
          />
        ))}

        {!prmEnabled && heroVideo?.path && (
          <video
            className="hero-surface-layer hero-surface--motion"
            autoPlay
            playsInline
            loop
            muted
            preload="metadata"
            poster={heroVideo.poster}
            data-surface-id="motion.heroVideo"
            data-ready="false"
            data-motion-target-opacity={
              heroVideo.targetOpacity !== undefined && heroVideo.targetOpacity !== null
                ? `${heroVideo.targetOpacity}`
                : undefined
            }
            onLoadedData={handleVideoReady}
            onCanPlay={handleVideoReady}
            style={heroVideo.style}
          >
            <source src={heroVideo.path} />
          </video>
        )}

        {!prmEnabled &&
          motionLayers.map((entry) => (
            <video
              key={entry.id}
              className={`hero-surface-layer hero-surface--motion${entry.className ? ` ${entry.className}` : ""}`}
              autoPlay
              playsInline
              loop
              muted
              preload="metadata"
              data-surface-id={entry.id}
              data-ready="false"
              data-motion-target-opacity={
                entry.targetOpacity !== undefined && entry.targetOpacity !== null ? `${entry.targetOpacity}` : undefined
              }
              onLoadedData={handleVideoReady}
              onCanPlay={handleVideoReady}
              style={entry.style}
            >
              <source src={entry.path} />
            </video>
          ))}

        {bloomEnabled && sacredBloom ? (
          <div
            data-surface-id="overlay.sacredBloom"
            data-surface-role="fx"
            data-bloom="true"
            data-bloom-driven="true"
            data-bloom-debug={sacredBloom.bloomDebug ? "true" : "false"}
            data-bloom-base-opacity={sacredBloom.baseOpacity}
            data-bloom-shape={sacredBloom.shape}
            data-bloom-mask={sacredBloom.mask}
            data-contrast-glue={sacredBloom.contrastFilter ? "phase3c" : undefined}
            data-contrast-filter={sacredBloom.contrastFilter}
            data-glue-source={sacredBloom.glueMeta?.source}
            data-glue-size={sacredBloom.glueMeta?.backgroundSize}
            data-glue-repeat={sacredBloom.glueMeta?.backgroundRepeat}
            data-glue-position={sacredBloom.glueMeta?.backgroundPosition}
            data-glue-image-rendering={sacredBloom.glueMeta?.imageRendering}
            className="hero-surface-layer hero-surface--lighting"
            aria-hidden="true"
            style={sacredBloom.style}
          />
        ) : null}
      </div>
    </>
  );
}

export const HeroSurfaceStackV2 = memo(HeroSurfaceStackV2Base);

type HeroContentFadeProps = {
  children: ReactNode;
};

export function HeroContentFade({ children }: HeroContentFadeProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const fadeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener?.("change", updatePreference);
    return () => media.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!HERO_CONTENT_FADE_ENABLED) return;
    setIsVisible(false);
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, [pathname, prefersReducedMotion]);

  useEffect(() => {
    const content = document.querySelector(".hero-renderer-v2 .hero-content") as HTMLElement | null;
    const fadeEl = fadeRef.current;
    if (!content || !fadeEl) return;
    if (!HERO_V2_DEBUG) return;
    if (isHeroTruthEnabled()) return;
    const logState = () => {
      const styles = getComputedStyle(content);
      const fadeStyles = getComputedStyle(fadeEl);
      const rect = content.getBoundingClientRect();
      console.groupCollapsed("HERO_V2_CONTENT_FADE_STATE");
      console.log("HERO_V2_CONTENT_FADE_STATE_DATA", {
        pathname,
        isVisible,
        prefersReducedMotion,
        opacity: styles.opacity,
        fadeOpacity: fadeStyles.opacity,
        visibility: styles.visibility,
        zIndex: styles.zIndex,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      });
      console.groupEnd();
    };
    const frameId = requestAnimationFrame(logState);
    const timeoutId = window.setTimeout(logState, 80);
    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [pathname, isVisible, prefersReducedMotion]);

  const style: CSSProperties = {
    opacity: prefersReducedMotion ? 1 : isVisible ? 1 : 0,
    transition: prefersReducedMotion ? "none" : "opacity 220ms ease",
    willChange: "opacity",
  };

  return (
    <div ref={fadeRef} style={style} data-v2-content-fade="true">
      {children}
    </div>
  );
}
