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

## Debug wiring updates
- Ensured `/treatments/[slug]` reads `searchParams` directly in `apps/web/app/treatments/[slug]/page.tsx` so `heroDebug=1` bypasses the brand flag at render time and mounts the canonical server renderer.
- Dev trace logs `[HeroRenderer] mounted` only when heroDebug is enabled for the leaf route, confirming mount context during development.
- Verified via `/treatments/implants?heroDebug=1`: `window.__CHAMPAGNE_HERO_DEBUG__` defined and `[data-surface-id]/[data-motion-id]` nodes present after hard refresh.

## Canonical renderer wiring (treatments)
- Server HeroRenderer path: `apps/web/app/components/hero/HeroRenderer.tsx` (data-surface-id + heroDebug receipts script).
- Treatments leaf now imports `{ HeroRenderer }` from `../../components/hero/HeroRenderer`, matching team/blog/contact usage of the server renderer.
- Render site: `apps/web/app/treatments/[slug]/page.tsx` mounts `<HeroRenderer mode="treatment" treatmentSlug={params.slug} pageCategory="treatment" />` whenever brand hero is enabled or `heroDebug=1` is present.
- Dev check: `/treatments/implants?heroDebug=1` → `window.__CHAMPAGNE_HERO_DEBUG__` object present, `document.querySelectorAll('[data-surface-id]').length > 0`, and console prints `CHAMPAGNE_HERO_RECEIPTS_JSON=` from the server renderer.
