import type { CSSProperties, Ref } from "react";
import type { HeroMode, HeroTimeOfDay, getHeroRuntime } from "@champagne/hero";

export interface HeroRendererV2Props {
  mode?: HeroMode;
  treatmentSlug?: string;
  pageSlugOrPath?: string;
  debug?: boolean;
  prm?: boolean;
  timeOfDay?: HeroTimeOfDay;
  particles?: boolean;
  filmGrain?: boolean;
  diagnosticBoost?: boolean;
  surfaceRef?: Ref<HTMLDivElement>;
  pageCategory?: "home" | "treatment" | "editorial" | "utility" | "marketing" | string;
  rootStyle?: CSSProperties;
  glueVars?: Partial<{
    waveRingsSize: string;
    waveRingsRepeat: string;
    waveRingsPosition: string;
    waveRingsImageRendering: string;
    dotGridSize: string;
    dotGridRepeat: string;
    dotGridPosition: string;
    dotGridImageRendering: string;
  }>;
}

type GlueSource = "manifest" | "override" | "none";

export type HeroV2SurfaceLayerModel = {
  id: string;
  role?: string;
  prmSafe?: boolean;
  className: string;
  style: CSSProperties;
  glueMeta?: {
    source: GlueSource;
    backgroundSize?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    imageRendering?: string;
  };
  contrastFilter?: string;
};

export type HeroV2MotionLayerModel = {
  id: string;
  className?: string;
  path: string;
  style: CSSProperties;
  targetOpacity?: number | null;
};

export type HeroV2SacredBloomModel = {
  style: CSSProperties;
  bloomDebug: boolean;
  baseOpacity: string;
  shape?: string;
  mask?: string;
  contrastFilter?: string;
  glueMeta?: {
    source: GlueSource;
    backgroundSize?: string;
    backgroundRepeat?: string;
    backgroundPosition?: string;
    imageRendering?: string;
  };
};

export type HeroSurfaceStackModel = {
  surfaceVars: CSSProperties;
  prmEnabled: boolean;
  layers: HeroV2SurfaceLayerModel[];
  motionLayers: HeroV2MotionLayerModel[];
  bloomEnabled: boolean;
  heroId?: string;
  variantId?: string;
  boundHeroId?: string;
  boundVariantId?: string;
  effectiveHeroId?: string;
  effectiveVariantId?: string;
  particlesPath?: string;
  particlesOpacity?: number;
  heroVideo?: {
    path: string;
    poster?: string;
    style: CSSProperties;
    targetOpacity?: number | null;
  };
  sacredBloom?: HeroV2SacredBloomModel;
};

export type HeroV2Model = {
  gradient: string;
  layout: Awaited<ReturnType<typeof getHeroRuntime>>["layout"];
  content: Awaited<ReturnType<typeof getHeroRuntime>>["content"];
  surfaceStack: HeroSurfaceStackModel;
};
