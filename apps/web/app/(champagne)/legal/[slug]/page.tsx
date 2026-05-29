import path from "node:path";
import type { Metadata } from "next";
import { getAllPages, getPageManifest } from "@champagne/manifests";
import { notFound } from "next/navigation";

import ChampagnePageBuilder from "../../_builder/ChampagnePageBuilder";

const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const LEGAL_ROUTE_PREFIX = "/legal/";

type PageParams = Promise<{ slug: string }>;
type LegalManifest = { path?: string; label?: string; title?: string; description?: string; intro?: string; category?: string };

function resolvePagePath(slug?: string) {
  if (!slug) return null;

  try {
    const decodedSlug = decodeURIComponent(slug);
    if (!decodedSlug.trim()) return null;

    const normalizedPath = path.posix.normalize(`${LEGAL_ROUTE_PREFIX}${decodedSlug}`);
    if (!normalizedPath.startsWith(LEGAL_ROUTE_PREFIX)) return null;

    return normalizedPath;
  } catch {
    return null;
  }
}

function getPublicLegalManifest(pagePath: string): LegalManifest | null {
  const manifest = getPageManifest(pagePath) as LegalManifest | undefined;
  if (manifest?.path !== pagePath || manifest.category !== "legal") return null;
  return manifest;
}

function getLegalPageDetails(manifest: LegalManifest) {
  const title = manifest.label ?? manifest.title ?? "Legal information";
  const description = manifest.description ?? manifest.intro ?? `${title} for St Mary's House Dental Care.`;
  const canonicalPath = manifest.path ?? LEGAL_ROUTE_PREFIX;

  return {
    title,
    description,
    canonicalPath,
    canonicalUrl: `${PRODUCTION_CANONICAL_ORIGIN}${canonicalPath}`,
  };
}

export function generateStaticParams() {
  return getAllPages()
    .filter((page) => page.category === "legal" && page.path?.startsWith(LEGAL_ROUTE_PREFIX) && page.path !== "/legal/privacy")
    .map((page) => ({ slug: page.path?.replace(LEGAL_ROUTE_PREFIX, "") }));
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const resolvedParams = await params;
  const pagePath = resolvePagePath(resolvedParams.slug);
  if (!pagePath) return { title: "Legal page not found" };

  const manifest = getPublicLegalManifest(pagePath);
  if (!manifest) return { title: "Legal page not found" };

  const { title, description, canonicalPath } = getLegalPageDetails(manifest);
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

export default async function Page({ params }: { params: PageParams }) {
  const resolvedParams = await params;
  const pagePath = resolvePagePath(resolvedParams.slug);

  if (!pagePath) {
    notFound();
  }

  const manifest = getPublicLegalManifest(pagePath);
  if (!manifest) {
    notFound();
  }

  const { title, description, canonicalUrl } = getLegalPageDetails(manifest);
  const legalJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    isPartOf: {
      "@id": `${PRODUCTION_CANONICAL_ORIGIN}/#website`,
    },
    publisher: {
      "@id": `${PRODUCTION_CANONICAL_ORIGIN}/#dentist`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalJsonLd) }}
      />
      <ChampagnePageBuilder slug={pagePath} />
    </>
  );
}
