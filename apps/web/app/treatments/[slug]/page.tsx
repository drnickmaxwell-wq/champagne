import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTreatmentManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";

export const dynamic = "force-dynamic";

type PageParams = { slug: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smhdental.co.uk";

async function resolveTreatment(params: Promise<PageParams>) {
  const resolved = await params;
  const manifest = getTreatmentManifest(resolved.slug);
  const requestedPath = `/treatments/${resolved.slug}`;
  const pageSlug = manifest?.path ?? `/treatments/${resolved.slug}`;

  return { manifest, pageSlug, requestedPath };
}

function serializeJsonLd(payload: Record<string, unknown>) {
  return JSON.stringify(payload).replace(/<\//g, "<\\/");
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
  const { manifest, pageSlug, requestedPath } = await resolveTreatment(params);

  if (!manifest) {
    return notFound();
  }

  if (pageSlug !== requestedPath) {
    permanentRedirect(pageSlug);
  }

  const title = manifest.label ?? "Treatment";
  const description =
    (manifest as { description?: string; intro?: string }).description ??
    (manifest as { description?: string; intro?: string }).intro ??
    "Explore this treatment option.";

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}${pageSlug}#service`,
    serviceType: title,
    name: title,
    description,
    provider: {
      "@type": "Dentist",
      name: "St Mary’s House Dental",
      url: siteUrl,
    },
    url: `${siteUrl}${pageSlug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Treatments",
        item: `${siteUrl}/treatments`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${siteUrl}${pageSlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <ChampagnePageBuilder slug={pageSlug} />
    </>
  );
}
