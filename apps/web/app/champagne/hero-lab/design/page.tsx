import type { Metadata } from "next";
import { HeroMount } from "../../../_components/HeroMount";
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

  return (
    <DesignChamber
      initialReducedMotion={reducedMotion}
      hero={
        <HeroMount
          mode="home"
          pageCategory="home"
          prm={reducedMotion}
          particles
          filmGrain
        />
      }
    />
  );
}
