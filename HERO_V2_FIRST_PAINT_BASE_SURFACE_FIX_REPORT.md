# HERO_V2_FIRST_PAINT_BASE_SURFACE_FIX_REPORT

Role: `HERO_V2_FIRST_PAINT_BASE_SURFACE_STABILIZATION_IMPLEMENTER`
Evidence date: 2026-06-05

## Mission scope

Implemented the smallest bounded Hero V2 first-paint/base-surface stabilization approved by the proof-gate packet.

The change was limited to:

- `apps/web/app/components/hero/v2/HeroRendererV2.tsx`

No global token files, `:root`, `html`, `body`, global CSS, nav/header, typography, Persian Midnight, route structure, hero variants, sacred manifests, or sacred hero engine core files were changed.

## Root cause addressed

The proof gate identified a Hero V2 transparency gap:

- root/body remain intentional ink;
- `main` remains transparent;
- Hero V2 mount/root/frame were transparent;
- Hero V2 depended on child surface compositing, especially `gradient.base`, before first visual settlement;
- first observable direct-load frames could expose root/body ink.

## Implementation

Hero V2 now paints the same approved hero gradient token locally on the Hero V2 root and base frame before child surface/media/motion layers have to settle.

Changes applied:

1. Hero V2 root receives `--hero-gradient`, `background: var(--hero-gradient)`, and `backgroundSize: cover`.
2. Hero V2 base `BaseChampagneSurface` frame now uses `background: var(--hero-gradient)` instead of transparent `backgroundImage`/`backgroundColor` declarations.
3. The pre-motion-ready gating path no longer hides the entire Hero V2 root with `opacity: 0` / `visibility: hidden`; it keeps the local hero gradient base visible while motion readiness settles.

## Token/canon status

- Token-only: yes.
- New raw hex: no.
- New RGB/RGBA/HSL literals: no.
- New brand colours: no.
- New gradients: no; uses existing `--hero-gradient` / runtime-approved gradient path.
- Global background changes: none.
- Persian Midnight changes: none.
- Porcelain changes: none.
- Header/nav changes: none.
- Typography changes: none.

## Expected effect

The Hero V2 box has a local server/client-rendered visual base, so transparent descendants no longer expose the root/body ink canvas in the hero area while the Hero V2 surface stack and motion readiness settle.

## Out-of-scope items preserved

The mission intentionally did not repair or change:

- route-specific Hero V2 identity binding;
- hero variant selection;
- Hero V2 copy/content identity;
- motion layer governance;
- global root/body surfaces;
- nav/header translucency;
- Persian Midnight naming or implementation.
