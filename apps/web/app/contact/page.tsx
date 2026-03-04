import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

const manifest = getPageManifest("/contact") as { label?: string; description?: string; intro?: string } | undefined;

export const metadata: Metadata = {
  title: manifest?.label ?? "Contact",
  description: manifest?.description ?? manifest?.intro ?? "Contact the practice for appointments and enquiries.",
};

export default function ContactPage() {
  return <ChampagnePageBuilder slug="/contact" />;
}
