"use client";

import { useDeferredValue, useMemo, useState } from "react";
import styles from "./recovery.module.css";

type ArchiveItem = {
  id: string;
  title: string;
  family: string;
  purpose: string;
  labRoom: string;
  asset: string;
  parentBoard: string;
  technicalStatus: string;
  implementationAvailable: boolean;
  usableInPageComposition: boolean;
};

type BrandSummary = {
  id: string;
  state: string;
  essence: string;
  colours: { magenta: string; turquoise: string; gold: string; rule: string };
  antiDna: readonly string[];
  domains: Record<string, string>;
  approvedSectionSystems: readonly string[];
  waveAuthority: string;
  closureState: string;
  unresolvedThreeD: string;
  productionBinding: false;
};

type CapabilityState = {
  archiveCount: 331;
  exactImportedPreferenceCandidates: 38;
  reconstructedComponentCount: 0;
  reviewSystem: "COMING_NEXT_A1";
  componentReconstruction: "NOT_STARTED_A2";
  pageComposition: "NOT_AUTHORISED_A0";
  legacyFamilyAuthority: false;
  productionBinding: false;
};

type View = "FOUNDATION" | "ARCHIVE" | "REVIEW" | "COMPONENTS" | "PAGES" | "BRAND_AUTHORITY";
type Viewport = "1440" | "1024" | "768" | "390";

const NAV_ITEMS: Array<{ id: View; label: string }> = [
  { id: "FOUNDATION", label: "FOUNDATION" },
  { id: "ARCHIVE", label: "ARCHIVE" },
  { id: "REVIEW", label: "REVIEW" },
  { id: "COMPONENTS", label: "COMPONENTS" },
  { id: "PAGES", label: "PAGES" },
  { id: "BRAND_AUTHORITY", label: "BRAND AUTHORITY" },
];

const VIEWPORTS: Viewport[] = ["1440", "1024", "768", "390"];

export function RecoveryWorkspace({ archive, brand, capabilities }: { archive: ArchiveItem[]; brand: BrandSummary; capabilities: CapabilityState }) {
  const [view, setView] = useState<View>("FOUNDATION");

  return (
    <main className={styles.shell} data-testid="atelier-recovery" data-active-view={view} data-production-binding="false">
      <header className={styles.topbar}>
        <div>
          <strong>CHAMPAGNE ATELIER</strong>
          <span>Recovery foundation A0</span>
        </div>
        <dl>
          <div><dt>Clean base</dt><dd>a00f718</dd></div>
          <div><dt>Forensic source</dt><dd>cc3f7fa</dd></div>
          <div><dt>Binding</dt><dd>false</dd></div>
        </dl>
      </header>

      <div className={styles.workspace}>
        <nav className={styles.nav} aria-label="Atelier recovery areas">
          <div className={styles.wordmark} aria-hidden="true"><span>C</span><i /></div>
          {NAV_ITEMS.map((item) => (
            <button key={item.id} type="button" aria-current={view === item.id ? "page" : undefined} onClick={() => setView(item.id)}>
              <span>{item.label}</span>
              <small>{navState(item.id, capabilities)}</small>
            </button>
          ))}
          <p><strong>NO GENERIC FALLBACK</strong>If a real reconstructed grammar does not exist, Atelier returns <code>BRAND_COMPONENT_GAP</code>.</p>
        </nav>

        <section className={styles.content} aria-live="polite">
          {view === "FOUNDATION" ? <FoundationView capabilities={capabilities} brand={brand} /> : null}
          {view === "ARCHIVE" ? <ArchiveView archive={archive} /> : null}
          {view === "REVIEW" ? <ReviewView capabilities={capabilities} /> : null}
          {view === "COMPONENTS" ? <ComponentsView capabilities={capabilities} /> : null}
          {view === "PAGES" ? <PagesView /> : null}
          {view === "BRAND_AUTHORITY" ? <BrandView brand={brand} /> : null}
        </section>
      </div>

      <footer className={styles.statusbar}>
        <span>OPEN · DRAFT · UNMERGED</span>
        <span>NOINDEX · ISOLATED</span>
        <span>Hero / governed content / media / 3D untouched</span>
        <strong>productionBinding=false</strong>
      </footer>
    </main>
  );
}

function navState(view: View, capabilities: CapabilityState) {
  if (view === "ARCHIVE") return `${capabilities.archiveCount} preserved`;
  if (view === "REVIEW") return "A1 coming next";
  if (view === "COMPONENTS") return `${capabilities.reconstructedComponentCount} reconstructed`;
  if (view === "PAGES") return "Not authorised";
  if (view === "BRAND_AUTHORITY") return "Canonical 1.0.0";
  return "Foundation live";
}

function SurfaceHeader({ title, number, children }: { title: string; number: string; children: React.ReactNode }) {
  return <header className={styles.surfaceHeader}><span>{number}</span><div><h1>{title}</h1><p>{children}</p></div></header>;
}

function FoundationView({ capabilities, brand }: { capabilities: CapabilityState; brand: BrandSummary }) {
  return <div data-testid="foundation-view">
    <SurfaceHeader number="A0" title="A truthful foundation for Atelier">The archive survives. Canonical Brand authority is installed. The missing bridge now has contracts. No Champagne page has been designed.</SurfaceHeader>
    <section className={styles.foundationHero}>
      <div>
        <span>RECOVERY ROUTE · OPTION B</span>
        <h2>Reference image to adaptive component—without the pretend bit in the middle.</h2>
        <p>The old fixed-family renderer is quarantined as historical evidence. Recovery begins with explicit Founder decisions, code-native grammars and visible gaps.</p>
      </div>
      <div className={styles.orbits} aria-hidden="true"><i /><i /><i /></div>
    </section>
    <ol className={styles.pipeline} aria-label="Atelier recovery pipeline">
      <li data-state="ready"><span>01</span><strong>Founder evidence</strong><small>{capabilities.exactImportedPreferenceCandidates} exact decisions identified</small></li>
      <li data-state="ready"><span>02</span><strong>Component grammar</strong><small>Contract ready · implementation A2</small></li>
      <li data-state="gap"><span>03</span><strong>Adaptive components</strong><small>BRAND_COMPONENT_GAP</small></li>
      <li data-state="gap"><span>04</span><strong>Page composition</strong><small>Not authorised in A0</small></li>
    </ol>
    <section className={styles.truthGrid}>
      <article><span>ARCHIVE</span><strong>{capabilities.archiveCount}/331</strong><p>Original V27 visual evidence preserved with stable CVA identity.</p></article>
      <article><span>BRAND AUTHORITY</span><strong>1</strong><p>{brand.id} is the only canonical machine authority.</p></article>
      <article><span>REAL COMPONENTS</span><strong>{capabilities.reconstructedComponentCount}</strong><p>Intentionally zero until A2 proves faithful adaptive code.</p></article>
    </section>
  </div>;
}

function ArchiveView({ archive }: { archive: ArchiveItem[] }) {
  const [query, setQuery] = useState("");
  const [room, setRoom] = useState("ALL");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const rooms = useMemo(() => ["ALL", ...Array.from(new Set(archive.map((item) => item.labRoom))).sort()], [archive]);
  const filtered = useMemo(() => archive.filter((item) => {
    const matchesRoom = room === "ALL" || item.labRoom === room;
    const haystack = `${item.id} ${item.title} ${item.family} ${item.purpose}`.toLowerCase();
    return matchesRoom && (!deferredQuery || haystack.includes(deferredQuery));
  }), [archive, deferredQuery, room]);

  return <div data-testid="archive-view">
    <SurfaceHeader number="01" title="The visual archive survived">Every preview below is reference evidence—not an adaptive component, not a page-composition primitive, and not permission for automatic substitution.</SurfaceHeader>
    <div className={styles.archiveTools}>
      <label>Search 331 authorities<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="CVA ID, title, purpose…" /></label>
      <label>Archive room<select value={room} onChange={(event) => setRoom(event.target.value)}>{rooms.map((value) => <option key={value}>{value}</option>)}</select></label>
      <strong>{filtered.length} shown</strong>
    </div>
    <div className={styles.archiveGrid}>
      {filtered.slice(0, 18).map((item) => <article key={item.id}>
        <a href={item.asset} target="_blank" rel="noreferrer"><img src={item.asset} alt={`${item.title} archived visual authority`} loading="lazy" /></a>
        <div><span>{item.id}</span><h2>{item.title}</h2><p>{item.purpose}</p><small>{item.labRoom} · {item.technicalStatus} · component: no</small></div>
      </article>)}
    </div>
    {filtered.length > 18 ? <p className={styles.continuation}>Showing the first 18 matches. A1 adds full review navigation, filters and progress without altering the archive.</p> : null}
  </div>;
}

function ReviewView({ capabilities }: { capabilities: CapabilityState }) {
  return <div data-testid="review-view">
    <SurfaceHeader number="02" title="Founder Review is coming next">A0 defines durable decision truth. It does not ask you to rate anything, and it does not pretend the A1 workflow already exists.</SurfaceHeader>
    <section className={styles.reviewLock}>
      <div className={styles.reviewGhost} aria-hidden="true"><span>LOVE</span><span>LIKE</span><span>MAYBE</span><span>NOT ME</span></div>
      <div><span>COMING NEXT · A1</span><h2>331 Review Mode</h2><p>Large visual, keyboard decisions, notes, trait evidence, refinement flags, progress, revisit, immutable provenance and governed persistence.</p><dl><div><dt>Exact prior decisions ready to import</dt><dd>{capabilities.exactImportedPreferenceCandidates}</dd></div><div><dt>Browser localStorage authority</dt><dd>false</dd></div><div><dt>Speculative child mappings</dt><dd>forbidden</dd></div></dl></div>
    </section>
  </div>;
}

function ComponentsView({ capabilities }: { capabilities: CapabilityState }) {
  return <div data-testid="components-view">
    <SurfaceHeader number="03" title="Component grammar, before components">A2 will bridge approved CVA lineage to accessible, responsive code. A0 supplies the contract and refuses substitutions.</SurfaceHeader>
    <section className={styles.componentGap}>
      <div><span>RECONSTRUCTED COMPONENTS</span><strong>{capabilities.reconstructedComponentCount}</strong></div>
      <div><code>BRAND_COMPONENT_GAP</code><p>No compatible reconstructed grammar exists yet. Legacy families are not available as fallback.</p></div>
    </section>
    <ul className={styles.grammarList}>
      <li><strong>Lineage</strong><span>Source CVAs, exact decision IDs and provenance</span></li>
      <li><strong>Adaptive anatomy</strong><span>Slots, surfaces, proportions, layers, overlap, geometry and waves</span></li>
      <li><strong>Brand participation</strong><span>Colour roles, typography, rhythm and Anti-DNA constraints</span></li>
      <li><strong>Responsive truth</strong><span>Independent transformations at 1440 / 1024 / 768 / 390</span></li>
      <li><strong>Obligations</strong><span>Accessibility, reduced motion, content shapes and incompatibilities</span></li>
    </ul>
  </div>;
}

function PagesView() {
  const [viewport, setViewport] = useState<Viewport>("1440");
  return <div data-testid="pages-view">
    <SurfaceHeader number="04" title="Responsive preview foundation">This frame proves the recovery route can be inspected at the governed viewports. It is not a designed Champagne page.</SurfaceHeader>
    <div className={styles.viewportControls} role="group" aria-label="Responsive preview viewport">
      {VIEWPORTS.map((value) => <button key={value} type="button" aria-pressed={viewport === value} onClick={() => setViewport(value)}>{value}</button>)}
    </div>
    <div className={styles.previewStage}>
      <div className={styles.previewFrame} data-viewport={viewport} data-testid="responsive-frame">
        <header><span>ATELIER RECOVERY CONTRACT</span><strong>{viewport}px</strong></header>
        <main><p>PAGE COMPOSITION</p><h2>Not authorised in A0.</h2><p>The future canvas will receive governed content, approved component grammars and explicit responsive transformations.</p><div><span>Hero boundary</span><strong>untouched</strong><span>Production binding</span><strong>false</strong><span>Fallback</span><strong>BRAND_COMPONENT_GAP</strong></div></main>
      </div>
    </div>
  </div>;
}

function BrandView({ brand }: { brand: BrandSummary }) {
  return <div data-testid="brand-view">
    <SurfaceHeader number="05" title="One canonical Brand authority">This is the settled structured evidence—not a browser-local taste counter and not a simplified luxury slogan.</SurfaceHeader>
    <section className={styles.brandHero}>
      <span>{brand.id}</span><h2>{brand.essence}</h2><p>{brand.colours.rule}</p>
      <div className={styles.swatches}><i data-colour="magenta" /><i data-colour="turquoise" /><i data-colour="gold" /></div>
    </section>
    <div className={styles.brandColumns}>
      <section><h3>Approved composition evidence</h3><ul>{brand.approvedSectionSystems.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h3>Anti-DNA is active</h3><ul>{brand.antiDna.slice(0, 8).map((item) => <li key={item}>{item}</li>)}</ul></section>
      <section><h3>Bounded domain gaps</h3><dl>{Object.entries(brand.domains).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></section>
    </div>
  </div>;
}
