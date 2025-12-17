import { getPageManifest } from "@champagne/manifests";
import { notFound } from "next/navigation";

import PageBuilder from "../../components/PageBuilder";

type PageParams = Promise<{ page: string }>;

function normalizePagePath(page: string): string {
  const decoded = decodeURIComponent(page);
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

export default async function SitePage({ params }: { params: PageParams }) {
  const resolved = await params;
  const pagePath = normalizePagePath(resolved.page);
  const manifest = getPageManifest(pagePath);
  const manifestPath = manifest?.path;

  if (!manifestPath || manifestPath.startsWith("/treatments/")) {
    return notFound();
  }

  return <PageBuilder pageId={manifestPath} />;
}
