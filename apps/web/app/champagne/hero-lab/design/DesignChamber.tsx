"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import candidates from "./persian-materials.json";
import porcelainCandidates from "./porcelain-materials.json";
import registry from "./component-registry.json";
import routes from "./route-catalog.json";
import styles from "./design-lab.module.css";

type Candidate = (typeof candidates)[number] & { provenance?: string };
type PorcelainCandidate = (typeof porcelainCandidates)[number];
type LabStyle = CSSProperties & Record<`--${string}`, string>;
type RouteEntry = (typeof routes)[number];
type Viewport = "desktop" | "tablet" | "mobile";
type Board = { id: string; title: string; sourceFile: string; categories: string[]; provenance: string; decision: string; thumbnail: string };

const CATALOGUE_URLS = ["band", "cta", "footer", "heritage", "hero", "other", "page", "section"].map(
  (name) => `/assets/champagne/design-lab/catalogues/${name}.json`,
);
let archivePromise: Promise<Board[]> | null = null;
const FALLBACK_PICKER_COLOUR = candidates.find((candidate) => candidate.id === "archive-velvet-persian-blue")?.canvas ?? candidates[0].canvas;

function loadArchive(): Promise<Board[]> {
  archivePromise ??= Promise.all(CATALOGUE_URLS.map(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to load ${url}`);
    return response.json() as Promise<Board[]>;
  })).then((groups) => groups.flat());
  return archivePromise;
}

const ROOMS = [
  { number: "02", id: "cta", title: "CTA components", description: "Individual buttons, framed gestures, editorial actions and guidance pathways." },
  { number: "03", id: "cards", title: "Cards and decision panels", description: "Individual evidence cards, reassurance panels, choices and decision-support treatments." },
  { number: "04", id: "sections", title: "Page sections by purpose", description: "Complete page chapters grouped by the job they perform—not by vague visual labels." },
  { number: "05", id: "bands", title: "Mid-page and closing bands", description: "Transitions, reassurance, evidence, decisions, consultations, pre-footers and closing bands." },
  { number: "06", id: "headers", title: "Headers and navigation", description: "Header and navigation choices only. Heritage material is deliberately kept elsewhere." },
  { number: "07", id: "footers", title: "Footers and pre-footer structures", description: "The hidden layered luxury footer is the target. The currently mounted footer is explicitly excluded." },
  { number: "08", id: "heritage", title: "Heritage and St Mary’s House", description: "Architectural, frontage, door, window, line-art and local identity elements." },
  { number: "09", id: "media", title: "Media layouts", description: "Placement systems for approved photography, portraits, treatment media, video and 3D assets." },
  { number: "10", id: "captain", title: "Captain Companion interfaces", description: "Reserved only for genuine Captain interface designs. No unrelated archive material is admitted." },
] as const;

function validHex(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.startsWith(String.fromCharCode(35)) && /^[0-9a-f]{6}$/i.test(trimmed.slice(1));
}

function candidateProvenance(candidate: Candidate): string {
  if (candidate.id === "archive-velvet-persian-blue") return "Measured from the dominant velvet field in the previous-directorate Persian-blue homepage mock-up";
  if (candidate.kind === "archive") return "Previous visual archive reference";
  if (candidate.kind === "control") return "Current repository control";
  return "Directorate analytical candidate";
}

export function DesignChamber({
  hero,
  initialReducedMotion,
  compositionOnly = false,
  initialRoute = "/",
  initialViewport = "desktop",
  initialCandidateId,
  initialPorcelainId,
}: {
  hero: ReactNode;
  initialReducedMotion: boolean;
  compositionOnly?: boolean;
  initialRoute?: string;
  initialViewport?: Viewport;
  initialCandidateId?: string;
  initialPorcelainId?: string;
}) {
  const router = useRouter();
  const [customCandidates, setCustomCandidates] = useState<Candidate[]>([]);
  const allCandidates = useMemo<Candidate[]>(() => [...candidates, ...customCandidates], [customCandidates]);
  const firstCandidate = allCandidates.find((candidate) => candidate.id === initialCandidateId) ?? allCandidates[0];
  const [selectedId, setSelectedId] = useState(firstCandidate.id);
  const firstPorcelain = porcelainCandidates.find((candidate) => candidate.id === initialPorcelainId) ?? porcelainCandidates[0];
  const [selectedPorcelainId, setSelectedPorcelainId] = useState(firstPorcelain.id);
  const [customHex, setCustomHex] = useState(FALLBACK_PICKER_COLOUR);
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion);
  const [decision, setDecision] = useState("No colour selected");
  const [routeQuery, setRouteQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(routes.some((entry) => entry.route === initialRoute) ? initialRoute : routes[0].route);
  const [viewport, setViewport] = useState<Viewport>(initialViewport);
  const [heroState, setHeroState] = useState({ active: false, engine: "not detected", instance: "not exposed", roots: 0, stacks: 0, motionLayers: 0 });
  const labRef = useRef<HTMLDivElement>(null);

  const selected = allCandidates.find((candidate) => candidate.id === selectedId) ?? allCandidates[0];
  const selectedPorcelain = (porcelainCandidates as PorcelainCandidate[]).find((candidate) => candidate.id === selectedPorcelainId) ?? porcelainCandidates[0];
  const route = (routes as RouteEntry[]).find((entry) => entry.route === selectedRoute) ?? routes[0];
  const routeOptions = useMemo(() => {
    const query = routeQuery.trim().toLowerCase();
    return query ? routes.filter((entry) => `${entry.label} ${entry.route} ${entry.family}`.toLowerCase().includes(query)) : routes;
  }, [routeQuery]);
  const labStyle: LabStyle = {
    "--lab-canvas": selected.canvas,
    "--lab-elevated": selected.elevated,
    "--lab-highest": selected.highest,
    "--lab-porcelain-base": selectedPorcelain.base,
    "--lab-porcelain-elevated": selectedPorcelain.elevated,
    "--lab-porcelain-highest": selectedPorcelain.highest,
    "--brand-ink": selected.canvas,
    "--surface-canvas": selected.canvas,
    "--surface-ink": selected.canvas,
    "--surface-ink-soft": selected.elevated,
    "--surface-footer-emotion": selected.canvas,
    "--bg-ink": selected.canvas,
    "--bg-ink-soft": selected.elevated,
    "--surface-0": selectedPorcelain.base,
    "--surface-1": selectedPorcelain.elevated,
    "--surface-2": selectedPorcelain.highest,
  };

  useEffect(() => {
    const root = labRef.current;
    if (!root) return;
    const inspect = () => {
      const engine = root.querySelector<HTMLElement>("[data-hero-engine]");
      const renderer = root.querySelector<HTMLElement>("[data-hero-renderer='v2'], .hero-renderer-v2[data-hero-root='true']");
      const stacks = root.querySelectorAll<HTMLElement>("[data-v2-stack-instance]");
      const nextState = {
        active: Boolean(renderer || engine?.dataset.heroEngine === "v2"),
        engine: engine?.dataset.heroEngine ?? renderer?.dataset.heroRenderer ?? "not detected",
        instance: stacks[0]?.dataset.v2StackInstance ?? "not exposed",
        roots: root.querySelectorAll("[data-hero-root='true'], [data-hero-renderer='v2']").length,
        stacks: stacks.length,
        motionLayers: root.querySelectorAll(".hero-surface--motion").length,
      };
      setHeroState((current) => Object.entries(nextState).every(([key, value]) => current[key as keyof typeof current] === value) ? current : nextState);
    };
    inspect();
    const observer = new MutationObserver(inspect);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-v2-stack-instance", "data-hero-engine"] });
    return () => observer.disconnect();
  }, []);

  function setMotion(next: boolean) {
    setReducedMotion(next);
    const params = new URLSearchParams(window.location.search);
    if (next) params.set("labMotion", "reduce"); else params.delete("labMotion");
    router.replace(`${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  function addCustomCandidate() {
    const canvas = customHex.trim().toUpperCase();
    if (!validHex(canvas)) return;
    const id = `founder-${canvas.slice(1).toLowerCase()}`;
    if (!allCandidates.some((candidate) => candidate.id === id)) {
      setCustomCandidates((current) => [...current, {
        id,
        label: `Founder custom ${canvas}`,
        canvas,
        elevated: `color-mix(in oklab, ${canvas} 86%, var(--brand-teal) 14%)`,
        highest: `color-mix(in oklab, ${canvas} 76%, var(--brand-teal) 24%)`,
        kind: "candidate",
        provenance: "Founder-entered laboratory candidate",
        source: "Laboratory colour control",
      }]);
    }
    setSelectedId(id);
    setDecision("No colour selected");
  }

  const compositionHref = `/champagne/hero-lab/design?labView=composition&route=${encodeURIComponent(route.route)}&viewport=${viewport}&candidate=${encodeURIComponent(selected.id)}&porcelain=${encodeURIComponent(selectedPorcelain.id)}${reducedMotion ? "&labMotion=reduce" : ""}`;

  if (compositionOnly) {
    return <main ref={labRef} className={styles.compositionShell} style={labStyle} data-champagne-design-lab="true" data-reduced-motion={reducedMotion ? "true" : "false"}>
      <div className={styles.compositionToolbar}><a href="/champagne/hero-lab/design">Return to Design Lab</a><span>{route.label}</span><span>{viewport} composition</span></div>
      <div className={styles.compositionViewport} data-viewport={viewport}>
        <CompositionPreview route={route} hero={hero} />
      </div>
    </main>;
  }

  return <main ref={labRef} className={styles.lab} style={labStyle} data-champagne-design-lab="true" data-production-binding="false" data-reduced-motion={reducedMotion ? "true" : "false"}>
    <header className={styles.labHeader}>
      <div><p className={styles.eyebrow}>Internal laboratory · production isolated</p><h1>Champagne Design Laboratory V4</h1><p>Individual choices will live in the working rooms. Untouched mock-up boards now remain separately available as archive evidence.</p></div>
      <div className={styles.status}><span>Founder choices: pending</span><span>Production binding: off</span><span>Archive import: awaiting extraction inventory</span><span>PR: draft and unmerged</span></div>
    </header>

    <nav className={styles.roomNav} aria-label="Design laboratory rooms"><a href="#tokens">01 · Tokens</a>{ROOMS.map((room) => <a key={room.id} href={`#${room.id}`}>{room.number} · {room.title}</a>)}<a href="#assembler">11 · Page builder</a><a href="#archive">Archive</a></nav>

    <section className={styles.room} id="tokens"><RoomHeading number="01" title="Persian Midnight and Porcelain Material Chamber" /><p className={styles.roomIntro}>Choose coordinated material ladders rather than one flat colour. Every compatible extracted component will consume these laboratory surface roles plus the immutable magenta, turquoise and gold brand tokens.</p>
      <MaterialSubheading title="Persian Midnight dark-material ladder" detail="Canvas · elevated · highest architectural surface" />
      <fieldset className={styles.candidateGrid}><legend className={styles.srOnly}>Persian Midnight candidates</legend>{allCandidates.map((candidate) => <button type="button" key={candidate.id} className={styles.candidate} aria-pressed={selected.id === candidate.id} onClick={() => { setSelectedId(candidate.id); setDecision("No colour selected"); }}><MaterialSwatches values={[candidate.canvas, candidate.elevated, candidate.highest]} /><span><strong>{candidate.label}</strong><small>{candidate.canvas.startsWith("var") ? "Current semantic value" : candidate.canvas.toUpperCase()}</small><small>{candidate.provenance ?? candidateProvenance(candidate)}</small></span></button>)}</fieldset>
      <div className={styles.customColour}><label><span>Try any exact colour</span><input value={customHex} onChange={(event) => setCustomHex(event.target.value)} aria-invalid={!validHex(customHex)} /></label><input type="color" value={validHex(customHex) ? customHex : FALLBACK_PICKER_COLOUR} onChange={(event) => setCustomHex(event.target.value.toUpperCase())} aria-label="Choose a custom colour visually" /><button type="button" onClick={addCustomCandidate} disabled={!validHex(customHex)}>Add to laboratory</button><button type="button" className={styles.quietButton} onClick={() => setDecision("All current colours rejected")}>Reject all current colours</button></div>
      <div className={styles.decisionStrip}><span>Decision record: {decision}</span><button type="button" onClick={() => setDecision(`Shortlisted ${selected.label}`)}>Shortlist current colour</button></div>
      <MaterialSubheading title="Porcelain light-material ladder" detail="Base · elevated · highest surface" />
      <p className={styles.roomIntro}>The archive option is measured from the previous-directorate porcelain consultation mock-up. The current repository option is the existing semantic control; neither is founder-approved yet.</p>
      <fieldset className={styles.candidateGrid}><legend className={styles.srOnly}>Porcelain candidates</legend>{porcelainCandidates.map((candidate) => <button type="button" key={candidate.id} className={styles.candidate} aria-pressed={selectedPorcelain.id === candidate.id} onClick={() => setSelectedPorcelainId(candidate.id)}><MaterialSwatches values={[candidate.base, candidate.elevated, candidate.highest]} /><span><strong>{candidate.label}</strong><small>{candidate.base.startsWith("var") ? "Current semantic ladder" : `${candidate.base} measured base`}</small><small>{candidate.source}</small></span></button>)}</fieldset>
      <div className={styles.tokenLaw}><strong>Component colour law</strong><span>No arbitrary per-element colour controls. Components may use the selected Persian ladder, selected porcelain ladder, and repository magenta, turquoise and restrained gold tokens only.</span></div>
      <label className={styles.motionControl}><input type="checkbox" checked={reducedMotion} onChange={(event) => setMotion(event.target.checked)} /><span>Laboratory reduced-motion presentation</span></label>
    </section>

    <section className={styles.heroRoom}><div className={styles.roomHeading}><div><p className={styles.roomNumber}>Sacred preview</p><h2>Genuine Hero V2</h2></div><dl className={styles.diagnostics}><div><dt>Status</dt><dd>{heroState.active ? "Hero V2 active" : "Hero V2 not detected"}</dd></div><div><dt>Engine</dt><dd>{heroState.engine}</dd></div><div><dt>Instance</dt><dd>{heroState.instance}</dd></div><div><dt>Roots / stacks</dt><dd>{heroState.roots} / {heroState.stacks}</dd></div><div><dt>Motion</dt><dd>{reducedMotion ? "PRM requested" : `${heroState.motionLayers} layers available`}</dd></div></dl></div><div className={styles.heroFrame}>{hero}</div></section>

    {ROOMS.map((room) => <ComponentRoom key={room.id} {...room} />)}

    <section className={styles.room} id="assembler"><RoomHeading number="11" title="Experimental full-page builder" /><p className={styles.roomIntro}>This renders a laboratory composition, not the current website. Manifest order is preserved and remains locked until the page-by-page SEO and AI-search audit.</p>
      <div className={styles.assemblerToolbar}><label><span>Find a page</span><input value={routeQuery} onChange={(event) => setRouteQuery(event.target.value)} placeholder="Homepage, implants, team…" /></label><label><span>Manifest foundation</span><select value={selectedRoute} onChange={(event) => setSelectedRoute(event.target.value)}>{routeOptions.map((entry) => <option key={entry.route} value={entry.route}>{entry.label} · {entry.route}</option>)}</select></label><div className={styles.viewportButtons}>{(["desktop", "tablet", "mobile"] as const).map((size) => <button type="button" key={size} aria-pressed={viewport === size} onClick={() => setViewport(size)}>{size}</button>)}</div></div>
      <div className={styles.assemblerGrid}><aside className={styles.manifestPanel}><h3>{route.label}</h3><p>{route.route}</p><dl><div><dt>Source</dt><dd>{route.source}</dd></div><div><dt>Order</dt><dd>Locked pending SEO/AI audit</dd></div><div><dt>Chapters</dt><dd>{route.sections.length || "Adapter pending"}</dd></div></dl><ol>{route.sections.map((section) => <li key={section.instanceId}><span>{String(section.order).padStart(2, "0")}</span><div><strong>{section.title ?? section.componentId}</strong><small>{section.componentId}</small></div></li>)}</ol></aside>
        <div className={styles.pageStage} data-viewport={viewport}><div className={styles.pageStageBar}><span>Experimental composition · {selected.label} · {selectedPorcelain.label}</span><a href={compositionHref} target="_blank" rel="noreferrer">Open experimental page</a></div><iframe key={compositionHref} src={compositionHref} title={`Experimental composition: ${route.label}`} /></div></div>
    </section>

    <ArchiveDrawer />
  </main>;
}

function ComponentRoom({ number, id, title, description }: (typeof ROOMS)[number]) {
  const room = registry.rooms.find((entry) => entry.id === id);
  const footerRoom = id === "footers";
  return <section className={styles.room} id={id}><RoomHeading number={number} title={title} /><p className={styles.roomIntro}>{description}</p>
    <div className={styles.awaitingPanel}><div><strong>{room?.components.length ?? 0} individual choices loaded</strong><p>{id === "captain" ? "No genuine Captain interface designs have yet been evidenced." : "This shelf is ready for stable CVA element IDs from the extraction inventory."}</p></div><code>{room?.accepts.join(" · ")}</code></div>
    {footerRoom ? <div className={styles.footerTarget}><strong>Manus layered luxury footer · source recovery required</strong><p>{registry.footerTarget.warning}</p><dl className={styles.footerEvidence}><div><dt>Intended component</dt><dd>{registry.footerTarget.intendedComponent}</dd></div><div><dt>Intended stylesheet</dt><dd>{registry.footerTarget.intendedStylesheet}</dd></div><div><dt>Surviving evidence</dt><dd>{registry.footerTarget.survivingPreviewWrapper}<br />{registry.footerTarget.survivingLayerStyles}</dd></div></dl><p>Preferred next action: recover the original package before attempting a clearly labelled reconstruction.</p><ul>{registry.footerTarget.likelySourcePackages.map((source) => <li key={source}>{source}</li>)}</ul></div> : null}
  </section>;
}

function CompositionPreview({ route, hero }: { route: RouteEntry; hero: ReactNode }) {
  return <article className={styles.composition} aria-label={`Experimental composition for ${route.label}`}>
    <div className={styles.emptyChoice}><strong>Header choice awaiting individual component inventory</strong><span>Production header is not silently substituted</span></div>
    <div className={styles.compositionHero}>{hero}</div>
    <div className={styles.chapterSequence}>{route.sections.length ? route.sections.map((section) => <section key={section.instanceId} className={styles.chapterPlaceholder}><span>{String(section.order).padStart(2, "0")}</span><div><h3>{section.title ?? section.componentId}</h3><p>{section.componentId}</p><small>Manifest chapter retained · design choice awaiting individual library</small></div></section>) : <div className={styles.emptyChoice}>Section adapter pending for this page</div>}</div>
    <div className={styles.emptyChoice}><strong>Closing and pre-footer choices awaiting inventory</strong><span>No generic band is substituted</span></div>
    <div className={styles.footerTarget}><strong>Layered luxury footer target</strong><p>Discovery in progress. The currently rendered footer is explicitly excluded.</p></div>
  </article>;
}

function ArchiveDrawer() {
  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const matches = boards.filter((board) => board.title.toLowerCase().includes(query.toLowerCase()));
  const selected = boards.find((board) => board.id === selectedId) ?? matches[0];
  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && boards.length === 0) void loadArchive().then((items) => { setBoards(items); setSelectedId(items[0]?.id ?? ""); }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load archive"));
  }
  return <section className={styles.room} id="archive"><RoomHeading number="Archive" title="Original mock-up board archive" /><p className={styles.roomIntro}>All boards remain preserved here as evidence. They are not presented as individual component choices.</p><button type="button" className={styles.archiveToggle} aria-expanded={open} onClick={toggle}>{open ? "Close archive drawer" : "Open archive drawer"}</button>{open ? <div className={styles.archiveWorkspace}><aside><label>Search all boards<input value={query} onChange={(event) => setQuery(event.target.value)} /></label>{matches.map((board) => <button type="button" key={board.id} aria-pressed={selected?.id === board.id} onClick={() => setSelectedId(board.id)}><img src={board.thumbnail} alt="" /><span>{board.title}</span></button>)}</aside>{error ? <p>{error}</p> : selected ? <article><h3>{selected.title}</h3><p>{selected.provenance} · {selected.sourceFile}</p><img src={selected.thumbnail} alt={`Archived design board: ${selected.title}`} /></article> : <p>Loading archive…</p>}</div> : null}</section>;
}

function RoomHeading({ number, title }: { number: string; title: string }) {
  return <div className={styles.roomHeading}><div><p className={styles.roomNumber}>{number === "Archive" ? "Preserved evidence" : `Room ${number} · founder choice pending`}</p><h2>{title}</h2></div><span className={styles.unselected}>Unselected</span></div>;
}

function MaterialSubheading({ title, detail }: { title: string; detail: string }) {
  return <div className={styles.materialSubheading}><h3>{title}</h3><span>{detail}</span></div>;
}

function MaterialSwatches({ values }: { values: string[] }) {
  return <span className={styles.materialSwatches} aria-hidden="true">{values.map((value, index) => <span key={`${value}-${index}`} className={styles.swatch} style={{ background: value }} />)}</span>;
}
