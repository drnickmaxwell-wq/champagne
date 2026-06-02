import type { Metadata } from "next";
import {
  buildWebPageNode,
  getCanonicalOrigin,
  getPageManifest,
} from "@champagne/manifests";

import ChampagnePageBuilder from "../_builder/ChampagnePageBuilder";

const PAGE_PATH = "/about";
const manifest = getPageManifest(PAGE_PATH) as
  | { label?: string; description?: string; intro?: string }
  | undefined;
const title = manifest?.label ?? "About St Mary's House Dental Care";
const description =
  manifest?.description ?? manifest?.intro ?? "Learn about St Mary's House Dental Care in Shoreham-by-Sea.";

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
  const pageJsonLd = {
    "@context": "https://schema.org",
    ...buildWebPageNode(PAGE_PATH, title, description),
    url: `${getCanonicalOrigin()}${PAGE_PATH}`,
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
