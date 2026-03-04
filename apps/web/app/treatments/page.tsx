import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

export function generateMetadata(): Metadata {
  const manifest = getPageManifest("/treatments");
  const title = manifest?.label ?? "Treatments";
  const description =
    (manifest as { description?: string; intro?: string } | undefined)?.description ??
    (manifest as { description?: string; intro?: string } | undefined)?.intro ??
    "Explore available Champagne treatments.";

  return { title, description };
}

export default function TreatmentsHubPage() {
  return <ChampagnePageBuilder slug="/treatments" />;
}
