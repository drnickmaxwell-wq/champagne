import type { MetadataRoute } from "next";
import { getAllPages } from "@champagne/manifests";

const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const EXCLUDED_PREFIXES = ["/champagne/", "/api/"];
const EXCLUDED_PATHS = new Set(["/patient-portal"]);
const SEO_FOUNDATION_LAST_MODIFIED = new Date("2026-05-28T00:00:00.000Z");

type SitemapChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type PublicRoutePolicy = {
  changeFrequency: SitemapChangeFrequency;
  priority: number;
  lastModified?: Date;
};

function normalizePublicPath(path: string | undefined): string | null {
  if (!path || !path.startsWith("/")) return null;
  const normalizedPath = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  if (EXCLUDED_PATHS.has(normalizedPath)) return null;
  if (EXCLUDED_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))) return null;
  return normalizedPath;
}

function getRoutePolicy(path: string): PublicRoutePolicy {
  if (path === "/") {
    return { changeFrequency: "weekly", priority: 1, lastModified: SEO_FOUNDATION_LAST_MODIFIED };
  }

  if (path === "/treatments") {
    return { changeFrequency: "weekly", priority: 0.9, lastModified: SEO_FOUNDATION_LAST_MODIFIED };
  }

  if (path.startsWith("/treatments/")) {
    return { changeFrequency: "monthly", priority: 0.82, lastModified: SEO_FOUNDATION_LAST_MODIFIED };
  }

  if (["/contact", "/fees", "/team", "/about"].includes(path)) {
    return { changeFrequency: "monthly", priority: 0.76, lastModified: SEO_FOUNDATION_LAST_MODIFIED };
  }

  if (path.startsWith("/team/")) {
    return { changeFrequency: "monthly", priority: 0.68, lastModified: SEO_FOUNDATION_LAST_MODIFIED };
  }

  if (path.startsWith("/legal/")) {
    return { changeFrequency: "yearly", priority: 0.35, lastModified: SEO_FOUNDATION_LAST_MODIFIED };
  }

  return { changeFrequency: "monthly", priority: 0.6, lastModified: SEO_FOUNDATION_LAST_MODIFIED };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const uniquePaths = Array.from(
    new Set(
      getAllPages()
        .map((page) => normalizePublicPath(page.path))
        .filter((path): path is string => Boolean(path)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  return uniquePaths.map((path) => ({
    url: `${PRODUCTION_CANONICAL_ORIGIN}${path}`,
    ...getRoutePolicy(path),
  }));
}
