import type { CSSProperties } from "react";
import "@champagne/tokens";
import type { SectionRegistryEntry } from "./SectionRegistry";

export interface SectionComponentProps {
  section?: SectionRegistryEntry;
}

const containerStyle: CSSProperties = {
  position: "relative",
  borderRadius: "var(--radius-lg)",
  border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.28))",
  padding: "clamp(1.5rem, 3vw, 2.5rem)",
  background:
    "linear-gradient(180deg, color-mix(in srgb, var(--bg-ink, #06070c) 86%, transparent), color-mix(in srgb, var(--bg-ink-soft, #0c0f16) 82%, transparent)), radial-gradient(circle at 18% 12%, color-mix(in srgb, var(--smh-white, #ffffff) 14%, transparent), transparent 38%)",
  boxShadow: "var(--shadow-soft, 0 10px 36px rgba(0,0,0,0.35))",
  overflow: "hidden",
};

const accentBar: CSSProperties = {
  position: "absolute",
  inset: "0 0 auto 0",
  height: "3px",
  background:
    "linear-gradient(90deg, color-mix(in srgb, var(--champagne-keyline-gold, #ffd789) 40%, transparent), color-mix(in srgb, var(--champagne-keyline-gold, #ffd789) 8%, transparent))",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gap: "0.75rem",
  maxWidth: "68ch",
};

const eyebrowStyle: CSSProperties = {
  fontSize: "0.9rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-medium, rgba(255,255,255,0.72))",
};

const headingStyle: CSSProperties = {
  fontSize: "clamp(1.35rem, 2vw, 1.8rem)",
  fontWeight: 700,
  lineHeight: 1.3,
};

const bodyStyle: CSSProperties = {
  fontSize: "1.05rem",
  lineHeight: 1.7,
  color: "var(--text-medium, rgba(255,255,255,0.78))",
};

export function Section_TextBlock({ section }: SectionComponentProps = {}) {
  const definition = (section?.definition as Record<string, unknown> | undefined) ?? {};
  const heading = section?.title
    ?? (definition.title as string | undefined)
    ?? (definition.headline as string | undefined)
    ?? "Precision-crafted smiles built on gentle engineering.";
  const eyebrow = section?.eyebrow
    ?? (definition.label as string | undefined)
    ?? (definition.eyebrow as string | undefined)
    ?? "Champagne narrative";
  const copy = section?.body
    ?? (definition.copy as string | undefined)
    ?? (definition.body as string | undefined)
    ?? "Every surface is tuned with Champagne tokens to keep contrast crisp, spacing breathable, and details soft-gold without overwhelming the eye.";

  return (
    <section style={containerStyle}>
      <div aria-hidden style={accentBar} />
      <div style={gridStyle}>
        {eyebrow && <span style={eyebrowStyle}>{eyebrow}</span>}
        <h2 style={headingStyle}>{heading}</h2>
        <p style={bodyStyle}>{copy}</p>
      </div>
    </section>
  );
}
