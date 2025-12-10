export type HeroMode = "home" | "treatment" | string;

export type HeroTimeOfDay = "day" | "night" | "auto";

export interface HeroRuntimeOptions {
  mode: HeroMode;
  treatmentSlug?: string;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  variantId?: string;
}

export interface HeroContent {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export type HeroLayerType = "gradient" | "image" | "video";

export interface HeroLayer {
  id: string;
  type: HeroLayerType;
  role?: "background" | "wave" | "dots" | "particles" | "grain" | "fx" | "video";
  url?: string;
  blendMode?: CSSStyleDeclaration["mixBlendMode"] | any;
  opacity: number;
  zIndex: number;
}

export interface HeroLayout {
  contentAlign?: "start" | "center";
  maxWidth?: number;
  padding?: string;
}

export interface HeroMotionSettings {
  shimmerIntensity?: number;
  particleDrift?: number;
  particles?: {
    density?: number;
    speed?: number;
  };
}

export interface HeroFilmGrainSettings {
  enabled: boolean;
  opacity?: number;
}

export interface HeroRuntimeFlags {
  prm: boolean;
}

export interface HeroVariantMeta {
  id: string;
  label?: string;
}

export interface HeroRuntimeResult {
  mode: HeroMode;
  variant: HeroVariantMeta;
  content: HeroContent;
  layout: HeroLayout;
  layers: HeroLayer[];
  motion: HeroMotionSettings;
  filmGrain: HeroFilmGrainSettings;
  flags: HeroRuntimeFlags;
}
