'use client';

import React from 'react';
import './technology-cta.css';

export default function TechnologyCTA() {
  return (
    <section className="technology-cta-section">
      {/* Film Grain */}
      <div className="cta-film-grain"></div>
      
      {/* Parallax Wave Mirror */}
      <div className="cta-parallax-wave"></div>
      
      {/* Wave Rise Animation Background */}
      <div className="cta-wave-rise"></div>
      
      {/* Gradient Mirror */}
      <div className="cta-gradient"></div>
      
      {/* Reversed Wave Reflection Shimmer */}
      <div className="cta-wave-shimmer"></div>
      
      {/* Gold Dust Overlay */}
      <div className="cta-gold-dust"></div>
      
      {/* Dark Overlay for Text Contrast */}
      <div className="cta-overlay"></div>
      
      {/* CTA Content */}
      <div className="cta-content">
        <h2 className="cta-title iridescent-text">Experience Tomorrow’s Dentistry Today.</h2>
        
        <p className="cta-subtitle">
          Discover how our precision technology creates exceptional outcomes with unmatched comfort.
        </p>
        
        <div className="cta-buttons">
          <a href="/contact" className="cta-btn cta-btn-primary cta-hover-lift">
            Book Consultation
            <span className="btn-underline"></span>
          </a>
          
          <a href="/tour" className="cta-btn cta-btn-secondary cta-hover-lift">
            Tour Our Clinic
          </a>
        </div>
      </div>
    </section>
  );
}

