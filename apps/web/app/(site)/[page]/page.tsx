import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";
import { notFound } from "next/navigation";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";

const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";

type PageParams = Promise<{ page: string }>;

function normalizePagePath(page: string): string {
  const decoded = decodeURIComponent(page);
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const resolved = await params;
  const pagePath = normalizePagePath(resolved.page);
  const manifest = getPageManifest(pagePath) as
    | { path?: string; label?: string; description?: string; intro?: string }
    | undefined;
  const manifestPath = manifest?.path ?? pagePath;

  if (!manifestPath || manifestPath.startsWith("/treatments/")) {
    return {
      title: "Page not found",
      description: "The page you are looking for could not be found.",
    };
  }

  const title = manifest?.label ?? (manifestPath.replace(/^\//, "") || "Page");
  const description =
    manifest?.description ?? manifest?.intro ?? `Explore ${manifest?.label ?? manifestPath.replace(/^\//, "")}.`;

  return {
    title,
    description,
    alternates: {
      canonical: manifestPath,
    },
    openGraph: {
      title,
      description,
      url: manifestPath,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SitePage({ params }: { params: PageParams }) {
  const resolved = await params;
  const pagePath = normalizePagePath(resolved.page);
  const manifest = getPageManifest(pagePath) as { path?: string; label?: string } | undefined;
  const manifestPath = manifest?.path ?? pagePath;

  if (!manifestPath || manifestPath.startsWith("/treatments/")) {
    return notFound();
  }

  const title = manifest?.label ?? (manifestPath.replace(/^\//, "") || "Page");
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${PRODUCTION_CANONICAL_ORIGIN}${manifestPath}`,
    isPartOf: {
      "@id": `${PRODUCTION_CANONICAL_ORIGIN}/#website`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <ChampagnePageBuilder slug={manifestPath} />
    </>
  );
}
