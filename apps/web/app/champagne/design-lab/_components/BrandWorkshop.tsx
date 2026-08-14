"use client";

import {
  ACCENTS,
  BRAND_TERRITORIES,
  RHYTHM_DIRECTIONS,
  TYPOGRAPHY_DIRECTIONS,
  type BrandDecision,
  type BrandTerritoryId,
} from "../data/atelier-convergence";

type BrandWorkshopProps = {
  decision: BrandDecision;
  onChange: (decision: BrandDecision) => void;
  onClose: () => void;
  onOpenPage: () => void;
};

export function BrandWorkshop({ decision, onChange, onClose, onOpenPage }: BrandWorkshopProps) {
  const territory = BRAND_TERRITORIES.find((item) => item.id === decision.territory) ?? BRAND_TERRITORIES[0];
  const update = <K extends keyof BrandDecision>(key: K, value: BrandDecision[K]) => onChange({ ...decision, [key]: value });

  return <main className={`dl43-brand dl43-territory-${decision.territory}`}>
    <header className="dl43-brand-header">
      <button onClick={onClose}>← Atelier home</button>
      <div><strong>Champagne Brand Workshop</strong><span>Working direction · never production binding</span></div>
      <button className="dl43-brand-page" onClick={onOpenPage}>Apply to page canvas →</button>
    </header>

    <section className="dl43-brand-intro">
      <div><span>Founder-guided brand development</span><h1>Shape how Champagne should feel.</h1></div>
      <p>Choose a territory, then tune its voice through colour, typography and rhythm. These are coherent starting worlds—not four coats of paint on the same room.</p>
    </section>

    <nav className="dl43-brand-steps" aria-label="Brand workshop areas">
      <a href="#territories">01 Territory</a><a href="#dna">02 Brand DNA</a><a href="#accents">03 Accent</a><a href="#type">04 Typography</a><a href="#rhythm">05 Rhythm</a>
    </nav>

    <section id="territories" className="dl43-territories">
      <header><span>Choose the world</span><h2>Four genuinely different directions</h2><p>You can change this freely. Nothing here overwrites the canonical Hero or live website.</p></header>
      <div>{BRAND_TERRITORIES.map((item, index) => <button key={item.id} aria-pressed={decision.territory === item.id} onClick={() => update("territory", item.id as BrandTerritoryId)}><span>0{index + 1}</span><div className="dl43-territory-art" aria-hidden="true"><i /><i /><i /></div><h3>{item.name}</h3><p>{item.description}</p><small>{item.character}</small></button>)}</div>
    </section>

    <section id="dna" className="dl43-dna">
      <div className="dl43-dna-stage"><span>Current working world</span><h2>{territory.name}</h2><p>{territory.description}</p><blockquote>“{territory.character}”</blockquote></div>
      <div className="dl43-dna-signals"><span>Brand DNA</span>{territory.signals.map((signal, index) => <div key={signal}><strong>0{index + 1}</strong><p>{signal}</p></div>)}<label>Founder note<textarea value={decision.note} onChange={(event) => update("note", event.target.value)} placeholder="What feels right—or still feels missing?" /></label></div>
    </section>

    <section id="accents" className="dl43-choice-studio"><header><span>Accent Studio</span><h2>Give colour a job.</h2><p>Accents communicate focus and meaning. They are not confetti.</p></header><div>{ACCENTS.map((item) => <button key={item.id} aria-pressed={decision.accent === item.id} onClick={() => update("accent", item.id)}><i data-accent={item.id} /><strong>{item.name}</strong><span>{item.job}</span></button>)}</div></section>

    <section id="type" className="dl43-choice-studio dl43-type-studio"><header><span>Typography Studio</span><h2>Choose the speaking voice.</h2><p>The final font files can change later; the hierarchy and character decision remain useful.</p></header><div>{TYPOGRAPHY_DIRECTIONS.map((item) => <button key={item.id} aria-pressed={decision.typography === item.id} onClick={() => update("typography", item.id)}><span className="dl43-type-sample">Aa</span><strong>{item.name}</strong><span>{item.display}<br />{item.body}</span><small>{item.feeling}</small></button>)}</div></section>

    <section id="rhythm" className="dl43-choice-studio dl43-rhythm-studio"><header><span>Rhythm Studio</span><h2>Decide how the page breathes.</h2></header><div>{RHYTHM_DIRECTIONS.map((item) => <button key={item.id} aria-pressed={decision.rhythm === item.id} onClick={() => update("rhythm", item.id)}><div className="dl43-rhythm-bars" aria-hidden="true"><i /><i /><i /><i /></div><strong>{item.name}</strong><span>{item.description}</span></button>)}</div></section>

    <footer className="dl43-brand-summary"><div><span>Working Brand DNA</span><strong>{territory.name}</strong><p>{decision.accent} · {decision.typography} · {decision.rhythm}</p></div><button onClick={onOpenPage}>Continue into the Homepage Atelier →</button></footer>
  </main>;
}
