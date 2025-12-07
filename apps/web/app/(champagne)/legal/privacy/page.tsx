import { ChampagneHeroFrame, getHeroBySlug } from "@champagne/hero";
import { ChampagneSectionRenderer } from "@champagne/sections";

export default function Page() {
  const hero = getHeroBySlug("/legal/privacy");
  return (
    <main className="space-y-8">
      <ChampagneHeroFrame heroId={hero.id} headline={hero.label ?? "Privacy surface"} />
      <ChampagneSectionRenderer pageSlug="/legal/privacy" />
    </main>
  );
}
