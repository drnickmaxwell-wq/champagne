import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { HeroMount } from "./_components/HeroMount";
import { isBrandHeroEnabled } from "./featureFlags";
import { ConciergeLayer } from "./components/concierge/ConciergeLayer";
import {
  buildSiteSchemaGraph,
  getDefaultSeoDescription,
  getPageManifest,
  getPracticeName,
} from "@champagne/manifests";
import type { HeroMode } from "@champagne/hero";

type PageSeoManifest = {
  label?: string;
  title?: string;
  description?: string;
  intro?: string;
  category?: string;
};

const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const PRACTICE_NAME = getPracticeName();
const DEFAULT_DESCRIPTION = getDefaultSeoDescription();

function isProductionIndexable() {
  return process.env.VERCEL_ENV === "production";
}

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_CANONICAL_ORIGIN),
  title: "St Mary's House Dental Care | Shoreham-by-Sea Private Dentistry",
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
  const manifest = getPageManifest(pathname) as PageSeoManifest | undefined;
  const pageTitle = manifest?.label ?? manifest?.title ?? PRACTICE_NAME;
  const pageDescription = manifest?.description ?? manifest?.intro ?? DEFAULT_DESCRIPTION;
  const siteSchemaGraph = buildSiteSchemaGraph(pathname, pageTitle, pageDescription);

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
    pageCategory = manifest?.category;
  }

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchemaGraph) }}
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
