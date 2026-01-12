import type { Metadata } from "next";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

export const metadata: Metadata = {
  title: "Contact | St Mary’s House Dental Care, Shoreham-by-Sea",
  description:
    "Contact the team to arrange an appointment or ask a question. Find directions, opening hours and the most appropriate next step for urgent dental problems during opening hours.",
};

export default function ContactPage() {
  return <ChampagnePageBuilder slug="/contact" />;
}
