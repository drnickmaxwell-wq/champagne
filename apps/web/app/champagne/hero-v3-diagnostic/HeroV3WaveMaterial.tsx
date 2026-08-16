"use client";

import { useId, type CSSProperties } from "react";
import { CHAMPAGNE_SACRED_V2_OPTICAL_MATERIAL_PROFILE } from "@champagne/hero";
import styles from "./heroV3Diagnostic.module.css";

const WAVE_PATHS = [
  "M-180 760C180 420 680 290 1180 370C1480 420 1760 600 1900 880",
  "M-120 660C240 330 760 210 1240 280C1580 330 1900 520 2050 820",
  "M-60 560C320 250 820 140 1320 210C1680 260 2010 460 2180 780",
  "M0 460C400 170 880 80 1400 150C1780 200 2140 400 2340 740",
  "M80 360C500 90 980 20 1500 80C1900 130 2280 350 2520 720",
] as const;

type Props = { viewport: "desktop" | "mobile"; staticMode: boolean };

export function HeroV3WaveMaterial({ viewport, staticMode }: Props) {
  const id = useId().replace(/:/g, "");
  const material = CHAMPAGNE_SACRED_V2_OPTICAL_MATERIAL_PROFILE;
  const style = {
    "--h3-wave-magenta": material.paletteRoles.humanEnergy,
    "--h3-wave-turquoise": material.paletteRoles.digitalClarity,
    "--h3-wave-gold": material.paletteRoles.precision,
    "--h3-wave-porcelain": material.paletteRoles.lift,
    "--h3-wave-depth": material.paletteRoles.depth,
  } as CSSProperties;
  const paint = (className: string, groupStyle?: CSSProperties) => (
    <g className={className} style={groupStyle}>
      {WAVE_PATHS.map((path, index) => <path key={path} d={path} pathLength="1000" style={{ "--h3-wave-index": index } as CSSProperties} />)}
    </g>
  );
  return (
    <svg
      className={styles.waveMaterial}
      style={style}
      data-h3-wave-material={material.id}
      data-h3-wave-viewport={viewport}
      data-h3-wave-static={staticMode ? "true" : "false"}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-pearl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--h3-wave-magenta)" />
          <stop offset="30%" stopColor="var(--h3-wave-turquoise)" />
          <stop offset="52%" stopColor="var(--h3-wave-porcelain)" />
          <stop offset="68%" stopColor="var(--h3-wave-turquoise)" />
          <stop offset="86%" stopColor="var(--h3-wave-gold)" />
          <stop offset="100%" stopColor="var(--h3-wave-turquoise)" />
        </linearGradient>
        <linearGradient id={`${id}-ridge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--h3-wave-turquoise)" stopOpacity="0" />
          <stop offset="48%" stopColor="var(--h3-wave-porcelain)" />
          <stop offset="64%" stopColor="var(--h3-wave-gold)" />
          <stop offset="100%" stopColor="var(--h3-wave-turquoise)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className={styles.waveMaterialField}>
        {paint(styles.waveDepth)}
        {paint(styles.wavePearl, { stroke: `url(#${id}-pearl)` })}
        {paint(styles.waveRidge, { stroke: `url(#${id}-ridge)` })}
        {paint(styles.waveGold)}
      </g>
    </svg>
  );
}
