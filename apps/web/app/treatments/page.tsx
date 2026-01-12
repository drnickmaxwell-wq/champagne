import type { Metadata } from "next";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

export const metadata: Metadata = {
  title: "Treatments | St Mary’s House Dental Care, Shoreham-by-Sea",
  description:
    "Explore private dental treatments in Shoreham-by-Sea, from routine care to complex restorative options. Clear guidance on suitability, what to expect, and next steps.",
};

export default function TreatmentsHubPage() {
  return <ChampagnePageBuilder slug="/treatments" />;
}
