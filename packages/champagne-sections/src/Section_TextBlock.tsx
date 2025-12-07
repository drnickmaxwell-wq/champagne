import type { CSSProperties } from "react";
import "@champagne/tokens";

const containerStyle: CSSProperties = {
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.25))",
  padding: "1.5rem",
  background: "rgba(6,7,12,0.35)",
  color: "var(--text-high)",
};

export function Section_TextBlock() {
  return (
    <section style={containerStyle}>
      <p style={{ fontSize: "1.125rem", fontWeight: 600 }}>Text Block Placeholder</p>
      <p style={{ color: "var(--text-medium, rgba(255,255,255,0.75))", marginTop: "0.5rem", lineHeight: 1.6 }}>
        This neutral surface represents a future storytelling or descriptive text section.
        Content, media, and layout will be attached once the Champagne section system is fully activated.
      </p>
    </section>
  );
}
