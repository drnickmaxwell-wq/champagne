import { notFound } from "next/navigation";
import { getPageManifestBySlug } from "@champagne/manifests";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";

type PageParams = Promise<{ slug: string }>;

export default async function TeamMemberPage({ params }: { params: PageParams }) {
  const resolved = await params;
  const manifestPath = `/team/${resolved.slug}`;
  const manifest = getPageManifestBySlug(manifestPath);

  if (!manifest) {
    return notFound();
  }

  return (
    <>
      <ChampagnePageBuilder slug={manifestPath} />
    </>
  );
}
