import type { SemanticSection } from "../data/contracts";

export function SectionSpecimen({ section, visualId }: { section: SemanticSection; visualId: string }) {
  const isThreeD = section.modelId === "CD3D-IMPLANT-EDU-V1";
  return (
    <section
      id={section.id}
      className="dl-section"
      data-material={section.material}
      data-semantic-id={section.id}
    >
      <p className="dl-kicker">{section.id}</p>
      <h2>{section.title}</h2>
      <figure className="dl-section-visual"><img src={`/assets/champagne/design-lab/v27/${visualId}.png`} alt={`V27 visual direction for ${section.title}`} /><figcaption>{visualId} · visual evidence, not production binding</figcaption></figure>
      <p className="dl-section-truth">{section.fallback}</p>
      {section.mediaId ? (
        <div className="dl-absence" role="note" aria-label={`${section.mediaId} availability`}>
          <strong>{section.mediaId}</strong>
          <span>SOURCE_PREVIEW_UNAVAILABLE</span>
        </div>
      ) : null}
      {isThreeD ? (
        <figure className="dl-diagram" aria-labelledby={`${section.id}-caption`}>
          <div aria-hidden="true" className="dl-implant-diagram"><span /><span /><span /></div>
          <figcaption id={`${section.id}-caption`}>
            CD3D-IMPLANT-EDU-V1 is OFF. Static broad-stage educational transcript shown.
          </figcaption>
        </figure>
      ) : null}
      <details>
        <summary>Evidence and typed actions</summary>
        <p>Visual evidence shown above; genuine practice media remains capability-gated.</p>
        <ul>{section.evidenceIds.map((id) => <li key={id}>{id}</li>)}</ul>
        <ul>{section.actions.map((action) => <li key={action}><code>{action}</code></li>)}</ul>
      </details>
    </section>
  );
}
