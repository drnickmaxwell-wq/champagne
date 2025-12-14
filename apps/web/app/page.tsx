import ChampagnePageBuilder from "./(champagne)/_builder/ChampagnePageBuilder";
import { HeroRenderer } from "./components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "./featureFlags";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const isHeroEnabled = isBrandHeroEnabled();

  return (
    <>
      {isHeroEnabled && <HeroRenderer searchParams={resolvedSearchParams} />}
      <ChampagnePageBuilder slug="/" />
    </>
  );
}
