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

    if (reduceMotion) {
      bloom.style.opacity = baseOpacity.toFixed(3);
      return;
    }

    let rafId = 0;
    const tick = () => {
      const drive = 0.5 + 0.5 * Math.sin(caustics.currentTime * 0.8);
      const targetOpacity = baseOpacity * (0.85 + drive * 0.4);
      const driveText = drive.toFixed(3);
      bloom.style.opacity = targetOpacity.toFixed(3);
      document.documentElement.style.setProperty("--bloom-drive", driveText);
      document.documentElement.setAttribute("data-bloom-drive", driveText);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
