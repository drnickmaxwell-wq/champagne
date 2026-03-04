import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

export function generateMetadata(): Metadata {
  const manifest = getPageManifest("/team");
  const title = manifest?.label ?? "Team";
  const description =
    (manifest as { description?: string; intro?: string } | undefined)?.description ??
    (manifest as { description?: string; intro?: string } | undefined)?.intro ??
    "Meet the Champagne clinical team.";

  return { title, description };
}

export default function TeamPage() {
  return <ChampagnePageBuilder slug="/team" />;
}
