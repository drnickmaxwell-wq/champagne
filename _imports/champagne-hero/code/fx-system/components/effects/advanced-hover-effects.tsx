'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { easeInOutCubic, easeOutCubic, linearEase } from '@/lib/motion/easing';

// Brand Colors: Magenta var(--smh-primary-magenta), Turquoise var(--smh-primary-teal), Gold var(--smh-accent-gold)
// Fonts: Montserrat headings, Lora body text

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  strength = 0.3,
  className = '',
  onClick,
  disabled = false
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      {/* Magnetic Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-teal-500/20 to-yellow-500/20 rounded-full blur-xl"
        animate={{
          scale: isHovered ? 1.5 : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface LiquidButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export function LiquidButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick
}: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-pink-500 via-teal-500 to-yellow-500 text-white';
      case 'secondary':
        return 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700';
      case 'outline':
        return 'border-2 border-gradient-to-r from-pink-500 to-teal-500 text-slate-700 bg-transparent';
      default:
        return 'bg-gradient-to-r from-pink-500 via-teal-500 to-yellow-500 text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-full font-medium transition-all duration-300 ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Liquid Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-600 via-teal-600 to-yellow-600 rounded-full"
        style={{
          x: mousePosition.x - 50,
          y: mousePosition.y - 50,
        }}
        animate={{
          scale: isHovered ? 3 : 0,
          opacity: isHovered ? 0.8 : 0
        }}
        transition={{ duration: 0.4, ease: easeOutCubic }}
      />
      
      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        style={{
          x: mousePosition.x - 25,
          y: mousePosition.y - 25,
        }}
        animate={{
          scale: isHovered ? 2 : 0,
          opacity: isHovered ? 0.3 : 0
        }}
        transition={{ duration: 0.6, ease: easeOutCubic }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function FloatingCard({
  children,
  className = '',
  intensity = 1
}: FloatingCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10 * intensity, -10 * intensity]);
  const rotateY = useTransform(x, [-100, 100], [-10 * intensity, 10 * intensity]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    x.set(deltaX);
    y.set(deltaY);
    
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}
        animate={{
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-teal-500/20 to-yellow-500/20 rounded-xl blur-lg"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <div className="relative z-10 bg-white/90 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl">
        {children}
      </div>
    </motion.div>
  );
}

interface MorphingIconProps {
  icon1: React.ReactNode;
  icon2: React.ReactNode;
  isToggled: boolean;
  className?: string;
  onClick?: () => void;
}

export function MorphingIcon({
  icon1,
  icon2,
  isToggled,
  className = '',
  onClick
}: MorphingIconProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{
          rotateY: isToggled ? 180 : 0,
          scale: isToggled ? 0.8 : 1
        }}
        transition={{ duration: 0.4, ease: easeInOutCubic }}
        className="relative"
      >
        <motion.div
          animate={{
            opacity: isToggled ? 0 : 1,
            scale: isToggled ? 0.5 : 1
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {icon1}
        </motion.div>
        
        <motion.div
          animate={{
            opacity: isToggled ? 1 : 0,
            scale: isToggled ? 1 : 0.5
          }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          {icon2}
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'pink' | 'teal' | 'yellow' | 'gradient';
  intensity?: number;
}

export function GlowingBorder({
  children,
  className = '',
  glowColor = 'gradient',
  intensity = 1
}: GlowingBorderProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getGlowColor = () => {
    switch (glowColor) {
      case 'pink':
        return 'from-pink-500 to-pink-600';
      case 'teal':
        return 'from-teal-500 to-teal-600';
      case 'yellow':
        return 'from-yellow-500 to-yellow-600';
      case 'gradient':
      default:
        return 'from-pink-500 via-teal-500 to-yellow-500';
    }
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Border */}
      <motion.div
        className={`absolute -inset-0.5 bg-gradient-to-r ${getGlowColor()} rounded-xl opacity-0 blur-sm`}
        animate={{
          opacity: isHovered ? intensity : 0,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Rotating Border */}
      <motion.div
        className={`absolute -inset-0.5 bg-gradient-to-r ${getGlowColor()} rounded-xl opacity-0`}
        animate={{
          opacity: isHovered ? intensity * 0.5 : 0,
          rotate: isHovered ? 360 : 0
        }}
        transition={{ 
          opacity: { duration: 0.3 },
          rotate: { duration: 2, repeat: Infinity, ease: linearEase }
        }}
      />
      
      {/* Content */}
      <div className="relative bg-white rounded-xl">
        {children}
      </div>
    </div>
  );
}

interface PulsingElementProps {
  children: React.ReactNode;
  className?: string;
  color?: 'pink' | 'teal' | 'yellow';
  intensity?: number;
  speed?: number;
}

export function PulsingElement({
  children,
  className = '',
  color = 'pink',
  intensity = 1,
  speed = 2
}: PulsingElementProps) {
  const getColor = () => {
    switch (color) {
      case 'pink':
        return 'rgba(194, 24, 91, 0.3)';
      case 'teal':
        return 'rgba(64, 196, 180, 0.3)';
      case 'yellow':
        return 'rgba(212, 175, 55, 0.3)';
      default:
        return 'rgba(194, 24, 91, 0.3)';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Pulsing Background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: getColor() }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [intensity, intensity * 0.5, intensity]
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: easeInOutCubic
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Hook for mouse tracking
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
}

