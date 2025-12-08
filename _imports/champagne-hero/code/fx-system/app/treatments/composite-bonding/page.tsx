import type { Metadata } from 'next';

import BrandHeroGradient from '@/components/brand/BrandHeroGradient';
import FaqAccordion from '@/components/faq/FaqAccordion';
import CompositeBonding from '@/components/sections/treatments/CompositeBonding';
import styles from './composite-bonding.module.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://www.stmaryshousedental.co.uk';
const canonicalBase = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
const pageUrl = `${canonicalBase}/treatments/composite-bonding`;

export const metadata: Metadata = {
  title: 'Composite Bonding in Shoreham-by-Sea | St Mary’s House Dental',
  description:
    'Discover hand-sculpted composite bonding finished in a single visit at St Mary’s House Dental in Shoreham-by-Sea.',
  alternates: { canonical: pageUrl },
};

const champagnePhase2 = process.env.NEXT_PUBLIC_CHAMPAGNE_PHASE2 === '1';

const bondingFaq = [
  {
    question: 'How durable is composite bonding?',
    answer:
      'With mindful care and routine hygiene visits, modern composites last 5–7 years on average and can be refreshed without invasive prep.',
  },
  {
    question: 'Will the results look natural?',
    answer:
      'We colour-match each layer under studio lighting and polish to a glass-smooth finish, so the enhancement blends seamlessly with your enamel.',
  },
  {
    question: 'What is the appointment like?',
    answer:
      'Plan for a single calm visit: digital shade capture, minimal preparation, sculpting, and final contouring in around 90 minutes per smile zone.',
  },
];

const bondingResults = [
  {
    title: 'Micro-gap refinement',
    description:
      'Closing small spacing along the upper arch with layered resin that mirrors neighbouring translucency.',
  },
  {
    title: 'Edge rebalancing',
    description: 'Softening chipped corners and asymmetric lengths for a balanced smile line in a single appointment.',
  },
  {
    title: 'Lustre revival',
    description:
      'Tuning brightness and gloss with a calibrated polish so the finish feels luminous yet entirely natural.',
  },
];

function HeroContent() {
  return (
    <section className={`${styles.hero} hero`}>
      <div aria-hidden="true" className="champagne-overlay champagne-wave-mask" />
      <div aria-hidden="true" className="champagne-grain" />
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>Composite Bonding</p>
        <h1 className={styles.heroTitle}>Hand-sculpted brilliance, finished in a single visit</h1>
        <p className={styles.heroDescription}>
          We recontour edges, close micro-gaps, and brighten each tooth with feather-light layers that respect your natural
          enamel. Every smile is photographed under studio light to perfect the finish before you leave.
        </p>
        <div className={styles.heroActions}>
          <a className="smh-btn" href="#consult">
            Reserve a consultation
          </a>
          <a className={styles.heroSecondary} href="#faq">
            View bonding FAQs
          </a>
        </div>
      </div>
    </section>
  );
}

export default function CompositeBondingPage() {
  const hero = <HeroContent />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {champagnePhase2 ? (
        <BrandHeroGradient
          intensity="standard"
          clip="wave-bottom"
          goldDensity="med"
          particles="gold"
          grainOpacity={0.14}
          driftEnabled
        >
          {hero}
        </BrandHeroGradient>
      ) : (
        hero
      )}

      <div className={styles.sectionGrid}>
        <CompositeBonding />
      </div>

      <section id="results" className={styles.resultsSection} aria-labelledby="bonding-results-heading">
        <div className={styles.resultsIntro}>
          <h2 id="bonding-results-heading">Results our guests love</h2>
          <p>
            Precision-mapped casework keeps each enhancement subtle from conversational distance while shining under studio
            light. Here are a few of the transformations we complete every week.
          </p>
        </div>
        <div className={styles.resultsGrid}>
          {bondingResults.map((item) => (
            <article key={item.title} className={styles.resultCard}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className={styles.faqSection}>
        <div className={styles.faqIntro}>
          <h2>Composite bonding questions</h2>
          <p>
            From longevity to comfort, here are the answers we cover in every consultation. Tailor your appointment before we
            sculpt the final finish.
          </p>
        </div>
        <FaqAccordion items={bondingFaq} glassEnabled={champagnePhase2} />
      </section>
    </main>
  );
}
