import ChampagneHero from "@/components/home/ChampagneHero";
import "@/styles/champagne/hero.css";

export const metadata = {
  title: "Champagne Hero — Locked Preview",
  description: "Frozen preview of the canonical Manus Champagne hero.",
  robots: { index: false, follow: false },
};

const brandHeroFlag = process.env.NEXT_PUBLIC_FEATURE_BRAND_HERO;
const isHeroEnabled =
  brandHeroFlag === undefined ? true : Boolean(brandHeroFlag);

export default function Page() {
  if (!isHeroEnabled) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--smh-bg)] text-[var(--smh-text)]">
      <span className="sr-only">Champagne Hero Preview</span>
      <ChampagneHero />
    </div>
  );
}
