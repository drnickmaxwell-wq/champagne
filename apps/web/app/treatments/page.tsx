import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

const manifest = getPageManifest("/treatments") as { label?: string; description?: string; intro?: string } | undefined;

export const metadata: Metadata = {
  title: manifest?.label ?? "Treatments",
  description: manifest?.description ?? manifest?.intro ?? "Explore treatment options.",
};

export default function TreatmentsHubPage() {
  return <ChampagnePageBuilder slug="/treatments" />;
}
