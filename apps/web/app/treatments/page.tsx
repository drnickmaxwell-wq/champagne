import type { Metadata } from "next";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

export const metadata: Metadata = {
  title: "Treatments | St Mary’s House Dental",
  description:
    "Browse dental, implant, orthodontic, and facial aesthetic treatments with clear next steps and support.",
};

export default function TreatmentsHubPage() {
  return <ChampagnePageBuilder slug="/treatments" />;
}
