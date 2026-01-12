import type { Metadata } from "next";

import ChampagnePageBuilder from "./(champagne)/_builder/ChampagnePageBuilder";

export const metadata: Metadata = {
  title: "St Mary’s House Dental | Patient-focused dental care",
  description:
    "Explore dentistry, implants, facial aesthetics, and patient resources at St Mary’s House Dental.",
};

export default function Page() {
  return <ChampagnePageBuilder slug="/" />;
}
