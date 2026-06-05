# HERO_V2_ROUTE_LIFECYCLE_TRACE

Role: `HERO_V2_NAVIGATION_FLASH_FAILURE_RESPONSE_DIRECTOR`  
Evidence date: 2026-06-05

## Route/lifecycle topology

## 1. Root layout placement

`apps/web/app/layout.tsx` renders the sacred/public hero globally in the root layout, before route children:

- reads `next-url` from `headers()`;
- computes `isPublicPage`, `isHeroEnabled`, `pathname`, `pageCategory`, `mode`, and `treatmentSlug`;
- renders `<HeroMount ... />` inside `<main>` when public and enabled;
- renders `{children}` after the hero.

This means the intended architecture appears to be a global hero above page content, not page-local builder hero output. However, because the root layout is dynamic (`headers()`), production navigation behavior must be verified rather than assumed.

## 2. Page templates

The home page and treatment pages render `ChampagnePageBuilder` as route content. `ChampagnePageBuilder` has `shouldRenderBuilderHero = previewMode === true`, so normal public pages do not render an additional builder hero. The sacred/public hero observed on every page is therefore coming from root layout + `HeroMount`, not from every page body independently.

## 3. HeroMount server path

`HeroMount` is an async server component. In V2 mode it:

- normalizes `NEXT_PUBLIC_HERO_ENGINE`;
- reads `next-url` from request headers;
- derives `pathname` and optional debug query state;
- imports V2 renderer/build modules;
- calls `buildHeroV2Model` with `pageSlugOrPath: pathname`;
- renders a wrapper with `data-hero-engine="v2"`;
- if a model exists, renders `HeroV2Frame` + `HeroSurfaceStackV2` + `HeroContentFade` directly;
- otherwise falls back to the client `HeroRendererV2` path.

The dominant path in production evidence appears to be the server-built frame path.

## 4. Client path fallback

`HeroRendererV2` is a client component fallback that uses `usePathname()` and a per-path `heroV2ModelCache`. This path has route-aware model rebuilding and a `lastResolvedHeroV2Model` memory cache. That fallback path is not the normal path when `HeroMount` successfully builds the model server-side.

## 5. React key observations

No explicit route key was found on `HeroMount`, `HeroV2Frame`, or `HeroSurfaceStackV2` in the inspected path. Surface layers use `key={layer.id}` and motion layers use `key={entry.id}`. Those keys are stable only within a persistent parent. They do not prevent reset if the entire stack parent is replaced.

## 6. Captured stack lifecycle evidence

The browser capture sampled `data-v2-stack-instance`, which is generated from `Math.random()` in `HeroSurfaceStackV2` at component mount.

| Transition | Before stack | After stack | Conclusion |
| --- | --- | --- | --- |
| `/` → `/treatments` | `v2-stack-bmaim9rt` | `v2-stack-12ppn9wd` | New stack mounted. |
| `/treatments` → `/treatments/composite-bonding` | `v2-stack-rr6q1vz5` | `v2-stack-6ql16e0r` | New stack mounted. |
| `/treatments/composite-bonding` → `/` | `v2-stack-76a941jw` | `v2-stack-dl9b9di7` | New stack mounted. |

The random stack id changes are direct evidence that the surface stack did not remain persistent across captured navigations.

## 7. Navigation mode evidence

Captured console logs reported:

- `[HERO_DIAG_NAV] href=/treatments defaultPrevented=false`
- `[HERO_DIAG_NAV] href=/treatments/composite-bonding defaultPrevented=false`
- `[HERO_DIAG_NAV] href=/ defaultPrevented=false`

The capture also saw `Execution context was destroyed` immediately after click attempts. This is consistent with document/context replacement. It is not enough to conclude that all Vercel preview navigations are always hard reloads, but it is sufficient to treat navigation lifecycle as the leading failure class.

## 8. Route identity observations

`HeroMount` only attaches `data-hero-pathname-key`, `data-hero-identity-key`, and `data-hero-has-model` when `heroDebugEnabled` is true on the server-derived request URL. In the local click capture, those mount data attributes were `null` after route clicks because the target hrefs did not preserve `?heroDebug=1&heroTruth=1`.

That limits post-click route identity proof. It does not change the stack reset finding, because the stack instance and media currentTime are available independently of those attributes.

## Lifecycle conclusion

Hero V2 is structurally placed in the root layout, but captured route navigation still replaced/recreated the Hero V2 surface stack and restarted its media layers. The next mission should treat “persistent in source placement” and “persistent in user-visible navigation lifecycle” as different questions.
