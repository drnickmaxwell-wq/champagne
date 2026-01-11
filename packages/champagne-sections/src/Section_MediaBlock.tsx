import type { CSSProperties } from "react";
import "@champagne/tokens";
import type { SectionRegistryEntry } from "./SectionRegistry";

export interface SectionMediaBlockProps {
  section?: SectionRegistryEntry;
}

const wrapperStyle: CSSProperties = {
  borderRadius: "var(--radius-lg)",
  border: "1px solid var(--border-subtle)",
  padding: "clamp(1.25rem, 2.8vw, 2.25rem)",
  background: "var(--surface-1)",
  display: "grid",
  gap: "clamp(1rem, 2vw, 1.5rem)",
};

const layoutStyle: CSSProperties = {
  display: "grid",
  gap: "clamp(1rem, 2.5vw, 1.75rem)",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  alignItems: "center",
};

const mediaShell: CSSProperties = {
  position: "relative",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  background: "var(--surface-2)",
  minHeight: "220px",
  boxShadow: "var(--shadow-soft)",
  border: "1px solid var(--border-subtle)",
};

const mediaGradient: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "var(--surface-2)",
  mixBlendMode: "screen",
};

const captionStyle: CSSProperties = {
  fontSize: "0.95rem",
  color: "var(--text-medium)",
  lineHeight: 1.6,
};

const headlineStyle: CSSProperties = {
  fontSize: "clamp(1.25rem, 2vw, 1.65rem)",
  fontWeight: 700,
  lineHeight: 1.3,
  color: "var(--text-high)",
};

const eyebrowStyle: CSSProperties = {
  fontSize: "0.85rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-low)",
};

export function Section_MediaBlock({ section }: SectionMediaBlockProps = {}) {
  const definition = (section?.definition as Record<string, unknown> | undefined) ?? {};
  const headline = section?.title
    ?? (definition.title as string | undefined)
    ?? "Visual proof with Champagne clarity";
  const eyebrow = section?.eyebrow
    ?? (definition.label as string | undefined)
    ?? "Treatment media";
  const caption = section?.body
    ?? (definition.copy as string | undefined)
    ?? "Media panels use ink/glass layering with soft-gold edges to keep imagery vivid without sacrificing contrast.";

  return (
    <section style={wrapperStyle}>
      <div style={layoutStyle}>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {eyebrow && <span style={eyebrowStyle}>{eyebrow}</span>}
          <h3 style={headlineStyle}>{headline}</h3>
          <p style={captionStyle}>{caption}</p>
        </div>
        <div style={mediaShell}>
          <div aria-hidden style={mediaGradient} />
          <div
            style={{
              position: "absolute",
              inset: "12% 10%",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              background: "var(--surface-1)",
              boxShadow: "var(--shadow-soft)",
              display: "grid",
              placeItems: "center",
              color: "var(--text-high)",
              fontWeight: 600,
              letterSpacing: "0.03em",
            }}
          >
            Champagne media canvas
          </div>
        </div>
      </div>
    </section>
  );
}
