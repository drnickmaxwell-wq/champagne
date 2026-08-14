"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { HeroRendererV2 } from "../../components/hero/v2/HeroRendererV2";
import styles from "./heroV3Diagnostic.module.css";

const VIEWPORTS = [
  { id: "desktop", label: "Desktop · 1440" },
  { id: "mobile", label: "Mobile · 390" },
] as const;

type ViewportMode = (typeof VIEWPORTS)[number]["id"];
const isViewport = (value: string | null): value is ViewportMode => VIEWPORTS.some(({ id }) => id === value);

export function HeroV3DiagnosticLab() {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [showGuides, setShowGuides] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedViewport = params.get("viewport");
    if (isViewport(requestedViewport)) setViewport(requestedViewport);
    setShowGuides(params.get("guides") === "1");
  }, []);

  const updateViewport = (nextViewport: ViewportMode) => {
    setViewport(nextViewport);
    const params = new URLSearchParams(window.location.search);
    params.delete("study");
    params.set("viewport", nextViewport);
    params.set("guides", showGuides ? "1" : "0");
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  const frameStyle = { "--h3-frame-width": viewport === "mobile" ? "390px" : "1440px" } as CSSProperties;

  return (
    <main className={styles.page} data-production-binding="false" data-h3-correction="PRESERVE_SACRED_V2">
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Hero V3 · H3.2R founder correction</p>
          <h1>Sacred V2 engine baseline</h1>
          <p>The accepted Champagne Hero remains visually unchanged. Hero V3 improves this engine; it does not redesign this hero.</p>
        </div>
        <p className={styles.status}>productionBinding=false · baseline only</p>
      </header>

      <nav className={styles.controls} aria-label="Sacred V2 review controls">
        <p><strong>Active visual:</strong> Accepted Sacred V2</p>
        <div className={styles.controlGroup} role="group" aria-label="Viewport">
          {VIEWPORTS.map((entry) => (
            <button key={entry.id} type="button" aria-pressed={viewport === entry.id} onClick={() => updateViewport(entry.id)}>{entry.label}</button>
          ))}
        </div>
        <label className={styles.guideToggle}>
          <input type="checkbox" checked={showGuides} onChange={(event) => setShowGuides(event.target.checked)} />
          Copy / CTA safe zones
        </label>
      </nav>

      <section className={styles.stageShell} style={frameStyle} aria-label="Accepted Sacred V2 baseline">
        <p className={styles.viewportLabel}>Accepted Sacred V2 · {viewport}</p>
        <div className={styles.stage} data-h3-study="v2-reference" data-h3-viewport={viewport} data-h3-engine-baseline="SACRED_V2_UNCHANGED">
          <HeroRendererV2 prm particles filmGrain diagnosticBoost={false} pageSlugOrPath="/" />
          {showGuides ? (
            <div className={styles.safeZones} aria-hidden="true">
              <span className={styles.copyZone}>Protected copy</span>
              <span className={styles.ctaZone}>Protected CTA</span>
            </div>
          ) : null}
        </div>
      </section>

      <aside className={styles.engineBrief} aria-label="Hero V3 engine direction">
        <h2>What V3 improves</h2>
        <p>Rendering fidelity, luminous depth, seamless motion, responsive reliability, reduced-motion equivalence and future governed variants—while preserving Champagne’s accepted composition and identity.</p>
      </aside>
    </main>
  );
}
