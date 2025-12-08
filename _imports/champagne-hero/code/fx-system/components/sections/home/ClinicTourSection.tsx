"use client";

import { useEffect, useState } from "react";

import SectionShell from "./SectionShell";
import styles from "./homepage-sections.module.css";

const practiceTourVideoSrc = ""; // TODO: replace with practice tour asset when available

export default function ClinicTourSection() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(mediaQuery.matches);
    updateMotion();
    mediaQuery.addEventListener("change", updateMotion);
    return () => mediaQuery.removeEventListener("change", updateMotion);
  }, []);

  return (
    <SectionShell className={styles.sectionSurface} ariaLabelledby="clinic-tour-title">
      <div className="relative z-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className={`${styles.glassCard} relative overflow-hidden rounded-[30px] border-white/15 shadow-2xl`}>
          <div className="absolute inset-0 bg-black/30" aria-hidden />
          <div className={styles.waveOverlay} aria-hidden />
          <div className={styles.grainOverlay} aria-hidden />
          {practiceTourVideoSrc && !reduceMotion ? (
            <video
              className="relative z-10 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/champagne/waves/wave-bg.webp"
            >
              <source src={practiceTourVideoSrc} type="video/mp4" />
            </video>
          ) : (
            <PracticeTourPlaceholder />
          )}
        </div>
        <div className="lg:pl-8">
          <div className={`${styles.sectionHeader} space-y-3`}>
            <span className={`${styles.chip} text-eyebrow`}>Calm coastal setting</span>
            <h2 id="clinic-tour-title" className={`${styles.displayHeading} text-display-sm`}>
              Step inside our coastal clinic
            </h2>
            <p className={`text-lead text-body ${styles.mutedText}`}>
              Wander through light-filled surgeries, ocean-inspired lounges, and serene tech suites designed for quiet focus.
              Discover how our 3D scanners, CBCT imaging, and gentle sedation options keep visits comfortable.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="/technology" className={`${styles.pillCtaPrimary} text-eyebrow`}>
              See our technology
              <span aria-hidden>→</span>
            </a>
            <a href="/about" className={`${styles.pillCtaGhost} text-eyebrow`}>
              Meet the team
            </a>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function PracticeTourPlaceholder() {
  return (
    <div className="relative z-10 flex min-h-[320px] flex-col items-center justify-center gap-4 px-8 py-12 text-center sm:min-h-[380px]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg">
        <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="none" className="opacity-90">
          <path d="M8.5 7.5 16 12l-7.5 4.5V7.5z" fill="currentColor" opacity="0.86" />
        </svg>
      </div>
      <div className="space-y-2">
        <p className="text-display-sm text-white">Clinic tour video coming soon</p>
        <p className="text-body text-white/80">
          We&apos;re preparing a guided walkthrough of our Shoreham-by-Sea practice. Placeholder reserved for the final video asset.
        </p>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-eyebrow text-white">
        <span className="h-2 w-2 rounded-full bg-[var(--brand-gold)]" aria-hidden />
        Motion preview protected
      </span>
    </div>
  );
}
