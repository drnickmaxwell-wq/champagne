'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { easeInOutCubic, easeOutCubic, linearEase } from '@/lib/motion/easing';

const FALLBACK_MOTION_CAP = 6;

const getMotionCap = () => {
  if (typeof window === 'undefined') {
    return FALLBACK_MOTION_CAP;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue('--smh-parallax-max');
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : FALLBACK_MOTION_CAP;
};

interface HoverCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
  glowEffect?: boolean;
  rotateOnHover?: boolean;
}

const HoverCard3D: React.FC<HoverCard3DProps> = ({
  children,
  className = '',
  intensity = 'medium',
  glowEffect = true,
  rotateOnHover = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const intensityConfig = {
    subtle: { rotate: 5, scale: 1.02 },
    medium: { rotate: 10, scale: 1.05 },
    strong: { rotate: 15, scale: 1.08 },
  };

  const config = intensityConfig[intensity];

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [config.rotate, -config.rotate]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-config.rotate, config.rotate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative smh-anim ${className}`}
      style={{
        rotateX: prefersReducedMotion || !rotateOnHover ? undefined : rotateX,
        rotateY: prefersReducedMotion || !rotateOnHover ? undefined : rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseEnter={() => !prefersReducedMotion && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={prefersReducedMotion ? undefined : { scale: config.scale }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}

      {/* Glow effect */}
      {glowEffect && isHovered && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-teal-500/20 to-yellow-500/20 rounded-inherit blur-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

interface ParallaxElementProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const elementRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastKnownScroll = useRef(0);
  const motionCapRef = useRef(FALLBACK_MOTION_CAP);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (elementRef.current) {
        elementRef.current.style.transform = 'none';
      }
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    motionCapRef.current = getMotionCap();

    const applyTransform = () => {
      const rawOffset = lastKnownScroll.current * speed;
      const maxOffset = motionCapRef.current;
      const offset = Math.max(Math.min(rawOffset, maxOffset), -maxOffset);
      let transform: string;

      switch (direction) {
        case 'down':
          transform = `translateY(${offset}px)`;
          break;
        case 'left':
          transform = `translateX(-${offset}px)`;
          break;
        case 'right':
          transform = `translateX(${offset}px)`;
          break;
        case 'up':
        default:
          transform = `translateY(-${offset}px)`;
          break;
      }

      element.style.transform = transform;
      frameRef.current = null;
    };

    const handleScroll = () => {
      lastKnownScroll.current = window.scrollY;

      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(applyTransform);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [direction, speed, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={`smh-anim ${className}`}>
      {children}
    </div>
  );
};

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.3,
  className = '',
  onClick,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.5 });
  const motionCapRef = useRef(FALLBACK_MOTION_CAP);

  useEffect(() => {
    motionCapRef.current = getMotionCap();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    const maxOffset = motionCapRef.current;
    const clamp = (value: number) => Math.max(Math.min(value, maxOffset), -maxOffset);

    x.set(clamp(deltaX));
    y.set(clamp(deltaY));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative smh-anim ${className}`}
      style={{
        fontFamily: 'var(--font-inter), system-ui, Arial',
        x: prefersReducedMotion ? 0 : springX,
        y: prefersReducedMotion ? 0 : springY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseMove={prefersReducedMotion ? undefined : handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

interface FloatingGeometryProps {
  shape?: 'circle' | 'square' | 'triangle' | 'hexagon';
  size?: 'sm' | 'md' | 'lg';
  color?: 'magenta' | 'turquoise' | 'gold';
  animation?: 'float' | 'rotate' | 'pulse' | 'orbit';
  className?: string;
}

const FloatingGeometry: React.FC<FloatingGeometryProps> = ({
  shape = 'circle',
  size = 'md',
  color = 'magenta',
  animation = 'float',
  className = '',
}) => {
  const gradients = {
    magenta: 'var(--smh-micro-magenta)',
    turquoise: 'var(--smh-micro-teal)',
    gold: 'var(--smh-micro-gold)',
  } as const;

  const shadows = {
    magenta: 'var(--smh-micro-magenta-shadow)',
    turquoise: 'var(--smh-micro-teal-shadow)',
    gold: 'var(--smh-micro-gold-shadow)',
  } as const;

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-lg',
    triangle: 'rounded-sm',
    hexagon: 'rounded-lg',
  };

  const animations = {
    float: {
      y: [-6, 6, -6],
      transition: { duration: 4, repeat: Infinity, ease: easeInOutCubic },
    },
    rotate: {
      rotate: [0, 360],
      transition: { duration: 8, repeat: Infinity, ease: linearEase },
    },
    pulse: {
      scale: [1, 1.08, 1],
      opacity: [0.7, 1, 0.7],
      transition: { duration: 2, repeat: Infinity, ease: easeInOutCubic },
    },
    orbit: {
      rotate: [0, 360],
      transition: { duration: 10, repeat: Infinity, ease: linearEase },
    },
  };

  return (
    <motion.div
      className={`smh-anim ${sizes[size]} ${shapes[shape]} ${className}`}
      style={{
        background: gradients[color],
        boxShadow: shadows[color],
      }}
      animate={animations[animation]}
    />
  );
};

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
}

const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  onClick,
  className = '',
  color = 'primary',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonGradients = {
    primary: 'var(--smh-liquid-primary)',
    secondary: 'var(--smh-liquid-secondary)',
    accent: 'var(--smh-liquid-accent)',
  } as const;

  return (
    <motion.button
      className={`
        relative px-8 py-4 rounded-full text-white font-semibold overflow-hidden
        smh-anim ${className}
      `}
      style={{
        fontFamily: 'var(--font-inter), system-ui, Arial',
        background: buttonGradients[color],
        boxShadow: isHovered ? 'var(--smh-liquid-shadow)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Liquid effect */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={isHovered ? { clipPath: 'circle(100% at 50% 50%)' } : { clipPath: 'circle(0% at 50% 50%)' }}
        transition={{ duration: 0.5, ease: easeInOutCubic }}
      />

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-full"
        animate={isHovered ? {
          scale: [1, 1.2, 1],
          opacity: [0, 0.5, 0],
        } : {}}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
}) => {
  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
  };

  const initialDirection = directions[direction];

  return (
    <motion.div
      className={`smh-anim ${className}`.trim()}
      initial={{
        opacity: 0,
        y: initialDirection.y,
        x: initialDirection.x
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0 
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration, 
        delay, 
        ease: easeOutCubic
      }}
    >
      {children}
    </motion.div>
  );
};

interface StaggeredRevealProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

const StaggeredReveal: React.FC<StaggeredRevealProps> = ({
  children,
  staggerDelay = 0.1,
  className = '',
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          delay={index * staggerDelay}
          direction="up"
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

interface MorphingShapeProps {
  shapes: string[];
  duration?: number;
  className?: string;
  color?: string;
}

const MorphingShape: React.FC<MorphingShapeProps> = ({
  shapes,
  duration = 3,
  className = '',
  color = 'var(--smh-primary-magenta)',
}) => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShapeIndex((prev) => (prev + 1) % shapes.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [shapes.length, duration]);

  return (
    <motion.div className={`relative smh-anim ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.path
          d={shapes[currentShapeIndex]}
          fill={color}
          animate={{ d: shapes[currentShapeIndex] }}
          transition={{ duration: duration * 0.8, ease: easeInOutCubic }}
        />
      </svg>
    </motion.div>
  );
};

export {
  HoverCard3D,
  ParallaxElement,
  MagneticButton,
  FloatingGeometry,
  LiquidButton,
  ScrollReveal,
  StaggeredReveal,
  MorphingShape,
};

