import type { CSSProperties } from "react";
import "@champagne/tokens";

const wrapperStyle: CSSProperties = {
  borderRadius: "var(--radius-md)",
  padding: "1.5rem",
  background: "rgba(255,255,255,0.02)",
  color: "var(--text-high)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "0.5rem",
  marginTop: "0.75rem",
};

const pillStyle: CSSProperties = {
  padding: "0.6rem 0.9rem",
  borderRadius: "999px",
  border: "1px solid var(--champagne-keyline-gold, rgba(255, 215, 137, 0.3))",
  background: "linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0))",
};

export function Section_FeatureList() {
  return (
    <section style={wrapperStyle}>
      <p style={{ fontSize: "1.125rem", fontWeight: 600 }}>Feature List Placeholder</p>
      <div style={listStyle}>
        {["Token-aware surface", "Awaiting live content", "Neutral placeholder"].map((item) => (
          <div key={item} style={pillStyle}>
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
