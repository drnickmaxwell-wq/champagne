'use client';

import React, { useEffect, useRef } from 'react';
import './ai-innovation.css';

export default function AIInnovation() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Z-Axis Depth Tilt on Scroll
  useEffect(() => {
    const viewer = viewerRef.current;
    const section = sectionRef.current;
    if (!viewer || !section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
      
      // Tilt max 2° based on scroll progress
      const maxTilt = 2;
      const tiltX = (scrollProgress - 0.5) * maxTilt;
      const tiltY = (scrollProgress - 0.5) * maxTilt * 0.5;
      
      viewer.style.setProperty('--tilt-x', `${tiltX}deg`);
      viewer.style.setProperty('--tilt-y', `${tiltY}deg`);
      viewer.classList.add('tilt-active');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <section ref={sectionRef} className="ai-innovation-section">
      {/* Transparent Wave Background */}
      <div className="ai-wave-background"></div>
      
      {/* Slow Gold Drift Overlay */}
      <div className="gold-drift-overlay"></div>
      
      <div className="ai-container">
        <div className="ai-content">
          <h2 className="ai-title iridescent-text">
            AI & 3-D Innovation
          </h2>
          
          <div className="ai-text">
            <p>
              Our <span className="ai-highlight">AI Dental Engine</span> analyzes thousands of smile parameters to design your perfect outcome before treatment begins.
            </p>
            
            <p>
              Combined with 3D surgical planning, we achieve precision measured in microns—not millimeters. Every implant, every veneer, every restoration is digitally optimized for your unique anatomy.
            </p>
            
            <p>
              The result? Predictable outcomes, reduced treatment time, and a level of accuracy that traditional methods simply cannot match.
            </p>
          </div>
          
          <div className="ai-features">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Predictive smile simulation</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Surgical guide fabrication</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Real-time treatment tracking</span>
            </div>
          </div>
        </div>
        
        <div ref={viewerRef} className="ai-viewer depth-tilt">
          {/* 3D Viewer Placeholder */}
          <div className="viewer-placeholder">
            <div className="viewer-glow-pulse"></div>
            <div className="viewer-content">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              <p className="viewer-label">3D Treatment Viewer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

