// components/brand/BrandHeroGradient.tsx
"use client";

import React, { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import { useParallax } from "./hooks/useParallax";
import "@/app/globals/hero-polish.css";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type ParticlePalette = "gold" | "teal" | "magenta" | "none";

type ParticleDensity = "low" | "med" | "high";

export type BrandHeroGradientProps = PropsWithChildren<{
  /** Overall opacity + saturation of the gradient wash */
  intensity?: "soft" | "standard" | "bold";
  /** Opacity of wave mask layer (0–1) */
  waveOpacity?: number;
  /** Density of particle overlay */
  goldDensity?: ParticleDensity;
  /** Optional clip mask */
  clip?: "none" | "wave-top" | "wave-bottom";
  /** Particle palette */
  particles?: ParticlePalette;
  /** Enable champagne drift motion */
  driftEnabled?: boolean;
  /** Draw optional gold rim */
  goldRimEnabled?: boolean;
  /** Grain opacity override */
  grainOpacity?: number;
}>;

const particleDensityAttr: Record<ParticleDensity, ParticleDensity> = {
  low: "low",
  med: "med",
  high: "high",
};

function MotionDiv({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduce.matches) {
      element.dataset.ready = "true";
      element.style.opacity = "1";
      element.style.transform = "translate3d(0,0,0)";
      return;
    }

    let start: number | null = null;
    let frame: number;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / 600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.style.opacity = eased.toString();
      element.style.transform = `translate3d(0, ${(1 - eased) * 18}px, 0)`;
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        element.dataset.ready = "true";
      }
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="brand-hero-motion" data-ready="false">
      {children}
    </div>
  );
}

export default function BrandHeroGradient({
  intensity = "standard",
  waveOpacity = 0.2,
  goldDensity = "low",
  clip = "none",
  particles = "gold",
  driftEnabled = true,
  goldRimEnabled = false,
  grainOpacity = 0.14,
  children,
}: BrandHeroGradientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y, rotateZ } = useParallax(containerRef);

  const clipClass = useMemo(() => {
    if (clip === "wave-top") return "brand-hero-clip-top";
    if (clip === "wave-bottom") return "brand-hero-clip-bottom";
    return "";
  }, [clip]);

  const driftStyle = (driftEnabled
    ? {
        "--hero-drift-x": `${x.toFixed(2)}px`,
        "--hero-drift-y": `${y.toFixed(2)}px`,
        "--hero-drift-rotate": `${rotateZ.toFixed(2)}deg`,
      }
    : {
        "--hero-drift-x": "0px",
        "--hero-drift-y": "0px",
        "--hero-drift-rotate": "0deg",
      }) as CSSProperties;

  const shellStyle = {
    ...driftStyle,
    "--hero-grain-opacity": clamp(grainOpacity, 0, 1),
    "--hero-wave-opacity": clamp(waveOpacity, 0, 1),
  } as CSSProperties;

  const particlesVariant: ParticlePalette = particles ?? "gold";
  const showParticles = particlesVariant !== "none";
  const particleDensity = particleDensityAttr[goldDensity ?? "low"] ?? "low";
  return (
    <div ref={containerRef} className={`brand-hero-shell ${clipClass}`.trim()} style={shellStyle}>
      <div className="brand-hero-layers" aria-hidden="true">
        <span className="hero-layer hero-layer--gradient" data-motion={driftEnabled} data-intensity={intensity} />
        <span className="hero-layer hero-layer--wave champagne-wave-mask" />
        {showParticles ? (
          <span
            className="hero-layer hero-layer--particles particles"
            data-variant={particlesVariant}
            data-density={particleDensity}
          />
        ) : null}
        <span className="hero-layer hero-layer--grain champagne-grain" />
        {goldRimEnabled ? <span className="hero-layer hero-layer--gold-rim" data-glow={driftEnabled} /> : null}
      </div>

      {children ? <MotionDiv>{children}</MotionDiv> : null}
    </div>
  );
}
