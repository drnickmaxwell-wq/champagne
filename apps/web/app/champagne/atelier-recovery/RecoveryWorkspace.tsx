"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./recovery.module.css";
import { ReconstructionLibrary } from "./components/a2/ReconstructionLibrary";
import {
  applyReview, currentDecisionMap, deriveIndex, deriveProgress, deterministicExport,
  EMPTY_FLAGS, FLAG_KEYS, TRAIT_DIMENSIONS, TRAIT_SIGNALS, undoLast, validateDataset,
} from "./data/preferences/preference-model.mjs";

type ArchiveItem = {
  id: string; title: string; family: string; purpose: string; labRoom: string; asset: string;
  parentBoard: string; archivePath: string; crop: unknown; technicalStatus: string;
};
type Trait = { dimension: string; signal: string; note?: string };
type Decision = {
  decisionId: string; cvaId: string; status: string;
  wholeItemSignal: string; notes: string; traits: Trait[]; flags: Record<string, boolean>;
  source: { kind: string; identifier: string; provenance: string; exactMapping: boolean; originalTraitDimensions?: string[] };
  timestamp: string; version: number; supersedes: string | null;
};
type Dataset = {
  schema: string; version: number; datasetRevision: number; productionBinding: boolean;
  sourceManifest: { sha256: string; itemCount: number }; decisions: Decision[];
  session: { lastCvaId: string | null; updatedAt: string };
};
type Persistence = { mode: string; canonicalWriteEnabled: boolean; browserStateIsCanonical: false; productionBinding: false };
type Queue = "ALL" | "UNRATED" | "LOVE" | "LIKE" | "MAYBE" | "NOT_ME" | "NEEDS_REFINEMENT" | "NEEDS_UPGRADE" | "BEST_OF_LOVE";
type View = "REVIEW" | "SUMMARY" | "ARCHIVE" | "COMPONENTS";

const SIGNALS = ["LOVE", "LIKE", "MAYBE", "NOT_ME"] as const;
const SHORTCUTS: Record<string, string> = { "1": "LOVE", "2": "LIKE", "3": "MAYBE", "4": "NOT_ME" };
const WORKING_COPY_KEY = "champagne-atelier-a1-working-copy-v1";
const FLAG_LABELS: Record<string, string> = {
  keepConcept: "Keep concept", needsRefinement: "Needs refinement", needsUpgrade: "Needs upgrade",
  wrongColours: "Wrong colours", wrongTypography: "Wrong typography", wrongImagery: "Wrong imagery",
  wrongGeometry: "Wrong geometry", wrongComposition: "Wrong composition", wrongInteraction: "Wrong interaction",
};

function isEditable(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return Boolean(element?.closest("input, textarea, select, [contenteditable='true']"));
}

function storeWorkingCopy(dataset: Dataset) {
  try {
    localStorage.setItem(WORKING_COPY_KEY, deterministicExport(dataset));
    return true;
  } catch {
    return false;
  }
}

export function RecoveryWorkspace({ archive, initialDataset, persistence }: { archive: ArchiveItem[]; initialDataset: Dataset; persistence: Persistence }) {
  const [dataset, setDataset] = useState<Dataset>(initialDataset);
  const [view, setView] = useState<View>("REVIEW");
  const [queue, setQueue] = useState<Queue>(initialDataset.session.lastCvaId ? "ALL" : "UNRATED");
  const [category, setCategory] = useState("ALL");
  const [family, setFamily] = useState("ALL");
  const [board, setBoard] = useState("ALL");
  const [index, setIndex] = useState(() => initialDataset.session.lastCvaId ? Math.max(0, archive.findIndex((item) => item.id === initialDataset.session.lastCvaId)) : 0);
  const [saveState, setSaveState] = useState(persistence.canonicalWriteEnabled ? "CANONICAL FILE READY" : "BROWSER WORKING COPY");
  const [focusMode, setFocusMode] = useState(false);
  const [showTraits, setShowTraits] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showParent, setShowParent] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (persistence.canonicalWriteEnabled) return;
    try {
      const stored = localStorage.getItem(WORKING_COPY_KEY);
      if (!stored) return;
      const validated = validateDataset(JSON.parse(stored), archive.map((item) => item.id), initialDataset.sourceManifest.sha256);
      if (validated.datasetRevision < initialDataset.datasetRevision) {
        setSaveState(storeWorkingCopy(initialDataset) ? `STALE BROWSER COPY UPGRADED · REVISION ${initialDataset.datasetRevision}` : "BROWSER STORAGE UNAVAILABLE · EXPORT CHECKPOINT");
        return;
      }
      setDataset(validated);
      if (validated.session.lastCvaId) {
        setQueue("ALL");
        setIndex(Math.max(0, archive.findIndex((item) => item.id === validated.session.lastCvaId)));
      }
      setSaveState("BROWSER CHECKPOINT RESTORED · NOT CANONICAL");
    } catch {
      try { localStorage.removeItem(WORKING_COPY_KEY); } catch { /* storage is unavailable */ }
      setSaveState("INVALID BROWSER COPY REJECTED");
    }
  }, [archive, initialDataset, persistence.canonicalWriteEnabled]);

  const decisionMap = useMemo(() => currentDecisionMap(dataset) as Map<string, Decision>, [dataset]);
  const progress = useMemo(() => deriveProgress(dataset, archive), [dataset, archive]);
  const categories = useMemo(() => ["ALL", ...Array.from(new Set(archive.map((item) => item.labRoom))).sort()], [archive]);
  const families = useMemo(() => ["ALL", ...Array.from(new Set(archive.map((item) => item.family))).sort()], [archive]);
  const boards = useMemo(() => ["ALL", ...Array.from(new Set(archive.map((item) => item.parentBoard))).sort()], [archive]);
  const filtered = useMemo(() => archive.filter((item) => {
    const decision = decisionMap.get(item.id);
    const signal = decision?.wholeItemSignal ?? "UNRATED";
    const queueMatch = queue === "ALL"
      || queue === signal
      || (queue === "NEEDS_REFINEMENT" && decision?.flags.needsRefinement)
      || (queue === "NEEDS_UPGRADE" && decision?.flags.needsUpgrade)
      || (queue === "BEST_OF_LOVE" && signal === "LOVE" && !decision?.flags.needsRefinement && !decision?.flags.needsUpgrade);
    return queueMatch && (category === "ALL" || item.labRoom === category) && (family === "ALL" || item.family === family) && (board === "ALL" || item.parentBoard === board);
  }), [archive, board, category, decisionMap, family, queue]);
  const safeIndex = filtered.length ? Math.min(index, filtered.length - 1) : 0;
  const item = filtered[safeIndex] ?? null;
  const decision = item ? decisionMap.get(item.id) : undefined;

  const persist = useCallback(async (next: Dataset, expectedRevision: number) => {
    setDataset(next);
    setSaveState("SAVING…");
    if (!persistence.canonicalWriteEnabled) {
      setSaveState(storeWorkingCopy(next) ? "BROWSER CHECKPOINT SAVED · NOT CANONICAL" : "BROWSER STORAGE UNAVAILABLE · EXPORT CHECKPOINT");
      return;
    }
    saveQueueRef.current = saveQueueRef.current.then(async () => {
      try {
        const response = await fetch("/champagne/atelier-recovery/api/preferences", {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataset: next, expectedRevision }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        setSaveState("CANONICAL WORKTREE FILE SAVED");
      } catch (error) {
        const retained = storeWorkingCopy(next);
        setSaveState(`SAVE REJECTED · ${retained ? "CHECKPOINT RETAINED" : "BROWSER STORAGE UNAVAILABLE"} · ${error instanceof Error ? error.message : "UNKNOWN"}`);
      }
    });
    await saveQueueRef.current;
  }, [persistence.canonicalWriteEnabled]);

  const change = useCallback((patch: Record<string, unknown>, advance = false) => {
    if (!item) return;
    const next = applyReview(dataset, item.id, patch) as Dataset;
    void persist(next, dataset.datasetRevision);
    if (advance && safeIndex < filtered.length - 1) setIndex((value) => value + 1);
  }, [dataset, filtered.length, item, persist, safeIndex]);

  const navigate = useCallback((delta: number) => {
    setIndex((value) => Math.max(0, Math.min(filtered.length - 1, value + delta)));
  }, [filtered.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditable(event.target)) return;
      if (SHORTCUTS[event.key]) { event.preventDefault(); change({ wholeItemSignal: SHORTCUTS[event.key] }, true); }
      else if (event.key === "ArrowRight") { event.preventDefault(); navigate(1); }
      else if (event.key === "ArrowLeft") { event.preventDefault(); navigate(-1); }
      else if (event.key.toLowerCase() === "n") { event.preventDefault(); notesRef.current?.focus(); }
      else if (event.key.toLowerCase() === "s") { event.preventDefault(); change({ wholeItemSignal: "UNRATED" }, true); }
      else if (event.key.toLowerCase() === "z") { event.preventDefault(); const next = undoLast(dataset) as Dataset; void persist(next, dataset.datasetRevision); }
      else if (event.key === "Escape") { setFocusMode(false); setShowParent(false); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [change, dataset, navigate, persist]);

  const history = item ? dataset.decisions.filter((entry) => entry.cvaId === item.id).sort((a, b) => b.version - a.version) : [];
  const siblings = item ? archive.filter((entry) => entry.parentBoard === item.parentBoard) : [];

  return <main className={styles.a1Shell} data-testid="atelier-recovery" data-production-binding="false">
    <header className={styles.a1Header}>
      <div><strong>CHAMPAGNE ATELIER</strong><span>Founder Corpus · A1 closed · A2 review</span></div>
      <nav aria-label="Review system areas">
        {(["REVIEW", "SUMMARY", "ARCHIVE", "COMPONENTS"] as View[]).map((name) => <button key={name} type="button" aria-current={view === name ? "page" : undefined} onClick={() => setView(name)}>{name}</button>)}
      </nav>
      <div className={styles.headerProgress} aria-label={`${progress.decided} of 331 decided`}><strong>{progress.decided} / 331</strong><span>{progress.remaining} remaining</span></div>
    </header>

    {view === "REVIEW" ? <section className={styles.reviewApp} data-testid="review-view">
      <aside className={styles.reviewRail}>
        <label>Work queue<select value={queue} onChange={(event) => { setQueue(event.target.value as Queue); setIndex(0); }}>{["UNRATED", "ALL", "LOVE", "LIKE", "MAYBE", "NOT_ME", "NEEDS_REFINEMENT", "NEEDS_UPGRADE", "BEST_OF_LOVE"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Category<select value={category} onChange={(event) => { setCategory(event.target.value); setIndex(0); }}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Visual family<select value={family} onChange={(event) => { setFamily(event.target.value); setIndex(0); }}>{families.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Source board<select value={board} onChange={(event) => { setBoard(event.target.value); setIndex(0); }}>{boards.map((value) => <option key={value}>{value}</option>)}</select></label>
        <div className={styles.queueCount}><strong data-testid="queue-size">{filtered.length}</strong><span>items in queue</span></div>
        <div className={styles.signalCounts}>{SIGNALS.map((signal) => <span key={signal}><b>{progress.counts[signal]}</b>{signal.replace("_", " ")}</span>)}<span><b>{progress.counts.UNRATED}</b>UNRATED</span></div>
        <button type="button" className={styles.secondaryButton} onClick={() => { const next = undoLast(dataset) as Dataset; void persist(next, dataset.datasetRevision); }}>Undo last decision <kbd>Z</kbd></button>
        <p className={styles.persistenceTruth} data-testid="persistence-status"><strong>{persistence.mode}</strong>{saveState}<br />Browser state is never canonical authority.</p>
      </aside>

      {item ? <div className={focusMode ? `${styles.reviewMain} ${styles.focusMode}` : styles.reviewMain}>
        <header className={styles.itemHeader}>
          <div><span>{item.id}</span><h1>{item.title}</h1><p>{item.labRoom} · {item.family}</p></div>
          <div className={styles.itemPosition}><strong>{safeIndex + 1} / {filtered.length}</strong><span>{queue.replaceAll("_", " ")}</span></div>
        </header>

        <ArtworkViewer item={item} focusMode={focusMode} onFocus={() => setFocusMode((value) => !value)} onParent={() => setShowParent(true)} />

        <section className={styles.decisionPanel} aria-label="Founder decision controls">
          {decision?.source.kind === "EXACT_IMPORT" ? <div className={styles.importedDecision} data-testid="imported-provenance"><strong>EXACT PRIOR FOUNDER DECISION</strong><span>{decision.source.identifier}</span></div> : null}
          <div className={styles.ratingControls}>{SIGNALS.map((signal, signalIndex) => <button key={signal} type="button" aria-pressed={decision?.wholeItemSignal === signal} onClick={() => change({ wholeItemSignal: signal }, true)}><kbd>{signalIndex + 1}</kbd>{signal.replace("_", " ")}</button>)}<button type="button" aria-pressed={!decision || decision.wholeItemSignal === "UNRATED"} onClick={() => change({ wholeItemSignal: "UNRATED" }, true)}><kbd>S</kbd>SKIP</button></div>
          <div className={styles.refinementFlags} data-testid="refinement-flags">{FLAG_KEYS.map((key: string) => <button key={key} type="button" aria-pressed={Boolean(decision?.flags[key])} onClick={() => change({ flags: { ...(decision?.flags ?? EMPTY_FLAGS), [key]: !decision?.flags[key] } })}>{FLAG_LABELS[key]}</button>)}</div>
          <label className={styles.notesField}>Founder note<textarea ref={notesRef} defaultValue={decision?.notes ?? ""} key={decision?.decisionId ?? item.id} placeholder="Preserved verbatim — e.g. love the shape but colour is wrong" onBlur={(event) => { if (event.target.value !== (decision?.notes ?? "")) change({ notes: event.target.value }); }} /></label>
          <div className={styles.panelActions}><button type="button" onClick={() => setShowTraits((value) => !value)} aria-expanded={showTraits}>Trait evidence {showTraits ? "−" : "+"}</button><button type="button" onClick={() => setShowHistory((value) => !value)} aria-expanded={showHistory}>History · v{decision?.version ?? 0}</button></div>
          {showTraits ? <TraitEditor traits={decision?.traits ?? []} onChange={(traits) => change({ traits })} /> : null}
          {showHistory ? <History decisions={history} /> : null}
        </section>
        <footer className={styles.reviewFooter}><button type="button" onClick={() => navigate(-1)} disabled={safeIndex === 0}>← Previous</button><span aria-live="polite">{saveState}</span><button type="button" onClick={() => navigate(1)} disabled={safeIndex >= filtered.length - 1}>Next →</button></footer>
      </div> : <div className={styles.emptyQueue}><h1>Queue complete.</h1><p>No items match these filters. A tiny, satisfying administrative miracle.</p><button type="button" onClick={() => { setQueue("UNRATED"); setCategory("ALL"); setBoard("ALL"); }}>Return to unrated</button></div>}
    </section> : null}

    {view === "SUMMARY" ? <Summary dataset={dataset} archive={archive} progress={progress} onExport={() => download("ATELIER_FOUNDER_VISUAL_PREFERENCE_DATASET_V1.json", deterministicExport(dataset))} onIndex={() => download("ATELIER_FOUNDER_VISUAL_PREFERENCE_DERIVED_INDEX_V1.json", `${JSON.stringify(deriveIndex(dataset, archive), null, 2)}\n`)} onImport={() => importRef.current?.click()} /> : null}
    {view === "ARCHIVE" ? <ArchiveIndex archive={archive} decisionMap={decisionMap} onOpen={(cvaId) => { setQueue("ALL"); setCategory("ALL"); setBoard("ALL"); setIndex(archive.findIndex((entry) => entry.id === cvaId)); setView("REVIEW"); }} /> : null}
    {view === "COMPONENTS" ? <ReconstructionLibrary /> : null}

    <input ref={importRef} className={styles.hiddenInput} type="file" accept="application/json,.json" onChange={async (event) => {
      const file = event.target.files?.[0]; if (!file) return;
      try { const imported = validateDataset(JSON.parse(await file.text()), archive.map((entry) => entry.id), initialDataset.sourceManifest.sha256) as Dataset; if (imported.datasetRevision < dataset.datasetRevision) throw new Error("STALE_CHECKPOINT_REVISION"); setDataset(imported); if (!persistence.canonicalWriteEnabled && !storeWorkingCopy(imported)) throw new Error("BROWSER_STORAGE_UNAVAILABLE"); setSaveState("CHECKPOINT IMPORTED · REVIEW BEFORE CANONICAL SAVE"); }
      catch (error) { setSaveState(error instanceof Error ? error.message : "IMPORT REJECTED"); }
      event.target.value = "";
    }} />
    {showParent && item ? <ParentContext item={item} siblings={siblings} onClose={() => setShowParent(false)} /> : null}
    <footer className={styles.a1Status}><span>OPEN · DRAFT · UNMERGED</span><span>A2 EXPERIMENTAL RECONSTRUCTIONS · NO PAGE DESIGN</span><strong>productionBinding=false</strong></footer>
  </main>;
}

function ArtworkViewer({ item, focusMode, onFocus, onParent }: { item: ArchiveItem; focusMode: boolean; onFocus: () => void; onParent: () => void }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  useEffect(() => { setZoom(1); setPosition({ x: 0, y: 0 }); }, [item.id]);
  return <section className={styles.artwork} data-testid="large-artwork">
    <div className={styles.artToolbar} aria-label="Artwork viewing controls"><button type="button" onClick={() => { setZoom(.92); setPosition({ x: 0, y: 0 }); }}>Fit</button><button type="button" onClick={() => setZoom(1)}>100%</button><button type="button" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(.5, value - .2))}>−</button><output aria-label="Current zoom">{Math.round(zoom * 100)}%</output><button type="button" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(3, value + .2))}>+</button><button type="button" onClick={onParent}>Parent board context</button><button type="button" onClick={onFocus}>{focusMode ? "Exit focus" : "Focus mode"}</button></div>
    <div className={styles.artCanvas} aria-label="Pannable visual authority canvas" onPointerDown={(event) => { drag.current = { x: event.clientX, y: event.clientY, px: position.x, py: position.y }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (drag.current && zoom > 1) setPosition({ x: drag.current.px + event.clientX - drag.current.x, y: drag.current.py + event.clientY - drag.current.y }); }} onPointerUp={() => { drag.current = null; }}>
      <img src={item.asset} alt={`${item.title} — archived visual authority`} draggable={false} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }} />
    </div>
  </section>;
}

function TraitEditor({ traits, onChange }: { traits: Trait[]; onChange: (traits: Trait[]) => void }) {
  const map = new Map(traits.map((trait) => [trait.dimension, trait]));
  return <section className={styles.traits} data-testid="trait-evidence"><p>Optional. Whole-item ratings never imply trait ratings.</p>{TRAIT_DIMENSIONS.map((dimension: string) => <div key={dimension}><strong>{dimension}</strong><div>{TRAIT_SIGNALS.map((signal: string) => <button key={signal} type="button" aria-pressed={map.get(dimension)?.signal === signal} onClick={() => onChange([...traits.filter((trait) => trait.dimension !== dimension), { dimension, signal }])}>{signal}</button>)}{map.has(dimension) ? <button type="button" onClick={() => onChange(traits.filter((trait) => trait.dimension !== dimension))}>Clear</button> : null}</div>{map.has(dimension) ? <input key={`${dimension}-${map.get(dimension)?.signal}-${map.get(dimension)?.note ?? ""}`} aria-label={`${dimension} trait note`} defaultValue={map.get(dimension)?.note ?? ""} placeholder="Optional trait note" onBlur={(event) => onChange([...traits.filter((trait) => trait.dimension !== dimension), { ...map.get(dimension), dimension, note: event.target.value } as Trait])} /> : null}</div>)}</section>;
}

function History({ decisions }: { decisions: Decision[] }) {
  return <section className={styles.history} data-testid="decision-history"><h2>Supersession history</h2>{decisions.map((entry) => <article key={entry.decisionId}><strong>v{entry.version} · {entry.wholeItemSignal.replace("_", " ")}</strong><span>{entry.status} · {entry.source.kind}</span><time>{entry.timestamp}</time>{entry.notes ? <p>{entry.notes}</p> : null}</article>)}</section>;
}

function Summary({ dataset, archive, progress, onExport, onIndex, onImport }: { dataset: Dataset; archive: ArchiveItem[]; progress: ReturnType<typeof deriveProgress>; onExport: () => void; onIndex: () => void; onImport: () => void }) {
  const current = Array.from(currentDecisionMap(dataset).values()) as Decision[];
  const positive = traitCounts(current, "POSITIVE"); const negative = traitCounts(current, "NEGATIVE");
  return <section className={styles.summary} data-testid="summary-view"><header><span>A1 REVIEW SUMMARY</span><h1>{progress.decided} decisions. Every one explicit.</h1><p>Descriptive evidence only—no generated design conclusions and no fake learning certainty.</p></header>
    <div className={styles.summaryMetrics}>{(["LOVE", "LIKE", "MAYBE", "NOT_ME", "UNRATED"] as const).map((signal) => <article key={signal}><strong>{progress.counts[signal]}</strong><span>{signal.replace("_", " ")}</span></article>)}</div>
    <div className={styles.summaryColumns}><section><h2>Category progress</h2>{Object.entries(progress.categories).map(([name, value]: [string, { total: number; decided: number }]) => <div key={name}><span>{name}</span><strong>{value.decided}/{value.total}</strong></div>)}</section><section><h2>Trait evidence</h2><h3>Positive</h3>{positive.map(([name, count]) => <p key={name}>{name}<strong>{count}</strong></p>)}<h3>Negative</h3>{negative.map(([name, count]) => <p key={name}>{name}<strong>{count}</strong></p>)}</section><section><h2>Refinement</h2><p>Needs refinement <strong>{progress.counts.needsRefinement}</strong></p><p>Needs upgrade <strong>{progress.counts.needsUpgrade}</strong></p><p>Dataset revision <strong>{dataset.datasetRevision}</strong></p><p>Archive reconciled <strong>{archive.length}/331</strong></p></section></div>
    <div className={styles.checkpointActions} data-testid="checkpoint-controls"><button type="button" onClick={onExport}>Export review checkpoint</button><button type="button" onClick={onImport}>Import review checkpoint</button><button type="button" onClick={onIndex}>Export derived A2/A3/A5 index</button></div>
  </section>;
}

function ArchiveIndex({ archive, decisionMap, onOpen }: { archive: ArchiveItem[]; decisionMap: Map<string, Decision>; onOpen: (id: string) => void }) {
  return <section className={styles.archiveIndex} data-testid="archive-view"><header><span>331 AUTHORITY INDEX</span><h1>Find an item. Judge it large.</h1></header><div>{archive.map((item) => <button key={item.id} type="button" onClick={() => onOpen(item.id)}><img src={item.asset} alt="" loading="lazy" /><span>{item.id}</span><strong>{item.title}</strong><small>{decisionMap.get(item.id)?.wholeItemSignal.replace("_", " ") ?? "UNRATED"}</small></button>)}</div></section>;
}

function ParentContext({ item, siblings, onClose }: { item: ArchiveItem; siblings: ArchiveItem[]; onClose: () => void }) {
  return <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={styles.parentContext} role="dialog" aria-modal="true" aria-labelledby="parent-title"><header><div><span>RECONSTRUCTED CROP CONTEXT</span><h2 id="parent-title">{item.parentBoard}</h2></div><button type="button" onClick={onClose} aria-label="Close parent board context">Close</button></header><p>The original full board is not preserved in A0. These are all surviving CVA crops linked to that board, with exact source provenance.</p><dl><div><dt>Source archive path</dt><dd>{item.archivePath}</dd></div><div><dt>Crop provenance</dt><dd>{JSON.stringify(item.crop)}</dd></div></dl><div>{siblings.map((sibling) => <figure key={sibling.id}><img src={sibling.asset} alt={`${sibling.title} sibling crop`} /><figcaption>{sibling.id}</figcaption></figure>)}</div></section></div>;
}

function traitCounts(decisions: Decision[], signal: string) {
  const counts = new Map<string, number>();
  for (const decision of decisions) for (const trait of decision.traits) if (trait.signal === signal) counts.set(trait.dimension, (counts.get(trait.dimension) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
}
