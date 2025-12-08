import type { CSSProperties } from "react";
import "@champagne/tokens";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";

// Expected manifest shape (per section definition):
// {
//   id: "composite_overview_rich",
//   type: "treatment_overview_rich",
//   title: string,
//   copy: string,
//   bullets?: string[]
// }

export interface SectionTreatmentOverviewRichProps {
  section?: SectionRegistryEntry;
}

const layoutStyle: CSSProperties = {
  display: "grid",
  gap: "clamp(1rem, 2vw, 1.5rem)",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  alignItems: "start",
};

export function Section_TreatmentOverviewRich({ section }: SectionTreatmentOverviewRichProps = {}) {
  const heading = section?.title ?? "Composite bonding that blends seamlessly.";
  const body = section?.body
    ?? "Composite bonding repairs chips, closes small gaps, and rebalances edges with ultra-fine layering for a natural gloss.";
  const eyebrow = section?.eyebrow ?? "Overview";
  const bullets = section?.bullets ?? section?.items ?? [
    "Shape refinement for worn or chipped edges",
    "Shade-matched layering for a seamless finish",
    "Minimally invasive and reversible approach",
  ];

  return (
    <BaseChampagneSurface
      variant="glass"
      style={{
        padding: "clamp(1.25rem, 3vw, 2.5rem)",
        border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.22))",
        background:
          "linear-gradient(115deg, color-mix(in srgb, var(--bg-ink, #06070c) 88%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 76%, transparent)), radial-gradient(circle at 14% 18%, color-mix(in srgb, var(--smh-white, #ffffff) 10%, transparent), transparent 36%)",
      }}
    >
      <div style={{ display: "grid", gap: "0.65rem" }}>
        {eyebrow && (
          <span style={{ fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            {eyebrow}
          </span>
        )}
        <h2 style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)", fontWeight: 700, lineHeight: 1.3 }}>{heading}</h2>
        <p style={{ color: "var(--text-medium, rgba(240,240,240,0.82))", lineHeight: 1.65, fontSize: "1.02rem" }}>{body}</p>
      </div>
      {bullets && bullets.length > 0 && (
        <div style={layoutStyle}>
          {bullets.map((bullet) => (
            <div
              key={bullet}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid color-mix(in srgb, var(--champagne-keyline-gold, #ffd789) 28%, transparent)",
                background: "color-mix(in srgb, var(--surface-glass, rgba(255,255,255,0.06)) 70%, transparent)",
                boxShadow: "0 16px 32px rgba(0,0,0,0.22)",
              }}
            >
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.55 }}>{bullet}</p>
            </div>
          ))}
        </div>
      )}
    </BaseChampagneSurface>
  );
}
