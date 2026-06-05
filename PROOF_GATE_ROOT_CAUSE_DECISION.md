# PROOF_GATE_ROOT_CAUSE_DECISION

Role: `NAV_HERO_BACKGROUND_FLASH_PROOF_GATE_DIRECTOR`
Mode: final read-only proof-gate decision; documentation-only
Evidence date: 2026-06-05

## Decision

The flash root cause is sufficiently proven for a bounded flash-surface fix mission.

Confidence level: **High** for direct-load first-frame root/body ink exposure through transparent Hero V2/root/main surfaces; **Medium** for SPA route-transition flash because earliest Link-click evidence did not capture the full root-only ink frame.

Implementation safety: **Safe only for a narrow Hero V2 first-paint/base-surface stabilization mission.** It is not safe to combine this with nav redesign, global background changes, Persian Midnight, typography changes, token changes, hero variants, or route-identity repair.

## Evidence summary

1. Production direct loads with Hero V2 enabled showed the earliest observable hero-area pixels as root/body ink (`#222224`) on fresh contexts for `/`, `/treatments/composite-bonding`, and `/treatments/teeth-whitening`.
2. The same routes settled after DOM/content and hydration to the Hero V2 gradient/asset composite (`#9CBFC7`, `#9BBFC8`, `#6EB6B7`, `#83BDAC` family).
3. Computed backgrounds for `html`, `body`, `main`, `header`, Hero V2 mount, and Hero V2 renderer did not change during hydration. `html`/`body` were ink, while `main`, Hero V2 mount, and Hero V2 renderer remained transparent.
4. `gradient.base` was present with opacity `1`, but the Hero V2 renderer/frame had no own base background and no own background image; therefore the visible first frame can expose root/body ink before the surface stack is visibly composited.
5. Production browser paths matched requested paths, and no hydration mismatch warning was captured.
6. Route-specific Hero V2 identity/content remains unproven: debug logs reported `hasModel: false`, undefined variant/identity, and the same general hero copy on all sampled routes. That is a separate concern and must not be mixed into the bounded flash fix.

## Root-cause statement

The observed flash is best explained as a **Hero V2 first-paint/base-surface transparency gap over an ink root/body canvas**:

- root/body are intentionally ink;
- `main` is transparent;
- sticky header is translucent ink and stable;
- Hero V2 mount and renderer are transparent;
- Hero V2 visual color depends on child surface layers, especially `gradient.base` and asset-backed overlays;
- earliest observable fresh-load frames can occur before those visual layers have fully painted, exposing the ink canvas.

## Exact permitted future scope if safe

A future bounded fix mission may do only this:

- stabilize the Hero V2 first-paint base surface so the Hero V2 box/frame has a token-only, server-rendered visual base before child layers and media assets settle;
- prefer a one-file change in `apps/web/app/components/hero/v2/HeroRendererV2.tsx` if the implementation can preserve existing structure and layer semantics;
- use existing approved semantic/hero tokens only;
- preserve all existing layer IDs, z-indexes, PRM behavior, motion gating, debug logging, and manifest/runtime selection;
- run proof captures before and after the fix on `/`, `/treatments/composite-bonding`, and `/treatments/teeth-whitening`.

## Exact forbidden changes

A future bounded fix mission must not:

- modify sacred hero engine core files or sacred manifests;
- modify `apps/web/app/components/hero/HeroRenderer.tsx` without fresh explicit authority;
- change `apps/web/app/layout.tsx`, `apps/web/app/globals.css`, root/body tokens, nav/header files, typography, or token files;
- implement Persian Midnight or any final color/material decision;
- implement hero variants or route-specific hero identity repair;
- hard-code colors, raw gradients, RGB/RGBA/hex literals, or non-token Tailwind colors;
- bypass PRM, motion, surface, or manifest guards;
- hide hydration warnings instead of explaining them;
- bundle nav, background, token, typography, and hero fixes together.

## Remaining evidence gap

No evidence gap blocks a narrow Hero V2 first-paint/base-surface stabilization mission. Evidence does remain insufficient for:

- nav redesign;
- global root/background retokening;
- Persian Midnight implementation;
- typography implementation;
- hero-variant implementation;
- route-specific hero model repair.
