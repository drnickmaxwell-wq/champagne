import ChampagnePageBuilder from "./(champagne)/_builder/ChampagnePageBuilder";
import { HeroRenderer } from "./_components/HeroRenderer/HeroRenderer";
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
