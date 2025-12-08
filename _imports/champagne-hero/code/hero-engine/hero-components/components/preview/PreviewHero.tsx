import type { ReactNode } from "react";
import Link from "next/link";

import ChampagneHero from "@/components/home/ChampagneHero";

type PreviewHeroCta = {
  label: string;
  href: string;
};

type PreviewHeroProps = {
  eyebrow?: string;
  kicker?: string;
  title: string;
  description?: ReactNode;
  primaryCta?: PreviewHeroCta;
  secondaryCta?: PreviewHeroCta;
  devAccessory?: ReactNode;
  treatment?: string;
};

export default function PreviewHero({
  eyebrow,
  kicker,
  title,
  description,
  primaryCta,
  secondaryCta,
  devAccessory,
  treatment,
}: PreviewHeroProps) {
  const descriptionContent =
    typeof description === "string" ? <p>{description}</p> : description ?? null;

  return (
    <section className="preview-hero" data-treatment={treatment}>
      <ChampagneHero />

      <div className="preview-hero__content">
        <div className="container">
          <div className="cpv-hero__inner">
            <div className="cpv-hero__content">
              <div className="cpv-glass cpv-hero__card">
                <div className="flex flex-col gap-6">
                  {eyebrow || kicker ? (
                    <span className="cpv-hero__kicker text-eyebrow">{eyebrow ?? kicker}</span>
                  ) : null}
                  <div className="space-y-4">
                    <h1 className="cpv-hero__title text-display-xl">{title}</h1>
                    {descriptionContent ? (
                      <div className="cpv-hero__body text-lead text-body">
                        {descriptionContent}
                      </div>
                    ) : null}
                  </div>
                  {primaryCta || secondaryCta ? (
                    <div className="cpv-cta-row">
                      {primaryCta ? (
                        <Link className="cpv-btn cpv-btn-solid text-eyebrow" href={primaryCta.href}>
                          {primaryCta.label}
                        </Link>
                      ) : null}
                      {secondaryCta ? (
                        <Link className="cpv-btn cpv-btn-outline text-eyebrow" href={secondaryCta.href}>
                          {secondaryCta.label}
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                  {devAccessory ? <div className="cpv-hero__utility">{devAccessory}</div> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
