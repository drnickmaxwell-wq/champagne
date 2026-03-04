import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

export function generateMetadata(): Metadata {
  const manifest = getPageManifest("/fees");
  const title = manifest?.label ?? "Fees";
  const description =
    (manifest as { description?: string; intro?: string } | undefined)?.description ??
    (manifest as { description?: string; intro?: string } | undefined)?.intro ??
    "Review treatment fees and pricing guidance.";

  return { title, description };
}

export default function FeesPage() {
  return <ChampagnePageBuilder slug="/fees" />;
}
