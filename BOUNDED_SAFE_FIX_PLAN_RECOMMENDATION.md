# BOUNDED_SAFE_FIX_PLAN_RECOMMENDATION

Role: `NAV_HERO_BACKGROUND_FLASH_DEEP_CAPTURE_DIRECTOR`  
Mode: bounded recommendation for a later mission only  
Evidence date: 2026-06-05

## Safest smallest future fix path

Recommended next implementation path, if the Director authorizes a fix mission after the missing proof is captured:

### Phase 0 — no-code proof gate

Before touching code, rerun a production-build browser capture and prove all of the following:

- first visual frame color for `html`, `body`, header, hero rect, and below-hero content;
- post-hydration color for the same points;
- route-specific hero identity on `/`, `/treatments/composite-bonding`, and one additional treatment;
- hydration warning status;
- whether true SPA Link clicks reproduce a flash.

### Phase 1 — choose one contract only

If root/hero first paint is proven dominant, choose **Hero V2 base surface stabilization** before nav redesign or global token changes:

- Keep root/body token binding unchanged.
- Add or bind a token-only base surface only in the Hero V2 frame/base path if authorized.
- Preserve all existing layer keys, z-indexes, PRM behavior, motion governance, manifest/runtime selection, and debug observability.

Why this is the smallest likely path:

- Browser evidence shows the root/body already has a stable ink value.
- Header is stable but translucent.
- Hero V2 frame/base are transparent and therefore depend on `gradient.base` being present immediately.
- Fallback did not appear in captures, so fallback should not be the first fix unless future proof shows it.

## Files likely involved in a later authorized fix

Only if specifically authorized by the Director:

- `apps/web/app/components/hero/v2/HeroRendererV2.tsx` — likely Hero V2 base/frame surface contract.
- `apps/web/app/_components/HeroMount.tsx` — only if route identity/header path proof shows the V2 model is built for the wrong pathname.
- `apps/web/app/layout.tsx` — only if root route/header plumbing proof requires it; otherwise avoid.
- `apps/web/app/components/layout/Header.tsx` — only if header material mismatch is proven as dominant.
- `packages/champagne-tokens/styles/champagne/*.css` — only if a token binding decision is separately authorized.

## Things explicitly forbidden

A later fix mission must not:

- touch sacred hero manifests;
- bypass PRM, motion, surface, or manifest gating;
- hard-code colors, raw gradients, RGB/RGBA/hex, or non-token Tailwind colors;
- implement Persian Midnight or any new material decision without explicit authority;
- redesign nav, typography, hero variants, content, or layout;
- hide hydration warnings instead of explaining them;
- fix root, nav, hero, tokens, and hydration all at once.

## Proof required after fix

Run and record:

- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`
- production-build browser capture of `/`, `/treatments/composite-bonding`, and another treatment route;
- first-frame and post-hydration computed styles;
- true Link-click transition capture if stable;
- console warnings/errors;
- reduced-motion comparison.

Acceptance criteria:

- no sacred file drift beyond explicit authority;
- no raw color/gradient residue;
- no unexpected Hero V2 fallback;
- route-specific hero identity is correct or explicitly explained;
- no new hydration mismatch;
- visual first frame and 1500ms frame use the same chosen surface contract.

## Rollback strategy

- Keep the fix to one file and one semantic contract if possible.
- Preserve a before/after capture matrix.
- If any guard fails, revert the fix commit and restore the pre-fix evidence files.
- If hydration or route identity anomalies remain unexplained, do not ship a visual surface patch as a workaround.
