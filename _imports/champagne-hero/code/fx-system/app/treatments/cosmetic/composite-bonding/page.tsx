import BrandHeroGradient from "@/components/brand/BrandHeroGradient";
import FaqAccordion from "@/components/faq/FaqAccordion";

export const metadata = { title: "Composite Bonding" };

const champagnePhase2 = process.env.NEXT_PUBLIC_CHAMPAGNE_PHASE2 === "1";

const bondingFaq = [
  {
    question: "How durable is composite bonding?",
    answer:
      "With mindful care and routine hygiene visits, modern composites last 5–7 years on average and can be refreshed without invasive prep.",
  },
  {
    question: "Will the results look natural?",
    answer:
      "We colour-match each layer under studio lighting and polish to a glass-smooth finish, so the enhancement blends seamlessly with your enamel.",
  },
  {
    question: "What is the appointment like?",
    answer:
      "Plan for a single calm visit: digital shade capture, minimal preparation, sculpting, and final contouring in around 90 minutes per smile zone.",
  },
];

function HeroContent() {
  return (
    <section className="relative px-6 py-16 text-center md:py-24 md:text-left">
      <div className="mx-auto max-w-4xl space-y-6">
        <p className="text-sm uppercase tracking-[0.32em] text-slate-200/80">Composite Bonding</p>
        <h1 className="text-4xl font-serif text-white drop-shadow-sm md:text-5xl">
          Hand-sculpted brilliance, finished in a single visit
        </h1>
        <p className="text-base text-white/80 md:text-lg">
          We recontour edges, close micro-gaps, and brighten each tooth with feather-light layers that respect your natural
          enamel. Every smile is photographed under studio light to perfect the finish before you leave.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <a
            className={`smh-btn${champagnePhase2 ? " sparkle-hover" : ""}`}
            href="#consult"
          >
            Reserve a consultation
          </a>
          <a className="underline-offset-4 transition hover:underline" href="#faq">
            View bonding FAQs
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const hero = <HeroContent />;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {champagnePhase2 ? (
        <BrandHeroGradient
          intensity="standard"
          clip="wave-bottom"
          goldDensity="med"
          particles="gold"
          grainOpacity={0.14}
          driftEnabled
        >
          {hero}
        </BrandHeroGradient>
      ) : (
        hero
      )}

      <section id="faq" className="mx-auto mt-16 max-w-3xl space-y-8 md:mt-24">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl font-semibold md:text-4xl">Composite bonding questions</h2>
          <p className="text-slate-600 md:max-w-2xl">
            From longevity to comfort, here are the answers we cover in every consultation. Tailor your appointment before we
            sculpt the final finish.
          </p>
        </div>
        <FaqAccordion items={bondingFaq} glassEnabled={champagnePhase2} />
      </section>
    </main>
  );
}
