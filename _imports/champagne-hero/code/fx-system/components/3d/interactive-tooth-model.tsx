'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { easeInOutCubic, linearEase } from '@/lib/motion/easing';
import { Play, Pause, RotateCcw, Info, Sparkles } from 'lucide-react';
import * as THREE from 'three';
import {
  getBrandColor,
  SMH_BRAND_COLOR_FALLBACKS,
} from '@/lib/brand/palette';
import { TOKENS as NEUTRAL_TOKENS } from '@/styles/tokens/neutrals';

// Brand Colors: Magenta var(--smh-primary-magenta), Turquoise var(--smh-primary-teal), Gold var(--smh-accent-gold)
// Fonts: Montserrat headings, Lora body text

const defaultBrandColors: Record<'magenta' | 'teal' | 'gold', string> = {
  magenta: SMH_BRAND_COLOR_FALLBACKS.magenta,
  teal: SMH_BRAND_COLOR_FALLBACKS.teal,
  gold: SMH_BRAND_COLOR_FALLBACKS.gold,
};

function useBrandColors() {
  const [brandColors, setBrandColors] = useState(defaultBrandColors);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setBrandColors({
      magenta: getBrandColor('magenta'),
      teal: getBrandColor('teal'),
      gold: getBrandColor('gold'),
    });
  }, []);

  return brandColors;
}

interface ToothModelProps {
  treatmentType: 'veneer' | 'implant' | 'whitening' | '3d-scan';
  title: string;
  description: string;
  beforeColor?: string;
  afterColor?: string;
}

// Optimized 3D Tooth Component with lazy loading
function ToothModel({
  treatmentType,
  beforeColor = NEUTRAL_TOKENS.champagne,
  afterColor = NEUTRAL_TOKENS.white,
  showAfter = false,
}: {
  treatmentType: string;
  beforeColor?: string;
  afterColor?: string;
  showAfter?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isAnimating = true;
  const brandColors = useBrandColors();

  useFrame((state) => {
    if (meshRef.current && isAnimating) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // Create tooth geometry based on treatment type
  const createToothGeometry = () => {
    switch (treatmentType) {
      case 'veneer':
        return new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
      case 'implant':
        return new THREE.ConeGeometry(0.3, 1.5, 8);
      case 'whitening':
        return new THREE.CylinderGeometry(0.35, 0.4, 1.3, 12);
      default:
        return new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
    }
  };

  const geometry = createToothGeometry();
  const currentColor = showAfter ? afterColor : beforeColor;

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          color={currentColor}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.1}
          thickness={0.5}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh geometry={geometry} position={[0, 0, 0]} scale={1.05}>
        <meshBasicMaterial
          color={showAfter ? brandColors.teal : brandColors.magenta}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * Math.PI * 2 / 8) * 2,
            Math.cos(i * Math.PI * 2 / 8) * 0.5,
            Math.cos(i * Math.PI * 2 / 8) * 2
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? brandColors.magenta : i % 3 === 1 ? brandColors.teal : brandColors.gold}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Treatment-specific elements */}
      {treatmentType === 'veneer' && showAfter && (
        <mesh position={[0, 0, 0.31]}>
          <planeGeometry args={[0.6, 1.2]} />
          <meshPhysicalMaterial
            color={afterColor}
            roughness={0.05}
            metalness={0.1}
            clearcoat={1}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {treatmentType === 'implant' && (
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.8]} />
          <meshPhysicalMaterial
            color={NEUTRAL_TOKENS.silver}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

// Loading component with brand styling (moved outside Canvas)
function ModelLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: linearEase }}
        className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full mb-4"
      />
      <p 
        className="text-slate-600 text-center"
        style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
      >
        Loading 3D Model...
      </p>
    </div>
  );
}

export default function InteractiveToothModel({
  treatmentType, 
  title, 
  description, 
  beforeColor, 
  afterColor 
}: ToothModelProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAfter, setShowAfter] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const controlsRef = useRef<{ reset: () => void } | null>(null);
  const brandColors = useBrandColors();

  const handleControlsRef = (instance: unknown) => {
    if (
      instance &&
      typeof instance === 'object' &&
      'reset' in instance &&
      typeof (instance as { reset?: unknown }).reset === 'function'
    ) {
      controlsRef.current = instance as { reset: () => void };
    } else {
      controlsRef.current = null;
    }
  };

  useEffect(() => {
    // Simulate loading delay for optimization
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const resetView = () => {
    controlsRef.current?.reset();
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleComparison = () => {
    setShowAfter(!showAfter);
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl overflow-hidden shadow-2xl">
      {/* Wave Background Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/waves-bg-2560.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Brand Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-teal-500/5 to-yellow-500/5" />

      {/* Micro-Bubble Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 3 === 0 ? 'bg-pink-400/20' : 
              i % 3 === 1 ? 'bg-teal-400/20' : 'bg-yellow-400/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -10, 0],
              x: [0, Math.random() * 5 - 2.5, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: easeInOutCubic
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 right-6 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 
              className="text-2xl font-bold text-slate-800 mb-2"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {title}
            </h3>
            <p 
              className="text-slate-600 max-w-md"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
            >
              {description}
            </p>
          </div>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Info className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-full">
        {isLoaded ? (
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls
              ref={handleControlsRef}
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={8}
              autoRotate={isPlaying}
              autoRotateSpeed={2}
            />
            
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color={brandColors.teal} />
            <pointLight position={[10, -10, -5]} intensity={0.5} color={brandColors.magenta} />
            
            <Suspense fallback={null}>
              <ToothModel
                treatmentType={treatmentType}
                beforeColor={beforeColor}
                afterColor={afterColor}
                showAfter={showAfter}
              />
              <Environment preset="studio" />
              <ContactShadows
                position={[0, -2, 0]}
                opacity={0.3}
                scale={10}
                blur={2}
                far={2}
              />
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex items-center justify-center h-full">
            <ModelLoader />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAnimation}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-slate-600" />
              ) : (
                <Play className="w-5 h-5 text-slate-600" />
              )}
            </button>
            
            <button
              onClick={resetView}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {(treatmentType === 'veneer' || treatmentType === 'whitening') && (
            <button
              onClick={toggleComparison}
              className={`px-6 py-3 rounded-full font-semibold transition-all shadow-lg ${
                showAfter
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                  : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
              }`}
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              {showAfter ? 'After Treatment' : 'Before Treatment'}
            </button>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-sm shadow-2xl z-20"
          >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h4 
                  className="text-xl font-bold text-slate-800"
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                >
                  3D Model Info
                </h4>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-slate-700 mb-2">Treatment Type</h5>
                  <p 
                    className="text-slate-600 text-sm"
                    style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  >
                    {treatmentType.charAt(0).toUpperCase() + treatmentType.slice(1).replace('-', ' ')}
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-700 mb-2">Interaction Guide</h5>
                  <ul 
                    className="text-slate-600 text-sm space-y-1"
                    style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  >
                    <li>• Drag to rotate the model</li>
                    <li>• Scroll to zoom in/out</li>
                    <li>• Click play/pause to control animation</li>
                    <li>• Use reset to return to original view</li>
                    {(treatmentType === 'veneer' || treatmentType === 'whitening') && (
                      <li>• Toggle before/after comparison</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-slate-700 mb-2">Technology</h5>
                  <p 
                    className="text-slate-600 text-sm"
                    style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  >
                    Powered by WebGL and Three.js for smooth 3D rendering with optimized performance and lazy loading.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

