"use client";

import { type CSSProperties } from "react";
import { CHAMPAGNE_SACRED_V2_OPTICAL_MATERIAL_PROFILE } from "@champagne/hero";
import styles from "./heroV3Diagnostic.module.css";

type Props = { viewport: "desktop" | "mobile"; staticMode: boolean };

export function HeroV3WaveMaterial({ viewport, staticMode }: Props) {
  const material = CHAMPAGNE_SACRED_V2_OPTICAL_MATERIAL_PROFILE;
  const style = {
    "--h3-wave-magenta": material.paletteRoles.humanEnergy,
    "--h3-wave-turquoise": material.paletteRoles.digitalClarity,
    "--h3-wave-gold": material.paletteRoles.precision,
    "--h3-wave-porcelain": material.paletteRoles.lift,
    "--h3-wave-depth": material.paletteRoles.depth,
  } as CSSProperties;
  return (
    <div
      className={styles.waveMaterial}
      style={style}
      data-h3-wave-material={material.id}
      data-h3-wave-viewport={viewport}
      data-h3-wave-static={staticMode ? "true" : "false"}
      aria-hidden="true"
    >
      <span className={styles.waveDepth} />
      <span className={styles.wavePearl} />
      <span className={styles.waveRidge} />
      <span className={styles.waveGold} />
    </div>
  );
}
