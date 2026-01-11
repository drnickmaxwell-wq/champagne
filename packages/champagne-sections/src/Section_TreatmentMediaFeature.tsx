import type { CSSProperties } from "react";
import "@champagne/tokens";
import { BaseChampagneSurface } from "@champagne/hero";
import type { SectionRegistryEntry } from "./SectionRegistry";

// Expected manifest shape:
// {
//   id: "composite_media_feature",
//   type: "treatment_media_feature",
//   title: string,
//   copy: string,
//   mediaHint?: string
// }

export interface SectionTreatmentMediaFeatureProps {
  section?: SectionRegistryEntry;
}

const wrapperStyle: CSSProperties = {
  display: "grid",
  gap: "clamp(1rem, 2.4vw, 1.6rem)",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  alignItems: "center",
};

export function Section_TreatmentMediaFeature({ section }: SectionTreatmentMediaFeatureProps = {}) {
  const title = section?.title ?? "Preview every contour in 3D.";
  const body = section?.body
    ?? "A Champagne media canvas holds scans, virtual wax-ups, or treatment simulations while copy keeps expectations grounded.";
  const eyebrow = section?.eyebrow ?? "3D preview";
  const mediaHint = section?.mediaHint ?? "Champagne media canvas";

  return (
    <BaseChampagneSurface
      variant="glass"
      style={{
        padding: "clamp(1.25rem, 2.8vw, 2.25rem)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-1)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div style={wrapperStyle}>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {eyebrow && (
            <span style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-medium)" }}>
              {eyebrow}
            </span>
          )}
          <h3 style={{ fontSize: "clamp(1.25rem, 2vw, 1.65rem)", fontWeight: 700, lineHeight: 1.3, color: "var(--text-high)" }}>
            {title}
          </h3>
          <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--text-medium)" }}>{body}</p>
        </div>
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--border-subtle)",
            minHeight: "230px",
            background: "var(--surface-2)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--surface-0)",
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "12% 10%",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--surface-2)",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
              padding: "1rem",
              color: "var(--text-high)",
              fontWeight: 600,
              letterSpacing: "0.03em",
            }}
          >
            {mediaHint}
          </div>
        </div>
      </div>
    </BaseChampagneSurface>
  );
}
