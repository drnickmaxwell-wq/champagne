import type { ReactNode } from "react";

import PreviewHero from "@/components/preview/PreviewHero";

export type PreviewTreatmentsHeroProps = {
  title?: string;
  description?: ReactNode;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default function PreviewTreatmentsHero({
  title = "Find the right treatment for your smile",
  description,
  primaryCta,
  secondaryCta,
}: PreviewTreatmentsHeroProps) {
  return (
    <PreviewHero
      treatment="cosmetic"
      eyebrow="Treatments hub preview"
      title={title}
      description={
        description ?? (
          <p>
            Calm, transparent guidance across veneers, implants, orthodontics and everyday dentistry. Explore each pathway,
            preview pricing, and book the next step when you are ready.
          </p>
        )
      }
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
    />
  );
}
