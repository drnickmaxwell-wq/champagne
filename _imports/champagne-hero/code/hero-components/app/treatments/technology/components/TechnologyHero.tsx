'use client';

import React, { useEffect, useRef } from 'react';
import './technology-hero.css';

const champagnePhase2 = process.env.NEXT_PUBLIC_CHAMPAGNE_PHASE2 === '1';

export default function TechnologyHero() {
  const heroRef = useRef<HTMLElement>(null);

  const lensFlareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const lensFlare = lensFlareRef.current;
    if (!hero) return;

    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isMobile && !prefersReducedMotion) {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        const maxTilt = 1.2; // degrees (reduced from 2° for subtlety)
        const rx = -y * maxTilt;
        const ry = x * maxTilt;
        
        hero.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        
        // Lens flare follows cursor subtly
        if (lensFlare) {
          const flareX = e.clientX * 0.1;
          const flareY = e.clientY * 0.1;
          lensFlare.style.transform = `translate(${flareX}px, ${flareY}px)`;
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    } else {
      hero.style.transform = 'none';
    }
  }, []);

  return (
    <section ref={heroRef} className="technology-hero tech-hero">
      {/* Gradient Background */}
      <div className="hero-gradient"></div>

      <div
        className="wave-layer wave-back"
        style={{ backgroundImage: 'url(/waves/smh-wave-mask.svg)' }}
      />
      <div
        className="wave-layer wave-mid"
        style={{ backgroundImage: 'url(/waves/smh-wave-mask.svg)' }}
      />
      <div
        className="wave-layer wave-front"
        style={{ backgroundImage: 'url(/waves/smh-wave-mask.svg)' }}
      />
      
      {/* Parallax Triptych - Three wave planes */}
      <div className="hero-wave-slow"></div>
      <div className="hero-wave-medium"></div>
      <div className="hero-wave-reverse"></div>
      
      {/* Wave Light Overlay */}
      <div className="hero-wave-light"></div>
      
      {/* Film Grain Overlay - 1% */}
      <div className="hero-film-grain"></div>
      
      {/* Lens Flare Reflection Layer - cursor-responsive */}
      <div ref={lensFlareRef} className="hero-lens-flare"></div>
      
      {/* Gold Whisper Line */}
      <div className="gold-whisper-line"></div>
      
      {/* Gold Dust Overlay */}
      <div className="hero-gold-dust"></div>
      
      {/* Dark Overlay for Text Contrast */}
      <div className="hero-overlay"></div>
      
      {/* Video Placeholder */}
      <div className="hero-video-container">
        <div className="video-placeholder">
          <span className="video-placeholder-text">4K Scanner/Microscope Video</span>
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="hero-content">
        <h1 className="hero-title iridescent-text depth-bloom iridescent-heading">
          Technology in Harmony
        </h1>
        
        <p className="hero-subtitle">Where precision meets artistry</p>
        
        <div className="hero-ctas">
          <a
            href="#digital-workflow"
            className={`cta-primary${champagnePhase2 ? ' sparkle-hover' : ''}`}
          >
            Explore Our Digital Workflow
            <span className="cta-underline"></span>
          </a>
        </div>
      </div>
    </section>
  );
}

