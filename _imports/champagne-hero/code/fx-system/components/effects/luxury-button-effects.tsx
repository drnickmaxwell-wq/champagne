'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LuxuryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: 'none' | 'subtle' | 'medium' | 'strong' | 'pulse';
  shimmer?: boolean;
  ripple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
}

const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  glow = 'medium',
  shimmer = true,
  ripple = true,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  href,
  target,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Variant configurations with brand colors
  const variants = {
    primary: {
      base: 'bg-gradient-to-r from-pink-500 to-teal-500 text-white',
      hover: 'from-pink-600 to-teal-600',
      glow: 'shadow-lg shadow-pink-500/25',
      glowHover: 'shadow-xl shadow-pink-500/40',
    },
    secondary: {
      base: 'bg-gradient-to-r from-teal-500 to-yellow-500 text-white',
      hover: 'from-teal-600 to-yellow-600',
      glow: 'shadow-lg shadow-teal-500/25',
      glowHover: 'shadow-xl shadow-teal-500/40',
    },
    accent: {
      base: 'bg-gradient-to-r from-yellow-500 to-pink-500 text-white',
      hover: 'from-yellow-600 to-pink-600',
      glow: 'shadow-lg shadow-yellow-500/25',
      glowHover: 'shadow-xl shadow-yellow-500/40',
    },
    ghost: {
      base: 'bg-transparent text-slate-700 border border-slate-200',
      hover: 'bg-gradient-to-r from-pink-50 to-teal-50 border-pink-200',
      glow: 'shadow-md shadow-slate-200/50',
      glowHover: 'shadow-lg shadow-pink-200/50',
    },
    outline: {
      base: 'bg-transparent text-pink-600 border-2 border-gradient-to-r from-pink-500 to-teal-500',
      hover: 'bg-gradient-to-r from-pink-50 to-teal-50',
      glow: 'shadow-md shadow-pink-500/20',
      glowHover: 'shadow-lg shadow-pink-500/30',
    },
  };

  // Size configurations
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-2xl',
  };

  // Glow configurations
  const glowIntensities = {
    none: '',
    subtle: 'drop-shadow-sm',
    medium: 'drop-shadow-md',
    strong: 'drop-shadow-lg',
    pulse: 'drop-shadow-lg animate-pulse',
  };

  const variantConfig = variants[variant];
  const sizeConfig = sizes[size];
  const glowConfig = glowIntensities[glow];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.();
  };

  const buttonContent = (
    <motion.button
      type={type}
      className={`
        relative overflow-hidden font-semibold transition-all duration-300 
        ${variantConfig.base} ${sizeConfig} ${glowConfig}
        ${isHovered ? variantConfig.hover : ''}
        ${isHovered ? variantConfig.glowHover : variantConfig.glow}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
      style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Shimmer overlay */}
      {shimmer && !disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {children}
      </div>

      {/* Glow effect overlay */}
      {glow === 'pulse' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-teal-500/20 rounded-inherit"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  );

  // If href is provided, wrap in a link
  if (href) {
    return (
      <a href={href} target={target} className="inline-block">
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
};

interface FloatingActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  pulse?: boolean;
  tooltip?: string;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  children,
  onClick,
  position = 'bottom-right',
  size = 'md',
  color = 'primary',
  pulse = false,
  tooltip,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const colors = {
    primary: 'bg-gradient-to-r from-pink-500 to-teal-500 shadow-lg shadow-pink-500/25',
    secondary: 'bg-gradient-to-r from-teal-500 to-yellow-500 shadow-lg shadow-teal-500/25',
    accent: 'bg-gradient-to-r from-yellow-500 to-pink-500 shadow-lg shadow-yellow-500/25',
  };

  return (
    <div className={`${positions[position]} z-50`}>
      <motion.button
        className={`
          ${sizes[size]} ${colors[color]}
          rounded-full flex items-center justify-center text-white
          transition-all duration-300 hover:scale-110 hover:shadow-xl
          ${className}
        `}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={pulse ? {
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 10px 25px rgba(236, 72, 153, 0.25)',
            '0 15px 35px rgba(236, 72, 153, 0.4)',
            '0 10px 25px rgba(236, 72, 153, 0.25)',
          ],
        } : undefined}
        transition={pulse ? {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        } : { type: 'spring', stiffness: 400, damping: 17 }}
      >
        {children}

        {/* Pulse ring */}
        {pulse && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`
              absolute bg-slate-800 text-white px-3 py-2 rounded-lg text-sm
              whitespace-nowrap pointer-events-none z-10
              ${position.includes('right') ? 'right-full mr-3' : 'left-full ml-3'}
              ${position.includes('bottom') ? 'bottom-0' : 'top-0'}
            `}
            style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
          >
            {tooltip}
            <div
              className={`
                absolute w-2 h-2 bg-slate-800 transform rotate-45
                ${position.includes('right') ? 'right-0 translate-x-1' : 'left-0 -translate-x-1'}
                ${position.includes('bottom') ? 'bottom-3' : 'top-3'}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'normal',
  className = '',
}) => {
  const spacingConfig = {
    tight: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    normal: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    loose: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6',
  };

  const orientationConfig = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div className={`flex ${orientationConfig} ${spacingConfig[spacing]} ${className}`}>
      {children}
    </div>
  );
};

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  tooltip?: string;
  disabled?: boolean;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  glow = false,
  tooltip,
  disabled = false,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-teal-500 text-white hover:from-pink-600 hover:to-teal-600',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <div className="relative">
      <motion.button
        className={`
          ${variants[variant]} ${sizes[size]}
          rounded-lg flex items-center justify-center
          transition-all duration-200
          ${glow ? 'shadow-lg hover:shadow-xl' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        {icon}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10"
            style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
          >
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export {
  LuxuryButton,
  FloatingActionButton,
  ButtonGroup,
  IconButton,
};

