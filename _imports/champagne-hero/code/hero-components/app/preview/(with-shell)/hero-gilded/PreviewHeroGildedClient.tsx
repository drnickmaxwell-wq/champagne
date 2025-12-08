"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  getBrandManifestClient,
  type BrandManifest,
} from "@/lib/brand/manifest";

import LoopCrossfade from "./LoopCrossfade";

type HeroLayers = Pick<BrandManifest, "waves" | "textures" | "particles" | "motion">;

type MotionPosterMap = Record<string, string | undefined>;

type PreviewHeroLayers = HeroLayers & {
  waveMask?: string;
  waveBg?: string;
  motionPosters?: MotionPosterMap;
};

type MotionSource = {
  src: string;
  poster?: string;
};

type MotionEntry =
  | string
  | {
      src?: string | null;
      poster?: string | null;
      duration?: number | string | null;
      durationSec?: number | string | null;
      durationSeconds?: number | string | null;
    };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type MotionDurations = {
  caustics?: number;
  glass?: number;
  particles?: number;
  gold?: number;
  [key: string]: number | undefined;
};

function parseDuration(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const match = /(?<seconds>\d+(?:\.\d+)?)s?/i.exec(value);
    if (match?.groups?.seconds) {
      return Number.parseFloat(match.groups.seconds);
    }
  }

  return undefined;
}

function getMotionDurations(manifest?: HeroLayers["motion"]): MotionDurations {
  if (!manifest) {
    return {};
  }

  const durations: MotionDurations = {};

  for (const [key, value] of Object.entries(manifest as Record<string, MotionEntry | undefined>)) {
    if (!value) {
      continue;
    }

    if (typeof value === "string") {
      const match = /duration-(\d+(?:\.\d+)?)s/i.exec(value);
      if (match) {
        durations[key] = Number.parseFloat(match[1]);
      }
      continue;
    }

    const duration =
      parseDuration(value.duration) ??
      parseDuration(value.durationSec) ??
      parseDuration(value.durationSeconds);

    if (typeof duration === "number") {
      durations[key] = duration;
    }
  }

  return durations;
}

function getMotionSrc(
  motion: PreviewHeroLayers["motion"],
  keys: string[],
  fallback: string,
): string {
  if (!motion) {
    return fallback;
  }

  const motionRecord = motion as Record<string, MotionEntry | undefined>;

  for (const key of keys) {
    const entry = motionRecord[key];
    if (!entry) {
      continue;
    }

    if (typeof entry === "string" && entry.trim().length > 0) {
      return entry;
    }

    if (typeof entry === "object" && typeof entry.src === "string" && entry.src.trim().length > 0) {
      return entry.src;
    }
  }

  return fallback;
}

function pickPoster(posters: MotionPosterMap | undefined, keys: string[]): string | undefined {
  if (!posters) {
    return undefined;
  }

  for (const key of keys) {
    const poster = posters[key];
    if (typeof poster === "string" && poster.length > 0) {
      return poster;
    }
  }

  return undefined;
}

function formatHudDuration(seconds?: number): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    return "t=?s";
  }

  return `t=${seconds.toFixed(2)}s`;
}

export default function PreviewHeroGildedClient() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [layers, setLayers] = useState<PreviewHeroLayers | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [durations, setDurations] = useState<MotionDurations>({});

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const manifest = await getBrandManifestClient();

        const verify = async (url?: string | null) => {
          if (!url) return null;

          try {
            const res = await fetch(url, { method: "HEAD" });
            return res.ok ? url : null;
          } catch {
            return null;
          }
        };

        const verifiedWavesMask =
          (await verify(manifest.waves?.mask)) ??
          "/assets/champagne/waves/wave-mask-desktop.webp";
        const verifiedWavesBackground =
          (await verify(manifest.waves?.background)) ??
          "/assets/champagne/waves/wave-bg.webp";
        const verifiedFilmGrain =
          (await verify(manifest.textures?.filmGrain)) ??
          "/assets/champagne/textures/home-hero-film-grain.webp";
        const verifiedSoftParticles =
          (await verify(manifest.particles?.soft)) ??
          "/assets/champagne/particles/home-hero-particles.webp";

        const motionPosters = (manifest as BrandManifest & {
          motionPosters?: Record<string, string | null | undefined>;
        }).motionPosters;

        let verifiedMotionPosters: MotionPosterMap | undefined;

        if (motionPosters) {
          const entries = await Promise.all(
            Object.entries(motionPosters).map(async ([key, url]) => {
              const verified = await verify(url ?? undefined);
              return [key, verified] as const;
            }),
          );

          verifiedMotionPosters = entries.reduce<MotionPosterMap>((acc, [key, url]) => {
            if (typeof url === "string") {
              acc[key] = url;
            }

            return acc;
          }, {});

          if (verifiedMotionPosters && Object.keys(verifiedMotionPosters).length === 0) {
            verifiedMotionPosters = undefined;
          }
        }

        const verifiedLayers: PreviewHeroLayers = {
          waves: {
            ...manifest.waves,
            mask: verifiedWavesMask,
            background: verifiedWavesBackground,
          },
          textures: {
            ...manifest.textures,
            filmGrain: verifiedFilmGrain,
          },
          particles: manifest.particles
            ? {
                ...manifest.particles,
                soft: verifiedSoftParticles,
              }
            : {
                soft: verifiedSoftParticles,
              },
          motion: manifest.motion,
          waveMask: verifiedWavesMask,
          waveBg: verifiedWavesBackground,
          motionPosters: verifiedMotionPosters,
        };

        if (isMounted) {
          setLayers(verifiedLayers);
          setDurations(getMotionDurations(manifest.motion));
          console.log("[preview-hero-gilded] verified layers", verifiedLayers);
        }
      } catch {
        if (isMounted) {
          const fallbackLayers: PreviewHeroLayers = {
            waves: {
              mask: "/assets/champagne/waves/wave-mask-desktop.webp",
              background: "/assets/champagne/waves/wave-bg.webp",
            },
            textures: {
              filmGrain: "/assets/champagne/textures/home-hero-film-grain.webp",
            },
            particles: {
              soft: "/assets/champagne/particles/home-hero-particles.webp",
            },
            motion: undefined,
            waveMask: "/assets/champagne/waves/wave-mask-desktop.webp",
            waveBg: "/assets/champagne/waves/wave-bg.webp",
          };

          setLayers(fallbackLayers);
          setDurations({});
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(mediaQuery.matches);

    updateMotionPreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMotionPreference);

      return () => {
        mediaQuery.removeEventListener("change", updateMotionPreference);
      };
    }

    mediaQuery.addListener(updateMotionPreference);

    return () => {
      mediaQuery.removeListener(updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".champagne-hero");
    if (!root) {
      return;
    }

    const onScroll = () => {
      const y = window.scrollY;
      const fade = Math.min(1, y / 300);
      root.style.setProperty("--scroll-fade", fade.toFixed(2));
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      root.style.removeProperty("--scroll-fade");
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      const node = heroRef.current;
      node?.style.removeProperty("--parallax-1");
      node?.style.removeProperty("--parallax-2");
      return;
    }

    const node = heroRef.current;
    if (!node || typeof window === "undefined") {
      return;
    }

    let rafId = 0;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const centerDelta = rect.top + rect.height / 2 - viewportHeight / 2;
      const normalized = clamp(centerDelta / viewportHeight, -1, 1);
      const parallaxPrimary = Math.round(normalized * -6);
      const parallaxSecondary = Math.round(normalized * -4);

      node.style.setProperty("--parallax-1", String(parallaxPrimary));
      node.style.setProperty("--parallax-2", String(parallaxSecondary));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(update);
    };

    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduceMotion]);

  const particleSources = useMemo<MotionSource[]>(() => {
    const soft = layers?.particles?.soft;
    if (!soft || !soft.endsWith(".webm")) {
      return [];
    }

    return [{ src: soft, poster: layers?.particles?.poster }];
  }, [layers]);

  const waveMaskUrl =
    layers?.waveMask ?? "/assets/champagne/waves/wave-mask-desktop.webp";
  const waveBgUrl = layers?.waveBg ?? "/assets/champagne/waves/wave-bg.webp";

  const causticsSrc = getMotionSrc(layers?.motion, ["caustics", "waveCaustics"], "/assets/champagne/motion/wave-caustics.webm");
  const glassSrc = getMotionSrc(layers?.motion, ["glass", "glassShimmer"], "/assets/champagne/motion/glass-shimmer.webm");
  const particlesSrc = getMotionSrc(
    layers?.motion,
    ["particles", "particlesDrift"],
    "/assets/champagne/motion/particles-drift.webm",
  );
  const goldSrc = getMotionSrc(
    layers?.motion,
    ["gold", "goldDust"],
    "/assets/champagne/particles/gold-dust-drift.webm",
  );

  const causticsPoster = pickPoster(layers?.motionPosters, ["caustics", "waveCaustics"]);
  const glassPoster = pickPoster(layers?.motionPosters, ["glass", "glassShimmer"]);
  const particlesPoster = pickPoster(layers?.motionPosters, ["particles", "particlesDrift"]);
  const goldPoster = pickPoster(layers?.motionPosters, ["gold", "goldDust"]);

  const causticsDuration = durations.caustics ?? 8;
  const glassDuration = durations.glass ?? 8;
  const particlesDuration = durations.particles ?? 8;
  const goldDuration = durations.gold ?? 8;

  const showDevHud = process.env.NODE_ENV !== "production";

  return (
    <section
      ref={heroRef}
      className="champagne-hero champagne-hero--gilded preview-hero-gilded"
      aria-labelledby="hero-gilded-title"
      data-smoothing="preview"
    >
      <div className="hero-gradient-base gradient-base" />

      <div
        className="hero-wave-mask parallax-1"
        style={{
          backgroundImage: `url(${waveBgUrl}), url(${waveMaskUrl})`,
        }}
      />

      {!reduceMotion && (
        <>
          <div className="loop-pair hero-motion hero-wave-caustics parallax-1">
            <LoopCrossfade
              src={causticsSrc}
              poster={causticsPoster}
              durationSec={causticsDuration}
              crossfadeMs={220}
            />
          </div>

          <div className="loop-pair hero-motion hero-glass-shimmer">
            <LoopCrossfade
              src={glassSrc}
              poster={glassPoster}
              durationSec={glassDuration}
              crossfadeMs={220}
            />
          </div>

          <div className="loop-pair hero-motion hero-particles-drift">
            <LoopCrossfade
              src={particlesSrc}
              poster={particlesPoster}
              durationSec={particlesDuration}
              crossfadeMs={220}
            />
          </div>

          <div className="loop-pair hero-motion hero-gold-dust-drift lux-gold parallax-2">
            <LoopCrossfade
              src={goldSrc}
              poster={goldPoster}
              durationSec={goldDuration}
              crossfadeMs={220}
            />
          </div>

          <div
            className="hero-gold-dust-drift hero-gold-dust-drift--alt lux-gold"
            aria-hidden="true"
          />

          {particleSources.map(({ src, poster }) => (
            <div className="loop-pair hero-particles-drift hero-motion" key={src}>
              <LoopCrossfade src={src} poster={poster} durationSec={8} crossfadeMs={220} />
            </div>
          ))}
        </>
      )}

      <div className="hero-particles-static" />

      <div
        className="hero-film-grain"
        style={{
          backgroundImage: layers?.textures?.filmGrain
            ? `url(${layers.textures.filmGrain})`
            : undefined,
        }}
      />

      <div className="hero-caustic-reflection" aria-hidden="true" />

      {showDevHud && (
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            opacity: 0.35,
            fontFamily: "monospace",
            fontSize: "0.75rem",
            lineHeight: 1.25,
            textAlign: "right",
            pointerEvents: "none",
            color: "var(--champagne-hero-text, #fff)",
          }}
        >
          <div>caustics {formatHudDuration(causticsDuration)}</div>
          <div>glass {formatHudDuration(glassDuration)}</div>
          <div>particles {formatHudDuration(particlesDuration)}</div>
          <div>gold {formatHudDuration(goldDuration)}</div>
        </div>
      )}

      <div className="hero-content">
        <div className="hero-content-wrapper">
          <h1 id="hero-gilded-title">Gilded Light, Calm Precision</h1>
          <p>
            Preview the Champagne experience in a dedicated sandbox. Refined motion,
            balanced shimmer, and the Manus signature glow.
          </p>
          <div className="hero-cta-group">
            <a href="/contact" className="hero-cta-primary">
              Request a private consult
            </a>
            <a href="/treatments" className="hero-cta-secondary">
              Explore bespoke treatments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
