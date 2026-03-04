import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

export function generateMetadata(): Metadata {
  const manifest = getPageManifest("/contact");
  const title = manifest?.label ?? "Contact";
  const description =
    (manifest as { description?: string; intro?: string } | undefined)?.description ??
    (manifest as { description?: string; intro?: string } | undefined)?.intro ??
    "Contact the Champagne team.";

  return { title, description };
}

export default function ContactPage() {
  return <ChampagnePageBuilder slug="/contact" />;
}
