import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles.css";

export const metadata: Metadata = { title: "Champagne Design Lab DL-R1", robots: { index: false, follow: false } };

export default function DesignLabLayout({ children }: { children: ReactNode }) {
  return <div className="dl-shell" data-production-binding="false"><header className="dl-header"><a href="/champagne/design-lab">Champagne Design Lab</a><span>DL-R1 · INTERNAL · NOINDEX</span></header>{children}<footer className="dl-footer">Evidence and composition workspace only · no production binding</footer></div>;
}
