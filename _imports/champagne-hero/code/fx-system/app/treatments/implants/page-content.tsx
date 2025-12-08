'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { easeInOutCubic } from '@/lib/motion/easing';
import Link from 'next/link';
import InteractiveToothModel from '@/components/3d/interactive-tooth-model';
import { TOKENS as NEUTRAL_TOKENS } from '@/styles/tokens/neutrals';
import {
  Circle,
  Shield,
  Clock,
  Heart,
  Star,
  CheckCircle,
  Award,
  Users
} from 'lucide-react';

const benefits = [
  {
    icon: Heart,
    title: 'Natural Feel',
    description: 'Implants function exactly like your natural teeth for eating and speaking.'
  },
  {
    icon: Shield,
    title: 'Bone Preservation',
    description: 'Titanium implants stimulate bone growth and prevent facial collapse.'
  },
  {
    icon: Clock,
    title: 'Lifetime Solution',
    description: 'With proper care, dental implants can last a lifetime.'
  },
  {
    icon: Star,
    title: 'Perfect Aesthetics',
    description: 'Custom crowns match your natural teeth perfectly in color and shape.'
  }
];

const types = [
  {
    title: 'Single Tooth Implant',
    description: 'Replace one missing tooth without affecting adjacent healthy teeth.',
    features: ['Preserves neighboring teeth', 'Natural appearance', 'Easy maintenance', 'Long-lasting solution'],
    icon: Circle,  },
  {
    title: 'Multiple Implants',
    description: 'Replace several missing teeth with individual implants or implant-supported bridges.',
    features: ['Stable chewing function', 'Prevents bone loss', 'Natural speech', 'Improved confidence'],
    icon: Users
  },
  {
    title: 'All-on-4® Treatment',
    description: 'Full arch restoration using just four strategically placed implants.',
    features: ['Same-day teeth', 'Minimal surgery', 'Cost-effective', 'Immediate function'],
    icon: Award
  }
];

const process = [
  {
    phase: 'Consultation & Planning',
    duration: '1-2 visits',
    description: 'Comprehensive examination, 3D imaging, and treatment planning.',
    details: [
      'Digital X-rays and 3D CT scans',
      'Bone density evaluation',
      'Treatment plan development',
      'Cost and timeline discussion'
    ]
  },
  {
    phase: 'Implant Placement',
    duration: '1-2 hours',
    description: 'Precise surgical placement of titanium implant in the jawbone.',
    details: [
      'Local anesthesia or sedation',
      'Minimally invasive surgery',
      'Immediate temporary crown (if suitable)',
      'Post-operative care instructions'
    ]
  },
  {
    phase: 'Healing & Integration',
    duration: '3-6 months',
    description: 'Osseointegration process where implant fuses with bone.',
    details: [
      'Regular check-ups',
      'Soft diet recommendations',
      'Oral hygiene instructions',
      'Temporary restoration if needed'
    ]
  },
  {
    phase: 'Crown Placement',
    duration: '2-3 visits',
    description: 'Custom crown fabrication and final restoration placement.',
    details: [
      'Digital impressions',
      'Crown design and fabrication',
      'Final fitting and adjustments',
      'Bite optimization'
    ]
  }
];

const candidateFactors = [
  {
    factor: 'Adequate Bone Density',
    description: 'Sufficient jawbone to support the implant (bone grafting available if needed)'
  },
  {
    factor: 'Healthy Gums',
    description: 'Good periodontal health or treated gum disease'
  },
  {
    factor: 'Good Overall Health',
    description: 'No uncontrolled medical conditions that affect healing'
  },
  {
    factor: 'Non-Smoker',
    description: 'Smoking significantly reduces implant success rates'
  },
  {
    factor: 'Commitment to Oral Hygiene',
    description: 'Willingness to maintain excellent oral care and regular check-ups'
  },
  {
    factor: 'Realistic Expectations',
    description: 'Understanding of the treatment process and timeline'
  }
];

export default function ImplantsPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section with Wave Background */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Wave Background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/waves-bg-2560.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Brand Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-teal-500/20 to-yellow-500/20" />
        
        {/* Micro-Bubble Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-pink-400/30' : 
                i % 3 === 1 ? 'bg-teal-400/30' : 'bg-yellow-400/30'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: easeInOutCubic
              }}
            />
          ))}
        </div>

        {/* Flowing Wave Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--smh-primary-magenta)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--smh-primary-teal)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--smh-accent-gold)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,400 Q300,200 600,400 T1200,400"
              stroke="url(#waveGradient2)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: easeInOutCubic }}
            />
            <motion.path
              d="M0,450 Q400,250 800,450 T1200,450"
              stroke="url(#waveGradient2)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4, repeat: Infinity, ease: easeInOutCubic, delay: 1 }}
            />
          </svg>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-pink-500 to-teal-500 mb-6">
              <Circle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-teal-600 to-yellow-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Dental Implants
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
              Restore your smile with the gold standard in tooth replacement. 
              Our advanced implant treatments provide permanent, natural-looking solutions that last a lifetime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3D Interactive Model Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Interactive 3D Implant Preview
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
              Explore how dental implants replace missing teeth. See the titanium implant, abutment, and crown in stunning 3D detail.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <InteractiveToothModel
              treatmentType="implant"
              title="Complete Dental Implant System"
              description="See how titanium implants integrate with bone to create a permanent tooth replacement"
              beforeColor={NEUTRAL_TOKENS.champagne}
              afterColor={NEUTRAL_TOKENS.white}
            />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Why Choose Dental Implants?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Dental implants are the most advanced and effective solution for replacing missing teeth, 
              offering unmatched stability, function, and aesthetics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Types Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Implant Treatment Options
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We offer comprehensive implant solutions for every situation, 
              from single tooth replacement to full mouth restoration.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {types.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    {type.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {type.description}
                  </p>
                  <div className="space-y-3">
                    {type.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              The Implant Process
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our systematic approach ensures optimal results and patient comfort 
              throughout your implant journey.
            </p>
          </motion.div>

          <div className="space-y-12">
            {process.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">{phase.phase}</h3>
                      <p className="text-green-600 font-medium">{phase.duration}</p>
                    </div>
                  </div>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {phase.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {phase.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-8 h-80 flex items-center justify-center shadow-lg">
                    <Circle className="w-32 h-32 text-green-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidate Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Are You a Candidate?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Most people are excellent candidates for dental implants. 
              Here are the key factors we evaluate during your consultation.
            </p>
          </motion.div>

          <div className="space-y-6">
            {candidateFactors.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6"
              >
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{item.factor}</h3>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Restore Your Smile Today
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Take the first step towards a permanent solution for missing teeth. 
              Schedule your implant consultation and discover if implants are right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg"
                >
                  Book Implant Consultation
                </motion.button>
              </Link>
              <Link href="/treatments">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-green-600 transition-colors"
                >
                  View All Treatments
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

