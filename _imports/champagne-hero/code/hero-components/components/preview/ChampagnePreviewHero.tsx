import type { ReactNode } from 'react';

import ChampagneHeroSurface from '@/components/champagne/ChampagneHeroSurface';
import WaveFXPreview from '@/components/preview/fx/WaveFXPreview';

export type ChampagnePreviewHeroProps = {
  title: string;
  kicker?: string;
  ctas?: ReactNode;
  children?: ReactNode;
  variant?: 'default' | 'luminous';
  describedById?: string;
};

const ChampagnePreviewHero = ({ title, kicker, ctas, children, variant = 'default', describedById }: ChampagnePreviewHeroProps) => {
  const surface = variant === 'luminous' ? <ChampagneHeroSurface /> : <WaveFXPreview />;

  return (
    <section className="cpv-hero" aria-describedby={describedById}>
      {surface}
      <div className="container">
        <div className="cpv-hero__inner">
          <div className="cpv-hero__content">
            <div className="cpv-glass cpv-hero__card">
              <div className="flex flex-col gap-6">
                {kicker ? <span className="cpv-hero__kicker">{kicker}</span> : null}
                <div className="space-y-4">
                  <h1 className="cpv-hero__title">{title}</h1>
                  {children ? <div className="cpv-hero__body text-lg leading-relaxed">{children}</div> : null}
                </div>
                {ctas ? ctas : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChampagnePreviewHero;
