import type { ReactNode } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { HeroMount } from "./_components/HeroMount";
import { HeroPersistentSubtree } from "./components/hero/v2/HeroV2Client";
import { isBrandHeroEnabled } from "./featureFlags";
import { getPageManifest } from "@champagne/manifests";
import type { HeroMode } from "@champagne/hero";

export const metadata = {
  title: "St Mary’s House Dental – Champagne Core",
  description: "Neutral skeleton for the Champagne Ecosystem marketing site.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const requestUrl = headersList.get("next-url") ?? "";
  const isPublicPage = !requestUrl.startsWith("/champagne/");
  const isHeroEnabled = isBrandHeroEnabled();
  const heroPersistFlag = process.env.NEXT_PUBLIC_HERO_V2_PERSIST;
  const heroPersistNormalized = (heroPersistFlag ?? "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .toLowerCase();
  const heroPersistEnabled = heroPersistNormalized === "1";
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
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
          <div className="sticky top-0 z-50">
            <Header />
          </div>
          <main className="flex-1 px-6 py-10">
            {isPublicPage && isHeroEnabled && (
              heroPersistEnabled ? (
                <HeroPersistentSubtree enabled={heroPersistEnabled}>
                  <HeroMount
                    mode={mode}
                    treatmentSlug={treatmentSlug}
                    pageCategory={pageCategory}
                  />
                </HeroPersistentSubtree>
              ) : (
                <HeroMount
                  mode={mode}
                  treatmentSlug={treatmentSlug}
                  pageCategory={pageCategory}
                />
              )
            )}
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
