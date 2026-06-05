# BOUNDED_FIX_SCOPE_IF_APPROVED

Role: `NAV_HERO_BACKGROUND_FLASH_PROOF_GATE_DIRECTOR`
Mode: future-scope recommendation only; no implementation
Evidence date: 2026-06-05

## Smallest safe fix path

Recommended smallest safe path: **Hero V2 base-surface stabilization only**.

The future implementation should make the Hero V2 root/frame/base paint a token-only visual base on the server-rendered first frame, before child surface layers, media assets, motion layers, or hydration have to settle.

The fix should not decide a new color system. It should use an existing approved semantic/hero token or already-approved hero gradient token and preserve the current Hero V2 layer stack.

## Likely file

Primary likely file:

- `apps/web/app/components/hero/v2/HeroRendererV2.tsx`

Only use another file if the future agent proves this one file cannot express the base-surface contract without violating structure or canon. Do not expand scope by default.

## Proof required after fix

The future fix mission must capture before/after evidence for:

1. Production direct-load earliest observable frame for:
   - `/`
   - `/treatments/composite-bonding`
   - `/treatments/teeth-whitening`
2. Production post-hydration state for the same routes.
3. Link-click transition evidence where anchors are available:
   - `/treatments/composite-bonding` → `/`
   - `/treatments/composite-bonding` → `/treatments/teeth-whitening`
   - `/` → `/treatments/composite-bonding` only if a direct link exists or a stable click path is documented.
4. Computed styles for:
   - `html`
   - `body`
   - `main`
   - header/nav
   - Hero V2 mount
   - Hero V2 renderer/root/frame
   - `gradient.base`
   - all `[data-surface-id]` layers
5. Console warnings/errors and hydration warnings.
6. Guard output:
   - `npm run guard:hero`
   - `npm run guard:canon`
   - `npm run verify`

Acceptance criterion: the earliest observable hero-area pixels must no longer expose the root/body ink canvas while the hydrated visual state remains canon-compatible and no new hydration, guard, or surface-stack regression appears.

## Rollback strategy

- Keep the future implementation to one file and one semantic contract if possible.
- Commit the implementation separately from proof documents.
- If any guard fails, revert the implementation commit.
- If first-frame proof improves but route identity, hydration, or hero variant behavior regresses, revert and split those concerns into separate diagnostic missions.
- Preserve the current proof-gate reports as the pre-fix baseline.

## Explicit no-go boundaries

No-go boundaries for the future fix mission:

- no sacred manifests;
- no sacred hero engine core;
- no global CSS/root/body changes;
- no header/nav changes;
- no token edits;
- no typography edits;
- no Persian Midnight implementation;
- no hero variant implementation;
- no route/model identity repair;
- no layout/spacing/copy changes;
- no raw colors, gradients, hex, RGB, RGBA, or non-token Tailwind utilities;
- no guard bypasses.
