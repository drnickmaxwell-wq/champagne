import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../_builder/ChampagnePageBuilder";

export function generateMetadata(): Metadata {
  const manifest = getPageManifest("/smile-gallery");
  const title = manifest?.label ?? "Smile Gallery";
  const description =
    (manifest as { description?: string; intro?: string } | undefined)?.description ??
    (manifest as { description?: string; intro?: string } | undefined)?.intro ??
    "Browse patient smile gallery outcomes.";

  return { title, description };
}

export default function Page() {
  return <ChampagnePageBuilder slug="/smile-gallery" />;
}
