import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatmentManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";

type PageParams = Promise<{ slug: string }>;

async function resolveTreatment(params: PageParams) {
  const resolved = await params;
  const manifest = getTreatmentManifest(resolved.slug);
  const pageSlug = manifest?.path ?? `/treatments/${resolved.slug}`;

  return { manifest, slug: resolved.slug, pageSlug };
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
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

export default async function TreatmentPage({ params }: { params: PageParams }) {
  const { manifest, pageSlug } = await resolveTreatment(params);

  if (!manifest) {
    return notFound();
  }

  return <ChampagnePageBuilder slug={pageSlug} />;
}
