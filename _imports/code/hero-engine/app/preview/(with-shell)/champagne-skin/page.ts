import '@/styles/champagne/theme.css';
import { AIWidgetTrio } from '@/components/ai-tools/AIWidgetTrio';
import { Champagne3DViewer } from '@/components/3d/Champagne3DViewer';
import { ChampagneCTA } from '@/components/cta/ChampagneCTA';
import { ChampagneFAQ } from '@/components/faq/ChampagneFAQ';
import { ChampagneHero } from '@/components/hero/ChampagneHero';
import { ChampagneTestimonialCarousel } from '@/components/testimonial/ChampagneTestimonialCarousel';

const TESTIMONIALS = [
  {
    quote: 'The cinematic polish makes the experience feel bespoke and elevated.',
    name: 'Dr. Manus Catalano',
    role: 'Clinical Director',
    rating: 5,
  },
  {
    quote: 'Layered gradients and glass surfaces give every module a premium tactility.',
    name: 'Elena Ríos',
    role: 'Experience Designer',
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    id: 'tokens',
    question: 'How do the Champagne tokens map to components?',
    answer: 'All cards, navigation, and hero surfaces pull from the core brand, neutral, and glass tokens to stay consistent across time-of-day modes.',
  },
  {
    id: 'layers',
    question: 'Can I toggle waves, particles, and grain?',
    answer: 'Yes. Each hero layer is optional and controlled via props so you can dial in motion or texture per surface.',
  },
  {
    id: 'glass',
    question: 'Where is glass applied?',
    answer: 'Cards, FAQ panels, and navigation bars inherit glass-card or glass-soft treatments for a soft cinematic glow.',
  },
];

export default function ChampagneSkinPreview() {
  return (
    <main className="champagne-page">
      <ChampagneHero
        eyebrow="Preview"
        title="Champagne Skin Engine"
        subtitle="Tokenised. Layered. Cinematic."
        showParticles
        showGrain
      />

      <div className="space-section">
        <AIWidgetTrio />
      </div>

      <div className="space-section">
        <Champagne3DViewer title="3D Viewer Demo" />
      </div>

      <div className="space-section">
        <ChampagneTestimonialCarousel items={TESTIMONIALS} heading="Voices" />
      </div>

      <div className="space-section">
        <ChampagneFAQ items={FAQ_ITEMS} heading="Champagne system" />
      </div>

      <div className="space-section">
        <ChampagneCTA variant="pair" primaryLabel="Book" secondaryLabel="Contact" />
      </div>
    </main>
  );
}
