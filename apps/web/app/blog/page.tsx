import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";
import { HeroRenderer } from "../components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "../featureFlags";

export default function BlogPage() {
  const isHeroEnabled = isBrandHeroEnabled();

  return (
    <>
      {isHeroEnabled && <HeroRenderer pageCategory="editorial" />}
      <ChampagnePageBuilder slug="/blog" />
    </>
  );
}
