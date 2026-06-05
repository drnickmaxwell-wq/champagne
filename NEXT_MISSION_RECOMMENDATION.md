# NEXT_MISSION_RECOMMENDATION

Role: `HERO_V2_FIRST_PAINT_BASE_SURFACE_STABILIZATION_IMPLEMENTER`
Evidence date: 2026-06-05

## Recommendation

Proceed with a read-only Hero V2 route identity and variant-binding diagnostic mission only after this stabilization is reviewed.

## Why

This mission stabilized the first-paint/base-surface pathway without touching global surfaces or hero variants. Recapture still showed unset/null debug identity attributes on the Hero V2 root for the sampled routes. The proof gate already classified route-specific Hero V2 identity/content as a separate concern.

## Suggested next mission scope

Read-only diagnostics for:

1. `data-hero-engine` and Hero V2 mount identity on representative routes.
2. `getHeroBindingForPathnameKey()` output for `/`, `/treatments/composite-bonding`, and `/treatments/teeth-whitening`.
3. selected runtime `heroId` / `variantId` / `effectiveVariantId`.
4. manifest source selected for each route.
5. whether treatment routes are intended to share the general hero copy at this stage.

## Explicit no-go boundaries for next mission

Do not combine identity diagnostics with:

- Persian Midnight implementation;
- token or global background changes;
- nav/header changes;
- typography changes;
- hero visual redesign;
- hero variant rollout;
- sacred manifest edits;
- sacred hero engine surgery unless separately authorized.
