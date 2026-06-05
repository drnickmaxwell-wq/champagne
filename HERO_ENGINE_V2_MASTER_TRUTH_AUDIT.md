# HERO_ENGINE_V2_MASTER_TRUTH_AUDIT

## Audit scope and method

Role: `CHAMPAGNE_HERO_ENGINE_FORENSIC_AUDITOR`.

This audit is repository-evidence only. It treats comments and prior reports as secondary evidence and treats source files, manifests, guards, route contracts, and diagnostics as primary evidence.

Primary files inspected:

- `packages/champagne-hero/src/hero-engine/HeroConfig.ts`
- `packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts`
- `packages/champagne-hero/src/hero-engine/HeroRuntime.ts`
- `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts`
- `packages/champagne-hero/src/HeroAssetRegistry.ts`
- `apps/web/app/_components/HeroMount.tsx`
- `apps/web/app/components/hero/HeroRenderer.tsx`
- `apps/web/app/components/hero/v2/HeroRendererV2.tsx`
- `apps/web/app/components/hero/v2/buildHeroV2Model.ts`
- `apps/web/app/components/hero/v2/HeroV2Client.tsx`
- `apps/web/app/layout.tsx`
- `packages/champagne-manifests/data/hero/*.json`
- `packages/champagne-manifests/src/helpers.ts`
- `packages/champagne-guards/scripts/guard-hero.mjs`
- `packages/champagne-guards/scripts/guard-sacred-hero-lock.mjs`
- `package.json`
- `packages/champagne-guards/package.json`

Evidence commands used during audit:

```bash
rg --files | rg '(^|/)(.*[Hh]ero.*|.*hero.*|.*manifest.*|.*guard.*|.*diagnostic.*|.*report.*|.*lab.*|.*surface.*|.*variant.*|.*routing.*|.*notes.*)(/|$)'
rg -n "HeroRendererV2|HeroRenderer|HeroMount|buildHeroV2Model|getHeroRuntime|heroBinding|getHeroBindingForPathnameKey|heroDebug|heroTruth|hero-lab|hero-preview|hero-debug" apps packages scripts reports REPORTS docs tests package.json .github -g '!**/node_modules/**'
jq '.variants[] | {id,label,treatmentSlug,timeOfDay,allowedSurfaces,surfaces,energyMode}' packages/champagne-manifests/data/hero/sacred_hero_variants.json
jq '[.. | objects | select(has("heroBinding")) | .heroBinding] | length' packages/champagne-manifests/data/champagne_machine_manifest_full.json
jq '[.. | objects | select(has("heroBinding")) | {path,heroBinding}] | unique_by(.path,.heroBinding.heroId,.heroBinding.variantId)' packages/champagne-manifests/data/champagne_machine_manifest_full.json
```

## Executive truth

The implemented Hero system is a dual-engine system:

1. **Hero V1 renderer path** is the default unless `NEXT_PUBLIC_HERO_ENGINE` normalizes exactly to `v2`. The switch lives in `apps/web/app/_components/HeroMount.tsx`.
2. **Hero V2 renderer path** is present and server-prebuilds a V2 model through `buildHeroV2Model`, then renders `HeroV2Frame`, `HeroSurfaceStackV2`, and `HeroContentFade` when a model exists.
3. The sacred runtime remains centralized in `@champagne/hero` through `getHeroRuntime`, which reads sacred base, surface, variant, weather, and family variant manifests.
4. Route-level hero binding exists in `champagne_machine_manifest_full.json` and is read by `getHeroBindingForPathnameKey`. Current binding coverage is materially larger than the stale routing report suggests: direct repository query found 101 `heroBinding` objects.
5. Variant-family rollout is not blocked by missing manifest files, but it is blocked by implementation mismatches: V2 route bindings can point to group and treatment IDs that exist in `sacred_hero_variants.json`, while `HeroRuntime` category fallback and treatment fallback logic can still collapse many non-bound treatment routes to `hero.variant.treatment_v1` or to base visuals.
6. The most important flash blocker is not missing assets. All registry assets checked exist in both `public/assets/champagne` and `apps/web/public/assets/champagne`. The blocker is first-paint/opacity choreography and engine selection: V2 motion/video layers intentionally start at opacity zero and are revealed by client scripts/events/timeouts; V1 has a similar motion reveal script. If V2 is not enabled, V2 diagnostics and V2 behavior do not run.

## Current sacred hero implementation

### Sacred data sources

`HeroManifestAdapter` imports these sacred and variant manifests directly:

- `sacred_hero_base.json`
- `sacred_hero_surfaces.json`
- `sacred_hero_variants.json`
- `sacred_hero_weather.json`
- `hero.variant.marketing_v1.json`
- `hero.variant.treatment_v1.json`
- `hero.variant.editorial_v1.json`
- `hero.variant.utility_v1.json`

Actual import evidence: `packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts` lines 1-8.

### Sacred base truth

`packages/champagne-manifests/data/hero/sacred_hero_base.json` declares:

- hero id: `sacred-home-hero`
- tone: `night`
- default gradient token: `gradient.base`
- wave mask desktop/mobile tokens
- dot/field overlays
- primary particles
- desktop/mobile film grain
- motion tokens: `overlay.caustics`, `overlay.glassShimmer`, `overlay.goldDustDrift`, `overlay.particlesDrift`
- video: `__OFF__`
- internal overlay disabling in defaults

Runtime normalization converts `__OFF__` video to undefined. Evidence: `normalizeSurfaceTokens` in `HeroManifestAdapter.ts` lines 62-77.

### Sacred surface truth

`packages/champagne-manifests/data/hero/sacred_hero_surfaces.json` declares the canonical surface stack in this order:

1. `gradient.base`
2. `field.waveBackdrop`
3. `field.waveRings`
4. `mask.waveHeader`
5. `field.dotGrid`
6. `overlay.caustics`
7. `overlay.glassShimmer`
8. `overlay.goldDustDrift`
9. `overlay.particlesDrift`
10. `overlay.particles`
11. `overlay.filmGrain`
12. `overlay.lighting`
13. `hero.contentFrame`

The runtime code does **not** use that manifest stack order directly. `HeroSurfaceMap.ts` has its own `SURFACE_STACK_ORDER`, and that internal order uses `overlay.goldDust` rather than `overlay.goldDustDrift`. Evidence: `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts` lines 62-76.

This is a real implementation truth: manifest stack and runtime stack are close but not identical in token spelling for gold-dust motion. The motion map contains both `overlay.goldDustDrift` and `sacred.motion.goldDust`, while runtime stack order contains `overlay.goldDust`. This makes `overlay.goldDustDrift` render as an active motion video layer but not as a surface-stack layer.

### Asset registry truth

`HeroAssetRegistry.ts` maps all sacred hero image/video IDs to `/assets/champagne/...` paths. Repository file existence was checked for every registry relative path, and all checked files exist in both:

- `public/assets/champagne/...`
- `apps/web/public/assets/champagne/...`

Therefore, the present blocker is not missing static hero asset files.

## Current Hero V2 architecture

### Engine switch

`HeroMount` is the actual engine switch. It reads `NEXT_PUBLIC_HERO_ENGINE`, normalizes quotes and case, and enables V2 only when the normalized value equals `v2`. Otherwise it renders V1.

Evidence: `apps/web/app/_components/HeroMount.tsx` lines 17-25 and lines 99-112.

### V2 server-side model path

When V2 is enabled, `HeroMount`:

1. Reads `next-url` request header.
2. Parses pathname and `heroDebug` query state.
3. Dynamically imports V2 renderer exports.
4. Calls `buildHeroV2Model` with `pageSlugOrPath`.
5. If a model exists, renders `HeroV2Frame` with `HeroSurfaceStackV2` and `HeroContentFade`.
6. If model creation fails, falls back to `<HeroRendererV2 />`.

Evidence: `apps/web/app/_components/HeroMount.tsx` lines 26-98.

### V2 model builder

`buildHeroV2Model` performs these implemented steps:

1. Normalizes the route pathname.
2. Classifies runtime mode as `treatment` only when the pathname starts with `/treatments/`; otherwise `home`.
3. Looks up a route-level hero binding through `getHeroBindingForPathnameKey`.
4. Uses `boundVariantId ?? boundHeroId` as the runtime variant override.
5. Clears treatment slug when a binding override exists.
6. Calls `getHeroRuntime` with the override or with `default` for home.
7. Falls back to a home runtime if the first runtime call fails.
8. Builds surface variables, layer models, motion layer models, optional particles, optional hero video, and sacred-bloom model data.

Evidence: `apps/web/app/components/hero/v2/buildHeroV2Model.ts` lines 212-260 for runtime selection and fallback start; line 3 for helper import; lines 73-100 for surface-stack model shape.

### V2 renderer/client split

The V2 renderer exports model/component types and frame/content wrappers. The actual surface/video mounting is client-side through `HeroSurfaceStackV2` in `HeroV2Client.tsx`. `HeroRendererV2.tsx` also contains extensive debug scripts for stack diagnostics, truth tables, compositing data, and V2 paint evidence.

Evidence: `apps/web/app/components/hero/v2/HeroRendererV2.tsx` lines 1-12, and debug script blocks beginning around lines 340-420.

## Current V1 architecture

V1 is still the default path unless the env flag enables V2. V1 `HeroRenderer` calls `getHeroRuntime`, normalizes gradients, filters denied video paths, renders `BaseChampagneSurface`, builds a surface stack, renders motion videos, and injects debug/receipt scripts in development or hero-debug contexts.

Important implemented facts:

- V1 denies `dental-hero-4k.mp4` with a `videoDenylist`.
- V1 disables internal overlays on `BaseChampagneSurface`.
- V1 treats missing opacity/blend/z-index governance as disable/receipt conditions for motion/surface layers.
- V1 has a client script that reveals motion video opacity after media events or after timeout fallback.

Evidence: `apps/web/app/components/hero/HeroRenderer.tsx` lines 66-114, lines 127-190, lines 235-269, and lines 1076-1149.

## Current routing behavior

### Layout mount behavior

`apps/web/app/layout.tsx` mounts `HeroMount` before page children when `isPublicPage && isHeroEnabled`. It passes `mode`, `treatmentSlug`, and `pageCategory` derived from the pathname.

Evidence: `apps/web/app/layout.tsx` lines 80-121.

### Page category behavior

Current layout category derivation includes:

- `/treatments/...` => `treatment`
- `/team/...` => `profile`
- `/team`, `/about`, `/contact`, `/treatments`, `/fees`, `/smile-gallery` => `utility`
- `/blog` => `editorial`
- `/` => `home`
- else manifest category

`HeroRuntime.resolveVariantIdForCategory` maps unknown/default categories to `hero.variant.marketing_v1`. It does not explicitly map `profile`, `hub`, `site`, `legal`, or `technology` except through the default marketing fallback.

Evidence: `apps/web/app/layout.tsx` lines 80-101 and `packages/champagne-hero/src/hero-engine/HeroRuntime.ts` lines 78-94.

### Route binding behavior

`getHeroBindingForPathnameKey` builds a map from all pages and treatments and returns the binding by normalized route key. Evidence: `packages/champagne-manifests/src/helpers.ts` lines 56-87.

A direct repository query found 101 `heroBinding` objects in `champagne_machine_manifest_full.json`. Current bindings include home, general utility pages, team pages, and broad treatment route coverage with `sacred-home-hero` plus category/group/treatment variant IDs.

This conflicts with `REPORTS/HERO_ROUTING_CONTRACT_V1.json`, which reports `heroBindingCount: 5`. Therefore, that report is stale relative to the current manifest.

## Current manifest infrastructure

### Manifest groups loaded by runtime

`loadSacredHeroManifests()` constructs:

- normalized base manifest
- surface definition map
- concatenated variants from sacred variants plus four family manifests
- normalized weather manifest

Evidence: `packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts` lines 138-174.

### Variant inventory

Current variant inventory from `packages/champagne-manifests/data/hero`:

- `sacred_hero_variants.json`: 22 variants
- `hero.variant.marketing_v1.json`: 1 variant
- `hero.variant.treatment_v1.json`: 1 variant
- `hero.variant.editorial_v1.json`: 1 variant
- `hero.variant.utility_v1.json`: 1 variant
- Weather profiles: `day`, `evening`, `night`

Because the adapter concatenates `sacred_hero_variants.json` before the four standalone family manifests, duplicate IDs are possible. `pickVariant` returns the first matching ID. Therefore, for IDs that exist both in `sacred_hero_variants.json` and standalone `hero.variant.*_v1.json`, the sacred variants file wins and the standalone family manifest may be shadowed.

Evidence: `HeroManifestAdapter.ts` import order lines 1-8 and `HeroRuntime.pickVariant` lines 59-76.

## Current guard infrastructure

Root scripts exist for:

- `npm run guard:hero` through `package.json` script `guard:hero`
- `npm run guard:canon` through `package.json` script `guard:canon`
- `npm run verify` through `package.json` script `verify`

`guard:hero` delegates to `@champagne/guards guard:hero`, which runs `guard:hero-core` and `guard:sacred-hero-lock`. Evidence: root `package.json` scripts and `packages/champagne-guards/package.json` scripts.

Implemented guard truth:

- `guard-hero.mjs` checks the bridge renderer path `apps/web/app/_components/HeroRenderer/HeroRenderer.tsx`, not the sacred render entry `apps/web/app/components/hero/HeroRenderer.tsx` and not V2 files.
- `guard-hero.mjs` checks presence/basic shape of base, surfaces, variants, and weather manifests.
- `guard-sacred-hero-lock.mjs` hashes only three sacred manifest files: base, surfaces, variants. It does not hash weather, V2 code, V1 renderer, runtime files, or standalone family variant manifests.
- `guard-sacred-hero-lock.mjs` also enforces the `/` manifest binding to `{ heroId: "sacred-home-hero", variantId: "default" }`.

Evidence: `packages/champagne-guards/scripts/guard-hero.mjs` lines 9-15 and lines 169-185; `packages/champagne-guards/scripts/guard-sacred-hero-lock.mjs` lines 12-21 and lines 56-86.

## Current diagnostics infrastructure

Implemented diagnostics include:

- V1 development/debug receipt payloads and `window.__CHAMPAGNE_HERO_DEBUG__` receipt script in `HeroRenderer.tsx`.
- V1 motion reveal warning when video layers remain hidden after timeout.
- V2 mount/background/content/motion event logging in `HeroV2Client.tsx`.
- V2 truth table/compositing/stack scripts in `HeroRendererV2.tsx`.
- Routes for `/champagne/hero-preview`, `/champagne/hero-debug`, `/champagne/hero-lab`, and `/champagne/hero-asset-lab` exist in the repository.

Important operational truth: the historical report `reports/hero/hero-v2-truth-report.md` states V2 logs were absent because observed HOME used `data-hero-engine="v1"`. That report is consistent with the current engine-switch implementation: V2 diagnostics are inert unless `NEXT_PUBLIC_HERO_ENGINE=v2` is active.

## Current surface/background dependencies

Hero paint depends on all of the following:

1. Root layout actually mounting `HeroMount`.
2. `NEXT_PUBLIC_HERO_ENGINE` selecting V1 or V2.
3. `getHeroRuntime` successfully loading/normalizing manifests.
4. Surface tokens mapping to definitions through `HeroSurfaceMap`.
5. Asset registry paths resolving to files under `/assets/champagne`.
6. Renderer CSS/inlined style variables binding the paths to surfaces.
7. Motion layers becoming visible via client reveal scripts/events.
8. Page background/body/main surfaces not visually overwhelming transparent hero root surfaces.

V2 diagnostics explicitly log background sources from document element, body, main, and below-hero elements. Evidence: `HeroV2Client.tsx` background logging around the `HERO_V2_BACKGROUND_SOURCES` block.

## Current flash-related blockers

See `HERO_FLASH_BLOCKER_ANALYSIS.md` for detail. Summary:

- V2 may not run unless env flag is exactly `v2` after normalization.
- V2 route path relies on `next-url` header; if unavailable, pathname defaults to `/`, causing home binding/model on non-home routes.
- Motion/video layers start at opacity zero and are revealed after events/timeouts.
- V1 and V2 both rely on client-side scripts to complete motion visibility, so first paint can be static or visually incomplete.
- V1 denies the 4k dental video explicitly.
- Manifest stack token naming differs from runtime stack token naming for gold dust.
- Standalone family variant manifests can be shadowed by duplicate IDs in the sacred variants file.

## Current readiness for variant-family rollout

The system is partially ready:

Ready:

- Route-level heroBinding infrastructure exists.
- Variant manifests exist.
- V2 model builder consumes route bindings.
- Runtime can pick explicit variant IDs.
- Guards exist and are wired at root.
- Diagnostics exist.

Not ready without cleanup/verification:

- Duplicate variant IDs cause first-match shadowing.
- Current guards do not validate V2 route-binding coverage or duplicate variant IDs.
- Stale routing report understates binding coverage.
- V2 first-paint truth must be re-captured with `NEXT_PUBLIC_HERO_ENGINE=v2`.
- Header-derived pathname fallback can collapse routes to `/`.
- Family variants need proof that all bound IDs resolve to the intended manifest object, not a shadowed duplicate.

## Non-negotiable next truth checks

Before any hero rollout or surgery, run and archive:

```bash
npm run guard:hero
npm run guard:canon
npm run verify
NEXT_PUBLIC_HERO_ENGINE=v2 pnpm --filter web dev --hostname 0.0.0.0 --port 3000
```

Then capture `/`, `/about`, `/blog`, `/contact`, `/treatments`, and representative treatment routes with `?heroDebug=1&heroTruth=1` and verify `data-hero-engine="v2"`, bound/effective variant IDs, surface IDs, opacity, blend, z-index, and first-paint motion reveal timing.
