# Phase 3 Hero Variant Receipts

## heroDebug routes exercised
- `/` with `?heroDebug=1`
- `/treatments/implants?heroDebug=1`
- `/smile-gallery?heroDebug=1`
- `/contact?heroDebug=1`
- `/brand?heroDebug=1` (marketing catch-all)

## Runtime receipts
- Marketing category → `hero.variant.marketing_v1`
  - Manifest sources: sacred base, sacred surfaces, marketing variant manifest
  - Allowed layers observed: gradient.base, field.waveBackdrop, field.waveRings, mask.waveHeader, overlay.filmGrain, hero.contentFrame
- Treatment category → `hero.variant.treatment_v1`
  - Manifest sources: sacred base, sacred surfaces, treatment variant manifest
  - Allowed layers observed: gradient.base, field.waveBackdrop, mask.waveHeader, field.dotGrid, hero.contentFrame
- Editorial category → `hero.variant.editorial_v1`
  - Manifest sources: sacred base, sacred surfaces, editorial variant manifest
  - Allowed layers observed: gradient.base, field.waveBackdrop, mask.waveHeader, overlay.caustics, overlay.filmGrain, hero.contentFrame
- Utility category → `hero.variant.utility_v1`
  - Manifest sources: sacred base, sacred surfaces, utility variant manifest
  - Allowed layers observed: gradient.base, hero.contentFrame
- Home (sacred) → `default` sacred variant
  - Manifest sources: sacred base, sacred surfaces, sacred variants manifest
  - Allowed layers observed: gradient.base, field.waveBackdrop, field.waveRings, mask.waveHeader, field.dotGrid, overlay.caustics, overlay.glassShimmer, overlay.goldDust, overlay.particles, overlay.filmGrain, hero.contentFrame

(Console output captured via `pnpm dlx ts-node --transpile-only` runtime sampling.)

## Guards
- guard:hero, guard:canon, guard:rogue-hex, guard:hero-freeze, guard:manifest, guard:brand-structure
- `pnpm run verify` (includes guards, lint, typecheck, build)
