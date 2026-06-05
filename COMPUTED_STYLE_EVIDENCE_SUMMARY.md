# COMPUTED_STYLE_EVIDENCE_SUMMARY

Role: `NAV_HERO_BACKGROUND_FLASH_DEEP_CAPTURE_DIRECTOR`  
Mode: read-only computed-style evidence summary  
Evidence date: 2026-06-05

## Runtime setup

- App server: `NEXT_PUBLIC_HERO_ENGINE=v2 pnpm dev:web`
- Browser: Playwright Chromium, 1365×900 viewport
- Capture routes: `/`, `/treatments/composite-bonding`, `/treatments/teeth-whitening`
- Debug flags: `?heroDebug=1&heroTruth=1&bloomDebug=1`

## Computed style findings

### Root / html / body / app shell

- `html` background resolved to `oklab(0.25248 0.00174809 -0.00324971)` in every capture.
- `body` background resolved to the same value in every capture.
- The app wrapper did not introduce a competing visible background in the sampled fields.
- `<main>` background was consistently `rgba(0, 0, 0, 0)`.

Evidence-backed implication: if the hero or route child does not paint, the visible fallback canvas is the ink root/body color.

### Header / nav

- Header computed background was consistently `color(srgb 0.134572 0.132574 0.140214 / 0.85)`.
- Header remained sticky and visually independent of route content.
- Header is translucent and therefore samples underlying surfaces.

Evidence-backed implication: header is likely a contributor to perceived mismatch because it remains an ink-derived translucent slab while hero/content surfaces below it can differ.

### Hero V2 frame / base / surface stack

- `data-hero-engine="v2"` and normalized flag `v2` were present.
- Hero mount, Hero V2 root, and immediate hero base wrapper computed to transparent background.
- `gradient.base` existed, covered the full hero rect, and computed to `linear-gradient(135deg, rgb(194, 24, 91) 0%, rgb(64, 196, 180) 60%, rgb(212, 175, 55) 100%)` with opacity `1`.
- `field.waveBackdrop` existed with the expected wave asset URL but opacity `0`.
- Hero content opacity was `1` in all successful captures.
- Surface layer count was `13`; motion layer count was `4`.
- Fallback text was not present.

Evidence-backed implication: the sampled Hero V2 steady state is not gradient-fallback-only in the component sense, but the visible base color source is the `gradient.base` layer because the frame/base are transparent and wave opacity is zero.

### Porcelain content surface

- The first `[data-surface="porcelain"]` node itself computed transparent background in these captures.
- Prior static trace still shows the surrounding `BaseChampagneSurface` for the page builder sets `backgroundColor: var(--surface-1)`.
- The browser capture selector targeted the inner porcelain data node, not necessarily the outer BaseChampagneSurface wrapper.

Evidence-backed implication: the computed-style script confirmed porcelain context exists below hero, but did not directly sample the outer page-builder surface wrapper. A future capture should add a selector for the parent surface around `[data-surface="porcelain"]`.

### Reduced motion

- `matchMedia('(prefers-reduced-motion: reduce)')` was true in the reduced-motion context.
- Root/body/main/header/hero frame/base/gradient values did not change.
- Surface and motion elements remained in the DOM; the CSS reduced-motion media rule may still hide motion layers visually.

Evidence-backed implication: reduced motion does not appear to change the core background-surface mismatch; it may only reduce animation contribution.

## Console warnings / errors

- Hydration mismatch errors appeared on treatment direct loads and some sequential route captures.
- The visible error text was React's standard warning that server-rendered attributes did not match client properties and would not be patched.
- Hero debug/truth logs appeared as expected when debug flags were used.
- Server-side `HERO_BINDING_PROOF` in local dev reported `pathname: '/'` for treatment requests as well as home requests.

## Evidence not captured

- True browser first pixel before CSS application.
- True SPA Link-click animation frame without evaluation-context destruction.
- Network waterfall timing for CSS and hero assets.
- Retained screenshots/pixel matrix.
- Direct computed style for the outer page-builder BaseChampagneSurface parent.
