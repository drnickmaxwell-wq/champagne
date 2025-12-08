import React from 'react';

import SectionFrame from './SectionFrame';

type SectionProps = {
  route: string;
};

const VALUE_ITEMS = [
  {
    heading: 'Cosmetic artistry',
    body: 'Lorum-crafted smile design pathways ready for tone-of-voice refinements and photography swaps.',
  },
  {
    heading: 'Implant precision',
    body: 'Placeholder copy for guided surgery messaging with transparent finance cues and comfort guards.',
  },
  {
    heading: 'Orthodontic clarity',
    body: 'Stub content for aligner journeys, retention notes, and lifestyle positioning cues.',
  },
  {
    heading: 'Advanced tech suite',
    body: 'Space for CBCT, smile design software, and on-site lab capabilities written in luxury cadence.',
  },
];

export default function ValueGrid({ route }: SectionProps) {
  return (
    <SectionFrame
      description="Tokenised four-up grid highlighting value pillars with safe placeholder messaging."
      id="value-grid"
      kicker={'<ValueGrid tokens="smh" />'}
      route={route}
      title="Value grid"
    >
      <div className="tl-grid">
        {VALUE_ITEMS.map((item) => (
          <article className="tl-grid__item tl-tilt" key={item.heading}>
            <h3 className="tl-grid__title">{item.heading}</h3>
            <p className="tl-grid__body">{item.body}</p>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
