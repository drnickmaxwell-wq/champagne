"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import architecturalClosingConcept from "../assets/st-marys-architectural-closing-concept-v1.png";
import type { BrandDecision } from "../data/atelier-convergence";
import type { AtelierContentSection, AtelierPageKey } from "../data/content-bundle-adapter";
import { TEMPORAL_SIMULATIONS, type AtelierTime } from "../data/temporal-simulation";

type ClosingPlacement = "PRE_FOOTER_CLOSING_SECTION" | "FULL_FOOTER";
type ClosingTreatment = "PERSIAN_ARCHITECTURAL" | "PORCELAIN_GALLERY" | "GILDED_BRAND_GOLD";
type PlacedSection = AtelierContentSection & { archiveId?: string };
type LabStyle = CSSProperties & Record<`--${string}`, string>;
export type ArtDirectionVariant = "a" | "b";
export type ArtDirectionSelections = Record<string, ArtDirectionVariant>;

export type AtelierPreviewState = {
  page: AtelierPageKey;
  sections: PlacedSection[];
  selected: string;
  cleanPreview: boolean;
  time: AtelierTime;
  brandDecision: BrandDecision;
  canvasStyle: LabStyle;
  closingPlacement: ClosingPlacement;
  closingTreatment: ClosingTreatment;
  artDirections: ArtDirectionSelections;
  experiment: { id: string; domain: "webpage" | "concierge"; semanticOwner: string; family: "aperture" | "folio" | "luminous" | "monolith"; scope: string; targetKind: "page" | "section" | "component" | "concierge-surface"; pageKey: AtelierPageKey | null; componentId: string | null } | null;
};

const assetFor = (id: string) => `/assets/champagne/design-lab/v27/${id}.png`;

export function AtelierPreviewDocument({ heroes }: { heroes: Record<AtelierPageKey, ReactNode> }) {
  const [state, setState] = useState<AtelierPreviewState | null>(null);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === "CHAMPAGNE_ATELIER_PREVIEW_STATE") setState(event.data.state as AtelierPreviewState);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "CHAMPAGNE_ATELIER_PREVIEW_READY" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!state) return <main className="dl46-preview-document" data-preview-ready="false" />;
  return <main className="dl46-preview-document" data-preview-ready="true" data-production-binding="false">
    <article
      className="dl4-canvas dl45-canvas dl46-canvas dl47-canvas"
      data-preview-mode={state.cleanPreview ? "clean" : "edit"}
      data-brand-territory={state.brandDecision.territory}
      data-brand-accent={state.brandDecision.accent}
      data-brand-type={state.brandDecision.typography}
      data-brand-rhythm={state.brandDecision.rhythm}
      data-studio-time={state.time}
      data-time-canon={TEMPORAL_SIMULATIONS[state.time].canon}
      data-time-runtime={TEMPORAL_SIMULATIONS[state.time].heroRuntime}
      data-time-scope={TEMPORAL_SIMULATIONS[state.time].scope}
      data-experiment-id={state.experiment?.id ?? "GOLDEN"}
      data-experiment-domain={state.experiment?.domain ?? "golden"}
      data-experiment-family={state.experiment?.family ?? "golden"}
      data-whole-page-proposal={state.experiment?.domain === "webpage" && state.experiment.targetKind === "page" && state.experiment.pageKey === state.page ? state.experiment.family : undefined}
      style={state.canvasStyle}
    >
      {state.sections.map(item => <section key={item.id} data-semantic-id={item.id} data-content-state={item.contentState} data-tone={item.tone} data-art-direction={state.artDirections[item.id] ?? "a"} data-treatment={item.id === "home.closing-invitation" ? state.closingTreatment : undefined} data-lab-proposal={state.experiment?.domain === "webpage" && state.experiment.targetKind !== "page" && state.experiment.semanticOwner === item.id ? state.experiment.family : undefined} data-lab-component={state.experiment?.targetKind === "component" && state.experiment.semanticOwner === item.id ? state.experiment.componentId ?? undefined : undefined} data-bundle-hash={item.governance?.bundleContentHash} data-publication-maturity={item.governance?.publicationMaturity} className={state.selected === item.id ? "is-selected" : ""}>
        {item.locked ? heroes[state.page]
          : item.id === "home.closing-invitation" ? <ArchitecturalClosing item={item} placement={state.closingPlacement} treatment={state.closingTreatment} />
            : item.archiveId ? <figure className="dl4-placed"><img src={assetFor(item.archiveId)} alt={`${item.label} visual proposal`} /><figcaption><span>Archive proposal</span></figcaption></figure>
              : <ContentSection item={item} />}
        {state.selected === item.id && !state.cleanPreview ? <div className="dl4-selection"><strong>{item.label}</strong><span>{item.locked ? "Canonical Hero V2 · protected" : "Selected in Atelier"}</span></div> : null}
      </section>)}
      {state.experiment ? <div className="dl410-preview-truth"><strong>LAB GENERATED PROPOSAL</strong><span>{state.experiment.id} · NOT GOLDEN BASELINE · productionBinding=false</span></div> : null}
      {state.page === "home" ? <GoldenConcierge experiment={state.experiment?.domain === "concierge" ? state.experiment : null} /> : null}
    </article>
  </main>;
}

type ConciergeStage = "closed" | "invited" | "host" | "need" | "answer" | "threeD" | "human";
type ImplantPart = "fixture" | "abutment" | "crown";
const CONCIERGE_FOCUSABLE = "button:not([disabled]), a[href], summary, [tabindex]:not([tabindex='-1'])";
const IMPLANT_PARTS: Record<ImplantPart, { label: string; explanation: string }> = {
  fixture: { label: "Fixture", explanation: "Synthetic education state. The governed implant page remains the canonical explanation owner." },
  abutment: { label: "Abutment", explanation: "Synthetic education state showing the middle component relationship without clinical personalisation." },
  crown: { label: "Crown", explanation: "Synthetic education state showing the visible restoration relationship without a treatment claim." },
};

function GoldenConcierge({ experiment }: { experiment: AtelierPreviewState["experiment"] }) {
  const [stage, setStage] = useState<ConciergeStage>("invited");
  const [sourceOpen, setSourceOpen] = useState(false);
  const [part, setPart] = useState<ImplantPart>("fixture");
  const [labels, setLabels] = useState(true);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const isOpen = !["closed", "invited"].includes(stage);
  const openHost = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    openerRef.current = event.currentTarget;
    setSourceOpen(false);
    setStage("host");
  }, []);
  const close = useCallback(() => {
    setSourceOpen(false);
    setStage("closed");
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(CONCIERGE_FOCUSABLE)].filter(item => !item.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  if (stage === "closed") return <button className="dl48-concierge-closed" data-concierge-state="closed" data-lab-proposal={experiment?.family} onClick={openHost} aria-label="Open Champagne Concierge"><i aria-hidden="true" />Ask Champagne</button>;
  if (stage === "invited") return <aside className="dl48-concierge-invitation" data-concierge-state="invited" data-lab-proposal={experiment?.family} aria-label="Champagne Concierge invitation"><i aria-hidden="true" /><div><span>Champagne Concierge</span><strong>A quieter way to explore.</strong><small>Digital guide · not a person</small></div><button onClick={openHost}>Open Champagne Concierge</button><button onClick={() => setStage("closed")}>Not now</button></aside>;

  return <div className="dl48-concierge-layer" data-concierge-state={stage} data-source-open={sourceOpen}>
    <button className="dl48-concierge-scrim" aria-label="Close Champagne Concierge" onClick={close} />
    <section ref={dialogRef} className="dl48-concierge-panel" data-lab-proposal={experiment?.family} data-lab-scope={experiment?.scope} role="dialog" aria-modal="true" aria-labelledby="dl48-concierge-heading" aria-describedby="dl48-concierge-disclosure">
      <header><div className="dl48-host-identity"><i aria-hidden="true">S</i><div><span>Champagne Concierge</span><small id="dl48-concierge-disclosure">Digital guide · synthetic simulation · not a person</small></div></div><div><button onClick={() => setStage("human")}>Speak to the practice</button><button ref={closeRef} onClick={close} aria-label="Close Champagne Concierge">Close</button></div></header>
      <div className="dl48-concierge-safety"><span>PUBLIC_NON_PHI · Zone A</span><span>No diagnosis · no suitability · no personalised recommendation</span></div>
      <div className="dl48-concierge-body">
        {stage === "host" ? <HostWelcome onContinue={() => setStage("need")} /> : null}
        {stage === "need" ? <NeedExplorer onImplants={() => setStage("answer")} onHuman={() => setStage("human")} /> : null}
        {stage === "answer" ? <ImplantAnswer sourceOpen={sourceOpen} onSource={() => setSourceOpen(value => !value)} onThreeD={() => setStage("threeD")} onHuman={() => setStage("human")} /> : null}
        {stage === "threeD" ? <SyntheticImplantExhibit part={part} labels={labels} onPart={setPart} onLabels={setLabels} onBack={() => setStage("answer")} onHuman={() => setStage("human")} /> : null}
        {stage === "human" ? <HumanDestination onBack={() => setStage("answer")} /> : null}
      </div>
      <footer><span>NAVIGATION_ONLY · no live booking state</span><button onClick={() => setStage("human")}>Human contact</button></footer>
    </section>
  </div>;
}

function HostWelcome({ onContinue }: { onContinue: () => void }) { return <section className="dl48-host-welcome"><span>Architectural Light</span><h2 id="dl48-concierge-heading">How can I help you explore?</h2><p>I can guide you through the website’s governed pages and explain where to find human help. I cannot diagnose or decide what is suitable for you.</p><button onClick={onContinue}>Explore by what you need</button></section>; }

function NeedExplorer({ onImplants, onHuman }: { onImplants: () => void; onHuman: () => void }) { return <section className="dl48-need"><span>Quiet Guidance</span><h2 id="dl48-concierge-heading">What would you like help with?</h2><p>Choose a need, not a diagnosis.</p><div><button onClick={onImplants}><strong>Replace a missing tooth</strong><small>Continue to the canonical Dental Implants page</small></button><button onClick={onHuman}><strong>I would rather speak to someone</strong><small>Continue to the practice contact destination</small></button></div><button onClick={onHuman}>Something else</button></section>; }

function ImplantAnswer({ sourceOpen, onSource, onThreeD, onHuman }: { sourceOpen: boolean; onSource: () => void; onThreeD: () => void; onHuman: () => void }) { return <section className="dl48-answer"><div className="dl48-answer-copy"><span>Editorial Host · canonical navigation</span><h2 id="dl48-concierge-heading">Dental implant education</h2><p>The canonical treatment owner explains what implants are and what assessment considers. This Atelier simulation does not reproduce blocked authoritative content.</p><a href="/treatments/implants">Open /treatments/implants</a><div><button onClick={onThreeD}>See how the parts fit</button><button aria-expanded={sourceOpen} onClick={onSource}>Sources and evidence</button></div><button onClick={onHuman}>Continue with the practice</button></div>{sourceOpen ? <aside className="dl48-source-drawer" aria-label="Sources and evidence"><span>Editorial evidence drawer</span><h3>Authority stays visible.</h3><dl><div><dt>Canonical owner</dt><dd>/treatments/implants</dd></div><div><dt>Response status</dt><dd>Synthetic simulation only</dd></div><div><dt>Evidence rendering</dt><dd>Governed sources withheld until authoritative content is available</dd></div></dl><details><summary>Open text alternative</summary><p>This synthetic journey points to the canonical Implant page and makes no clinical or suitability claim.</p></details></aside> : null}</section>; }

function SyntheticImplantExhibit({ part, labels, onPart, onLabels, onBack, onHuman }: { part: ImplantPart; labels: boolean; onPart: (part: ImplantPart) => void; onLabels: (labels: boolean) => void; onBack: () => void; onHuman: () => void }) { const selected = IMPLANT_PARTS[part]; return <section className="dl48-three-d"><div className="dl48-model" data-part={part}><span>Synthetic 3D education handoff</span><div className="dl48-implant-proxy" aria-label={`Synthetic implant model highlighting ${selected.label}`}><i data-component="fixture" /><i data-component="abutment" /><i data-component="crown" />{labels ? <><b data-label="fixture">Fixture</b><b data-label="abutment">Abutment</b><b data-label="crown">Crown</b></> : null}</div><small>Code-native proxy · final GLB not connected</small></div><div className="dl48-model-copy"><span>Luminous Digital</span><h2 id="dl48-concierge-heading">Fixture · abutment · crown</h2><p>{selected.explanation}</p><div>{(Object.keys(IMPLANT_PARTS) as ImplantPart[]).map(id => <button key={id} aria-pressed={part === id} onClick={() => onPart(id)}>{IMPLANT_PARTS[id].label}</button>)}</div><button onClick={() => onLabels(!labels)}>{labels ? "Hide labels" : "Show labels"}</button><details><summary>Read instead</summary><p>{Object.values(IMPLANT_PARTS).map(item => `${item.label}: ${item.explanation}`).join(" ")}</p></details><div><button onClick={onBack}>Back to implant page</button><button onClick={onHuman}>Continue to human contact</button></div><small>OPEN_MODEL · HIGHLIGHT_COMPONENT · SHOW_LABELS · HIDE_LABELS · OPEN_TEXT_ALTERNATIVE</small></div></section>; }

function HumanDestination({ onBack }: { onBack: () => void }) { return <section className="dl48-human"><span>Human destination</span><h2 id="dl48-concierge-heading">Continue with the practice.</h2><p>The simulated journey ends with an explicit human-contact destination. It does not claim a live appointment or transmit patient information.</p><a href="/contact">Open the contact page</a><a href="/contact">Ask the practice to contact me</a><button onClick={onBack}>Back to implant education</button><small>Navigation only · no diagnosis · no booking confirmation</small></section>; }

function ContentSection({ item }: { item: PlacedSection }) { return <div className={`dl4-native dl44-content dl44-${item.id.replaceAll(".", "-")}`}><div className="dl411-copy"><span>{item.label}</span><h2>{item.title}</h2>{item.copy ? item.copy.split("\n\n").map(paragraph => <p key={paragraph}>{paragraph}</p>) : null}{item.pathways ? <div className="dl44-pathways">{item.pathways.map((pathway, index) => <a href={pathway.href} key={pathway.href}><b>{String(index + 1).padStart(2, "0")}</b><strong>{pathway.label}</strong><span>{pathway.description}</span><i>Explore →</i></a>)}</div> : null}{item.steps ? <ol className="dl44-steps">{item.steps.map((step, index) => <li key={step.label}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.label}</strong><p>{step.copy}</p></div></li>)}</ol> : null}{item.componentCards ? <div className="dl411-components">{item.componentCards.map((component, index) => <article key={component.answerObjectId}><span>{String(index + 1).padStart(2, "0")}</span><h3>{component.label}</h3><p>{component.copy}</p></article>)}</div> : null}{item.faqs ? <div className="dl44-faqs">{item.faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div> : null}<SectionGeometry id={item.id} />{item.transcript ? <details className="dl411-transcript"><summary>Read the complete 3D text alternative</summary><p>{item.transcript}</p></details> : null}{item.ctas?.length ? <div className="dl44-ctas">{item.ctas.map(cta => <a key={`${cta.href}-${cta.label}`} href={cta.href}>{cta.label}</a>)}</div> : null}</div>{item.modelSlot ? <div className="dl411-3d-slot"><span>Governed 3D exhibit</span><strong>Replacement visual pending</strong><p>Founder-rejected T0.1 geometry is not integrated. The complete text explanation remains available.</p><small>{item.modelSlot} · poster/static/fallback seam preserved</small></div> : item.contentMediaSlotIds?.length || item.mediaSlot ? <div className="dl411-media-slot"><span>Real media required</span><strong>{item.contentMediaSlotIds?.[0] ?? item.mediaSlot}</strong><p>{item.capabilityOffBehavior ?? "Deliberate text-led fallback until provenance-complete media exists."}</p></div> : null}{item.governance ? <details className="dl411-governance"><summary>Content authority and review state</summary><dl><div><dt>Bundle</dt><dd>{item.governance.bundleId}</dd></div><div><dt>Clinical/fact state</dt><dd>{item.reviewState}</dd></div><div><dt>Publication</dt><dd>{item.governance.publicationMaturity}</dd></div><div><dt>Answer Objects</dt><dd>{item.answerObjectIds?.join(", ")}</dd></div><div><dt>Sources</dt><dd>{item.sourceGroupIds?.join(", ")}</dd></div></dl></details> : null}</div>; }

function SectionGeometry({ id }: { id: string }) {
  if (!["home.practice.answer", "home.complex-care", "home.founder-authority", "home.team-continuity", "home.technology-purpose", "home.heritage-story", "home.visit"].includes(id)) return null;
  return <div className="dl47-geometry" aria-hidden="true"><i /><i /><i /><i /></div>;
}

function ArchitecturalClosing({ item, placement, treatment }: { item: PlacedSection; placement: ClosingPlacement; treatment: ClosingTreatment }) { return <div className="dl4-architectural" data-placement={placement} data-treatment={treatment}><img src={architecturalClosingConcept.src} alt="Fictional architectural entrance used only to preview the St Mary's House closing composition" /><div className="dl4-architectural-shade" /><div className="dl4-architectural-copy"><span>St Mary’s House · architectural closing study</span><h2>{item.title}</h2><i aria-hidden="true" /><p>{item.copy}</p><div>{item.ctas?.map(cta => <button key={cta.href}>{cta.label}</button>)}</div></div><div className="dl4-concept-label">Lab proposal · fictional architecture · not St Mary’s House · real photo required</div>{placement === "FULL_FOOTER" ? <footer className="dl4-architectural-footer"><strong>St Mary’s House Dental Care</strong><nav aria-label="Architectural footer preview"><span>Treatments</span><span>Our approach</span><span>The practice</span><span>Contact</span></nav></footer> : null}</div>; }
