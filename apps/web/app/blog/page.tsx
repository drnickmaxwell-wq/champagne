import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

export function generateMetadata(): Metadata {
  const manifest = getPageManifest("/blog");
  const title = manifest?.label ?? "Blog";
  const description =
    (manifest as { description?: string; intro?: string } | undefined)?.description ??
    (manifest as { description?: string; intro?: string } | undefined)?.intro ??
    "Read the latest Champagne updates and articles.";

  return { title, description };
}

export default function BlogPage() {
  return <ChampagnePageBuilder slug="/blog" />;
}
