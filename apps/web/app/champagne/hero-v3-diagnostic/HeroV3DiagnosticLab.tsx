"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { HeroRendererV2 } from "../../components/hero/v2/HeroRendererV2";
import { HERO_V3_STATIC_CANDIDATE_ID, HeroV3StaticCompositionSurface } from "./HeroV3StaticCompositionSurface";
import styles from "./heroV3Diagnostic.module.css";

const REVIEW_STUDIES = [
  { id: "v2-reference", label: "Accepted Sacred V2" },
  { id: HERO_V3_STATIC_CANDIDATE_ID, label: "Champagne V3 candidate" },
] as const;
const VIEWPORTS = [
  { id: "desktop", label: "Desktop · 1440" },
  { id: "mobile", label: "Mobile · 390" },
] as const;
type ReviewStudyId = (typeof REVIEW_STUDIES)[number]["id"];
type ViewportMode = (typeof VIEWPORTS)[number]["id"];
const isReviewStudy = (value: string | null): value is ReviewStudyId => REVIEW_STUDIES.some(({ id }) => id === value);
const isViewport = (value: string | null): value is ViewportMode => VIEWPORTS.some(({ id }) => id === value);

export function HeroV3DiagnosticLab() {
  const [study, setStudy] = useState<ReviewStudyId>(HERO_V3_STATIC_CANDIDATE_ID);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [showGuides, setShowGuides] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedStudy = params.get("study");
    const requestedViewport = params.get("viewport");
    if (isReviewStudy(requestedStudy)) setStudy(requestedStudy);
    if (isViewport(requestedViewport)) setViewport(requestedViewport);
    setShowGuides(params.get("guides") === "1");
  }, []);

  const updateReview = (nextStudy: ReviewStudyId, nextViewport: ViewportMode) => {
    setStudy(nextStudy);
    setViewport(nextViewport);
    const params = new URLSearchParams(window.location.search);
    params.set("study", nextStudy);
    params.set("viewport", nextViewport);
    params.set("guides", showGuides ? "1" : "0");
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  const frameStyle = { "--h3-frame-width": viewport === "mobile" ? "390px" : "1440px" } as CSSProperties;

  return (
    <main className={styles.page} data-production-binding="false">
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Hero V3 · H3.2R founder review</p>
          <h1>Single static convergence candidate</h1>
          <p>Compare the accepted Sacred V2 baseline with one static V3 composition at its independently art-directed desktop and mobile viewports.</p>
        </div>
        <p className={styles.status}>productionBinding=false · static review only</p>
      </header>

      <nav className={styles.controls} aria-label="Founder review controls">
        <div className={styles.controlGroup} role="group" aria-label="Hero study">
          {REVIEW_STUDIES.map((entry) => (
            <button key={entry.id} type="button" aria-pressed={study === entry.id} onClick={() => updateReview(entry.id, viewport)}>{entry.label}</button>
          ))}
        </div>
        <div className={styles.controlGroup} role="group" aria-label="Viewport">
          {VIEWPORTS.map((entry) => (
            <button key={entry.id} type="button" aria-pressed={viewport === entry.id} onClick={() => updateReview(study, entry.id)}>{entry.label}</button>
          ))}
        </div>
        <label className={styles.guideToggle}>
          <input type="checkbox" checked={showGuides} onChange={(event) => setShowGuides(event.target.checked)} />
          Copy / CTA safe zones
        </label>
      </nav>

      <section className={styles.stageShell} style={frameStyle} aria-label="Hero review surface">
        <p className={styles.viewportLabel}>{REVIEW_STUDIES.find(({ id }) => id === study)?.label} · {viewport}</p>
        <div className={styles.stage} data-h3-study={study} data-h3-viewport={viewport} data-h3-static-review="H3_2R_SINGLE_STATIC_CONVERGENCE">
          {study === HERO_V3_STATIC_CANDIDATE_ID ? <HeroV3StaticCompositionSurface /> : null}
          <HeroRendererV2 prm particles filmGrain diagnosticBoost={false} pageSlugOrPath="/" />
          {showGuides ? (
            <div className={styles.safeZones} aria-hidden="true">
              <span className={styles.copyZone}>Protected copy</span>
              <span className={styles.ctaZone}>Protected CTA</span>
            </div>
          ) : null}
        </div>
      </section>

      <p className={styles.boundaryNote}>Sacred V2 remains the unchanged baseline and fallback. This candidate has no production binding, motion, H3.3 or Tenant-B scope.</p>
    </main>
  );
}
