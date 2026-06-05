# NEXT_MISSION_RECOMMENDATION

Mode: recommendation after production-build proof-gate capture
Evidence date: 2026-06-05

## Recommendation

Recommended next mission: **A. bounded safe fix mission**.

The next mission should be a narrow Hero V2 first-paint/base-surface stabilization mission. It must not be a nav redesign, global background retokening, Persian Midnight implementation, typography pass, route-identity repair, or hero-variant implementation.

## Why a bounded fix is now safe

Production proof-gate capture showed:

- fresh direct-load earliest frames expose root/body ink through the hero area;
- hydrated frames settle to the Hero V2 gradient/asset composite;
- `html`/`body` are stable ink;
- `main`, Hero V2 mount, Hero V2 renderer/root, and `hero.contentFrame` are transparent;
- `gradient.base` exists with opacity `1`, but the Hero V2 root/frame lacks its own first-paint visual base;
- no production hydration warning was captured;
- route path validation passed for `/`, `/treatments/composite-bonding`, and `/treatments/teeth-whitening`.

This makes the dominant direct-load flash cause sufficiently proven for a one-contract Hero V2 base-surface fix.

## Boundary for the next mission

The next mission may only stabilize the Hero V2 first paint/base surface using token-only styling and preserving current Hero V2 structure. The likely file is:

- `apps/web/app/components/hero/v2/HeroRendererV2.tsx`

Do not touch:

- sacred hero manifests;
- sacred hero engine core;
- `apps/web/app/components/hero/HeroRenderer.tsx` unless separately authorized;
- `apps/web/app/layout.tsx`;
- `apps/web/app/globals.css`;
- header/nav files;
- token files;
- typography files;
- page copy/content;
- hero variant/model routing.

## Required proof after the bounded fix

The next mission must run:

- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`

It must also recapture production first-frame and post-hydration evidence for:

- `/`
- `/treatments/composite-bonding`
- `/treatments/teeth-whitening`

Acceptance criterion: earliest observable hero-area pixels no longer expose root/body ink, hydrated hero visuals remain stable, paths remain correct, no hydration warnings appear, and guards pass.
