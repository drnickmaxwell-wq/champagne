'use client';

import React, { useEffect, useRef } from 'react';
import './sustainability.css';

export default function Sustainability() {
  const particlesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    // Create 8 gold fleck particles with randomized paths
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'gold-particle';
      const driftX = (Math.random() - 0.5) * 100; // Random horizontal drift
      particle.style.setProperty('--drift-x', `${driftX}px`);
      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  // Animate numbers on scroll viewport entry
  useEffect(() => {
    const stats = statsRef.current;
    if (!stats) return;

    const statValues = stats.querySelectorAll('.stat-value');
    const targets = [90, 50, 100]; // Target values

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statValues.forEach((el, index) => {
              const target = targets[index];
              const duration = 2000; // 2 seconds
              const startTime = Date.now();

              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
                const current = Math.floor(easeOut * target);
                
                el.textContent = `${current}%`;

                if (progress < 1) {
                  requestAnimationFrame(animate);
                }
              };

              animate();
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(stats);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="sustainability-section">
      {/* Gold Spark Particles */}
      <div ref={particlesRef} className="gold-particles-container"></div>
      
      <div className="sustainability-container">
        <div className="sustainability-content">
          <div className="content-panel">
            <h2 className="sustainability-title">Sustainability & Precision</h2>
            
            <div className="sustainability-text">
              <p>
                Digital workflows eliminate the waste of traditional impressions and temporary restorations. Our same-day technology reduces your visits, our carbon footprint, and material consumption.
              </p>
              
              <p>
                Precision means fewer adjustments, fewer remakes, and better long-term outcomes. It’s not just efficient—it’s responsible dentistry.
              </p>
              
              <p>
                Every scan, every design, every restoration is optimized for accuracy and sustainability, ensuring your treatment is as gentle on the planet as it is on you.
              </p>
            </div>
            
            <div ref={statsRef} className="sustainability-stats">
              <div className="stat-item">
                <div className="stat-value">90%</div>
                <div className="stat-label">Less Material Waste</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">50%</div>
                <div className="stat-label">Fewer Appointments</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">100%</div>
                <div className="stat-label">Digital Records</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="sustainability-image">
          <div className="image-fade-placeholder">
            <div className="image-gradient"></div>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" opacity="0.4">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v12M6 12h12"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

