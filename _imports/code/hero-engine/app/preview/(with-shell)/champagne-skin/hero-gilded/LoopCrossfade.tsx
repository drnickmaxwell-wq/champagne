"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";

type LoopCrossfadeProps = {
  src: string;
  poster?: string;
  durationSec?: number;
  crossfadeMs?: number;
};

const DEFAULT_DURATION = 8;
const DEFAULT_CROSSFADE_MS = 220;

export default function LoopCrossfade({
  src,
  poster,
  durationSec = DEFAULT_DURATION,
  crossfadeMs = DEFAULT_CROSSFADE_MS,
}: LoopCrossfadeProps) {
  const primaryRef = useRef<HTMLVideoElement | null>(null);
  const secondaryRef = useRef<HTMLVideoElement | null>(null);
  const activeIndexRef = useRef<0 | 1>(0);
  const timeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [effectiveDuration, setEffectiveDuration] = useState(durationSec);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);

      return () => {
        mediaQuery.removeEventListener("change", updatePreference);
      };
    }

    mediaQuery.addListener(updatePreference);

    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  useEffect(() => {
    activeIndexRef.current = 0;
    setEffectiveDuration(durationSec);
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;

    if (primary) {
      try {
        primary.pause();
        primary.currentTime = 0;
        primary.load();
      } catch {
        // Ignore seek/load errors while refreshing sources.
      }

      primary.style.opacity = "1";
    }

    if (secondary) {
      try {
        secondary.pause();
        secondary.currentTime = 0;
        secondary.load();
      } catch {
        // Ignore seek/load errors while refreshing sources.
      }

      secondary.style.opacity = "0";
    }
  }, [durationSec, src]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const clearTimers = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const stopVideo = (video: HTMLVideoElement | null) => {
      if (!video) {
        return;
      }

      try {
        video.pause();
      } catch {
        // Ignore pause errors for partially loaded media.
      }

      try {
        video.currentTime = 0;
      } catch {
        // Ignore seek errors when metadata is not ready.
      }
    };

    const startVideo = (video: HTMLVideoElement | null) => {
      if (!video) {
        return;
      }

      try {
        video.currentTime = 0;
      } catch {
        // Ignore seek errors when metadata is not ready.
      }

      const playPromise = video.play();
      if (typeof playPromise?.catch === "function") {
        playPromise.catch(() => {});
      }
    };

    const scheduleNext = () => {
      if (prefersReducedMotion) {
        return;
      }

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      const overlapSeconds = crossfadeMs / 1000;
      const delayMs = Math.max(0, (effectiveDuration - overlapSeconds) * 1000);

      timeoutRef.current = window.setTimeout(() => {
        const currentIndex = activeIndexRef.current;
        const nextIndex = currentIndex === 0 ? 1 : 0;
        const currentVideo =
          currentIndex === 0 ? primaryRef.current : secondaryRef.current;
        const nextVideo = nextIndex === 0 ? primaryRef.current : secondaryRef.current;

        if (!currentVideo || !nextVideo) {
          scheduleNext();
          return;
        }

        try {
          nextVideo.currentTime = 0;
        } catch {
          // Ignore seek errors while preparing the incoming loop.
        }

        const playPromise = nextVideo.play();
        if (typeof playPromise?.catch === "function") {
          playPromise.catch(() => {});
        }

        const startTime = performance.now();

        if (rafRef.current) {
          window.cancelAnimationFrame(rafRef.current);
        }

        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = crossfadeMs > 0 ? Math.min(1, elapsed / crossfadeMs) : 1;
          const eased = progress;

          currentVideo.style.opacity = `${1 - eased}`;
          nextVideo.style.opacity = `${eased}`;

          if (progress < 1) {
            rafRef.current = window.requestAnimationFrame(step);
            return;
          }

          currentVideo.style.opacity = "0";
          nextVideo.style.opacity = "1";

          stopVideo(currentVideo);
          activeIndexRef.current = nextIndex;
          scheduleNext();
        };

        rafRef.current = window.requestAnimationFrame(step);
      }, delayMs);
    };

    const primary = primaryRef.current;
    const secondary = secondaryRef.current;

    if (prefersReducedMotion) {
      clearTimers();
      stopVideo(primary);
      stopVideo(secondary);

      if (primary) {
        primary.style.opacity = "1";
      }

      if (secondary) {
        secondary.style.opacity = "0";
      }

      return clearTimers;
    }

    if (secondary) {
      secondary.style.opacity = "0";
    }

    if (primary) {
      primary.style.opacity = "1";
      startVideo(primary);
    }

    scheduleNext();

    return () => {
      clearTimers();
      stopVideo(primaryRef.current);
      stopVideo(secondaryRef.current);
    };
  }, [crossfadeMs, effectiveDuration, prefersReducedMotion, src]);

  const handleMetadata = (event: SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = event.currentTarget;
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    setEffectiveDuration((prev) => {
      if (Math.abs(prev - video.duration) < 0.05) {
        return prev;
      }

      return video.duration;
    });
  };

  return (
    <>
      <video
        ref={primaryRef}
        autoPlay={!prefersReducedMotion}
        muted
        playsInline
        preload={prefersReducedMotion ? "metadata" : "auto"}
        poster={poster}
        onLoadedMetadata={handleMetadata}
        style={{
          opacity: 1,
          transition: "none",
        }}
      >
        <source src={src} type="video/webm" />
      </video>
      <video
        ref={secondaryRef}
        autoPlay={!prefersReducedMotion}
        muted
        playsInline
        preload={prefersReducedMotion ? "metadata" : "auto"}
        poster={poster}
        onLoadedMetadata={handleMetadata}
        style={{
          opacity: 0,
          transition: "none",
        }}
      >
        <source src={src} type="video/webm" />
      </video>
    </>
  );
}
