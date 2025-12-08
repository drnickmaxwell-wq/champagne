'use client';

import React, { useEffect, useRef } from 'react';

interface CoastalWavesProps {
  className?: string;
}

export default function CoastalWaves({ className }: CoastalWavesProps) {
  const ref = useRef<HTMLDivElement>(null);

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
      // no-op: default limit keeps animations subtle without CSS vars
    }

    const tick = () => {
      frame += 1;
      const offset = Math.max(Math.min(Math.sin(frame / 120) * 4, parallaxLimit), -parallaxLimit);
      node.style.setProperty('--smh-wave-offset', `${offset}px`);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const baseClass = 'smh-anim relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--smh-gradient)]/5';

  return (
    <div
      ref={ref}
      aria-hidden
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--smh-gradient)]/40 via-transparent to-[var(--smh-gradient)]/40 opacity-75" />
      <div className="pointer-events-none absolute inset-0" style={{ transform: 'translateY(var(--smh-wave-offset, 0px))' }}>
        <div className="absolute inset-x-0 top-1/2 h-[40%] -translate-y-1/2 rounded-full bg-[var(--smh-gradient)]/30 blur-3xl" />
      </div>
    </div>
  );
}
