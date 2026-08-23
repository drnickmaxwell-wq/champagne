import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./recovery-global.css";

export const metadata: Metadata = {
  title: "Champagne Atelier Recovery",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AtelierRecoveryLayout({ children }: { children: ReactNode }) {
  return (
    <div data-atelier-recovery-route="A0" data-production-binding="false">
      {children}
    </div>
  );
}
