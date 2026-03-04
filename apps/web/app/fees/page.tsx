import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

const manifest = getPageManifest("/fees") as { label?: string; description?: string; intro?: string } | undefined;

export const metadata: Metadata = {
  title: manifest?.label ?? "Fees",
  description: manifest?.description ?? manifest?.intro ?? "Learn about treatment fees and planning.",
};

export default function FeesPage() {
  return <ChampagnePageBuilder slug="/fees" />;
}
