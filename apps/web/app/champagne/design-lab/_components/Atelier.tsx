"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import registry from "../data/v27-registry.json";
import architecturalClosingContract from "../data/architectural-closing-contract.v1.json";
import architecturalClosingConcept from "../assets/st-marys-architectural-closing-concept-v1.png";
import { PERSIAN_CANDIDATES, PORCELAIN_CANDIDATES } from "../data/materials";
import { TEMPORAL_SIMULATIONS, type AtelierTime } from "../data/temporal-simulation";
import { BrandWorkshop } from "./BrandWorkshop";
import { ExperienceRooms, type ExperienceDecisionState } from "./ExperienceRooms";
import {
  CONVERGENCE_LANES,
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

type DeviceId = "desktop" | "ipad-portrait" | "ipad-landscape" | "iphone" | "custom";
type Orientation = "portrait" | "landscape";
type StudioTime = AtelierTime;
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
const DEVICE_PRESETS: Record<Exclude<DeviceId, "custom">, { label: string; width: number; height: number }> = {
  desktop: { label: "Desktop", width: 1440, height: 900 },
  "ipad-portrait": { label: "iPad portrait", width: 768, height: 1024 },
  "ipad-landscape": { label: "iPad landscape", width: 1024, height: 768 },
  iphone: { label: "iPhone", width: 390, height: 844 },
};

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
  const [device, setDevice] = useState<DeviceId>("desktop");
  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [customSize, setCustomSize] = useState({ width: 1200, height: 800 });
  const [displayScale, setDisplayScale] = useState(50);
  const [deviceFrame, setDeviceFrame] = useState(true);
  const [cleanPreview, setCleanPreview] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState<"OFF" | "NATIVE" | "FALLBACK">("OFF");
  const [studioTime, setStudioTime] = useState<StudioTime>("canonical");
  const [compareTime, setCompareTime] = useState<StudioTime | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
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
  const [experienceDecision, setExperienceDecision] = useState<ExperienceDecisionState | null>(null);
  const [closingPlacement, setClosingPlacement] = useState<ClosingPlacement>("PRE_FOOTER_CLOSING_SECTION");
  const [closingTreatment, setClosingTreatment] = useState<ClosingTreatment>("PERSIAN_ARCHITECTURAL");

  const pageContract = ATELIER_CONTENT_PAGES[page];
  const current = sections[page];
  const active = current.find((item) => item.id === selected) ?? current[0];
  const persianChoice = PERSIAN_CANDIDATES[persian];
  const porcelainChoice = PORCELAIN_CANDIDATES[porcelain];
  const mediaLens = mediaLensForSection(active);
  const resolvedViewport = useMemo(() => {
    const rawViewport = device === "custom" ? customSize : DEVICE_PRESETS[device];
    return orientation === "portrait"
      ? { width: Math.min(rawViewport.width, rawViewport.height), height: Math.max(rawViewport.width, rawViewport.height) }
      : { width: Math.max(rawViewport.width, rawViewport.height), height: Math.min(rawViewport.width, rawViewport.height) };
  }, [customSize, device, orientation]);
  const suggestedArchive = useMemo(() => {
    const query = archiveQuery.trim().toLowerCase();
    return ARCHIVE.filter((item) => !query || `${item.id} ${item.title} ${item.family} ${item.purpose}`.toLowerCase().includes(query)).slice(0, 36);
  }, [archiveQuery]);
  const brief = useMemo(() => ({
    schema: "champagne.atelier.handoff.v3",
    contentAdapter: contentBundleAdapter(pageContract),
    page,
    previewState: { device, orientation, viewport: resolvedViewport, displayScale, deviceFrame, cleanPreview, studioTime, compareTime, mode: "SIMULATION_ONLY" },
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
    experienceDecision,
    productionBinding: false,
    approval: "FOUNDER_REVIEW_REQUIRED",
  }), [pageContract, page, device, orientation, resolvedViewport, displayScale, deviceFrame, cleanPreview, studioTime, compareTime, persianChoice, porcelainChoice, current, closingPlacement, closingTreatment, instruction, proposals, decisions, brandDecision, mediaLens, experienceDecision]);

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
  const selectSection = (id: string) => {
    setSelected(id);
    window.requestAnimationFrame(() => previewRef.current?.querySelector<HTMLElement>(`[data-semantic-id="${id}"]`)?.scrollIntoView({ block: "start", behavior: "smooth" }));
  };
  const setPreset = (next: DeviceId) => {
    setDevice(next);
    if (next === "ipad-portrait" || next === "iphone") setOrientation("portrait");
    if (next === "desktop" || next === "ipad-landscape") setOrientation("landscape");
  };
  useEffect(() => {
    const syncFullscreen = () => setFullscreenMode(document.fullscreenElement ? "NATIVE" : "OFF");
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);
  const toggleFullscreen = async () => {
    if (!document.fullscreenEnabled || !previewRef.current) {
      setCleanPreview(true);
      setFullscreenMode("FALLBACK");
      return;
    }
    if (document.fullscreenElement) await document.exitFullscreen();
    else await previewRef.current.requestFullscreen();
  };
  const closeExperienceRooms = useCallback(() => setConvergenceOpen(false), []);
  const canvasStyle: LabStyle = {
    "--atelier-persian": colour(persianChoice.canvas), "--atelier-persian-raised": colour(persianChoice.elevated),
    "--atelier-porcelain": colour(porcelainChoice.base), "--atelier-porcelain-raised": colour(porcelainChoice.elevated),
    "--surface-ink": colour(persianChoice.canvas), "--surface-ink-soft": colour(persianChoice.elevated),
    "--bg-ink": colour(persianChoice.canvas), "--bg-ink-soft": colour(persianChoice.elevated),
    "--surface-0": colour(porcelainChoice.base), "--surface-1": colour(porcelainChoice.elevated),
  };
  const canvas = (time: StudioTime, suffix = "primary") => <article
    key={suffix}
    className="dl4-canvas dl45-canvas"
    data-brand-territory={brandDecision.territory}
    data-brand-accent={brandDecision.accent}
    data-brand-type={brandDecision.typography}
    data-brand-rhythm={brandDecision.rhythm}
    data-studio-time={time}
    data-time-canon={TEMPORAL_SIMULATIONS[time].canon}
    data-time-runtime={TEMPORAL_SIMULATIONS[time].heroRuntime}
    data-time-scope={TEMPORAL_SIMULATIONS[time].scope}
    style={canvasStyle}
  >{current.map((item) => <section key={item.id} data-semantic-id={item.id} data-content-state={item.contentState} data-tone={item.tone} data-treatment={item.id === "home.closing-invitation" ? closingTreatment : undefined} className={selected === item.id ? "is-selected" : ""} onClick={() => setSelected(item.id)}>{item.locked ? heroes[page] : item.id === "home.closing-invitation" ? <ArchitecturalClosing item={item} placement={closingPlacement} treatment={closingTreatment} /> : item.archiveId ? <figure className="dl4-placed"><img src={assetFor(item.archiveId)} alt={`${item.label} visual proposal`} /><figcaption><span>Archive proposal</span><button onClick={(event) => { event.stopPropagation(); setDrawer("archive"); }}>Replace</button></figcaption></figure> : <ContentSection item={item} />}{selected === item.id && !cleanPreview ? <div className="dl4-selection"><strong>{item.label}</strong>{item.locked ? <span>Canonical Hero V2 · protected</span> : <><button onClick={(event) => { event.stopPropagation(); move(-1); }}>Move up</button><button onClick={(event) => { event.stopPropagation(); move(1); }}>Move down</button><button onClick={(event) => { event.stopPropagation(); setDrawer("archive"); }}>Replace / compare</button></>}</div> : null}</section>)}</article>;

  if (view === "welcome") return <AtelierWelcome onOpen={openEditor} onBrand={() => setView("brand")} onAsk={() => { setView("editor"); setDrawer("proposal"); }} />;
  if (view === "brand") return <BrandWorkshop decision={brandDecision} onChange={setBrandDecision} onClose={() => setView("welcome")} onOpenPage={() => openEditor("home")} />;

  return <main className="dl4-app dl45-app" data-clean-preview={cleanPreview}>
    <header className="dl4-topbar"><button className="dl4-home-button" onClick={() => setView("welcome")}><strong>Champagne Atelier</strong><span>Studio home</span></button><nav className="dl43-workspace-nav" aria-label="Atelier workspace"><button onClick={() => setView("brand")}>Brand workshop</button><button aria-current="page">Page atelier</button><button onClick={() => setConvergenceOpen(true)}>Experience layers</button></nav><label><span>Page</span><select aria-label="Page" value={page} onChange={(event) => changePage(event.target.value as AtelierPageKey)}>{Object.entries(PAGE_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label><div className="dl45-preview-actions"><button aria-pressed={cleanPreview} onClick={() => { if (cleanPreview && fullscreenMode === "FALLBACK") setFullscreenMode("OFF"); setCleanPreview((value) => !value); }}>{cleanPreview ? "Return to studio" : "Clean preview"}</button><button onClick={toggleFullscreen}>Fullscreen</button></div><div className="dl4-actions"><span>Simulation only · production binding off</span><button onClick={exportBrief}>Export governed brief</button></div></header>

    <aside className="dl4-pages"><div className="dl4-panel-heading"><h2>Pages</h2><button aria-label="Propose a new page" onClick={openProposal}>＋</button></div>{(Object.keys(PAGE_NAMES) as AtelierPageKey[]).map((key) => <button className="dl4-page" aria-current={page === key ? "page" : undefined} key={key} onClick={() => changePage(key)}><span>{PAGE_NAMES[key]}</span><small>{visibleAtelierSections(ATELIER_CONTENT_PAGES[key]).length} visible · {ATELIER_CONTENT_PAGES[key].sections.length} jobs</small></button>)}<div className="dl4-content-status" data-state={pageContract.bundleStatus}><strong>{page === "home" ? "Real Content Bundle connected" : "Lab seed copy"}</strong><p>{page === "home" ? "12 visible chapters · FACT BLOCKED · composition testing only. Patient evidence is fully omitted." : "The section jobs are authoritative. The prose remains temporary until its approved content bundle arrives."}</p></div><div className="dl4-panel-heading"><h2>Page flow</h2><button aria-label="Back to page top" onClick={() => previewRef.current?.scrollTo({ top: 0, behavior: "smooth" })}>↑</button></div><ol className="dl4-layers">{current.map((item, index) => <li key={item.id}><button aria-current={selected === item.id} onClick={() => selectSection(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.label}</strong><small>{item.locked ? "Canonical · protected" : item.archiveId ? "Archive design placed" : item.contentState === "CONTENT_BUNDLE_V1_FACT_BLOCKED" ? "Real copy · fact blocked" : "Lab seed copy"}</small></div></button></li>)}</ol><div className="dl4-left-actions"><button onClick={() => setDrawer("archive")}>Explore existing designs</button><button onClick={openProposal}>✦ Create something new</button></div></aside>

    <section className="dl4-workspace"><div className="dl4-context"><span>{PAGE_NAMES[page]} · real semantic flow</span><strong>{resolvedViewport.width} × {resolvedViewport.height} · {displayScale}% display</strong><span>{pageContract.primaryQuestion}</span></div><div className="dl4-scroll dl45-preview-stage" ref={previewRef} data-device={device} data-orientation={orientation} data-viewport-width={resolvedViewport.width} data-viewport-height={resolvedViewport.height} data-display-scale={displayScale} data-device-frame={deviceFrame} data-studio-time={studioTime} data-time-canon={TEMPORAL_SIMULATIONS[studioTime].canon} data-time-runtime={TEMPORAL_SIMULATIONS[studioTime].heroRuntime} data-time-scope={TEMPORAL_SIMULATIONS[studioTime].scope} data-fullscreen-mode={fullscreenMode} data-brand-territory={brandDecision.territory} data-brand-accent={brandDecision.accent} data-brand-type={brandDecision.typography} data-brand-rhythm={brandDecision.rhythm} data-persian-candidate={persianChoice.id} data-porcelain-candidate={porcelainChoice.id} data-comparing={Boolean(compareTime)}><div className="dl45-preview-frame" style={{ width: resolvedViewport.width, height: resolvedViewport.height, transform: `scale(${displayScale / 100})` }}><div className="dl45-preview-scroll">{canvas(studioTime)}</div></div>{compareTime ? <div className="dl45-preview-frame" style={{ width: resolvedViewport.width, height: resolvedViewport.height, transform: `scale(${displayScale / 100})` }}><div className="dl45-preview-scroll">{canvas(compareTime, "comparison")}</div></div> : null}</div></section>

    <aside className="dl4-inspector"><div className="dl4-panel-heading"><h2>Shape the look</h2><span>Live on canvas</span></div><button className="dl43-brand-chip" onClick={() => setView("brand")}><span>Working Brand DNA</span><strong>{brandDecision.territory.replaceAll("-", " ")}</strong><small>{brandDecision.typography} · {brandDecision.rhythm}</small></button><div className="dl4-material-tabs"><button aria-pressed={material === "persian"} onClick={() => setMaterial("persian")}>Persian Velvet Blue</button><button aria-pressed={material === "porcelain"} onClick={() => setMaterial("porcelain")}>Porcelain</button></div>{material === "persian" ? <MaterialPicker items={PERSIAN_CANDIDATES} value={persian} onChange={setPersian} colour={(item) => colour(item.canvas)} /> : <MaterialPicker items={PORCELAIN_CANDIDATES} value={porcelain} onChange={setPorcelain} colour={(item) => colour(item.base)} />}{active.id === "home.closing-invitation" ? <ArchitecturalClosingControls placement={closingPlacement} treatment={closingTreatment} onPlacement={setClosingPlacement} onTreatment={setClosingTreatment} /> : null}<section className="dl4-active"><span>Selected on page</span><h2>{active.label}</h2><p>{active.job}</p><small>{active.contentState === "CONTENT_BUNDLE_V1_FACT_BLOCKED" ? "Real Content Bundle · FACT BLOCKED · not publishable" : "Temporary Lab seed copy · semantic job preserved"}</small>{!active.locked && <div><button onClick={() => setDrawer("archive")}>Existing designs</button><button onClick={openProposal}>✦ New proposal</button></div>}</section><MediaLens lens={mediaLens} onOpen={() => setConvergenceOpen(true)} /><section className="dl4-decisions"><h2>Your decision</h2><div>{(["love", "keep", "maybe", "reject"] as Decision[]).map((choice) => <button key={choice} aria-pressed={decisions[active.id] === choice} onClick={() => setDecisions((items) => ({ ...items, [active.id]: choice }))}>{choice}</button>)}</div></section><section className="dl4-ask"><h2>Ask Atelier</h2><p>Describe the feeling or page change you want. It will become a truthful Lab proposal.</p><textarea value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="For example: make this warmer, more editorial and less formal…" /><button onClick={openProposal}>Turn this into a proposal</button>{proposals.length ? <small>{proposals.length} saved proposal{proposals.length === 1 ? "" : "s"} in this brief</small> : null}</section></aside>

    {!cleanPreview ? <aside className="dl45-preview-controls" aria-label="Preview matrix controls"><PreviewStudio device={device} orientation={orientation} customSize={customSize} displayScale={displayScale} deviceFrame={deviceFrame} studioTime={studioTime} compareTime={compareTime} onDevice={setPreset} onOrientation={setOrientation} onCustomSize={setCustomSize} onScale={setDisplayScale} onDeviceFrame={setDeviceFrame} onTime={setStudioTime} onCompareTime={setCompareTime} /></aside> : null}
    {drawer === "archive" ? <ArchiveDrawer active={active} items={suggestedArchive} query={archiveQuery} compareId={compareId} onQuery={setArchiveQuery} onCompare={setCompareId} onPlace={placeArchive} onClose={() => setDrawer(null)} /> : null}
    {drawer === "proposal" ? <div className="dl4-modal-backdrop"><section className="dl4-modal" role="dialog" aria-modal="true" aria-labelledby="proposal-heading"><button className="dl4-close" aria-label="Close proposal workshop" onClick={() => setDrawer(null)}>×</button><span>Governed design workshop</span><h2 id="proposal-heading">Propose something genuinely new</h2><p>Your request stays linked to {active.label} and remains a Lab proposal until Founder review.</p><label>Design scope<select value={proposalScope} onChange={(event) => setProposalScope(event.target.value)}><option value="selected">Selected section — {active.label}</option><option value="page">Complete {PAGE_NAMES[page]} page</option><option value="brand">New brand direction</option><option value="component">New reusable component</option></select></label><label>What should feel different?<textarea value={proposalRequest} onChange={(event) => setProposalRequest(event.target.value)} placeholder="Describe feeling, layout, references, colours, movement, or anything missing…" /></label><label>Start from<select value={proposalSource} onChange={(event) => setProposalSource(event.target.value)}><option>Something completely new</option><option>The selected section</option><option>A V27 archive design</option><option>A reference or sketch I will provide</option></select></label><div className="dl4-modal-actions"><button onClick={() => setDrawer(null)}>Keep editing</button><button disabled={!proposalRequest.trim()} onClick={saveProposal}>Save proposal into brief</button></div><small>Draft only · Founder review required · cannot bind production</small></section></div> : null}
    {convergenceOpen ? <ExperienceRooms onClose={closeExperienceRooms} onGovernedChange={setExperienceDecision} /> : null}
  </main>;
}

function AtelierWelcome({ onOpen, onBrand, onAsk }: { onOpen: (page: AtelierPageKey, material?: Material) => void; onBrand: () => void; onAsk: () => void }) {
  return <main className="dl4-welcome"><header><div><strong>Champagne Atelier</strong><span>Private Founder studio · production binding off</span></div><a href="/champagne/design-lab/exemplars/home-a">View Homepage A</a></header><section className="dl4-welcome-intro"><h1>Where would you like to begin?</h1><p>Develop the brand, shape a real page or explore something completely new. The deeper machinery stays quietly underneath until you need it.</p></section><div className="dl4-welcome-paths"><section className="is-featured"><span>01</span><h2>Develop the brand</h2><p>Enter a guided workshop for the complete visual character—not just a colour picker.</p><button onClick={onBrand}>Open the Brand Workshop</button><button onClick={() => onOpen("home", "persian")}>Go straight to page materials</button></section><section><span>02</span><h2>Design pages</h2><p>Shape the real semantic flow, starting with the Homepage.</p><button onClick={() => onOpen("home")}>Open Homepage Atelier</button><button onClick={() => onOpen("implants")}>Open Dental Implants</button><button onClick={() => onOpen("bonding")}>Open Composite Bonding</button></section><section><span>03</span><h2>Explore designs</h2><p>Visit the recovered 331-piece visual archive only when you want more possibilities.</p><a href="/champagne/design-lab/rooms/headers">Browse the design library</a><a href="/champagne/design-lab/rooms/footers">Explore footers</a></section><section><span>04</span><h2>Ask Atelier</h2><p>Describe what feels wrong, flat, crowded or missing in plain English.</p><button onClick={onAsk}>Describe what you want</button></section><section><span>05</span><h2>Compare and compose</h2><p>Compare complete directions or arrange shortlisted ideas.</p><a href="/champagne/design-lab/exemplars/home-a">Compare Homepage directions</a><a href="/champagne/design-lab#room-11">Open Composition Room</a></section></div><details className="dl4-welcome-advanced"><summary>Advanced evidence and machine handoff</summary><p>Stable semantic IDs, archive provenance, capability truth and Captain/WEOS exports remain available without crowding the creative experience.</p></details></main>;
}

function MediaLens({ lens, onOpen }: { lens: ReturnType<typeof mediaLensForSection>; onOpen: () => void }) { return <section className="dl43-media-lens"><header><span>Media Lens</span><strong>{lens.required ? "Media has a defined job" : "Text-led is valid"}</strong></header><p>{lens.job}</p><dl><div><dt>Resolved slot</dt><dd>{lens.resolvedSlotId}</dd></div><div><dt>Source IDs</dt><dd>{lens.contentSlotIds.join(", ") || "None"}</dd></div><div><dt>Asset</dt><dd>{lens.availability.replaceAll("_", " ").toLowerCase()}</dd></div><div><dt>Crop</dt><dd>{lens.aspectRatio}</dd></div><div><dt>Authenticity</dt><dd>{lens.authenticity}</dd></div><div><dt>Fallback</dt><dd>{lens.fallback}</dd></div></dl><button onClick={onOpen}>Open experience rooms</button></section>; }

function PreviewStudio({ device, orientation, customSize, displayScale, deviceFrame, studioTime, compareTime, onDevice, onOrientation, onCustomSize, onScale, onDeviceFrame, onTime, onCompareTime }: { device: DeviceId; orientation: Orientation; customSize: { width: number; height: number }; displayScale: number; deviceFrame: boolean; studioTime: StudioTime; compareTime: StudioTime | null; onDevice: (value: DeviceId) => void; onOrientation: (value: Orientation) => void; onCustomSize: (value: { width: number; height: number }) => void; onScale: (value: number) => void; onDeviceFrame: (value: boolean) => void; onTime: (value: StudioTime) => void; onCompareTime: (value: StudioTime | null) => void }) {
  const times: StudioTime[] = ["canonical", "morning", "afternoon", "dusk", "night"];
  return <section className="dl45-preview-studio"><header><span>Founder decision loop</span><h2>Brand × time × device</h2><small>Simulation only · no production binding</small></header><label>Device<select aria-label="Device preset" value={device} onChange={(event) => onDevice(event.target.value as DeviceId)}>{Object.entries(DEVICE_PRESETS).map(([id, preset]) => <option key={id} value={id}>{preset.label} · {preset.width}×{preset.height}</option>)}<option value="custom">Custom</option></select></label>{device === "custom" ? <div className="dl45-custom-size"><label>Width<input aria-label="Custom viewport width" type="number" min="320" max="1920" value={customSize.width} onChange={(event) => onCustomSize({ ...customSize, width: Number(event.target.value) })} /></label><label>Height<input aria-label="Custom viewport height" type="number" min="480" max="1400" value={customSize.height} onChange={(event) => onCustomSize({ ...customSize, height: Number(event.target.value) })} /></label></div> : null}<div className="dl45-segmented" aria-label="Orientation">{(["portrait", "landscape"] as Orientation[]).map((value) => <button key={value} aria-pressed={orientation === value} onClick={() => onOrientation(value)}>{value}</button>)}</div><label>Display scale · {displayScale}%<input aria-label="Display scale" type="range" min="25" max="100" step="5" value={displayScale} onChange={(event) => onScale(Number(event.target.value))} /></label><label className="dl45-check"><input type="checkbox" checked={deviceFrame} onChange={(event) => onDeviceFrame(event.target.checked)} />Device frame</label><label>Time of day<select aria-label="Time of day" value={studioTime} onChange={(event) => onTime(event.target.value as StudioTime)}>{times.map((time) => <option key={time} value={time}>{TEMPORAL_SIMULATIONS[time].label}</option>)}</select></label><label>Two-up comparison<select aria-label="Compare time of day" value={compareTime ?? "off"} onChange={(event) => onCompareTime(event.target.value === "off" ? null : event.target.value as StudioTime)}><option value="off">Off</option>{times.filter((time) => time !== studioTime).map((time) => <option key={time} value={time}>{time}</option>)}</select></label></section>;
}

function ContentSection({ item }: { item: PlacedSection }) { return <div className={`dl4-native dl44-content dl44-${item.id.replaceAll(".", "-")}`}><span>{item.label}</span><h2>{item.title}</h2>{item.copy ? item.copy.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>) : null}{item.pathways ? <div className="dl44-pathways">{item.pathways.map((pathway) => <a href={pathway.href} key={pathway.href} onClick={(event) => event.preventDefault()}><strong>{pathway.label}</strong><span>{pathway.description}</span><i>Explore →</i></a>)}</div> : null}{item.steps ? <ol className="dl44-steps">{item.steps.map((step, index) => <li key={step.label}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.label}</strong><p>{step.copy}</p></div></li>)}</ol> : null}{item.faqs ? <div className="dl44-faqs">{item.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div> : null}{item.contentMediaSlotIds?.length ? <div className="dl44-media-intent"><span>Media intention</span><strong>{item.contentMediaSlotIds[0]}</strong><small>Real asset not yet supplied · deliberate text-led fallback</small></div> : null}{item.ctas?.length ? <div className="dl44-ctas">{item.ctas.map((cta) => <a key={cta.href} href={cta.href} onClick={(event) => event.preventDefault()}>{cta.label}</a>)}</div> : null}{item.modelSlot ? <div className="dl4-static-fallback"><strong>Static educational fallback</strong><small>Interactive 3D remains off · transcript required</small></div> : null}</div>; }

function MaterialPicker<T extends { id: string; name: string; note: string }>({ items, value, onChange, colour }: { items: readonly T[]; value: number; onChange: (value: number) => void; colour: (item: T) => string }) { const item = items[value]; return <section className="dl4-material"><div className="dl4-material-preview" style={{ background: colour(item) }}><span>{value + 1} / {items.length}</span><strong>{item.name}</strong></div><p>{item.note}</p><label><span>Choose a material</span><select value={value} onChange={(event) => onChange(Number(event.target.value))}>{items.map((candidate, index) => <option key={candidate.id} value={index}>{candidate.name}</option>)}</select></label><div className="dl4-swatches">{items.map((candidate, index) => <button key={candidate.id} title={candidate.name} aria-label={candidate.name} aria-pressed={value === index} style={{ background: colour(candidate) }} onClick={() => onChange(index)} />)}</div><div className="dl4-material-nav"><button disabled={value === 0} onClick={() => onChange(value - 1)}>← Previous</button><button disabled={value === items.length - 1} onClick={() => onChange(value + 1)}>Next →</button></div></section>; }

function ArchiveDrawer({ active, items, query, compareId, onQuery, onCompare, onPlace, onClose }: { active: PlacedSection; items: ArchiveItem[]; query: string; compareId: string | null; onQuery: (value: string) => void; onCompare: (value: string | null) => void; onPlace: (id: string) => void; onClose: () => void }) { const compared = items.find((item) => item.id === compareId); return <div className="dl4-drawer" role="dialog" aria-modal="true" aria-label="Existing design library"><header><div><span>Design source drawer</span><h2>Explore designs for {active.label}</h2><p>Genuine V27 visual evidence, placed only into this isolated draft.</p></div><button onClick={onClose}>Close</button></header><div className="dl4-drawer-tools"><input aria-label="Search design archive" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search all 331 designs…" /><span>{items.length} designs shown</span></div>{compared ? <div className="dl4-compare"><ArchiveCard item={items[0]} onPlace={onPlace} /><ArchiveCard item={compared} onPlace={onPlace} /><button className="dl4-stop-compare" onClick={() => onCompare(null)}>Stop comparison</button></div> : <div className="dl4-grid">{items.map((item) => <ArchiveCard key={item.id} item={item} onPlace={onPlace} onCompare={() => onCompare(item.id)} />)}</div>}</div>; }

function ArchiveCard({ item, onPlace, onCompare }: { item?: ArchiveItem; onPlace: (id: string) => void; onCompare?: () => void }) { if (!item) return null; return <article className="dl4-card"><div><img src={assetFor(item.id)} alt={`${item.title} visual design`} /></div><span>Archive design</span><h3>{item.title}</h3><p>{item.purpose}</p><footer><button onClick={() => onPlace(item.id)}>Place in page</button>{onCompare ? <button onClick={onCompare}>Compare</button> : null}<a href={assetFor(item.id)} target="_blank" rel="noreferrer">Full size</a></footer></article>; }

function ArchitecturalClosing({ item, placement, treatment }: { item: PlacedSection; placement: ClosingPlacement; treatment: ClosingTreatment }) { return <div className="dl4-architectural" data-placement={placement} data-treatment={treatment}><img src={architecturalClosingConcept.src} alt="Fictional architectural entrance used only to preview the St Mary's House closing composition" /><div className="dl4-architectural-shade" /><div className="dl4-architectural-copy"><span>St Mary’s House · architectural closing study</span><h2>{item.title}</h2><i aria-hidden="true" /><p>{item.copy}</p><div>{item.ctas?.map((cta) => <button key={cta.href}>{cta.label}</button>)}</div></div><div className="dl4-concept-label">Lab proposal · fictional architecture · not St Mary’s House · real photo required</div>{placement === "FULL_FOOTER" ? <footer className="dl4-architectural-footer"><strong>St Mary’s House Dental Care</strong><nav aria-label="Architectural footer preview"><span>Treatments</span><span>Our approach</span><span>The practice</span><span>Contact</span></nav></footer> : null}</div>; }

function ArchitecturalClosingControls({ placement, treatment, onPlacement, onTreatment }: { placement: ClosingPlacement; treatment: ClosingTreatment; onPlacement: (value: ClosingPlacement) => void; onTreatment: (value: ClosingTreatment) => void }) { return <section className="dl4-closing-controls"><span>Architectural closing</span><h2>Choose its role and finish</h2><div className="dl4-segmented"><button aria-pressed={placement === "PRE_FOOTER_CLOSING_SECTION"} onClick={() => onPlacement("PRE_FOOTER_CLOSING_SECTION")}>Above footer</button><button aria-pressed={placement === "FULL_FOOTER"} onClick={() => onPlacement("FULL_FOOTER")}>Full footer</button></div><div className="dl4-treatment-list"><button aria-pressed={treatment === "PERSIAN_ARCHITECTURAL"} onClick={() => onTreatment("PERSIAN_ARCHITECTURAL")}><i data-swatch="persian" />Persian architectural</button><button aria-pressed={treatment === "PORCELAIN_GALLERY"} onClick={() => onTreatment("PORCELAIN_GALLERY")}><i data-swatch="porcelain" />Porcelain gallery</button><button aria-pressed={treatment === "GILDED_BRAND_GOLD"} onClick={() => onTreatment("GILDED_BRAND_GOLD")}><i data-swatch="gold" />Gilded brand gold</button></div><p>The genuine photograph will replace only the media layer. Provenance rules travel inside every export.</p></section>; }
