import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../_builder/ChampagnePageBuilder";

const manifest = getPageManifest("/smile-gallery") as { label?: string; description?: string; intro?: string } | undefined;

export const metadata: Metadata = {
  title: manifest?.label ?? "Smile gallery",
  description: manifest?.description ?? manifest?.intro ?? "View smile gallery examples from the practice.",
};

export default function Page() {
  return <ChampagnePageBuilder slug="/smile-gallery" />;
}
