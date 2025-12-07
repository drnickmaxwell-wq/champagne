import { ChampagneHeroFrame, getHeroBySlug } from "@champagne/hero";
import { ChampagneSectionRenderer } from "@champagne/sections";

export default function Page() {
  const hero = getHeroBySlug("/about");
  return (
    <main className="space-y-8">
      <ChampagneHeroFrame heroId={hero.id} headline={hero.label ?? "About champagne surface"} />
      <ChampagneSectionRenderer pageSlug="/about" />
    </main>
  );
}
