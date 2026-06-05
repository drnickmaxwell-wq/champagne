# HERO_VARIANT_FAMILY_READINESS

## Readiness verdict

Status: **PARTIALLY READY / NOT READY FOR BLIND ROLLOUT**.

The repository contains the main pieces required for variant-family rollout, but it does not yet contain enough proof/guarding to safely roll out without first resolving or explicitly accepting variant ID shadowing and route-binding verification gaps.

## Ready components

### 1. Runtime supports explicit variants

`getHeroRuntime()` accepts `variantId`, selects a matching variant, merges base/weather/variant surfaces, resolves surface assets, applies PRM, and returns a runtime config. Evidence: `packages/champagne-hero/src/hero-engine/HeroRuntime.ts` lines 235-292.

### 2. V2 model builder consumes route bindings

`buildHeroV2Model()` reads route hero bindings and passes `boundVariantId ?? boundHeroId` as runtime `variantId`. Evidence: `apps/web/app/components/hero/v2/buildHeroV2Model.ts` lines 233-249.

### 3. Route binding manifest exists

`champagne_machine_manifest_full.json` contains route-level `heroBinding` objects. Direct query found 101 binding objects.

### 4. Category and group variants exist

`packages/champagne-manifests/data/hero/sacred_hero_variants.json` contains category, group, time-of-day, and treatment-specific variants. Standalone family manifests exist for treatment, marketing, editorial, and utility.

### 5. Diagnostics exist

V1 and V2 contain debug/truth logging infrastructure. Hero lab/debug/preview routes exist.

### 6. Required guard commands are wired

Root scripts for `guard:hero`, `guard:canon`, and `verify` exist in `package.json`.

## Not-ready blockers

### Blocker A: duplicate variant IDs shadow standalone family manifests

Duplicate IDs exist between `sacred_hero_variants.json` and standalone family files. Runtime loads sacred variants first and picks the first matching ID.

Consequence: a route bound to `hero.variant.treatment_v1`, `hero.variant.marketing_v1`, `hero.variant.editorial_v1`, or `hero.variant.utility_v1` may not use the standalone family manifest object.

Required proof: enumerate loaded runtime variants in order and show actual selected source per route.

### Blocker B: stale route report

`REPORTS/HERO_ROUTING_CONTRACT_V1.json` reports 5 bindings, while current manifest query found 101. The route contract must be regenerated before rollout decisions.

Required proof: regenerate route binding contract from current manifest and compare to V2 runtime outputs.

### Blocker C: no guard for binding-to-variant resolution

Current `guard-hero.mjs` validates basic manifest shape but does not prove every `heroBinding.variantId` resolves to a runtime variant. Current `guard-sacred-hero-lock.mjs` only checks home binding and sacred manifest hashes.

Required proof: add or run a read-only audit that fails on unresolved bound variants and duplicate IDs before rollout.

### Blocker D: V2 path derivation can fall back to `/`

V2 gets pathname from `next-url` header. Missing header falls back to `/`.

Required proof: runtime capture on deployed/dev environment confirms non-home routes receive their actual pathname.

### Blocker E: engine flag controls everything

V2 is not active unless `NEXT_PUBLIC_HERO_ENGINE=v2`. Any variant-family V2 rollout requires environment confirmation.

Required proof: route captures showing `data-hero-engine="v2"`.

### Blocker F: treatment slug matching is bypassed by route binding

When a route has a binding override, V2 clears `runtimeTreatmentSlug`. This means `treatmentSlug`-based variants only apply on unbound treatment routes or V1/category paths, not on explicitly bound V2 routes.

Required proof: decide whether variant family rollout should be binding-driven or slug-driven, then audit routes against that model.

## Rollout readiness matrix

| Capability | Implemented | Proven current | Blocker |
| --- | --- | --- | --- |
| V1 sacred base hero | yes | mostly | V1 remains default unless env set |
| V2 engine switch | yes | yes by source | needs env proof |
| V2 route model | yes | source-proven | needs runtime route capture |
| Route heroBinding | yes | manifest query found 101 | stale report |
| Category variants | yes | source-proven | duplicate shadowing |
| Group variants | yes | source-proven | route-to-selected proof missing |
| Standalone family manifests | yes | source-proven | duplicate shadowing |
| Treatment-specific variants | yes | source-proven | binding bypasses slug matching |
| Asset availability | yes | repository check passed | none found |
| Guard coverage | partial | source-proven | no duplicate/binding guard |
| Flash diagnostics | yes | source-proven | must run with V2 enabled |

## Minimum execution plan before rollout

1. Run required guards:

```bash
npm run guard:hero
npm run guard:canon
npm run verify
```

2. Generate a fresh variant resolution ledger:

```bash
node scripts/hero/hero_routing_contract_v1.mjs
```

If this script still reports stale data, do not trust its output; repair the report generator in a separate authorized packet.

3. Run a read-only duplicate-variant audit:

```bash
node -e "const fs=require('fs'); const files=['packages/champagne-manifests/data/hero/sacred_hero_variants.json','packages/champagne-manifests/data/hero/hero.variant.marketing_v1.json','packages/champagne-manifests/data/hero/hero.variant.treatment_v1.json','packages/champagne-manifests/data/hero/hero.variant.editorial_v1.json','packages/champagne-manifests/data/hero/hero.variant.utility_v1.json']; const rows=[]; for (const file of files){ for (const v of JSON.parse(fs.readFileSync(file,'utf8')).variants||[]) rows.push({id:v.id,file}); } const by={}; for (const row of rows)(by[row.id]??=[]).push(row.file); console.log(Object.entries(by).filter(([,files])=>files.length>1));"
```

4. Capture V2 truth on representative routes:

```bash
NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm --filter web dev --hostname 0.0.0.0 --port 3000
```

5. Visit each route with `?heroDebug=1&heroTruth=1` and archive console payloads.

## Go/no-go criteria

Go only if all are true:

- `data-hero-engine="v2"` on target routes.
- Pathname passed to V2 model matches actual route.
- Every route binding resolves to intended variant ID.
- Duplicate ID shadowing is either eliminated or explicitly documented with selected source.
- Surface IDs rendered match variant family contract.
- Motion layers do not remain hidden except by PRM or intentional variant allowlist.
- Guard commands pass.

No-go if any are true:

- V2 captures show `data-hero-engine="v1"`.
- Route path defaults to `/` on non-home routes.
- Bound variant ID is unresolved.
- Standalone family file is assumed active without proof.
- Stale reports are used as source of truth.
