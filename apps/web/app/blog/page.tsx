import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

const PAGE_PATH = "/blog";
const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const manifest = getPageManifest(PAGE_PATH) as { label?: string; description?: string; intro?: string } | undefined;
const title = manifest?.label ?? "Blog";
const description = manifest?.description ?? manifest?.intro ?? "Read articles and updates from the practice.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title,
    description,
    url: PAGE_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function BlogPage() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${PRODUCTION_CANONICAL_ORIGIN}${PAGE_PATH}`,
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
      <ChampagnePageBuilder slug={PAGE_PATH} />
    </>
  );
}
