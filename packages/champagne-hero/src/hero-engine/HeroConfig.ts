import type { HeroAssetEntry } from "../HeroAssetRegistry";

export type HeroTimeOfDay = "day" | "evening" | "night";
export type HeroSurfaceRole = "background" | "fx";

export interface HeroSurfaceStackLayer {
  id: string;
  role: HeroSurfaceRole;
  token?: string;
  className?: string;
  prmSafe?: boolean;
   motion?: boolean;
   suppressed?: boolean;
}

export interface HeroSurfaceLayerDefinition {
  asset?: string | HeroAssetEntry;
  blendMode?: string;
  opacity?: number;
  prmSafe?: boolean;
  className?: string;
}

export interface HeroSurfaceLayer extends HeroSurfaceLayerDefinition {
  id?: string;
  path?: string;
}

export interface HeroSurfaceLayerResolved extends HeroSurfaceLayerDefinition {
  id?: string;
  asset?: HeroAssetEntry;
  path?: string;
}

export type HeroSurfaceLayerRef = string | HeroSurfaceLayerDefinition;
export type HeroSurfaceVideoRef = HeroSurfaceLayerRef | "__OFF__";

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
  mask?: {
    desktop?: HeroSurfaceLayerRef;
    mobile?: HeroSurfaceLayerRef;
  };
  waveMask?: {
    desktop?: HeroSurfaceLayerRef;
    mobile?: HeroSurfaceLayerRef;
  };
  background?: {
    desktop?: HeroSurfaceLayerRef;
    mobile?: HeroSurfaceLayerRef;
  };
  gradient?: string;
  field?: HeroSurfaceLayerRef;
  dots?: HeroSurfaceLayerRef;
  overlays?: {
    dots?: HeroSurfaceLayerRef;
    field?: HeroSurfaceLayerRef;
  };
  caustics?: HeroSurfaceLayerRef;
  shimmer?: HeroSurfaceLayerRef;
  lighting?: HeroSurfaceLayerRef;
  particles?: HeroSurfaceLayerRef;
  grain?: {
    desktop?: HeroSurfaceLayerRef;
    mobile?: HeroSurfaceLayerRef;
  };
  motion?: HeroSurfaceLayerRef[];
  video?: HeroSurfaceVideoRef;
}

export interface HeroSurfaceConfig {
  waveMask?: {
    desktop?: HeroSurfaceLayer;
    mobile?: HeroSurfaceLayer;
  };
  background?: {
    desktop?: HeroSurfaceLayer;
    mobile?: HeroSurfaceLayer;
  };
  gradient?: string;
  overlays?: {
    dots?: HeroSurfaceLayer;
    field?: HeroSurfaceLayer;
  };
  particles?: HeroSurfaceLayer;
  grain?: {
    desktop?: HeroSurfaceLayer;
    mobile?: HeroSurfaceLayer;
  };
  motion?: HeroSurfaceLayer[];
  video?: HeroSurfaceLayer;
  surfaceStack?: HeroSurfaceStackLayer[];
}

export interface ResolvedHeroSurfaceConfig {
  waveMask?: {
    desktop?: HeroSurfaceLayerResolved;
    mobile?: HeroSurfaceLayerResolved;
  };
  background?: {
    desktop?: HeroSurfaceLayerResolved;
    mobile?: HeroSurfaceLayerResolved;
  };
  gradient?: string;
  overlays?: {
    dots?: HeroSurfaceLayerResolved;
    field?: HeroSurfaceLayerResolved;
  };
  particles?: HeroSurfaceLayerResolved;
  grain?: {
    desktop?: HeroSurfaceLayerResolved;
    mobile?: HeroSurfaceLayerResolved;
  };
  motion?: HeroSurfaceLayerResolved[];
  video?: HeroSurfaceLayerResolved;
  surfaceStack?: HeroSurfaceStackLayer[];
}

export interface HeroBaseConfig {
  id: string;
  tone?: string;
  content: HeroContentConfig;
  defaultSurfaces: HeroSurfaceTokenConfig;
  motionAllowlist?: string[];
  layout?: HeroLayoutConfig;
  motion?: HeroMotionTuning;
  filmGrain?: HeroFilmGrainSettings;
}

export interface HeroVariantConfig {
  id: string;
  label?: string;
  manifestSource?: string;
  allowedSurfaces?: string[];
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
  manifestSources?: string[];
  flags: {
    prm: boolean;
    mode: HeroMode;
    timeOfDay?: HeroTimeOfDay;
    treatmentSlug?: string;
  };
}
