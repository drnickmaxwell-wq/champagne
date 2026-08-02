"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import candidates from "./persian-materials.json";
import routes from "./route-catalog.json";
import styles from "./design-lab.module.css";

type Candidate = (typeof candidates)[number] & { provenance?: string };
type LabStyle = CSSProperties & Record<`--${string}`, string>;
type Board = {
  id: string;
  title: string;
  sourceFile: string;
  categories: string[];
  provenance: string;
  decision: string;
  thumbnail: string;
};
type RouteEntry = (typeof routes)[number];
type Viewport = "desktop" | "tablet" | "mobile";
type Decision = "unselected" | "shortlist" | "rejected";

const CATALOGUE_URLS = ["band", "cta", "footer", "heritage", "hero", "other", "page", "section"].map(
  (name) => `/assets/champagne/design-lab/catalogues/${name}.json`,
);
let boardCataloguePromise: Promise<Board[]> | null = null;

function loadBoardCatalogue(): Promise<Board[]> {
  if (!boardCataloguePromise) {
    boardCataloguePromise = Promise.all(CATALOGUE_URLS.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Unable to load ${url}`);
      return response.json() as Promise<Board[]>;
    })).then((groups) => groups.flat());
  }
  return boardCataloguePromise;
}

const LIBRARIES = [
  { id: "cta-foundry", number: "02", title: "CTA library", category: "cta", description: "Buttons, framed gestures, editorial actions and guidance pathways." },
  { id: "cards-panels", number: "03", title: "Cards and decision panels", category: "section", description: "Evidence, reassurance, story, pathway and decision-support treatments." },
  { id: "section-families", number: "04", title: "Section family library", category: "section", description: "Every archived section board, including wave, proof, people, clinical and local families." },
  { id: "band-library", number: "05", title: "Complete band library", category: "band", description: "Mid-page, transition, reassurance, evidence, decision, consultation, pre-footer and closing bands." },
  { id: "footer-studio", number: "06", title: "Footer library", category: "footer", description: "Layered, architectural, consultation-gateway and mobile footer studies." },
  { id: "header-studio", number: "07", title: "Header and heritage language", category: "heritage", description: "St Mary’s House, heritage, architectural and supporting-site visual language." },
  { id: "concierge-interface", number: "08", title: "Captain Companion interface", category: "heritage", description: "Concierge and guidance surfaces; chatbot runtime remains outside this laboratory." },
  { id: "media-placement", number: "09", title: "Media and page studies", category: "page", description: "Full-page, treatment, Hero and media-placement evidence from the previous directorate." },
] as const;

function displayValue(value: string): string {
  return value.startsWith("#") ? value.toUpperCase() : "Current semantic value";
}

function validHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value.trim());
}

export function DesignChamber({ hero, initialReducedMotion }: { hero: ReactNode; initialReducedMotion: boolean }) {
  const router = useRouter();
  const [customCandidates, setCustomCandidates] = useState<Candidate[]>([]);
  const allCandidates = useMemo<Candidate[]>(() => [
    ...candidates.map((candidate) => ({
      ...candidate,
      provenance: candidate.kind === "archive" ? "Previous visual archive reference" : candidate.kind === "control" ? "Current repository control" : "Directorate analytical candidate",
    })),
    ...customCandidates,
  ], [customCandidates]);
  const [selectedId, setSelectedId] = useState<string>(candidates[0].id);
  const [customHex, setCustomHex] = useState("#06172E");
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion);
  const [heroState, setHeroState] = useState({ active: false, engine: "not detected", instance: "not exposed", roots: 0, stacks: 0, motionLayers: 0 });
  const [instanceChanges, setInstanceChanges] = useState(0);
  const [globalDecision, setGlobalDecision] = useState("No colour selected");
  const [routeQuery, setRouteQuery] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string>(routes[0].route);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const labRef = useRef<HTMLDivElement>(null);
  const firstInstance = useRef<string | null>(null);

  const selected = allCandidates.find((candidate) => candidate.id === selectedId) ?? allCandidates[0];
  const route = (routes as RouteEntry[]).find((entry) => entry.route === selectedRoute) ?? routes[0];
  const routeOptions = useMemo(() => {
    const query = routeQuery.trim().toLowerCase();
    return query ? routes.filter((entry) => `${entry.label} ${entry.route} ${entry.family}`.toLowerCase().includes(query)) : routes;
  }, [routeQuery]);

  const labStyle: LabStyle = {
    "--lab-canvas": selected.canvas,
    "--lab-elevated": selected.elevated,
    "--brand-ink": selected.canvas,
    "--surface-canvas": selected.canvas,
    "--surface-ink": selected.canvas,
    "--surface-ink-soft": selected.elevated,
    "--surface-footer-emotion": selected.canvas,
    "--bg-ink": selected.canvas,
    "--bg-ink-soft": selected.elevated,
  };

  useEffect(() => {
    const root = labRef.current;
    if (!root) return;
    const inspect = () => {
      const heroEngine = root.querySelector<HTMLElement>("[data-hero-engine]");
      const heroRenderer = root.querySelector<HTMLElement>("[data-hero-renderer='v2'], .hero-renderer-v2[data-hero-root='true']");
      const stacks = root.querySelectorAll<HTMLElement>("[data-v2-stack-instance]");
      const instance = stacks[0]?.dataset.v2StackInstance ?? null;
      if (instance && firstInstance.current === null) firstInstance.current = instance;
      else if (instance && firstInstance.current && firstInstance.current !== instance) {
        firstInstance.current = instance;
        setInstanceChanges((count) => count + 1);
      }
      setHeroState({
        active: Boolean(heroRenderer || heroEngine?.dataset.heroEngine === "v2"),
        engine: heroEngine?.dataset.heroEngine ?? heroRenderer?.dataset.heroRenderer ?? "not detected",
        instance: instance ?? "not exposed",
        roots: root.querySelectorAll("[data-hero-root='true'], [data-hero-renderer='v2']").length,
        stacks: stacks.length,
        motionLayers: root.querySelectorAll(".hero-surface--motion").length,
      });
    };
    inspect();
    const observer = new MutationObserver(inspect);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-v2-stack-instance", "data-hero-engine"] });
    return () => observer.disconnect();
  }, []);

  function setMotion(next: boolean) {
    setReducedMotion(next);
    const params = new URLSearchParams(window.location.search);
    if (next) params.set("labMotion", "reduce");
    else params.delete("labMotion");
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
        kind: "candidate",
        provenance: "Founder-entered laboratory candidate",
      }]);
    }
    setSelectedId(id);
    setGlobalDecision("No colour selected");
  }

  return (
    <main ref={labRef} className={styles.lab} style={labStyle} data-champagne-design-lab="true" data-production-binding="false" data-selected-candidate={selected.id} data-reduced-motion={reducedMotion ? "true" : "false"}>
      <header className={styles.labHeader}>
        <div><p className={styles.eyebrow}>Internal laboratory · production isolated</p><h1>Champagne Design Laboratory V2</h1><p>Browse the previous visual archive, test genuine Hero V2, and assemble real repository pages without changing production tokens or manifests.</p></div>
        <div className={styles.status} aria-label="Laboratory status"><span>Founder state: choices pending</span><span>Production binding: off</span><span>PR state: draft only</span><span>Hero remount observations: {instanceChanges}</span></div>
      </header>

      <nav className={styles.roomNav} aria-label="Design laboratory rooms"><a href="#token-chamber-heading">01 · Tokens</a>{LIBRARIES.map((room) => <a key={room.id} href={`#${room.id}`}>{room.number} · {room.title}</a>)}<a href="#page-assembler">10 · Pages</a></nav>

      <section className={styles.controls} aria-labelledby="token-chamber-heading">
        <div><p className={styles.roomNumber}>Room 01 · no founder selection</p><h2 id="token-chamber-heading">Persian Midnight Token Chamber</h2><p>References and suggestions are labelled by source. Reject all, add your own, or ask for another calibrated family.</p></div>
        <fieldset className={styles.candidateGrid}><legend className={styles.srOnly}>Persian Midnight candidates</legend>{allCandidates.map((candidate) => <button type="button" key={candidate.id} className={styles.candidate} aria-pressed={selected.id === candidate.id} onClick={() => { setSelectedId(candidate.id); setGlobalDecision("No colour selected"); }}><span className={styles.swatch} style={{ background: candidate.canvas }} aria-hidden="true" /><span><strong>{candidate.label}</strong><small>{displayValue(candidate.canvas)}</small><small>{candidate.provenance}</small></span></button>)}</fieldset>
        <div className={styles.customColour}><label><span>Try any exact colour</span><input value={customHex} onChange={(event) => setCustomHex(event.target.value)} aria-invalid={!validHex(customHex)} /></label><input type="color" value={validHex(customHex) ? customHex : "#06172E"} onChange={(event) => setCustomHex(event.target.value.toUpperCase())} aria-label="Choose a custom colour visually" /><button type="button" onClick={addCustomCandidate} disabled={!validHex(customHex)}>Add to laboratory</button><button type="button" className={styles.quietButton} onClick={() => setGlobalDecision("All current colours rejected")}>Reject all current colours</button></div>
        <div className={styles.decisionStrip}><span>Decision record: {globalDecision}</span><button type="button" onClick={() => setGlobalDecision(`Shortlisted ${selected.label}`)}>Shortlist current colour</button></div>
        <label className={styles.motionControl}><input type="checkbox" checked={reducedMotion} onChange={(event) => setMotion(event.target.checked)} /><span>Laboratory reduced-motion presentation</span></label>
      </section>

      <section className={styles.heroRoom} aria-labelledby="hero-room-heading">
        <div className={styles.roomHeading}><div><p className={styles.roomNumber}>Sacred preview · production selection path</p><h2 id="hero-room-heading">Genuine Hero V2</h2></div><dl className={styles.diagnostics}><div><dt>Status</dt><dd>{heroState.active ? "Hero V2 active" : "Hero V2 not detected"}</dd></div><div><dt>Engine</dt><dd>{heroState.engine}</dd></div><div><dt>Instance</dt><dd>{heroState.instance}</dd></div><div><dt>Roots / stacks</dt><dd>{heroState.roots} / {heroState.stacks}</dd></div><div><dt>Motion</dt><dd>{reducedMotion ? "PRM requested" : `${heroState.motionLayers} layers available`}</dd></div></dl></div>
        <div className={styles.heroFrame}>{hero}</div>
      </section>

      <section className={styles.systemPreview} aria-labelledby="system-preview-heading"><div className={styles.roomHeading}><div><p className={styles.roomNumber}>System proof</p><h2 id="system-preview-heading">The same candidate across Champagne</h2></div></div><div className={styles.porcelainBand} data-surface="porcelain"><div><p className={styles.roomNumber}>Porcelain transition</p><h3>Care that is considered, transparent and personal.</h3><p>Judge the transition out of Persian—not merely the colour in isolation.</p></div><div className={styles.promiseRail}><span>We listen first</span><span>Plans you understand</span><span>Care you can trust</span></div></div><div className={styles.cardRail}><article><span>01</span><h3>Clinical evidence</h3><p>Measured information, presented calmly.</p></article><article><span>02</span><h3>Your treatment path</h3><p>Clear stages without pressure or noise.</p></article><article><span>03</span><h3>Questions welcomed</h3><p>Ask before deciding. Continue at your pace.</p></article></div></section>

      {LIBRARIES.map((library) => <LibraryRoom key={library.id} {...library} />)}

      <section className={styles.room} id="page-assembler" aria-labelledby="assembler-heading">
        <RoomHeading number="10" title="Manifest-driven full-page assembler" id="assembler-heading" />
        <p className={styles.roomIntro}>Choose any mapped route. The left panel shows its real source and ordered sections; the right panel renders the actual preview page. Reordering remains disabled until the SEO and AI-search audit supplies evidence.</p>
        <div className={styles.assemblerToolbar}><label><span>Find a page</span><input value={routeQuery} onChange={(event) => setRouteQuery(event.target.value)} placeholder="Homepage, implants, team…" /></label><label><span>Current page</span><select value={selectedRoute} onChange={(event) => setSelectedRoute(event.target.value)}>{routeOptions.map((entry) => <option key={entry.route} value={entry.route}>{entry.label} · {entry.route}</option>)}</select></label><div className={styles.viewportButtons} aria-label="Preview viewport">{(["desktop", "tablet", "mobile"] as const).map((size) => <button type="button" key={size} aria-pressed={viewport === size} onClick={() => setViewport(size)}>{size}</button>)}</div></div>
        <div className={styles.assemblerV2}>
          <aside className={styles.manifestPanel}><div><small>{route.family} page</small><h3>{route.label}</h3><p>{route.route}</p></div><dl><div><dt>Source</dt><dd>{route.source}</dd></div><div><dt>SEO/AI audit</dt><dd>Required before order approval</dd></div><div><dt>Sections found</dt><dd>{route.sections.length || "Source adapter pending"}</dd></div></dl><ol>{route.sections.map((section) => <li key={section.instanceId}><span>{String(section.order).padStart(2, "0")}</span><div><strong>{section.title ?? section.componentId}</strong><small>{section.componentId} · {section.seoRole}</small></div></li>)}</ol>{route.sections.length === 0 ? <p className={styles.adapterNotice}>This non-treatment page is mapped, but its section-source adapter must be completed before laboratory reordering is allowed.</p> : null}</aside>
          <div className={styles.pageStage} data-viewport={viewport}><div className={styles.pageStageBar}><span>Actual preview route</span><a href={route.route} target="_blank" rel="noreferrer">Open full page</a></div><iframe key={route.route} src={route.route} title={`Actual page preview: ${route.label}`} /></div>
        </div>
      </section>
    </main>
  );
}

function LibraryRoom({ id, number, title, category, description }: { id: string; number: string; title: string; category: string; description: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const matches = boards.filter((board) => board.categories.includes(category) && (!query || board.title.toLowerCase().includes(query.toLowerCase())));
  const selected = boards.find((board) => board.id === selectedBoardId && board.categories.includes(category)) ?? matches[0];
  function toggleLibrary() {
    const next = !open;
    setOpen(next);
    if (next && boards.length === 0 && !loading) {
      setLoading(true);
      setLoadError("");
      void loadBoardCatalogue().then((entries) => {
        setBoards(entries);
        setSelectedBoardId(entries.find((board) => board.categories.includes(category))?.id ?? "");
      }).catch((error: unknown) => setLoadError(error instanceof Error ? error.message : "Unable to load archive")).finally(() => setLoading(false));
    }
  }
  function decide(decision: Decision) {
    if (!selected) return;
    setDecisions((current) => ({ ...current, [selected.id]: decision }));
  }
  return <section className={styles.room} id={id} aria-labelledby={`${id}-heading`}><RoomHeading number={number} title={title} id={`${id}-heading`} /><p className={styles.roomIntro}>{description}</p><button type="button" className={styles.libraryToggle} aria-expanded={open} onClick={toggleLibrary}>{open ? "Close visual library" : "Open visual library"}</button>{open && loading ? <p className={styles.roomIntro}>Loading archived design boards…</p> : null}{open && loadError ? <p className={styles.adapterNotice}>{loadError}</p> : null}{open && !loading && !loadError ? <div className={styles.libraryWorkspace}><aside><label><span>Search this family · {matches.length} boards</span><input value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className={styles.thumbnailGrid}>{matches.map((board) => <button type="button" key={board.id} aria-pressed={selected?.id === board.id} onClick={() => setSelectedBoardId(board.id)}><img src={board.thumbnail} alt="" /><span>{board.title}</span><small>{decisions[board.id] ?? "unselected"}</small></button>)}</div></aside>{selected ? <article className={styles.boardPreview}><div><small>{selected.provenance}</small><h3>{selected.title}</h3><p>Categories: {selected.categories.join(", ")}</p></div><img src={selected.thumbnail} alt={`Archived design board: ${selected.title}`} /><div className={styles.boardActions}><button type="button" aria-pressed={decisions[selected.id] === "shortlist"} onClick={() => decide("shortlist")}>Shortlist</button><button type="button" aria-pressed={decisions[selected.id] === "rejected"} onClick={() => decide("rejected")}>Reject</button><button type="button" onClick={() => decide("unselected")}>Return to undecided</button></div></article> : <p>No matching archived boards.</p>}</div> : null}</section>;
}

function RoomHeading({ number, title, id }: { number: string; title: string; id: string }) {
  return <div className={styles.roomHeading}><div><p className={styles.roomNumber}>Room {number} · founder choice pending</p><h2 id={id}>{title}</h2></div><span className={styles.unselected}>Unselected</span></div>;
}
