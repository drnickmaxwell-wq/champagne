import type { CSSProperties } from "react";
import "@champagne/tokens";
import type { SectionRegistryEntry } from "./SectionRegistry";

export interface SectionComponentProps {
  section?: SectionRegistryEntry;
}

const containerStyle: CSSProperties = {
  position: "relative",
  borderRadius: "var(--radius-lg)",
  border: "1px solid var(--border-subtle)",
  padding: "clamp(1.5rem, 3vw, 2.5rem)",
  background: "var(--surface-1)",
  boxShadow: "var(--shadow-soft)",
  overflow: "hidden",
};

const accentBar: CSSProperties = {
  position: "absolute",
  inset: "0 0 auto 0",
  height: "3px",
  background: "var(--border-subtle)",
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
  color: "var(--text-medium)",
};

const headingStyle: CSSProperties = {
  fontSize: "clamp(1.35rem, 2vw, 1.8rem)",
  fontWeight: 700,
  lineHeight: 1.3,
  color: "var(--text-high)",
};

const bodyStyle: CSSProperties = {
  fontSize: "1.05rem",
  lineHeight: 1.7,
  color: "var(--text-medium)",
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
