"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import registry from "../data/v27-registry.json";
import { PERSIAN_CANDIDATES, PORCELAIN_CANDIDATES } from "../data/materials";

type Viewport = "desktop" | "tablet" | "mobile";
type PageKey = "home" | "implants" | "bonding";
type Material = "persian" | "porcelain";
type Section = { id: string; label: string; tone: Material | "luminous"; title: string; copy: string; archiveId?: string; locked?: boolean };
type ArchiveItem = { id: string; title: string; labRoom: string; family: string; purpose: string; selectableInDesignLab: boolean; preview?: { width: number; height: number } };
type LabStyle = CSSProperties & Record<`--${string}`, string>;

const PAGE_NAMES: Record<PageKey, string> = { home: "Home", implants: "Implants", bonding: "Composite Bonding" };
const SEED: Record<PageKey, Section[]> = {
  home: [
    { id: "hero", label: "Canonical Hero V2", tone: "persian", title: "Hero V2", copy: "Protected canonical opening", locked: true },
    { id: "pathways", label: "Patient pathways", tone: "porcelain", title: "Begin with what matters to you.", copy: "Clear routes for confidence, missing teeth, anxiety and continuing care." },
    { id: "founder", label: "Founder authority", tone: "persian", title: "A Founder’s standard, made personal.", copy: "Clinical authority and time to listen, presented without corporate theatre." },
    { id: "team", label: "Team continuity", tone: "porcelain", title: "Familiar faces. Joined-up care.", copy: "A warm, distinct chapter for the people supporting each patient." },
    { id: "technology", label: "Digital dentistry", tone: "luminous", title: "Technology that makes choices clearer.", copy: "Planning and communication without coldness or spectacle." },
    { id: "heritage", label: "St Mary’s House", tone: "persian", title: "Modern dentistry in a place with a story.", copy: "Architecture and local character become part of the Champagne experience." },
    { id: "closing", label: "Closing invitation", tone: "persian", title: "Let’s make the next step feel clear.", copy: "Ask a question, explore an option or request a consultation." },
  ],
  implants: [
    { id: "hero", label: "Canonical Implant Hero V2", tone: "persian", title: "Implant Hero V2", copy: "Protected treatment opening", locked: true },
    { id: "answer", label: "Answer first", tone: "porcelain", title: "Are dental implants right for me?", copy: "Suitability, alternatives and the next useful conversation." },
    { id: "journey", label: "Planning journey", tone: "persian", title: "From assessment to confident restoration.", copy: "A clear visual journey with honest dependencies and limits." },
    { id: "choices", label: "Decision support", tone: "porcelain", title: "Compare the paths available to you.", copy: "Benefits, limitations and alternatives presented together." },
    { id: "closing", label: "Next step", tone: "persian", title: "Plan the right next conversation.", copy: "Ask a question or request an assessment." },
  ],
  bonding: [
    { id: "hero", label: "Canonical Bonding Hero V2", tone: "persian", title: "Bonding Hero V2", copy: "Protected treatment opening", locked: true },
    { id: "choices", label: "Options", tone: "porcelain", title: "Understand benefits, limits and alternatives.", copy: "A balanced decision surface rather than a sales pitch." },
    { id: "process", label: "Process", tone: "luminous", title: "Designed, refined and reviewed with you.", copy: "A visual explanation of the clinical and aesthetic process." },
    { id: "care", label: "Long-term care", tone: "porcelain", title: "Designed to be looked after.", copy: "Maintenance and future choices are part of the decision." },
    { id: "closing", label: "Next step", tone: "persian", title: "Explore what would suit your smile.", copy: "A calm invitation to ask or arrange." },
  ],
};

const ROOM_HINTS: Record<string, string[]> = {
  hero: ["page-compositions", "page-sequences", "headers"], pathways: ["sections", "cards"], founder: ["sections", "media-layouts"], team: ["sections", "media-layouts"],
  technology: ["sections", "surfaces-materials"], heritage: ["heritage-architecture", "sections"], closing: ["bands", "cta", "footers"], answer: ["sections", "cards"],
  journey: ["page-sequences", "sections"], choices: ["cards", "sections"], process: ["sections", "page-sequences"], care: ["sections", "bands"],
};

const ARCHIVE = (registry.items as ArchiveItem[]).filter((item) => item.selectableInDesignLab);
const assetFor = (id: string) => `/assets/champagne/design-lab/v27/${id}.png`;
const colour = (value: readonly number[]) => `color(srgb ${value.map((channel) => (channel / 255).toFixed(5)).join(" ")})`;

export function Atelier({ heroes }: { heroes: Record<PageKey, ReactNode> }) {
  const [page, setPage] = useState<PageKey>("home");
  const [sections, setSections] = useState<Record<PageKey, Section[]>>(SEED);
  const [selected, setSelected] = useState("pathways");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [material, setMaterial] = useState<Material>("persian");
  const [persian, setPersian] = useState(0);
  const [porcelain, setPorcelain] = useState(0);
  const [drawer, setDrawer] = useState<"archive" | "proposal" | null>(null);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [archiveQuery, setArchiveQuery] = useState("");
  const [instruction, setInstruction] = useState("");
  const current = sections[page];
  const active = current.find((item) => item.id === selected) ?? current[0];
  const persianChoice = PERSIAN_CANDIDATES[persian];
  const porcelainChoice = PORCELAIN_CANDIDATES[porcelain];
  const suggestedArchive = useMemo(() => {
    const rooms = ROOM_HINTS[active.id] ?? ["sections"];
    const query = archiveQuery.trim().toLowerCase();
    return ARCHIVE.filter((item) => rooms.includes(item.labRoom) || query).filter((item) => !query || `${item.id} ${item.title} ${item.family} ${item.purpose}`.toLowerCase().includes(query)).slice(0, 36);
  }, [active.id, archiveQuery]);
  const brief = useMemo(() => ({ schema: "champagne.atelier.handoff.v2", page, viewport, materials: { persian: persianChoice, porcelain: porcelainChoice }, sections: current.map((item, order) => ({ ...item, order })), founderInstruction: instruction, productionBinding: false, approval: "FOUNDER_REVIEW_REQUIRED" }), [page, viewport, persianChoice, porcelainChoice, current, instruction]);

  const updatePage = (fn: (items: Section[]) => Section[]) => setSections((all) => ({ ...all, [page]: fn([...all[page]]) }));
  const move = (delta: number) => updatePage((items) => { const at = items.findIndex((item) => item.id === selected); const to = at + delta; if (at < 0 || to < 0 || to >= items.length || items[at].locked || items[to].locked) return items; [items[at], items[to]] = [items[to], items[at]]; return items; });
  const placeArchive = (archiveId: string) => { updatePage((items) => items.map((item) => item.id === selected ? { ...item, archiveId } : item)); setCompareId(null); setDrawer(null); };
  const exportBrief = () => { const blob = new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `champagne-${page}-atelier-handoff.json`; a.click(); URL.revokeObjectURL(url); };
  const changePage = (next: PageKey) => { setPage(next); setSelected(SEED[next][0].id); setDrawer(null); };
  const canvasStyle: LabStyle = {
    "--atelier-persian": colour(persianChoice.canvas), "--atelier-persian-raised": colour(persianChoice.elevated),
    "--atelier-porcelain": colour(porcelainChoice.base), "--atelier-porcelain-raised": colour(porcelainChoice.elevated),
    "--surface-ink": colour(persianChoice.canvas), "--surface-ink-soft": colour(persianChoice.elevated),
    "--bg-ink": colour(persianChoice.canvas), "--bg-ink-soft": colour(persianChoice.elevated),
    "--surface-0": colour(porcelainChoice.base), "--surface-1": colour(porcelainChoice.elevated),
  };

  return <main className="dl4-app">
    <header className="dl4-topbar"><div><strong>Champagne Atelier</strong><span>Founder design workspace</span></div><label>Page <select value={page} onChange={(event) => changePage(event.target.value as PageKey)}>{Object.entries(PAGE_NAMES).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label><div className="dl4-device" aria-label="Canvas viewport">{(["desktop", "tablet", "mobile"] as Viewport[]).map((item) => <button key={item} aria-pressed={viewport === item} onClick={() => setViewport(item)}>{item}</button>)}</div><div className="dl4-actions"><span>Draft · isolated</span><button onClick={exportBrief}>Export for Captain / WEOS</button></div></header>

    <aside className="dl4-pages"><div className="dl4-panel-heading"><h2>Pages</h2><button onClick={() => setDrawer("proposal")}>＋</button></div>{(Object.keys(PAGE_NAMES) as PageKey[]).map((key) => <button className="dl4-page" aria-current={page === key ? "page" : undefined} key={key} onClick={() => changePage(key)}><span>{PAGE_NAMES[key]}</span><small>{sections[key].length} sections</small></button>)}<div className="dl4-panel-heading"><h2>Page flow</h2><button onClick={() => setDrawer("archive")}>＋</button></div><ol className="dl4-layers">{current.map((item, index) => <li key={item.id}><button aria-current={selected === item.id} onClick={() => setSelected(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.label}</strong><small>{item.locked ? "Canonical · protected" : item.archiveId ? "Archive design placed" : "Editable section"}</small></div></button></li>)}</ol><div className="dl4-left-actions"><button onClick={() => setDrawer("archive")}>Browse existing designs</button><button onClick={() => setDrawer("proposal")}>✦ Propose something new</button></div></aside>

    <section className="dl4-workspace"><div className="dl4-context"><span>{PAGE_NAMES[page]} canvas</span><strong>{viewport === "desktop" ? "1440px" : viewport === "tablet" ? "768px" : "390px"}</strong><span>Actual page order · click any section</span></div><div className="dl4-scroll"><article className={`dl4-canvas dl4-${viewport}`} style={canvasStyle}>{current.map((item) => <section key={item.id} data-tone={item.tone} className={selected === item.id ? "is-selected" : ""} onClick={() => setSelected(item.id)}>{item.id === "hero" ? heroes[page] : item.archiveId ? <figure className="dl4-placed"><img src={assetFor(item.archiveId)} alt={`${item.label} using ${item.archiveId}`} /><figcaption><span>{item.archiveId}</span><button onClick={(event) => { event.stopPropagation(); setDrawer("archive"); }}>Replace</button></figcaption></figure> : <div className="dl4-native"><span>{item.label}</span><h2>{item.title}</h2><p>{item.copy}</p>{item.id === "closing" ? <button>Explore your options</button> : null}</div>}{selected === item.id ? <div className="dl4-selection"><strong>{item.label}</strong>{item.locked ? <span>Canonical Hero V2 · protected</span> : <><button onClick={(event) => { event.stopPropagation(); move(-1); }}>Move up</button><button onClick={(event) => { event.stopPropagation(); move(1); }}>Move down</button><button onClick={(event) => { event.stopPropagation(); setDrawer("archive"); }}>Replace / compare</button></>}</div> : null}</section>)}</article></div></section>

    <aside className="dl4-inspector"><div className="dl4-panel-heading"><h2>Design system</h2><span>Live on canvas</span></div><div className="dl4-material-tabs"><button aria-pressed={material === "persian"} onClick={() => setMaterial("persian")}>Persian Velvet Blue</button><button aria-pressed={material === "porcelain"} onClick={() => setMaterial("porcelain")}>Porcelain</button></div>{material === "persian" ? <MaterialPicker title={persianChoice.name} note={persianChoice.note} items={PERSIAN_CANDIDATES} value={persian} onChange={setPersian} colour={(item) => colour(item.canvas)} /> : <MaterialPicker title={porcelainChoice.name} note={porcelainChoice.note} items={PORCELAIN_CANDIDATES} value={porcelain} onChange={setPorcelain} colour={(item) => colour(item.base)} />}<section className="dl4-active"><span>Selected on page</span><h2>{active.label}</h2><p>{active.locked ? "The real repository Hero V2 is mounted here. Its composition is protected; materials can be studied around it." : active.archiveId ? `${active.archiveId} is placed in its real page position and width.` : "Choose an existing design, request a new one, or refine this section in context."}</p>{!active.locked && <div><button onClick={() => setDrawer("archive")}>Existing designs</button><button onClick={() => setDrawer("proposal")}>✦ New proposal</button></div>}</section><section className="dl4-ask"><h2>Ask Atelier</h2><p>Describe the visual or page change you want. It will be preserved in the exported Founder brief.</p><textarea value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="For example: show me a completely different, more botanical approach for this section…" /><button onClick={() => setDrawer("proposal")}>Turn this into a proposal</button></section></aside>

    {drawer === "archive" && <div className="dl4-drawer" role="dialog" aria-modal="true" aria-label="Existing design library"><header><div><span>Design source drawer</span><h2>Replace or compare {active.label}</h2><p>These are genuine V27 designs shown at their real proportions. Placing one changes only this draft canvas.</p></div><button onClick={() => setDrawer(null)}>Close</button></header><div className="dl4-drawer-tools"><input value={archiveQuery} onChange={(event) => setArchiveQuery(event.target.value)} placeholder="Search all 331 designs…" /><span>{suggestedArchive.length} relevant designs shown</span></div>{compareId ? <div className="dl4-compare"><ArchiveCard item={ARCHIVE.find((item) => item.id === active.archiveId) ?? suggestedArchive[0]} onPlace={placeArchive} /><ArchiveCard item={ARCHIVE.find((item) => item.id === compareId) ?? suggestedArchive[1]} onPlace={placeArchive} /><button className="dl4-stop-compare" onClick={() => setCompareId(null)}>Stop comparison</button></div> : <div className="dl4-grid">{suggestedArchive.map((item) => <ArchiveCard key={item.id} item={item} onPlace={placeArchive} onCompare={() => setCompareId(item.id)} />)}</div>}</div>}
    {drawer === "proposal" && <div className="dl4-modal-backdrop"><section className="dl4-modal" role="dialog" aria-modal="true"><button className="dl4-close" onClick={() => setDrawer(null)}>×</button><span>Governed design workshop</span><h2>Propose something genuinely new</h2><p>You are not restricted to the archive. Describe a different brand direction, full page, section or component. The request stays linked to this page position for Captain and WEOS.</p><label>Design scope<select defaultValue="selected"><option value="selected">Selected section — {active.label}</option><option value="page">Complete {PAGE_NAMES[page]} page</option><option value="brand">New brand direction</option><option value="component">New reusable component</option></select></label><label>What should feel different?<textarea defaultValue={instruction} placeholder="Describe feeling, layout, references, colours, movement, or anything missing…" /></label><label>Start from<select><option>Something completely new</option><option>The selected section</option><option>A V27 archive design</option><option>A reference or sketch I will provide</option></select></label><div className="dl4-modal-actions"><button onClick={() => setDrawer(null)}>Keep editing</button><button onClick={() => setDrawer(null)}>Save proposal into brief</button></div><small>Draft only · Founder review required · cannot bind production</small></section></div>}
  </main>;
}

function MaterialPicker<T extends { id: string; name: string; note: string }>({ title, note, items, value, onChange, colour }: { title: string; note: string; items: readonly T[]; value: number; onChange: (value: number) => void; colour: (item: T) => string }) { return <section className="dl4-material"><div className="dl4-material-preview" style={{ background: colour(items[value]) }}><span>{value + 1} / {items.length}</span><strong>{title}</strong></div><p>{note}</p><div className="dl4-swatches">{items.map((item, index) => <button key={item.id} title={item.name} aria-label={item.name} aria-pressed={value === index} style={{ background: colour(item) }} onClick={() => onChange(index)} />)}</div><div className="dl4-material-nav"><button disabled={value === 0} onClick={() => onChange(value - 1)}>← Previous</button><button disabled={value === items.length - 1} onClick={() => onChange(value + 1)}>Next →</button></div></section>; }
function ArchiveCard({ item, onPlace, onCompare }: { item?: ArchiveItem; onPlace: (id: string) => void; onCompare?: () => void }) { if (!item) return null; return <article className="dl4-card"><div><img src={assetFor(item.id)} alt={item.title} /></div><span>{item.id}</span><h3>{item.title}</h3><p>{item.purpose}</p><footer><button onClick={() => onPlace(item.id)}>Place in page</button>{onCompare && <button onClick={onCompare}>Compare</button>}<a href={assetFor(item.id)} target="_blank" rel="noreferrer">Full size</a></footer></article>; }
