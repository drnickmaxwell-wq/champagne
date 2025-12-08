'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { easeInOutCubic } from '@/lib/motion/easing';
import { Star, Award, Heart, Calendar, Phone, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import FourKHeroVideo from '@/components/hero/4k-hero-video';

// Brand Colors: Magenta var(--smh-primary-magenta), Turquoise var(--smh-primary-teal), Gold var(--smh-accent-gold)
// Fonts: Montserrat headings, Lora body text

export default function DrSarahMitchellPage() {
  const clinicianData = {
    name: 'Dr. Sarah Mitchell',
    title: 'Principal Dentist & Practice Owner',
    specialties: ['3D Digital Dentistry', 'Porcelain Veneers', 'Smile Makeovers', 'Anxiety-Free Dentistry'],
    experience: '15+ Years',
    qualifications: ['BDS (Hons) University of Bristol', 'MSc Restorative Dentistry', 'MJDF RCS England', 'PgCert Medical Education'],
    image: '/team/dr-sarah-mitchell.jpg',
    bio: 'Dr. Sarah Mitchell is the visionary behind St Mary\'s House Dental Care, combining her passion for cutting-edge 3D technology with a gentle, anxiety-free approach to dentistry. With over 15 years of experience, she has transformed thousands of smiles in the beautiful coastal setting of Shoreham-by-Sea.',
    achievements: [
      'CQC Outstanding Rating - Practice Leader',
      'Best Dentist Sussex 2023',
      '500+ Smile Makeovers Completed',
      'Pioneer in 3D Digital Dentistry',
      'Anxiety-Free Dentistry Specialist',
      'Featured in Dental Industry Publications'
    ],
    videoSrc: '/videos/team/dr-sarah-mitchell-hero.mp4',
    treatments: [
      {
        name: '3D Digital Smile Design',
        description: 'Revolutionary technology that allows you to see your new smile before treatment begins',
        duration: '60-90 minutes',
        price: 'From £150'
      },
      {
        name: 'Porcelain Veneers',
        description: 'Ultra-thin, custom-made shells that transform your smile with natural-looking results',
        duration: '2-3 appointments',
        price: 'From £800 per veneer'
      },
      {
        name: 'Complete Smile Makeover',
        description: 'Comprehensive treatment combining multiple procedures for total smile transformation',
        duration: '3-6 months',
        price: 'From £5,000'
      },
      {
        name: 'Anxiety-Free Consultations',
        description: 'Gentle, understanding approach with sedation options for nervous patients',
        duration: '45 minutes',
        price: 'Free initial consultation'
      }
    ],
    testimonials: [
      {
        name: 'Emma Thompson',
        treatment: 'Smile Makeover',
        rating: 5,
        text: 'Dr. Mitchell completely transformed my confidence with my new smile. Her gentle approach made the entire process comfortable and stress-free.',
        image: '/testimonials/emma-thompson.jpg'
      },
      {
        name: 'James Wilson',
        treatment: 'Porcelain Veneers',
        rating: 5,
        text: 'The 3D technology Dr. Mitchell uses is incredible. I could see exactly how my smile would look before we even started treatment.',
        image: '/testimonials/james-wilson.jpg'
      }
    ]
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 4K Hero Video - Brand Consistent */}
      <FourKHeroVideo
        title={`Meet ${clinicianData.name}`}
        subtitle={`${clinicianData.title} - Transforming smiles with cutting-edge 3D technology and compassionate care in our luxury coastal practice.`}
        ctaText="Book Consultation with Dr. Mitchell"
        onCtaClick={() => window.location.href = '/contact?dentist=dr-sarah-mitchell'}
        videoSrc={clinicianData.videoSrc}
        posterImage="/team/dr-sarah-mitchell-poster.jpg"
        autoplay={true}
        muted={true}
        loop={true}
        showControls={true}
      />

      {/* Main Content with Wave Background */}
      <div className="relative">
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
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-teal-500/5 to-yellow-500/10" />

        {/* Micro-Bubble Animations - Brand Consistent */}
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
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.6, 0.2],
              }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: easeInOutCubic
            }}
            />
          ))}
        </div>

        {/* Content Sections */}
        <div className="relative z-10">
          {/* Back Navigation */}
          <section className="py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <Link href="/team" className="inline-flex items-center text-slate-700 hover:text-pink-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>Back to Team</span>
              </Link>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <h2 
                      className="text-4xl font-bold text-slate-800 mb-6"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      About Dr. Mitchell
                    </h2>
                    <p 
                      className="text-lg text-slate-600 mb-6 leading-relaxed"
                      style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                    >
                      {clinicianData.bio}
                    </p>
                    
                    <div className="mb-6">
                      <h3 
                        className="text-xl font-semibold text-slate-800 mb-3"
                        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                      >
                        Qualifications
                      </h3>
                      <div className="space-y-2">
                        {clinicianData.qualifications.map((qual, idx) => (
                          <div key={idx} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-slate-600" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
                              {qual}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 
                        className="text-xl font-semibold text-slate-800 mb-3"
                        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                      >
                        Achievements
                      </h3>
                      <div className="space-y-2">
                        {clinicianData.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-500 mr-3" />
                            <span className="text-slate-600" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Years Experience', value: '15+', icon: Award, color: 'from-pink-500 to-pink-600' },
                      { label: 'Happy Patients', value: '2000+', icon: Heart, color: 'from-teal-500 to-teal-600' },
                      { label: 'Smile Makeovers', value: '500+', icon: Star, color: 'from-yellow-500 to-yellow-600' },
                      { label: 'Patient Rating', value: '4.9/5', icon: CheckCircle, color: 'from-purple-500 to-purple-600' }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Specialties */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 
                      className="text-xl font-semibold text-slate-800 mb-4"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      Specialties
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {clinicianData.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-2 bg-gradient-to-r from-pink-100 to-teal-100 text-slate-700 rounded-full text-sm font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Treatments Section */}
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 
                  className="text-4xl font-bold text-slate-800 mb-6"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  Treatments with Dr. Mitchell
                </h2>
                <p 
                  className="text-xl text-slate-600 max-w-3xl mx-auto"
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                >
                  Discover the advanced treatments and personalized care that Dr. Mitchell provides 
                  to help you achieve your perfect smile.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {clinicianData.treatments.map((treatment, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <h3 
                      className="text-2xl font-bold text-slate-800 mb-4"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      {treatment.name}
                    </h3>
                    <p 
                      className="text-slate-600 mb-6 leading-relaxed"
                      style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                    >
                      {treatment.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="text-sm text-slate-500">Duration</span>
                        <div className="font-semibold text-slate-800">{treatment.duration}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500">Price</span>
                        <div className="font-semibold text-slate-800">{treatment.price}</div>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-teal-600 transition-colors">
                      Book {treatment.name}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 
                  className="text-4xl font-bold text-slate-800 mb-6"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  Patient Stories
                </h2>
                <p
                  className="text-xl text-slate-600"
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                >
                  Hear from patients who have experienced Dr. Mitchell’s exceptional care
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {clinicianData.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p
                      className="text-slate-600 mb-6 leading-relaxed italic"
                      style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                    >
                      “{testimonial.text}”
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-teal-400 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {testimonial.treatment}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl"
              >
                <h2 
                  className="text-4xl font-bold text-slate-800 mb-6"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  Ready to Transform Your Smile?
                </h2>
                <p 
                  className="text-xl text-slate-600 mb-8"
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                >
                  Book your consultation with Dr. Mitchell and discover how our cutting-edge 
                  3D technology and gentle approach can give you the smile of your dreams.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-teal-600 transition-colors shadow-lg">
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Book with Dr. Mitchell
                  </button>
                  <button className="px-8 py-4 bg-white border-2 border-pink-200 text-slate-700 rounded-full font-semibold hover:bg-pink-50 transition-colors">
                    <Phone className="w-5 h-5 inline mr-2" />
                    Call 01273 453109
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Action Buttons - Brand Consistent */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <motion.button
          className="p-4 bg-gradient-to-r from-pink-600 to-teal-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = 'tel:01273453109'}
        >
          <Phone className="w-6 h-6" />
        </motion.button>

        <motion.button
          className="p-4 bg-gradient-to-r from-teal-500 to-yellow-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/contact?dentist=dr-sarah-mitchell'}
        >
          <Calendar className="w-6 h-6" />
        </motion.button>
      </div>
    </main>
  );
}

