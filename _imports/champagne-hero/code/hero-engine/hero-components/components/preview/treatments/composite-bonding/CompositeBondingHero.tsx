import { HeroEngine } from "@/components/champagne/hero/HeroEngine";
import { composite_bonding_hero } from "@/lib/champagne/hero-presets";

import styles from "./composite-bonding-preview.module.css";

export function CompositeBondingHero() {
  return (
    <div className={styles.heroBand}>
      <HeroEngine schema={composite_bonding_hero} />
    </div>
  );
}
