'use client';

import React, { useEffect, useMemo, useRef } from 'react';

interface ParticleSystemProps {
  className?: string;
  density?: number;
}

export default function ParticleSystem({ className, density = 24 }: ParticleSystemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const particles = useMemo(() => Array.from({ length: density }), [density]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let raf: number;
    let parallaxLimit = 12;

    try {
      const computed = getComputedStyle(document.documentElement).getPropertyValue('--smh-parallax-max');
      const numeric = parseFloat(computed);
      if (!Number.isNaN(numeric)) {
        parallaxLimit = numeric;
      }
    } catch (error) {
      // graceful fallback when CSS variables are unavailable
    }

    const tick = () => {
      frame += 1;
      Array.from(node.children).forEach((child, index) => {
        const el = child as HTMLElement;
        const drift = Math.max(
          Math.min(Math.sin((frame + index * 12) / 90) * 6, parallaxLimit),
          -parallaxLimit,
        );
        const rise = Math.max(
          Math.min(Math.sin((frame + index * 6) / 60) * 4, parallaxLimit),
          -parallaxLimit,
        );
        const glow = 0.4 + Math.sin((frame + index * 4) / 120) * 0.3;
        el.style.transform = `translate3d(${drift}px, ${rise}px, 0)`;
        el.style.opacity = glow.toFixed(2);
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const baseClass = 'smh-anim pointer-events-none relative';

  return (
    <div ref={ref} aria-hidden className={[baseClass, className].filter(Boolean).join(' ')}>
      {particles.map((_, index) => (
        <span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-[var(--smh-gold)]/70 shadow-[0_0_12px_var(--smh-gold)]"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 53) % 100}%`,
            transform: 'translate3d(0, 0, 0)',
          }}
        />
      ))}
    </div>
  );
}
