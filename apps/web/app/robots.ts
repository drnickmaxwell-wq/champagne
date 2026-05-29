import type { MetadataRoute } from "next";

const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const INTERNAL_DISALLOW_PATHS = ["/champagne/", "/api/", "/patient-portal"];

function isProductionIndexable() {
  return process.env.VERCEL_ENV === "production";
}

export default function robots(): MetadataRoute.Robots {
  if (isProductionIndexable()) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: INTERNAL_DISALLOW_PATHS,
      },
      sitemap: `${PRODUCTION_CANONICAL_ORIGIN}/sitemap.xml`,
      host: PRODUCTION_CANONICAL_ORIGIN,
    };
  }

  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
    sitemap: `${PRODUCTION_CANONICAL_ORIGIN}/sitemap.xml`,
    host: PRODUCTION_CANONICAL_ORIGIN,
  };
}
