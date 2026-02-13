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
        display: "grid",
        gap: "1rem",
        alignContent: "start",
        padding: "clamp(1.5rem, 3.8vw, 2.5rem)",
        background: "var(--bg-ink)",
        color: "var(--text-high)",
      }}
    >
      <header style={{ width: "min(100%, 46rem)", margin: "0 auto", display: "grid", gap: "0.35rem" }}>
        <p style={{ color: "var(--text-medium)", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>Internal preview</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}>Champagne Concierge — Preview</h1>
        <p style={{ margin: 0, color: "var(--text-medium)" }}>Preview UI only. No clinical assessment.</p>
      </header>
      <ConciergePreview />
    </main>
  );
}
