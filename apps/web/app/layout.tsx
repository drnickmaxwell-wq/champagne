import type { ReactNode } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { HeroMount } from "./_components/HeroMount";
import { isBrandHeroEnabled } from "./featureFlags";
import { ConciergeLayer } from "./components/concierge/ConciergeLayer";
import { getPageManifest } from "@champagne/manifests";
import type { HeroMode } from "@champagne/hero";

export const metadata = {
  title: "St Mary’s House Dental – Champagne Core",
  description: "Neutral skeleton for the Champagne Ecosystem marketing site.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {  const tokenInitScript = `
    const root = document.documentElement;
    root.style.setProperty('--brand-magenta', '#C2185B');
    root.style.setProperty('--brand-teal', '#40C4B4');
    root.style.setProperty('--brand-gold', '#D4AF37');
    root.style.setProperty('--ink', '#0B0D0F');
    root.style.setProperty('--brand-white', '#FFFFFF');
  `;  const headersList = await headers();
  const requestUrl = headersList.get("next-url") ?? "";
  const isPublicPage = !requestUrl.startsWith("/champagne/");
  const isHeroEnabled = isBrandHeroEnabled();
  const pathname = (requestUrl.split("?")[0] || "/") || "/";
  const manifest = getPageManifest(pathname);

  let pageCategory: string | undefined;
  let mode: HeroMode | undefined;
  let treatmentSlug: string | undefined;

  if (pathname.startsWith("/treatments/")) {
    mode = "treatment";
    treatmentSlug = pathname.split("/")[2] || undefined;
    pageCategory = "treatment";
  } else if (pathname.startsWith("/team/")) {
    pageCategory = "profile";
  } else if (pathname === "/team") {
    pageCategory = "utility";
  } else if (pathname === "/about") {
    pageCategory = "utility";
  } else if (pathname === "/contact") {
    pageCategory = "utility";
  } else if (pathname === "/blog") {
    pageCategory = "editorial";
  } else if (pathname === "/treatments") {
    pageCategory = "utility";
  } else if (pathname === "/fees") {
    pageCategory = "utility";
  } else if (pathname === "/smile-gallery") {
    pageCategory = "utility";
  } else if (pathname === "/") {
    pageCategory = "home";
  } else {
    pageCategory = (manifest as { category?: string })?.category;
  }

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: tokenInitScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
          <div className="sticky top-0 z-50">
            <Header />
          </div>
          <main className="flex-1 px-6 py-10">
            {isPublicPage && isHeroEnabled && (
              <HeroMount
                mode={mode}
                treatmentSlug={treatmentSlug}
                pageCategory={pageCategory}
              />
            )}
            {children}
          </main>
          <Footer />
        </div>
        <ConciergeLayer />
      </body>
    </html>
  );
}
