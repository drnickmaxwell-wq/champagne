import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { HeroGate } from "./_components/HeroGate";

export const metadata = {
  title: "St Mary’s House Dental – Champagne Core",
  description: "Neutral skeleton for the Champagne Ecosystem marketing site.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="min-h-screen" style={{ backgroundColor: "var(--surface-1)" }}>
          <div className="flex min-h-screen flex-col">
            <div className="sticky top-0 z-50">
              <Header />
            </div>
            <main className="flex-1 px-6 py-10">
              <HeroGate />
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
