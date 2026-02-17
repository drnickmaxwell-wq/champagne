"use client";

import { useEffect } from "react";

export function BloomDriver() {
  useEffect(() => {
    const caustics = document.querySelector<HTMLVideoElement>(
      '[data-surface-id="sacred.motion.waveCaustics"]',
    );
    const bloom = document.querySelector<HTMLElement>(
      '[data-surface-id="overlay.sacredBloom"]',
    );

    if (!caustics || !bloom) return;

    const baseOpacityRaw = Number.parseFloat(
      bloom.dataset.bloomBaseOpacity ?? "0.18",
    );
    const baseOpacity = Number.isFinite(baseOpacityRaw) ? baseOpacityRaw : 0.18;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heroRoot =
      bloom.closest<HTMLElement>('[data-hero-engine="v2"]') ??
      bloom.closest<HTMLElement>('.hero-renderer-v2[data-hero-root="true"]') ??
      document.querySelector<HTMLElement>('.hero-renderer-v2[data-hero-root="true"]') ??
      document.querySelector<HTMLElement>('[data-hero-engine="v2"]');

    if (reduceMotion) {
      bloom.style.opacity = baseOpacity.toFixed(3);
      return;
    }

    let rafId = 0;
    const tick = () => {
      const drive = 0.5 + 0.5 * Math.sin(caustics.currentTime * 0.8);
      const unclampedOpacity = baseOpacity * (0.70 + drive * 0.85);
      const minOpacity = baseOpacity * 0.70;
      const maxOpacity = baseOpacity * 1.55;
      const targetOpacity = Math.min(maxOpacity, Math.max(minOpacity, unclampedOpacity));
      const driveText = drive.toFixed(3);
      bloom.style.opacity = targetOpacity.toFixed(3);
      if (heroRoot) {
        heroRoot.style.setProperty("--bloom-drive", driveText);
        heroRoot.setAttribute("data-bloom-drive", driveText);
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
