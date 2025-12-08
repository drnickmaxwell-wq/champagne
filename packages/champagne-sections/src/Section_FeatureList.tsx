import type { CSSProperties } from "react";
import "@champagne/tokens";
import type { SectionRegistryEntry } from "./SectionRegistry";

export interface SectionFeatureListProps {
  section?: SectionRegistryEntry;
}

const wrapperStyle: CSSProperties = {
  borderRadius: "var(--radius-lg)",
  padding: "clamp(1.25rem, 2.8vw, 2rem)",
  background:
    "linear-gradient(120deg, color-mix(in srgb, var(--bg-ink, #06070c) 88%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 78%, transparent)), radial-gradient(circle at 10% 20%, color-mix(in srgb, var(--smh-white, #ffffff) 10%, transparent), transparent 32%)",
  color: "var(--text-high)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "var(--shadow-soft, 0 10px 36px rgba(0,0,0,0.32))",
};

const listStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "clamp(0.75rem, 2vw, 1.25rem)",
  marginTop: "0.75rem",
};

const pillStyle: CSSProperties = {
  padding: "0.8rem 1rem",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.24))",
  background:
    "linear-gradient(90deg, color-mix(in srgb, var(--smh-white, #ffffff) 6%, transparent), color-mix(in srgb, var(--smh-white, #ffffff) 0%, transparent)), radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--smh-white, #ffffff) 10%, transparent), transparent 40%)",
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: "0.65rem",
  alignItems: "center",
};

const badgeStyle: CSSProperties = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--smh-white, #ffffff) 24%, transparent), color-mix(in srgb, var(--smh-white, #ffffff) 8%, transparent))",
  border: "1px solid rgba(255,255,255,0.12)",
  display: "grid",
  placeItems: "center",
  color: "var(--text-high)",
  fontWeight: 700,
  letterSpacing: "0.02em",
  boxShadow: "0 10px 28px rgba(0,0,0,0.28)",
};

const headingStyle: CSSProperties = {
  fontSize: "clamp(1.15rem, 2vw, 1.45rem)",
  fontWeight: 700,
};

const subtextStyle: CSSProperties = {
  color: "var(--text-medium, rgba(255,255,255,0.78))",
  lineHeight: 1.55,
  fontSize: "0.98rem",
};

export function Section_FeatureList({ section }: SectionFeatureListProps = {}) {
  const definition = (section?.definition as Record<string, unknown> | undefined) ?? {};
  const features = section?.items
    ?? (definition.items as string[] | undefined)
    ?? [
      "Clinically precise planning with Champagne variable system",
      "Soft-focus overlays to keep eyes on the smile story",
      "Comfort-first spacing and rhythm across every breakpoint",
    ];
  const heading = section?.title
    ?? (definition.title as string | undefined)
    ?? "Hallmarks of Champagne care";
  const eyebrow = section?.eyebrow
    ?? (definition.label as string | undefined)
    ?? "Treatment signatures";

  return (
    <section style={wrapperStyle}>
      <div style={{ display: "grid", gap: "0.45rem" }}>
        {eyebrow && (
          <span style={{
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-medium, rgba(255,255,255,0.7))",
          }}>
            {eyebrow}
          </span>
        )}
        <h3 style={headingStyle}>{heading}</h3>
      </div>
      <div style={listStyle}>
        {features.map((item, index) => (
          <div key={item + index} style={pillStyle}>
            <span style={badgeStyle}>{index + 1}</span>
            <span style={subtextStyle}>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
