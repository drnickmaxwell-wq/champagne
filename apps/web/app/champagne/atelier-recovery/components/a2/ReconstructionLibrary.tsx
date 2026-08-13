"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import componentIndex from "../../data/reconstruction/ATELIER_A2_RECONSTRUCTED_COMPONENT_INDEX_V1.json";
import {
  ArchitecturalCta, ClinicianCredentialCard, ClinicianInsightSection, DecisionClaritySection,
  PorcelainConstellationStrip, PorcelainDescentFooter, QuestionFirstPanel, SpectrumConsultationBand,
  type A2ComponentId,
} from "./ReconstructedComponents";
import styles from "./library.module.css";

const VIEWPORTS = [1440, 1024, 768, 390] as const;

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

export function ReconstructionLibrary() {
  const [selectedId, setSelectedId] = useState<A2ComponentId>("A2-DECISION-CLARITY-01");
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]>(1440);
  const selected = componentIndex.components.find((component) => component.componentId === selectedId);
  if (!selected) throw new Error(`Missing A2 component metadata: ${selectedId}`);

  return (
    <section className={styles.library} data-testid="a2-component-library" id="a2-review">
      <header className={styles.libraryHeader}><span>A2 · RECONSTRUCTION KERNEL</span><h1>Reference evidence, rebuilt as working Champagne components.</h1><p>Eight bounded reconstructions. Source artwork is shown only as evidence; every live component below is code-native, adaptive and still awaiting Founder approval.</p></header>
      <div className={styles.libraryLayout}>
        <aside className={styles.componentRail} aria-label="Reconstructed component index">
          {componentIndex.components.map((component) => <button key={component.componentId} type="button" aria-current={component.componentId === selectedId ? "true" : undefined} onClick={() => setSelectedId(component.componentId as A2ComponentId)}><span>{component.founderSignal}</span><strong>{component.componentId}</strong><small>{component.semanticRole}</small></button>)}
        </aside>
        <main className={styles.inspector}>
          <header className={styles.componentHeader}><div><span>{componentIndex.maturity}</span><h2>{selected.exportName}</h2><p>{selected.semanticRole} · source <code>{selected.sourceCvaId}</code></p></div><strong>productionBinding=false</strong></header>
          <div className={styles.comparison}>
            <figure className={styles.sourceEvidence}><figcaption><strong>Source reference</strong><span>PNG evidence only</span></figcaption><img src={selected.sourceAsset} alt={`${selected.sourceCvaId} source visual reference`} /></figure>
            <section className={styles.liveEvidence} aria-label="Live reconstructed component"><header><strong>Code-native reconstruction</strong><span>No source PNG in component body</span></header><div className={styles.viewportControls} aria-label="Responsive preview widths">{VIEWPORTS.map((width) => <button key={width} type="button" aria-pressed={viewport === width} onClick={() => setViewport(width)}>{width}</button>)}</div></section>
          </div>
          <div className={styles.previewStage} data-viewport={viewport}><div className={styles.previewFrame} data-testid="a2-component-render" style={{ width: `min(100%, ${viewport}px)` }}>{examples[selectedId]}</div></div>
          <section className={styles.metadata}><div><h3>Why this reference</h3><p>{selected.rationale}</p></div><div><h3>Content slots</h3><p>{selected.contentSlots.join(" · ")}</p></div><div><h3>Responsive truth</h3><p>{Object.entries(selected.responsiveBehaviour).map(([width, behaviour]) => `${width}: ${behaviour}`).join(" · ")}</p></div><div><h3>Known limits</h3><p>{selected.knownLimits.length ? selected.knownLimits.join(" ") : "No material source quality is knowingly omitted at this reconstruction maturity."}</p></div></section>
        </main>
      </div>
    </section>
  );
}
