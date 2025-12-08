"use client";

import { RefObject, useEffect, useState } from "react";

type ParallaxTransform = {
  x: number;
  y: number;
  rotateZ: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useParallax(target: RefObject<HTMLElement | null>): ParallaxTransform {
  const [transform, setTransform] = useState<ParallaxTransform>({ x: 0, y: 0, rotateZ: 0 });

  useEffect(() => {
    const node = target.current;
    if (!node) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setTransform({ x: 0, y: 0, rotateZ: 0 });
      return;
    }

    const desired: ParallaxTransform = { x: 0, y: 0, rotateZ: 0 };
    const current: ParallaxTransform = { x: 0, y: 0, rotateZ: 0 };
    let frame: number;
    let active = true;

    const animate = () => {
      current.x += (desired.x - current.x) * 0.08;
      current.y += (desired.y - current.y) * 0.08;
      current.rotateZ += (desired.rotateZ - current.rotateZ) * 0.1;

      const shouldUpdate =
        Math.abs(current.x - desired.x) > 0.02 ||
        Math.abs(current.y - desired.y) > 0.02 ||
        Math.abs(current.rotateZ - desired.rotateZ) > 0.01 ||
        Math.abs(current.x) > 0.02 ||
        Math.abs(current.y) > 0.02 ||
        Math.abs(current.rotateZ) > 0.01;

      if (shouldUpdate && active) {
        setTransform({ ...current });
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    const updateDesiredFromPointer = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        desired.x = 0;
        desired.y = 0;
        desired.rotateZ = 0;
        return;
      }

      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

      desired.x = clamp(relativeX * 12, -6, 6);
      desired.y = clamp(relativeY * 12, -6, 6);
      desired.rotateZ = clamp(relativeX * -4, -2, 2);
    };

    const resetDesired = () => {
      desired.x = 0;
      desired.y = 0;
      desired.rotateZ = 0;
    };

    node.addEventListener("pointermove", updateDesiredFromPointer);
    node.addEventListener("pointerleave", resetDesired);
    node.addEventListener("pointercancel", resetDesired);
    node.addEventListener("pointerup", resetDesired);

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        desired.x = 0;
        desired.y = 0;
        desired.rotateZ = 0;
        current.x = 0;
        current.y = 0;
        current.rotateZ = 0;
        if (active) {
          setTransform({ x: 0, y: 0, rotateZ: 0 });
        }
      }
    };
    mediaQuery.addEventListener("change", handlePreferenceChange);

    return () => {
      active = false;
      node.removeEventListener("pointermove", updateDesiredFromPointer);
      node.removeEventListener("pointerleave", resetDesired);
      node.removeEventListener("pointercancel", resetDesired);
      node.removeEventListener("pointerup", resetDesired);
      mediaQuery.removeEventListener("change", handlePreferenceChange);
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return transform;
}
