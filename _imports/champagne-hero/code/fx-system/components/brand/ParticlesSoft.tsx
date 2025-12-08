"use client";

import React, { useMemo } from "react";

const PARTICLE_COUNT = 24;
const PARTICLE_MIN_SIZE = 14;
const PARTICLE_MAX_SIZE = 34;
const PARTICLE_MIN_OPACITY = 0.05;
const PARTICLE_MAX_OPACITY = 0.12;

function createRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

type Particle = {
  top: number;
  left: number;
  size: number;
  opacity: number;
  delay: number;
};

type ParticlesSoftProps = {
  strength?: number;
};

export default function ParticlesSoft({ strength = 1 }: ParticlesSoftProps) {
  const particles = useMemo<Particle[]>(() => {
    const rand = createRandom(1203);
    return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
      const left = rand() * 100;
      const top = rand() * 100;
      const size = PARTICLE_MIN_SIZE + rand() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE);
      const opacity = PARTICLE_MIN_OPACITY + rand() * (PARTICLE_MAX_OPACITY - PARTICLE_MIN_OPACITY);
      const delay = rand() * 12;
      return { top, left, size, opacity, delay };
    });
  }, []);

  return (
    <div className="brand-hero-particles" aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          key={`particle-${index}`}
          className="brand-hero-particle"
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: Math.min(0.24, particle.opacity * strength),
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
