import type { Metadata } from "next";

import ChampagnePageBuilder from "./(champagne)/_builder/ChampagnePageBuilder";

const PAGE_PATH = "/";
const PAGE_TITLE = "Home";
const PAGE_DESCRIPTION = "Neutral skeleton for the Champagne Ecosystem marketing site.";
const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function Page() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PAGE_TITLE,
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
