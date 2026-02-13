import type { Metadata } from "next";
import { ConciergePreview } from "../../../_components/concierge/ConciergePreview";

export const metadata: Metadata = {
  title: "Champagne Concierge — Preview",
};

export default function ConciergePreviewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-ink)",
        color: "var(--text-high)",
      }}
    >
      <section
        style={{
          position: "relative",
          minHeight: "clamp(16rem, 42vh, 24rem)",
          padding: "clamp(1.25rem, 3.5vw, 2.75rem)",
          display: "grid",
          alignContent: "start",
          gap: "0.45rem",
          background: "var(--bg-ink)",
          borderBottom: "1px solid var(--champagne-keyline-gold)",
          overflow: "hidden",
        }}
      >
        <header style={{ width: "min(100%, 68rem)", margin: "0 auto", display: "grid", gap: "0.35rem", zIndex: 1 }}>
          <p style={{ color: "var(--text-medium)", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>Internal preview</p>
          <h1 style={{ margin: 0, fontSize: "clamp(1.45rem, 2.4vw, 2.2rem)" }}>Champagne Concierge — Preview</h1>
          <p style={{ margin: 0, color: "var(--text-medium)", maxWidth: "58ch" }}>
            Preview UI only. No clinical assessment.
          </p>
        </header>
      </section>

      <section
        style={{
          width: "min(100%, 72rem)",
          margin: "clamp(-8rem, -12vh, -5.25rem) auto 0",
          padding: "0 clamp(0.9rem, 2.8vw, 1.35rem) clamp(1.4rem, 3.5vw, 2.5rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <ConciergePreview />
      </section>
    </main>
  );
}
