import type { Metadata } from "next";
import { getPageManifest } from "@champagne/manifests";
import { notFound } from "next/navigation";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";

type PageParams = Promise<{ page: string }>;

function normalizePagePath(page: string): string {
  const decoded = decodeURIComponent(page);
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

async function resolveSitePage(params: PageParams) {
  const resolved = await params;
  const pagePath = normalizePagePath(resolved.page);
  const manifest = getPageManifest(pagePath);
  const manifestPath = manifest?.path ?? pagePath;

  return { manifest, manifestPath };
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { manifest, manifestPath } = await resolveSitePage(params);

  if (!manifestPath || manifestPath.startsWith("/treatments/")) {
    return { title: "Page not found" };
  }

  const title = manifest?.label ?? "Page";
  const description =
    (manifest as { description?: string; intro?: string } | undefined)?.description ??
    (manifest as { description?: string; intro?: string } | undefined)?.intro ??
    `View ${title} information.`;

  return {
    title,
    description,
  };
}

export default async function SitePage({ params }: { params: PageParams }) {
  const { manifestPath } = await resolveSitePage(params);

  if (!manifestPath || manifestPath.startsWith("/treatments/")) {
    return notFound();
  }

  return (
    <>
      <ChampagnePageBuilder slug={manifestPath} />
    </>
  );
}
