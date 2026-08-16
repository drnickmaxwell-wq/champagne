"use client";

import { useEffect, type RefObject } from "react";
import { CHAMPAGNE_SACRED_V2_MOTION_SCORE } from "@champagne/hero";

type Props = { rootRef: RefObject<HTMLDivElement | null>; enabled: boolean; forceFallback: boolean };

export function HeroV3MotionScoreController({ rootRef, enabled, forceFallback }: Props) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const boundVideos = new Set<HTMLVideoElement>();
    const getVideos = () => Array.from(root.querySelectorAll<HTMLVideoElement>('video[data-surface-id^="sacred.motion."]'));
    const setState = (state: "pending" | "baseline" | "active" | "static-fallback") => { root.dataset.h3MotionHealth = state; };
    const restoreBaseline = (videos: HTMLVideoElement[]) => videos.forEach((video) => {
      video.style.removeProperty("--h3-score-opacity");
      video.style.removeProperty("--h3-score-phase");
      video.style.removeProperty("mix-blend-mode");
      video.playbackRate = 1;
    });
    const settle = () => {
      const videos = getVideos();
      videos.forEach((video) => {
        if (boundVideos.has(video)) return;
        video.addEventListener("error", settle);
        boundVideos.add(video);
      });
      if (!enabled) {
        restoreBaseline(videos);
        setState("baseline");
        return;
      }
      if (forceFallback || media.matches) {
        videos.forEach((video) => video.pause());
        setState("static-fallback");
        return;
      }
      if (videos.length !== CHAMPAGNE_SACRED_V2_MOTION_SCORE.layers.length) {
        setState("pending");
        return;
      }
      if (videos.some((video) => video.error)) {
        videos.forEach((video) => video.pause());
        setState("static-fallback");
        return;
      }
      CHAMPAGNE_SACRED_V2_MOTION_SCORE.layers.forEach((layer) => {
        const video = videos.find((entry) => entry.dataset.surfaceId === layer.id);
        if (!video) return;
        video.style.setProperty("--h3-score-opacity", String(layer.opacity));
        video.style.setProperty("--h3-score-phase", `${-layer.phaseSeconds}s`);
        video.style.mixBlendMode = layer.blend;
        video.playbackRate = 1;
      });
      void Promise.all(videos.map((video) => video.play())).then(() => setState("active")).catch(() => setState("static-fallback"));
    };
    const observer = new MutationObserver(settle);
    observer.observe(root, { childList: true, subtree: true });
    media.addEventListener?.("change", settle);
    settle();
    return () => {
      observer.disconnect();
      restoreBaseline(getVideos());
      boundVideos.forEach((video) => video.removeEventListener("error", settle));
      media.removeEventListener?.("change", settle);
    };
  }, [enabled, forceFallback, rootRef]);
  return null;
}
