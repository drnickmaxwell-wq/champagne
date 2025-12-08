'use client';

import CinematicHeroVideo from '@/components/video/cinematic-hero-video';
import InteractiveDentalVisualization from '@/components/features/interactive-dental-visualization';
import LuxuryChatbot from '@/components/ai/luxury-chatbot';
import { FloatingGeometry } from '@/components/effects/micro-interactions';
import { ScrollReveal } from '@/components/effects/enhanced-scroll-animations';
import { Particles } from '@/components/fx/Particles';

export default function HomePageClient() {
  return (
    <>
      {/* Floating Geometry Elements */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <FloatingGeometry
          shape="circle"
          size="sm"
          color="magenta"
          animation="float"
          className="absolute top-20 left-10 opacity-30"
        />
        <FloatingGeometry
          shape="hexagon"
          size="md"
          color="turquoise"
          animation="rotate"
          className="absolute top-40 right-20 opacity-20"
        />
        <FloatingGeometry
          shape="square"
          size="sm"
          color="gold"
          animation="pulse"
          className="absolute bottom-40 left-20 opacity-25"
        />
        <FloatingGeometry
          shape="circle"
          size="lg"
          color="turquoise"
          animation="orbit"
          className="absolute bottom-20 right-10 opacity-15"
        />
      </div>

      {/* Cinematic Hero Video - Brand Consistent */}
      <section className="relative hero overflow-hidden">
        <Particles />
        <CinematicHeroVideo
          videoSrc="/videos/dental-hero-4k.mp4"
          posterSrc="/hero-poster.jpg"
          title="Your Perfect Smile is Just One Click Away"
          subtitle="Experience the future of dentistry with our AI-powered 3D treatments, luxury coastal setting, and award-winning patient care."
          description="Book your consultation today and discover why we're 'Going the Extra Smile.'"
          ctaText="Book Free Consultation"
          ctaAction={() => (window.location.href = '/contact')}
          autoplay
          muted
          loop
        />
      </section>

      {/* Interactive Dental Visualization Section */}
      <ScrollReveal direction="up" delay={0.2}>
        <InteractiveDentalVisualization />
      </ScrollReveal>

      {/* Luxury AI Chatbot */}
      <ScrollReveal direction="scale" delay={0.4}>
        <LuxuryChatbot />
      </ScrollReveal>
    </>
  );
}
