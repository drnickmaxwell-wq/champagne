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

export interface HeroSurfaceTokenConfig {
  waveMask?: {
    desktop?: string;
    mobile?: string;
  };
  background?: {
    desktop?: string;
    mobile?: string;
  };
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
}

export interface HeroVariantConfig {
  id: string;
  label?: string;
  tone?: string;
  treatmentSlug?: string;
  timeOfDay?: HeroTimeOfDay;
  content?: Partial<HeroContentConfig>;
  surfaces?: HeroSurfaceTokenConfig;
}

export interface HeroRuntimeConfig {
  id: string;
  tone?: string;
  content: HeroContentConfig;
  surfaces: ResolvedHeroSurfaceConfig;
  variant?: HeroVariantConfig;
  flags: {
    prm: boolean;
    heroId?: string;
    variantId?: string;
    timeOfDay?: HeroTimeOfDay;
    treatmentSlug?: string;
  };
}
