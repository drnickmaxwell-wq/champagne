'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { easeInOutCubic } from '@/lib/motion/easing';
import {
  Video,
  Clock,
  CheckCircle,
  Shield,
  Monitor,
  Headphones,
  Wifi,
  Camera
} from 'lucide-react';

// Brand Colors: Magenta var(--smh-primary-magenta), Turquoise var(--smh-primary-teal), Gold var(--smh-accent-gold)
// Fonts: Montserrat headings, Lora body text

export default function VideoConsultationPage() {
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    concern: '',
    preferredDate: '',
    preferredTime: ''
  });

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Safe & Secure',
      description: 'HIPAA-compliant video platform with end-to-end encryption'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Convenient Scheduling',
      description: 'Book appointments that fit your busy lifestyle'
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'High-Quality Video',
      description: 'Crystal clear HD video for detailed consultations'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Expert Diagnosis',
      description: 'Professional assessment from qualified dentists'
    }
  ];

  const requirements = [
    { icon: <Camera className="w-5 h-5" />, text: 'Camera-enabled device' },
    { icon: <Headphones className="w-5 h-5" />, text: 'Microphone and speakers' },
    { icon: <Wifi className="w-5 h-5" />, text: 'Stable internet connection' },
    { icon: <Monitor className="w-5 h-5" />, text: 'Updated web browser' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Video consultation booking:', formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-4 text-center">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <span>📞 Emergency: 01273 453109</span>
          <span>📍 Shoreham-by-Sea, West Sussex</span>
          <span>🕒 24/7 Emergency Care</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SMH</span>
              </div>
              <div>
                <div className="font-bold text-slate-800" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
                  St Mary’s House
                </div>
                <div className="text-sm text-slate-600" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
                  Dental Care
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-pink-600 transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>Home</Link>
              <Link href="/about" className="text-slate-700 hover:text-pink-600 transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>About</Link>
              <Link href="/treatments" className="text-slate-700 hover:text-pink-600 transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>Treatments</Link>
              <Link href="/team" className="text-slate-700 hover:text-pink-600 transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>Team</Link>
              <Link href="/contact" className="text-slate-700 hover:text-pink-600 transition-colors" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-teal-600 transition-all duration-200" style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}>
                Book Free Consultation
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: 'url(/waves-bg-2560.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Brand Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/90 via-purple-600/85 to-teal-600/90" />
        
        {/* Flowing Wave Graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--smh-primary-magenta)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--smh-primary-teal)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--smh-accent-gold)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z"
              fill="url(#waveGradient1)"
              animate={{
                d: [
                  "M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z",
                  "M0,450 Q300,250 600,450 T1200,450 L1200,800 L0,800 Z",
                  "M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: easeInOutCubic }}
            />
          </svg>
        </div>

        {/* Micro-Bubble Animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
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
                y: [0, -30, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Video className="w-12 h-12 text-yellow-400 mr-4" />
              <h1 
                className="text-5xl md:text-6xl font-bold text-white leading-tight"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Video
                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent ml-4">
                  Consultation
                </span>
              </h1>
            </div>
            
            <p 
              className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
            >
              Connect with our expert dentists from the comfort of your home. 
              Get professional dental advice, treatment planning, and follow-up care 
              through secure, high-quality video consultations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📅 Book Video Consultation
              </motion.button>
              
              <motion.button
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-200 border border-white/30"
                style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎥 Test Your Setup
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-teal-600 bg-clip-text text-transparent mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Why Choose Video Consultations?
            </h2>
            <p 
              className="text-xl text-slate-600 max-w-3xl mx-auto"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
            >
              Experience the future of dental care with our advanced video consultation platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  index % 3 === 0 ? 'bg-gradient-to-r from-pink-500 to-pink-600' :
                  index % 3 === 1 ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
                  'bg-gradient-to-r from-yellow-500 to-yellow-600'
                }`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                
                <h3 
                  className="text-xl font-bold text-slate-800 mb-3"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  {benefit.title}
                </h3>
                
                <p 
                  className="text-slate-600 leading-relaxed"
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                >
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section 
        className="py-20 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/waves-bg-2560.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Brand Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-teal-900/95" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Book Your Video Consultation
            </h2>
            <p 
              className="text-xl text-white/80"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
            >
              Schedule a convenient time for your virtual appointment
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    className="block text-white font-medium mb-2"
                    style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label 
                    className="block text-white font-medium mb-2"
                    style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label 
                    className="block text-white font-medium mb-2"
                    style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label 
                    className="block text-white font-medium mb-2"
                    style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  >
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-white font-medium mb-4"
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                >
                  Preferred Time
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedTime === time
                          ? 'bg-gradient-to-r from-pink-500 to-teal-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label 
                  className="block text-white font-medium mb-2"
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                >
                  Dental Concern
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Please describe your dental concern or reason for consultation..."
                  value={formData.concern}
                  onChange={(e) => setFormData({...formData, concern: e.target.value})}
                />
              </div>

              <div className="text-center">
                <motion.button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-12 py-4 rounded-full font-bold text-lg hover:from-pink-600 hover:to-teal-600 transition-all duration-200 shadow-lg"
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📅 Schedule Video Consultation
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Technical Requirements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-teal-600 bg-clip-text text-transparent mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Technical Requirements
            </h2>
            <p 
              className="text-xl text-slate-600"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
            >
              Ensure you have everything needed for a smooth consultation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {requirements.map((req, index) => (
              <motion.div
                key={req.text}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  index % 3 === 0 ? 'bg-gradient-to-r from-pink-500 to-pink-600' :
                  index % 3 === 1 ? 'bg-gradient-to-r from-teal-500 to-teal-600' :
                  'bg-gradient-to-r from-yellow-500 to-yellow-600'
                }`}>
                  <div className="text-white">
                    {req.icon}
                  </div>
                </div>
                
                <p 
                  className="text-slate-700 font-medium"
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                >
                  {req.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button
              className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-teal-600 hover:to-blue-700 transition-all duration-200"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔧 Test Your Setup Now
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}

