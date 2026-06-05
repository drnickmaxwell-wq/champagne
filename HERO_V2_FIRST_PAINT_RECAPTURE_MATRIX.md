# HERO_V2_FIRST_PAINT_RECAPTURE_MATRIX

Role: `HERO_V2_FIRST_PAINT_BASE_SURFACE_STABILIZATION_IMPLEMENTER`
Evidence date: 2026-06-05

## Production recapture setup

Build flags:

```bash
NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm run build:web
```

Server flags:

```bash
PORT=3100 NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm --filter web start
```

Capture URLs included `?heroDebug=1&heroTruth=1&bloomDebug=1`.

Capture script:

```bash
node .tmp/hero-v2-recapture.cjs > /tmp/hero-v2-recapture.json
```

The `.tmp` script was temporary local capture tooling and is not part of the patch.

## Summary result

The recapture supports the fix: sampled first-frame hero-area pixels no longer expose the root/body ink canvas. Hero V2 root/base/`gradient.base` all computed to the same hero gradient background image at first-frame and post-hydration captures.

## Direct-load route matrix

| Route | Phase | Sampled hero pixel | Root/body/main surfaces | Hero V2 root/base/fallback surfaces | Console warnings/errors | Visual identity changed? |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | first-frame DOMContentLoaded | `#B9B4C0` | `html`/`body`: ink; `main`: transparent | hero root: hero gradient; hero base frame: hero gradient; `gradient.base`: hero gradient | none captured | No material identity change observed |
| `/` | post-hydration 2200ms | `#BAB5C6` | `html`/`body`: ink; `main`: transparent | hero root: hero gradient; hero base frame: hero gradient; `gradient.base`: hero gradient | none captured | No material identity change observed |
| `/treatments/composite-bonding` | first-frame DOMContentLoaded | `#ABA8BA` | `html`/`body`: ink; `main`: transparent | hero root: hero gradient; hero base frame: hero gradient; `gradient.base`: hero gradient | none captured | No material identity change observed |
| `/treatments/composite-bonding` | post-hydration 2200ms | `#B9B4C5` | `html`/`body`: ink; `main`: transparent | hero root: hero gradient; hero base frame: hero gradient; `gradient.base`: hero gradient | none captured | No material identity change observed |
| `/treatments/teeth-whitening` | first-frame DOMContentLoaded | `#BAB5C4` | `html`/`body`: ink; `main`: transparent | hero root: hero gradient; hero base frame: hero gradient; `gradient.base`: hero gradient | none captured | No material identity change observed |
| `/treatments/teeth-whitening` | post-hydration 2200ms | `#B9B5C5` | `html`/`body`: ink; `main`: transparent | hero root: hero gradient; hero base frame: hero gradient; `gradient.base`: hero gradient | none captured | No material identity change observed |

## Computed-style evidence details

All three routes retained:

- `html`: `oklab(0.25248 0.00174809 -0.00324971)`, background image `none`.
- `body`: `oklab(0.25248 0.00174809 -0.00324971)`, background image `none`.
- `main`: transparent background, background image `none`.
- Hero mount: transparent background, background image `none`.
- Hero root: transparent background color, hero gradient background image, opacity `1`, visibility `visible`.
- Hero base frame: transparent background color, hero gradient background image, opacity `1`, visibility `visible`.
- `gradient.base`: transparent background color, hero gradient background image, opacity `1`, visibility `visible`.

## Console evidence

Console recapture found no warning/error/pageerror/hydration entries matching warning/error/hydration filters:

- `/`: 48 debug console entries, 0 warning/error/pageerror/hydration entries.
- `/treatments/composite-bonding`: 48 debug console entries, 0 warning/error/pageerror/hydration entries.
- `/treatments/teeth-whitening`: 48 debug console entries, 0 warning/error/pageerror/hydration entries.

## Important out-of-scope observation

Debug identity attributes remained unset/null in the capture (`heroId`, `variantId`, and `motionCount` were not present on the debug root). This matches the proof-gate warning that route identity/variant binding is separate and was not repaired by this mission.
