# HYDRATION_AND_ROUTE_PATH_VALIDATION

Role: `NAV_HERO_BACKGROUND_FLASH_PROOF_GATE_DIRECTOR`
Mode: production-build hydration/path validation; documentation-only
Evidence date: 2026-06-05

## Scope

Validated the following production-served routes with Hero V2 enabled:

- `/`
- `/treatments/composite-bonding`
- `/treatments/teeth-whitening`

## Route path validation

| Route requested | Browser `location.pathname` at capture | Hero debug pathname log | Result |
| --- | --- | --- | --- |
| `/` | `/` | `[HeroDebug] mount {pathnameKey: /}` | Path matches. |
| `/treatments/composite-bonding` | `/treatments/composite-bonding` | `[HeroDebug] mount {pathnameKey: /treatments/composite-bonding}` | Path matches. |
| `/treatments/teeth-whitening` | `/treatments/teeth-whitening` | `[HeroDebug] mount {pathnameKey: /treatments/teeth-whitening}` | Path matches. |

## Hydration warning validation

No console `error`, `warning`, or `pageerror` entries were captured during direct production loads of the three target routes. No React hydration mismatch warning was observed in this production proof-gate run.

## Computed surface stability

The following computed surfaces were stable between earliest-observable, DOM/content complete, and post-hydration captures:

| Element | Computed background state | Change between first frame and post-hydration? |
| --- | --- | --- |
| `html` | `oklab(0.25248 0.00174809 -0.00324971)` | No. |
| `body` | `oklab(0.25248 0.00174809 -0.00324971)` | No. |
| `main` | `rgba(0, 0, 0, 0)` | No. Transparent throughout. |
| `header` | `color(srgb 0.134572 0.132574 0.140214 / 0.85)` | No. Translucent ink throughout. |
| Hero V2 mount `[data-hero-engine="v2"]` | `rgba(0, 0, 0, 0)` | No. Transparent throughout. |
| Hero V2 renderer `.hero-renderer-v2` | `rgba(0, 0, 0, 0)` with no own `background-image` | No. Transparent throughout. |
| `hero.contentFrame` | `rgba(0, 0, 0, 0)` | No. Transparent throughout. |
| `gradient.base` layer | gradient image present, opacity `1` | Layer computed state present at sampled states; visible pixels still transition from ink to gradient composite. |

## Hero identity / model validation

Path validation passed, but route-specific Hero V2 identity did not prove distinct route models in this production run:

- `[HeroDebug] state` reported `heroEngine: v2`, `heroVariantId: undefined`, `heroIdentityKey: undefined`, and `hasModel: false` on all three target routes.
- The sampled `.hero-content` text was the same home/general hero copy on all three routes: `Champagne DentistryAdvanced cosmetic dentistry crafted with calm precision...`.
- Therefore, the previous dev-capture path confusion is not reproduced as a wrong pathname in production, but route-specific Hero V2 content/variant binding remains unproven.

## Hydration/path conclusion

Production hydration is clean for the target routes: no hydration warnings were captured, and browser paths match requested routes. The remaining identity concern is not a hydration mismatch; it is a Hero V2 route/model binding concern and should stay outside the smallest flash-surface fix unless a separate mission authorizes hero route identity repair.
