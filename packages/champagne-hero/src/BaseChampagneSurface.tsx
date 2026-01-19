import type { CSSProperties, ReactNode } from "react";
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
  const sacredOverlayOptOut = Boolean(
    (sacredHeroBase as { defaults?: { rendering?: { disableInternalOverlays?: boolean } } })
      ?.defaults
      ?.rendering
      ?.disableInternalOverlays,
  );
  const isHeroSurface = typeof className === "string" && className.includes("hero-renderer");
  const shouldDisableInternalOverlays = disableInternalOverlays || (sacredOverlayOptOut && isHeroSurface);

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
