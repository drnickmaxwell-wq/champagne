import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  buildTreatmentSchemaGraph,
  getTreatmentManifest,
  getTreatmentPages,
  resolveTreatmentPathAlias,
} from "@champagne/manifests";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";

export const dynamicParams = false;

type PageParams = { slug: string };

export function generateStaticParams(): PageParams[] {
  return getTreatmentPages()
    .map((page) => page.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

async function resolveTreatment(params: Promise<PageParams>) {
  const resolved = await params;
  const requestedPath = `/treatments/${resolved.slug}`;
  const { resolvedPath, wasAlias } = resolveTreatmentPathAlias(resolved.slug);
  const manifest = getTreatmentManifest(resolved.slug);
  const pageSlug = manifest?.path ?? resolvedPath;

  return { manifest, pageSlug, requestedPath, wasAlias };
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
  const { manifest, pageSlug, requestedPath, wasAlias } = await resolveTreatment(params);

  if (!manifest) {
    return notFound();
  }

  if (wasAlias && requestedPath !== pageSlug) {
    permanentRedirect(pageSlug);
  }

  const treatmentTitle = manifest.label ?? "Treatment";
  const treatmentDescription =
    (manifest as { description?: string; intro?: string }).description ??
    (manifest as { description?: string; intro?: string }).intro ??
    "Explore this treatment option.";
  const treatmentSchemaGraph = buildTreatmentSchemaGraph(pageSlug, treatmentTitle, treatmentDescription);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(treatmentSchemaGraph) }}
      />
      <ChampagnePageBuilder slug={pageSlug} />
    </>
  );
}
