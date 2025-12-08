'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Sparkles, Phone, Calendar } from 'lucide-react';

const OriginalHeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for scattered dots
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
    }> = [];

    // Create scattered dot particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 6 + 2,
        color: ['var(--brand-magenta)', 'var(--brand-teal)', 'var(--brand-gold)'][Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Draw flowing line graphics (not filled waves)
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      // Create flowing curved lines across the screen
      for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        
        const startX = -200;
        const endX = canvas.width + 200;
        const baseY = canvas.height * 0.3 + i * 30;
        
        // Create gradient for each line
        const gradient = ctx.createLinearGradient(startX, baseY, endX, baseY);
        gradient.addColorStop(0, 'rgba(194, 24, 91, 0.8)'); // Magenta
        gradient.addColorStop(0.3, 'rgba(194, 24, 91, 0.6)');
        gradient.addColorStop(0.5, 'rgba(64, 196, 180, 0.6)'); // Turquoise
        gradient.addColorStop(0.7, 'rgba(64, 196, 180, 0.4)');
        gradient.addColorStop(1, 'rgba(212, 175, 55, 0.3)'); // Gold
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5 + Math.sin(time + i * 0.5) * 0.5;

        // Draw flowing curved line
        ctx.moveTo(startX, baseY);
        
        for (let x = startX; x <= endX; x += 20) {
          const y = baseY + 
            Math.sin(x * 0.008 + time + i * 0.3) * 40 + 
            Math.sin(x * 0.003 + time * 0.7 + i * 0.2) * 25 +
            Math.sin(x * 0.015 + time * 0.5 + i * 0.1) * 15;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }

      // Draw additional flowing lines for more density
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        
        const startX = -100;
        const endX = canvas.width + 100;
        const baseY = canvas.height * 0.6 + i * 25;
        
        const gradient = ctx.createLinearGradient(startX, baseY, endX, baseY);
        gradient.addColorStop(0, 'rgba(64, 196, 180, 0.6)'); // Turquoise
        gradient.addColorStop(0.4, 'rgba(212, 175, 55, 0.5)'); // Gold
        gradient.addColorStop(0.8, 'rgba(194, 24, 91, 0.4)'); // Magenta
        gradient.addColorStop(1, 'rgba(64, 196, 180, 0.2)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + Math.sin(time * 1.2 + i * 0.4) * 0.3;

        ctx.moveTo(startX, baseY);
        
        for (let x = startX; x <= endX; x += 15) {
          const y = baseY + 
            Math.sin(x * 0.01 + time * 1.1 + i * 0.4) * 30 + 
            Math.sin(x * 0.005 + time * 0.8 + i * 0.3) * 20;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }

      // Update and draw scattered dot particles
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/waves-bg-2560.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-pink-500/20" />

      {/* Animated Canvas for flowing lines and particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Emergency Banner */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-6 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span>01273 453109</span>
            <span className="mx-4">•</span>
            <span>Shoreham-by-Sea, West Sussex</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-full text-xs font-semibold transition-colors">
              Emergency: 01273 453109
            </button>
            <button className="bg-teal-500 hover:bg-teal-600 px-4 py-1 rounded-full text-xs font-semibold transition-colors">
              Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-12 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">SMH</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">St Mary’s House</h1>
              <p className="text-sm text-slate-600">Dental Care</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-700 hover:text-pink-600 font-medium transition-colors">Home</Link>
            <Link href="/about" className="text-slate-700 hover:text-pink-600 font-medium transition-colors">About</Link>
            <Link href="/treatments" className="text-slate-700 hover:text-pink-600 font-medium transition-colors">Treatments</Link>
            <Link href="/team" className="text-slate-700 hover:text-pink-600 font-medium transition-colors">Team</Link>
            <Link href="/patient-stories" className="text-slate-700 hover:text-pink-600 font-medium transition-colors">Patient Stories</Link>
            <Link href="/blog" className="text-slate-700 hover:text-pink-600 font-medium transition-colors">Blog</Link>
            <Link href="/contact" className="text-slate-700 hover:text-pink-600 font-medium transition-colors">Contact</Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 border border-slate-300 rounded-full text-slate-700 hover:bg-slate-50 transition-colors">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </button>
            <button className="flex items-center px-6 py-2 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full hover:from-pink-600 hover:to-teal-600 transition-colors shadow-lg">
              <Calendar className="w-4 h-4 mr-2" />
              Book Free Consultation
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* 3D Technology Showcase Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass-chip inline-flex items-center px-4 py-2 border border-pink-200/60 mb-8"
        >
          <Sparkles className="w-5 h-5 text-pink-500 mr-2" />
          <span className="text-sm font-semibold text-slate-700">3D Technology Showcase</span>
        </motion.div>

        {/* Main Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Interactive
            </span>
            <br />
            <span className="text-slate-800">Dental Visualization</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Perfect Smile is Just
            <br />
            <span className="bg-gradient-to-r from-pink-500 to-teal-500 bg-clip-text text-transparent">
              One Click Away
            </span>
          </h2>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
            Experience the future of dentistry with our AI-powered 3D treatments, 
            luxury coastal setting, and award-winning patient care. 
            Book your consultation today and discover why we’re “Going the Extra Smile.”
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        >
          <button className="flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full font-bold text-lg hover:from-pink-600 hover:to-pink-700 transition-colors shadow-xl">
            <Play className="w-6 h-6 mr-3" />
            Book Free Consultation
          </button>
          <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-bold text-lg hover:from-teal-600 hover:to-teal-700 transition-colors shadow-xl">
            Try AI Smile Quiz
          </button>
        </motion.div>

        {/* Statistics Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-8"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-2">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-800">24/7 Emergency</div>
              <div className="text-sm text-slate-600">Call Us Now</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mb-2">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-800">CQC Outstanding Rating</div>
              <div className="text-sm text-slate-600">Same-Day Appointments</div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-2">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-800">98% Patient Satisfaction</div>
              <div className="text-sm text-slate-600">Coastal Location</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OriginalHeroSection;

