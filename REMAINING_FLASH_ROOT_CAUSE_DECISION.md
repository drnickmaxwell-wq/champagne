# REMAINING_FLASH_ROOT_CAUSE_DECISION

Role: `HERO_V2_NAVIGATION_FLASH_FAILURE_RESPONSE_DIRECTOR`  
Evidence date: 2026-06-05

## Decision statement

The previous fix **partially helped or addressed a different issue**. It targeted direct-load first-paint/base-surface exposure. It did **not** resolve the remaining user-visible navigation flash/reset reported in Vercel preview.

## Most likely remaining cause

**Most likely cause:** Hero V2 surface/motion stack lifecycle reset during navigation, causing motion video elements and CSS animation phases to restart. This may be due to hard document navigation in preview/local capture, dynamic root-layout replacement, or another route lifecycle boundary that recreates the stack.

**Secondary contributors:**

1. `HeroContentFade` opacity replay on every pathname change.
2. Motion reveal/readiness events replaying after new video elements are created.
3. Debug/env parity gaps between local proof and Vercel Preview.
4. Direct-load background first-paint exposure may still be relevant during full document reloads, but it is no longer the only plausible issue.

## Confidence level

**Medium-high** for motion/stack reset as the remaining cause.  
**Medium** for hard document navigation as the reason for the reset in Vercel Preview.  
**Low** that another base-surface-only patch would solve the reported issue.

## Evidence

1. The captured surface stack instance changed after every tested navigation.
2. Motion video `currentTime` reset to `0` after navigation.
3. Console logs showed new `HERO_V2_MOUNT` and motion media events after navigation.
4. Click diagnostics logged `defaultPrevented=false`.
5. Immediate post-click Playwright evaluation hit `Execution context was destroyed`, consistent with document/context replacement during captured navigation.
6. The previous fix report explicitly left route identity and motion governance out of scope.
7. `HeroContentFade` still intentionally replays opacity on pathname changes.
8. The root/frame now has a local gradient base, so an unchanged navigation flash after merge points beyond the direct-load transparent-base gap.

## Missing evidence

1. Direct Vercel Preview DOM trace with stack ids before/after user navigation.
2. Direct Vercel Preview network trace proving whether document requests occur on nav clicks.
3. A real compositor filmstrip from Vercel Preview capturing frames before/during/after navigation.
4. Confirmation of Vercel Preview values for:
   - `NEXT_PUBLIC_FEATURE_BRAND_HERO`
   - `NEXT_PUBLIC_HERO_ENGINE`
   - `NEXT_PUBLIC_HERO_MOTION_ALLOWLIST`
   - `NEXT_PUBLIC_HERO_CONTENT_FADE`
5. Whether App Router prefetch/cache state differs between local production and Vercel Preview.

## Is a bounded fix safe?

A bounded fix is **safe only after one more narrow evidence gate** that confirms which lifecycle path Vercel Preview uses.

Safe targets likely include:

- disabling/suppressing content fade replay after first mount;
- suppressing motion initial/reveal replay after first mount;
- stabilizing the hero stack outside the remounting route boundary if architecture allows.

Unsafe targets now:

- another broad visual/base/background patch;
- Persian Midnight;
- typography;
- hero variants;
- brand colour changes;
- global root/body theming;
- sacred engine/manifest edits.

## Final diagnostic decision

The next implementation should target **navigation lifecycle continuity**, not direct-load first-paint alone. The prior fix should not be rolled back solely on current evidence, because it is not shown to be harmful, but it should not be certified as solving the Vercel navigation flash.
