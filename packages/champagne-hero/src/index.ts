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
  // Re-export the modern hero engine option and result types
  type HeroRuntimeOptions,
  type HeroRuntimeResult,
  type HeroLayer,
  type HeroMode,
  type HeroTimeOfDay,
} from "./hero-engine";
export { ensureHeroAssetPath, resolveHeroAsset } from "./HeroAssetRegistry";

// -----------------------------------------------------------------------------
// Legacy type aliases
//
// Earlier versions of the hero engine exposed configuration types named
// `HeroRuntimeConfig`, `HeroSurfaceConfig` and `HeroSurfaceTokenConfig`.  The
// Sacred Hero engine no longer defines these exact types.  To maintain
// compatibility with existing imports, we alias them to the closest
// equivalents:
//
// - HeroRuntimeConfig → HeroRuntimeOptions (options for getHeroRuntime)
// - HeroSurfaceConfig → HeroLayer (layer definitions)
// - HeroSurfaceTokenConfig → string (identifier for a surface token)
//
// Consumers depending on these aliases should migrate to the new types over
// time, but aliases ensure type-checking does not break immediately.
import type { HeroRuntimeOptions, HeroLayer } from "./hero-engine";

export type HeroRuntimeConfig = HeroRuntimeOptions;
export type HeroSurfaceConfig = HeroLayer;
export type HeroSurfaceTokenConfig = string;

export const placeholder = {
  package: "@champagne/hero",
  version: "0.0.1",
  note: "Hero composition logic and helpers will live here.",
};
