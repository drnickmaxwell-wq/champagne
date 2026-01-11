import type { CSSProperties } from "react";
import "@champagne/tokens";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";

// Expected manifest shape:
// {
//   id: "composite_ai_tools",
//   type: "treatment_tools_trio",
//   title: string,
//   copy?: string,
//   items: [{ title: string, description?: string }, ...]
// }

export interface SectionTreatmentToolsTrioProps {
  section?: SectionRegistryEntry;
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "clamp(0.85rem, 2vw, 1.35rem)",
};

export function Section_TreatmentToolsTrio({ section }: SectionTreatmentToolsTrioProps = {}) {
  const eyebrow = section?.eyebrow ?? "AI tools & tech";
  const title = section?.title ?? "Digital precision for composite bonding.";
  const body = section?.body
    ?? "From scanning to finishing, each stage uses AI-guided planning and visual previews so patients understand every step.";
  const tools = section?.tools ?? [
    { title: "3D surface scanning", description: "Captures micro-contours so bonding hugs the natural tooth." },
    { title: "Smile design overlays", description: "AI compositing checks symmetry, proportions, and wear patterns." },
    { title: "Finishing guidance", description: "Digital shade and gloss mapping to keep the finish consistent." },
  ];

  return (
    <BaseChampagneSurface
      variant="glass"
      style={{
        padding: "clamp(1.25rem, 3vw, 2.35rem)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-1)",
      }}
    >
      <div style={{ display: "grid", gap: "0.65rem" }}>
        {eyebrow && (
          <span style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            {eyebrow}
          </span>
        )}
        <h3 style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontWeight: 700 }}>{title}</h3>
        <p style={{ fontSize: "0.98rem", color: "var(--text-medium)", lineHeight: 1.6 }}>{body}</p>
      </div>
      <div style={gridStyle}>
        {tools.map((tool, index) => (
          <div
            key={`${tool.title}-${index}`}
            style={{
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              border: "1px solid var(--border-subtle)",
              background: "var(--surface-glass)",
              display: "grid",
              gap: "0.45rem",
              minHeight: "160px",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <span style={{ fontSize: "0.9rem", letterSpacing: "0.02em", color: "var(--text-medium)" }}>Tool {index + 1}</span>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{tool.title}</div>
            {tool.description && (
              <p style={{ margin: 0, color: "var(--text-medium)", lineHeight: 1.6 }}>{tool.description}</p>
            )}
          </div>
        ))}
      </div>
    </BaseChampagneSurface>
  );
}
