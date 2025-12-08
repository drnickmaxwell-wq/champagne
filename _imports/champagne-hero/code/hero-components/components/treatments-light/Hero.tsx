import React from 'react';

import SectionFrame from './SectionFrame';

type SectionProps = {
  route: string;
};

export default function Hero({ route }: SectionProps) {
  return (
    <SectionFrame
      description="Gradient hero scaffold for hub storytelling, layered with safe placeholder copy and CTAs."
      id="hero"
      kicker={'<TreatmentHero variant="hub" />'}
      route={route}
      title="Treatment hero"
    >
      <div className="tl-hero">
        <p className="tl-hero__eyebrow">Our Treatments</p>
        <h1 className="tl-hero__headline">Luxury care, thoughtfully staged</h1>
        <p className="tl-hero__lede">
          This sandbox mirrors the hub hero layout so we can refine tone, photography direction, and CTA mix without touching
          production experiences.
        </p>
        <div className="tl-hero__actions">
          <a className="tl-button tl-button--primary" href="#book" role="button">
            Book consultation
          </a>
          <a className="tl-button tl-button--ghost" href="#virtual" role="button">
            Explore e-consult
          </a>
        </div>
      </div>
    </SectionFrame>
  );
}
