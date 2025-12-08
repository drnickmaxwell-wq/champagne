'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MotionValue,
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';

// Brand Colors: Magenta var(--smh-primary-magenta), Turquoise var(--smh-primary-teal), Gold var(--smh-accent-gold)
// Fonts: Montserrat headings, Lora body text

interface ParallaxScrollProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offset?: number;
}

export function ParallaxScroll({ 
  children, 
  speed = 0.5, 
  className = '',
  offset = 0 
}: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset + (speed * 100)]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed: number;
  className?: string;
  zIndex?: number;
}

export function ParallaxLayer({ 
  children, 
  speed, 
  className = '',
  zIndex = 1 
}: ParallaxLayerProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed * 1000]);

  return (
    <motion.div
      style={{ 
        y,
        zIndex,
        position: 'relative'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxHeroProps {
  backgroundImage?: string;
  children: React.ReactNode;
  height?: string;
  overlay?: boolean;
}

export function ParallaxHero({
  backgroundImage = '/waves-bg-2560.jpg',
  children,
  height = '100vh',
  overlay = true
}: ParallaxHeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 500]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, index) => ({
        index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 3,
        colorClass:
          index % 3 === 0
            ? 'bg-pink-400/30'
            : index % 3 === 1
            ? 'bg-teal-400/30'
            : 'bg-yellow-400/30',
      })),
    []
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{ height }}
    >
      {/* Parallax Background */}
      <motion.div
        style={{ 
          y,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
        className="absolute inset-0 w-full h-[120%]"
      />

      {/* Brand Gradient Overlay */}
      {overlay && (
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-teal-500/20 to-yellow-500/20"
        />
      )}

      {/* Floating Particles with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(config => (
          <ParallaxParticle
            key={config.index}
            scrollY={scrollY}
            config={config}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 h-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ParticleConfig {
  index: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  colorClass: string;
}

interface ParallaxParticleProps {
  scrollY: MotionValue<number>;
  config: ParticleConfig;
}

function ParallaxParticle({ scrollY, config }: ParallaxParticleProps) {
  const { index, left, top, delay, duration, colorClass } = config;
  const y = useTransform(scrollY, [0, 1000], [0, (index + 1) * 50]);

  return (
    <motion.div
      className={`absolute w-2 h-2 rounded-full ${colorClass}`}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        y,
      }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.2, 0.6, 0.2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  speed?: number;
  className?: string;
  reverse?: boolean;
}

export function ParallaxSection({ 
  children,
  backgroundImage,
  speed = 0.5,
  className = '',
  reverse = false
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    reverse ? [100, -100] : [-100, 100]
  );

  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 50}%`, `${-speed * 50}%`]
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <motion.div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: backgroundY,
          }}
          className="absolute inset-0 w-full h-[120%]"
        />
      )}
      
      <motion.div 
        style={{ y }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ScrollProgressProps {
  className?: string;
}

export function ScrollProgress({ className = '' }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ scaleX }}
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-teal-500 to-yellow-500 transform-gpu z-50 ${className}`}
    />
  );
}

interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxText({ 
  children, 
  speed = 0.3,
  className = '' 
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hook for parallax mouse movement
export function useParallaxMouse(strength: number = 0.1) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) * strength;
      const y = (e.clientY - window.innerHeight / 2) * strength;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);

  return mousePosition;
}

// Parallax container for multiple layers
interface ParallaxContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ParallaxContainer({ children, className = '' }: ParallaxContainerProps) {
  return (
    <div className={`relative ${className}`} style={{ perspective: '1000px' }}>
      {children}
    </div>
  );
}

