"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AtelierContentPage, AtelierContentSection, AtelierPageKey } from "../data/content-bundle-adapter";
import {
  GENERATION_SURFACES,
  generateProposalSet,
  type DesignProposal,
  type DesignTrait,
  type FounderDesignStudioState,
  type GenerationDomain,
  type GenerationMode,
  type GenerationTargetKind,
  type ProposalDecision,
  type ReferenceKind,
} from "../data/generative-design-contract";

const STORAGE_KEY = "champagne.atelier.r4.11.founder-design-studio";
const PAGE_NAMES: Record<AtelierPageKey, string> = { home: "Homepage", implants: "Dental Implants", bonding: "Composite Bonding" };
const MODES: Array<{ id: GenerationMode; label: string; truth: string }> = [
  { id: "COMPLETELY_NEW", label: "New code-native direction", truth: "Starts from the four implemented visual families." },
  { id: "MORE_LIKE_THIS", label: "Keep selected traits", truth: "Records the traits to preserve and prioritises your explicitly preferred family." },
  { id: "CHANGE_ONE_THING", label: "Change one coded dimension", truth: "Changes the chosen implemented styling dimension; it is not free-form synthesis." },
  { id: "REMIX", label: "Combine recorded traits", truth: "Combines recorded parent traits and lineage; it does not visually blend pixels." },
  { id: "REFERENCE_LED", label: "Use a reference note", truth: "Uses your written description only. No image or URL is visually analysed." },
  { id: "SURPRISE_ME", label: "Rotate implemented families", truth: "Changes deterministic family order; no AI is called." },
];
const TRAITS: DesignTrait[] = ["composition", "asymmetry", "type-hierarchy", "spacing-rhythm", "interaction-model", "media-geometry", "motion", "density", "mobile-composition"];
const REFERENCE_KINDS: ReferenceKind[] = ["screenshot", "sketch", "photograph", "url-note", "visual-archive-item", "existing-proposal"];

const initialState: FounderDesignStudioState = {
  schema: "champagne.atelier.founder-design-studio.v1", proposals: [], decisions: {}, selectedIds: [], lineage: [],
  founderDesignDNA: { schema: "champagne.atelier.founder-design-dna.v1", status: "FOUNDER_WORKING_PREFERENCE_MODEL", positiveSignals: [], ignoredDecisionIds: [], openQuestions: [], explicitInputOnly: true, productionBinding: false },
  weosHandoff: { schema: "champagne.weos.design-generation-handoff.proposal.v1", status: "FUTURE_CONTRACT_ONLY", liveRuntime: false },
  generationDisclosure: "DETERMINISTIC_CODE_NATIVE_PROPOSALS_NOT_AI", productionBinding: false,
};

type ComponentTarget = { id: string; label: string };
const componentTargets = (section: AtelierContentSection): ComponentTarget[] => {
  const targets: ComponentTarget[] = [{ id: `${section.id}.content`, label: "Heading and reading composition" }];
  if (section.componentCards?.length) targets.push(...section.componentCards.map((item) => ({ id: `${section.id}.component.${item.answerObjectId}`, label: item.label })));
  if (section.mediaSlot || section.contentMediaSlotIds?.length) targets.push({ id: `${section.id}.media`, label: "Media or fallback composition" });
  if (section.modelSlot) targets.push({ id: `${section.id}.3d-slot`, label: "Governed 3D exhibit slot" });
  if (section.ctas?.length) targets.push({ id: `${section.id}.actions`, label: "Next-action area" });
  return targets;
};

export function FounderDesignStudio({ initialDomain, initialPage, pages, selectedSectionId, onClose, onGovernedChange, onPreview, onReturnGolden, activeProposalId }: {
  initialDomain: GenerationDomain;
  initialPage: AtelierPageKey;
  pages: Record<AtelierPageKey, AtelierContentPage>;
  selectedSectionId: string;
  onClose: () => void;
  onGovernedChange: (state: FounderDesignStudioState) => void;
  onPreview: (proposal: DesignProposal) => void;
  onReturnGolden: () => void;
  activeProposalId: string | null;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<FounderDesignStudioState>(initialState);
  const [domain, setDomain] = useState<GenerationDomain>(initialDomain);
  const [pageKey, setPageKey] = useState<AtelierPageKey>(initialPage);
  const [targetKind, setTargetKind] = useState<GenerationTargetKind>(initialDomain === "concierge" ? "concierge-surface" : "page");
  const initialSection = pages[initialPage].sections.some((item) => item.id === selectedSectionId) ? selectedSectionId : pages[initialPage].sections[0].id;
  const [sectionId, setSectionId] = useState(initialSection);
  const [componentId, setComponentId] = useState("");
  const [conciergeScope, setConciergeScope] = useState("shell");
  const [mode, setMode] = useState<GenerationMode>("COMPLETELY_NEW");
  const [reference, setReference] = useState("");
  const [referenceKind, setReferenceKind] = useState<ReferenceKind>("screenshot");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const sequenceRef = useRef(1);
  const [tab, setTab] = useState<"generate" | "compare" | "dna" | "lineage">("generate");
  const [activeSet, setActiveSet] = useState<string | null>(null);
  const [inheritedTraits, setInheritedTraits] = useState<DesignTrait[]>(["composition", "asymmetry", "type-hierarchy", "spacing-rhythm", "media-geometry"]);
  const [changedDimension, setChangedDimension] = useState<DesignTrait>("composition");
  const [refineParent, setRefineParent] = useState<DesignProposal | null>(null);

  const page = pages[pageKey];
  const section = page.sections.find((item) => item.id === sectionId) ?? page.sections[0];
  const components = useMemo(() => componentTargets(section), [section]);
  useEffect(() => { if (!components.some((item) => item.id === componentId)) setComponentId(components[0]?.id ?? ""); }, [componentId, components]);

  useEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FounderDesignStudioState>;
        const proposals = (parsed.proposals ?? []).filter((proposal) => proposal.targetKind);
        sequenceRef.current = proposals.reduce((highest, proposal) => Math.max(highest, Number(proposal.setId.split("-").at(-1)) || 0), 0) + 1;
        setState({ ...initialState, ...parsed, proposals, founderDesignDNA: { ...initialState.founderDesignDNA, ...parsed.founderDesignDNA, ignoredDecisionIds: parsed.founderDesignDNA?.ignoredDecisionIds ?? [] } });
      }
    } catch { /* Optional private state never blocks the Studio. */ }
    closeRef.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const dialog = closeRef.current?.closest('[role="dialog"]');
      const controls = dialog?.querySelectorAll<HTMLElement>('button:not([disabled]),select,input,textarea,summary,[href]');
      if (!controls?.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); returnFocus.current?.focus(); };
  }, [onClose]);

  useEffect(() => { onGovernedChange(state); try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Export remains the durable path. */ } }, [onGovernedChange, state]);

  const current = useMemo(() => activeSet ? state.proposals.filter((item) => item.setId === activeSet) : state.proposals.slice(-4), [activeSet, state.proposals]);
  const modeTruth = MODES.find((item) => item.id === mode)?.truth;
  const preferredFamily = state.founderDesignDNA.positiveSignals.map((signal) => signal.split(":")[0]).find((family): family is DesignProposal["family"] => ["aperture", "folio", "luminous", "monolith"].includes(family)) ?? null;

  const resolveTarget = () => {
    if (domain === "concierge") return { semanticOwner: `concierge.${conciergeScope}`, scope: conciergeScope, targetKind: "concierge-surface" as const, pageKey: null, componentId: null };
    if (targetKind === "page") return { semanticOwner: page.route, scope: "whole-page", targetKind, pageKey, componentId: null };
    if (targetKind === "section" && section?.id) return { semanticOwner: section.id, scope: "semantic-section", targetKind, pageKey, componentId: null };
    if (targetKind === "component" && componentId && components.some((item) => item.id === componentId)) return { semanticOwner: section.id, scope: "component", targetKind, pageKey, componentId };
    return null;
  };

  const generate = (nextMode = mode, parentId: string | null = null, traits = inheritedTraits) => {
    const target = resolveTarget();
    if (!target) { setError("Choose a valid page, section or component before creating proposals."); return; }
    if (!notes.trim()) { setError("Tell Atelier what feels wrong or what should change first."); return; }
    if (nextMode === "REFERENCE_LED" && !reference.trim()) { setError("Add a written reference note. Atelier does not visually analyse uploads or URLs in this tranche."); return; }
    setError("");
    const sequence = sequenceRef.current++;
    const proposals = generateProposalSet({ sequence, domain, ...target, mode: nextMode, parentId, references: reference.trim() ? [`${referenceKind}:${reference.trim()}`] : [], inheritedTraits: nextMode === "MORE_LIKE_THIS" || nextMode === "REMIX" ? traits : [], changedDimension: nextMode === "CHANGE_ONE_THING" ? changedDimension : null, preferredFamily });
    setState((previous) => ({ ...previous, proposals: [...previous.proposals, ...proposals], lineage: [...previous.lineage, ...proposals.map(({ id, parentId: parent, setId }) => ({ proposalId: id, parentId: parent, setId, mode: nextMode }))], founderDesignDNA: { ...previous.founderDesignDNA, openQuestions: [notes.trim()] } }));
    setActiveSet(proposals[0].setId); setTab("compare");
  };

  const decide = (proposal: DesignProposal, decision: ProposalDecision) => setState((previous) => {
    const decisions = { ...previous.decisions, [proposal.id]: decision };
    const selectedIds = decision === "love" || decision === "keep" ? [...new Set([...previous.selectedIds, proposal.id])] : previous.selectedIds.filter((id) => id !== proposal.id);
    const positiveSignals = previous.proposals.filter((item) => decisions[item.id] === "love" || decisions[item.id] === "keep").map((item) => `${item.family}:${item.scope}`);
    return { ...previous, decisions, selectedIds, founderDesignDNA: { ...previous.founderDesignDNA, positiveSignals: [...new Set(positiveSignals)] } };
  });
  const noneOfThese = () => { setState((previous) => ({ ...previous, decisions: { ...previous.decisions, ...Object.fromEntries(current.map((item) => [item.id, "reject" as const])) } })); generate("NONE_OF_THESE", current[0]?.id ?? null); };
  const toggleTrait = (trait: DesignTrait) => setInheritedTraits((items) => items.includes(trait) ? items.filter((item) => item !== trait) : [...items, trait]);

  return <div className="dl49-backdrop dl411-backdrop"><section className="dl49-studio dl411-studio" role="dialog" aria-modal="true" aria-labelledby="dl411-title">
    <header><div><span>Champagne Atelier · Founder Design Studio</span><h2 id="dl411-title">Judge the design, not the machinery.</h2><p>Choose what you are changing, compare it in context, and keep Golden one click away.</p></div><div className="dl411-truth"><strong>Deterministic proposals · not AI</strong><small>productionBinding=false</small></div><button ref={closeRef} onClick={onClose}>Close studio</button></header>
    <nav aria-label="Founder Design Studio"><button aria-current={tab === "generate" ? "page" : undefined} onClick={() => setTab("generate")}>Choose &amp; generate</button><button aria-current={tab === "compare" ? "page" : undefined} onClick={() => setTab("compare")}>Compare <small>{current.length || "—"}</small></button><button aria-current={tab === "dna" ? "page" : undefined} onClick={() => setTab("dna")}>Design DNA</button><button aria-current={tab === "lineage" ? "page" : undefined} onClick={() => setTab("lineage")}>Lineage</button><button className="dl411-return" onClick={onReturnGolden}>Return to Golden</button></nav>

    {tab === "generate" ? <div className="dl411-generate">
      <section className="dl411-target"><span>01 · What are we changing?</span><div className="dl49-domain"><button aria-pressed={domain === "webpage"} onClick={() => { setDomain("webpage"); setTargetKind("page"); }}>Webpage</button><button aria-pressed={domain === "concierge"} onClick={() => { setDomain("concierge"); setTargetKind("concierge-surface"); }}>Concierge</button></div>
        {domain === "webpage" ? <><label>Choose page<select aria-label="Choose page" value={pageKey} onChange={(event) => { const next = event.target.value as AtelierPageKey; setPageKey(next); setSectionId(pages[next].sections[0].id); }}><option value="home">Homepage</option><option value="implants">Dental Implants</option><option value="bonding">Composite Bonding</option></select></label><div className="dl411-target-kind" aria-label="Target size">{(["page", "section", "component"] as GenerationTargetKind[]).map((kind) => <button key={kind} aria-pressed={targetKind === kind} onClick={() => setTargetKind(kind)}>{kind === "page" ? "Whole page" : kind === "section" ? "One section" : "One component"}</button>)}</div>{targetKind !== "page" ? <label>Which section?<select aria-label="Choose section" value={section.id} onChange={(event) => setSectionId(event.target.value)}>{page.sections.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label> : null}{targetKind === "component" ? <label>Which part?<select aria-label="Choose component" value={componentId} onChange={(event) => setComponentId(event.target.value)}>{components.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label> : null}<p className="dl411-target-truth"><strong>Target:</strong> {targetKind === "page" ? `${PAGE_NAMES[pageKey]} — complete page` : targetKind === "section" ? `${PAGE_NAMES[pageKey]} — ${section.label}` : `${PAGE_NAMES[pageKey]} — ${section.label} — ${components.find((item) => item.id === componentId)?.label}`}</p></> : <label>Concierge surface<select aria-label="Concierge surface" value={conciergeScope} onChange={(event) => setConciergeScope(event.target.value)}>{GENERATION_SURFACES.concierge.map((item) => <option key={item}>{item.replaceAll("-", " ")}</option>)}</select></label>}
      </section>
      <section className="dl411-intent"><span>02 · What feels wrong?</span><label className="dl411-note">Describe the change<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="For example: this section feels too clinical and boxed-in; keep the calm but make the reading rhythm more architectural." /></label><span>03 · How should the code-native proposals explore?</span><div className="dl49-modes">{MODES.map((item) => <button key={item.id} aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>{item.label}</button>)}</div><p className="dl411-mode-truth">{modeTruth}</p>{mode === "REFERENCE_LED" ? <><label>Reference type<select aria-label="Reference type" value={referenceKind} onChange={(event) => setReferenceKind(event.target.value as ReferenceKind)}>{REFERENCE_KINDS.map((kind) => <option key={kind}>{kind}</option>)}</select></label><label>Reference note<input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Describe what you value in the reference" /><small>Text note only · no visual understanding or provenance authority.</small></label></> : null}{mode === "CHANGE_ONE_THING" ? <label>Change one coded dimension<select aria-label="Change dimension" value={changedDimension} onChange={(event) => setChangedDimension(event.target.value as DesignTrait)}>{TRAITS.map((trait) => <option key={trait}>{trait.replaceAll("-", " ")}</option>)}</select></label> : null}{error ? <p className="dl411-error" role="alert">{error}</p> : null}<button className="dl49-primary" onClick={() => generate()}>Create four code-native proposals</button></section>
    </div> : null}

    {tab === "compare" ? <div className="dl411-compare">{current.length ? <><header className="dl411-compare-head"><div><span>{current[0].pageKey ? PAGE_NAMES[current[0].pageKey] : "Concierge"}</span><h3>Golden truth beside a candidate proposal.</h3><p>{current[0].targetKind === "page" ? "Complete page" : current[0].targetKind === "section" ? current[0].semanticOwner : current[0].componentId}</p></div><button onClick={() => setTab("generate")}>Change the brief</button></header><div className="dl411-primary-candidates">{current.slice(0, 2).map((proposal, index) => <ProposalCard key={proposal.id} proposal={proposal} decision={state.decisions[proposal.id]} active={activeProposalId === proposal.id} position={index} onPreview={() => onPreview(proposal)} onDecision={(decision) => decide(proposal, decision)} onRefine={() => { setDomain(proposal.domain); setPageKey(proposal.pageKey ?? pageKey); setTargetKind(proposal.targetKind); setRefineParent(proposal); }} />)}</div>{current.length > 2 ? <div className="dl411-candidate-strip" aria-label="More candidates">{current.slice(2).map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} decision={state.decisions[proposal.id]} active={activeProposalId === proposal.id} compact onPreview={() => onPreview(proposal)} onDecision={(decision) => decide(proposal, decision)} onRefine={() => setRefineParent(proposal)} />)}</div> : null}{refineParent ? <section className="dl410-inherit"><header><div><span>Keep traits from {refineParent.title}</span><h4>Choose what survives.</h4></div><button onClick={() => setRefineParent(null)}>Cancel</button></header><div>{TRAITS.map((trait) => <label key={trait}><input type="checkbox" checked={inheritedTraits.includes(trait)} onChange={() => toggleTrait(trait)} />{trait.replaceAll("-", " ")}</label>)}</div><button onClick={() => { generate("MORE_LIKE_THIS", refineParent.id); setRefineParent(null); }}>Create deterministic refinements</button></section> : null}<footer><button onClick={noneOfThese}>None of these — rotate implemented families</button><button disabled={state.selectedIds.length < 2} onClick={() => { setMode("REMIX"); setTab("generate"); }}>Combine traits from kept ideas</button></footer></> : <div className="dl49-empty"><h3>No candidates yet.</h3><p>Choose a page and an honest target to begin.</p><button onClick={() => setTab("generate")}>Choose a target</button></div>}</div> : null}

    {tab === "dna" ? <div className="dl49-dna dl411-dna"><span>Founder Design DNA</span><h3>Your explicit decisions now influence which implemented family appears first.</h3><p>No psychological inference. No hidden taste claim. No brand-law status.</p><div><section><strong>Kept or loved signals</strong>{state.founderDesignDNA.positiveSignals.length ? <ul>{state.founderDesignDNA.positiveSignals.map((item) => <li key={item}><strong>{item.replace(":", " · ")}</strong><span>Explicit decision signal</span><button onClick={() => setState((previous) => ({ ...previous, founderDesignDNA: { ...previous.founderDesignDNA, positiveSignals: previous.founderDesignDNA.positiveSignals.filter((signal) => signal !== item) } }))}>Stop using this signal</button></li>)}</ul> : <p>Love or keep a candidate to begin.</p>}</section><section><strong>What this changes</strong><p>The preferred implemented family is placed first in the next deterministic proposal set. It does not invent a new style.</p><dl><div><dt>Current preference</dt><dd>{preferredFamily ?? "Not enough evidence"}</dd></div><div><dt>Production</dt><dd>Binding off</dd></div></dl></section></div></div> : null}
    {tab === "lineage" ? <div className="dl49-lineage"><span>Proposal lineage</span><h3>Every candidate keeps its ancestry and exact target.</h3>{state.lineage.length ? <ol>{state.lineage.map((item) => { const proposal = state.proposals.find((candidate) => candidate.id === item.proposalId); return <li key={item.proposalId}><code>{item.proposalId}</code><span>{item.mode.replaceAll("_", " ")}</span><small>{proposal?.targetKind} · {proposal?.componentId ?? proposal?.semanticOwner} · {item.parentId ? `from ${item.parentId}` : "baseline"}</small></li>; })}</ol> : <p>No proposal lineage exists yet.</p>}<footer><span>Future design-worker boundary</span><strong>FUTURE_CONTRACT_ONLY · live runtime off</strong></footer></div> : null}
    <div className="dl49-truth">DETERMINISTIC_CODE_NATIVE_PROPOSALS_NOT_AI · Founder review required · productionBinding=false</div>
  </section></div>;
}

function ProposalCard({ proposal, decision, active, compact = false, position = 0, onPreview, onDecision, onRefine }: { proposal: DesignProposal; decision?: ProposalDecision; active: boolean; compact?: boolean; position?: number; onPreview: () => void; onDecision: (decision: ProposalDecision) => void; onRefine: () => void }) {
  return <article className="dl49-candidate dl411-candidate" data-family={proposal.family} data-active-preview={active} data-compact={compact}><div className="dl411-context-preview" data-family={proposal.family}><span>{position === 0 ? "GOLDEN CONTEXT → CANDIDATE" : "CANDIDATE PROPOSAL"}</span><i /><i /><i /><b /><strong>{proposal.title}</strong><small>{proposal.targetKind === "page" ? "Complete page composition" : proposal.componentId ?? proposal.semanticOwner}</small></div><div className="dl411-candidate-copy"><span>{proposal.affinity.replaceAll("_", " ")}</span><h4>{proposal.title}</h4><p>{proposal.rationale}</p><button className="dl410-preview" aria-pressed={active} onClick={onPreview}>{active ? "Previewing in page context" : "Preview in page context"}</button><div className="dl49-decisions" aria-label={`${proposal.title} decision`}>{(["love", "keep", "maybe", "reject"] as ProposalDecision[]).map((item) => <button key={item} aria-pressed={decision === item} onClick={() => onDecision(item)}>{item}</button>)}</div><button className="dl49-refine" onClick={onRefine}>Keep traits from this</button><details><summary>Technical details</summary><dl><div><dt>ID</dt><dd>{proposal.id}</dd></div><div><dt>Exact owner</dt><dd>{proposal.semanticOwner}</dd></div><div><dt>Component</dt><dd>{proposal.componentId ?? "Not component-scoped"}</dd></div><div><dt>Mode</dt><dd>{proposal.mode.replaceAll("_", " ")}</dd></div><div><dt>Lineage</dt><dd>{proposal.parentId ?? "Golden exploration baseline"}</dd></div><div><dt>Governance</dt><dd>{proposal.governance}</dd></div></dl></details></div></article>;
}
