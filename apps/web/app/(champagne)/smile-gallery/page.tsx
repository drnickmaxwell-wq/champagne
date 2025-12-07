import { ChampagneHeroFrame, getHeroBySlug } from "@champagne/hero";
import { ChampagneSectionRenderer } from "@champagne/sections";

export default function Page() {
  const hero = getHeroBySlug("/smile-gallery");
  return (
    <main className="space-y-8">
      <ChampagneHeroFrame heroId={hero.id} headline={hero.label ?? "Smile gallery surface"} />
      <ChampagneSectionRenderer pageSlug="/smile-gallery" />
    </main>
  );
}
