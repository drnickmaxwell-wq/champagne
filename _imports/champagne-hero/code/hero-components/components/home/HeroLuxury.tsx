"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import { getBrandManifest } from "@/app/brand";

type HeroAssets = {
  waveMask?: string;
  filmGrain?: string;
  glassSoft?: string;
};

const BRAND_HERO_ENABLED = Boolean(process.env.NEXT_PUBLIC_FEATURE_BRAND_HERO);

export default function HeroLuxury() {
  const [assets, setAssets] = useState<HeroAssets>({});

  useEffect(() => {
    if (!BRAND_HERO_ENABLED) {
      return;
    }

    let mounted = true;

    getBrandManifest()
      .then((manifest) => {
        if (!mounted) return;
        setAssets({
          waveMask: manifest.waves?.mask,
          filmGrain: manifest.textures?.filmGrain,
          glassSoft: manifest.textures?.glassSoft,
        });
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load brand manifest", error);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const waveMaskStyle = useMemo(() => {
    if (!assets.waveMask) return undefined;

    return {
      "--wave-mask-url": `url(${assets.waveMask})`,
    } as CSSProperties;
  }, [assets.waveMask]);

  const glassStyle = useMemo(() => {
    if (!assets.glassSoft) return undefined;

    return {
      "--hero-glass-url": `url(${assets.glassSoft})`,
    } as CSSProperties;
  }, [assets.glassSoft]);

  const grainStyle = useMemo(() => {
    if (!assets.filmGrain) return undefined;

    return {
      "--hero-grain-url": `url(${assets.filmGrain})`,
    } as CSSProperties;
  }, [assets.filmGrain]);

  if (!BRAND_HERO_ENABLED) {
    return null;
  }

  return (
    <section className="heroRoot">
      <div className="heroWaveMask" style={waveMaskStyle} />
      <div className="heroGlass" style={glassStyle} />
      <div className="heroGrain" style={grainStyle} />
      <div className="heroContent">
        <div className="card">
          <h1>Going the Extra Smile</h1>
          <p>
            Private dental care with calm precision, comfort-first technology,
            and a signature Manus AI finish.
          </p>
          <nav className="ctaRow">
            <a className="btnPrimary" href="/contact">
              Book a consultation
            </a>
            <a className="btnGhost" href="/treatments">
              Explore treatments
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
