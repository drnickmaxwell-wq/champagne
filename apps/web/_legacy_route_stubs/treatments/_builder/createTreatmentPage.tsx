import type { ReactElement } from "react";

import ChampagnePageBuilder from "../../_builder/ChampagnePageBuilder";
import { HeroRenderer } from "../../../components/hero/HeroRenderer";
import { isBrandHeroEnabled } from "../../../featureFlags";

type PageSearchParams = { [key: string]: string | string[] | undefined };

function hasHeroDebug(searchParams?: PageSearchParams) {
  const value = searchParams?.heroDebug;

  if (Array.isArray(value)) {
    return value.some((entry) => entry && entry !== "0");
  }

  return Boolean(value && value !== "0");
}

async function resolveHeroDebug(searchParams?: Promise<PageSearchParams>) {
  const resolved = searchParams ? await searchParams : undefined;
  return hasHeroDebug(resolved);
}

export const dynamic = "force-dynamic";

function deriveTreatmentSlug(pageSlug: string) {
  if (!pageSlug) return undefined;
  const normalized = pageSlug.startsWith("/") ? pageSlug : `/${pageSlug}`;
  const match = normalized.match(/\/treatments\/(.+)/);
  return match?.[1];
}

export function createTreatmentPage(pageSlug: string) {
  return async function TreatmentPage({
    searchParams,
  }: {
    searchParams?: Promise<PageSearchParams>;
  }): Promise<ReactElement> {
    const heroDebugEnabled = await resolveHeroDebug(searchParams);
    const shouldRenderHero = heroDebugEnabled || isBrandHeroEnabled();
    const treatmentSlug = deriveTreatmentSlug(pageSlug);

    if (process.env.NODE_ENV === "development" && heroDebugEnabled) {
      console.info("[HeroRenderer] mounted", {
        pageKey: pageSlug,
        heroId: undefined,
        heroDebug: heroDebugEnabled,
      });
    }

    return (
      <>
        {shouldRenderHero && (
          <HeroRenderer
            mode="treatment"
            treatmentSlug={treatmentSlug}
            pageCategory="treatment"
          />
        )}
        <ChampagnePageBuilder slug={pageSlug} />
      </>
    );
  };
}
