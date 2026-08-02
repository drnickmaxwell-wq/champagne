import type { Metadata } from "next";
import { buildHeroV2Model } from "../../../components/hero/v2/buildHeroV2Model";
import { HeroRendererV2 } from "../../../components/hero/v2/HeroRendererV2";
import { DesignChamber } from "./DesignChamber";

export const metadata: Metadata = {
  title: "Champagne Design Laboratory — Persian Token Chamber",
  robots: { index: false, follow: false },
};

export default async function ChampagneDesignLabPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const reducedMotion = params.labMotion === "reduce";
  const compositionOnly = params.labView === "composition";
  const route = typeof params.route === "string" ? params.route : "/";
  const viewport = params.viewport === "tablet" || params.viewport === "mobile" ? params.viewport : "desktop";
  const candidate = typeof params.candidate === "string" ? params.candidate : undefined;
  const porcelain = typeof params.porcelain === "string" ? params.porcelain : undefined;
  const heroProps = {
    mode: "home" as const,
    pageCategory: "home",
    pageSlugOrPath: "/",
    prm: reducedMotion,
    particles: true,
    filmGrain: true,
  };
  const heroModel = await buildHeroV2Model(heroProps);

  return (
    <DesignChamber
      initialReducedMotion={reducedMotion}
      compositionOnly={compositionOnly}
      initialRoute={route}
      initialViewport={viewport}
      initialCandidateId={candidate}
      initialPorcelainId={porcelain}
      hero={
        <div data-hero-engine="v2" data-lab-engine-override="true" style={{ minHeight: "72vh" }}>
          <HeroRendererV2
            {...heroProps}
            initialModel={heroModel}
            initialPathname="/"
          />
        </div>
      }
    />
  );
}
