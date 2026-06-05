# ROUTE_TRANSITION_SURFACE_CAPTURE_MATRIX

Role: `NAV_HERO_BACKGROUND_FLASH_DEEP_CAPTURE_DIRECTOR`  
Mode: read-only route-level browser evidence capture; documentation-only output  
Evidence date: 2026-06-05

## Capture method

The successful transition capture used one Chromium page and navigated sequentially from a prior route to a target route with Playwright browser navigation. A direct Link-click probe was attempted first, but the measurement was unstable because navigation destroyed the evaluation context during the exact capture window. Therefore this file is evidence for route-level replacement surfaces after a prior route, not a definitive SPA-click animation-frame trace.

Routes:

1. `/` → `/treatments/composite-bonding`
2. `/treatments/composite-bonding` → `/`
3. `/treatments/composite-bonding` → `/treatments/teeth-whitening`

Moments:

- `before`: source route after ~500ms
- `after50`: target route after `domcontentloaded` plus ~50ms
- `after1500`: target route after an additional ~1500ms

## Route transition surface matrix

| Transition | Moment | Captured path | html/body background | main background | header background | hero root/base background | Hero V2 gradient opacity | wave backdrop opacity | content opacity | fallback seen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` → `/treatments/composite-bonding` | before | `/` | `oklab(0.25248 0.00174809 -0.00324971)` | transparent | `color(srgb 0.134572 0.132574 0.140214 / 0.85)` | transparent / transparent | `1` | `0` | `1` | no |
| `/` → `/treatments/composite-bonding` | after50 | `/treatments/composite-bonding` | same | transparent | same | transparent / transparent | `1` | `0` | `1` | no |
| `/` → `/treatments/composite-bonding` | after1500 | `/treatments/composite-bonding` | same | transparent | same | transparent / transparent | `1` | `0` | `1` | no |
| `/treatments/composite-bonding` → `/` | before | `/treatments/composite-bonding` | same | transparent | same | transparent / transparent | `1` | `0` | `1` | no |
| `/treatments/composite-bonding` → `/` | after50 | `/` | same | transparent | same | transparent / transparent | `1` | `0` | `1` | no |
| `/treatments/composite-bonding` → `/` | after1500 | `/` | same | transparent | same | transparent / transparent | `1` | `0` | `1` | no |
| `/treatments/composite-bonding` → `/treatments/teeth-whitening` | before | `/treatments/composite-bonding` | same | transparent | same | transparent / transparent | `1` | `0` | `1` | no |
| `/treatments/composite-bonding` → `/treatments/teeth-whitening` | after50 | `/treatments/teeth-whitening` | same | transparent | same | transparent / transparent | `1` | `0` | `1` | no |
| `/treatments/composite-bonding` → `/treatments/teeth-whitening` | after1500 | `/treatments/teeth-whitening` | same | transparent | same | transparent / transparent | `1` | `0` | `1` | no |

## Console evidence observed during route captures

- Hydration mismatch errors appeared on treatment direct loads and on some sequential route captures.
- Hero debug logs appeared, including `[HeroDebug] mount`, `[HeroDebug] state`, `HERO_V2_TRUTH_SURFACES`, and `HERO_V2_TRUTH_CONTENT`.
- Server console repeatedly emitted `HERO_BINDING_PROOF` with `pathname: '/'` even while treatment URLs were being requested in the local dev environment. That implies the current dev capture did not prove route-specific hero identity changes; it proved a stable V2 home binding across sampled routes under the current header/path plumbing.

## Transition verdict

The route-level captures did not show a post-DOM surface color change between source and target route states. They did show a persistent mixed stack:

1. root/body ink;
2. transparent main;
3. translucent ink header;
4. transparent Hero V2 frame/base;
5. visible gradient.base layer;
6. porcelain content beginning below the hero wrapper.

The most important transition evidence gap is the unavailable true first animation frame of a client-side Link click.
