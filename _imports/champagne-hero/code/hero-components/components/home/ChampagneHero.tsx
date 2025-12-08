"use client";

import React from "react";

export default function ChampagneHero() {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section className="champagne-hero" aria-labelledby="home-hero-title">
      <div className="hero-gradient-base" />
      {!reduceMotion && (
        <>
          <div className="hero-wave-caustics">
            <video autoPlay loop muted playsInline preload="auto">
              <source
                src="/assets/champagne/motion/wave-caustics.webm"
                type="video/webm"
              />
            </video>
          </div>
          <div className="hero-glass-shimmer">
            <video autoPlay loop muted playsInline preload="auto">
              <source
                src="/assets/champagne/motion/glass-shimmer.webm"
                type="video/webm"
              />
            </video>
          </div>
          <div className="hero-particles-drift">
            <video autoPlay loop muted playsInline preload="auto">
              <source
                src="/assets/champagne/motion/particles-drift.webm"
                type="video/webm"
              />
            </video>
          </div>
          <div className="hero-gold-dust-drift">
            <video autoPlay loop muted playsInline preload="auto">
              <source
                src="/assets/champagne/particles/gold-dust-drift.webm"
                type="video/webm"
              />
            </video>
          </div>
        </>
      )}
      <div className="hero-wave-mask" />
      <div className="hero-particles-static" />
      <div className="hero-film-grain" />
      <div className="hero-content">
        <div className="hero-content-wrapper">
          <h1 id="home-hero-title">Your Luxury Smile Awaits</h1>
          <p>
            Private dental care with calm precision, comfort-first technology, and
            a signature Manus AI finish.
          </p>
          <div className="hero-cta-group">
            <a href="/contact" className="hero-cta-primary">
              Book a consultation
            </a>
            <a href="/treatments" className="hero-cta-secondary">
              Explore treatments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
