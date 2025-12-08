'use client';

import WaveFXPreview from '@/components/preview/fx/WaveFXPreview';

function ChampagneHeroSurface({ className }: { className?: string }) {
  return (
    <div className={`champagne-hero-surface${className ? ` ${className}` : ''}`} aria-hidden>
      <div className="champagne-hero-surface__gradient" />
      <WaveFXPreview />
    </div>
  );
}

export default ChampagneHeroSurface;
