import type { MetadataRoute } from "next";
import { getAllPages } from "@champagne/manifests";

const PRODUCTION_CANONICAL_ORIGIN = "https://www.smhdental.co.uk";
const EXCLUDED_PREFIXES = ["/champagne/", "/api/"];
const EXCLUDED_PATHS = new Set(["/patient-portal"]);

function isPublicPath(path: string | undefined): path is string {
  if (!path || !path.startsWith("/")) return false;
  if (EXCLUDED_PATHS.has(path)) return false;
  if (EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix))) return false;
  return true;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const uniquePaths = Array.from(
    new Set(
      getAllPages()
        .map((page) => page.path)
        .filter(isPublicPath),
    ),
  ).sort((a, b) => a.localeCompare(b));

  return uniquePaths.map((path) => ({
    url: `${PRODUCTION_CANONICAL_ORIGIN}${path}`,
  }));
}
