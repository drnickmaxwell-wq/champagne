import { ChampagneHeroFrame, getHeroBySlug } from "@champagne/hero";
import { ChampagneSectionRenderer } from "@champagne/sections";
import { getPageManifest } from "@champagne/manifests";
import { HeroMount } from "../../../_components/HeroMount";
import { isBrandHeroEnabled } from "../../../featureFlags";

export default function Page() {
  const pagePath = "/legal/privacy";
  const isHeroEnabled = isBrandHeroEnabled();
  const manifest = getPageManifest(pagePath);
  const pageCategory = (manifest as { category?: string })?.category;
  const hero = getHeroBySlug("/legal/privacy");
  return (
    <>
      {isHeroEnabled && (
        <HeroMount pageCategory={pageCategory} pageSlugOrPath={pagePath} />
      )}
      <main className="space-y-8">
        <ChampagneHeroFrame heroId={hero.id} headline={hero.label ?? "Privacy surface"} />
        <ChampagneSectionRenderer pageSlug={pagePath} />
      </main>
    </>
  );
}
