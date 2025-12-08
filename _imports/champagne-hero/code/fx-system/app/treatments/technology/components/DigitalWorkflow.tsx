'use client';

import React, { useEffect, useRef } from 'react';
import './digital-workflow.css';

export default function DigitalWorkflow() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const waveMorphRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.workflow-card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  // Scroll-Sync Wave Morphing
  useEffect(() => {
    const section = sectionRef.current;
    const waveMorph = waveMorphRef.current;
    if (!section || !waveMorph) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / sectionHeight));

      // Determine phase based on scroll progress
      if (scrollProgress < 0.33) {
        waveMorph.setAttribute('data-phase', 'scan');
      } else if (scrollProgress < 0.66) {
        waveMorph.setAttribute('data-phase', 'design');
      } else {
        waveMorph.setAttribute('data-phase', 'make');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="digital-workflow" className="digital-workflow-section">
      {/* Scroll-Sync Wave Morphing Background */}
      <div ref={waveMorphRef} className="workflow-wave-morph" data-phase="scan"></div>
      
      {/* Floating Particle Shimmer - 10 particles */}
      <div className="particle-shimmer-container">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="shimmer-particle" style={{'--drift-x': `${(i % 3) * 20 - 20}px`, '--drift-y': `${-50 - (i % 4) * 15}px`} as React.CSSProperties}></div>
        ))}
      </div>
      {/* Wave Divider Top */}
      <div className="wave-divider wave-divider-top"></div>
      
      <div className="workflow-container">
        <h2 className="section-title iridescent-text">Our Digital Workflow</h2>
        <p className="section-subtitle">Three steps to perfection</p>
        
        <div ref={cardsRef} className="workflow-cards">
          {/* Scan Card */}
          <div className="workflow-card">
            <div className="card-icon-wrapper">
              <img src="/icons/scan.svg" alt="Digital Scan" className="card-icon" />
            </div>
            <h3 className="card-title">Scan</h3>
            <p className="card-description">
              3D intraoral scanning captures every detail with micron-level precision. No impressions, no discomfort.
            </p>
            <div className="gold-baseline"></div>
          </div>
          
          {/* Design Card */}
          <div className="workflow-card">
            <div className="card-icon-wrapper">
              <img src="/icons/sparkle.svg" alt="AI Design" className="card-icon" />
            </div>
            <h3 className="card-title">Design</h3>
            <p className="card-description">
              AI-powered treatment planning creates your perfect smile digitally before we begin.
            </p>
            <div className="gold-baseline"></div>
          </div>
          
          {/* Make Card */}
          <div className="workflow-card">
            <div className="card-icon-wrapper">
              <img src="/icons/implant.svg" alt="Precision Fabrication" className="card-icon" />
            </div>
            <h3 className="card-title">Make</h3>
            <p className="card-description">
              In-house milling and fabrication delivers same-day results with unmatched accuracy.
            </p>
            <div className="gold-baseline"></div>
          </div>
        </div>
      </div>
      
      {/* Wave Divider Bottom */}
      <div className="wave-divider wave-divider-bottom"></div>
    </section>
  );
}

