import type { ReactNode } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { HeroRenderer } from "./components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "./featureFlags";

export const metadata = {
  title: "St Mary’s House Dental – Champagne Core",
  description: "Neutral skeleton for the Champagne Ecosystem marketing site.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const requestUrl = headersList.get("next-url") ?? "";
  const isPublicPage = !requestUrl.startsWith("/champagne/");
  const isHeroEnabled = isBrandHeroEnabled();

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-6 py-10">
            <>
              {isPublicPage && isHeroEnabled && <HeroRenderer />}
              {children}
            </>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
