"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CHAMPAGNE_SACRED_V2_OPTICAL_MATERIAL_PROFILE } from "@champagne/hero";
import { HeroRendererV2 } from "../../components/hero/v2/HeroRendererV2";
import { HeroV3MotionScoreController } from "./HeroV3MotionScoreController";
import styles from "./heroV3Diagnostic.module.css";

const MODES = [{ id: "v2-reference", label: "Accepted Sacred V2" }, { id: "h3-3-engine", label: "V3 engine enhancement" }] as const;
const VIEWPORTS = [{ id: "desktop", label: "Desktop · 1440" }, { id: "mobile", label: "Mobile · 390" }] as const;
const COMPARISONS = [{ id: "single", label: "Single" }, { id: "side-by-side", label: "Side by side" }, { id: "blink", label: "Blink" }] as const;
const PHASES = ["LIVE", "REST", "PEARL", "RIDGE", "GOLD"] as const;
const ISOLATIONS = ["ALL", "PEARL", "RIDGE", "DEPTH", "GOLD"] as const;
type Mode = (typeof MODES)[number]["id"];
type Viewport = (typeof VIEWPORTS)[number]["id"];
type Comparison = (typeof COMPARISONS)[number]["id"];
type Phase = (typeof PHASES)[number];
type Isolation = (typeof ISOLATIONS)[number];

const material = CHAMPAGNE_SACRED_V2_OPTICAL_MATERIAL_PROFILE;
const opticalStyle = {
  "--h3-optical-human": material.paletteRoles.humanEnergy,
  "--h3-optical-digital": material.paletteRoles.digitalClarity,
  "--h3-optical-precision": material.paletteRoles.precision,
  "--h3-optical-lift": material.paletteRoles.lift,
  "--h3-optical-depth": material.paletteRoles.depth,
  "--h3-optical-ambient-max": material.lightBudget.ambientOpacityMax,
  "--h3-optical-highlight-max": material.lightBudget.localHighlightOpacityMax,
} as CSSProperties;

const opticalLuxuryLayers = (
  <div className={styles.opticalLuxury} style={opticalStyle} data-h3-optical-material={material.id} aria-hidden="true">
    <span className={styles.depthVeil} />
    <span className={styles.subsurfaceBloom} />
    <span className={styles.interferenceVeil} />
    <span className={styles.ridgeLight} />
    <span className={styles.goldResolution} />
    <span className={styles.specularGlints} />
  </div>
);

export function HeroV3DiagnosticLab() {
  const [mode, setMode] = useState<Mode>("h3-3-engine");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [comparison, setComparison] = useState<Comparison>("single");
  const [phase, setPhase] = useState<Phase>("LIVE");
  const [isolation, setIsolation] = useState<Isolation>("ALL");
  const [blinkEnhanced, setBlinkEnhanced] = useState(true);
  const [forceFallback, setForceFallback] = useState(false);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const baselineRef = useRef<HTMLDivElement | null>(null);
  const enhancedRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "v2-reference") setMode("v2-reference");
    if (params.get("viewport") === "mobile") setViewport("mobile");
    setForceFallback(params.get("fallback") === "1");
  }, []);
  useEffect(() => {
    if (comparison !== "blink") return;
    const timer = window.setInterval(() => setBlinkEnhanced((current) => !current), 900);
    return () => window.clearInterval(timer);
  }, [comparison]);
  const effectiveMode = comparison === "blink" ? (blinkEnhanced ? "h3-3-engine" : "v2-reference") : mode;
  const frameStyle = { "--h3-frame-width": viewport === "mobile" ? "390px" : "1440px" } as CSSProperties;
  const renderStage = (stageMode: Mode, ref: typeof surfaceRef) => {
    const enhanced = stageMode === "h3-3-engine";
    return <div className={styles.stage} data-h3-engine-mode={stageMode} data-h3-viewport={viewport} data-h3-phase-lock={phase} data-h3-layer-isolation={isolation} ref={ref}>
      <HeroV3MotionScoreController rootRef={ref} enabled={enhanced} forceFallback={forceFallback} />
      <HeroRendererV2 prm={forceFallback} particles filmGrain diagnosticBoost={false} pageSlugOrPath="/" />
      {enhanced ? opticalLuxuryLayers : null}
    </div>;
  };
  return (
    <main className={styles.page} data-production-binding="false">
      <header className={styles.header}><div><p className={styles.kicker}>Hero V3 · H3.3 engine laboratory</p><h1>Sacred V2, better engineered</h1><p>The visual identity is unchanged. Compare its accepted engine with controlled light, depth, motion-score and static-fallback improvements.</p></div><p className={styles.status}>productionBinding=false</p></header>
      <nav className={styles.controls} aria-label="H3.3 controls">
        <div className={styles.controlGroup} role="group" aria-label="Engine mode">{MODES.map((entry) => <button key={entry.id} type="button" aria-pressed={mode === entry.id} onClick={() => setMode(entry.id)}>{entry.label}</button>)}</div>
        <div className={styles.controlGroup} role="group" aria-label="Viewport">{VIEWPORTS.map((entry) => <button key={entry.id} type="button" aria-pressed={viewport === entry.id} onClick={() => setViewport(entry.id)}>{entry.label}</button>)}</div>
        <div className={styles.controlGroup} role="group" aria-label="Comparison">{COMPARISONS.map((entry) => <button key={entry.id} type="button" aria-pressed={comparison === entry.id} onClick={() => setComparison(entry.id)}>{entry.label}</button>)}</div>
        <div className={styles.controlGroup} role="group" aria-label="Phase lock">{PHASES.map((entry) => <button key={entry} type="button" aria-pressed={phase === entry} onClick={() => setPhase(entry)}>{entry}</button>)}</div>
        <div className={styles.controlGroup} role="group" aria-label="Layer isolation">{ISOLATIONS.map((entry) => <button key={entry} type="button" aria-pressed={isolation === entry} onClick={() => setIsolation(entry)}>{entry}</button>)}</div>
        <label className={styles.guideToggle}><input type="checkbox" checked={forceFallback} onChange={(event) => setForceFallback(event.target.checked)} />Simulate autoplay failure</label>
      </nav>
      {comparison === "side-by-side" ? <section className={styles.comparisonGrid} aria-label="Synchronized Sacred V2 comparison">
        <div className={styles.stageShell} style={frameStyle}><p className={styles.viewportLabel}>Accepted Sacred V2 · {viewport}</p>{renderStage("v2-reference", baselineRef)}</div>
        <div className={styles.stageShell} style={frameStyle}><p className={styles.viewportLabel}>Perceptual candidate · {phase} · {viewport}</p>{renderStage("h3-3-engine", enhancedRef)}</div>
      </section> : <section className={styles.stageShell} style={frameStyle} aria-label="Sacred V2 engine comparison">
        <p className={styles.viewportLabel}>{comparison === "blink" ? `Blink · ${effectiveMode === "h3-3-engine" ? "Enhanced" : "Sacred V2"}` : MODES.find((entry) => entry.id === effectiveMode)?.label} · {phase} · {viewport}</p>
        {renderStage(effectiveMode, surfaceRef)}
      </section>}
      <aside className={styles.engineBrief}><h2>Reusable engine boundary</h2><p>Future Champagne variants and tenant heroes supply governed brand profiles, grammars and instances. The engine supplies rendering, motion, accessibility and fallbacks without owning their colours, logos or visual desires.</p></aside>
    </main>
  );
}
