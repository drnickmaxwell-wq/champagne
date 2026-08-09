"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import registry from "../data/v27-registry.json";
import architecturalClosingContract from "../data/architectural-closing-contract.v1.json";
import architecturalClosingConcept from "../assets/st-marys-architectural-closing-concept-v1.png";
import { PERSIAN_CANDIDATES, PORCELAIN_CANDIDATES } from "../data/materials";
import { BrandWorkshop } from "./BrandWorkshop";
import {
  CONVERGENCE_LANES,
  EXPERIENCE_STUDIOS,
  INITIAL_BRAND_DECISION,
  mediaLensForSection,
  type BrandDecision,
} from "../data/atelier-convergence";
import {
  ATELIER_CONTENT_PAGES,
  LAB_CAPABILITIES,
  contentBundleAdapter,
  visibleAtelierSections,
  type AtelierContentSection,
  type AtelierPageKey,
} from "../data/content-bundle-adapter";

type Viewport = "desktop" | "tablet" | "mobile";
type Material = "persian" | "porcelain";
type ClosingPlacement = "PRE_FOOTER_CLOSING_SECTION" | "FULL_FOOTER";
type ClosingTreatment = "PERSIAN_ARCHITECTURAL" | "PORCELAIN_GALLERY" | "GILDED_BRAND_GOLD";
type ArchiveItem = { id: string; title: string; labRoom: string; family: string; purpose: string; selectableInDesignLab: boolean };
type PlacedSection = AtelierContentSection & { archiveId?: string };
type LabStyle = CSSProperties & Record<`--${string}`, string>;
type Proposal = { id: string; page: AtelierPageKey; sectionId: string; scope: string; source: string; request: string; status: "LAB_PROPOSAL" };
type Decision = "love" | "keep" | "maybe" | "reject";
type AtelierView = "welcome" | "brand" | "editor";

const ATELIER_STORAGE_KEY = "champagne.atelier.r4.3.founder-state";

const PAGE_NAMES: Record<AtelierPageKey, string> = { home: "Homepage", implants: "Dental Implants", bonding: "Composite Bonding" };
const ARCHIVE = (registry.items as ArchiveItem[]).filter((item) => item.selectableInDesignLab);
const assetFor = (id: string) => `/assets/champagne/design-lab/v27/${id}.png`;
const colour = (value: readonly number[]) => `color(srgb ${value.map((channel) => (channel / 255).toFixed(5)).join(" ")})`;
const initialSections = () => Object.fromEntries(Object.entries(ATELIER_CONTENT_PAGES).map(([key, value]) => [key, visibleAtelierSections(value)])) as Record<AtelierPageKey, PlacedSection[]>;

export function Atelier({ heroes }: { heroes: Record<AtelierPageKey, ReactNode> }) {
  const [view, setView] = useState<AtelierView>("welcome");
  const [page, setPage] = useState<AtelierPageKey>("home");
  const [sections, setSections] = useState<Record<AtelierPageKey, PlacedSection[]>>(initialSections);
  const [selected, setSelected] = useState("home.practice.answer");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [material, setMaterial] = useState<Material>("persian");
  const [persian, setPersian] = useState(0);
  const [porcelain, setPorcelain] = useState(0);
  const [drawer, setDrawer] = useState<"archive" | "proposal" | null>(null);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [archiveQuery, setArchiveQuery] = useState("");
  const [instruction, setInstruction] = useState("");
  const [proposalScope, setProposalScope] = useState("selected");
  const [proposalSource, setProposalSource] = useState("Something completely new");
  const [proposalRequest, setProposalRequest] = useState("");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [brandDecision, setBrandDecision] = useState<BrandDecision>(INITIAL_BRAND_DECISION);
  const [founderStateRestored, setFounderStateRestored] = useState(false);
  const [convergenceOpen, setConvergenceOpen] = useState(false);
  const [closingPlacement, setClosingPlacement] = useState<ClosingPlacement>("PRE_FOOTER_CLOSING_SECTION");
  const [closingTreatment, setClosingTreatment] = useState<ClosingTreatment>("PERSIAN_ARCHITECTURAL");

  const pageContract = ATELIER_CONTENT_PAGES[page];
  const current = sections[page];
  const active = current.find((item) => item.id === selected) ?? current[0];
  const persianChoice = PERSIAN_CANDIDATES[persian];
  const porcelainChoice = PORCELAIN_CANDIDATES[porcelain];
  const mediaLens = mediaLensForSection(active);
  const suggestedArchive = useMemo(() => {
    const query = archiveQuery.trim().toLowerCase();
    return ARCHIVE.filter((item) => !query || `${item.id} ${item.title} ${item.family} ${item.purpose}`.toLowerCase().includes(query)).slice(0, 36);
  }, [archiveQuery]);
  const brief = useMemo(() => ({
    schema: "champagne.atelier.handoff.v3",
    contentAdapter: contentBundleAdapter(pageContract),
    page,
    viewport,
    materials: { persian: persianChoice, porcelain: porcelainChoice },
    sections: current.map((item, order) => ({ ...item, order })),
    governedJobs: pageContract.sections.map(({ id, job, capabilityGate }) => ({ id, job, capabilityGate, visible: !capabilityGate || LAB_CAPABILITIES[capabilityGate] })),
    architecturalClosing: { ...architecturalClosingContract, selectedPlacement: closingPlacement, selectedTreatment: closingTreatment },
    founderInstruction: instruction,
    proposals,
    decisionLedger: decisions,
    brandDecision,
    mediaLens,
    convergence: CONVERGENCE_LANES,
    productionBinding: false,
    approval: "FOUNDER_REVIEW_REQUIRED",
  }), [pageContract, page, viewport, persianChoice, porcelainChoice, current, closingPlacement, closingTreatment, instruction, proposals, decisions, brandDecision, mediaLens]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ATELIER_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { brandDecision?: BrandDecision; decisions?: Record<string, Decision> };
      if (parsed.brandDecision?.status === "FOUNDER_WORKING_DIRECTION") setBrandDecision(parsed.brandDecision);
      if (parsed.decisions) setDecisions(parsed.decisions);
    } catch { /* A private local preference must never block the Atelier. */ }
    finally { setFounderStateRestored(true); }
  }, []);

  useEffect(() => {
    if (!founderStateRestored) return;
    try { window.localStorage.setItem(ATELIER_STORAGE_KEY, JSON.stringify({ schema: "champagne.atelier.founder-state.v1", brandDecision, decisions })); } catch { /* Export remains the durable fallback. */ }
  }, [brandDecision, decisions, founderStateRestored]);

  const openEditor = (nextPage: AtelierPageKey, nextMaterial?: Material) => {
    setPage(nextPage);
    setSelected(visibleAtelierSections(ATELIER_CONTENT_PAGES[nextPage])[0].id);
    if (nextMaterial) setMaterial(nextMaterial);
    setView("editor");
  };
  const changePage = (next: AtelierPageKey) => { setPage(next); setSelected(visibleAtelierSections(ATELIER_CONTENT_PAGES[next])[0].id); setDrawer(null); };
  const updatePage = (fn: (items: PlacedSection[]) => PlacedSection[]) => setSections((all) => ({ ...all, [page]: fn([...all[page]]) }));
  const move = (delta: number) => updatePage((items) => { const at = items.findIndex((item) => item.id === selected); const to = at + delta; if (at < 0 || to < 0 || to >= items.length || items[at].locked || items[to].locked) return items; [items[at], items[to]] = [items[to], items[at]]; return items; });
  const placeArchive = (archiveId: string) => { updatePage((items) => items.map((item) => item.id === selected ? { ...item, archiveId } : item)); setCompareId(null); setDrawer(null); };
  const exportBrief = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `champagne-${page}-atelier-handoff.json`; anchor.click(); URL.revokeObjectURL(url); };
  const openProposal = () => { setProposalRequest(instruction); setDrawer("proposal"); };
  const saveProposal = () => {
    const request = proposalRequest.trim();
    if (!request) return;
    setProposals((items) => [...items, { id: `proposal-${items.length + 1}`, page, sectionId: active.id, scope: proposalScope, source: proposalSource, request, status: "LAB_PROPOSAL" }]);
    setInstruction(request);
    setDrawer(null);
  };
  const canvasStyle: LabStyle = {
    "--atelier-persian": colour(persianChoice.canvas), "--atelier-persian-raised": colour(persianChoice.elevated),
    "--atelier-porcelain": colour(porcelainChoice.base), "--atelier-porcelain-raised": colour(porcelainChoice.elevated),
    "--surface-ink": colour(persianChoice.canvas), "--surface-ink-soft": colour(persianChoice.elevated),
    "--bg-ink": colour(persianChoice.canvas), "--bg-ink-soft": colour(persianChoice.elevated),
    "--surface-0": colour(porcelainChoice.base), "--surface-1": colour(porcelainChoice.elevated),
  };

  if (view === "welcome") return <AtelierWelcome onOpen={openEditor} onBrand={() => setView("brand")} onAsk={() => { setView("editor"); setDrawer("proposal"); }} />;
  if (view === "brand") return <BrandWorkshop decision={brandDecision} onChange={setBrandDecision} onClose={() => setView("welcome")} onOpenPage={() => openEditor("home")} />;

  return <main className="dl4-app">
    <header className="dl4-topbar"><button className="dl4-home-button" onClick={() => setView("welcome")}><strong>Champagne Atelier</strong><span>Studio home</span></button><nav className="dl43-workspace-nav" aria-label="Atelier workspace"><button onClick={() => setView("brand")}>Brand workshop</button><button aria-current="page">Page atelier</button><button onClick={() => setConvergenceOpen(true)}>Experience layers</button></nav><label><span>Page</span><select aria-label="Page" value={page} onChange={(event) => changePage(event.target.value as AtelierPageKey)}>{Object.entries(PAGE_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label><div className="dl4-device" aria-label="Canvas viewport">{(["desktop", "tablet", "mobile"] as Viewport[]).map((item) => <button key={item} aria-pressed={viewport === item} onClick={() => setViewport(item)}>{item}</button>)}</div><div className="dl4-actions"><span>Draft · saved locally</span><button onClick={exportBrief}>Export Atelier brief</button></div></header>

    <aside className="dl4-pages"><div className="dl4-panel-heading"><h2>Pages</h2><button aria-label="Propose a new page" onClick={openProposal}>＋</button></div>{(Object.keys(PAGE_NAMES) as AtelierPageKey[]).map((key) => <button className="dl4-page" aria-current={page === key ? "page" : undefined} key={key} onClick={() => changePage(key)}><span>{PAGE_NAMES[key]}</span><small>{visibleAtelierSections(ATELIER_CONTENT_PAGES[key]).length} visible · {ATELIER_CONTENT_PAGES[key].sections.length} jobs</small></button>)}<div className="dl4-content-status"><strong>Lab seed copy</strong><p>The section jobs are authoritative. The prose is temporary until the approved content bundle arrives.</p></div><div className="dl4-panel-heading"><h2>Page flow</h2><button aria-label="Browse section designs" onClick={() => setDrawer("archive")}>＋</button></div><ol className="dl4-layers">{current.map((item, index) => <li key={item.id}><button aria-current={selected === item.id} onClick={() => setSelected(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.label}</strong><small>{item.locked ? "Canonical · protected" : item.archiveId ? "Archive design placed" : "Lab seed copy"}</small></div></button></li>)}</ol><div className="dl4-left-actions"><button onClick={() => setDrawer("archive")}>Explore existing designs</button><button onClick={openProposal}>✦ Create something new</button></div></aside>

    <section className="dl4-workspace"><div className="dl4-context"><span>{PAGE_NAMES[page]} · real semantic flow</span><strong>{viewport === "desktop" ? "1440px" : viewport === "tablet" ? "768px" : "390px"}</strong><span>{pageContract.primaryQuestion}</span></div><div className="dl4-scroll"><article className={`dl4-canvas dl4-${viewport}`} style={canvasStyle}>{current.map((item) => <section key={item.id} data-semantic-id={item.id} data-content-state={item.contentState} data-tone={item.tone} data-treatment={item.id === "home.closing-invitation" ? closingTreatment : undefined} className={selected === item.id ? "is-selected" : ""} onClick={() => setSelected(item.id)}>{item.locked ? heroes[page] : item.id === "home.closing-invitation" ? <ArchitecturalClosing placement={closingPlacement} treatment={closingTreatment} /> : item.archiveId ? <figure className="dl4-placed"><img src={assetFor(item.archiveId)} alt={`${item.label} visual proposal`} /><figcaption><span>Archive proposal</span><button onClick={(event) => { event.stopPropagation(); setDrawer("archive"); }}>Replace</button></figcaption></figure> : <SeedSection item={item} />}{selected === item.id ? <div className="dl4-selection"><strong>{item.label}</strong>{item.locked ? <span>Canonical Hero V2 · protected</span> : <><button onClick={(event) => { event.stopPropagation(); move(-1); }}>Move up</button><button onClick={(event) => { event.stopPropagation(); move(1); }}>Move down</button><button onClick={(event) => { event.stopPropagation(); setDrawer("archive"); }}>Replace / compare</button></>}</div> : null}</section>)}</article></div></section>

    <aside className="dl4-inspector"><div className="dl4-panel-heading"><h2>Shape the look</h2><span>Live on canvas</span></div><button className="dl43-brand-chip" onClick={() => setView("brand")}><span>Working Brand DNA</span><strong>{brandDecision.territory.replaceAll("-", " ")}</strong><small>{brandDecision.typography} · {brandDecision.rhythm}</small></button><div className="dl4-material-tabs"><button aria-pressed={material === "persian"} onClick={() => setMaterial("persian")}>Persian Velvet Blue</button><button aria-pressed={material === "porcelain"} onClick={() => setMaterial("porcelain")}>Porcelain</button></div>{material === "persian" ? <MaterialPicker items={PERSIAN_CANDIDATES} value={persian} onChange={setPersian} colour={(item) => colour(item.canvas)} /> : <MaterialPicker items={PORCELAIN_CANDIDATES} value={porcelain} onChange={setPorcelain} colour={(item) => colour(item.base)} />}{active.id === "home.closing-invitation" ? <ArchitecturalClosingControls placement={closingPlacement} treatment={closingTreatment} onPlacement={setClosingPlacement} onTreatment={setClosingTreatment} /> : null}<section className="dl4-active"><span>Selected on page</span><h2>{active.label}</h2><p>{active.job}</p><small>Temporary Lab seed copy · semantic job preserved</small>{!active.locked && <div><button onClick={() => setDrawer("archive")}>Existing designs</button><button onClick={openProposal}>✦ New proposal</button></div>}</section><MediaLens lens={mediaLens} onOpen={() => setConvergenceOpen(true)} /><section className="dl4-decisions"><h2>Your decision</h2><div>{(["love", "keep", "maybe", "reject"] as Decision[]).map((choice) => <button key={choice} aria-pressed={decisions[active.id] === choice} onClick={() => setDecisions((items) => ({ ...items, [active.id]: choice }))}>{choice}</button>)}</div></section><section className="dl4-ask"><h2>Ask Atelier</h2><p>Describe the feeling or page change you want. It will become a truthful Lab proposal.</p><textarea value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="For example: make this warmer, more editorial and less formal…" /><button onClick={openProposal}>Turn this into a proposal</button>{proposals.length ? <small>{proposals.length} saved proposal{proposals.length === 1 ? "" : "s"} in this brief</small> : null}</section></aside>

    {drawer === "archive" ? <ArchiveDrawer active={active} items={suggestedArchive} query={archiveQuery} compareId={compareId} onQuery={setArchiveQuery} onCompare={setCompareId} onPlace={placeArchive} onClose={() => setDrawer(null)} /> : null}
    {drawer === "proposal" ? <div className="dl4-modal-backdrop"><section className="dl4-modal" role="dialog" aria-modal="true" aria-labelledby="proposal-heading"><button className="dl4-close" aria-label="Close proposal workshop" onClick={() => setDrawer(null)}>×</button><span>Governed design workshop</span><h2 id="proposal-heading">Propose something genuinely new</h2><p>Your request stays linked to {active.label} and remains a Lab proposal until Founder review.</p><label>Design scope<select value={proposalScope} onChange={(event) => setProposalScope(event.target.value)}><option value="selected">Selected section — {active.label}</option><option value="page">Complete {PAGE_NAMES[page]} page</option><option value="brand">New brand direction</option><option value="component">New reusable component</option></select></label><label>What should feel different?<textarea value={proposalRequest} onChange={(event) => setProposalRequest(event.target.value)} placeholder="Describe feeling, layout, references, colours, movement, or anything missing…" /></label><label>Start from<select value={proposalSource} onChange={(event) => setProposalSource(event.target.value)}><option>Something completely new</option><option>The selected section</option><option>A V27 archive design</option><option>A reference or sketch I will provide</option></select></label><div className="dl4-modal-actions"><button onClick={() => setDrawer(null)}>Keep editing</button><button disabled={!proposalRequest.trim()} onClick={saveProposal}>Save proposal into brief</button></div><small>Draft only · Founder review required · cannot bind production</small></section></div> : null}
    {convergenceOpen ? <ConvergenceDrawer onClose={() => setConvergenceOpen(false)} /> : null}
  </main>;
}

function AtelierWelcome({ onOpen, onBrand, onAsk }: { onOpen: (page: AtelierPageKey, material?: Material) => void; onBrand: () => void; onAsk: () => void }) {
  return <main className="dl4-welcome"><header><div><strong>Champagne Atelier</strong><span>Private Founder studio · production binding off</span></div><a href="/champagne/design-lab/exemplars/home-a">View Homepage A</a></header><section className="dl4-welcome-intro"><h1>Where would you like to begin?</h1><p>Develop the brand, shape a real page or explore something completely new. The deeper machinery stays quietly underneath until you need it.</p></section><div className="dl4-welcome-paths"><section className="is-featured"><span>01</span><h2>Develop the brand</h2><p>Enter a guided workshop for the complete visual character—not just a colour picker.</p><button onClick={onBrand}>Open the Brand Workshop</button><button onClick={() => onOpen("home", "persian")}>Go straight to page materials</button></section><section><span>02</span><h2>Design pages</h2><p>Shape the real semantic flow, starting with the Homepage.</p><button onClick={() => onOpen("home")}>Open Homepage Atelier</button><button onClick={() => onOpen("implants")}>Open Dental Implants</button><button onClick={() => onOpen("bonding")}>Open Composite Bonding</button></section><section><span>03</span><h2>Explore designs</h2><p>Visit the recovered 331-piece visual archive only when you want more possibilities.</p><a href="/champagne/design-lab/rooms/headers">Browse the design library</a><a href="/champagne/design-lab/rooms/footers">Explore footers</a></section><section><span>04</span><h2>Ask Atelier</h2><p>Describe what feels wrong, flat, crowded or missing in plain English.</p><button onClick={onAsk}>Describe what you want</button></section><section><span>05</span><h2>Compare and compose</h2><p>Compare complete directions or arrange shortlisted ideas.</p><a href="/champagne/design-lab/exemplars/home-a">Compare Homepage directions</a><a href="/champagne/design-lab#room-11">Open Composition Room</a></section></div><details className="dl4-welcome-advanced"><summary>Advanced evidence and machine handoff</summary><p>Stable semantic IDs, archive provenance, capability truth and Captain/WEOS exports remain available without crowding the creative experience.</p></details></main>;
}

function MediaLens({ lens, onOpen }: { lens: ReturnType<typeof mediaLensForSection>; onOpen: () => void }) { return <section className="dl43-media-lens"><header><span>Media Lens</span><strong>{lens.requirement === "TEXT_LED_ACCEPTABLE" ? "Text-led is valid" : "Media has a defined job"}</strong></header><p>{lens.job}</p><dl><div><dt>Slot</dt><dd>{lens.slotId ?? lens.modelSlotId ?? "No fixed slot"}</dd></div><div><dt>Assets</dt><dd>{lens.availableAssets.length ? `${lens.availableAssets.length} available` : "Awaiting registry"}</dd></div><div><dt>Crop / devices</dt><dd>{lens.preferredAspectRatio}</dd></div><div><dt>Provenance</dt><dd>{lens.authenticity}</dd></div><div><dt>Fallback</dt><dd>{lens.fallback.replaceAll("_", " ").toLowerCase()}</dd></div></dl><button onClick={onOpen}>Open experience layers</button></section>; }

function ConvergenceDrawer({ onClose }: { onClose: () => void }) { return <div className="dl43-convergence" role="dialog" aria-modal="true" aria-labelledby="convergence-heading"><header><div><span>Cross-lane convergence</span><h2 id="convergence-heading">Experience layers</h2><p>The Atelier composes authoritative lane outputs. It does not impersonate them.</p></div><button onClick={onClose}>Close</button></header><section className="dl43-lane-status"><h3>Contract arrivals</h3>{CONVERGENCE_LANES.map((lane) => <article key={lane.id}><span>{lane.state.replaceAll("_", " ")}</span><strong>{lane.name}</strong><p>{lane.owns}</p><small>Next: {lane.next}</small></article>)}</section><section className="dl43-studios"><h3>Future Atelier rooms</h3>{EXPERIENCE_STUDIOS.map((studio) => <article key={studio.id}><div><strong>{studio.name}</strong><span>{studio.state}</span></div><p>{studio.description}</p><button disabled>Opens when contract-ready</button></article>)}</section><footer>Stable semantic section IDs remain the shared join. All unavailable capabilities fail closed.</footer></div>; }

function SeedSection({ item }: { item: PlacedSection }) { return <div className="dl4-native"><span>{item.label}</span><h2>{item.title}</h2><p>{item.copy}</p>{item.modelSlot ? <div className="dl4-static-fallback"><strong>Static educational fallback</strong><small>Interactive 3D remains off · transcript required</small></div> : null}{item.id.endsWith("next-step") ? <button>Explore your options</button> : null}</div>; }

function MaterialPicker<T extends { id: string; name: string; note: string }>({ items, value, onChange, colour }: { items: readonly T[]; value: number; onChange: (value: number) => void; colour: (item: T) => string }) { const item = items[value]; return <section className="dl4-material"><div className="dl4-material-preview" style={{ background: colour(item) }}><span>{value + 1} / {items.length}</span><strong>{item.name}</strong></div><p>{item.note}</p><label><span>Choose a material</span><select value={value} onChange={(event) => onChange(Number(event.target.value))}>{items.map((candidate, index) => <option key={candidate.id} value={index}>{candidate.name}</option>)}</select></label><div className="dl4-swatches">{items.map((candidate, index) => <button key={candidate.id} title={candidate.name} aria-label={candidate.name} aria-pressed={value === index} style={{ background: colour(candidate) }} onClick={() => onChange(index)} />)}</div><div className="dl4-material-nav"><button disabled={value === 0} onClick={() => onChange(value - 1)}>← Previous</button><button disabled={value === items.length - 1} onClick={() => onChange(value + 1)}>Next →</button></div></section>; }

function ArchiveDrawer({ active, items, query, compareId, onQuery, onCompare, onPlace, onClose }: { active: PlacedSection; items: ArchiveItem[]; query: string; compareId: string | null; onQuery: (value: string) => void; onCompare: (value: string | null) => void; onPlace: (id: string) => void; onClose: () => void }) { const compared = items.find((item) => item.id === compareId); return <div className="dl4-drawer" role="dialog" aria-modal="true" aria-label="Existing design library"><header><div><span>Design source drawer</span><h2>Explore designs for {active.label}</h2><p>Genuine V27 visual evidence, placed only into this isolated draft.</p></div><button onClick={onClose}>Close</button></header><div className="dl4-drawer-tools"><input aria-label="Search design archive" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search all 331 designs…" /><span>{items.length} designs shown</span></div>{compared ? <div className="dl4-compare"><ArchiveCard item={items[0]} onPlace={onPlace} /><ArchiveCard item={compared} onPlace={onPlace} /><button className="dl4-stop-compare" onClick={() => onCompare(null)}>Stop comparison</button></div> : <div className="dl4-grid">{items.map((item) => <ArchiveCard key={item.id} item={item} onPlace={onPlace} onCompare={() => onCompare(item.id)} />)}</div>}</div>; }

function ArchiveCard({ item, onPlace, onCompare }: { item?: ArchiveItem; onPlace: (id: string) => void; onCompare?: () => void }) { if (!item) return null; return <article className="dl4-card"><div><img src={assetFor(item.id)} alt={`${item.title} visual design`} /></div><span>Archive design</span><h3>{item.title}</h3><p>{item.purpose}</p><footer><button onClick={() => onPlace(item.id)}>Place in page</button>{onCompare ? <button onClick={onCompare}>Compare</button> : null}<a href={assetFor(item.id)} target="_blank" rel="noreferrer">Full size</a></footer></article>; }

function ArchitecturalClosing({ placement, treatment }: { placement: ClosingPlacement; treatment: ClosingTreatment }) { return <div className="dl4-architectural" data-placement={placement} data-treatment={treatment}><img src={architecturalClosingConcept.src} alt="Fictional architectural entrance used only to preview the St Mary's House closing composition" /><div className="dl4-architectural-shade" /><div className="dl4-architectural-copy"><span>St Mary’s House · architectural closing study</span><h2>Exceptional care.<br />Enduring confidence.</h2><i aria-hidden="true" /><p>Final version awaits your genuine entrance photograph.</p><button>Request a consultation</button></div><div className="dl4-concept-label">Lab proposal · fictional architecture · not St Mary’s House</div>{placement === "FULL_FOOTER" ? <footer className="dl4-architectural-footer"><strong>St Mary’s House Dental Care</strong><nav aria-label="Architectural footer preview"><span>Treatments</span><span>Our approach</span><span>The practice</span><span>Contact</span></nav></footer> : null}</div>; }

function ArchitecturalClosingControls({ placement, treatment, onPlacement, onTreatment }: { placement: ClosingPlacement; treatment: ClosingTreatment; onPlacement: (value: ClosingPlacement) => void; onTreatment: (value: ClosingTreatment) => void }) { return <section className="dl4-closing-controls"><span>Architectural closing</span><h2>Choose its role and finish</h2><div className="dl4-segmented"><button aria-pressed={placement === "PRE_FOOTER_CLOSING_SECTION"} onClick={() => onPlacement("PRE_FOOTER_CLOSING_SECTION")}>Above footer</button><button aria-pressed={placement === "FULL_FOOTER"} onClick={() => onPlacement("FULL_FOOTER")}>Full footer</button></div><div className="dl4-treatment-list"><button aria-pressed={treatment === "PERSIAN_ARCHITECTURAL"} onClick={() => onTreatment("PERSIAN_ARCHITECTURAL")}><i data-swatch="persian" />Persian architectural</button><button aria-pressed={treatment === "PORCELAIN_GALLERY"} onClick={() => onTreatment("PORCELAIN_GALLERY")}><i data-swatch="porcelain" />Porcelain gallery</button><button aria-pressed={treatment === "GILDED_BRAND_GOLD"} onClick={() => onTreatment("GILDED_BRAND_GOLD")}><i data-swatch="gold" />Gilded brand gold</button></div><p>The genuine photograph will replace only the media layer. Provenance rules travel inside every export.</p></section>; }
