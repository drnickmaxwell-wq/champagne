import type { Metadata } from "next";

import ChampagnePageBuilder from "../(champagne)/_builder/ChampagnePageBuilder";

export const metadata: Metadata = {
  title: "Contact | St Mary’s House Dental",
  description: "Get in touch to ask a question, plan a visit, or request a consultation.",
};

export default function ContactPage() {
  return <ChampagnePageBuilder slug="/contact" />;
}
