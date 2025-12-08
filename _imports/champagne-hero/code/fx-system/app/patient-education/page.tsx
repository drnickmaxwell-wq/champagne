'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { easeInOutCubic } from '@/lib/motion/easing';
import {
  Play,
  Search,
  BookOpen,
  Video,
  Eye,
  Star,
  Share2,
  Bookmark
} from 'lucide-react';

// Brand Colors: Magenta var(--smh-primary-magenta), Turquoise var(--smh-primary-teal), Gold var(--smh-accent-gold)
// Fonts: Montserrat headings, Lora body text

export default function PatientEducationPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Videos', count: 45 },
    { id: 'preventive', name: 'Preventive Care', count: 12 },
    { id: 'cosmetic', name: 'Cosmetic Dentistry', count: 8 },
    { id: 'restorative', name: 'Restorative', count: 10 },
    { id: 'oral-surgery', name: 'Oral Surgery', count: 6 },
    { id: 'orthodontics', name: 'Orthodontics', count: 5 },
    { id: 'emergency', name: 'Emergency Care', count: 4 }
  ];

  const featuredVideos = [
    {
      id: 1,
      title: '3D Digital Dentistry: The Future is Here',
      description: 'Discover how our advanced 3D scanning and printing technology revolutionizes dental care',
      duration: '8:45',
      views: '2.1K',
      category: 'preventive',
      thumbnail: '/video-thumbnails/3d-dentistry.jpg',
      featured: true,
      rating: 4.9
    },
    {
      id: 2,
      title: 'Porcelain Veneers: Complete Transformation',
      description: 'Watch a complete smile makeover using our premium porcelain veneers',
      duration: '12:30',
      views: '1.8K',
      category: 'cosmetic',
      thumbnail: '/video-thumbnails/veneers.jpg',
      featured: true,
      rating: 4.8
    },
    {
      id: 3,
      title: 'Dental Implants: Permanent Solution',
      description: 'Learn about our advanced dental implant procedures and recovery process',
      duration: '15:20',
      views: '1.5K',
      category: 'restorative',
      thumbnail: '/video-thumbnails/implants.jpg',
      featured: true,
      rating: 4.9
    }
  ];

  const educationalVideos = [
    {
      id: 4,
      title: 'Proper Brushing Technique',
      description: 'Master the correct brushing technique for optimal oral health',
      duration: '5:30',
      views: '3.2K',
      category: 'preventive',
      thumbnail: '/video-thumbnails/brushing.jpg',
      rating: 4.7
    },
    {
      id: 5,
      title: 'Understanding Gum Disease',
      description: 'Learn about the stages of gum disease and prevention strategies',
      duration: '7:15',
      views: '2.8K',
      category: 'preventive',
      thumbnail: '/video-thumbnails/gum-disease.jpg',
      rating: 4.6
    },
    {
      id: 6,
      title: 'Teeth Whitening Options',
      description: 'Compare professional vs at-home whitening treatments',
      duration: '6:45',
      views: '2.4K',
      category: 'cosmetic',
      thumbnail: '/video-thumbnails/whitening.jpg',
      rating: 4.8
    },
    {
      id: 7,
      title: 'Root Canal Procedure Explained',
      description: 'Demystify the root canal process with detailed explanations',
      duration: '10:20',
      views: '1.9K',
      category: 'restorative',
      thumbnail: '/video-thumbnails/root-canal.jpg',
      rating: 4.5
    },
    {
      id: 8,
      title: 'Dental Emergency First Aid',
      description: 'What to do in common dental emergency situations',
      duration: '8:30',
      views: '2.6K',
      category: 'emergency',
      thumbnail: '/video-thumbnails/emergency.jpg',
      rating: 4.9
    },
    {
      id: 9,
      title: 'Invisalign vs Traditional Braces',
      description: 'Compare modern orthodontic treatment options',
      duration: '9:15',
      views: '2.1K',
      category: 'orthodontics',
      thumbnail: '/video-thumbnails/orthodontics.jpg',
      rating: 4.7
    }
  ];

  const filteredVideos = educationalVideos.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <BookOpen className="w-12 h-12 text-yellow-400 mr-4" />
              <h1 
                className="text-5xl md:text-6xl font-bold text-white leading-tight"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Patient
                <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent ml-4">
                  Education
                </span>
              </h1>
            </div>
            
            <p 
              className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
            >
              Empower yourself with knowledge through our comprehensive library of 
              educational videos, covering everything from basic oral hygiene to 
              advanced dental procedures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎥 Browse Video Library
              </motion.button>
              
              <motion.button
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-200 border border-white/30"
                style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📚 Download Resources
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-pink-500 to-teal-500 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                  style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-teal-600 bg-clip-text text-transparent mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Featured Educational Videos
            </h2>
            <p 
              className="text-xl text-slate-600 max-w-3xl mx-auto"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
            >
              Our most popular and comprehensive educational content
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-pink-100 to-teal-100 flex items-center justify-center">
                    <Play className="w-16 h-16 text-pink-600" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 
                    className="text-xl font-bold text-slate-800 mb-3"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {video.title}
                  </h3>
                  
                  <p 
                    className="text-slate-600 mb-4 leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  >
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {video.views}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {video.rating}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <motion.button
                      className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-6 py-2 rounded-full font-medium hover:from-pink-600 hover:to-teal-600 transition-all duration-200"
                      style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Watch Now
                    </motion.button>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-slate-400 hover:text-pink-600 transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-pink-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Library Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-teal-600 bg-clip-text text-transparent mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Complete Video Library
            </h2>
            <p 
              className="text-xl text-slate-600"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
            >
              {filteredVideos.length} videos found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Play className="w-12 h-12 text-slate-600" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 
                    className="text-lg font-bold text-slate-800 mb-2"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {video.title}
                  </h3>
                  
                  <p 
                    className="text-slate-600 text-sm mb-3 leading-relaxed"
                    style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                  >
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {video.views}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        {video.rating}
                      </div>
                    </div>
                    
                    <motion.button
                      className="bg-gradient-to-r from-pink-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium hover:from-pink-600 hover:to-teal-600 transition-all duration-200"
                      style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Watch
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 
                className="text-xl font-bold text-slate-600 mb-2"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                No videos found
              </h3>
              <p 
                className="text-slate-500"
                style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
              >
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

