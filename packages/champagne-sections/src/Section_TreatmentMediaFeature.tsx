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
        border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.22))",
        background:
          "linear-gradient(145deg, color-mix(in srgb, var(--bg-ink, #06070c) 88%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 76%, transparent)), radial-gradient(circle at 78% 18%, color-mix(in srgb, var(--smh-white, #ffffff) 10%, transparent), transparent 32%)",
      }}
    >
      <div style={wrapperStyle}>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {eyebrow && (
            <span style={{ fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-medium)" }}>
              {eyebrow}
            </span>
          )}
          <h3 style={{ fontSize: "clamp(1.25rem, 2vw, 1.65rem)", fontWeight: 700, lineHeight: 1.3 }}>{title}</h3>
          <p style={{ fontSize: "1rem", lineHeight: 1.65, color: "var(--text-medium, rgba(235,235,235,0.8))" }}>{body}</p>
        </div>
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            minHeight: "230px",
            background: "var(--surface-glass, rgba(255,255,255,0.06))",
            boxShadow: "0 20px 48px rgba(0,0,0,0.28)",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--champagne-keyline-gold, #ffd789) 16%, transparent), color-mix(in srgb, var(--smh-white, #ffffff) 4%, transparent))",
              opacity: 0.65,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "12% 10%",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(255,255,255,0.16)",
              background: "linear-gradient(160deg, color-mix(in srgb, var(--smh-white, #ffffff) 10%, transparent), color-mix(in srgb, var(--bg-ink, #06070c) 72%, transparent))",
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
