# NAV_HERO_BACKGROUND_FLASH_DEEP_CAPTURE_REPORT

Role: `NAV_HERO_BACKGROUND_FLASH_DEEP_CAPTURE_DIRECTOR`  
Repository: `drnickmaxwell-wq/champagne`  
Mode: read-only diagnostics plus documentation-only evidence capture  
Evidence date: 2026-06-05

## Mission result

This mission produced deeper evidence for the nav/hero/background flash issue without changing code, tokens, CSS, hero, nav, typography, Persian Midnight, or hero variants.

Generated evidence files:

1. `FIRST_PAINT_SURFACE_CAPTURE_MATRIX.md`
2. `ROUTE_TRANSITION_SURFACE_CAPTURE_MATRIX.md`
3. `COMPUTED_STYLE_EVIDENCE_SUMMARY.md`
4. `FLASH_ROOT_CAUSE_CONFIDENCE_REPORT.md`
5. `BOUNDED_SAFE_FIX_PLAN_RECOMMENDATION.md`
6. updated `NEXT_MISSION_RECOMMENDATION.md`

## Inputs reviewed

Read-first diagnostic inputs reviewed:

- `NAV_HERO_BACKGROUND_FLASH_DIAGNOSTIC_REPORT.md`
- `ROOT_SURFACE_ASSIGNMENT_TRACE.md`
- `NAV_HEADER_SURFACE_TRACE.md`
- `HERO_SURFACE_AND_FALLBACK_TRACE.md`
- `ROUTE_TRANSITION_FLASH_RISK_MATRIX.md`
- `SAFE_FIX_OPTIONS_FOR_LATER.md`
- `NEXT_MISSION_RECOMMENDATION.md`
- `CURRENT_BACKGROUND_SURFACE_STATUS.md`
- `CHAMPAGNE_DESIGN_AUTHORITY_INDEX_V1.md`

Relevant implementation files inspected read-only:

- `apps/web/app/layout.tsx`
- `apps/web/app/globals.css`
- `apps/web/app/components/layout/Header.tsx`
- `apps/web/app/_components/HeroMount.tsx`
- `apps/web/app/components/hero/v2/HeroRendererV2.tsx`
- `apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx`
- `packages/champagne-tokens/styles/champagne/theme.css`
- `packages/champagne-tokens/styles/champagne/tokens.css`

## Tooling used

Existing safe tooling was available:

- `playwright` dependency exists in the root workspace.
- Chromium browsers initially were not installed; `pnpm exec playwright install chromium` downloaded Chromium but browser dependencies were missing.
- `pnpm exec playwright install --with-deps chromium` installed required system dependencies. One external apt source returned 403 for `mise.jdx.dev`, but Ubuntu dependency installation proceeded and Chromium then ran.
- The app was run with `NEXT_PUBLIC_HERO_ENGINE=v2 pnpm dev:web`.
- The successful capture used a temporary Playwright script in `/tmp`, not repository source.

## What was captured

Direct loads:

- `/`
- `/treatments/composite-bonding`
- `/treatments/teeth-whitening`

Route-level sequential transitions:

- `/` → `/treatments/composite-bonding`
- `/treatments/composite-bonding` → `/`
- `/treatments/composite-bonding` → `/treatments/teeth-whitening`

Computed fields:

- `html`, `body`, app wrapper, `main`
- sticky wrapper, `header`, `nav`
- Hero V2 mount/root/base/surface stack
- `gradient.base`, `field.waveBackdrop`, `hero.contentFrame`, `.hero-content`
- first porcelain data node
- layer counts, motion counts, fallback text presence
- console warnings/errors
- reduced-motion state

## Core evidence

1. `html` and `body` consistently computed to dark ink: `oklab(0.25248 0.00174809 -0.00324971)`.
2. `<main>` was transparent in all captures.
3. Header was consistently translucent ink: `color(srgb 0.134572 0.132574 0.140214 / 0.85)`.
4. Hero V2 mount/root/base were transparent.
5. `gradient.base` was present, full-rect, and opacity `1` in every successful capture.
6. `field.waveBackdrop` had an asset URL but opacity `0` in every successful capture.
7. Hero content opacity was `1` in every successful capture.
8. Hero fallback text did not appear.
9. Reduced-motion did not alter root/header/hero base computed colors.
10. Treatment captures showed React hydration mismatch warnings.
11. Local dev server `HERO_BINDING_PROOF` logged `pathname: '/'` even for treatment URLs, so route-specific Hero V2 identity was not proven in this capture.

## Likely cause classification

Most likely: **mixed root/hero/content surface contract**, with root/body ink, transparent main, transparent Hero V2 frame/base, visible `gradient.base`, and porcelain content below hero.

Strong contributor: **translucent ink header/nav**, because the sticky header remains visually stable while below-surfaces differ.

Still open and important:

- hydration mismatch contribution;
- route identity/header plumbing contribution;
- true client-side Link-click first frame;
- raw first-pixel CSS-load timing.

## Recommendation

Do not implement a visual fix yet. The safest next mission is a no-code production-build capture that resolves the remaining evidence gaps. If that proof confirms root/hero first-paint dominance, the smallest later fix should likely stabilize the Hero V2 base surface contract with token-only semantics and explicit hero authority.
