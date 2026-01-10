import type { CSSProperties } from "react";
import "@champagne/tokens";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";

// Expected manifest shape:
// {
//   id: "composite_clinician_insight",
//   type: "clinician_insight",
//   label?: string,
//   quote: string,
//   attribution: string,
//   role?: string
// }

export interface SectionClinicianInsightProps {
  section?: SectionRegistryEntry;
}

const blockStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
};

export function Section_ClinicianInsight({ section }: SectionClinicianInsightProps = {}) {
  const eyebrow = section?.eyebrow ?? "Clinical insight";
  const quote = section?.quote
    ?? "Composite bonding succeeds when the anatomy is respected – we rebuild in layers, polish in stages, and confirm the bite digitally before final gloss.";
  const attribution = section?.attribution ?? "Dr. Patel";
  const role = section?.role ?? "Cosmetic dentist";

  return (
    <BaseChampagneSurface
      variant="inkGlass"
      style={{
        padding: "clamp(1.25rem, 3vw, 2.35rem)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-1)",
      }}
    >
      <div style={blockStyle}>
        {eyebrow && (
          <span style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-medium)" }}>
            {eyebrow}
          </span>
        )}
        <blockquote
          style={{
            margin: 0,
            fontSize: "clamp(1.1rem, 2vw, 1.45rem)",
            lineHeight: 1.7,
            color: "var(--text-high)",
            fontWeight: 600,
          }}
        >
          “{quote}”
        </blockquote>
        <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color: "var(--text-medium)" }}>
          <span style={{ fontWeight: 700 }}>{attribution}</span>
          <span aria-hidden>•</span>
          <span>{role}</span>
        </div>
      </div>
    </BaseChampagneSurface>
  );
}
