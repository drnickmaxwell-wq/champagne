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
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-1)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div style={{ display: "grid", gap: "0.65rem" }}>
        {eyebrow && (
          <span style={{ fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            {eyebrow}
          </span>
        )}
        <h2 style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)", fontWeight: 700, lineHeight: 1.3, color: "var(--text-high)" }}>
          {heading}
        </h2>
        <p style={{ color: "var(--text-medium)", lineHeight: 1.65, fontSize: "1.02rem" }}>{body}</p>
      </div>
      {bullets && bullets.length > 0 && (
        <div style={layoutStyle}>
          {bullets.map((bullet) => (
            <div
              key={bullet}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                background: "var(--surface-2)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.55, color: "var(--text-medium)" }}>{bullet}</p>
            </div>
          ))}
        </div>
      )}
    </BaseChampagneSurface>
  );
}
