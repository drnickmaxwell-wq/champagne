'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { easeInOutCubic } from '@/lib/motion/easing';
import { Star, Award, Heart, Users, Calendar, Phone } from 'lucide-react';
import Link from 'next/link';

// Brand Colors: Magenta var(--smh-primary-magenta), Turquoise var(--smh-primary-teal), Gold var(--smh-accent-gold)
// Fonts: Montserrat headings, Lora body text

const teamMembers = [
  {
    id: 'dr-sarah-mitchell',
    name: 'Dr. Sarah Mitchell',
    title: 'Principal Dentist & Practice Owner',
    specialties: ['3D Digital Dentistry', 'Porcelain Veneers', 'Smile Makeovers'],
    experience: '15+ Years',
    qualifications: ['BDS (Hons)', 'MSc Restorative Dentistry', 'MJDF RCS'],
    image: '/team/dr-sarah-mitchell.jpg',
    bio: 'Dr. Sarah Mitchell is a passionate advocate for luxury coastal dentistry, combining cutting-edge 3D technology with a gentle, anxiety-free approach.',
    achievements: ['CQC Outstanding Rating', 'Best Dentist Sussex 2023', '500+ Smile Makeovers'],
    videoSrc: '/videos/team/dr-sarah-mitchell-hero.mp4'
  },
  {
    id: 'dr-james-thompson',
    name: 'Dr. James Thompson',
    title: 'Senior Associate Dentist',
    specialties: ['Dental Implants', 'Oral Surgery', 'Emergency Dentistry'],
    experience: '12+ Years',
    qualifications: ['BDS', 'PgCert Oral Surgery', 'MFDS RCS'],
    image: '/team/dr-james-thompson.jpg',
    bio: 'Specializing in complex dental implant procedures and emergency care, Dr. Thompson brings precision and compassion to every treatment.',
    achievements: ['Implant Excellence Award', '1000+ Successful Implants', 'Emergency Care Specialist'],
    videoSrc: '/videos/team/dr-james-thompson-hero.mp4'
  },
  {
    id: 'dr-emily-carter',
    name: 'Dr. Emily Carter',
    title: 'Cosmetic & Aesthetic Dentist',
    specialties: ['Teeth Whitening', 'Invisalign', 'Facial Aesthetics'],
    experience: '8+ Years',
    qualifications: ['BDS', 'PgDip Aesthetic Dentistry', 'Invisalign Certified'],
    image: '/team/dr-emily-carter.jpg',
    bio: 'Dr. Carter combines artistry with advanced technology to create beautiful, natural-looking smiles that boost confidence.',
    achievements: ['Invisalign Diamond Provider', 'Aesthetic Excellence Award', '300+ Smile Transformations'],
    videoSrc: '/videos/team/dr-emily-carter-hero.mp4'
  },
  {
    id: 'dr-michael-brown',
    name: 'Dr. Michael Brown',
    title: 'Anxiety & Sedation Specialist',
    specialties: ['Sedation Dentistry', 'The Wand System', 'Phobia Management'],
    experience: '10+ Years',
    qualifications: ['BDS', 'PgCert Conscious Sedation', 'Anxiety Management Certified'],
    image: '/team/dr-michael-brown.jpg',
    bio: 'Dedicated to making dental care comfortable and stress-free, Dr. Brown specializes in treating anxious patients with gentle techniques.',
    achievements: ['Anxiety-Free Dentistry Award', 'The Wand Certified', '95% Patient Comfort Rating'],
    videoSrc: '/videos/team/dr-michael-brown-hero.mp4'
  }
];

export default function TeamPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Wave Background - Brand Consistent */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/waves-bg-2560.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Brand Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-600/10 via-teal-500/5 to-yellow-500/10" />

      {/* Micro-Bubble Animations - Brand Consistent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
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

      {/* Emergency Banner - Brand Consistent */}
      <motion.div
        className="relative z-50 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 text-center"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
          🚨 Emergency Dental Care Available 24/7 - Call 01273 453109 🚨
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 pt-8">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-pink-200 mb-6">
                <Users className="w-5 h-5 text-pink-500 mr-2" />
                <span className="text-sm font-semibold text-slate-700">Meet Our Expert Team</span>
              </div>
              
              <h1 
                className="text-5xl md:text-7xl font-bold mb-6"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                  Exceptional
                </span>
                <br />
                <span className="text-slate-800">Dental Experts</span>
              </h1>
              
              <p 
                className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
              >
                Meet our award-winning team of dental professionals who combine advanced technology 
                with compassionate care to deliver exceptional results in our luxury coastal setting.
              </p>
            </motion.div>

            {/* Team Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
            >
              {[
                { icon: Award, label: 'Years Combined', value: '45+', color: 'from-pink-500 to-pink-600' },
                { icon: Star, label: 'Patient Rating', value: '4.9/5', color: 'from-teal-500 to-teal-600' },
                { icon: Heart, label: 'Happy Patients', value: '5000+', color: 'from-yellow-500 to-yellow-600' },
                { icon: Users, label: 'Expert Dentists', value: '4', color: 'from-purple-500 to-purple-600' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
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
            </motion.div>
          </div>
        </section>

        {/* Team Members Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/team/${member.id}`}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                      {/* Member Image/Video Preview */}
                      <div className="relative h-80 bg-gradient-to-br from-pink-500/20 to-teal-500/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                          <h3 
                            className="text-2xl font-bold mb-2"
                            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                          >
                            {member.name}
                          </h3>
                          <p 
                            className="text-white/90 mb-3"
                            style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                          >
                            {member.title}
                          </p>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            {member.experience}
                          </div>
                        </div>
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1" />
                          </div>
                        </div>
                      </div>

                      {/* Member Details */}
                      <div className="p-8">
                        <div className="mb-6">
                          <h4 
                            className="text-lg font-semibold text-slate-800 mb-3"
                            style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                          >
                            Specialties
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {member.specialties.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gradient-to-r from-pink-100 to-teal-100 text-slate-700 rounded-full text-sm font-medium"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p 
                          className="text-slate-600 mb-6 leading-relaxed"
                          style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                        >
                          {member.bio}
                        </p>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <h5 
                              className="font-semibold text-slate-800 mb-2"
                              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                            >
                              Qualifications
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {member.qualifications.map((qual, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                                >
                                  {qual}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 
                              className="font-semibold text-slate-800 mb-2"
                              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                            >
                              Achievements
                            </h5>
                            <div className="space-y-1">
                              {member.achievements.map((achievement, idx) => (
                                <div key={idx} className="flex items-center text-sm text-slate-600">
                                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                  {achievement}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-teal-600 transition-colors">
                            View Full Profile & Book Consultation
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
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
                Ready to Meet Your Perfect Dentist?
              </h2>
              <p 
                className="text-xl text-slate-600 mb-8"
                style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
              >
                Book a consultation with any of our expert dentists and discover
                why we’re the leading dental practice in Shoreham-by-Sea.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-teal-600 transition-colors shadow-lg">
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Book Free Consultation
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

      {/* Floating Action Buttons - Brand Consistent */}
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
          onClick={() => window.location.href = '/contact'}
        >
          <Calendar className="w-6 h-6" />
        </motion.button>
      </div>
    </main>
  );
}

