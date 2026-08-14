"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import componentIndex from "../../data/reconstruction/ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1.json";
import {
  ArchitecturalCta, ClinicianCredentialCard, ClinicianInsightSection, DecisionClaritySection,
  PorcelainConstellationStrip, PorcelainDescentFooter, QuestionFirstPanel, SpectrumConsultationBand,
  type A2ComponentId,
} from "./ReconstructedComponents";
import styles from "./library.module.css";

const VIEWPORTS = [1440, 1024, 768, 390] as const;
const FOUNDER_REVIEW_CANCELLED = true;
const CALIBRATION: Record<string, { nativeWidth: number; nativeHeight: number }> = {
  "A2-DECISION-CLARITY-01": { nativeWidth: 836, nativeHeight: 257 },
  "A2-SPECTRUM-CLOSING-BAND-01": { nativeWidth: 820, nativeHeight: 188 },
  "A2-PORCELAIN-DESCENT-FOOTER-01": { nativeWidth: 1167, nativeHeight: 279 },
};
const FIDELITY_CHECKLIST = ["Shape / silhouette", "Proportions", "Layering", "Surfaces", "Colour distribution", "Typography hierarchy", "Spacing", "Negative space", "Wave / detail", "Density"] as const;
const COMPARE_MODES = ["SIDE_BY_SIDE", "SPLIT", "OVERLAY", "BLINK"] as const;
const DISPOSITIONS = ["APPROVE", "REFINE", "FAIL"] as const;
type ReviewDataset = {
  schema: string; version: number; datasetRevision: number; productionBinding: false;
  sourceKernel: { head: string; tree: string }; reviews: unknown[];
  session: { lastComponentId: string | null; updatedAt: string };
};
type ReviewPersistence = {
  mode: string; canonicalWriteEnabled: boolean; browserStateIsCanonical: false;
  sourcePreferenceCorpusMutable: false; productionBinding: false;
};
const examples: Record<A2ComponentId, ReactNode> = {
  "A2-DECISION-CLARITY-01": <DecisionClaritySection heading="Benefits, limitations and alternatives" intro="Make informed choices with clarity." benefits={["Designed to look, feel and function naturally", "Strong, stable and made to last", "Helps maintain bone and facial support"]} limitations={["Requires healthy gums and adequate bone", "Healing takes time and varies for each person", "Good home care and reviews are essential"]} alternatives={["We will discuss all suitable options, including:", "Bridgework", "Removable options", "No treatment"]} questions={["What are my options?", "How long will it take?", "What does it involve?", "How much does it cost?"]} summary="Implant treatment is a commitment. We are here to help you decide with confidence." action={{ label: "Arrange a consultation", href: "#a2-review" }} />,
  "A2-CLINICIAN-INSIGHT-01": <ClinicianInsightSection heading="Insight from your clinician" body="Use this chapter to place a calm professional explanation beside verified clinician evidence. Every credential remains a real content slot rather than baked-in artwork." related={{ label: "Explore a related treatment", href: "#a2-review" }} credentials={[{ label: "Qualification", detail: "Verified practice content" }, { label: "Registration", detail: "Verified practice content" }, { label: "Clinical focus", detail: "Approved wording required" }]} />,
  "A2-SPECTRUM-CLOSING-BAND-01": <SpectrumConsultationBand heading="Begin with confidence" action={{ label: "Arrange a consultation", href: "#a2-review" }} />,
  "A2-PORCELAIN-DESCENT-FOOTER-01": <PorcelainDescentFooter practiceName="St Mary’s House Dental Care" tagline="Going the extra smile" utilityLinks={[{ label: "Explore treatments", href: "#a2-review" }, { label: "Your first visit", href: "#a2-review" }, { label: "Meet our team", href: "#a2-review" }, { label: "Read our insights", href: "#a2-review" }]} groups={[{ heading: "Care", links: [{ label: "Treatments", href: "#a2-review" }, { label: "Cosmetic Dentistry", href: "#a2-review" }, { label: "Restorative Dentistry", href: "#a2-review" }, { label: "Smile Solutions", href: "#a2-review" }, { label: "Dental Implants", href: "#a2-review" }] }, { heading: "Your visit", links: [{ label: "Your First Visit", href: "#a2-review" }, { label: "Patient Experience", href: "#a2-review" }, { label: "Fees & Finance", href: "#a2-review" }, { label: "Accessibility", href: "#a2-review" }, { label: "Emergency Care", href: "#a2-review" }] }, { heading: "About us", links: [{ label: "Our Practice", href: "#a2-review" }, { label: "Our Team", href: "#a2-review" }, { label: "Our Approach", href: "#a2-review" }, { label: "Why St Mary’s House", href: "#a2-review" }, { label: "Careers", href: "#a2-review" }] }, { heading: "Information", links: [{ label: "Insights", href: "#a2-review" }, { label: "Patient Stories", href: "#a2-review" }, { label: "FAQs", href: "#a2-review" }, { label: "Referrals", href: "#a2-review" }, { label: "Contact Us", href: "#a2-review" }] }]} closingAction={{ label: "Begin your next step", href: "#a2-review" }} legalLinks={[{ label: "Privacy Policy", href: "#a2-review" }, { label: "Cookie Policy", href: "#a2-review" }, { label: "Terms & Conditions", href: "#a2-review" }, { label: "Accessibility", href: "#a2-review" }, { label: "Complaints", href: "#a2-review" }]} />,
  "A2-ARCHITECTURAL-CTA-01": <div className={styles.ctaExamples}><ArchitecturalCta label="Arrange a consultation" href="#a2-review" variant="gold" /><ArchitecturalCta label="Ask a question" href="#a2-review" variant="teal" /><ArchitecturalCta label="Explore treatment options" href="#a2-review" variant="magenta" compact /></div>,
  "A2-CLINICIAN-CREDENTIAL-CARD-01": <ClinicianCredentialCard name="Approved clinician" role="Clinician role supplied by practice" credentials={[{ label: "Qualification", detail: "Verified evidence slot" }, { label: "Registration", detail: "Verified evidence slot" }, { label: "Clinical focus", detail: "Approved wording slot" }]} />,
  "A2-PORCELAIN-CONSTELLATION-STRIP-01": <PorcelainConstellationStrip heading="Details that matter" body="A light information surface for the proof points that help a patient feel informed and reassured." proofItems={[{ label: "Experience", detail: "Approved evidence" }, { label: "Detail", detail: "Confirmed information" }, { label: "Source", detail: "Verified practice truth" }]} />,
  "A2-QUESTION-FIRST-PANEL-01": <div className={styles.panelExample}><QuestionFirstPanel question="Not sure which option is right for you?" action={{ label: "Ask a question", href: "#a2-review" }} /></div>,
};

export function ReconstructionLibrary({ initialReviewDataset, reviewPersistence }: { initialReviewDataset: ReviewDataset; reviewPersistence: ReviewPersistence }) {
  const reviewDataset = initialReviewDataset;
  const [selectedId, setSelectedId] = useState<A2ComponentId>((initialReviewDataset.session.lastComponentId as A2ComponentId | null) ?? "A2-DECISION-CLARITY-01");
  const [viewport, setViewport] = useState<number>(836);
  const [compareMode, setCompareMode] = useState<(typeof COMPARE_MODES)[number]>("SIDE_BY_SIDE");
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [blinkSource, setBlinkSource] = useState(true);
  const [directorChecks, setDirectorChecks] = useState<Record<string, Record<string, boolean>>>({});
  const progress = { complete: reviewDataset.reviews.length, total: componentIndex.components.length };
  const selected = componentIndex.components.find((component) => component.componentId === selectedId);
  if (!selected) throw new Error(`Missing A2 component metadata: ${selectedId}`);
  const calibration = CALIBRATION[selectedId];
  const calibrationIds = Object.keys(CALIBRATION);

  useEffect(() => {
    if (!calibration) return;
    setViewport(calibration.nativeWidth);
    setCompareMode("SIDE_BY_SIDE");
    setOverlayOpacity(50); setZoom(100); setPan({ x: 0, y: 0 }); setBlinkSource(true);
  }, [calibration, selectedId]);

  useEffect(() => {
    if (compareMode !== "BLINK") return;
    const timer = window.setInterval(() => setBlinkSource((value) => !value), 650);
    return () => window.clearInterval(timer);
  }, [compareMode]);

  const move = (direction: -1 | 1) => {
    const list = componentIndex.components.filter((component) => calibrationIds.includes(component.componentId));
    const index = Math.max(0, list.findIndex((component) => component.componentId === selectedId));
    setSelectedId(list[(index + direction + list.length) % list.length].componentId as A2ComponentId);
  };

  if (!FOUNDER_REVIEW_CANCELLED || reviewDataset.reviews.length !== 0 || reviewPersistence.productionBinding) {
    throw new Error("A2H requires cancelled Founder review, a 0/8 reconstruction dataset, and productionBinding=false");
  }

  return (
    <section className={styles.library} data-testid="a2-component-library" id="a2-review">
      <header className={styles.libraryHeader}><span>A2H · HYBRID FIDELITY CALIBRATION</span><h1>Preserve the designed object. Keep its meaning live.</h1><p>Exactly three LOVE references combine accessible semantic components with measured, source-derived decorative layers. The original PNG remains comparison evidence only; no reconstruction disposition will be written in this tranche.</p><strong>MAIN_DIRECTORATE_HYBRID_FIDELITY_REVIEW_REQUIRED · A2R remains {progress.complete} / {progress.total}</strong></header>
      <div className={styles.cancelledGate}><strong>FOUNDER A2R REVIEW CANCELLED</strong><span>Dataset frozen at 0 / 8 · no fabricated Founder decisions · A3 not authorised · productionBinding=false</span></div>
      <div className={styles.libraryLayout}>
        <aside className={styles.componentRail} aria-label="A2H calibration component index">
          {componentIndex.components.map((component) => { const inScope = calibrationIds.includes(component.componentId); return <button key={component.componentId} type="button" disabled={!inScope} aria-current={component.componentId === selectedId ? "true" : undefined} onClick={() => setSelectedId(component.componentId as A2ComponentId)}><span>{inScope ? "A2H HYBRID CALIBRATION" : "FROZEN · NOT IN A2H"} · SOURCE {component.founderSignal}</span><strong>{component.componentId}</strong><small>{component.semanticRole}</small></button>; })}
        </aside>
        <main className={styles.inspector}>
          <header className={styles.componentHeader}><div><span>A2H_HYBRID_SOURCE_FIDELITY_CALIBRATION</span><h2>{selected.exportName}</h2><p>{selected.semanticRole} · source <code>{selected.sourceCvaId}</code></p></div><div className={styles.authorities}><strong>SOURCE PREFERENCE = {selected.founderSignal}</strong><strong>HYBRID FIDELITY = PENDING</strong><small>READY_FOR_FOUNDER_RECONSTRUCTION_REVIEW=false</small></div></header>
          {calibration ? <section className={styles.fidelityWorkbench} aria-label="Director source fidelity workbench">
            <header className={styles.workbenchHeader}><div><strong>LOCKED SOURCE ↔ LIVE FRAME</strong><span>Source/native {calibration.nativeWidth} × {calibration.nativeHeight} · exact viewport {viewport}px</span></div><a href={selected.sourceAsset} target="_blank" rel="noreferrer">Open source at native size</a></header>
            <div className={styles.workbenchControls}>
              <div role="group" aria-label="Comparison mode">{COMPARE_MODES.map((mode) => <button key={mode} type="button" aria-pressed={compareMode === mode} onClick={() => setCompareMode(mode)}>{mode.replaceAll("_", " ")}</button>)}</div>
              <label>Source overlay <input aria-label="Source overlay opacity" type="range" min="0" max="100" value={overlayOpacity} onChange={(event) => setOverlayOpacity(Number(event.target.value))} /><output>{overlayOpacity}%</output></label>
              <div role="group" aria-label="Locked zoom and pan"><button type="button" onClick={() => setZoom((value) => Math.max(50, value - 10))}>− Zoom</button><strong>{zoom}%</strong><button type="button" onClick={() => setZoom((value) => Math.min(200, value + 10))}>+ Zoom</button><button type="button" onClick={() => setPan((value) => ({ ...value, x: value.x - 12 }))}>←</button><button type="button" onClick={() => setPan((value) => ({ ...value, x: value.x + 12 }))}>→</button><button type="button" onClick={() => setPan((value) => ({ ...value, y: value.y - 12 }))}>↑</button><button type="button" onClick={() => setPan((value) => ({ ...value, y: value.y + 12 }))}>↓</button><button type="button" onClick={() => { setZoom(100); setPan({ x: 0, y: 0 }); }}>Reset</button></div>
            </div>
            <div className={styles.viewportControls} aria-label="Exact comparison viewport widths"><button type="button" aria-pressed={viewport === calibration.nativeWidth} onClick={() => setViewport(calibration.nativeWidth)}>SOURCE {calibration.nativeWidth}<small>native</small></button>{VIEWPORTS.map((width) => <button key={width} type="button" aria-label={String(width)} aria-pressed={viewport === width} onClick={() => setViewport(width)}>{width}<small>adaptive</small></button>)}</div>
            <div className={styles.lockedCanvas} data-mode={compareMode} data-native={viewport === calibration.nativeWidth} style={{ "--source-opacity": overlayOpacity / 100, "--frame-ratio": `${calibration.nativeWidth} / ${calibration.nativeHeight}`, "--exact-width": `${viewport}px`, "--locked-zoom": zoom / 100, "--pan-x": `${pan.x}px`, "--pan-y": `${pan.y}px` } as CSSProperties}>
              <figure className={styles.sourceFrame} data-visible={compareMode !== "BLINK" || blinkSource}><figcaption>SOURCE PNG · visual evidence only</figcaption><div><img src={selected.sourceAsset} alt={`${selected.sourceCvaId} source visual reference`} /></div></figure>
              <figure className={styles.liveFrame} data-visible={compareMode !== "BLINK" || !blinkSource}><figcaption>LIVE HYBRID · semantic code + source-derived decoration · no source PNG body</figcaption><div><div className={styles.previewFrame} data-testid="a2-component-render" style={{ width: `${viewport}px` }}>{examples[selectedId]}</div></div></figure>
            </div>
            <fieldset className={styles.directorChecklist}><legend>Director fidelity checklist · observation only, no automated artistic score</legend>{FIDELITY_CHECKLIST.map((item) => <label key={item}><input type="checkbox" checked={Boolean(directorChecks[selectedId]?.[item])} onChange={(event) => setDirectorChecks((current) => ({ ...current, [selectedId]: { ...current[selectedId], [item]: event.target.checked } }))} /><span>{item}</span></label>)}</fieldset>
            <div className={styles.stageGate}><strong>DIRECTOR_HYBRID_FIDELITY_PASS_FOR_FOUNDER_REVIEW = NOT GRANTED</strong><span>Main Directorate evidence only. Founder review and promotion remain unavailable.</span></div>
          </section> : <section className={styles.outOfScope}><strong>FROZEN A2 CANDIDATE</strong><p>This component is not one of the three authorised A2H calibration references and has not been rebuilt.</p></section>}
          <details className={styles.cancelledReview}><summary>Preserved A2R Founder review machinery · cancelled at {progress.complete} / {progress.total}</summary><p>APPROVE / REFINE / FAIL and verbatim Founder notes remain implemented in the accepted A2R line. They are intentionally disabled here. The canonical reconstruction-review dataset remains unchanged with zero reviews.</p><div className={styles.dispositions} data-testid="a2r-dispositions">{DISPOSITIONS.map((value) => <button key={value} type="button" disabled>{value}</button>)}</div></details>
          <section className={styles.metadata}><div><h3>Why this reference</h3><p>{selected.rationale}</p></div><div><h3>Content slots</h3><p>{selected.contentSlots.join(" · ")}</p></div><div><h3>Responsive truth</h3><p>{Object.entries(selected.responsiveBehaviour).map(([width, behaviour]) => `${width}: ${behaviour}`).join(" · ")}</p></div><div><h3>Known limits</h3><p>{selected.knownLimits.length ? selected.knownLimits.join(" ") : "No material source quality is knowingly omitted at this reconstruction maturity."}</p></div></section>
          <footer className={styles.reviewNavigation}><button type="button" onClick={() => move(-1)}>← Previous calibration</button><strong>{calibrationIds.indexOf(selectedId) + 1} / {calibrationIds.length}</strong><button type="button" onClick={() => move(1)}>Next calibration →</button></footer>
        </main>
      </div>
      <section className={styles.checkpoint}><div><span>FROZEN · DATASET REVISION {reviewDataset.datasetRevision}</span><h2>Separate A2R checkpoint preserved</h2><p>{reviewDataset.reviews.length} Founder reconstruction decisions. Import, export and persistence code remain in the accepted A2R implementation, but writes are disabled throughout A2H calibration.</p></div><strong>0 / 8 · SOURCE PREFERENCE CORPUS UNCHANGED</strong></section>
    </section>
  );
}
