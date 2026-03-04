import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

const manifest = getPageManifest("/team") as { label?: string; description?: string; intro?: string } | undefined;

export const metadata: Metadata = {
  title: manifest?.label ?? "Team",
  description: manifest?.description ?? manifest?.intro ?? "Meet the dental team.",
};

export default function TeamPage() {
  return <ChampagnePageBuilder slug="/team" />;
}
