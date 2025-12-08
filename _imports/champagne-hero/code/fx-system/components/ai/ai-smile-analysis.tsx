'use client';

import Image from 'next/image';
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { easeInOutCubic, easeOutCubic, linearEase } from '@/lib/motion/easing';
import {
  Camera, Upload, Sparkles, Star, CheckCircle, ArrowRight,
  Zap, Heart, Download, Share2, RotateCcw,
  Eye, Circle
} from 'lucide-react';

// Brand Colors: Magenta var(--smh-primary-magenta), Turquoise var(--smh-primary-teal), Gold var(--smh-accent-gold)
// Fonts: Montserrat headings, Lora body text

interface AnalysisResult {
  overallScore: number;
  teethAlignment: number;
  teethWhiteness: number;
  gumHealth: number;
  smileSymmetry: number;
  recommendations: string[];
  suggestedTreatments: Array<{
    name: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedCost: string;
    duration: string;
  }>;
  confidence: number;
}

export default function AISmileAnalysis() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const analyzeSmile = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis results - in production, this would call OpenAI Vision API
    const mockResult: AnalysisResult = {
      overallScore: 78,
      teethAlignment: 85,
      teethWhiteness: 72,
      gumHealth: 88,
      smileSymmetry: 76,
      recommendations: [
        "Professional teeth whitening would enhance your smile brightness",
        "Minor orthodontic adjustment could improve symmetry",
        "Regular dental hygiene maintenance recommended",
        "Consider porcelain veneers for optimal aesthetic results"
      ],
      suggestedTreatments: [
        {
          name: "Professional Teeth Whitening",
          description: "Advanced whitening treatment to brighten your smile by 3-8 shades",
          priority: "high",
          estimatedCost: "£350-£500",
          duration: "1-2 sessions"
        },
        {
          name: "Porcelain Veneers",
          description: "Ultra-thin shells to perfect tooth shape and color",
          priority: "medium",
          estimatedCost: "£800-£1200 per tooth",
          duration: "2-3 appointments"
        },
        {
          name: "Invisalign Clear Aligners",
          description: "Discreet orthodontic treatment for improved alignment",
          priority: "medium",
          estimatedCost: "£2500-£4500",
          duration: "6-18 months"
        }
      ],
      confidence: 94
    };
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
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

      <div className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-pink-200 mb-6">
              <Sparkles className="w-5 h-5 text-pink-500 mr-2" />
              <span className="text-sm font-semibold text-slate-700">AI-Powered Analysis</span>
            </div>
            
            <h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                AI Smile
              </span>
              <br />
              <span className="text-slate-800">Analysis</span>
            </h1>
            
            <p 
              className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
            >
              Upload a photo of your smile and let our advanced AI technology analyze your teeth, 
              gums, and overall oral health to provide personalized treatment recommendations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {!uploadedImage ? (
                <div
                  className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-pink-400 bg-pink-50/50' 
                      : 'border-slate-300 bg-white/80 hover:border-pink-300'
                  } backdrop-blur-sm`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  
                  <div className="space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                      <Camera className="w-12 h-12 text-white" />
                    </div>
                    
                    <div>
                      <h3 
                        className="text-2xl font-bold text-slate-800 mb-3"
                        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                      >
                        Upload Your Smile Photo
                      </h3>
                      <p 
                        className="text-slate-600 mb-6"
                        style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                      >
                        Drag and drop your photo here, or click to browse
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-teal-600 transition-colors shadow-lg"
                      >
                        <Upload className="w-5 h-5 inline mr-2" />
                        Choose File
                      </button>
                      <button
                        onClick={() => {/* Camera functionality */}}
                        className="px-6 py-3 bg-white border-2 border-pink-200 text-slate-700 rounded-full font-semibold hover:bg-pink-50 transition-colors"
                      >
                        <Camera className="w-5 h-5 inline mr-2" />
                        Take Photo
                      </button>
                    </div>
                  </div>
                  
                  {/* Upload Guidelines */}
                  <div className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Photo Guidelines:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Smile naturally with teeth visible</li>
                      <li>• Good lighting, face the camera directly</li>
                      <li>• High resolution (min 1080p recommended)</li>
                      <li>• No filters or heavy editing</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                  <div className="relative mb-6">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded smile"
                      className="w-full h-80 object-cover rounded-2xl"
                      width={800}
                      height={600}
                      sizes="100vw"
                      unoptimized
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <RotateCcw className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                  
                  {!analysisResult && !isAnalyzing && (
                    <button
                      onClick={analyzeSmile}
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full font-bold text-lg hover:from-pink-600 hover:to-teal-600 transition-colors shadow-lg"
                    >
                      <Zap className="w-6 h-6 inline mr-3" />
                      Analyze My Smile
                      <ArrowRight className="w-6 h-6 inline ml-3" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Analysis Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {isAnalyzing && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: linearEase }}
                      >
                        <Sparkles className="w-12 h-12 text-white" />
                      </motion.div>
                    </div>
                    
                    <h3 
                      className="text-2xl font-bold text-slate-800 mb-4"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      Analyzing Your Smile...
                    </h3>
                    
                    <div className="space-y-3">
                      {[
                        "Detecting teeth alignment...",
                        "Analyzing tooth whiteness...",
                        "Evaluating gum health...",
                        "Measuring smile symmetry...",
                        "Generating recommendations..."
                      ].map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.5 }}
                          className="flex items-center justify-center text-slate-600"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: index * 0.5 }}
                            className="w-2 h-2 bg-pink-500 rounded-full mr-3"
                          />
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {analysisResult && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {/* Overall Score */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center">
                      <div className="relative w-32 h-32 mx-auto mb-6">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-slate-200"
                          />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: "0 351.86" }}
                            animate={{ strokeDasharray: `${(analysisResult.overallScore / 100) * 351.86} 351.86` }}
                            transition={{ duration: 2, ease: easeOutCubic }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div 
                              className="text-3xl font-bold text-slate-800"
                              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                            >
                              {analysisResult.overallScore}
                            </div>
                            <div className="text-sm text-slate-600">Overall Score</div>
                          </div>
                        </div>
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--smh-primary-magenta)" />
                            <stop offset="50%" stopColor="var(--smh-primary-teal)" />
                            <stop offset="100%" stopColor="var(--smh-accent-gold)" />
                          </linearGradient>
                        </defs>
                      </div>
                      
                      <h3 
                        className="text-2xl font-bold text-slate-800 mb-2"
                        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                      >
                        Excellent Smile Potential!
                      </h3>
                      <p 
                        className="text-slate-600"
                        style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                      >
                        AI Confidence: {analysisResult.confidence}%
                      </p>
                    </div>

                    {/* Detailed Scores */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                      <h4 
                        className="text-xl font-bold text-slate-800 mb-6"
                        style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                      >
                        Detailed Analysis
                      </h4>
                      
                      <div className="space-y-4">
                        {[
                          { label: 'Teeth Alignment', score: analysisResult.teethAlignment, icon: Circle, color: 'from-pink-500 to-pink-600' },
                          { label: 'Teeth Whiteness', score: analysisResult.teethWhiteness, icon: Sparkles, color: 'from-teal-500 to-teal-600' },
                          { label: 'Gum Health', score: analysisResult.gumHealth, icon: Heart, color: 'from-green-500 to-green-600' },
                          { label: 'Smile Symmetry', score: analysisResult.smileSymmetry, icon: Eye, color: 'from-purple-500 to-purple-600' }
                        ].map((metric, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mr-3`}>
                                <metric.icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-medium text-slate-700">{metric.label}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-slate-200 rounded-full mr-3">
                                <motion.div
                                  className={`h-2 bg-gradient-to-r ${metric.color} rounded-full`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${metric.score}%` }}
                                  transition={{ duration: 1.5, delay: index * 0.2 }}
                                />
                              </div>
                              <span className="font-bold text-slate-800 w-8">{metric.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                      <h4 
                        className="text-xl font-bold text-slate-800 mb-6"
                        style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                      >
                        AI Recommendations
                      </h4>
                      
                      <div className="space-y-3">
                        {analysisResult.recommendations.map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span 
                              className="text-slate-600 leading-relaxed"
                              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                            >
                              {rec}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Treatments */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                      <h4 
                        className="text-xl font-bold text-slate-800 mb-6"
                        style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                      >
                        Suggested Treatments
                      </h4>
                      
                      <div className="space-y-4">
                        {analysisResult.suggestedTreatments.map((treatment, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h5 
                                className="font-bold text-slate-800"
                                style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                              >
                                {treatment.name}
                              </h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                treatment.priority === 'high' ? 'bg-red-100 text-red-700' :
                                treatment.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {treatment.priority} priority
                              </span>
                            </div>
                            
                            <p 
                              className="text-slate-600 mb-4"
                              style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                            >
                              {treatment.description}
                            </p>
                            
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-slate-500">
                                <span className="block">Duration: {treatment.duration}</span>
                                <span className="block">Cost: {treatment.estimatedCost}</span>
                              </div>
                              <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full text-sm font-semibold hover:from-pink-600 hover:to-teal-600 transition-colors">
                                Learn More
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl text-center">
                      <h4 
                        className="text-xl font-bold text-slate-800 mb-6"
                        style={{ fontFamily: 'var(--font-inter), system-ui, Arial' }}
                      >
                        Ready to Transform Your Smile?
                      </h4>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-teal-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-teal-600 transition-colors shadow-lg">
                          <Star className="w-5 h-5 inline mr-2" />
                          Book Free Consultation
                        </button>
                        <button className="px-6 py-3 bg-white border-2 border-pink-200 text-slate-700 rounded-full font-semibold hover:bg-pink-50 transition-colors">
                          <Download className="w-5 h-5 inline mr-2" />
                          Download Report
                        </button>
                        <button className="px-6 py-3 bg-white border-2 border-teal-200 text-slate-700 rounded-full font-semibold hover:bg-teal-50 transition-colors">
                          <Share2 className="w-5 h-5 inline mr-2" />
                          Share Results
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

