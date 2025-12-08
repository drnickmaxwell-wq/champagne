import type { ReactNode } from 'react';

export type PreviewHeroBadge = {
  label: string;
  tone?: 'alert' | 'muted';
};

export type PreviewHeroProps = {
  title?: string;
  description?: string;
  missingCopy?: boolean;
  eyebrow?: ReactNode;
  badges?: PreviewHeroBadge[];
};

export default function PreviewHero({
  title,
  description,
  missingCopy = false,
  eyebrow = 'Treatments preview surface',
  badges = [],
}: PreviewHeroProps) {
  const summaryClass = missingCopy ? 'tp-hero__summary tp-hero__summary--placeholder' : 'tp-hero__summary';

  return (
    <section className="tp-hero" aria-labelledby="tp-hero-title">
      <div aria-hidden className="tp-hero__veil" />
      <div aria-hidden className="tp-hero__grain" />
      <div className="tp-hero__content">
        <p className="tp-hero__eyebrow">{eyebrow}</p>
        <h1 className="tp-hero__title" id="tp-hero-title">
          {title ?? 'Awaiting Service title'}
        </h1>
        <p className={summaryClass}>
          {description ?? 'Service description not provided in schema pack yet. Replace once Service.description is wired.'}
        </p>
        <div className="tp-hero__actions" aria-hidden>
          <span className="tp-hero__cta tp-hero__cta--primary">Primary CTA</span>
          <span className="tp-hero__cta tp-hero__cta--ghost">Secondary CTA</span>
        </div>
        {badges.length > 0 ? (
          <div className="tp-hero__badges" role="status">
            {badges.map((badge) => (
              <span
                key={`${badge.label}-${badge.tone ?? 'muted'}`}
                className={`tp-chip ${badge.tone === 'alert' ? 'tp-chip--alert' : 'tp-chip--muted'}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
