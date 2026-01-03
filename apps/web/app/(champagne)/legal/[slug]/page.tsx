import path from "node:path";
import { notFound } from "next/navigation";

import ChampagnePageBuilder from "../../_builder/ChampagnePageBuilder";

type PageParams = Promise<{ slug: string }>;

function resolvePagePath(slug?: string) {
  if (!slug) return null;

  try {
    const decodedSlug = decodeURIComponent(slug);
    if (!decodedSlug.trim()) return null;

    const normalizedPath = path.posix.normalize(`/legal/${decodedSlug}`);
    if (!normalizedPath.startsWith("/legal/")) return null;

    return normalizedPath;
  } catch {
    return null;
  }
}

export default async function Page({ params }: { params: PageParams }) {
  const resolvedParams = await params;
  const pagePath = resolvePagePath(resolvedParams.slug);

  if (!pagePath) {
    notFound();
  }

  return <ChampagnePageBuilder slug={pagePath} />;
}
