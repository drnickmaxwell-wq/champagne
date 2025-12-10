import sacredBase from "../../../champagne-manifests/data/hero/sacred_hero_base.json";
import sacredSurfaces from "../../../champagne-manifests/data/hero/sacred_hero_surfaces.json";
import type { HeroContent, HeroLayout, HeroMotionSettings, HeroFilmGrainSettings } from "./HeroConfig";

export interface SacredHeroManifest {
  id: string;
  content: HeroContent;
  defaults: {
    tone: string;
    surfaces: any;
    layout: HeroLayout;
    motion: HeroMotionSettings;
    filmGrain: HeroFilmGrainSettings;
  };
}

export interface SacredSurfacesManifest {
  waveMasks: Record<string, string>;
  surfaceStack: Array<{ id: string; role?: string; token?: string; prmSafe?: boolean }>;
  waveBackgrounds: any;
  gradients: Record<string, string>;
  overlays: any;
  particles: any;
  grain: any;
  motion: any;
  video: any;
}

export const sacredHeroBase = sacredBase as SacredHeroManifest;
export const sacredHeroSurfaces = sacredSurfaces as SacredSurfacesManifest;
