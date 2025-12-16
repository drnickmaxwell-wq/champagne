import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatmentManifest } from "@champagne/manifests";

import ChampagnePageBuilder from "../../(champagne)/_builder/ChampagnePageBuilder";
import { HeroRenderer } from "../../components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "../../featureFlags";

export const dynamic = "force-dynamic";

type PageSearchParams = { [key: string]: string | string[] | undefined };

function hasHeroDebug(searchParams?: PageSearchParams) {
  const value = searchParams?.heroDebug;

  if (Array.isArray(value)) {
    return value.some((entry) => entry && entry !== "0");
  }

  return Boolean(value && value !== "0");
}

type PageParams = { slug: string };

async function resolveTreatment(params: Promise<PageParams>) {
  const resolved = await params;
  const manifest = getTreatmentManifest(resolved.slug);
  const pageSlug = manifest?.path ?? `/treatments/${resolved.slug}`;

  return { manifest, slug: resolved.slug, pageSlug };
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { manifest } = await resolveTreatment(params);

  if (!manifest) {
    return { title: "Treatment not found" };
  }

  const fallbackDescription = "Explore this treatment option.";

  return {
    title: manifest.label ?? "Treatment",
    description: (manifest as { description?: string }).description ?? fallbackDescription,
  };
}

export default async function TreatmentPage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams?: Promise<PageSearchParams>;
}) {
  const { manifest, pageSlug, slug } = await resolveTreatment(params);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const heroDebugEnabled = hasHeroDebug(resolvedSearchParams);
  const shouldRenderHero = heroDebugEnabled || isBrandHeroEnabled();
  const heroId = (manifest as { hero?: { heroId?: string } })?.hero?.heroId;

  if (!manifest) {
    return notFound();
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[treatments/[slug]] canonical route", { slug, pageSlug });
  }

  if (process.env.NODE_ENV === "development" && heroDebugEnabled) {
    console.info("[HeroRenderer] mounted", {
      pageKey: "treatment-leaf",
      heroId,
      heroDebug: heroDebugEnabled,
    });
  }

  return (
    <>
      {shouldRenderHero && (
        <HeroRenderer
          mode="treatment"
          treatmentSlug={slug}
          pageCategory="treatment"
        />
      )}
      <ChampagnePageBuilder slug={pageSlug} />
    </>
  );
}
