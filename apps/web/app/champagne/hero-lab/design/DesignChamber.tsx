"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import candidates from "./persian-materials.json";
import styles from "./design-lab.module.css";

type Candidate = (typeof candidates)[number];
type LabStyle = CSSProperties & Record<`--${string}`, string>;

const LAB_ROOMS = [
  ["cta-foundry", "CTA foundry"],
  ["cards-panels", "Cards and panels"],
  ["section-families", "Section families"],
  ["closing-bands", "Closing bands"],
  ["footer-studio", "Footer studio"],
  ["header-studio", "Header studio"],
  ["concierge-interface", "Concierge interface"],
  ["media-placement", "Media placement"],
  ["page-assembler", "Page chapter assembler"],
] as const;

function displayValue(value: string): string {
  return value.startsWith("#") ? value.toUpperCase() : "Current semantic value";
}

export function DesignChamber({ hero }: { hero: ReactNode }) {
  const [selectedId, setSelectedId] = useState<Candidate["id"]>(candidates[0].id);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [instanceId, setInstanceId] = useState("waiting for Hero V2");
  const [instanceChanges, setInstanceChanges] = useState(0);
  const labRef = useRef<HTMLDivElement>(null);
  const firstInstance = useRef<string | null>(null);

  const selected = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0],
    [selectedId],
  );

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
      const instance = root.querySelector<HTMLElement>("[data-v2-stack-instance]")?.dataset.v2StackInstance;
      if (!instance) return;
      setInstanceId(instance);
      if (firstInstance.current === null) firstInstance.current = instance;
      else if (firstInstance.current !== instance) setInstanceChanges((count) => count + 1);
    };

    inspect();
    const observer = new MutationObserver(inspect);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={labRef}
      className={styles.lab}
      style={labStyle}
      data-champagne-design-lab="true"
      data-production-binding="false"
      data-selected-candidate={selected.id}
      data-reduced-motion={reducedMotion ? "true" : "false"}
    >
      <header className={styles.labHeader}>
        <div>
          <p className={styles.eyebrow}>Internal laboratory · production isolated</p>
          <h1>Champagne Design Laboratory</h1>
          <p>
            Compare candidate materials around the genuine Hero V2. Laboratory choices do not update production tokens,
            manifests or pages.
          </p>
        </div>
        <div className={styles.status} aria-label="Laboratory status">
          <span>Founder state: unselected</span>
          <span>Production binding: off</span>
          <span>Hero remounts: {instanceChanges}</span>
        </div>
      </header>

      <nav className={styles.roomNav} aria-label="Design laboratory rooms">
        <a href="#token-chamber-heading">01 · Tokens</a>
        {LAB_ROOMS.map(([id, label], index) => (
          <a key={id} href={`#${id}`}>{String(index + 2).padStart(2, "0")} · {label}</a>
        ))}
      </nav>

      <section className={styles.controls} aria-labelledby="token-chamber-heading">
        <div>
          <p className={styles.roomNumber}>Room 01</p>
          <h2 id="token-chamber-heading">Persian Midnight Token Chamber</h2>
          <p>Change one laboratory semantic system at a time. Hero V2 must keep the same instance.</p>
        </div>

        <fieldset className={styles.candidateGrid}>
          <legend className={styles.srOnly}>Persian Midnight candidates</legend>
          {candidates.map((candidate) => (
            <button
              type="button"
              key={candidate.id}
              className={styles.candidate}
              aria-pressed={selected.id === candidate.id}
              onClick={() => setSelectedId(candidate.id)}
            >
              <span className={styles.swatch} style={{ background: candidate.canvas }} aria-hidden="true" />
              <span>
                <strong>{candidate.label}</strong>
                <small>{displayValue(candidate.canvas)}</small>
              </span>
            </button>
          ))}
        </fieldset>

        <label className={styles.motionControl}>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
          />
          <span>Laboratory reduced-motion presentation</span>
        </label>
      </section>

      <section className={styles.heroRoom} aria-labelledby="hero-room-heading">
        <div className={styles.roomHeading}>
          <div>
            <p className={styles.roomNumber}>Sacred preview</p>
            <h2 id="hero-room-heading">Genuine Hero V2</h2>
          </div>
          <dl className={styles.diagnostics}>
            <div><dt>Candidate</dt><dd>{selected.label}</dd></div>
            <div><dt>Canvas</dt><dd>{displayValue(selected.canvas)}</dd></div>
            <div><dt>Hero instance</dt><dd>{instanceId}</dd></div>
          </dl>
        </div>
        <div className={styles.heroFrame}>{hero}</div>
      </section>

      <section className={styles.systemPreview} aria-labelledby="system-preview-heading">
        <div className={styles.roomHeading}>
          <div>
            <p className={styles.roomNumber}>System proof</p>
            <h2 id="system-preview-heading">The same candidate across Champagne</h2>
          </div>
        </div>

        <div className={styles.porcelainBand} data-surface="porcelain">
          <div>
            <p className={styles.roomNumber}>Porcelain transition</p>
            <h3>Care that is considered, transparent and personal.</h3>
            <p>Use this reading surface to judge the transition out of Persian—not merely the colour in isolation.</p>
          </div>
          <div className={styles.promiseRail} aria-label="Care promises">
            <span>We listen first</span><span>Plans you understand</span><span>Care you can trust</span>
          </div>
        </div>

        <div className={styles.cardRail}>
          <article><span>01</span><h3>Clinical evidence</h3><p>Measured information, presented calmly.</p><a href="#closing-proof">Review evidence</a></article>
          <article><span>02</span><h3>Your treatment path</h3><p>Clear stages without pressure or noise.</p><a href="#closing-proof">Explore the pathway</a></article>
          <article><span>03</span><h3>Questions welcomed</h3><p>Ask before deciding. Continue at your pace.</p><a href="#closing-proof">Ask the practice</a></article>
        </div>

        <div id="closing-proof" className={styles.closingBand}>
          <div><p className={styles.roomNumber}>Architectural closing proof</p><h3>Ready to talk through your options?</h3><p>A calm next step, with no automatic commitment.</p></div>
          <div className={styles.actions}><button type="button">Book a consultation</button><a href="#token-chamber-heading">Compare another colour</a></div>
        </div>

        <footer className={styles.footerProof}>
          <div><strong>St Mary’s House Dental Care</strong><span>Shoreham-by-Sea</span></div>
          <nav aria-label="Laboratory footer"><a href="#token-chamber-heading">Treatments</a><a href="#token-chamber-heading">Your visit</a><a href="#token-chamber-heading">About</a><a href="#token-chamber-heading">Contact</a></nav>
          <span className={styles.footerNote}>Layered footer emotion · laboratory proof</span>
        </footer>
      </section>

      <section className={styles.room} id="cta-foundry" aria-labelledby="cta-heading">
        <RoomHeading number="02" title="CTA foundry" id="cta-heading" />
        <p className={styles.roomIntro}>Four brand-faithful action treatments shown together. They are candidates, not approvals.</p>
        <div className={styles.ctaFoundry}>
          <button type="button" className={styles.ctaPrimary}>Book a consultation</button>
          <button type="button" className={styles.ctaArchitectural}><span>Explore your options</span><b aria-hidden="true">→</b></button>
          <button type="button" className={styles.ctaOutline}>Ask a question</button>
          <a className={styles.ctaText} href="#page-assembler">See how treatment works <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className={styles.room} id="cards-panels" aria-labelledby="cards-heading">
        <RoomHeading number="03" title="Cards and decision panels" id="cards-heading" />
        <div className={styles.panelGallery}>
          <article className={styles.editorialCard}><span>01</span><h3>Understand the possibilities</h3><p>Editorial card with a quiet gold axis and generous reading space.</p></article>
          <article className={styles.factCard}><small>At a glance</small><strong>One considered plan</strong><dl><div><dt>Consultation</dt><dd>Unhurried</dd></div><div><dt>Options</dt><dd>Explained clearly</dd></div></dl></article>
          <article className={styles.decisionCard}><small>Is this right for me?</small><h3>Make the decision with evidence—not pressure.</h3><a href="#concierge-interface">Talk it through</a></article>
        </div>
      </section>

      <section className={styles.room} id="section-families" aria-labelledby="sections-heading">
        <RoomHeading number="04" title="Section families" id="sections-heading" />
        <div className={styles.sectionStack}>
          <article className={styles.porcelainChapter}><div><small>Editorial chapter</small><h3>Designed around the person, not simply the procedure.</h3></div><p>Long-form reading surface for expertise, trust and search-led answers.</p></article>
          <article className={styles.inkChapter}><div><small>Evidence chapter</small><h3>Clinical precision, made understandable.</h3></div><div className={styles.metricRow}><span><b>01</b> Listen</span><span><b>02</b> Plan</span><span><b>03</b> Review</span></div></article>
          <article className={styles.splitChapter}><div className={styles.authorisedMedia}>Authorised St Mary’s House media only</div><div><small>Place and provenance</small><h3>A familiar house for thoughtful dentistry.</h3><p>This frame deliberately refuses substitute architecture.</p></div></article>
        </div>
      </section>

      <section className={styles.room} id="closing-bands" aria-labelledby="closing-heading">
        <RoomHeading number="05" title="Architectural closing bands" id="closing-heading" />
        <div className={styles.closingGallery}>
          <article className={styles.closingAxis}><div><small>Quiet close</small><h3>Take the next step when you are ready.</h3></div><button type="button">Arrange a conversation</button></article>
          <article className={styles.closingPortal}><span aria-hidden="true">SMH</span><div><small>Guided close</small><h3>Not sure where to begin?</h3><p>Captain Companion can help you find the most useful starting point.</p></div><button type="button">Guide me</button></article>
        </div>
      </section>

      <section className={styles.room} id="footer-studio" aria-labelledby="footer-heading">
        <RoomHeading number="06" title="Layered footer studio" id="footer-heading" />
        <footer className={styles.fullFooterProof}>
          <div className={styles.footerPromise}><small>St Mary’s House Dental Care</small><h3>Thoughtful dentistry in Shoreham-by-Sea.</h3></div>
          <div className={styles.footerColumns}><div><b>Explore</b><a href="#section-families">Treatments</a><a href="#page-assembler">Your visit</a></div><div><b>Practice</b><a href="#media-placement">Our house</a><a href="#concierge-interface">Contact</a></div><div><b>Reassurance</b><span>No-pressure conversations</span><span>Clear treatment choices</span></div></div>
          <div className={styles.footerBase}><span>BN43 · Shoreham-by-Sea</span><span>Gold keyline · Persian atmosphere · restrained magenta glow</span></div>
        </footer>
      </section>

      <section className={styles.room} id="header-studio" aria-labelledby="header-heading">
        <RoomHeading number="07" title="Header studio" id="header-heading" />
        <div className={styles.headerProof}><div className={styles.wordmark}>St Mary’s House <span>Dental Care</span></div><nav aria-label="Header proof"><a href="#section-families">Treatments</a><a href="#media-placement">The practice</a><a href="#concierge-interface">Contact</a></nav><button type="button">Book</button></div>
      </section>

      <section className={styles.room} id="concierge-interface" aria-labelledby="concierge-heading">
        <RoomHeading number="08" title="Captain Companion interface" id="concierge-heading" />
        <div className={styles.conciergeProof}><div className={styles.companionMark}>C</div><div><small>Your calm guide</small><h3>What would make your visit feel easier?</h3><div className={styles.promptChips}><button type="button">I feel nervous</button><button type="button">I need options explained</button><button type="button">I have a dental emergency</button></div></div></div>
      </section>

      <section className={styles.room} id="media-placement" aria-labelledby="media-heading">
        <RoomHeading number="09" title="Media placement planner" id="media-heading" />
        <div className={styles.mediaGrid}><div className={styles.mediaWide}><span>16:9</span><strong>Founder-authorised St Mary’s House establishing view</strong></div><div className={styles.mediaPortrait}><span>4:5</span><strong>Real team or treatment craft</strong></div><div className={styles.mediaDetail}><span>1:1</span><strong>Architectural or clinical detail</strong></div></div>
        <p className={styles.mediaRule}>No stock building, substitute facade or invented St Mary’s House silhouette may enter these frames.</p>
      </section>

      <section className={styles.room} id="page-assembler" aria-labelledby="assembler-heading">
        <RoomHeading number="10" title="Manifest-driven page chapter assembler" id="assembler-heading" />
        <div className={styles.assembler}><div className={styles.chapterList}><span>01 · Header</span><span>02 · Genuine Hero V2</span><span>03 · Answer-first introduction</span><span>04 · Trust and evidence</span><span>05 · Treatment pathway</span><span>06 · Decision support</span><span>07 · Questions answered</span><span>08 · Architectural close</span><span>09 · Layered footer</span></div><div><small>Laboratory principle</small><h3>Design the reusable chapters here. Choose page order only after the page-by-page SEO and AI-search audit.</h3><p>No laboratory ordering is written to production manifests.</p></div></div>
      </section>
    </main>
  );
}

function RoomHeading({ number, title, id }: { number: string; title: string; id: string }) {
  return <div className={styles.roomHeading}><div><p className={styles.roomNumber}>Room {number} · founder choice pending</p><h2 id={id}>{title}</h2></div><span className={styles.unselected}>Unselected</span></div>;
}
