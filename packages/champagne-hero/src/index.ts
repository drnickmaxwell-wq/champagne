export { BaseChampagneSurface } from "./BaseChampagneSurface";
export { ChampagneHeroFrame } from "./ChampagneHeroFrame";
export { HeroPreviewDebug } from "./HeroPreviewDebug";
export {
  getAllHeroes,
  getHeroBySlug,
  resolveHeroVariant,
  type HeroRegistryEntry,
} from "./HeroRegistry";
export {
  getHeroRuntime,
  type HeroRuntimeConfig,
  type HeroSurfaceConfig,
  type HeroSurfaceTokenConfig,
  type HeroMode,
  type HeroTimeOfDay,
} from "./hero-engine";
export { ensureHeroAssetPath } from "./HeroAssetRegistry";

export const placeholder = {
  package: "@champagne/hero",
  version: "0.0.1",
  note: "Hero composition logic and helpers will live here.",
};
