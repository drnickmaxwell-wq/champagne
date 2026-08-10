"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GENERATION_SURFACES, generateProposalSet, type DesignProposal, type FounderDesignStudioState, type GenerationDomain, type GenerationMode, type ProposalDecision } from "../data/generative-design-contract";

const STORAGE_KEY = "champagne.atelier.r4.9.founder-design-studio";
const MODES: Array<{ id: GenerationMode; label: string }> = [
  { id: "COMPLETELY_NEW", label: "Completely new" }, { id: "MORE_LIKE_THIS", label: "More like this" },
  { id: "CHANGE_ONE_THING", label: "Change one thing" }, { id: "REMIX", label: "Remix" },
  { id: "REFERENCE_LED", label: "Reference-led" }, { id: "SURPRISE_ME", label: "Surprise me" },
];

const initialState: FounderDesignStudioState = {
  schema: "champagne.atelier.founder-design-studio.v1", proposals: [], decisions: {}, selectedIds: [], lineage: [],
  founderDesignDNA: { schema: "champagne.atelier.founder-design-dna.v1", status: "LAB_WORKING_MODEL", positiveSignals: [], openQuestions: [], explicitInputOnly: true, productionBinding: false },
  weosHandoff: { schema: "champagne.weos.design-generation-handoff.proposal.v1", status: "FUTURE_CONTRACT_ONLY", liveRuntime: false },
  generationDisclosure: "DETERMINISTIC_CODE_NATIVE_PROPOSALS_NOT_AI", productionBinding: false,
};

export function FounderDesignStudio({ onClose, onGovernedChange }: { onClose: () => void; onGovernedChange: (state: FounderDesignStudioState) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<FounderDesignStudioState>(initialState);
  const [domain, setDomain] = useState<GenerationDomain>("webpage");
  const [scope, setScope] = useState<string>("whole-page");
  const [mode, setMode] = useState<GenerationMode>("COMPLETELY_NEW");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [sequence, setSequence] = useState(1);
  const [tab, setTab] = useState<"generate" | "compare" | "dna" | "lineage">("generate");
  const [activeSet, setActiveSet] = useState<string | null>(null);

  useEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement;
    try { const saved = window.localStorage.getItem(STORAGE_KEY); if (saved) setState({ ...initialState, ...JSON.parse(saved) }); } catch { /* Private preferences remain optional. */ }
    closeRef.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const dialog = closeRef.current?.closest('[role="dialog"]');
      const controls = dialog?.querySelectorAll<HTMLElement>('button:not([disabled]),select,input,textarea,[href]');
      if (!controls?.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); returnFocus.current?.focus(); };
  }, [onClose]);

  useEffect(() => { onGovernedChange(state); try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Governed export remains the durable path. */ } }, [onGovernedChange, state]);

  const current = useMemo(() => activeSet ? state.proposals.filter((item) => item.setId === activeSet) : state.proposals.slice(-4), [activeSet, state.proposals]);
  const update = (proposals: DesignProposal[], nextMode: GenerationMode) => setState((previous) => {
    const lineage = proposals.map(({ id, parentId, setId }) => ({ proposalId: id, parentId, setId, mode: nextMode }));
    return { ...previous, proposals: [...previous.proposals, ...proposals], lineage: [...previous.lineage, ...lineage] };
  });
  const generate = (nextMode = mode, parentId: string | null = null) => {
    const proposals = generateProposalSet({ sequence, domain, scope, semanticOwner: domain === "webpage" ? (scope === "whole-page" ? "home" : "home.practice.answer") : `concierge.${scope}`, mode: nextMode, parentId, references: reference.trim() ? [reference.trim()] : [] });
    update(proposals, nextMode); setActiveSet(proposals[0].setId); setSequence((value) => value + 1); setTab("compare");
  };
  const decide = (proposal: DesignProposal, decision: ProposalDecision) => setState((previous) => {
    const decisions = { ...previous.decisions, [proposal.id]: decision };
    const selectedIds = decision === "love" || decision === "keep" ? [...new Set([...previous.selectedIds, proposal.id])] : previous.selectedIds.filter((id) => id !== proposal.id);
    const positiveSignals = previous.proposals.filter((item) => decisions[item.id] === "love" || decisions[item.id] === "keep").map((item) => `${item.family}:${item.scope}`);
    return { ...previous, decisions, selectedIds, founderDesignDNA: { ...previous.founderDesignDNA, positiveSignals: [...new Set(positiveSignals)], openQuestions: notes.trim() ? [notes.trim()] : [] } };
  });
  const noneOfThese = () => {
    setState((previous) => ({ ...previous, decisions: { ...previous.decisions, ...Object.fromEntries(current.map((item) => [item.id, "reject" as const])) } }));
    generate("NONE_OF_THESE", current[0]?.id ?? null);
  };
  const remix = () => {
    const sources = state.selectedIds.map((id) => state.proposals.find((item) => item.id === id)).filter(Boolean) as DesignProposal[];
    generate("REMIX", sources[0]?.id ?? current[0]?.id ?? null);
  };

  return <div className="dl49-backdrop"><section className="dl49-studio" role="dialog" aria-modal="true" aria-labelledby="dl49-title">
    <header><div><span>Founder Design Studio</span><h2 id="dl49-title">Generate. Compare. Refine. Remix.</h2><p>Explore real design directions without binding production or changing governed meaning.</p></div><button ref={closeRef} onClick={onClose}>Close studio</button></header>
    <nav aria-label="Founder Design Studio"><button aria-current={tab === "generate" ? "page" : undefined} onClick={() => setTab("generate")}>Generate</button><button aria-current={tab === "compare" ? "page" : undefined} onClick={() => setTab("compare")}>Compare <small>{current.length || "—"}</small></button><button aria-current={tab === "dna" ? "page" : undefined} onClick={() => setTab("dna")}>Design DNA</button><button aria-current={tab === "lineage" ? "page" : undefined} onClick={() => setTab("lineage")}>Lineage</button></nav>

    {tab === "generate" ? <div className="dl49-generate"><section><span>01 · Choose the design surface</span><div className="dl49-domain"><button aria-pressed={domain === "webpage"} onClick={() => { setDomain("webpage"); setScope("whole-page"); }}>Webpage UI/UX</button><button aria-pressed={domain === "concierge"} onClick={() => { setDomain("concierge"); setScope("invitation"); }}>Concierge UI/UX</button></div><label>Surface<select aria-label="Design surface" value={scope} onChange={(event) => setScope(event.target.value)}>{GENERATION_SURFACES[domain].map((item) => <option key={item} value={item}>{item.replaceAll("-", " ")}</option>)}</select></label></section><section><span>02 · Choose how to explore</span><div className="dl49-modes">{MODES.map((item) => <button key={item.id} aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>{item.label}</button>)}</div>{mode === "REFERENCE_LED" ? <label>Reference description<input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Describe the reference and what you value in it" /><small>DESIGN_REFERENCE_ONLY · no factual, media or provenance authority.</small></label> : null}<label>Founder note<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What should remain, change, or feel different?" /></label><button className="dl49-primary" onClick={() => generate()}>Generate four proposals</button></section><aside><strong>What generation means here</strong><p>These are deterministic, code-native Lab proposals—not external AI output.</p><dl><div><dt>Meaning</dt><dd>Governed and unchanged</dd></div><div><dt>Accessibility</dt><dd>Mandatory envelope</dd></div><div><dt>Production</dt><dd>Binding off</dd></div></dl></aside></div> : null}

    {tab === "compare" ? <div className="dl49-compare">{current.length ? <><div className="dl49-compare-head"><div><span>{domain === "webpage" ? "Webpage Foundry" : "Concierge Foundry"}</span><h3>{scope.replaceAll("-", " ")} · four-way comparison</h3>{domain === "concierge" ? <p>UX_LOGIC_AUTHORITY ≠ VISUAL_STYLE_AUTHORITY · Public, non-PHI navigation and human escape remain fixed.</p> : null}</div><button onClick={() => setTab("generate")}>New exploration</button></div><div className="dl49-candidates">{current.map((proposal) => <ProposalCard key={proposal.id} proposal={proposal} decision={state.decisions[proposal.id]} onDecision={(decision) => decide(proposal, decision)} onRefine={() => { setDomain(proposal.domain); setScope(proposal.scope); generate("MORE_LIKE_THIS", proposal.id); }} />)}</div><footer><button onClick={noneOfThese}>None of these — try another family</button><button disabled={state.selectedIds.length < 2} onClick={remix}>Remix selected ideas</button></footer></> : <div className="dl49-empty"><h3>No candidates yet.</h3><p>Choose a surface and exploration mode to create the first comparison family.</p><button onClick={() => setTab("generate")}>Begin generating</button></div>}</div> : null}

    {tab === "dna" ? <div className="dl49-dna"><span>Founder Design DNA v1</span><h3>A working model built only from your explicit decisions.</h3><p>No psychological inference. No hidden preference claim. This remains Lab-only evidence.</p><div><section><strong>Signals you explicitly kept or loved</strong>{state.founderDesignDNA.positiveSignals.length ? <ul>{state.founderDesignDNA.positiveSignals.map((item) => <li key={item}>{item.replace(":", " · ")}</li>)}</ul> : <p>Make your first love or keep decision to begin the model.</p>}</section><section><strong>Open Founder notes</strong>{state.founderDesignDNA.openQuestions.length ? <ul>{state.founderDesignDNA.openQuestions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>No open note recorded.</p>}</section></div><small>LAB_WORKING_MODEL · explicit input only · productionBinding=false</small></div> : null}
    {tab === "lineage" ? <div className="dl49-lineage"><span>Proposal lineage</span><h3>Every idea keeps its ancestry.</h3>{state.lineage.length ? <ol>{state.lineage.map((item) => <li key={item.proposalId}><code>{item.proposalId}</code><span>{item.mode.replaceAll("_", " ")}</span><small>{item.parentId ? `from ${item.parentId}` : "baseline exploration"}</small></li>)}</ol> : <p>No proposal lineage exists yet.</p>}<footer><span>Future WEOS contract</span><strong>FUTURE_CONTRACT_ONLY · live runtime off</strong></footer></div> : null}
    <div className="dl49-truth">LAB_GENERATED_PROPOSAL · Founder review required · productionBinding=false</div>
  </section></div>;
}

function ProposalCard({ proposal, decision, onDecision, onRefine }: { proposal: DesignProposal; decision?: ProposalDecision; onDecision: (decision: ProposalDecision) => void; onRefine: () => void }) {
  return <article className="dl49-candidate" data-family={proposal.family} data-affinity={proposal.affinity}><div className="dl49-proposal-art" aria-label={`${proposal.title} abstract layout preview`}><i /><i /><i /><b /><span>{proposal.scope.replaceAll("-", " ")}</span></div><div><span>{proposal.affinity.replaceAll("_", " ")}</span><h4>{proposal.title}</h4><p>{proposal.rationale}</p><small>{proposal.id}</small><div className="dl49-decisions" aria-label={`${proposal.title} decision`}>{(["love", "keep", "maybe", "reject"] as ProposalDecision[]).map((item) => <button key={item} aria-pressed={decision === item} onClick={() => onDecision(item)}>{item}</button>)}</div><button className="dl49-refine" onClick={onRefine}>More like this</button></div></article>;
}
