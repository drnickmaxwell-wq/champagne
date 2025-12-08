import type { Metadata } from "next";
import Link from "next/link";

import PreviewTreatmentsHero from "@/components/preview/PreviewTreatmentsHero";
import ConcernRail, { type ConcernCard } from "@/components/preview/sections/treatments/ConcernRail";
import StoriesTeaser, { type StoryCard } from "@/components/preview/sections/treatments/StoriesTeaser";
import TreatmentFinancePreview from "@/components/preview/sections/treatments/TreatmentFinancePreview";
import TreatmentHowItWorksPreview, {
  type TreatmentStep,
} from "@/components/preview/sections/treatments/TreatmentHowItWorksPreview";
import TreatmentMicroFaq, { type TreatmentFaq } from "@/components/preview/sections/treatments/TreatmentMicroFaq";
import TreatmentTechHighlight from "@/components/preview/sections/treatments/TreatmentTechHighlight";
import TreatmentHubPreviewSchema from "@/components/preview/seo/TreatmentHubPreviewSchema";
import layoutStyles from "@/components/preview/sections/treatments/preview-treatments.module.css";
import { previewRobots } from "@/lib/seo/preview/previewRobots";

export const metadata: Metadata = {
  title: "Dental Treatments Preview | Champagne Canvas",
  description:
    "Preview the Champagne-styled treatments hub with calm hero, concern rail, how-to steps, pricing bands, tech highlight, and FAQs aligned to schema.",
  robots: previewRobots,
};

const concernCards: ConcernCard[] = [
  {
    title: "Porcelain veneers",
    slug: "veneers",
    href: "/preview/treatments/veneers",
    summary: "Refine shape, colour, and symmetry with digital planning before any minimal prep.",
    detail:
      "Veneers refine shape, colour and symmetry with porcelain or composite options. After consultation and 3D planning, we place and finish for a natural smile with quick recovery.",
  },
  {
    title: "Dental implants",
    slug: "implants",
    href: "/preview/treatments/implants",
    summary: "Stable tooth replacement with titanium roots, 3D-planned for comfort and accuracy.",
    detail:
      "Dental implants replace missing teeth with a titanium root and custom crown. CBCT-guided planning improves healing and precision while timelines stay transparent.",
    tone: "cool",
  },
  {
    title: "Orthodontics",
    slug: "orthodontics",
    href: "/preview/treatments/orthodontics",
    summary: "Spark aligners and retainers planned digitally so movement stays discreet and predictable.",
    detail:
      "Spark aligners move teeth gradually with comfortable trays and digital tracking. Retainers and reviews hold the finish at the end of treatment.",
    tone: "cool",
  },
  {
    title: "Whitening",
    slug: "whitening",
    href: "/preview/treatments/whitening",
    summary: "Sensitivity-safe brightening routes with supervised at-home and in-surgery options.",
    detail:
      "Whitening pathways blend desensitising gels and tailored trays. Expect clear wear times, stain advice, and quick reviews to protect enamel.",
  },
  {
    title: "Composite bonding",
    slug: "composite",
    href: "/preview/treatments/composite-bonding",
    summary: "Hand-layered bonding to tidy chips and edges with minimal preparation.",
    detail:
      "Composite bonding refreshes edges and closes micro gaps in one visit. Digital shade matching keeps the finish seamless and camera-ready.",
  },
  {
    title: "General dentistry",
    slug: "general",
    href: "/preview/treatments/general",
    summary: "Preventive and restorative care that keeps your smile steady between larger treatments.",
    detail:
      "Check-ups, hygiene, and restorative care with the same Champagne surface. Clear recommendations and optional sedation for nervous patients.",
  },
  {
    title: "Technology",
    slug: "technology",
    href: "/preview/treatments/technology",
    summary: "CBCT, intraoral scanning, and 3D printing woven into diagnostics and delivery.",
    detail:
      "Digital workflows underpin every pathway: CBCT for mapping, intraoral scans for comfort, and 3D printing for guides and retainers.",
    tone: "cool",
  },
];

const howToSteps: TreatmentStep[] = [
  {
    title: "Consultation",
    summary: "Outline goals, share photos, and receive a calm plan with options for AI Smile Quiz prework.",
  },
  {
    title: "3D Planning",
    summary: "Scans, CBCT, and mock-ups show the intended result before any prep, mirroring the schema pack steps.",
  },
  {
    title: "Treatment Day",
    summary: "Guided workflows for veneers, aligners, or implants; sedation-ready with minimal motion.",
  },
  {
    title: "Aftercare",
    summary: "Retention, hygiene coaching, and reviews timed to your plan with finance aligned to each stage.",
  },
];

const stories: StoryCard[] = [
  {
    title: "Veneers for chipped edges",
    blurb: "Two visits with digital mock-ups and soft-gloss porcelain for a natural coastal finish.",
    tag: "Veneers",
  },
  {
    title: "Implant to replace a premolar",
    blurb: "CBCT-led placement with a custom crown; patient back to hiking within days.",
    tag: "Implants",
  },
  {
    title: "Aligner journey for crowding",
    blurb: "Spark plan with remote check-ins and night-time retainers to hold the new arc.",
    tag: "Orthodontics",
  },
  {
    title: "Brightening before bonding",
    blurb: "Sensitivity-safe whitening followed by edge bonding to restore symmetry for camera work.",
    tag: "Whitening",
  },
];

const faqs: TreatmentFaq[] = [
  {
    question: "How long do veneers last?",
    answer: "Porcelain veneers typically last 10–15 years with good hygiene, night guards where advised, and regular reviews.",
  },
  {
    question: "Does treatment hurt?",
    answer: "Local anaesthetic, gentle prep, and guided workflows keep appointments comfortable. Sedation is available for nervous patients.",
  },
  {
    question: "Do you offer finance?",
    answer: "Yes — soft credit search finance with clear monthly examples before you commit to a plan.",
  },
  {
    question: "Can I start online?",
    answer: "Use the AI Smile Quiz or send photos for an e-consult; we’ll confirm suitability and book you in.",
  },
  {
    question: "What technology do you use?",
    answer: "CBCT, intraoral scanning, and 3D printing support planning, surgical guides, and retainers across treatments.",
  },
];

export default function TreatmentsPreview() {
  return (
    <div className={layoutStyles.previewCanvas}>
      <PreviewTreatmentsHero
        primaryCta={{ label: "Take the AI Smile Quiz", href: "/ai-smile-quiz" }}
        secondaryCta={{ label: "Book a consultation", href: "/contact" }}
      />

      <main className="cpv-main" role="main">
        <ConcernRail items={concernCards} />
        <TreatmentHowItWorksPreview steps={howToSteps} />
        <TreatmentFinancePreview />
        <TreatmentTechHighlight />
        <StoriesTeaser stories={stories} />
        <TreatmentMicroFaq faqs={faqs} />
      </main>
      <TreatmentHubPreviewSchema />
      <div className="cpv-footer-note">
        <p>
          Preview canvas mirrors the Champagne homepage: dusk-to-ink palette, magenta/teal accents, and glass shells with reduced motion ready.
        </p>
        <Link href="/preview/home" className="cpv-footer-note__link">
          Compare with home preview
        </Link>
      </div>
    </div>
  );
}
