import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles.css";

export const metadata: Metadata = { title: "Champagne Design Studio", robots: { index: false, follow: false } };

export default function DesignLabLayout({ children }: { children: ReactNode }) {
  return <div className="dl-shell" data-production-binding="false"><header className="dl-header"><a href="/champagne/design-lab">Champagne Design Studio</a><nav aria-label="Studio shortcuts"><a href="/champagne/design-lab#shortlist">Your shortlist</a><a href="/champagne/design-lab#room-11">Room 11</a></nav></header>{children}<footer className="dl-footer"><span>Champagne Design Studio</span><details><summary>Internal status</summary><p>Noindex · Draft-only · No production binding</p></details></footer></div>;
}
