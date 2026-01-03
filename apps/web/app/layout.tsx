import type { ReactNode } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { HeroRenderer } from "./components/hero/HeroRenderer";
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
  const pathname = (requestUrl.split("?")[0] || "/") || "/";

  let pageCategory: string | undefined;
  let mode: HeroMode | undefined;
  let treatmentSlug: string | undefined;

  if (pathname.startsWith("/treatments/")) {
    mode = "treatment";
    treatmentSlug = pathname.split("/")[2] || undefined;
    pageCategory = "treatment";
  } else if (pathname === "/team") {
    pageCategory = "utility";
  } else if (pathname.startsWith("/team/")) {
    pageCategory = "profile";
  } else if (pathname === "/about") {
    pageCategory = "utility";
  } else if (pathname === "/contact") {
    pageCategory = "utility";
  } else if (pathname === "/blog") {
    pageCategory = "editorial";
  } else if (
    pathname !== "/" &&
    pathname !== "/treatments" &&
    pathname !== "/fees" &&
    pathname !== "/smile-gallery"
  ) {
    const manifest = getPageManifest(pathname);
    pageCategory = (manifest as { category?: string })?.category;
  }

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-6 py-10">
            <>
              {isPublicPage && isHeroEnabled && (
                <HeroRenderer
                  mode={mode}
                  treatmentSlug={treatmentSlug}
                  pageCategory={pageCategory}
                />
              )}
              {children}
            </>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
