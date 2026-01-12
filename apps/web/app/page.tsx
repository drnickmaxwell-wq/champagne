import type { Metadata } from "next";

import ChampagnePageBuilder from "./(champagne)/_builder/ChampagnePageBuilder";

export const metadata: Metadata = {
  title: "St Mary’s House Dental Care | Private Dentist in Shoreham-by-Sea",
  description:
    "Calm, clinician-led private dentistry in Shoreham-by-Sea. Restorative, cosmetic and implant care with careful planning, clear explanations and a long-established local team.",
};

export default function Page() {
  return <ChampagnePageBuilder slug="/" />;
}
