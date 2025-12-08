"use client";

import { useEffect, useState } from "react";

import { getHeroLayers } from "@/app/brand";

type HeroLayers = Awaited<ReturnType<typeof getHeroLayers>>;

export default function HeroLuxury() {
  const [layers, setLayers] = useState<HeroLayers | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const data = await getHeroLayers();
      if (mounted) {
        setLayers(data);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event?: MediaQueryListEvent) => {
      setPrefersReducedMotion(event ? event.matches : mediaQuery.matches);
    };

    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }

    return undefined;
  }, []);

  const showParticles = Boolean(
    layers && !prefersReducedMotion && layers.particles.length > 0,
  );

  return (
    <section
      className="champagne-surface relative overflow-hidden"
      aria-label="St Mary’s House Dental – Quiet Luxury Hero"
    >
      <div className="relative isolate">
        {layers && (
          <>
            <img
              src={layers.waveBg}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
              style={{
                maskImage: `url(${layers.waveMask})`,
                WebkitMaskImage: `url(${layers.waveMask})`,
                maskSize: "cover",
                WebkitMaskSize: "cover",
              }}
              aria-hidden
            />

            {showParticles ? (
              <div className="pointer-events-none absolute inset-0">
                <video
                  src={layers.particles[0].src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover opacity-50"
                  style={{ mixBlendMode: "screen" }}
                  aria-hidden
                />
              </div>
            ) : (
              <div className="pointer-events-none absolute inset-0">
                <img
                  src={layers.glassSoft}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-35"
                  aria-hidden
                />
                <img
                  src={layers.filmGrain}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-25"
                  aria-hidden
                />
              </div>
            )}
          </>
        )}

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
          <h1
            className="font-playfair text-5xl leading-tight"
            style={{ color: "var(--ink)" }}
          >
            Quiet luxury, 3D-first dentistry
          </h1>
          <p
            className="mt-4 max-w-xl text-lg"
            style={{ color: "color-mix(in oklab, var(--ink) 80%, white)" }}
          >
            Same-day smiles, precision care, and compassionate expertise.
          </p>
          <div className="mt-8 flex gap-4">
            <a
              className="glass-btn"
              style={{ borderColor: "var(--brand-gold-keyline)" }}
              href="/treatments"
            >
              Explore treatments
            </a>
            <a className="glass-btn" href="/video-consultation">
              Book a video consult
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
