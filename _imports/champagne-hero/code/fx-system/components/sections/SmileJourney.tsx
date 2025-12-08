/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

export interface TimelineStep {
  title: string;
  body: string;
  icon?: "scan" | "sparkle" | "implant";
}

const defaultSteps: TimelineStep[] = [
  {
    title: "Initial Consultation",
    body: "Meet your dedicated clinician for a comprehensive smile assessment using our 4K digital imaging suite.",
    icon: "scan",
  },
  {
    title: "AI Smile Preview",
    body: "Visualize your future smile with photorealistic AR rendering and explore treatment options in real-time.",
    icon: "sparkle",
  },
  {
    title: "Treatment Planning",
    body: "Receive a personalized roadmap with transparent pricing, timeline estimates, and milestone tracking.",
    icon: "scan",
  },
  {
    title: "Precision Treatment",
    body: "Experience meticulous care in our serene coastal studio with advanced comfort protocols.",
    icon: "implant",
  },
  {
    title: "Progress Monitoring",
    body: "Track your transformation through our patient portal with regular updates and healing milestones.",
    icon: "sparkle",
  },
  {
    title: "Smile Reveal",
    body: "Celebrate your new smile with a final consultation and personalized aftercare guidance.",
    icon: "sparkle",
  },
];

export interface SmileJourneyProps {
  steps?: TimelineStep[];
}

export default function SmileJourney({ steps = defaultSteps }: SmileJourneyProps) {
  const iconMap = useMemo(
    () => ({
      scan: "/assets/manus/icons/scan.svg",
      sparkle: "/assets/manus/icons/smile-curve.svg",
      implant: "/assets/manus/icons/scan.svg",
    }),
    []
  );

  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <section
      aria-labelledby="journey-hero-title"
      className="champagne-surface-lux journey"
      data-particles="off"
      data-wave="on"
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
    >
      <div className="relative isolate w-screen py-16 md:py-24">
        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="relative z-[var(--z-content)] flex flex-col gap-12" style={{ color: "var(--smh-text)" }}>
            <div className="champagne-glass relative z-20 mx-auto mb-8 max-w-[960px] p-6 md:p-8">
              <div className="space-y-4 text-center">
                <h2
                  id="journey-hero-title"
                  className="text-3xl font-serif font-semibold tracking-tight md:text-4xl"
                >
                  Your Smile Journey
                </h2>
                <p className="text-base md:text-lg">
                  Discover the path to your perfect smile with a guided experience curated by Manus AI.
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => {
                const iconPath = step.icon ? iconMap[step.icon] : undefined;
                const connectorClass =
                  index < 3
                    ? "after:hidden lg:after:absolute lg:after:left-1/2 lg:after:bottom-[-48px] lg:after:block lg:after:h-12 lg:after:w-px lg:after:-translate-x-1/2 lg:after:bg-[color:var(--champagne-keyline-gold)] lg:after:opacity-40 lg:after:content-['']"
                    : "";
                return (
                  <div key={step.title} className={connectorClass ? `relative ${connectorClass}` : undefined}>
                    <article className="champagne-glass relative z-20 p-6 md:p-8" tabIndex={0}>
                      {iconPath && (
                        <div className="mb-6 flex flex-col items-center text-[color:var(--champagne-keyline-gold)]">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--champagne-keyline-gold)]">
                            <img src={iconPath} alt="" aria-hidden="true" className="h-7 w-7" />
                          </span>
                          <span
                            aria-hidden="true"
                            className="mt-4 h-4 border-l border-[color:var(--champagne-keyline-gold)] opacity-60"
                          />
                        </div>
                      )}
                      <h3 className="font-serif text-2xl tracking-tight">{step.title}</h3>
                      <p className="text-base leading-relaxed">
                        {step.body}
                      </p>
                    </article>
                  </div>
                );
              })}
            </div>

            <div className="relative z-[var(--z-content)] text-center">
              <div className="champagne-glass relative z-20 p-6 md:p-8">
                <div className="space-y-3">
                  <h3 className="font-serif text-3xl tracking-tight">Ready to Begin?</h3>
                  <p>Take the first step toward your perfect smile.</p>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/contact"
                    data-cta="primary"
                    className="relative inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--champagne-keyline-gold)] bg-[var(--smh-gradient)] px-6 py-3 font-semibold transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne-keyline-gold)] hover:-translate-y-0.5"
                    style={{ color: "var(--smh-text)" }}
                  >
                    Book a consultation
                  </Link>
                  <Link
                    href="/ai-smile-quiz"
                    className="relative inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--champagne-keyline-gold)] bg-transparent px-6 py-3 font-semibold transition-transform duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne-keyline-gold)] hover:-translate-y-0.5"
                    style={{ color: "var(--smh-text)" }}
                  >
                    Start your AI smile preview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
