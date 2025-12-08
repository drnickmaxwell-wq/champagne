'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

import BrandHeroGradient, { type BrandHeroGradientProps } from '@/components/brand/BrandHeroGradient';

import styles from './champagne-preview.module.css';

const MIN_GRAIN = 0;
const MAX_GRAIN = 0.25;
const GRAIN_STEP = 0.01;

const ChampagnePreviewPage = () => {
  const [experimentsEnabled, setExperimentsEnabled] = useState(false);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setExperimentsEnabled(params.get('exp') === '1');
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const [particlesVariant, setParticlesVariant] = useState<'gold' | 'none'>('gold');
  const [grainOpacity, setGrainOpacity] = useState(0.14);
  const [goldRimEnabled, setGoldRimEnabled] = useState(false);

  const formattedGrain = useMemo(() => grainOpacity.toFixed(2), [grainOpacity]);
  const heroStyle = useMemo<CSSProperties>(
    () =>
      ({
        '--champagne-grain': experimentsEnabled ? formattedGrain : undefined,
      }) as CSSProperties,
    [formattedGrain, experimentsEnabled],
  );

  return (
    <div className={styles.preview}>
      <section className={styles.controls} aria-label="Champagne hero controls">
        <p className={styles.controlsTitle}>Layer Toggles</p>
        {!experimentsEnabled && (
          <p className={styles.controlsNotice}>
            Experiments are locked. Add <code>?exp=1</code> to the URL to explore grain, particles, and gold rim variations.
          </p>
        )}
        <div className={styles.controlGroup}>
          <div className={styles.control}>
            <label htmlFor="champagne-toggle-particles">
              <span>Particles</span>
            </label>
            <input
              id="champagne-toggle-particles"
              type="checkbox"
              role="switch"
              aria-label="Toggle particle overlay"
              className={styles.toggle}
              checked={particlesVariant !== 'none'}
              onChange={(event) => {
                if (!experimentsEnabled) return;
                setParticlesVariant(event.target.checked ? 'gold' : 'none');
              }}
              disabled={!experimentsEnabled}
            />
          </div>
          <div className={styles.control}>
            <label htmlFor="champagne-toggle-grain">
              <span>Grain</span>
            </label>
            <input
              id="champagne-toggle-grain"
              type="range"
              min={MIN_GRAIN}
              max={MAX_GRAIN}
              step={GRAIN_STEP}
              aria-valuetext={`${formattedGrain}`}
              aria-label="Adjust film grain opacity"
              className={styles.range}
              value={grainOpacity}
              onChange={(event) => {
                if (!experimentsEnabled) return;
                setGrainOpacity(Number(event.target.value));
              }}
              disabled={!experimentsEnabled}
            />
            <span className={styles.output}>Opacity {formattedGrain}</span>
          </div>
          <div className={styles.control}>
            <label htmlFor="champagne-toggle-gold">
              <span>Gold Rim</span>
            </label>
            <input
              id="champagne-toggle-gold"
              type="checkbox"
              role="switch"
              aria-label="Toggle gold rim highlight"
              className={styles.toggle}
              checked={goldRimEnabled}
              onChange={(event) => {
                if (!experimentsEnabled) return;
                setGoldRimEnabled(event.target.checked);
              }}
              disabled={!experimentsEnabled}
            />
          </div>
        </div>
      </section>

      <div className={styles.heroFrame}>
        <BrandHeroGradient
          {...({
            intensity: 'bold',
            clip: 'wave-bottom',
            goldDensity: 'med',
            waveOpacity: 0.24,
            particles: experimentsEnabled ? particlesVariant : 'gold',
            grainOpacity: experimentsEnabled ? grainOpacity : 0.14,
            goldRimEnabled: experimentsEnabled ? goldRimEnabled : false,
            driftEnabled: true,
          } as BrandHeroGradientProps)}
        >
          <section className={styles.hero} style={heroStyle}>
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>Champagne Preview</p>
              <h1 className={styles.heroTitle}>On-brand radiance, ready for launch</h1>
              <p className={styles.heroDescription}>
                This hero uses production tokens for the magenta-to-teal gradient while layering particles, wave masks, and
                film grain that can be tuned for polish audits.
              </p>
              <a className="smh-btn" href="#consult">
                Plan Your Consultation
              </a>
            </div>
          </section>
        </BrandHeroGradient>
        <div className={styles.goldRim} data-enabled={goldRimEnabled} aria-hidden="true" />
      </div>

      <p className={styles.heroNote}>
        Preview the Champagne hero with adjustable layers to validate the gold rim treatment alongside film grain and particles.
      </p>
    </div>
  );
};

export default ChampagnePreviewPage;
