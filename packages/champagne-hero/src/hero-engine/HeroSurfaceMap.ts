export interface HeroSurfaceMapEntry {
  /**
   * TODO: map canon surface tokens to hero surfaces.
   */
  token: string;
  surface: string;
}

export interface HeroSurfaceMap {
  /**
   * TODO: define mapping registry between canon surfaces and hero runtime surfaces.
   */
  [token: string]: HeroSurfaceMapEntry | undefined;
}
