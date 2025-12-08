import { ChampagneLayout } from "@/components/layout/ChampagneLayout";
import { ChampagneHero } from "@/components/hero/ChampagneHero";
import { TreatmentCard } from "@/components/card/TreatmentCard";
import cardStyles from "@/components/card/card-skeleton.module.css";
import { AIWidgetTrio } from "@/components/ai-tools/AIWidgetTrio";
import { Champagne3DViewer } from "@/components/3d/Champagne3DViewer";
import { ChampagneTestimonialCarousel } from "@/components/testimonial/ChampagneTestimonialCarousel";
import { ChampagneFAQ } from "@/components/faq/ChampagneFAQ";
import { ChampagneCTA } from "@/components/cta/ChampagneCTA";
import styles from "./skeleton-preview.module.css";

const treatments = [
  {
    title: "Composite Bonding",
    description: "Refine shape and symmetry with conservative, artful bonding.",
    eyebrow: "Precision",
  },
  {
    title: "Invisalign Aligners",
    description: "Guided orthodontic journeys with digital monitoring.",
    eyebrow: "Alignment",
  },
  {
    title: "Implant Planning",
    description: "Implant pathways prepared for predictability and comfort.",
    eyebrow: "Surgery-ready",
  },
];

const testimonials = [
  {
    quote: "Every touchpoint felt considered – I always knew what would happen next.",
    name: "Alexandra M.",
    role: "Patient",
    rating: 5,
  },
  {
    quote: "Clear timelines, thoughtful care, and a team that kept me informed.",
    name: "Dr. Jamie L.",
    role: "Referral Partner",
    rating: 5,
  },
  {
    quote: "The planning tools gave us confidence before treatment even began.",
    name: "Priya K.",
    role: "Patient",
    rating: 4,
  },
];

const faqs = [
  {
    id: "consultation",
    question: "What does the first visit include?",
    answer: "A comprehensive assessment, scan-ready records, and a roadmap for next steps.",
  },
  {
    id: "payments",
    question: "Do you offer flexible payment options?",
    answer: "Yes. We outline payment routes and work with you to align with your goals.",
  },
  {
    id: "technology",
    question: "How is technology used during treatment?",
    answer: "Digital scans, photography, and visual previews help align expectations.",
  },
];

export default function SkeletonPage() {
  return (
    <ChampagneLayout>
      <div className="champagne-page">
        <ChampagneHero
          eyebrow="Champagne ecosystem"
          title="Structural skeleton for SMH Dental"
          subtitle="Reusable shells for hero, cards, CTAs, FAQ, testimonials, AI tools, and 3D viewer."
          badge="Preview-only"
          primaryCta={{ label: "Primary action", href: "#" }}
          secondaryCta={{ label: "Secondary", href: "#" }}
        />

        <div className={`${styles.page} space-section`}>
          <section className="space-block">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Treatments</h2>
              <span>Card grid skeleton</span>
            </div>
            <div className={cardStyles["cp-card__grid"]}>
              {treatments.map((treatment) => (
                <TreatmentCard key={treatment.title} {...treatment} ctaLabel="Learn more" ctaHref="#" />
              ))}
            </div>
          </section>

          <section className="space-block">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>AI tools trio</h2>
              <span>Neutral shells</span>
            </div>
            <AIWidgetTrio />
          </section>

          <section className="space-block">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>3D viewer</h2>
              <span>Placeholder shell</span>
            </div>
            <div className={styles.gridTwo}>
              <Champagne3DViewer />
              <div className={`glass-card ${cardStyles["cp-card"]}`}>
                <h3 className={cardStyles["cp-card__title"]}>Treatment overview</h3>
                <p className={cardStyles["cp-card__body"]}>
                  Pair the 3D viewport with descriptive copy, timelines, and CTAs. Use this slot to explain workflows
                  or add additional cards alongside the viewer.
                </p>
              </div>
            </div>
          </section>

          <section className="space-block">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Testimonials</h2>
              <span>Carousel skeleton</span>
            </div>
            <ChampagneTestimonialCarousel items={testimonials} />
          </section>

          <section className="space-block">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Frequently asked</h2>
              <span>Accordion skeleton</span>
            </div>
            <ChampagneFAQ items={faqs} />
          </section>

          <section className="space-block">
            <ChampagneCTA variant="pair" primaryLabel="Book a consult" primaryHref="#" secondaryLabel="Explore treatments" secondaryHref="#" />
          </section>
        </div>
      </div>
    </ChampagneLayout>
  );
}
