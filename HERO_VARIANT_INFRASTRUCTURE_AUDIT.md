# HERO_VARIANT_INFRASTRUCTURE_AUDIT

## Purpose

This file records the implemented variant infrastructure truth for the Champagne Hero Engine. It is repository-evidence only and is intended to let a future agent evaluate variant rollout without relying on conversation history.

## Primary evidence files

- `packages/champagne-manifests/data/hero/sacred_hero_variants.json`
- `packages/champagne-manifests/data/hero/hero.variant.marketing_v1.json`
- `packages/champagne-manifests/data/hero/hero.variant.treatment_v1.json`
- `packages/champagne-manifests/data/hero/hero.variant.editorial_v1.json`
- `packages/champagne-manifests/data/hero/hero.variant.utility_v1.json`
- `packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts`
- `packages/champagne-hero/src/hero-engine/HeroRuntime.ts`
- `apps/web/app/components/hero/v2/buildHeroV2Model.ts`
- `packages/champagne-manifests/src/helpers.ts`
- `packages/champagne-manifests/data/champagne_machine_manifest_full.json`

## Variant load chain

`loadSacredHeroManifests()` builds the runtime variant array in this order:

1. `sacred_hero_variants.json`
2. `hero.variant.marketing_v1.json`
3. `hero.variant.treatment_v1.json`
4. `hero.variant.editorial_v1.json`
5. `hero.variant.utility_v1.json`

Evidence: direct imports at `HeroManifestAdapter.ts` lines 1-8 and concatenation in `loadSacredHeroManifests()`.

## Variant picker truth

`pickVariant()` resolves variants as follows:

1. explicit `variantId` exact match
2. treatment slug exact match when mode is `treatment`
3. `timeOfDay` exact match
4. `default`
5. first variant in array

Evidence: `packages/champagne-hero/src/hero-engine/HeroRuntime.ts` lines 59-76.

Because the function uses first match, duplicate IDs are a real infrastructure issue. The earlier source in the concatenated array wins.

## Category mapping truth

`resolveVariantIdForCategory()` maps:

| page category | runtime variant id |
| --- | --- |
| `home` | `default` |
| `treatment` | `hero.variant.treatment_v1` |
| `editorial` | `hero.variant.editorial_v1` |
| `utility` | `hero.variant.utility_v1` |
| `marketing` | `hero.variant.marketing_v1` |
| any other truthy category | `hero.variant.marketing_v1` |

Evidence: `packages/champagne-hero/src/hero-engine/HeroRuntime.ts` lines 78-94.

## Route binding truth

`getHeroBindingForPathnameKey()` normalizes route keys and returns `heroBinding` from the combined pages/treatments list. Evidence: `packages/champagne-manifests/src/helpers.ts` lines 56-87.

Current manifest query found 101 `heroBinding` objects in `packages/champagne-manifests/data/champagne_machine_manifest_full.json`. Unique route bindings include:

- `/` -> `sacred-home-hero` / `default`
- `/about` -> `sacred-home-hero` / `hero.variant.marketing_v1`
- `/blog` -> `sacred-home-hero` / `hero.variant.editorial_v1`
- `/contact`, `/fees`, `/finance`, legal pages, portal-like pages -> `hero.variant.utility_v1`
- `/team` and team profiles -> `hero.variant.marketing_v1`
- `/treatments` -> `hero.variant.group.02_v1`
- selected treatment group hubs -> `hero.variant.group.*_v1`
- most treatment routes -> `hero.variant.treatment_v1`

Important: `REPORTS/HERO_ROUTING_CONTRACT_V1.json` reports only 5 bindings and is stale relative to the current manifest query.

## Variant inventory

### Sacred variant file

`packages/champagne-manifests/data/hero/sacred_hero_variants.json` currently contains 22 variants:

- `default`
- `hero.variant.treatment_v1`
- `hero.variant.group.01_v1`
- `hero.variant.group.02_v1`
- `hero.variant.group.03_v1`
- `hero.variant.group.04_v1`
- `hero.variant.group.05_v1`
- `hero.variant.group.06_v1`
- `hero.variant.group.07_v1`
- `hero.variant.group.08_v1`
- `hero.variant.group.09_v1`
- `hero.variant.editorial_v1`
- `hero.variant.utility_v1`
- `hero.variant.marketing_v1`
- `day`
- `hero_whitening`
- `hero_implants`
- `treatment.implants`
- `treatment.emergency`
- `hero_aligners`
- `hero_veneers`
- `hero_technology`

### Standalone family variant files

Each standalone family file contains one variant:

- `hero.variant.marketing_v1.json` -> `hero.variant.marketing_v1`
- `hero.variant.treatment_v1.json` -> `hero.variant.treatment_v1`
- `hero.variant.editorial_v1.json` -> `hero.variant.editorial_v1`
- `hero.variant.utility_v1.json` -> `hero.variant.utility_v1`

## Duplicate ID truth

Duplicate IDs exist between `sacred_hero_variants.json` and standalone family manifests:

- `hero.variant.marketing_v1`
- `hero.variant.treatment_v1`
- `hero.variant.editorial_v1`
- `hero.variant.utility_v1`

Because sacred variants load first and `pickVariant()` returns the first exact ID match, the standalone family manifest versions can be shadowed by same-ID entries in `sacred_hero_variants.json`.

This is the most important variant infrastructure truth.

## Family variant behavior implications

### Treatment family

A route binding to `hero.variant.treatment_v1` resolves to the first variant with that ID. If the sacred variants file has a same-ID entry before the standalone file, the standalone `hero.variant.treatment_v1.json` allowlist and surface reductions may not take effect.

### Marketing/editorial/utility families

The same shadowing risk applies to `hero.variant.marketing_v1`, `hero.variant.editorial_v1`, and `hero.variant.utility_v1`.

### Group variants

Group variants `hero.variant.group.01_v1` through `hero.variant.group.09_v1` exist only in `sacred_hero_variants.json` based on current files. They are route-bindable and should resolve directly when used as `variantId`.

### Treatment-specific variants

Treatment-specific variants with `treatmentSlug` exist for teeth whitening, dental implants, Spark aligners, porcelain veneers, and dental technology. However, when route binding provides an explicit variant override, `buildHeroV2Model` clears `runtimeTreatmentSlug`, so treatment slug matching is bypassed for bound routes.

Evidence: `apps/web/app/components/hero/v2/buildHeroV2Model.ts` lines 233-249.

## Surface allowlist behavior

`filterSurfacesByAllowlist()` only filters when a selected variant has a non-empty `allowedSurfaces` array. It recognizes these canonical IDs:

- `mask.waveHeader`
- `field.waveBackdrop`
- `gradient.base`
- `field.dotGrid`
- `field.waveRings`
- `overlay.particles`
- `overlay.filmGrain`
- motion entries by entry id or asset id
- video by entry id or asset id
- `surfaceStack` by token or id

Evidence: `packages/champagne-hero/src/hero-engine/HeroRuntime.ts` lines 96-129.

If a shadowed sacred variant has no allowlist, standalone family allowlists will not apply.

## Variant readiness risks

1. **Duplicate IDs / shadowing**: current loader order makes sacred variants authoritative over standalone family manifests for duplicate IDs.
2. **Stale routing report**: route binding report does not reflect current manifest binding coverage.
3. **No duplicate-ID guard**: current hero guards do not reject duplicate variant IDs across loaded manifests.
4. **No binding-to-variant guard**: current hero guards do not prove every manifest `heroBinding.variantId` resolves to an existing runtime variant.
5. **Treatment slug bypass under binding**: explicit route bindings skip treatmentSlug variant matching in V2.
6. **Category fallback is broad**: unknown categories collapse to marketing variant.

## Required variant infrastructure proof before rollout

A future agent should run a dedicated variant proof script that outputs:

- all loaded variant IDs in actual runtime order
- duplicate IDs with source files
- every `heroBinding.variantId` and whether it resolves
- whether each resolved ID came from `sacred_hero_variants.json` or a standalone family file
- route path -> boundVariantId -> effectiveRuntimeVariantId -> selected manifest source

No code redesign is required to collect this proof.
