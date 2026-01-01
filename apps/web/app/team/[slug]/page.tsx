import { notFound } from "next/navigation";
import { getPageManifestBySlug } from "@champagne/manifests";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";
import { HeroRenderer } from "../../components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "../../featureFlags";

type PageParams = Promise<{ slug: string }>;

export default async function TeamMemberPage({ params }: { params: PageParams }) {
  const resolved = await params;
  const manifestPath = `/team/${resolved.slug}`;
  const manifest = getPageManifestBySlug(manifestPath);
  const isHeroEnabled = isBrandHeroEnabled();

  if (!manifest) {
    return notFound();
  }

  return (
    <>
      {isHeroEnabled && <HeroRenderer pageCategory="profile" />}
      <ChampagnePageBuilder slug={manifestPath} />
    </>
  );
}
