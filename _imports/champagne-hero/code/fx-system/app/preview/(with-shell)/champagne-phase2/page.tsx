'use client';

import { useEffect, useMemo, useState } from 'react';

import BrandHeroGradient from '@/components/brand/BrandHeroGradient';
import FaqAccordion from '@/components/faq/FaqAccordion';
import '@/styles/brand/brand-motion.css';
import '@/styles/brand/lux-glass.css';

import styles from './champagne-phase2.module.css';

const MIN_GRAIN = 0;
const MAX_GRAIN = 0.2;
const GRAIN_STEP = 0.01;

const heroCopy = {
  eyebrow: 'Champagne Drift',
  title: 'Glass-layered radiance with motion guards',
  body:
    'Fine-tuned gradient drift, particle palettes, and gold rim detailing—all driven by production tokens with reduced-motion safeguards built in.',
};

const faqSample = [
  {
    question: 'How subtle is the drift?',
    answer: 'The animation stays under 20px of parallax with a 90-second hue sweep, pausing entirely when reduced motion is enabled.',
  },
  {
    question: 'Can we switch particle colours?',
    answer: 'Yes. Swap between gold, teal, magenta, or disable entirely—ideal for aligning with campaign palettes.',
  },
  {
    question: 'Does the glass treatment respect dark mode?',
    answer: 'Backgrounds mix from champagne tokens, automatically tuning opacity and shadow depth for light or dark themes.',
  },
];

const particleOptions = [
  { value: 'gold', label: 'Gold' },
  { value: 'teal', label: 'Teal' },
  { value: 'magenta', label: 'Magenta' },
  { value: 'none', label: 'None' },
] as const;

type ParticleOption = (typeof particleOptions)[number]['value'];

function HeroPreview({
  particles,
  grain,
  goldRim,
  driftEnabled,
}: {
  particles: ParticleOption;
  grain: number;
  goldRim: boolean;
  driftEnabled: boolean;
}) {
  return (
    <BrandHeroGradient
      intensity="bold"
      clip="wave-bottom"
      goldDensity="med"
      particles={particles}
      grainOpacity={grain}
      driftEnabled={driftEnabled}
      goldRimEnabled={goldRim}
    >
      <section className="relative px-6 py-16 md:px-10 md:py-20">
        <div className={`${styles.heroCopy} mx-auto max-w-4xl md:text-left`}>
          <span>{heroCopy.eyebrow}</span>
          <h2 className="font-serif md:text-5xl">{heroCopy.title}</h2>
          <p>{heroCopy.body}</p>
          <div className={`${styles.heroActions} md:justify-start`}>
            <a className="smh-btn sparkle-hover" href="#faq-preview">
              Preview CTA Motion
            </a>
            <button className={`${styles.heroSecondary} underline-offset-4 transition hover:underline`} type="button">
              Inspect layers
            </button>
          </div>
        </div>
      </section>
    </BrandHeroGradient>
  );
}

export default function ChampagnePhaseTwoPreview() {
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

  const [particles, setParticles] = useState<ParticleOption>('gold');
  const [grainOpacity, setGrainOpacity] = useState(0.14);
  const [driftEnabled, setDriftEnabled] = useState(true);

  const formattedGrain = useMemo(() => grainOpacity.toFixed(2), [grainOpacity]);
  const appliedParticles = experimentsEnabled ? particles : 'gold';
  const appliedGrain = experimentsEnabled ? grainOpacity : 0.14;
  const appliedDrift = experimentsEnabled ? driftEnabled : true;

  return (
    <div className={`${styles.page} mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8`}>
      <header className={`${styles.header} md:text-left`}>
        <h1 className="text-4xl font-serif md:text-5xl">Champagne Phase 2 Preview</h1>
        <p className="md:max-w-3xl">
          Validate hero drift, particle palettes, and lux-glass FAQs before promoting the toggle. Adjust controls below and compare
          gold rim, grain intensity, and FAQ treatments side by side.
        </p>
      </header>

      <section
        className={`${styles.panel} md:flex-row md:items-center md:justify-between`}
        aria-label="Champagne controls"
      >
        <div className={styles.panelHeading}>
          <h2>Layer controls</h2>
          <p>
            Particles, grain, and motion respond immediately for both hero variants.
          </p>
          {!experimentsEnabled && (
            <p className={styles.panelNotice}>
              Experiments are disabled. Append <code>?exp=1</code> to the preview URL to unlock interactive layer controls.
            </p>
          )}
        </div>
        <div className={`${styles.panelControls} md:flex-row md:items-center md:justify-end`}>
          <label className={styles.controlInline} htmlFor="particles-select">
            <span className={styles.controlLabel}>Particles</span>
            <select
              id="particles-select"
              className={styles.select}
              value={particles}
              onChange={(event) => {
                if (!experimentsEnabled) return;
                setParticles(event.target.value as ParticleOption);
              }}
              disabled={!experimentsEnabled}
            >
              {particleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.controlField} htmlFor="grain-slider">
            <span>Grain opacity ({formattedGrain})</span>
            <input
              id="grain-slider"
              type="range"
              min={MIN_GRAIN}
              max={MAX_GRAIN}
              step={GRAIN_STEP}
              className={styles.range}
              value={grainOpacity}
              onChange={(event) => {
                if (!experimentsEnabled) return;
                setGrainOpacity(Number(event.target.value));
              }}
              disabled={!experimentsEnabled}
            />
          </label>
          <label className={styles.controlInline} htmlFor="drift-toggle">
            <span className={styles.controlLabel}>Enable drift</span>
            <input
              id="drift-toggle"
              type="checkbox"
              role="switch"
              className={styles.toggle}
              checked={driftEnabled}
              onChange={(event) => {
                if (!experimentsEnabled) return;
                setDriftEnabled(event.target.checked);
              }}
              disabled={!experimentsEnabled}
            />
          </label>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2" aria-label="Hero variants">
        <div className="space-y-4">
          <h3 className={styles.sectionTitle}>Particles + grain</h3>
          <HeroPreview particles={appliedParticles} grain={appliedGrain} goldRim={false} driftEnabled={appliedDrift} />
        </div>
        <div className="space-y-4">
          <h3 className={styles.sectionTitle}>Add gold rim</h3>
          <HeroPreview particles={appliedParticles} grain={appliedGrain} goldRim driftEnabled={appliedDrift} />
        </div>
      </section>

      <section id="faq-preview" className="grid gap-12 md:grid-cols-2" aria-label="FAQ before and after">
        <div className="space-y-4">
          <h3 className={styles.sectionTitle}>Baseline accordion</h3>
          <FaqAccordion items={faqSample} glassEnabled={false} />
        </div>
        <div className="space-y-4">
          <h3 className={styles.sectionTitle}>Lux-glass + gold rail</h3>
          <FaqAccordion items={faqSample} glassEnabled />
        </div>
      </section>
    </div>
  );
}
