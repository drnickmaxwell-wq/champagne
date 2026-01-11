import { HeroDebugClientPanel } from "./HeroDebugClientPanel";

export default function HeroDebugPage() {
  return (
    <div
      className="hero-debug-page"
      style={{
        display: "grid",
        gap: "1.5rem",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        background: "var(--bg-ink)",
        color: "var(--text-high)",
        minHeight: "100vh",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .hero-debug-page { min-height: 100vh; }
            .hero-debug-panel { border-radius: var(--radius-lg); border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft)); background: color-mix(in srgb, var(--bg-ink) 70%, transparent); padding: 1rem 1.25rem; overflow: auto; display: grid; gap: 0.75rem; }
            .hero-debug-panel h3 { margin: 0; font-size: 1rem; }
            .hero-debug-panel table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
            .hero-debug-panel th, .hero-debug-panel td { text-align: left; padding: 0.35rem 0.5rem; border-bottom: 1px solid color-mix(in srgb, var(--champagne-keyline-gold, var(--surface-ink-soft)) 50%, transparent); }
            .hero-debug-panel th { letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-medium); font-size: 0.8rem; }
            .hero-debug-hero-shell { position: relative; min-height: 72vh; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft)); background: color-mix(in srgb, var(--bg-ink) 80%, transparent); }
          `,
        }}
      />

      <header style={{ display: "grid", gap: "0.35rem" }}>
        <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-medium)" }}>Sacred hero debug</p>
        <h1 style={{ fontSize: "clamp(1.9rem, 2.5vw, 2.4rem)" }}>Runtime surface observatory</h1>
        <p style={{ color: "var(--text-medium)", maxWidth: "880px", lineHeight: 1.55 }}>
          Toggle static layers, PRM, and time-of-day to confirm the Sacred home hero resolves masks, overlays, grain, and particles correctly.
        </p>
      </header>

      <div className="hero-debug-hero-shell" data-hero-mode="engine-debug">
        <span
          style={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-high)",
            opacity: 0.6,
            pointerEvents: "none",
            zIndex: 9,
          }}
        >
          Engine Debug
        </span>
        <HeroDebugClientPanel />
      </div>
    </div>
  );
}
