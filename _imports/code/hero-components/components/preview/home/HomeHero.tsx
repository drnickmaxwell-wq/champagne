"use client";

import { ChampagneHeroFrame } from "@/components/preview/champagne/ChampagneHeroFrame";

import PreviewChampagneCTA from "../shared/PreviewChampagneCTA";
import styles from "./home-preview.module.css";

export default function HomeHero() {
  return (
    <ChampagneHeroFrame variant="home" titleId="home-hero-title" contentClassName={styles.heroContent}>
      <h1 id="home-hero-title">Your Luxury Smile Awaits</h1>
      <p>
        Private dental care with calm precision, comfort-first technology, and a signature Manus AI finish.
      </p>
      <div className={styles.heroCtaPlate}>
        <div className={styles.heroCtaRow}>
          <PreviewChampagneCTA href="/book" className={styles.heroCtaPrimary}>
            Book a consultation
          </PreviewChampagneCTA>
          <PreviewChampagneCTA
            href="/treatments"
            variant="secondary"
            className={styles.heroCtaSecondary}
          >
            Explore treatments
          </PreviewChampagneCTA>
        </div>
      </div>
    </ChampagneHeroFrame>
  );
}
