"use client";

import { useEffect, useRef } from "react";

const BLOOM_DEBUG_ATTRIBUTE = "data-bloom-debug";
const BLOOM_DRIVE_ATTRIBUTE = "data-bloom-drive";
const BLOOM_DRIVE_PROPERTY = "--bloom-drive";
const BLOOM_READY_STATE = 2;

const clampDrive = (value: number) => Math.min(1, Math.max(0, value));

export function BloomDriver() {
  const animationFrameRef = useRef<number | null>(null);
  const debugIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const bloom = document.querySelector<HTMLElement>(
      '[data-surface-id="overlay.sacredBloom"]',
    );
    if (!bloom) return;

    if (bloom.getAttribute("data-bloom-driven") !== "true") return;

    const html = document.documentElement;
    const mount = document.querySelector<HTMLElement>("[data-hero-engine]");
    const stack = document.querySelector<HTMLElement>(".hero-surface-stack");
    const targets = [html, mount, stack].filter(
      (target): target is HTMLElement => Boolean(target),
    );
    const isDebug = mount?.getAttribute(BLOOM_DEBUG_ATTRIBUTE) === "true";
    const baseOpacityRaw = Number(
      bloom.getAttribute("data-bloom-base-opacity") || 0.18,
    );
    const baseOpacity = Number.isFinite(baseOpacityRaw) ? baseOpacityRaw : 0.18;
    let lastDriveText = "0.000";

    if (isDebug) {
      console.debug("BloomDriver started");
    }

    const writeDrive = (drive: number) => {
      const driveText = clampDrive(drive).toFixed(3);
      lastDriveText = driveText;
      targets.forEach((target) => {
        target.setAttribute(BLOOM_DRIVE_ATTRIBUTE, driveText);
        target.style.setProperty(BLOOM_DRIVE_PROPERTY, driveText);
      });
      bloom.style.opacity = (baseOpacity * (0.6 + 0.8 * Number(driveText))).toFixed(3);
      return driveText;
    };

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      writeDrive(0.55);
      if (isDebug) {
        debugIntervalRef.current = window.setInterval(() => {
          console.debug(`BloomDriver drive: ${lastDriveText}`);
        }, 1000);
      }
      return () => {
        if (debugIntervalRef.current !== null) {
          window.clearInterval(debugIntervalRef.current);
          debugIntervalRef.current = null;
        }
      };
    }

    const targetVideo = document.querySelector<HTMLVideoElement>(
      '[data-surface-id="sacred.motion.waveCaustics"]',
    );

    const tick = () => {
      const drive =
        targetVideo && targetVideo.readyState >= BLOOM_READY_STATE
          ? 0.5 + 0.5 * Math.sin(targetVideo.currentTime * 1.25)
          : 0.5 + 0.5 * Math.sin(performance.now() / 900);
      writeDrive(drive);

      if (isDebug && debugIntervalRef.current === null) {
        debugIntervalRef.current = window.setInterval(() => {
          console.debug(`BloomDriver drive: ${lastDriveText}`);
        }, 1000);
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (debugIntervalRef.current !== null) {
        window.clearInterval(debugIntervalRef.current);
        debugIntervalRef.current = null;
      }
    };
  }, []);

  return null;
}
