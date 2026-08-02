import type { Metadata } from "next";
import { HeroRenderer } from "../../../components/hero/HeroRenderer";
import { DesignChamber } from "./DesignChamber";

export const metadata: Metadata = {
  title: "Champagne Design Laboratory — Persian Token Chamber",
  robots: { index: false, follow: false },
};

export default function ChampagneDesignLabPage() {
  return (
    <DesignChamber
      hero={
        <HeroRenderer
          mode="home"
          pageCategory="home"
          particles
          filmGrain
        />
      }
    />
  );
}
