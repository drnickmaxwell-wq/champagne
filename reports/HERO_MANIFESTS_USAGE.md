# Hero manifests usage

## Sacred hero manifest sources
- Sacred hero assets are defined in `packages/champagne-manifests/data/hero/sacred_hero_base.json`, `sacred_hero_surfaces.json`, `sacred_hero_variants.json`, and `sacred_hero_weather.json`. 【packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts】

## Runtime consumption
- `loadSacredHeroManifests` in `HeroManifestAdapter` imports the four sacred JSON files, normalizes base content/variants, builds the surface map, and returns a combined manifest set. 【packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts】
- `getHeroRuntime` calls `loadSacredHeroManifests`, applies time-of-day weather overrides, variant selection (including treatmentSlug matching), and PRM filtering, then maps surface tokens to assets for rendering. 【packages/champagne-hero/src/hero-engine/HeroRuntime.ts】
- The app’s `HeroRenderer` component requests `getHeroRuntime` (optionally passing mode, treatmentSlug, PRM, timeOfDay, particles, filmGrain), and paints the resolved surfaces, motion, and content. 【apps/web/app/components/hero/HeroRenderer.tsx】

## Page integration
- The home page renders `HeroRenderer` directly (guarded by `isBrandHeroEnabled`) before the rest of the page content. 【apps/web/app/page.tsx】
- `ChampagnePageBuilder` uses `getHeroManifest` (from the machine manifest and styles manifest) to derive hero IDs/presets for preview frames, but the sacred runtime visuals still come from the sacred hero manifest pipeline above. 【apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx】【packages/champagne-manifests/src/helpers.ts】
