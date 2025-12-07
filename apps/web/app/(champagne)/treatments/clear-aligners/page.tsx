import { ChampagneHeroFrame, getHeroBySlug } from "@champagne/hero";
import { ChampagneSectionRenderer } from "@champagne/sections";

export default function Page() {
  const hero = getHeroBySlug("/treatments/clear-aligners");
  return (
    <main className="space-y-8">
      <ChampagneHeroFrame heroId={hero.id} headline={hero.label ?? "Clear aligners surface"} />
      <ChampagneSectionRenderer pageSlug="/treatments/clear-aligners" />
    </main>
  );
}
