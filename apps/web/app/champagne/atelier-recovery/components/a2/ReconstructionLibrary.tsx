"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import componentIndex from "../../data/reconstruction/ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1.json";
import {
  ArchitecturalCta, ClinicianCredentialCard, ClinicianInsightSection, DecisionClaritySection,
  PorcelainConstellationStrip, PorcelainDescentFooter, QuestionFirstPanel, SpectrumConsultationBand,
  type A2ComponentId,
} from "./ReconstructedComponents";
import styles from "./library.module.css";
import {
  applyReconstructionReview, currentReconstructionReviewMap, deriveReconstructionReviewProgress,
  deterministicReconstructionReviewExport, EMPTY_FIDELITY_FLAGS, FIDELITY_FLAG_KEYS,
  validateReconstructionReviewDataset,
} from "../../data/reconstruction-review/reconstruction-review-model.mjs";

const VIEWPORTS = [1440, 1024, 768, 390] as const;
const DISPOSITIONS = ["APPROVE", "REFINE", "FAIL"] as const;
const FILTERS = ["ALL", "ONLY_UNREVIEWED", "APPROVED", "REFINE", "FAILED"] as const;
const WORKING_COPY_KEY = "champagne-atelier-a2r-working-copy-v1";
const FLAG_LABELS: Record<string, string> = {
  lostColour: "Lost colour", lostSurfaceMaterialCharacter: "Lost surface/material character",
  lostComposition: "Lost composition", lostGeometry: "Lost geometry", lostTypography: "Lost typography",
  lostSpacingDensity: "Lost spacing/density", lostImageryTreatment: "Lost imagery treatment",
  lostWaveLayering: "Lost wave/layering", lostLuminosity: "Lost luminosity", tooGeneric: "Too generic",
  tooDark: "Too dark", tooWashedOut: "Too washed out", interactionIssue: "Interaction issue",
  responsiveIssue: "Responsive issue",
};

type Review = {
  reviewId: string; componentId: string; sourceCvaId: string; sourceFounderRating: string;
  status: string; disposition: "APPROVE" | "REFINE" | "FAIL"; fidelityFlags: Record<string, boolean>;
  founderNote: string; reviewedResponsiveViewports: number[]; timestamp: string; version: number; supersedes: string | null;
};
type ReviewDataset = {
  schema: string; version: number; datasetRevision: number; productionBinding: false;
  sourceKernel: { head: string; tree: string }; reviews: Review[];
  session: { lastComponentId: string | null; updatedAt: string };
};
type ReviewPersistence = {
  mode: string; canonicalWriteEnabled: boolean; browserStateIsCanonical: false;
  sourcePreferenceCorpusMutable: false; productionBinding: false;
};
type Draft = { fidelityFlags: Record<string, boolean>; founderNote: string; reviewedResponsiveViewports: number[] };

function storeA2rWorkingCopy(dataset: ReviewDataset) {
  try { localStorage.setItem(WORKING_COPY_KEY, deterministicReconstructionReviewExport(dataset)); return true; }
  catch { return false; }
}

const examples: Record<A2ComponentId, ReactNode> = {
  "A2-DECISION-CLARITY-01": <DecisionClaritySection heading="Benefits, limitations and alternatives" intro="Make an informed choice with clear questions for your consultation." benefits={["Potential advantages to discuss", "What the option is intended to address", "How it may fit your priorities"]} limitations={["Suitability is individual", "Maintenance and review matter", "Outcomes cannot be guaranteed"]} alternatives={["Other treatment approaches", "Monitoring where appropriate", "Choosing no treatment"]} questions={["What are my options?", "How long might it take?", "What would follow-up involve?"]} summary="A consultation should explain the reasonable options, their limitations and what matters for your circumstances." action={{ label: "Arrange a consultation", href: "#a2-review" }} />,
  "A2-CLINICIAN-INSIGHT-01": <ClinicianInsightSection heading="Insight from your clinician" body="Use this chapter to place a calm professional explanation beside verified clinician evidence. Every credential remains a real content slot rather than baked-in artwork." related={{ label: "Explore a related treatment", href: "#a2-review" }} credentials={[{ label: "Qualification", detail: "Verified practice content" }, { label: "Registration", detail: "Verified practice content" }, { label: "Clinical focus", detail: "Approved wording required" }]} />,
  "A2-SPECTRUM-CLOSING-BAND-01": <SpectrumConsultationBand heading="Begin with confidence" action={{ label: "Arrange a consultation", href: "#a2-review" }} />,
  "A2-PORCELAIN-DESCENT-FOOTER-01": <PorcelainDescentFooter practiceName="St Mary’s House Dental Care" tagline="Thoughtful dentistry in Shoreham-by-Sea" groups={[{ heading: "Care", links: [{ label: "Treatments", href: "#a2-review" }, { label: "Nervous patients", href: "#a2-review" }] }, { heading: "Practice", links: [{ label: "Our team", href: "#a2-review" }, { label: "About St Mary’s House", href: "#a2-review" }] }, { heading: "Plan", links: [{ label: "Fees", href: "#a2-review" }, { label: "Contact", href: "#a2-review" }] }, { heading: "Visit", links: [{ label: "Directions", href: "#a2-review" }, { label: "Accessibility", href: "#a2-review" }] }]} closingAction={{ label: "Arrange your next step", href: "#a2-review" }} legalLinks={[{ label: "Privacy", href: "#a2-review" }, { label: "Cookies", href: "#a2-review" }]} />,
  "A2-ARCHITECTURAL-CTA-01": <div className={styles.ctaExamples}><ArchitecturalCta label="Arrange a consultation" href="#a2-review" variant="gold" /><ArchitecturalCta label="Ask a question" href="#a2-review" variant="teal" /><ArchitecturalCta label="Explore treatment options" href="#a2-review" variant="magenta" compact /></div>,
  "A2-CLINICIAN-CREDENTIAL-CARD-01": <ClinicianCredentialCard name="Approved clinician" role="Clinician role supplied by practice" credentials={[{ label: "Qualification", detail: "Verified evidence slot" }, { label: "Registration", detail: "Verified evidence slot" }, { label: "Clinical focus", detail: "Approved wording slot" }]} />,
  "A2-PORCELAIN-CONSTELLATION-STRIP-01": <PorcelainConstellationStrip heading="Details that matter" body="A light information surface for the proof points that help a patient feel informed and reassured." proofItems={[{ label: "Experience", detail: "Approved evidence" }, { label: "Detail", detail: "Confirmed information" }, { label: "Source", detail: "Verified practice truth" }]} />,
  "A2-QUESTION-FIRST-PANEL-01": <div className={styles.panelExample}><QuestionFirstPanel question="Not sure which option is right for you?" action={{ label: "Ask a question", href: "#a2-review" }} /></div>,
};

export function ReconstructionLibrary({ initialReviewDataset, reviewPersistence }: { initialReviewDataset: ReviewDataset; reviewPersistence: ReviewPersistence }) {
  const [reviewDataset, setReviewDataset] = useState(initialReviewDataset);
  const [selectedId, setSelectedId] = useState<A2ComponentId>((initialReviewDataset.session.lastComponentId as A2ComponentId | null) ?? "A2-DECISION-CLARITY-01");
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]>(1440);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [saveState, setSaveState] = useState<"saved" | "saving" | "local" | "error">(reviewPersistence.canonicalWriteEnabled ? "saved" : "local");
  const [saveMessage, setSaveMessage] = useState(reviewPersistence.canonicalWriteEnabled ? "Authoritative checkpoint ready" : "Browser working copy · export checkpoint to reconcile");
  const importInput = useRef<HTMLInputElement>(null);
  const saveQueue = useRef(Promise.resolve());
  const currentReviews = useMemo(() => currentReconstructionReviewMap(reviewDataset) as Map<string, Review>, [reviewDataset]);
  const progress = useMemo(() => deriveReconstructionReviewProgress(reviewDataset, componentIndex), [reviewDataset]);
  const filteredComponents = useMemo(() => componentIndex.components.filter((component) => {
    const review = currentReviews.get(component.componentId);
    if (filter === "ONLY_UNREVIEWED") return !review;
    if (filter === "APPROVED") return review?.disposition === "APPROVE";
    if (filter === "REFINE") return review?.disposition === "REFINE";
    if (filter === "FAILED") return review?.disposition === "FAIL";
    return true;
  }), [currentReviews, filter]);
  const selected = componentIndex.components.find((component) => component.componentId === selectedId);
  if (!selected) throw new Error(`Missing A2 component metadata: ${selectedId}`);
  const currentReview = currentReviews.get(selectedId);
  const defaultDraft: Draft = {
    fidelityFlags: { ...(currentReview?.fidelityFlags ?? EMPTY_FIDELITY_FLAGS) },
    founderNote: currentReview?.founderNote ?? "",
    reviewedResponsiveViewports: [...(currentReview?.reviewedResponsiveViewports ?? [])],
  };
  const draft = drafts[selectedId] ?? defaultDraft;

  const persist = useCallback((next: ReviewDataset) => {
    const retained = storeA2rWorkingCopy(next);
    if (!reviewPersistence.canonicalWriteEnabled) {
      setSaveState(retained ? "local" : "error"); setSaveMessage(retained ? "Browser working copy · export checkpoint to reconcile" : "Browser storage unavailable · export checkpoint now"); return;
    }
    setSaveState("saving"); setSaveMessage("Writing authoritative checkpoint…");
    saveQueue.current = saveQueue.current.then(async () => {
      const response = await fetch("/champagne/atelier-recovery/api/reconstruction-reviews", {
        method: "PUT", headers: { "content-type": "application/json" },
        body: JSON.stringify({ dataset: next, expectedRevision: next.datasetRevision - 1 }),
      });
      if (!response.ok) throw new Error(`Checkpoint write failed (${response.status})`);
      const body = await response.json() as { dataset: ReviewDataset };
      setReviewDataset(body.dataset); setSaveState("saved"); setSaveMessage("Authoritative checkpoint saved");
    }).catch((error: unknown) => { setSaveState("error"); setSaveMessage(error instanceof Error ? error.message : "Checkpoint write failed"); });
  }, [reviewPersistence.canonicalWriteEnabled]);

  const commitReview = useCallback((componentId: A2ComponentId, patch: Partial<Review> & { disposition?: Review["disposition"] }, nextDraft?: Draft) => {
    const component = componentIndex.components.find((candidate) => candidate.componentId === componentId);
    if (!component) return;
    const effective = nextDraft ?? drafts[componentId] ?? {
      fidelityFlags: { ...EMPTY_FIDELITY_FLAGS }, founderNote: "", reviewedResponsiveViewports: [],
    };
    const next = applyReconstructionReview(reviewDataset, componentIndex, componentId, {
      disposition: patch.disposition,
      fidelityFlags: patch.fidelityFlags ?? effective.fidelityFlags,
      founderNote: patch.founderNote ?? effective.founderNote,
      reviewedResponsiveViewports: patch.reviewedResponsiveViewports ?? effective.reviewedResponsiveViewports,
    });
    setReviewDataset(next); persist(next);
  }, [drafts, persist, reviewDataset]);

  const updateDraft = (change: Partial<Draft>) => {
    const nextDraft = { ...draft, ...change };
    setDrafts((current) => ({ ...current, [selectedId]: nextDraft }));
  };

  const selectViewport = (width: (typeof VIEWPORTS)[number]) => {
    setViewport(width);
    if (!draft.reviewedResponsiveViewports.includes(width)) {
      updateDraft({ reviewedResponsiveViewports: [...draft.reviewedResponsiveViewports, width] });
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem(WORKING_COPY_KEY);
    if (!raw) return;
    try {
      const restored = JSON.parse(raw) as ReviewDataset;
      validateReconstructionReviewDataset(restored, componentIndex);
      if (restored.datasetRevision >= initialReviewDataset.datasetRevision) {
        setReviewDataset(restored);
        if (restored.session.lastComponentId) setSelectedId(restored.session.lastComponentId as A2ComponentId);
        setSaveState(reviewPersistence.canonicalWriteEnabled ? "saved" : "local");
        setSaveMessage(reviewPersistence.canonicalWriteEnabled ? "Authoritative checkpoint restored" : "Browser working copy restored · export to reconcile");
      }
    } catch { localStorage.removeItem(WORKING_COPY_KEY); }
  }, [initialReviewDataset.datasetRevision, reviewPersistence.canonicalWriteEnabled]);

  useEffect(() => {
    if (filteredComponents.length && !filteredComponents.some((component) => component.componentId === selectedId)) {
      setSelectedId(filteredComponents[0].componentId as A2ComponentId);
    }
  }, [filter, filteredComponents, selectedId]);

  const move = (direction: -1 | 1) => {
    const list = filteredComponents.length ? filteredComponents : componentIndex.components;
    const index = Math.max(0, list.findIndex((component) => component.componentId === selectedId));
    setSelectedId(list[(index + direction + list.length) % list.length].componentId as A2ComponentId);
  };

  const exportCheckpoint = () => {
    const blob = new Blob([deterministicReconstructionReviewExport(reviewDataset)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "ATELIER_FOUNDER_RECONSTRUCTION_REVIEW_DATASET_V1.json"; anchor.click(); URL.revokeObjectURL(url);
  };

  const importCheckpoint = async (file?: File) => {
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text()) as ReviewDataset;
      validateReconstructionReviewDataset(imported, componentIndex);
      if (imported.datasetRevision < reviewDataset.datasetRevision) throw new Error("Imported checkpoint is older than the active working copy");
      setReviewDataset(imported);
      const retained = storeA2rWorkingCopy(imported);
      setSaveState(retained ? "local" : "error"); setSaveMessage(retained ? "Imported checkpoint verified · save or export to reconcile" : "Checkpoint verified but browser storage is unavailable · export now");
    } catch (error) { setSaveState("error"); setSaveMessage(error instanceof Error ? error.message : "Checkpoint import failed"); }
    if (importInput.current) importInput.current.value = "";
  };

  const recurringLosses = FIDELITY_FLAG_KEYS.map((key: string) => ({ key, count: [...currentReviews.values()].filter((review) => review.fidelityFlags[key]).length })).filter((entry: { count: number }) => entry.count > 0).sort((a: { count: number }, b: { count: number }) => b.count - a.count);
  const kernelGap = recurringLosses.some((entry: { count: number }) => entry.count >= 3);

  return (
    <section className={styles.library} data-testid="a2-component-library" id="a2-review">
      <header className={styles.libraryHeader}><span>A2R · FOUNDER RECONSTRUCTION REVIEW</span><h1>Judge the source and the reconstruction separately.</h1><p>Eight bounded reconstructions remain experimental. A loved source may still have a failed reconstruction: this review records fidelity without altering the canonical source-preference corpus.</p><strong>{progress.complete} / {progress.total} reconstruction reviews complete</strong></header>
      <nav className={styles.filters} aria-label="Reconstruction review filters">{FILTERS.map((value) => <button type="button" key={value} aria-label={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value.replaceAll("_", " ")}</button>)}</nav>
      <div className={styles.libraryLayout}>
        <aside className={styles.componentRail} aria-label="Reconstructed component index">
          {filteredComponents.length ? filteredComponents.map((component) => { const review = currentReviews.get(component.componentId); return <button key={component.componentId} type="button" aria-current={component.componentId === selectedId ? "true" : undefined} onClick={() => setSelectedId(component.componentId as A2ComponentId)}><span>SOURCE {component.founderSignal}{review ? ` · ${review.disposition}` : " · UNREVIEWED"}</span><strong>{component.componentId}</strong><small>{component.semanticRole}</small></button>; }) : <p className={styles.emptyFilter}>No components match this filter.</p>}
        </aside>
        <main className={styles.inspector}>
          <header className={styles.componentHeader}><div><span>{componentIndex.maturity}</span><h2>{selected.exportName}</h2><p>{selected.semanticRole} · source <code>{selected.sourceCvaId}</code></p></div><div className={styles.authorities}><strong>SOURCE PREFERENCE = {selected.founderSignal}</strong><strong>RECONSTRUCTION = {currentReview?.disposition ?? "UNREVIEWED"}</strong><small>productionBinding=false</small></div></header>
          <div className={styles.comparisonWorkbench}>
            <figure className={styles.sourceEvidence}><figcaption><strong>Source reference PNG · authoritative evidence</strong><a href={selected.sourceAsset} target="_blank" rel="noreferrer">Open source full size</a></figcaption><img src={selected.sourceAsset} alt={`${selected.sourceCvaId} source visual reference`} /></figure>
            <section className={styles.liveEvidence} aria-label="Live reconstructed component"><header><strong>Live code-native reconstruction</strong><span>No source PNG in component body</span></header><div className={styles.viewportControls} aria-label="Responsive preview widths">{VIEWPORTS.map((width) => <button key={width} type="button" aria-label={String(width)} aria-pressed={viewport === width} data-reviewed={draft.reviewedResponsiveViewports.includes(width)} onClick={() => selectViewport(width)}>{width}<small aria-hidden="true">{draft.reviewedResponsiveViewports.includes(width) ? "reviewed" : "inspect"}</small></button>)}</div><div className={styles.previewStage} data-viewport={viewport}><div className={styles.previewFrame} data-testid="a2-component-render" style={{ width: `min(100%, ${viewport}px)` }}>{examples[selectedId]}</div></div></section>
          </div>
          <section className={styles.reviewPanel} aria-label="Founder reconstruction fidelity review">
            <header><div><span>RECONSTRUCTION DISPOSITION</span><h3>Does the live component preserve the source grammar?</h3></div><p>{saveMessage}</p></header>
            <div className={styles.dispositions} data-testid="a2r-dispositions">{DISPOSITIONS.map((value) => <button key={value} type="button" aria-pressed={currentReview?.disposition === value} onClick={() => commitReview(selectedId, { disposition: value }, draft)}>{value}</button>)}</div>
            <fieldset className={styles.flags}><legend>Quick fidelity evidence · especially for REFINE or FAIL</legend>{FIDELITY_FLAG_KEYS.map((key: string) => <label key={key}><input type="checkbox" checked={Boolean(draft.fidelityFlags[key])} onChange={(event) => updateDraft({ fidelityFlags: { ...draft.fidelityFlags, [key]: event.target.checked } })} /><span>{FLAG_LABELS[key]}</span></label>)}</fieldset>
            <label className={styles.note}><span>Verbatim Founder note</span><textarea aria-label="Verbatim Founder note" rows={8} value={draft.founderNote} onChange={(event) => updateDraft({ founderNote: event.target.value })} placeholder="The original is LOVE but this reconstruction has become flat and generic." /><small>Stored exactly as entered. Select a disposition—or save the current one—to commit all evidence without rewriting the source-preference corpus.</small></label>
            {currentReview ? <button className={styles.saveEvidence} type="button" onClick={() => commitReview(selectedId, { disposition: currentReview.disposition }, draft)}>Save current disposition + evidence</button> : null}
            <details className={styles.history}><summary>Supersession history · {reviewDataset.reviews.filter((review) => review.componentId === selectedId).length} version(s)</summary>{reviewDataset.reviews.filter((review) => review.componentId === selectedId).map((review) => <p key={review.reviewId}><strong>v{review.version} · {review.disposition}</strong><span>{review.timestamp} · {review.status}{review.supersedes ? ` · supersedes ${review.supersedes}` : ""}</span></p>)}</details>
          </section>
          <section className={styles.metadata}><div><h3>Why this reference</h3><p>{selected.rationale}</p></div><div><h3>Content slots</h3><p>{selected.contentSlots.join(" · ")}</p></div><div><h3>Responsive truth</h3><p>{Object.entries(selected.responsiveBehaviour).map(([width, behaviour]) => `${width}: ${behaviour}`).join(" · ")}</p></div><div><h3>Known limits</h3><p>{selected.knownLimits.length ? selected.knownLimits.join(" ") : "No material source quality is knowingly omitted at this reconstruction maturity."}</p></div></section>
          <footer className={styles.reviewNavigation}><button type="button" onClick={() => move(-1)}>← Previous</button><strong>{componentIndex.components.findIndex((component) => component.componentId === selectedId) + 1} / {componentIndex.components.length}</strong><button type="button" onClick={() => move(1)}>Next →</button></footer>
        </main>
      </div>
      <section className={styles.checkpoint}><div><span>{saveState.toUpperCase()} · DATASET REVISION {reviewDataset.datasetRevision}</span><h2>Separate A2R checkpoint</h2><p>APPROVE is only eligible for promotion after persistence and integrity checks. REFINE carries exact changes forward. FAIL never contributes positive grammar to A3.</p></div><div><button type="button" onClick={exportCheckpoint}>Export checkpoint</button><button type="button" onClick={() => importInput.current?.click()}>Import checkpoint</button><input ref={importInput} type="file" accept="application/json" hidden onChange={(event) => void importCheckpoint(event.target.files?.[0])} /></div></section>
      {progress.complete === progress.total && <section className={styles.gateSummary} data-testid="a3-gate-summary"><span>A3 GATE · REVIEW EVIDENCE COMPLETE</span><h2>{kernelGap ? "RECONSTRUCTION_KERNEL_GAP" : "FOUNDER_RECONSTRUCTION_REVIEWS_COMPLETE_A3_GATE_REQUIRED"}</h2><p>{progress.counts.APPROVE} approved · {progress.counts.REFINE} refine · {progress.counts.FAIL} failed.</p><p>{recurringLosses.length ? `Recurring fidelity losses: ${recurringLosses.map((entry: { key: string; count: number }) => `${FLAG_LABELS[entry.key]} (${entry.count})`).join(" · ")}` : "No recurring fidelity loss was flagged."}</p><strong>A3 remains unauthorised pending Main Directorate review.</strong></section>}
    </section>
  );
}
