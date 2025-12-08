"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";

import {
  getBrandManifestClient,
  type BrandManifest,
} from "@/lib/brand/manifest";

type HeroLayers = Pick<BrandManifest, "waves" | "textures" | "particles" | "motion">;

type PreviewHeroLayers = HeroLayers & {
  waveMask?: string;
  waveBg?: string;
};

type MotionSource = {
  src: string;
  poster?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type CrossFadeLoopProps = {
  src: string;
  className: string;
  zIndexClass?: string;
};

function CrossFadeLoop({ src, className, zIndexClass }: CrossFadeLoopProps) {
  const containerClassName = [
    "loop-pair",
    "hero-motion",
    className,
    zIndexClass,
  ]
    .filter(Boolean)
    .join(" ");
  const baseVideoRef = useRef<HTMLVideoElement | null>(null);
  const staggeredVideoRef = useRef<HTMLVideoElement | null>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTopActive, setIsTopActive] = useState(false);

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
    if (!prefersReducedMotion) {
      return;
    }

    setIsTopActive(false);

    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    if (startTimeoutRef.current) {
      window.clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const base = baseVideoRef.current;
    const staggered = staggeredVideoRef.current;

    base?.pause();
    staggered?.pause();

    if (base) {
      base.currentTime = 0;
    }

    if (staggered) {
      staggered.currentTime = 0;
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    if (startTimeoutRef.current) {
      window.clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setDuration(null);
    setIsTopActive(false);

    const base = baseVideoRef.current;
    const staggered = staggeredVideoRef.current;

    base?.pause();
    staggered?.pause();

    if (base) {
      try {
        base.currentTime = 0;
      } catch {
        // Ignore seek errors while metadata is refreshed.
      }
    }

    if (staggered) {
      try {
        staggered.currentTime = 0;
      } catch {
        // Ignore seek errors while metadata is refreshed.
      }
    }
  }, [prefersReducedMotion, src]);

  useEffect(() => {
    if (prefersReducedMotion || !duration) {
      return;
    }

    const intervalMs = Math.max((duration - 0.25) * 1000, 250);

    startTimeoutRef.current = window.setTimeout(() => {
      setIsTopActive((prev) => !prev);

      intervalRef.current = window.setInterval(() => {
        setIsTopActive((prev) => !prev);
      }, intervalMs);
    }, intervalMs);

    return () => {
      if (startTimeoutRef.current) {
        window.clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [duration, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const activeVideo = isTopActive
      ? staggeredVideoRef.current
      : baseVideoRef.current;
    const inactiveVideo = isTopActive
      ? baseVideoRef.current
      : staggeredVideoRef.current;

    if (activeVideo) {
      try {
        activeVideo.currentTime = 0;
      } catch {
        // Safari may throw during seeks when metadata is not ready; ignore.
      }

      const playPromise = activeVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    }

    if (inactiveVideo) {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }

      resetTimeoutRef.current = window.setTimeout(() => {
        inactiveVideo.pause();
        try {
          inactiveVideo.currentTime = 0;
        } catch {
          // Ignore seek errors on partially loaded media.
        }
      }, 280);
    }

    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, [isTopActive, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const base = baseVideoRef.current;
    if (!base) {
      return;
    }

    const playPromise = base.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [prefersReducedMotion, src]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }

      if (startTimeoutRef.current) {
        window.clearTimeout(startTimeoutRef.current);
      }

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleMetadata = (event: SyntheticEvent<HTMLVideoElement, Event>) => {
    if (prefersReducedMotion) {
      return;
    }

    const video = event.currentTarget;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }
  };

  if (prefersReducedMotion) {
    return (
      <div className={containerClassName}>
        <video
          className="loop-top is-active"
          muted
          playsInline
          loop
          preload="metadata"
        >
          <source src={src} type="video/webm" />
        </video>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <video
        ref={baseVideoRef}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        onLoadedMetadata={handleMetadata}
      >
        <source src={src} type="video/webm" />
      </video>
      <video
        ref={staggeredVideoRef}
        className={`loop-top${isTopActive ? " is-active" : ""}`}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        onLoadedMetadata={handleMetadata}
      >
        <source src={src} type="video/webm" />
      </video>
    </div>
  );
}

export default function PreviewHeroGilded() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [layers, setLayers] = useState<PreviewHeroLayers | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

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
        };

        if (isMounted) {
          setLayers(verifiedLayers);
          console.log("[preview-hero-gilded] verified layers", verifiedLayers);
        }
      } catch {
        if (isMounted) {
          setLayers({
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
          } as PreviewHeroLayers);
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

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const node = heroRef.current;
      if (!node) {
        return;
      }

      const { smoothLoop } = await import("@/scripts/hero-smooth-loop.mjs");
      if (cancelled) {
        return;
      }

      node
        .querySelectorAll<HTMLVideoElement>(".hero-motion video")
        .forEach((video) => {
          if (
            video.parentElement?.querySelector(":scope > video.fade-clone")
          ) {
            return;
          }

          smoothLoop(video);
        });
    })();

    return () => {
      cancelled = true;
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
          <CrossFadeLoop
            className="hero-wave-caustics"
            zIndexClass="parallax-1"
            src="/assets/champagne/motion/wave-caustics.webm"
          />

          <CrossFadeLoop
            className="hero-glass-shimmer"
            src="/assets/champagne/motion/glass-shimmer.webm"
          />

          <div className="lux-gold-tint" aria-hidden="true" />

          <CrossFadeLoop
            className="hero-particles-drift"
            src="/assets/champagne/motion/particles-drift.webm"
          />

          <CrossFadeLoop
            className="hero-gold-dust-drift lux-gold"
            zIndexClass="parallax-2"
            src="/assets/champagne/particles/gold-dust-drift.webm"
          />

          <div
            className="hero-gold-dust-drift hero-gold-dust-drift--alt lux-gold"
            aria-hidden="true"
          />

          {particleSources.map(({ src, poster }) => (
            <div className="hero-particles-drift hero-motion" key={src}>
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={poster}
              >
                <source src={src} type="video/webm" />
              </video>
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
