"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import architecturalClosingConcept from "../assets/st-marys-architectural-closing-concept-v1.png";
import type { BrandDecision } from "../data/atelier-convergence";
import type { AtelierContentSection, AtelierPageKey } from "../data/content-bundle-adapter";
import { TEMPORAL_SIMULATIONS, type AtelierTime } from "../data/temporal-simulation";

type ClosingPlacement = "PRE_FOOTER_CLOSING_SECTION" | "FULL_FOOTER";
type ClosingTreatment = "PERSIAN_ARCHITECTURAL" | "PORCELAIN_GALLERY" | "GILDED_BRAND_GOLD";
type PlacedSection = AtelierContentSection & { archiveId?: string };
type LabStyle = CSSProperties & Record<`--${string}`, string>;
export type ArtDirectionVariant = "a" | "b";
export type ArtDirectionSelections = Record<string, ArtDirectionVariant>;

export type AtelierPreviewState = {
  page: AtelierPageKey;
  sections: PlacedSection[];
  selected: string;
  cleanPreview: boolean;
  time: AtelierTime;
  brandDecision: BrandDecision;
  canvasStyle: LabStyle;
  closingPlacement: ClosingPlacement;
  closingTreatment: ClosingTreatment;
  artDirections: ArtDirectionSelections;
};

const assetFor = (id: string) => `/assets/champagne/design-lab/v27/${id}.png`;

export function AtelierPreviewDocument({ heroes }: { heroes: Record<AtelierPageKey, ReactNode> }) {
  const [state, setState] = useState<AtelierPreviewState | null>(null);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === "CHAMPAGNE_ATELIER_PREVIEW_STATE") setState(event.data.state as AtelierPreviewState);
    };
    window.addEventListener("message", receive);
    window.parent.postMessage({ type: "CHAMPAGNE_ATELIER_PREVIEW_READY" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  if (!state) return <main className="dl46-preview-document" data-preview-ready="false" />;
  return <main className="dl46-preview-document" data-preview-ready="true" data-production-binding="false">
    <article
      className="dl4-canvas dl45-canvas dl46-canvas dl47-canvas"
      data-preview-mode={state.cleanPreview ? "clean" : "edit"}
      data-brand-territory={state.brandDecision.territory}
      data-brand-accent={state.brandDecision.accent}
      data-brand-type={state.brandDecision.typography}
      data-brand-rhythm={state.brandDecision.rhythm}
      data-studio-time={state.time}
      data-time-canon={TEMPORAL_SIMULATIONS[state.time].canon}
      data-time-runtime={TEMPORAL_SIMULATIONS[state.time].heroRuntime}
      data-time-scope={TEMPORAL_SIMULATIONS[state.time].scope}
      style={state.canvasStyle}
    >
      {state.sections.map(item => <section key={item.id} data-semantic-id={item.id} data-content-state={item.contentState} data-tone={item.tone} data-art-direction={state.artDirections[item.id] ?? "a"} data-treatment={item.id === "home.closing-invitation" ? state.closingTreatment : undefined} className={state.selected === item.id ? "is-selected" : ""}>
        {item.locked ? heroes[state.page]
          : item.id === "home.closing-invitation" ? <ArchitecturalClosing item={item} placement={state.closingPlacement} treatment={state.closingTreatment} />
            : item.archiveId ? <figure className="dl4-placed"><img src={assetFor(item.archiveId)} alt={`${item.label} visual proposal`} /><figcaption><span>Archive proposal</span></figcaption></figure>
              : <ContentSection item={item} />}
        {state.selected === item.id && !state.cleanPreview ? <div className="dl4-selection"><strong>{item.label}</strong><span>{item.locked ? "Canonical Hero V2 · protected" : "Selected in Atelier"}</span></div> : null}
      </section>)}
    </article>
  </main>;
}

function ContentSection({ item }: { item: PlacedSection }) { return <div className={`dl4-native dl44-content dl44-${item.id.replaceAll(".", "-")}`}><span>{item.label}</span><h2>{item.title}</h2>{item.copy ? item.copy.split("\n\n").map(paragraph => <p key={paragraph}>{paragraph}</p>) : null}{item.pathways ? <div className="dl44-pathways">{item.pathways.map((pathway, index) => <a href={pathway.href} key={pathway.href}><b>{String(index + 1).padStart(2, "0")}</b><strong>{pathway.label}</strong><span>{pathway.description}</span><i>Explore →</i></a>)}</div> : null}{item.steps ? <ol className="dl44-steps">{item.steps.map((step, index) => <li key={step.label}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.label}</strong><p>{step.copy}</p></div></li>)}</ol> : null}{item.faqs ? <div className="dl44-faqs">{item.faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div> : null}<SectionGeometry id={item.id} />{item.contentMediaSlotIds?.length ? <div className="dl44-media-intent"><span>Media intention</span><strong>{item.contentMediaSlotIds[0]}</strong><small>Real asset not yet supplied · deliberate text-led fallback</small></div> : null}{item.ctas?.length ? <div className="dl44-ctas">{item.ctas.map(cta => <a key={cta.href} href={cta.href}>{cta.label}</a>)}</div> : null}{item.modelSlot ? <div className="dl4-static-fallback"><strong>Static educational fallback</strong><small>Interactive 3D remains off · transcript required</small></div> : null}</div>; }

function SectionGeometry({ id }: { id: string }) {
  if (!["home.practice.answer", "home.complex-care", "home.founder-authority", "home.team-continuity", "home.technology-purpose", "home.heritage-story", "home.visit"].includes(id)) return null;
  return <div className="dl47-geometry" aria-hidden="true"><i /><i /><i /><i /></div>;
}

function ArchitecturalClosing({ item, placement, treatment }: { item: PlacedSection; placement: ClosingPlacement; treatment: ClosingTreatment }) { return <div className="dl4-architectural" data-placement={placement} data-treatment={treatment}><img src={architecturalClosingConcept.src} alt="Fictional architectural entrance used only to preview the St Mary's House closing composition" /><div className="dl4-architectural-shade" /><div className="dl4-architectural-copy"><span>St Mary’s House · architectural closing study</span><h2>{item.title}</h2><i aria-hidden="true" /><p>{item.copy}</p><div>{item.ctas?.map(cta => <button key={cta.href}>{cta.label}</button>)}</div></div><div className="dl4-concept-label">Lab proposal · fictional architecture · not St Mary’s House · real photo required</div>{placement === "FULL_FOOTER" ? <footer className="dl4-architectural-footer"><strong>St Mary’s House Dental Care</strong><nav aria-label="Architectural footer preview"><span>Treatments</span><span>Our approach</span><span>The practice</span><span>Contact</span></nav></footer> : null}</div>; }
