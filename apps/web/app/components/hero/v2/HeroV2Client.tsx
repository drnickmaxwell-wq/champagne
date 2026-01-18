"use client";

import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { CSSProperties, Ref } from "react";
import { BloomDriver } from "./BloomDriver";
import type { HeroSurfaceStackModel } from "./HeroRendererV2";

type HeroSurfaceStackV2Props = HeroSurfaceStackModel & {
  surfaceRef?: Ref<HTMLDivElement>;
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
}: HeroSurfaceStackV2Props) {
  const instanceId = useRef(`v2-stack-${Math.random().toString(36).slice(2, 10)}`);

  useEffect(() => {
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
    setIsVisible(false);
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, [pathname, prefersReducedMotion]);

  useEffect(() => {
    const content = document.querySelector(".hero-renderer-v2 .hero-content") as HTMLElement | null;
    const fadeEl = fadeRef.current;
    if (!content || !fadeEl) return;
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
