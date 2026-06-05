# FLASH_ROOT_CAUSE_CONFIDENCE_REPORT

Role: `NAV_HERO_BACKGROUND_FLASH_DEEP_CAPTURE_DIRECTOR`  
Mode: read-only confidence report; no implementation authority  
Evidence date: 2026-06-05

## Executive confidence verdict

Implementation is **not safe yet** as a visual fix mission, because the strongest new evidence is a mixed-surface contract and hydration/path-routing diagnostic signal, but not a captured raw first-pixel flash or a stable SPA-click frame.

A future fix mission can be bounded, but it must first choose whether it is stabilizing:

1. root/hero first paint,
2. nav material semantics,
3. Hero V2 transparent-base semantics,
4. path/header plumbing for route-specific hero binding,
5. hydration mismatch source,
6. or a combination.

## Ranked likely root causes

| Rank | Candidate root cause | Confidence | Evidence supporting | Evidence against | Missing evidence | Safe to implement now? |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Mixed root/hero/content surface contract: ink root + transparent main/hero frame + gradient.base + porcelain content below | High | Browser computed `html/body` ink, `main` transparent, Hero V2 frame/base transparent, `gradient.base` visible opacity `1`; prior trace shows page-builder outer surface uses `var(--surface-1)`. | Captures after `domcontentloaded` did not show an actual color jump between immediate and 1500ms. | True raw first-pixel screenshot and parent page-builder surface sample. | Not yet; safest future fix must be a narrowly authorized first-paint contract. |
| 2 | Header/nav translucent ink material mismatch | Medium-high | Header computed background is constant translucent ink `color(... / 0.85)` over all routes while underlying hero/content surfaces differ. | Header value itself did not change during captures. | Visual pixel capture under sticky header during actual SPA click; hover/focus states not sampled. | Not yet; needs nav-specific authorization and proof that header is the perceived flash. |
| 3 | Hero V2 transparent base with visible gradient.base dependence | Medium-high | Hero mount/root/base all transparent; `gradient.base` is the first visible hero surface; wave backdrop has URL but opacity `0`; fallback not seen. | `gradient.base` was present and opacity `1` in all captures, so no sampled blank hero frame occurred after DOMContentLoaded. | Raw pre-DOM/first-frame capture; network timing for gradient CSS and assets; verification of intended V2 base semantics. | Not yet; hero changes require explicit hero authority and must not bypass guards. |
| 4 | Hydration mismatch contributing to route flash | Medium | Browser console logged React hydration mismatch errors on treatment captures and some sequential route captures. | Captured computed styles remained stable despite the warnings. | Exact component/attribute diff source; production build reproduction. | Not safe as a background fix; needs separate hydration diagnostics first. |
| 5 | Path/header plumbing causing wrong hero binding during local dev capture | Medium | Server `HERO_BINDING_PROOF` repeatedly reported `pathname: '/'` for treatment URLs; HeroMount/RootLayout depend on `headers().get('next-url')`. | This may be local-dev instrumentation behavior and not the reported production flash. | Production-like request header trace; direct inspection of middleware/header behavior. | Not safe as a visual fix; investigate route identity plumbing separately. |
| 6 | Motion/content fade timing | Low-medium | Prior trace shows content fade and motion readiness behavior; motion layer count was `4`. | Captured content opacity was `1`; reduced-motion did not alter core surfaces; wave opacity was zero in both modes. | True Link-click frame during route transition; video readiness timing logs. | Not yet; only pursue if exact timing flash is reproduced. |
| 7 | CSS load order / CSS late arrival | Low-medium | Static trace notes theme import order and duplicate root/background declarations. | Browser computed styles were stable by DOMContentLoaded; no guard/build proof of CSS-order breakage. | Raw first-pixel capture before CSS; network waterfall. | Not yet. |
| 8 | Hero fallback mismatch | Low in captured runs; medium as latent risk | Fallback component exists and uses a different gradient-style surface. | Fallback text was not present in any successful browser capture. | Forced model-missing diagnostic capture only if authorized; production telemetry. | No. |

## Implementation readiness

Current state: **not implementation-safe**.

Reason:

- Evidence supports a mixed-surface flash risk, but not a single proven dominant cause.
- The browser trace found hydration mismatch and route-path binding anomalies that could confound a visual fix.
- The route transition capture is route-level sequential navigation evidence, not a perfect client-side Link-click frame.

Minimum readiness gate for a later fix:

1. Capture a retained screenshot or pixel sample at true first visual frame and post-hydration.
2. Reproduce or clear hydration mismatch in production build mode.
3. Confirm route-specific hero identity for treatment routes under production-like headers.
4. Sample the outer page-builder surface parent around `[data-surface="porcelain"]`.
5. Choose exactly one authorized surface contract to change.
