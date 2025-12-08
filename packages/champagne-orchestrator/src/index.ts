import type { ChampagneExperience } from "@champagne/canon";

export interface ResolvedHeroConfigStub {
  sceneId?: string;
  variantId?: string;
  surfaceToken?: string;
}

export const resolveHeroConfig = (
  experience: ChampagneExperience,
): ResolvedHeroConfigStub | undefined => {
  // TODO: implement hero config resolution using canon and manifests.
  return experience.hero;
};
