import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";
import { ChampagneHeroFrame, getHeroBySlug } from "@champagne/hero";
import { ChampagneSectionRenderer } from "@champagne/sections";

const PAGE_PATH = "/legal/privacy";
const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const manifest = getPageManifest(PAGE_PATH) as { label?: string; title?: string; description?: string; intro?: string } | undefined;
const title = manifest?.label ?? manifest?.title ?? "Privacy Policy";
const description = manifest?.description ?? manifest?.intro ?? "Privacy Policy for St Mary's House Dental Care.";

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

export default function Page() {
  const hero = getHeroBySlug(PAGE_PATH);
  const legalJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${PRODUCTION_CANONICAL_ORIGIN}${PAGE_PATH}`,
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
      <main className="space-y-8">
        <ChampagneHeroFrame heroId={hero.id} headline={hero.label ?? "Privacy surface"} />
        <ChampagneSectionRenderer pageSlug={PAGE_PATH} />
      </main>
    </>
  );
}
