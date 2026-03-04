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
  const { manifest, pageSlug } = await resolveTreatment(params);

  if (!manifest) {
    return { title: "Treatment not found" };
  }

  const fallbackDescription = "Explore this treatment option.";
  const title = manifest.label ?? "Treatment";
  const description =
    (manifest as { description?: string; intro?: string }).description ??
    (manifest as { description?: string; intro?: string }).intro ??
    fallbackDescription;
  const canonicalPath = pageSlug;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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
