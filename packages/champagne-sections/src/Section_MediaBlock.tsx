import type { CSSProperties } from "react";
import "@champagne/tokens";

const wrapperStyle: CSSProperties = {
  borderRadius: "var(--radius-md)",
  border: "1px dashed var(--champagne-keyline-gold, rgba(255, 215, 137, 0.3))",
  padding: "1.5rem",
  background: "rgba(10,12,18,0.4)",
  color: "var(--text-high)",
};

const mediaPlaceholder: CSSProperties = {
  width: "100%",
  height: "180px",
  borderRadius: "var(--radius-sm)",
  background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
  display: "grid",
  placeItems: "center",
  color: "var(--text-medium, rgba(255,255,255,0.65))",
  border: "1px solid rgba(255,255,255,0.08)",
};

export function Section_MediaBlock() {
  return (
    <section style={wrapperStyle}>
      <p style={{ fontSize: "1.125rem", fontWeight: 600 }}>Media Block Placeholder</p>
      <div style={{ marginTop: "0.75rem" }}>
        <div style={mediaPlaceholder}>
          Future media surface
        </div>
      </div>
      <p style={{ color: "var(--text-medium, rgba(255,255,255,0.75))", marginTop: "0.75rem", lineHeight: 1.6 }}>
        Imagery, video, or interactive components will appear here using the Champagne media system.
      </p>
    </section>
  );
}
