import React from 'react';

import SectionFrame from './SectionFrame';

type SectionProps = {
  route: string;
};

export default function ThreeDViewer({ route }: SectionProps) {
  return (
    <SectionFrame
      description="Full 3D viewer stub for individual treatments with manifest-aligned asset references."
      id="3d-viewer"
      kicker={'<ThreeDViewer model="/3d/{slug}.glb" poster="/brand/posters/{slug}.webp" />'}
      route={route}
      title="3D viewer"
    >
      <div className="tl-viewer tl-viewer--full">
        <div aria-hidden="true" className="tl-viewer__poster" role="presentation">
          <span className="tl-viewer__badge">Model</span>
          <span className="tl-viewer__filename">/3d/{'{slug}'}.glb</span>
        </div>
        <div className="tl-viewer__copy">
          <h3 className="tl-viewer__title">Orbit and inspect</h3>
          <p className="tl-viewer__body">
            Swap the slug placeholders with the correct GLB and poster assets when finalised. Motion guards rely on
            prefers-reduced-motion tokens for accessibility.
          </p>
          <ul className="tl-viewer__meta">
            <li>
              <span className="tl-chip">Poster: /brand/posters/{'{slug}'}.webp</span>
            </li>
            <li>
              <span className="tl-chip">Tracking: model.interact</span>
            </li>
          </ul>
        </div>
      </div>
    </SectionFrame>
  );
}
