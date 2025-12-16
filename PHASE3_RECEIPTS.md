# Phase 3 Hero Variant Receipts

## heroDebug routes exercised
- `/` with `?heroDebug=1`
- `/treatments/implants?heroDebug=1`
- `/treatments/whitening?heroDebug=1`
- `/treatments/veneers?heroDebug=1`
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

## Debug wiring updates
- Added `createTreatmentPage` helper in `apps/web/app/(champagne)/treatments/_builder/createTreatmentPage.tsx` to share heroDebug detection and brand-flag bypass for static treatment leaf routes.
- Every treatment leaf under `apps/web/app/(champagne)/treatments/*/page.tsx` now reuses the helper, imports the canonical server renderer, and re-exports `dynamic = "force-dynamic"` so `heroDebug=1` mounts the runtime surfaces.
- Dev trace logs `[HeroRenderer] mounted` only when heroDebug is enabled on a leaf route, confirming mount context during development.
- Verified via `/treatments/implants?heroDebug=1`, `/treatments/whitening?heroDebug=1`, `/treatments/veneers?heroDebug=1`: `window.__CHAMPAGNE_HERO_DEBUG__` defined and `[data-surface-id]/[data-motion-id]` nodes present after hard refresh and the server renderer log prints.

## Canonical renderer wiring (treatments)
- Server HeroRenderer path: `apps/web/app/components/hero/HeroRenderer.tsx` (data-surface-id + heroDebug receipts script).
- Static treatment leaves under `apps/web/app/(champagne)/treatments/*/page.tsx` import from `../_builder/createTreatmentPage` to render `<HeroRenderer mode="treatment" treatmentSlug={slug} pageCategory="treatment" />` when the brand hero flag is on or `heroDebug=1` is present.
- Dev check: `/treatments/implants?heroDebug=1` (and other leaves) → `window.__CHAMPAGNE_HERO_DEBUG__` object present, `document.querySelectorAll('[data-surface-id]').length > 0`, and console prints `CHAMPAGNE_HERO_RECEIPTS_JSON=` from the server renderer.
