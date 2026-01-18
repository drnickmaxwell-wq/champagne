# Phase 1 — Mask-Only Implementation (Sacred Hero V2)

## Evidence: defaults.surfaces background removed

**Before** (from `packages/champagne-manifests/data/hero/sacred_hero_base.json` at `HEAD~1`):
```
16      "overlay.caustics",
17      "overlay.glassShimmer",
18      "overlay.goldDustDrift",
19      "overlay.particlesDrift"
20    ],
21    "surfaces": {
22      "gradient": "gradient.base",
23      "waveMask": { "desktop": "mask.waveHeader", "mobile": "mask.waveHeader.mobile" },
24      "background": { "desktop": "field.waveBackdrop", "mobile": "field.waveBackdrop" },
25      "overlays": { "dots": "field.dotGrid", "field": "field.waveRings" },
26      "particles": "overlay.particlesPrimary",
27      "grain": { "desktop": "overlay.filmGrain.desktop", "mobile": "overlay.filmGrain.mobile" },
28      "motion": ["overlay.caustics", "overlay.glassShimmer", "overlay.goldDustDrift", "overlay.particlesDrift"],
29      "video": "__OFF__"
30    },
```
Command:
- `git show HEAD~1:packages/champagne-manifests/data/hero/sacred_hero_base.json | nl -ba | sed -n '16,32p'`

**After** (current file):
```
16      "overlay.caustics",
17      "overlay.glassShimmer",
18      "overlay.goldDustDrift",
19      "overlay.particlesDrift"
20    ],
21    "surfaces": {
22      "gradient": "gradient.base",
23      "waveMask": { "desktop": "mask.waveHeader", "mobile": "mask.waveHeader.mobile" },
24      "overlays": { "dots": "field.dotGrid", "field": "field.waveRings" },
25      "particles": "overlay.particlesPrimary",
26      "grain": { "desktop": "overlay.filmGrain.desktop", "mobile": "overlay.filmGrain.mobile" },
27      "motion": ["overlay.caustics", "overlay.glassShimmer", "overlay.goldDustDrift", "overlay.particlesDrift"],
28      "video": "__OFF__"
29    },
```
Command:
- `nl -ba packages/champagne-manifests/data/hero/sacred_hero_base.json | sed -n '16,32p'`

## Repo-truth note (why omission is safe)
- `HeroSurfaceTokenConfig.background?` is optional, so omitting `background` in the manifest is schema-safe.
- `HeroRenderer` sets the `field.waveBackdrop` layer opacity to `0` when blend/opacity are missing, so no background is painted and no throw occurs.

Referenced proof sources:
- `packages/champagne-hero/src/hero-engine/HeroConfig.ts`
- `apps/web/app/components/hero/HeroRenderer.tsx`
