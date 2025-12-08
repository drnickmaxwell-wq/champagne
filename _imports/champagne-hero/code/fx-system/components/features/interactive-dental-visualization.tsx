'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { easeInOutCubic, linearEase } from '@/lib/motion/easing';
import { Play, Sparkles, ArrowRight, Zap, Heart } from 'lucide-react';

const InteractiveDentalVisualization = () => {
  const [activeDemo, setActiveDemo] = useState('3d-scanning');

  const demos = [
    {
      id: '3d-scanning',
      title: '3D Intraoral Scanning',
      description: 'Experience our revolutionary 3D scanning technology',
      icon: Sparkles,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'ai-diagnosis',
      title: 'AI-Powered Diagnosis',
      description: 'Advanced AI analyzes your dental health instantly',
      icon: Zap,
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'smile-preview',
      title: 'Smile Preview Technology',
      description: 'See your perfect smile before treatment begins',
      icon: Heart,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Wave Background - Brand Consistent */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/waves-bg-2560.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Brand Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-teal-500/15 to-yellow-500/20" />

      {/* Micro-Bubble Animations - Brand Consistent */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Micro Bubbles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              i % 3 === 0 ? 'bg-pink-400/40' : 
              i % 3 === 1 ? 'bg-teal-400/40' : 'bg-yellow-400/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: easeInOutCubic
            }}
          />
        ))}
        
        {/* Larger Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className={`absolute w-4 h-4 rounded-full ${
              i % 3 === 0 ? 'bg-pink-300/30' : 
              i % 3 === 1 ? 'bg-teal-300/30' : 'bg-yellow-300/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: easeInOutCubic
            }}
          />
        ))}

        {/* Flowing Wave Lines - Brand Colors */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--smh-primary-magenta)" stopOpacity="0.6" />
              <stop offset="50%" stopColor="var(--smh-primary-teal)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--smh-accent-gold)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,300 Q480,200 960,300 T1920,300"
            stroke="url(#waveGradient1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: easeInOutCubic }}
          />
          <motion.path
            d="M0,500 Q480,600 960,500 T1920,500"
            stroke="url(#waveGradient1)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, delay: 1, repeat: Infinity, ease: easeInOutCubic }}
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-pink-200 mb-6">
            <Sparkles className="w-5 h-5 text-pink-500 mr-2" />
            <span className="text-sm font-semibold text-slate-700">Interactive Technology</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
              Interactive
            </span>
            <br />
            <span className="text-slate-800">Dental Visualization</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore interactive demos of our cutting-edge dental technology. 
            See how we’re revolutionizing dental care with AI, 3D scanning, and advanced visualization.
          </p>
        </motion.div>

        {/* Interactive Demo Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {demos.map((demo) => {
              const IconComponent = demo.icon;
              const isActive = activeDemo === demo.id;
              
              return (
                <motion.button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white shadow-xl border-2 border-pink-200' 
                      : 'bg-white/50 hover:bg-white/80 border border-slate-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${demo.color} mr-4 flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {demo.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {demo.description}
                      </p>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-slate-200"
                        >
                          <button className="flex items-center text-pink-600 font-semibold hover:text-pink-700 transition-colors">
                            <Play className="w-4 h-4 mr-2" />
                            Start Interactive Demo
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Demo Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl">
              {/* Demo Screen */}
              <div className="bg-gradient-to-br from-pink-500/20 to-teal-500/20 rounded-2xl p-8 mb-6 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                    ease: linearEase
                    }}
                    className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-pink-400/30 to-transparent rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1.2, 1, 1.2],
                      rotate: [360, 180, 0],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                    ease: linearEase
                    }}
                    className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-teal-400/30 to-transparent rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                    ease: easeInOutCubic
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full"
                  />
                </div>

                {/* Demo Content */}
                <div className="relative z-10 text-center">
                  <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-white"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      {demos.find(d => d.id === activeDemo)?.title}
                    </h3>
                    <p className="text-white/80 mb-6">
                      Interactive demo loading...
                    </p>
                    <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-teal-600 transition-colors shadow-lg">
                      Start Demo
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Demo Controls */}
              <div className="flex items-center justify-between text-white/60">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm">
                  Interactive Demo • 3D Technology
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: easeInOutCubic
              }}
              className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg"
            />
            
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: easeInOutCubic,
                delay: 1
              }}
              className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full shadow-lg"
            />
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full font-bold text-lg hover:from-pink-600 hover:to-teal-600 transition-colors shadow-xl">
            <Sparkles className="w-6 h-6 mr-3" />
            Learn More About Our Technology
            <ArrowRight className="w-6 h-6 ml-3" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveDentalVisualization;

