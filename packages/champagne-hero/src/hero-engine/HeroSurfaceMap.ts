/**
 * Simple surface role lookup for global Sacred Hero engine.
 */
export type SurfaceRole =
  | "gradient"
  | "background"
  | "wave"
  | "dots"
  | "particles"
  | "grain"
  | "fx"
  | "video";

export const SURFACE_ROLE_MAP: Record<string, SurfaceRole> = {
  "gradient.base": "gradient",
  "field.waveBackdrop": "background",
  "mask.waveHeader": "wave",
  "field.waveRings": "wave",
  "field.dotGrid": "dots",
  "overlay.particles": "particles",
  "overlay.filmGrain": "grain",
  "overlay.caustics": "fx",
  "overlay.glassShimmer": "fx",
  "overlay.particlesDrift": "fx",
  "hero.video": "video",
};
