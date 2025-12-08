import React, { ReactNode } from 'react';

export type SectionFrameProps = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
  route: string;
};

export default function SectionFrame({ id, kicker, title, description, children, route }: SectionFrameProps) {
  return (
    <section aria-labelledby={`${id}-title`} className="tl-section" data-section-id={id} id={id}>
      <div className="tl-section__layers" aria-hidden="true">
        <div className="tl-layer tl-layer--gradient" />
        <div className="tl-layer tl-layer--wave" />
        <div className="tl-layer tl-layer--particles" />
        <div className="tl-layer tl-layer--grain" />
        <div className="tl-layer tl-layer--glass" />
      </div>
      <div className="tl-section__content">
        <p className="tl-section__kicker" data-component={kicker}>
          <span className="tl-kicker-label">Component</span>
          <span className="tl-kicker-value">{kicker}</span>
        </p>
        <div className="tl-section__heading">
          <h2 className="tl-title" id={`${id}-title`}>
            {title}
          </h2>
          <p className="tl-description">{description}</p>
        </div>
        <div className="tl-section__route" role="note">
          <span className="tl-route-label">Route</span>
          <span className="tl-route-value">{route}</span>
        </div>
        <div className="tl-section__body">{children}</div>
      </div>
    </section>
  );
}
