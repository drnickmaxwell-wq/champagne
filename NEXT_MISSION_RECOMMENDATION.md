# NEXT_MISSION_RECOMMENDATION

Role: `HERO_V2_NAVIGATION_FLASH_FAILURE_RESPONSE_DIRECTOR`  
Evidence date: 2026-06-05

## Recommendation

Do **not** certify the previous first-paint/base-surface fix as solving the Vercel navigation flash. The next mission should be a narrow lifecycle proof gate followed by one bounded implementation mission only if the proof gate identifies a safe target.

## Next mission name

`HERO_V2_NAVIGATION_LIFECYCLE_PROOF_GATE`

## Mission goal

Determine whether Vercel Preview navigation is:

1. hard document navigation;
2. same-document App Router navigation with root/layout remount;
3. same-document navigation with persistent root layout but remounting hero child;
4. persistent hero stack with only content fade/motion reveal replay.

## Required captures

For Vercel Preview and local production build:

1. DOM before click:
   - `data-hero-engine`
   - hero root presence
   - `data-v2-stack-instance`
   - motion layer ids
   - motion video `currentTime`
   - content fade opacity
2. During/immediate after click:
   - whether JS execution context survives
   - whether browser makes a document request
   - first visible hero frame screenshot
3. After navigation +120ms:
   - stack instance
   - motion `currentTime`
   - data-ready/motionReady
   - content fade opacity
4. After navigation +1500ms:
   - stack instance
   - motion `currentTime`
   - console warnings/errors
5. Environment parity:
   - `NEXT_PUBLIC_FEATURE_BRAND_HERO`
   - `NEXT_PUBLIC_HERO_ENGINE`
   - `NEXT_PUBLIC_HERO_MOTION_ALLOWLIST`
   - `NEXT_PUBLIC_HERO_CONTENT_FADE`

## Stop conditions

Stop without code changes if:

- Vercel Preview is not actually running Hero V2;
- brand hero flag differs from local proof;
- navigation is a full document reload and no same-document continuity is possible from Hero code alone;
- the observed flash is from missing/slow media assets rather than React lifecycle;
- evidence points to sacred engine/manifests, which require separate explicit authority.

## Candidate implementation after proof

If stack remount is proven under same-document navigation:

- prefer Option A if a persistent client island can be created without touching forbidden layout/global/sacred files;
- otherwise consider Option B as a bounded mitigation.

If stack persists but content flashes:

- implement Option D: make content fade first-load-only or disable route-change fade for the global sacred Hero V2.

If key/model churn is proven:

- implement Option C: stabilize hero model/key identity without changing variants or visual design.

If full document reload is proven:

- do not patch hero visuals first; diagnose why internal `next/link` navigation is not preserving client context, or accept that only first-paint mitigations can reduce but not eliminate the reset.

## Why this should be next

The current evidence shows the remaining symptom is a navigation lifecycle/motion continuity failure, not merely a background first-paint gap. A future Codex mission can safely target the actual user-visible navigation flash only after it separates hard reload, layout remount, stack remount, content fade, and motion replay.
