import ChampagneHero from "@/components/home/ChampagneHero";
import "@/styles/champagne/hero.css";

export default function ChampagneHeroPreviewPage() {
  return (
    <div className="min-h-screen bg-[var(--smh-bg)] text-[var(--smh-text)]">
      <span className="sr-only">Champagne Hero Preview</span>
      <ChampagneHero />
    </div>
  );
}
