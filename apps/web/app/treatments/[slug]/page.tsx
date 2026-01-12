import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatmentManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";

export const dynamic = "force-dynamic";

type PageParams = { slug: string };

async function resolveTreatment(params: Promise<PageParams>) {
  const resolved = await params;
  const manifest = getTreatmentManifest(resolved.slug);
  const pageSlug = manifest?.path ?? `/treatments/${resolved.slug}`;

  return { manifest, pageSlug };
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { manifest } = await resolveTreatment(params);

  if (!manifest) {
    return { title: "Treatment not found" };
  }

  const fallbackDescription = "Explore this treatment option.";

  return {
    title: manifest.label ?? "Treatment",
    description: (manifest as { description?: string }).description ?? fallbackDescription,
  };
}

export default async function TreatmentPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { manifest, pageSlug } = await resolveTreatment(params);

  if (!manifest) {
    return notFound();
  }

  return (
    <>
      <ChampagnePageBuilder slug={pageSlug} />
    </>
  );
}
