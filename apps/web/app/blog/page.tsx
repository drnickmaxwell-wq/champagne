import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

const manifest = getPageManifest("/blog") as { label?: string; description?: string; intro?: string } | undefined;

export const metadata: Metadata = {
  title: manifest?.label ?? "Blog",
  description: manifest?.description ?? manifest?.intro ?? "Read articles and updates from the practice.",
};

export default function BlogPage() {
  return <ChampagnePageBuilder slug="/blog" />;
}
