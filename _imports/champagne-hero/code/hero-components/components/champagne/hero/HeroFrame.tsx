import type { ReactNode } from "react";

import { HeroCTABar } from "./HeroCTABar";
import { HeroShimmer } from "./HeroShimmer";
import { HeroWaveStack } from "./HeroWaveStack";
import { getHeroToneClasses } from "@/lib/champagne/hero-tone";
import type { HeroSchema } from "@/lib/champagne/hero-schema";

type HeroFrameProps = {
  schema: HeroSchema;
  children?: ReactNode;
};

export function HeroFrame({ schema, children }: HeroFrameProps) {
  const toneClass = schema.tone === "teal-lux" ? "hero-tonal-teal-lux" : `hero-tonal-${schema.tone}`;
  const intensityClass = schema.intensity === "soft"
    ? "hero-intensity-soft"
    : schema.intensity === "lux"
      ? "hero-intensity-lux"
      : "";
  const layoutClass = schema.layout === "center" ? "hero-layout-center" : "hero-layout-left";
  const tone = getHeroToneClasses(schema);
  const sectionClassName = [
    "hero-engine-shell hero-gradient-base hero-frame",
    toneClass,
    intensityClass,
    tone.wrapperToneClass,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={sectionClassName}
      aria-label={schema.headline}
      data-hero-time={schema.toneProfile.timeOfDay}
      data-hero-mood={schema.toneProfile.mood}
    >
      <HeroWaveStack waves={schema.waves} strength={schema.waveStrength} className={tone.waveToneClass} />
      <HeroShimmer shimmer={schema.shimmer} tone={schema.tone} className={tone.shimmerToneClass} />

      <div className={`hero-engine__inner ${layoutClass}`}>
        <div className="hero-engine__content">
          {schema.eyebrow ? <p className="hero-engine__eyebrow">{schema.eyebrow}</p> : null}
          <h1 className="hero-engine__headline">{schema.headline}</h1>
          <p className="hero-engine__subcopy">{schema.subcopy}</p>
          <HeroCTABar cta={schema.cta} toneVariant={tone.ctaToneVariant} />
          {children}
        </div>
      </div>
    </section>
  );
}
