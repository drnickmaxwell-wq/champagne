import type { ReactNode } from 'react';
import { ChampagneCTA } from '../cta/ChampagneCTA';
import { layers } from '../../lib/champagne/layers';
import '../../styles/champagne/hero-skeleton.css';

export type TimeOfDay = 'dawn' | 'dusk' | 'night';

export interface ChampagneHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  badge?: string;
  timeOfDay?: TimeOfDay;
  showWave?: boolean;
  showParticles?: boolean;
  showGrain?: boolean;
  aside?: ReactNode;
}

export function ChampagneHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  badge,
  showWave = true,
  showParticles = false,
  showGrain = false,
  aside,
}: ChampagneHeroProps) {
  return (
    <section className="hero-root space-section" aria-labelledby="champagne-hero-title">
      <div className="hero-layers" aria-hidden>
        <div className="hero-layer gradient champagne-gradient" />
        {showWave ? <div className={`hero-layer wave ${layers.wave}`} /> : null}
        {showParticles ? <div className={`hero-layer particles ${layers.particles}`} /> : null}
        {showGrain ? <div className={`hero-layer grain ${layers.grain}`} /> : null}
      </div>
      <div className="hero-shell glass-soft">
        <div className="hero-content">
          {eyebrow ? <p className="hero-eyebrow text-eyebrow">{eyebrow}</p> : null}
          <h1 className="hero-title text-hero" id="champagne-hero-title">
            {title}
          </h1>
          {badge ? <span className="hero-badge text-body">{badge}</span> : null}
          {subtitle ? <p className="hero-subtitle text-lead">{subtitle}</p> : null}
          <div className="hero-actions">
            {primaryCta || secondaryCta ? (
              <ChampagneCTA
                variant={primaryCta && secondaryCta ? 'pair' : primaryCta ? 'primary' : 'secondary'}
                primaryLabel={primaryCta?.label}
                primaryHref={primaryCta?.href}
                secondaryLabel={secondaryCta?.label}
                secondaryHref={secondaryCta?.href}
              />
            ) : null}
          </div>
        </div>
        {aside ? <div className="hero-content">{aside}</div> : null}
      </div>
    </section>
  );
}
