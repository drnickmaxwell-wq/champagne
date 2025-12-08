import type { HeroAssetEntry } from "../HeroAssetRegistry";

export type HeroTimeOfDay = "day" | "evening" | "night";

export interface HeroCTAConfig {
  label: string;
  href: string;
}

export interface HeroContentConfig {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  strapline?: string;
  cta?: HeroCTAConfig;
  secondaryCta?: HeroCTAConfig;
}

export type HeroMode = "home" | "treatment";

export type HeroEnergyMode = "calm" | "balanced" | "dynamic";

export interface HeroFilmGrainSettings {
  enabled?: boolean;
  opacity?: number;
}

export interface HeroParticleBehavior {
  density?: number;
  speed?: number;
  curve?: "calm" | "sway" | "dynamic";
}

export interface HeroMotionTuning {
  parallaxDepth?: number;
  shimmerIntensity?: number;
  particleDrift?: number;
  energyMode?: HeroEnergyMode;
  particles?: HeroParticleBehavior;
}

export interface HeroLayoutConfig {
  contentAlign?: "start" | "center";
  maxWidth?: number;
  verticalOffset?: string;
  padding?: string;
}

export interface HeroSurfaceTokenConfig {
  waveMask?: {
    desktop?: string;
    mobile?: string;
  };
  background?: {
    desktop?: string;
    mobile?: string;
  };
  gradient?: string;
  overlays?: {
    dots?: string;
    field?: string;
  };
  particles?: string;
  grain?: {
    desktop?: string;
    mobile?: string;
  };
  motion?: string[];
  video?: string;
}

export interface HeroSurfaceConfig {
  waveMask?: {
    desktop?: string;
    mobile?: string;
  };
  background?: {
    desktop?: string;
    mobile?: string;
  };
  gradient?: string;
  overlays?: {
    dots?: string;
    field?: string;
  };
  particles?: string;
  grain?: {
    desktop?: string;
    mobile?: string;
  };
  motion?: string[];
  video?: string;
}

export interface ResolvedHeroSurfaceConfig {
  waveMask?: {
    desktop?: HeroAssetEntry;
    mobile?: HeroAssetEntry;
  };
  background?: {
    desktop?: HeroAssetEntry;
    mobile?: HeroAssetEntry;
  };
  gradient?: string;
  overlays?: {
    dots?: HeroAssetEntry;
    field?: HeroAssetEntry;
  };
  particles?: HeroAssetEntry;
  grain?: {
    desktop?: HeroAssetEntry;
    mobile?: HeroAssetEntry;
  };
  motion?: HeroAssetEntry[];
  video?: HeroAssetEntry;
}

export interface HeroBaseConfig {
  id: string;
  tone?: string;
  content: HeroContentConfig;
  defaultSurfaces: HeroSurfaceTokenConfig;
  layout?: HeroLayoutConfig;
  motion?: HeroMotionTuning;
  filmGrain?: HeroFilmGrainSettings;
}

export interface HeroVariantConfig {
  id: string;
  label?: string;
  tone?: string;
  treatmentSlug?: string;
  timeOfDay?: HeroTimeOfDay;
  energyMode?: HeroEnergyMode;
  content?: Partial<HeroContentConfig>;
  surfaces?: HeroSurfaceTokenConfig;
  layout?: HeroLayoutConfig;
  motion?: HeroMotionTuning;
  filmGrain?: HeroFilmGrainSettings;
}

export interface HeroRuntimeConfig {
  id: string;
  tone?: string;
  content: HeroContentConfig;
  surfaces: ResolvedHeroSurfaceConfig;
  layout: HeroLayoutConfig;
  motion: HeroMotionTuning;
  filmGrain: HeroFilmGrainSettings;
  energyMode?: HeroEnergyMode;
  variant?: HeroVariantConfig;
  flags: {
    prm: boolean;
    mode: HeroMode;
    timeOfDay?: HeroTimeOfDay;
    treatmentSlug?: string;
  };
}
