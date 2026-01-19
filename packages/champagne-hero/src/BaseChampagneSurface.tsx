"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import "@champagne/tokens";
import sacredHeroBase from "../../champagne-manifests/data/hero/sacred_hero_base.json" assert { type: "json" };

type SurfaceVariant = "glass" | "inkGlass" | "plain";
type SurfaceTone = "default" | "ink";

export interface BaseChampagneSurfaceProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: SurfaceVariant;
  tone?: SurfaceTone;
  disableInternalOverlays?: boolean;
}

type DebugOverrideEntry = {
  opacity?: number;
};

type DebugOverrideMap = Record<string, DebugOverrideEntry>;

const HERO_DEBUG_OVERRIDE_KEY = "champagne.hero.debug.overrides";
const HERO_DEBUG_OVERRIDE_EVENT = "champagne-hero-debug-overrides";

const baseStyle: CSSProperties = {
  position: "relative",
  isolation: "isolate",
  color: "var(--text-high)",
  backgroundImage: "var(--smh-gradient)",
  backgroundSize: "var(--smh-surface-bg-size, cover)",
  backgroundPosition: "var(--smh-surface-bg-position, center)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-soft)",
  overflow: "hidden",
};

const glassStyle: CSSProperties = {
  backgroundColor: "var(--surface-glass)",
  backdropFilter: "blur(18px)",
};

const inkGlassStyle: CSSProperties = {
  backgroundColor: "var(--surface-glass-deep)",
  backdropFilter: "blur(16px)",
};

export function BaseChampagneSurface({
  children,
  className,
  style,
  variant = "glass",
  tone = "default",
  disableInternalOverlays = false,
}: BaseChampagneSurfaceProps) {
  const surfaceRootRef = useRef<HTMLDivElement | null>(null);
  const sacredOverlayOptOut = Boolean(
    (sacredHeroBase as { defaults?: { rendering?: { disableInternalOverlays?: boolean } } })
      ?.defaults
      ?.rendering
      ?.disableInternalOverlays,
  );
  const isHeroSurface = typeof className === "string" && className.includes("hero-renderer");
  const shouldDisableInternalOverlays = disableInternalOverlays || (sacredOverlayOptOut && isHeroSurface);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const isDebugRoute = window.location.pathname.includes("/champagne/hero-debug");
    if (process.env.NODE_ENV !== "development" && !isDebugRoute) return undefined;

    const root = surfaceRootRef.current;
    if (!root) return undefined;

    const readOverrides = (): DebugOverrideMap => {
      const raw = window.localStorage.getItem(HERO_DEBUG_OVERRIDE_KEY);
      if (!raw) return {};
      try {
        const parsed = JSON.parse(raw) as DebugOverrideMap;
        if (!parsed || typeof parsed !== "object") return {};
        return parsed;
      } catch {
        return {};
      }
    };

    const applyOverrides = () => {
      const overrides = readOverrides();
      const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-surface-id]"));
      nodes.forEach((node) => {
        const surfaceId = node.getAttribute("data-surface-id");
        if (!surfaceId) return;
        const override = overrides[surfaceId];
        const overrideOpacity = override?.opacity;
        if (typeof overrideOpacity === "number" && Number.isFinite(overrideOpacity)) {
          if (node.dataset.heroDebugInlineOpacity === undefined) {
            node.dataset.heroDebugInlineOpacity = node.style.opacity || "";
          }
          node.style.opacity = String(overrideOpacity);
          return;
        }
        if (node.dataset.heroDebugInlineOpacity !== undefined) {
          const originalOpacity = node.dataset.heroDebugInlineOpacity;
          if (originalOpacity) {
            node.style.opacity = originalOpacity;
          } else {
            node.style.removeProperty("opacity");
          }
          delete node.dataset.heroDebugInlineOpacity;
        }
      });
    };

    applyOverrides();

    const observer = new MutationObserver(() => applyOverrides());
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-surface-id", "style"],
    });

    const handleOverrideEvent = () => applyOverrides();
    window.addEventListener(HERO_DEBUG_OVERRIDE_EVENT, handleOverrideEvent as EventListener);
    window.addEventListener("storage", handleOverrideEvent);

    return () => {
      observer.disconnect();
      window.removeEventListener(HERO_DEBUG_OVERRIDE_EVENT, handleOverrideEvent as EventListener);
      window.removeEventListener("storage", handleOverrideEvent);
    };
  }, []);

  const appliedTone: CSSProperties = tone === "ink"
    ? { color: "var(--smh-ink)" }
    : { color: "var(--text-high)" };

  const variantStyle = variant === "inkGlass"
    ? inkGlassStyle
    : variant === "glass"
      ? glassStyle
      : {};

  return (
    <div
      ref={surfaceRootRef}
      className={className}
      style={{
        ...baseStyle,
        ...variantStyle,
        ...appliedTone,
        ...style,
      }}
    >
      {!shouldDisableInternalOverlays && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              background: "radial-gradient(circle at 10% 10%, color-mix(in srgb, var(--smh-white) 12%, transparent), transparent 35%)",
              opacity: "var(--champagne-sheen-alpha, 0.85)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              background: "var(--champagne-glass-bg)",
              mixBlendMode: "screen",
              opacity: "var(--glass-opacity, 0.8)",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
