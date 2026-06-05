# SAFE_FIX_OPTIONS_FOR_LATER

Mode: future options only  
Evidence date: 2026-06-05

No option in this file has been implemented. These are bounded future-fix candidates for a separate authorized mission.

## Option 1 — Root first-paint contract

Define a single authorized root first-paint surface contract so `html`, `body`, `main`, and the initial hero region do not disagree before hero surfaces load.

- Scope would likely involve global/root files and/or token binding, so it needs explicit authorization.
- Must remain token-only.
- Must not change layout, copy, typography, hero semantics, or nav behavior.
- Best when live evidence proves root/main background is the visible flash.

## Option 2 — Header/nav semantic surface contract

Introduce or bind a nav-specific semantic surface so sticky header material is intentional over hero and porcelain boundaries.

- Scope would involve header/nav files and maybe tokens; requires explicit header/nav/token authorization.
- Should avoid route-specific visual guesses.
- Best when computed header transparency over changing below-surfaces is proven to be the perceived flash.

## Option 3 — Hero V2 base surface stabilization

Ensure Hero V2 has a token-only, semantic base surface that matches the intended first-paint hero canvas before optional images/motion/fx load.

- Scope would involve Hero V2 files and possibly hero package files; requires explicit hero/V2 authorization.
- Must not alter sacred manifests, runtime semantics, PRM, motion gating, or asset selection unless explicitly authorized.
- Best when screenshots show hero area itself flashes before surface layers become visible.

## Option 4 — Fallback consistency contract

Align the V2 fallback surface with the chosen first-paint hero/root contract so fallback does not introduce a different gradient/material.

- Scope would involve V2 fallback only if authorized.
- Must not hide real manifest/model failures; fallback should remain diagnostic and observable.
- Best when fallback is observed during real route transitions or cold loads.

## Option 5 — Route-transition observational hardening first

Before changing visuals, add or use existing diagnostics to capture first-frame and route-click states across route categories.

- This is safest if uncertainty remains.
- Existing hooks already log hero background sources, truth surfaces, content visibility, and media events when debug flags are enabled.
- Best when no reproducible screenshot/console evidence exists yet.

## Option 6 — Motion/content fade bounding

If flash is specifically tied to content fade or media readiness, bound the timing behavior without changing colors or surfaces.

- Scope would involve V2 client behavior; requires explicit authorization.
- Must preserve PRM and motion governance.
- Best only if evidence shows the flash occurs exactly during content opacity 0 or video readiness transitions.

## Option 7 — Asset/network preloading review

If hero background or motion assets arrive late, evaluate preload/fetch strategy for the stable first hero image or background asset.

- Scope may involve metadata/head/resource loading; requires careful performance review.
- Must not preload every motion asset blindly.
- Best when network waterfall proves late hero base asset load is the dominant cause.

## Rejected unsafe approaches

Do not:

- hard-code colors;
- force visibility of hero layers;
- bypass PRM, motion, surface, or manifest gating;
- change sacred manifests or runtime config without authority;
- redesign nav/header/hero by preference;
- change typography or implement a new material such as Persian Midnight without a separate explicit mission;
- patch multiple surface systems at once without first isolating the proven cause.
