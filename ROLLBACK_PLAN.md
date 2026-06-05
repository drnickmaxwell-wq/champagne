# ROLLBACK_PLAN

Role: `HERO_V2_FIRST_PAINT_BASE_SURFACE_STABILIZATION_IMPLEMENTER`
Evidence date: 2026-06-05

## Rollback target

The implementation is intentionally isolated to one file:

- `apps/web/app/components/hero/v2/HeroRendererV2.tsx`

## Safe rollback command

To revert only this bounded implementation after this commit lands, use:

```bash
git revert <commit-sha-for-hero-v2-first-paint-base-surface-stabilization>
```

If reverting manually before commit, restore the changed file:

```bash
git checkout -- apps/web/app/components/hero/v2/HeroRendererV2.tsx
```

## Rollback triggers

Rollback should be considered if any of the following are observed in a future production proof:

1. Hero V2 post-hydration visual identity materially changes.
2. Hero V2 surface stack, motion layers, or content layers become suppressed or hidden.
3. Hydration warnings/errors appear that were absent in this recapture.
4. `npm run guard:hero`, `npm run guard:canon`, or `npm run verify` fails because of this change.
5. First-frame evidence regresses to root/body ink exposure.

## What rollback does not solve

Rollback will not solve:

- route-specific hero identity/variant binding;
- Persian Midnight decisions;
- global background/token decisions;
- nav/header material behavior;
- typography decisions.

Those remain separate missions.
