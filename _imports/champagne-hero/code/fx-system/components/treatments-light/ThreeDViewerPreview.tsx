import React from 'react';

import SectionFrame from './SectionFrame';

type SectionProps = {
  route: string;
};

export default function ThreeDViewerPreview({ route }: SectionProps) {
  return (
    <SectionFrame
      description="Placeholder 3D viewer call-to-action referencing manifest poster assets and preview model names."
      id="3d-viewer-preview"
      kicker={'<ThreeDViewer mode="preview" model="treatments-showcase.glb" poster="/brand/posters/treatments.webp" />'}
      route={route}
      title="3D viewer preview"
    >
      <div className="tl-viewer">
        <div aria-hidden="true" className="tl-viewer__poster" role="presentation">
          <span className="tl-viewer__badge">Poster</span>
          <span className="tl-viewer__filename">treatments-showcase.glb</span>
        </div>
        <div className="tl-viewer__copy">
          <h3 className="tl-viewer__title">Interactive smile preview</h3>
          <p className="tl-viewer__body">
            Drop final GLB files and AVIF posters here. Motion limits honour prefers-reduced-motion so patients can explore
            comfortably.
          </p>
          <ul className="tl-viewer__meta">
            <li>
              <span className="tl-chip">Mode: preview</span>
            </li>
            <li>
              <span className="tl-chip">Poster: /brand/posters/treatments.webp</span>
            </li>
          </ul>
        </div>
      </div>
    </SectionFrame>
  );
}
