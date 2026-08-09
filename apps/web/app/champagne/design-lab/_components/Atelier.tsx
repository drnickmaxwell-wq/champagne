"use client";

import { useMemo, useState } from "react";

type Viewport = "desktop" | "tablet" | "mobile";
type Direction = "persian" | "editorial" | "heritage" | "luminous";
type PageKey = "home" | "implants" | "bonding";
type Section = { id: string; label: string; tone: "ink" | "porcelain" | "luminous"; title: string; copy: string };

const PAGE_NAMES: Record<PageKey, string> = { home: "Home", implants: "Implants", bonding: "Composite Bonding" };
const SEED: Record<PageKey, Section[]> = {
  home: [
    { id: "hero", label: "Hero V2", tone: "ink", title: "Dentistry with depth, clarity and care.", copy: "The canonical Champagne opening remains the fixed visual anchor." },
    { id: "pathways", label: "Patient pathways", tone: "porcelain", title: "Begin with what matters to you.", copy: "Clear routes for confidence, missing teeth, anxiety and continuing care." },
    { id: "founder", label: "Founder", tone: "ink", title: "A Founder’s standard, made personal.", copy: "Clinical authority and time to listen, presented without corporate theatre." },
    { id: "team", label: "Team", tone: "porcelain", title: "Familiar faces. Joined-up care.", copy: "A warm, distinct chapter for the people supporting each patient." },
    { id: "technology", label: "Digital dentistry", tone: "luminous", title: "Technology that makes choices clearer.", copy: "Planning and communication without coldness or spectacle." },
    { id: "heritage", label: "St Mary’s House", tone: "ink", title: "Modern dentistry in a place with a story.", copy: "Architecture and local character become part of the Champagne experience." },
    { id: "closing", label: "Closing invitation", tone: "ink", title: "Let’s make the next step feel clear.", copy: "Ask a question, explore an option or request a consultation." },
  ],
  implants: [
    { id: "hero", label: "Implant hero", tone: "ink", title: "Replace missing teeth with a carefully planned solution.", copy: "A calm, evidence-led introduction to implant choices." },
    { id: "answer", label: "Answer first", tone: "porcelain", title: "Are dental implants right for me?", copy: "Suitability, alternatives and the next useful conversation." },
    { id: "journey", label: "Planning journey", tone: "ink", title: "From assessment to confident restoration.", copy: "A clear visual journey with honest dependencies and limits." },
  ],
  bonding: [
    { id: "hero", label: "Bonding hero", tone: "ink", title: "Subtle changes, planned around your smile.", copy: "Composite bonding explained with restraint and clinical truth." },
    { id: "choices", label: "Options", tone: "porcelain", title: "Understand benefits, limits and alternatives.", copy: "A balanced decision surface rather than a sales pitch." },
    { id: "process", label: "Process", tone: "luminous", title: "Designed, refined and reviewed with you.", copy: "A visual explanation of the clinical and aesthetic process." },
  ],
};

const DIRECTIONS: { id: Direction; name: string; note: string }[] = [
  { id: "persian", name: "Persian Architectural", note: "Deep, crafted, authoritative" },
  { id: "editorial", name: "Contemporary Editorial", note: "Quiet, precise, fashion-led" },
  { id: "heritage", name: "Warm Heritage", note: "Human, local, storied" },
  { id: "luminous", name: "Luminous Digital", note: "Modern, explanatory, alive" },
];

export function Atelier() {
  const [page, setPage] = useState<PageKey>("home");
  const [sections, setSections] = useState<Record<PageKey, Section[]>>(SEED);
  const [selected, setSelected] = useState("pathways");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [direction, setDirection] = useState<Direction>("persian");
  const [shade, setShade] = useState(3);
  const [panel, setPanel] = useState<"design" | "content" | "brand">("design");
  const [proposalOpen, setProposalOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const current = sections[page];
  const active = current.find((item) => item.id === selected) ?? current[0];
  const canvasClass = `dl3-canvas dl3-${viewport} dl3-direction-${direction} dl3-shade-${shade}`;
  const brief = useMemo(() => ({ schema: "champagne.atelier.brief.v1", page, viewport, brandDirection: direction, tonalStep: shade, sections: current.map((item, order) => ({ ...item, order })), founderInstruction: instruction, productionBinding: false }), [page, viewport, direction, shade, current, instruction]);

  const move = (delta: number) => setSections((all) => {
    const items = [...all[page]]; const at = items.findIndex((item) => item.id === selected); const to = at + delta;
    if (at < 0 || to < 0 || to >= items.length) return all;
    [items[at], items[to]] = [items[to], items[at]]; return { ...all, [page]: items };
  });
  const duplicate = () => setSections((all) => {
    const items = [...all[page]]; const at = items.findIndex((item) => item.id === selected); if (at < 0) return all;
    const copy = { ...items[at], id: `${items[at].id}-variant-${Date.now()}`, label: `${items[at].label} variant` }; items.splice(at + 1, 0, copy); return { ...all, [page]: items };
  });
  const remove = () => setSections((all) => {
    if (all[page].length < 2) return all; const items = all[page].filter((item) => item.id !== selected); setSelected(items[0].id); return { ...all, [page]: items };
  });
  const exportBrief = () => {
    const blob = new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `champagne-${page}-atelier-brief.json`; anchor.click(); URL.revokeObjectURL(url);
  };

  return <main className="dl3-app">
    <header className="dl3-topbar"><a href="/champagne/design-lab">Champagne Atelier</a><label><span className="sr-only">Current page</span><select value={page} onChange={(e) => { setPage(e.target.value as PageKey); setSelected(SEED[e.target.value as PageKey][0].id); }}>{Object.entries(PAGE_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label><span className="dl3-crumb">/ {PAGE_NAMES[page]}</span><div className="dl3-top-actions"><span>● Autosaved</span><button type="button">Preview</button><button type="button" onClick={exportBrief}>Export brief</button></div></header>
    <aside className="dl3-left" aria-label="Page structure"><section><div className="dl3-rail-title"><h2>Pages</h2><button type="button" onClick={() => setProposalOpen(true)}>+ New page</button></div>{(Object.keys(PAGE_NAMES) as PageKey[]).map((key) => <button className="dl3-page-link" aria-current={page === key ? "page" : undefined} key={key} onClick={() => { setPage(key); setSelected(sections[key][0].id); }}>{PAGE_NAMES[key]}</button>)}</section><section><div className="dl3-rail-title"><h2>Page sections</h2></div><ol className="dl3-layers">{current.map((item, index) => <li key={item.id}><button aria-current={selected === item.id} onClick={() => setSelected(item.id)}><span>{index + 1}</span>{item.label}</button></li>)}</ol></section><section className="dl3-add"><h2>Add section</h2><button type="button">Existing designs <span>→</span></button><button type="button" onClick={() => setProposalOpen(true)}>Propose new design <span>✦</span></button><button type="button" onClick={() => setProposalOpen(true)}>Start blank <span>＋</span></button><button type="button">Copy from another page <span>⧉</span></button></section></aside>
    <section className="dl3-stage" aria-label="Website canvas"><div className="dl3-ruler"><span>0</span><span>320</span><span>640</span><strong>{viewport === "desktop" ? "1440" : viewport === "tablet" ? "768" : "390"}</strong></div><article className={canvasClass}>{current.map((item) => <section key={item.id} data-tone={item.tone} className={selected === item.id ? "is-selected" : ""} onClick={() => setSelected(item.id)}><p>{item.label}</p><h2>{item.title}</h2><p>{item.copy}</p>{item.id === "hero" || item.id === "closing" ? <button type="button">Explore your options</button> : null}{selected === item.id ? <div className="dl3-section-tools" aria-label="Selected section actions"><button onClick={(e) => { e.stopPropagation(); move(-1); }}>↑</button><button onClick={(e) => { e.stopPropagation(); move(1); }}>↓</button><button onClick={(e) => { e.stopPropagation(); duplicate(); }}>Duplicate</button><button onClick={(e) => { e.stopPropagation(); remove(); }}>Remove</button></div> : null}</section>)}</article><div className="dl3-viewport-bar">{(["desktop", "tablet", "mobile"] as Viewport[]).map((item) => <button key={item} aria-pressed={viewport === item} onClick={() => setViewport(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}<span>100%</span></div></section>
    <aside className="dl3-right" aria-label="Design inspector"><div className="dl3-tabs">{(["design", "content", "brand"] as const).map((item) => <button key={item} aria-selected={panel === item} onClick={() => setPanel(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div><section className="dl3-ask"><h2>✦ Ask Atelier</h2><p>Refine <strong>{active.label}</strong>, replace it, or ask for something completely different.</p><div><button type="button">Replace</button><button type="button" onClick={duplicate}>Create variant</button><button type="button" onClick={() => setProposalOpen(true)}>Propose new</button></div><label><span className="sr-only">Design instruction</span><textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="Describe the change in plain English…" /></label></section>{panel === "brand" || panel === "design" ? <section className="dl3-brand"><h2>Brand directions</h2><p>Choose a genuinely different direction first. Refine its shades afterwards.</p><div className="dl3-directions">{DIRECTIONS.map((item) => <button key={item.id} aria-pressed={direction === item.id} onClick={() => setDirection(item.id)}><strong>{item.name}</strong><small>{item.note}</small></button>)}<button className="dl3-new-direction" onClick={() => setProposalOpen(true)}>＋ Create a new direction</button></div><h3>Refine this direction</h3><div className="dl3-tones">{[0,1,2,3,4,5,6].map((item) => <button key={item} aria-label={`Tonal step ${item + 1}`} aria-pressed={shade === item} onClick={() => setShade(item)} />)}</div></section> : null}</aside>
    {proposalOpen ? <div className="dl3-dialog-backdrop" role="presentation" onMouseDown={() => setProposalOpen(false)}><section className="dl3-dialog" role="dialog" aria-modal="true" aria-labelledby="proposal-title" onMouseDown={(e) => e.stopPropagation()}><button className="dl3-dialog-close" onClick={() => setProposalOpen(false)}>×</button><p>Champagne Design Workshop</p><h2 id="proposal-title">Ask for something new</h2><p>Start from a purpose, a feeling, a reference, or simply describe what is missing. Atelier will preserve the original request and turn it into reviewable Champagne design proposals.</p><label>What are you designing?<select defaultValue="section"><option value="section">A page section</option><option value="page">A complete page</option><option value="brand">A brand direction</option><option value="component">A component</option></select></label><label>What should it achieve?<textarea placeholder="For example: a warmer team section that feels personal, not corporate…" /></label><label>Starting point (optional)<select><option>Something completely new</option><option>Use the selected section</option><option>Combine shortlisted ideas</option><option>I have a reference or sketch</option></select></label><div className="dl3-dialog-actions"><button onClick={() => setProposalOpen(false)}>Cancel</button><button onClick={() => setProposalOpen(false)}>Create proposal brief</button></div><small>This creates a draft proposal only. It cannot bind production or approve itself.</small></section></div> : null}
  </main>;
}
