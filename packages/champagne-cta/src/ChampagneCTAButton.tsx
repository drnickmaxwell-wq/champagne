import type { CSSProperties } from "react";
import "@champagne/tokens";
import type { ChampagneCTAConfig, CTAStylePreset } from "./types";

export interface ChampagneCTAButtonProps {
  cta: ChampagneCTAConfig;
  align?: "start" | "center" | "end";
}

const baseButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  padding: "0.85rem 1.4rem",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--champagne-keyline-gold, rgba(249, 232, 195, 0.55))",
  color: "var(--text-high, #f6f7fb)",
  textDecoration: "none",
  letterSpacing: "0.01em",
  fontWeight: 600,
  fontSize: "1rem",
  boxShadow: "0 14px 28px rgba(0,0,0,0.3)",
  position: "relative",
  overflow: "hidden",
};

const presetStyles: Record<CTAStylePreset, CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, var(--smh-gradient, rgba(255,255,255,0.08)), color-mix(in srgb, var(--bg-ink, #06070c) 82%, transparent))",
    borderColor: "var(--champagne-keyline-gold, rgba(249, 232, 195, 0.65))",
  },
  secondary: {
    background: "color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 85%, transparent)",
    borderColor: "color-mix(in srgb, var(--champagne-keyline-gold, rgba(249, 232, 195, 0.35)) 70%, transparent)",
  },
  "luxury-gold": {
    background: "linear-gradient(125deg, rgba(249,232,195,0.85), rgba(255,215,137,0.75))",
    color: "var(--bg-ink, #06070c)",
    borderColor: "rgba(255, 215, 137, 0.85)",
    boxShadow: "0 18px 34px rgba(0,0,0,0.4)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-medium, rgba(245, 247, 251, 0.7))",
    borderColor: "color-mix(in srgb, var(--champagne-keyline-gold, rgba(249, 232, 195, 0.4)) 55%, transparent)",
    boxShadow: "none",
  },
};

export function ChampagneCTAButton({ cta, align = "start" }: ChampagneCTAButtonProps) {
  const presetStyle = presetStyles[cta.preset as CTAStylePreset] ?? presetStyles.ghost;
  return (
    <a
      href={cta.href}
      style={{
        ...baseButtonStyle,
        ...presetStyle,
        alignSelf: align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start",
      }}
    >
      <span>{cta.label}</span>
    </a>
  );
}
