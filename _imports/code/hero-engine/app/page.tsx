import ChampagneHero from "@/components/home/ChampagneHero";
import Hero4KVideo from "@/components/hero/4k-hero-video";
import SmileJourney from "@/components/sections/SmileJourney";

export default function HomePage() {
  return (
    <main className="space-y-0">
      {process.env.NEXT_PUBLIC_FEATURE_BRAND_HERO && <ChampagneHero />}
      <Hero4KVideo />
      <SmileJourney />
    </main>
  );
}
