# NEXT_MISSION_RECOMMENDATION

Mode: recommendation after deeper read-only diagnostic capture  
Evidence date: 2026-06-05

## Recommendation

Recommended next mission: **production-build first-frame + hydration/path validation capture**.

This is still not a visual fix mission.

## Why not a fix mission yet?

The deeper browser capture strengthened the mixed-surface hypothesis, but it also exposed two confounding issues that must be separated before a safe patch:

1. React hydration mismatch warnings appeared on treatment routes.
2. Local dev `HERO_BINDING_PROOF` logs reported `pathname: '/'` even for treatment URLs, so route-specific hero identity was not proven during this capture.

The computed styles were stable after `domcontentloaded`, but the reported issue is a flash. A safe later fix needs true first visual frame evidence and production-like route identity.

## Required next diagnostic capture

Run a production-build server with Hero V2/debug enabled and capture:

- `/`
- `/treatments/composite-bonding`
- `/treatments/teeth-whitening`

For each route, capture:

1. retained screenshot or pixel sample at the earliest possible visual frame;
2. screenshot or pixel sample after 1500ms;
3. computed styles for `html`, `body`, app wrapper, `main`, sticky wrapper, `header`, `nav`, Hero V2 mount/root/base, every `[data-surface-id]`, Hero content, and the outer page-builder surface around `[data-surface="porcelain"]`;
4. console warnings/errors;
5. `HERO_BINDING_PROOF`, `[HeroDebug]`, and hero truth logs;
6. network waterfall timing for app CSS and hero assets;
7. reduced-motion comparison;
8. true client-side Link-click transition if measurement can be made stable.

## Decision gate after next capture

Proceed to a bounded implementation mission only if one dominant cause is proven:

- root/main background visibly shows during first paint or route swap;
- header translucent material is the visible mismatch;
- Hero V2 frame/base transparency exposes the wrong base before layers paint;
- route identity is wrong and causes a home/treatment hero mismatch;
- hydration mismatch causes observable visual replacement.

If more than one remains plausible, do not patch visuals. Produce a narrower diagnostic packet.

## Safest likely future fix if proof confirms current ranking

If first-frame proof confirms Hero V2 base/root contract as dominant, authorize a one-file, token-only Hero V2 base-surface stabilization mission. Do not change global tokens, nav, typography, manifests, hero variants, or Persian Midnight.

## Guard requirement for any future implementation

Any future implementation mission must run:

- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`

Green build without those guards is not acceptable.
