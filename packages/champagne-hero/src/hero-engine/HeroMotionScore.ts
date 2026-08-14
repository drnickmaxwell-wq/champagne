export type HeroBrandProfile = {
  id: string;
  palette: Record<string, string>;
  logoAssetId?: string;
  typographyId?: string;
  desiredCharacter: readonly string[];
};

export type HeroGrammar = {
  id: string;
  surfaceRoles: readonly string[];
  protectedContentZone: "start" | "center" | "end";
  mobileArtDirectionId: string;
};

export type HeroInstance = {
  id: string;
  brandProfileId: string;
  grammarId: string;
  assetIds: readonly string[];
  contentId: string;
};

export type HeroMotionLayerScore = {
  id: string;
  opacity: number;
  phaseSeconds: number;
  blend: "normal" | "screen" | "soft-light";
};

export type HeroMotionScore = {
  id: string;
  durationSeconds: number;
  layers: readonly HeroMotionLayerScore[];
  reducedMotion: "static-equivalent";
  autoplayFailure: "static-equivalent";
  collectiveRestartAllowed: false;
};

export const CHAMPAGNE_SACRED_V2_MOTION_SCORE: HeroMotionScore = {
  id: "champagne-sacred-v2-h3.3",
  durationSeconds: 42,
  layers: [
    { id: "sacred.motion.waveCaustics", opacity: 0.2, phaseSeconds: 0, blend: "screen" },
    { id: "sacred.motion.glassShimmer", opacity: 0.16, phaseSeconds: 7, blend: "soft-light" },
    { id: "sacred.motion.particleDrift", opacity: 0.09, phaseSeconds: 13, blend: "screen" },
    { id: "sacred.motion.goldDust", opacity: 0.14, phaseSeconds: 19, blend: "soft-light" },
  ],
  reducedMotion: "static-equivalent",
  autoplayFailure: "static-equivalent",
  collectiveRestartAllowed: false,
};

export const validateHeroCompositionInputs = (
  brand: HeroBrandProfile,
  grammar: HeroGrammar,
  instance: HeroInstance,
) => {
  if (instance.brandProfileId !== brand.id) throw new Error("Hero instance brand profile mismatch");
  if (instance.grammarId !== grammar.id) throw new Error("Hero instance grammar mismatch");
  if (!Object.keys(brand.palette).length) throw new Error("Hero brand palette is required");
  if (!brand.desiredCharacter.length) throw new Error("Hero desired character is required");
  return { brand, grammar, instance } as const;
};
