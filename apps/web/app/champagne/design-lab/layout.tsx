import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./styles.css";
import "./atelier-r4.css";
import "./atelier-r4.2.css";
import "./atelier-r4.3.css";
import "./atelier-r4.4.css";
import "./atelier-r4.5.css";
import "./atelier-r4.6.css";
import "./atelier-r4.7.css";
import "./atelier-r4.8.css";
import "./atelier-r4.9.css";
import "./atelier-r4.10.css";
import "./atelier-r4.11.css";
import "./atelier-r4.12.css";
import "./atelier-r4.14.css";

export const metadata: Metadata = { title: "Champagne Atelier", robots: { index: false, follow: false } };

export default function DesignLabLayout({ children }: { children: ReactNode }) {
  return <div className="dl-shell" data-production-binding="false">{children}</div>;
}
