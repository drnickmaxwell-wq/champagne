import type { HeroSchema, HeroTimeOfDay } from "./hero-schema";

export interface HeroToneClasses {
  wrapperToneClass: string;
  waveToneClass?: string;
  shimmerToneClass?: string;
  ctaToneVariant?: "ink-on-light" | "ink-on-dark";
}

const TONE_CLASS_MAP: Record<HeroTimeOfDay, string> = {
  dawn: "hero-tone--dawn",
  day: "hero-tone--day",
  dusk: "hero-tone--dusk",
  night: "hero-tone--night",
};

export function getHeroToneClasses(schema: HeroSchema): HeroToneClasses {
  const { toneProfile } = schema;
  const wrapperToneClass = TONE_CLASS_MAP[toneProfile.timeOfDay] ?? TONE_CLASS_MAP.day;
  const isDarkCanvas = toneProfile.timeOfDay === "dusk" || toneProfile.timeOfDay === "night";
  const richShimmer = toneProfile.depth === "deep";

  return {
    wrapperToneClass,
    waveToneClass: isDarkCanvas ? "hero-tone-waves--on-dark" : "hero-tone-waves--on-light",
    shimmerToneClass: richShimmer ? "hero-tone-shimmer--rich" : undefined,
    ctaToneVariant: isDarkCanvas ? "ink-on-dark" : "ink-on-light",
  };
}
