"use client";

import type { CSSProperties, ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

type HeroAsset = {
  desktop: string;
  mobile?: string;
};

type ParticleField = {
  static?: string;
  drift?: string;
  opacity?: {
    static?: number;
    drift?: number;
  };
};

type MotionAsset = {
  src: string;
  opacity?: number;
};

export type ChampagneHeroVariant = "home" | "whitening";

type HeroVariantConfig = {
  gradientToken: string;
  waveMaskId: keyof typeof HERO_WAVES;
  particleFieldId: keyof typeof HERO_PARTICLES;
  causticsId?: keyof typeof HERO_CAUSTICS;
  dustId?: keyof typeof HERO_DUST;
  brightnessScale?: number;
  contrastScale?: number;
  vignetteStrength?: number;
  grainOpacity?: number;
};

const HERO_WAVES: Record<string, HeroAsset> = {
  "wave-primary": {
    desktop: "/assets/champagne/waves/wave-mask-desktop.webp",
    mobile: "/assets/champagne/waves/wave-mask-mobile.webp",
  },
};

const HERO_PARTICLES: Record<string, ParticleField> = {
  "particles-soft-rain": {
    static: "/assets/champagne/particles/home-hero-particles.webp",
    drift: "/assets/champagne/motion/particles-drift.webm",
    opacity: {
      static: 0.08,
      drift: 0.06,
    },
  },
  "particles-whitening-sparkle": {
    static: "/assets/champagne/particles/home-hero-particles.webp",
    drift: "/assets/champagne/motion/particles-drift.webm",
    opacity: {
      static: 0.07,
      drift: 0.08,
    },
  },
};

const HERO_CAUSTICS: Record<string, MotionAsset> = {
  "caustics-hero-water-v1": {
    src: "/assets/champagne/motion/wave-caustics.webm",
    opacity: 0.1,
  },
  "caustics-whitening-v1": {
    src: "/assets/champagne/motion/wave-caustics.webm",
    opacity: 0.16,
  },
};

const HERO_DUST: Record<string, MotionAsset> = {
  "dust-soft": {
    src: "/assets/champagne/particles/gold-dust-drift.webm",
    opacity: 0.08,
  },
  "dust-whitening-soft": {
    src: "/assets/champagne/particles/gold-dust-drift.webm",
    opacity: 0.06,
  },
};

const HERO_VARIANTS: Record<ChampagneHeroVariant, HeroVariantConfig> = {
  home: {
    gradientToken: "--smh-gradient",
    waveMaskId: "wave-primary",
    particleFieldId: "particles-soft-rain",
    causticsId: "caustics-hero-water-v1",
    dustId: "dust-soft",
    brightnessScale: 1,
    contrastScale: 1,
    vignetteStrength: 1,
  },
  whitening: {
    gradientToken: "--smh-gradient",
    waveMaskId: "wave-primary",
    particleFieldId: "particles-whitening-sparkle",
    causticsId: "caustics-whitening-v1",
    dustId: "dust-whitening-soft",
    brightnessScale: 1.08,
    contrastScale: 1.02,
    vignetteStrength: 0.9,
    grainOpacity: 0.06,
  },
};

type ChampagneHeroFrameProps = {
  variant?: ChampagneHeroVariant;
  titleId?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  describedById?: string;
};

const FILM_GRAIN_TEXTURE = "/assets/champagne/textures/home-hero-film-grain.webp";

export function ChampagneHeroFrame({
  variant = "home",
  titleId,
  children,
  className,
  contentClassName,
  describedById,
}: ChampagneHeroFrameProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const config = HERO_VARIANTS[variant] ?? HERO_VARIANTS.home;
  const waveMask = HERO_WAVES[config.waveMaskId] ?? HERO_WAVES["wave-primary"];
  const particles = HERO_PARTICLES[config.particleFieldId] ?? HERO_PARTICLES["particles-soft-rain"];
  const caustics = config.causticsId ? HERO_CAUSTICS[config.causticsId] ?? HERO_CAUSTICS["caustics-hero-water-v1"] : undefined;
  const dust = config.dustId ? HERO_DUST[config.dustId] ?? HERO_DUST["dust-soft"] : undefined;

  const styleVars: CSSProperties = {
    ["--champagne-hero-gradient" as string]: `var(${config.gradientToken})`,
    ["--champagne-hero-wave-mask-desktop" as string]: `url('${waveMask.desktop}')`,
    ["--champagne-hero-wave-mask-mobile" as string]: `url('${waveMask.mobile ?? waveMask.desktop}')`,
    ["--champagne-hero-particles-static" as string]: particles.static
      ? `url('${particles.static}')`
      : undefined,
    ["--champagne-hero-film-grain" as string]: `url('${FILM_GRAIN_TEXTURE}')`,
    ["--champagne-hero-brightness" as string]: String(config.brightnessScale ?? 1),
    ["--champagne-hero-contrast" as string]: String(config.contrastScale ?? 1),
    ["--champagne-hero-vignette" as string]: String(config.vignetteStrength ?? 1),
    ["--champagne-hero-caustics-opacity" as string]: caustics?.opacity ?? HERO_CAUSTICS["caustics-hero-water-v1"].opacity,
    ["--champagne-hero-glass-opacity" as string]: 0.12,
    ["--champagne-hero-particles-drift-opacity" as string]: particles.opacity?.drift ?? 0.06,
    ["--champagne-hero-dust-opacity" as string]: dust?.opacity ?? HERO_DUST["dust-soft"].opacity,
    ["--champagne-hero-static-particles-opacity" as string]: particles.opacity?.static ?? 0.08,
    ["--champagne-hero-grain-opacity" as string]: config.grainOpacity ?? 0.07,
  };

  const rootClass = ["champagne-hero", className].filter(Boolean).join(" ");
  const contentClass = ["hero-content-wrapper", contentClassName].filter(Boolean).join(" ");

  return (
    <section className={rootClass} aria-describedby={describedById} aria-labelledby={titleId} style={styleVars}>
      <div className="hero-gradient-base" />
      {!prefersReducedMotion && (
        <>
          {caustics ? (
            <div className="hero-wave-caustics">
              <video autoPlay loop muted playsInline preload="auto">
                <source src={caustics.src} type="video/webm" />
              </video>
            </div>
          ) : null}
          <div className="hero-glass-shimmer">
            <video autoPlay loop muted playsInline preload="auto">
              <source
                src="/assets/champagne/motion/glass-shimmer.webm"
                type="video/webm"
              />
            </video>
          </div>
          {particles.drift ? (
            <div className="hero-particles-drift">
              <video autoPlay loop muted playsInline preload="auto">
                <source src={particles.drift} type="video/webm" />
              </video>
            </div>
          ) : null}
          {dust ? (
            <div className="hero-gold-dust-drift">
              <video autoPlay loop muted playsInline preload="auto">
                <source src={dust.src} type="video/webm" />
              </video>
            </div>
          ) : null}
        </>
      )}
      <div className="hero-wave-mask" />
      <div className="hero-particles-static" />
      <div className="hero-film-grain" />
      <div className="hero-content">
        <div className={contentClass}>{children}</div>
      </div>
    </section>
  );
}

export default ChampagneHeroFrame;
