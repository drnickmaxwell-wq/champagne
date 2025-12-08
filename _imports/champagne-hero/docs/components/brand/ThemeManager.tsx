'use client';

import React, { useEffect, useState } from 'react';
import './theme-manager.css';

export default function ThemeManager() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    // Determine initial theme based on time of day and system preference
    const determineTheme = (): 'light' | 'dark' => {
      const hour = new Date().getHours();
      
      // Time-of-day logic: Light mode 8 AM–6 PM, Dark mode 6 PM–8 AM
      if (hour >= 8 && hour < 18) {
        return 'light';
      } else {
        return 'dark';
      }
    };

    // Check for system preference override
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Use time-of-day logic by default, but respect system preference if set
    const initialTheme = prefersDark ? 'dark' : determineTheme();
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      handleThemeChange(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Check time of day every minute to auto-switch themes
    const intervalId = setInterval(() => {
      const currentTheme = determineTheme();
      if (currentTheme !== theme) {
        handleThemeChange(currentTheme);
      }
    }, 60000); // Check every minute

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearInterval(intervalId);
    };
  }, [theme]);

  // Champagne Lock: Dark-mode wave bloom fade on idle
  useEffect(() => {
    if (theme !== 'dark') return;

    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      setIsIdle(false);
      document.documentElement.classList.remove('idle-mode');
      clearTimeout(idleTimer);
      
      idleTimer = setTimeout(() => {
        setIsIdle(true);
        document.documentElement.classList.add('idle-mode');
      }, 2000); // 2s of idle time
    };

    // Listen for user activity
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);

    // Initialize timer
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      document.documentElement.classList.remove('idle-mode');
    };
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setIsTransitioning(true);
    
    // Add gold fade transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    document.body.appendChild(overlay);

    setTimeout(() => {
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }, 500); // Half of 1s transition

    setTimeout(() => {
      setIsTransitioning(false);
      document.body.removeChild(overlay);
    }, 1000); // Full 1s transition
  };

  return null; // This component only manages theme state, no visual output
}

