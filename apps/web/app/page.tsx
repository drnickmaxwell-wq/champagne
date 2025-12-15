import ChampagnePageBuilder from "./(champagne)/_builder/ChampagnePageBuilder";
import { HeroRenderer } from "./components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "./featureFlags";

export default function Page() {
  const isHeroEnabled = isBrandHeroEnabled();

  return (
    <>
      {isHeroEnabled && <HeroRenderer />}
      <ChampagnePageBuilder slug="/" />
    </>
  );
}
