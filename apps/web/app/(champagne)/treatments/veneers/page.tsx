import { ChampagneHeroFrame, getHeroBySlug } from "@champagne/hero";
import { ChampagneSectionRenderer } from "@champagne/sections";

export default function Page() {
  const hero = getHeroBySlug("/treatments/veneers");
  return (
    <main className="space-y-8">
      <ChampagneHeroFrame heroId={hero.id} headline={hero.label ?? "Veneers surface"} />
      <ChampagneSectionRenderer pageSlug="/treatments/veneers" />
    </main>
  );
}
