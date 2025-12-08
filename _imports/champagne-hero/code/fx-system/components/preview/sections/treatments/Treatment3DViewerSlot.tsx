import type { ReactNode } from "react";

export type Treatment3DViewerSlotProps = {
  treatmentName: string;
  slug: string;
  description?: ReactNode;
};

export default function Treatment3DViewerSlot({ treatmentName, slug, description }: Treatment3DViewerSlotProps) {
  return (
    <section className="cpv-card" aria-labelledby={`${slug}-viewer-heading`}>
      <div className="cpv-card__inner cpv-card__inner--stack">
        <div className="cpv-card__header">
          <p className="cpv-card__eyebrow text-eyebrow">3D Preview</p>
          <div className="cpv-card__heading">
            <h2 className="cpv-card__title text-display-sm" id={`${slug}-viewer-heading`}>
              See your {treatmentName.toLowerCase()} in 3D (coming soon)
            </h2>
            <p className="cpv-card__lead text-lead text-body">
              {description ??
                "Reserved space for the interactive 3D viewer. Keep the Champagne gradients and glass shell while we slot in WebGL assets later."}
            </p>
          </div>
        </div>
        <div
          className="cpv-slot cpv-slot--viewer"
          aria-label={`${treatmentName} 3D viewer placeholder`}
          role="img"
        >
          <div className="cpv-slot__inner">
            <p className="text-lead">3D viewer placeholder</p>
            <p className="text-body">Static shell only — ready for prefers-reduced-motion users.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
