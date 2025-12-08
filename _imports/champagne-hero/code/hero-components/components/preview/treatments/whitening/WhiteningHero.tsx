import { HeroEngine } from "@/components/champagne/hero/HeroEngine";
import { whitening_hero } from "@/lib/champagne/hero-presets";

import styles from "./whitening-preview.module.css";

export function WhiteningHero() {
  return (
    <div className={styles.heroBand}>
      <HeroEngine schema={whitening_hero} />
    </div>
  );
}
