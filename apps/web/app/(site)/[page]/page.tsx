import { getPageManifest } from "@champagne/manifests";
import { notFound } from "next/navigation";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";
import { HeroRenderer } from "../../components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "../../featureFlags";

type PageParams = Promise<{ page: string }>;

function normalizePagePath(page: string): string {
  const decoded = decodeURIComponent(page);
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

export default async function SitePage({ params }: { params: PageParams }) {
  const resolved = await params;
  const pagePath = normalizePagePath(resolved.page);
  const manifest = getPageManifest(pagePath);
  const manifestPath = manifest?.path ?? pagePath;

  if (!manifestPath || manifestPath.startsWith("/treatments/")) {
    return notFound();
  }

  const heroEnabled = isBrandHeroEnabled();
  const pageCategory = (manifest as { category?: string })?.category;

  return (
    <>
      {heroEnabled && <HeroRenderer pageCategory={pageCategory} />}
      <ChampagnePageBuilder slug={manifestPath} />
    </>
  );
}
