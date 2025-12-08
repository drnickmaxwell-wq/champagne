export interface HeroConfig {
  /**
   * TODO: define hero configuration contract for runtime rendering.
   */
  sceneId?: string;
  variantId?: string;
  surfaceToken?: string;
  [key: string]: unknown;
}
