# HERO_V2_NAVIGATION_FLASH_FAILURE_REPORT

Role: `HERO_V2_NAVIGATION_FLASH_FAILURE_RESPONSE_DIRECTOR`  
Evidence date: 2026-06-05  
Mode: failure-response diagnostic and correction planning; documentation-only; no code correction implemented.

## Executive finding

The previous Hero V2 first-paint/base-surface stabilization must be treated as **partial or failed for the user-visible navigation flash**. It addressed a direct-load transparency gap by giving the Hero V2 root/frame a local `--hero-gradient` base, but the current route-navigation evidence still shows the hero stack and video motion layers being recreated on navigation.

The remaining user-visible problem is therefore not certified as fixed. The most likely remaining cause is **navigation lifecycle reset of the Hero V2 stack and media motion layers**, with the page transition behaving like a route/document replacement in the captured production-local environment.

## What the previous fix addressed

The prior report says the implemented change was limited to `apps/web/app/components/hero/v2/HeroRendererV2.tsx` and applied the same approved hero gradient to the Hero V2 root and base surface before child layers settle.

The prior report explicitly left these concerns out of scope:

- route-specific Hero V2 identity binding;
- hero variant selection;
- Hero V2 copy/content identity;
- motion layer governance;
- global root/body surfaces;
- nav/header translucency;
- Persian Midnight naming or implementation.

Those out-of-scope items overlap with the current user report, especially the route lifecycle and motion reset symptoms.

## Current code-path facts

1. The public root layout renders `HeroMount` before route children whenever the page is public and the brand hero flag is enabled.
2. `HeroMount` reads `NEXT_PUBLIC_HERO_ENGINE`, normalizes it, and chooses V2 only when the value is exactly `v2`.
3. In the V2 server path, `HeroMount` reads `next-url`, derives `pathname`, builds a V2 model, and renders `HeroV2Frame` plus `HeroSurfaceStackV2` directly when a model exists.
4. The root layout computes page category/mode/treatment slug from `next-url`, then passes those props into `HeroMount`.
5. Header navigation uses `next/link`, but the debug click capture logged `defaultPrevented=false` and the Playwright execution context was destroyed during navigation, which is consistent with a hard navigation/document replacement in the capture.
6. `HeroSurfaceStackV2` creates a random `data-v2-stack-instance` per mounted stack; the captured stack instance changed after every navigation.
7. The motion videos are rendered with `autoPlay`, `loop`, `preload="metadata"`, and stable keys by motion-layer id; stable keys only preserve elements if the parent stack is not replaced.
8. `HeroContentFade` intentionally sets opacity to `0` and then `1` on each pathname change unless reduced motion is active or `NEXT_PUBLIC_HERO_CONTENT_FADE=0`.

## Browser evidence captured in this mission

A local production build was run with:

```bash
NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm run build:web
PORT=3100 NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm --filter web start
node .tmp/hero-nav-diagnostic.cjs > /tmp/hero-nav-diagnostic.json
```

Playwright dependencies needed installation in this container. `pnpm exec playwright install chromium` succeeded after a blocked CDN endpoint fell back to the Microsoft mirror; `pnpm exec playwright install-deps chromium` succeeded with a warning for an unrelated `mise.jdx.dev` apt source.

Captured transitions:

| Transition | Before stack | After stack | Motion currentTime before | Motion currentTime after +120ms | Evidence interpretation |
| --- | --- | --- | --- | --- | --- |
| `/` → `/treatments` | `v2-stack-bmaim9rt` | `v2-stack-12ppn9wd` | ~0.417–0.423s | `0` | Stack and video elements were recreated; motion restarted. |
| `/treatments` → `/treatments/composite-bonding` | `v2-stack-rr6q1vz5` | `v2-stack-6ql16e0r` | ~2.074–2.117s | `0` | Stack and video elements were recreated; motion restarted. |
| `/treatments/composite-bonding` → `/` | `v2-stack-76a941jw` | `v2-stack-dl9b9di7` | ~1.400–1.432s | `0` | Stack and video elements were recreated; motion restarted. |

Additional captured signals:

- Each transition logged `[HERO_DIAG_NAV] ... defaultPrevented=false`.
- Immediate post-click evaluation often failed with `Execution context was destroyed`, which prevented a true same-document compositor filmstrip in this run.
- Post-navigation logs contained new `HERO_V2_MOUNT` and `HERO_V2_MOTION_EVENT` / `HERO_V2_MOTION_REVEAL` sequences.
- At +120ms after navigation, motion layer `currentTime` was `0`, confirming user-visible media reset risk even when opacity had already been restored.

## What this does and does not prove

### Proves / strongly supports

- The previous fix did not remove the observed route-navigation reset class.
- Hero V2 motion layers restart during captured navigations.
- The stack instance changes across captured navigations.
- The current debug signals are sufficient to target lifecycle/motion reset next, not to certify first-paint stabilization.

### Does not fully prove

- Whether Vercel preview is performing hard document navigations for the same reason as this local capture.
- Whether the user-visible Vercel flash is dominated by full document replacement, RSC/root-layout replay, content fade replay, video restart, or a combination.
- Whether a persistent layout strategy is architecturally safe without additional App Router lifecycle proof.

## Failure-response decision

The prior fix should be considered **a first-paint sub-issue fix only**. It may reduce root/body ink exposure on direct load, but it does **not** address navigation lifecycle reset and does **not** certify the Vercel preview symptom as fixed.
