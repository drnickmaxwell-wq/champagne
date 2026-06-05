# PRODUCTION_FIRST_FRAME_CAPTURE_MATRIX

Role: `NAV_HERO_BACKGROUND_FLASH_PROOF_GATE_DIRECTOR`
Mode: production-build proof-gate capture; documentation-only; no implementation
Evidence date: 2026-06-05

## Production build / serve path used

- Built with Hero V2 and brand hero enabled: `NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm run build:web`.
- Served locally with the same public flags: `PORT=3100 NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm --filter web start`.
- Browser capture used Playwright Chromium against `http://localhost:3100` with viewport `1280x900`, `deviceScaleFactor: 1`, and reduced motion disabled.
- Raw capture artifact: `/tmp/nav-hero-proof-gate/capture.json`.
- Fresh-context confirmation artifact: `/tmp/nav-hero-proof-gate/fresh.json`.

## Important production flag note

A first build was run with only `NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1`. In production mode, `isBrandHeroEnabled()` defaults to false unless `NEXT_PUBLIC_FEATURE_BRAND_HERO` is explicitly true/1, so that first run did not mount the hero. It was discarded as non-representative for this proof gate. The final matrices below use `NEXT_PUBLIC_FEATURE_BRAND_HERO=1`.

## Direct-load first-frame matrix

Earliest capture means the first screenshot immediately after Playwright `page.goto(..., { waitUntil: "commit" })` returned. This is the earliest observable frame available in this environment, not a filmstrip frame before response commit.

| Route | Phase | DOM path | Ready state | perf ms | html bg | body bg | main bg | header bg | Hero V2 mounted | gradient.base opacity | field.waveBackdrop opacity | nav pixel | hero-mid pixel | hero-lower pixel | content-start pixel | Console errors/warnings |
| --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | ---: |
| `/` | earliest after commit | `/` | interactive | 1761 | `oklab(0.25248 0.00174809 -0.00324971)` | same as html | `rgba(0, 0, 0, 0)` | `color(srgb 0.134572 0.132574 0.140214 / 0.85)` | yes | 1 | 0 | `#222224` | `#222224` | `#222224` | `#222224` | 0 |
| `/` | DOM/content complete | `/` | complete | 6503 | same | same | transparent | same | yes | 1 | 0 | `#222224` | `#9CBFC7` | `#6EB6B7` | `#83BDAC` | 0 |
| `/` | post-hydration +1500ms | `/` | complete | 11162 | same | same | transparent | same | yes | 1 | 0 | `#222224` | `#9CBFC7` | `#6EB6B7` | `#83BDAB` | 0 |
| `/treatments/composite-bonding` | earliest after commit | `/treatments/composite-bonding` | complete | 3881 | `oklab(0.25248 0.00174809 -0.00324971)` | same as html | `rgba(0, 0, 0, 0)` | `color(srgb 0.134572 0.132574 0.140214 / 0.85)` | yes | 1 | 0 | `#222224` | `#87B2BC` | `#51A8A8` | `#66AC99` | 0 |
| `/treatments/composite-bonding` | DOM/content complete | `/treatments/composite-bonding` | complete | 6197 | same | same | transparent | same | yes | 1 | 0 | `#222224` | `#9BBFC8` | `#72B7B8` | `#84BEAC` | 0 |
| `/treatments/composite-bonding` | post-hydration +1500ms | `/treatments/composite-bonding` | complete | 10273 | same | same | transparent | same | yes | 1 | 0 | `#222224` | `#9BBFC8` | `#6EB6B8` | `#84BDAC` | 0 |
| `/treatments/teeth-whitening` | earliest after commit | `/treatments/teeth-whitening` | complete | 2971 | `oklab(0.25248 0.00174809 -0.00324971)` | same as html | `rgba(0, 0, 0, 0)` | `color(srgb 0.134572 0.132574 0.140214 / 0.85)` | yes | 1 | 0 | `#222224` | `#87B2BC` | `#51A8A8` | `#66AC99` | 0 |
| `/treatments/teeth-whitening` | DOM/content complete | `/treatments/teeth-whitening` | complete | 5500 | same | same | transparent | same | yes | 1 | 0 | `#222224` | `#9CBFC8` | `#6EB6B6` | `#83BDAB` | 0 |
| `/treatments/teeth-whitening` | post-hydration +1500ms | `/treatments/teeth-whitening` | complete | 9302 | same | same | transparent | same | yes | 1 | 0 | `#222224` | `#9CBFC7` | `#6DB4B6` | `#83BCAC` | 0 |

## Fresh-browser confirmation

A second capture using a new browser context per route confirmed that direct-load earliest frames can expose the root/body ink through the hero area before the visible Hero V2 gradient settles:

| Route | Earliest nav | Earliest hero-mid | Earliest hero-lower | Earliest content sample | DOM/content hero-mid | Hydrated hero-mid |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `#222224` | `#222224` | `#222224` | `#222224` | `#9CBFC7` | `#9BBFC8` |
| `/treatments/composite-bonding` | `#222224` | `#222224` | `#222224` | `#222224` | `#87B2BC` | `#9CBFC8` |
| `/treatments/teeth-whitening` | `#222224` | `#222224` | `#222224` | `#222224` | `#9CBFC8` | `#9BBFC8` |

## Hero surface stack state at hydrated capture

For all three routes, the hydrated Hero V2 stack had the same structural state:

- `gradient.base`: background image `var(--smh-gradient)` resolved by Chromium to the canonical magenta/teal/gold linear gradient; opacity `1`; z-index `1`.
- `field.waveBackdrop`: image `/assets/champagne/waves/waves-bg-1920.webp`; opacity `0`; z-index `2`.
- `field.waveRings`: image `/assets/champagne/waves/wave-field.svg`; opacity `0.18`; z-index `4`.
- `mask.waveHeader`: image `/assets/champagne/waves/waves-bg-1920.webp`; opacity `0.38`; z-index `3`.
- `field.dotGrid`: image `/assets/champagne/waves/wave-dots.svg`; opacity `0.055`; z-index `5`.
- `overlay.particlesDrift`, `overlay.particles`, `overlay.filmGrain`, `hero.contentFrame`, and four `sacred.motion.*` layers were present and token/asset-backed.

## Production first-frame conclusion

The production-build evidence confirms a first observable direct-load state where the viewport samples the root/body ink (`#222224` in screenshots) while `main`, the Hero V2 mount, and the Hero V2 renderer are transparent. Hydrated/post-load frames move to the expected Hero V2 gradient/asset composite without changing the html/body/main/header computed backgrounds.
