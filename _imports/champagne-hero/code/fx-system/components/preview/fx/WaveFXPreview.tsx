'use client';

import React from 'react';

import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

export default function WaveFXPreview() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div aria-hidden className="cpv-wavefx">
      {!prefersReducedMotion ? (
        <>
          <div className="cpv-wavefx__layer cpv-wavefx__wave-caustics">
            <video autoPlay loop muted playsInline preload="auto">
              <source
                src="/assets/champagne/motion/wave-caustics.webm"
                type="video/webm"
              />
            </video>
          </div>
          <div className="cpv-wavefx__layer cpv-wavefx__glass-shimmer">
            <video autoPlay loop muted playsInline preload="auto">
              <source
                src="/assets/champagne/motion/glass-shimmer.webm"
                type="video/webm"
              />
            </video>
          </div>
          <div className="cpv-wavefx__layer cpv-wavefx__particles-drift">
            <video autoPlay loop muted playsInline preload="auto">
              <source
                src="/assets/champagne/motion/particles-drift.webm"
                type="video/webm"
              />
            </video>
          </div>
          <div className="cpv-wavefx__layer cpv-wavefx__gold-dust">
            <video autoPlay loop muted playsInline preload="auto">
              <source
                src="/assets/champagne/particles/gold-dust-drift.webm"
                type="video/webm"
              />
            </video>
          </div>
        </>
      ) : null}
      <div className="cpv-wavefx__layer cpv-wavefx__wave-mask" />
      <div className="cpv-wavefx__layer cpv-wavefx__particles-static" />
      <div className="cpv-wavefx__layer cpv-wavefx__grain" />
    </div>
  );
}
