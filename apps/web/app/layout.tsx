import type { Metadata } from "next";
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

const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const PRACTICE_NAME = "St Mary's House Dental Care";
const DEFAULT_DESCRIPTION = "Private dental care in Shoreham-by-Sea, with calm planning and clear patient guidance.";

function isProductionIndexable() {
  return process.env.VERCEL_ENV === "production";
}

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_CANONICAL_ORIGIN),
  title: "St Mary's House Dental - Champagne Core",
  description: DEFAULT_DESCRIPTION,
  robots: isProductionIndexable()
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
          "max-image-preview": "none",
          "max-snippet": 0,
        },
      },
  openGraph: {
    type: "website",
    siteName: PRACTICE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const requestUrl = headersList.get("next-url") ?? "";
  const isPublicPage = !requestUrl.startsWith("/champagne/");
  const isHeroEnabled = isBrandHeroEnabled();
  const pathname = (requestUrl.split("?")[0] || "/") || "/";
  const manifest = getPageManifest(pathname);
  const siteUrl = PRODUCTION_CANONICAL_ORIGIN;

  const dentistJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Dentist", "LocalBusiness"],
    "@id": `${siteUrl}/#dentist`,
    name: PRACTICE_NAME,
    url: siteUrl,
    areaServed: "Shoreham-by-Sea",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: PRACTICE_NAME,
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
