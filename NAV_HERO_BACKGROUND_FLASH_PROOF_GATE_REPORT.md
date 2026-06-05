# NAV_HERO_BACKGROUND_FLASH_PROOF_GATE_REPORT

Role: `NAV_HERO_BACKGROUND_FLASH_PROOF_GATE_DIRECTOR`
Mode: final read-only production proof gate; documentation-only
Evidence date: 2026-06-05

## Mission result

Production-build proof capture is complete. No application code, tokens, CSS, nav, typography, hero variants, or Persian Midnight implementation were changed.

The system is safe for **one bounded Hero V2 first-paint/base-surface stabilization mission**, and unsafe for broader visual/theming/navigation/variant work.

## Inputs read

The proof gate reviewed the prior diagnostic packet:

- `NAV_HERO_BACKGROUND_FLASH_DIAGNOSTIC_REPORT.md`
- `ROOT_SURFACE_ASSIGNMENT_TRACE.md`
- `NAV_HEADER_SURFACE_TRACE.md`
- `HERO_SURFACE_AND_FALLBACK_TRACE.md`
- `ROUTE_TRANSITION_FLASH_RISK_MATRIX.md`
- `SAFE_FIX_OPTIONS_FOR_LATER.md`
- `NAV_HERO_BACKGROUND_FLASH_DEEP_CAPTURE_REPORT.md`
- `FIRST_PAINT_SURFACE_CAPTURE_MATRIX.md`
- `ROUTE_TRANSITION_SURFACE_CAPTURE_MATRIX.md`
- `COMPUTED_STYLE_EVIDENCE_SUMMARY.md`
- `FLASH_ROOT_CAUSE_CONFIDENCE_REPORT.md`
- `BOUNDED_SAFE_FIX_PLAN_RECOMMENDATION.md`
- prior `NEXT_MISSION_RECOMMENDATION.md`

Relevant implementation files were inspected read-only, including:

- `apps/web/app/layout.tsx`
- `apps/web/app/globals.css`
- `apps/web/app/featureFlags.ts`
- `apps/web/app/_components/HeroMount.tsx`
- `apps/web/app/components/layout/Header.tsx`
- `apps/web/app/components/hero/v2/HeroRendererV2.tsx`
- `apps/web/app/components/hero/v2/HeroV2Client.tsx`
- `apps/web/app/page.tsx`
- `apps/web/app/treatments/[slug]/page.tsx`
- `packages/champagne-tokens/styles/champagne/theme.css`
- `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`

## Commands run

- `NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm run build:web` — passed, but identified as non-representative because production brand hero is disabled unless `NEXT_PUBLIC_FEATURE_BRAND_HERO` is true/1.
- `NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm run build:web` — passed.
- `PORT=3100 NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm --filter web start` — served the production build locally.
- `pnpm exec playwright install chromium` — installed Chromium after first launch failed due missing browser; first CDN endpoint returned 403 but fallback Microsoft endpoint succeeded.
- `pnpm exec playwright install-deps chromium` — installed missing OS browser dependencies; one unrelated `mise.jdx.dev` apt source returned 403, Ubuntu package sources succeeded.
- Playwright capture scripts in `/tmp` captured direct loads and Link-click transitions without modifying repository code.

## Key production evidence

1. With Hero V2 enabled, fresh production direct loads of all target routes had earliest observable hero-area pixels at root/body ink (`#222224`) before settling to the Hero V2 gradient/asset composite.
2. `html` and `body` computed backgrounds were stable ink; `main`, Hero V2 mount, Hero V2 renderer, and `hero.contentFrame` were transparent throughout.
3. `gradient.base` was present with opacity `1`, but the Hero V2 root/frame did not have its own base background. This makes the hero visually dependent on child layer compositing for first paint.
4. Production route paths were correct, and no hydration mismatch warnings were captured.
5. Route-specific Hero V2 identity remains unproven because debug state reported `hasModel: false` and undefined hero identity on all target routes, with identical general hero copy. This is not needed for the bounded flash fix and must remain out of scope.

## Comparison against previous diagnostic/deep-capture findings

| Previous finding | Production proof-gate result | Decision impact |
| --- | --- | --- |
| Root/body canvas is ink while page/hero descendants can be transparent. | Confirmed. `html`/`body` stayed ink; `main` and Hero V2 root stayed transparent. | Root/body exposure is now proven in production first-frame evidence. |
| Header/nav material is translucent ink. | Confirmed. Header background stayed translucent ink and nav samples stayed `#222224`. | Header is stable but not the dominant direct-load flash cause. |
| Hero V2 frame/base transparency may expose the wrong base before layers paint. | Confirmed. Earliest fresh frames sampled ink; hydrated frames sampled hero composite. | This is the smallest safe future fix target. |
| Dev capture had hydration warnings. | Not reproduced in production proof capture. | Hydration warnings do not block a narrow flash-surface fix. |
| Dev capture had route path confusion. | Browser path and HeroDebug pathname were correct in production. | Path plumbing is safer than before, but route identity/variant binding remains separate. |
| SPA transitions may flash. | Partially confirmed. Link-click transitions showed lower-intensity initial hero composite before settling, but not full root-only ink in accessible transitions. | Direct-load fix is safe; SPA filmstrip-grade proof can be repeated after the bounded fix. |

## Decision

Proceed next with **A. bounded safe fix mission**, limited to Hero V2 first-paint/base-surface stabilization. Do not proceed with nav, global background, token, Persian Midnight, typography, route identity, or hero variant implementation.

See also:

- `PRODUCTION_FIRST_FRAME_CAPTURE_MATRIX.md`
- `HYDRATION_AND_ROUTE_PATH_VALIDATION.md`
- `SPA_LINK_CLICK_FIRST_FRAME_EVIDENCE.md`
- `PROOF_GATE_ROOT_CAUSE_DECISION.md`
- `BOUNDED_FIX_SCOPE_IF_APPROVED.md`
- `NEXT_MISSION_RECOMMENDATION.md`
