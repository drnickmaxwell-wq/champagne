import type { CSSProperties, ReactNode } from "react";
import "@champagne/tokens";

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
  boxShadow: "var(--shadow-soft, 0 12px 40px rgba(0,0,0,0.35))",
  overflow: "hidden",
};

const glassStyle: CSSProperties = {
  backgroundColor: "var(--surface-glass, rgba(255,255,255,0.04))",
  backdropFilter: "blur(18px)",
};

const inkGlassStyle: CSSProperties = {
  backgroundColor: "var(--surface-glass-deep, rgba(6,7,12,0.4))",
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
      {!disableInternalOverlays && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              background: "radial-gradient(circle at 10% 10%, rgba(255,255,255,0.12), transparent 35%)",
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
              background: "var(--champagne-glass-bg, linear-gradient(135deg, rgba(255,255,255,0.08), rgba(6,7,12,0.35)))",
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
