import { Fragment } from "react";
import type { ChampagneCTAConfig, CTAReference, CTAStylePreset } from "./types";
import { ChampagneCTAButton } from "./ChampagneCTAButton";
import { resolveCTAList } from "./CTARegistry";

export interface ChampagneCTAGroupProps {
  ctas?: (ChampagneCTAConfig | CTAReference)[];
  align?: "start" | "center" | "end";
  direction?: "row" | "column";
  gap?: string;
  showDebug?: boolean;
  label?: string;
  defaultPreset?: CTAStylePreset;
}

function normalizeCTAs(
  ctas: (ChampagneCTAConfig | CTAReference)[] = [],
  defaultPreset: CTAStylePreset = "ghost",
): ChampagneCTAConfig[] {
  const resolved = ctas.map((cta) => {
    if (typeof cta === "string") return cta;
    if ((cta as ChampagneCTAConfig).href && (cta as ChampagneCTAConfig).label) return cta as ChampagneCTAConfig;
    return cta;
  });

  return resolveCTAList(resolved, defaultPreset);
}

export function ChampagneCTAGroup({
  ctas,
  align = "start",
  direction = "row",
  gap = "0.75rem",
  showDebug = false,
  label,
  defaultPreset = "ghost",
}: ChampagneCTAGroupProps) {
  const resolved = normalizeCTAs(ctas, defaultPreset);
  if (resolved.length === 0) return null;

  return (
    <div
      style={{
        display: "grid",
        gap: "0.4rem",
        padding: "0.2rem",
      }}
    >
      {label && (
        <div style={{
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: "0.78rem",
          color: "var(--text-medium, rgba(255,255,255,0.7))",
        }}>
          {label}
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: direction,
          gap,
          flexWrap: direction === "row" ? "wrap" : undefined,
          alignItems: align === "center" ? "center" : align === "end" ? "flex-end" : "flex-start",
        }}
      >
        {resolved.map((cta) => (
          <ChampagneCTAButton key={cta.id} cta={cta} align={align} />
        ))}
      </div>
      {showDebug && (
        <div
          style={{
            fontSize: "0.82rem",
            color: "var(--text-medium, rgba(255,255,255,0.74))",
            border: "1px dashed color-mix(in srgb, var(--champagne-keyline-gold, #f9e8c3) 45%, transparent)",
            borderRadius: "var(--radius-sm)",
            padding: "0.5rem 0.6rem",
            background: "color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 45%, transparent)",
          }}
        >
          <div style={{ opacity: 0.85 }}>CTA slot debug ({resolved.length})</div>
          <ul style={{ margin: "0.25rem 0 0", paddingLeft: "1.05rem", display: "grid", gap: "0.15rem" }}>
            {resolved.map((cta) => (
              <Fragment key={`${cta.id}-${cta.href}`}>
                <li>
                  <strong>{cta.label}</strong> → {cta.href} ({cta.preset ?? "ghost"})
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
