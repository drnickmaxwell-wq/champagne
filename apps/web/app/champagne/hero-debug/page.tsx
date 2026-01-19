import { HeroDebugClientPanel } from "./HeroDebugClientPanel";
import { HeroDebugModePanel, type DebugMode } from "./HeroDebugModePanel";

type HeroDebugPageProps = {
  searchParams?: Promise<{
    mode?: string;
    overrides?: string;
  }>;
};

const resolveMode = (mode?: string): DebugMode => (mode === "home" ? "home" : "matcher");

export default async function HeroDebugPage({ searchParams }: HeroDebugPageProps) {
  const resolvedParams = await searchParams;
  const mode = resolveMode(resolvedParams?.mode);
  const overridesEnabled = resolvedParams?.overrides === "1";
  const homeIframeSrc = `/?heroTruth=1&heroDebug=1${overridesEnabled ? "&overrides=1" : ""}`;
  return (
    <div
      className="hero-debug-page"
      data-hero-debug-root="true"
      data-hero-debug-mode={mode}
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
            .hero-debug-override-panel { border-radius: var(--radius-lg); border: 1px solid var(--champagne-keyline-gold, var(--surface-ink-soft)); background: color-mix(in srgb, var(--bg-ink) 78%, transparent); padding: 1rem 1.25rem; display: grid; gap: 0.75rem; }
            .hero-debug-mode-panel { display: grid; gap: 0.75rem; }
            .hero-debug-mode-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
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

      <HeroDebugModePanel mode={mode} />

      <div className="hero-debug-hero-shell" data-hero-debug-viewport={mode}>
        {mode === "home" ? (
          <iframe
            title="Homepage hero viewport"
            src={homeIframeSrc}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <HeroDebugClientPanel />
        )}
      </div>
    </div>
  );
}
