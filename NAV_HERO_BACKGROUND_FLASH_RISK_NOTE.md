# NAV_HERO_BACKGROUND_FLASH_RISK_NOTE

Mode: `READ_ONLY_FLASH_RISK_NOTE`  
Evidence date: 2026-06-05

## Executive verdict

Current flash risk is likely multi-system, not a single colour-token issue. The likely systems are:

1. global root/body `--bg-ink` background;
2. sticky header/nav translucent `--bg-ink` surface;
3. hero engine selection and hero surface stack;
4. route/path/header-derived pathname resolution;
5. CSS import/load order and first paint;
6. porcelain builder/content wrapper appearing after ink/hero surfaces;
7. PRM/motion/governance suppression in hero layers.

Do not implement Persian Midnight, hero variants, nav fixes, or background changes until a diagnostic capture proves which layer flashes and when.

## Systems likely involved

### Background token mismatch

Risk: medium/high.

- The root/body background is `var(--bg-ink)`.
- `--bg-ink` is defined once in `tokens.css` as `var(--ink-100)` and then overridden in `theme.css` as `var(--brand-ink)`.
- Header/nav and body both consume `--bg-ink`, so a mismatch or load-order delay could appear as dark-material flash.
- The current value is not explicitly named Persian Midnight, so agents may incorrectly assume a final material decision has already happened.

### Hero fallback / transparent hero dependence

Risk: high.

- Prior flash analysis notes transparent hero root/surface dependence on surrounding page/body/main backgrounds.
- Hero rendering can legitimately suppress layers when governance or PRM conditions are not met.
- Hero engine selection depends on `NEXT_PUBLIC_HERO_ENGINE`; V2 only runs when normalized to `v2`.
- If hero first paint is transparent or missing a layer, the body/header/builder background can show through.

### Nav surface

Risk: high.

- Header background and border use `color-mix(... var(--bg-ink) ...)` directly.
- Nav hover states also use `--bg-ink` mixes.
- There is no dedicated `--surface-nav` or `--surface-header` abstraction, so root dark-material experiments immediately alter nav chrome and any flash perception.

### Hydration/routing/pathname

Risk: medium.

- Root layout derives the pathname from `headers().get("next-url")` and uses it to choose public-page/category/treatment hero parameters.
- `HeroMount` in V2 also derives pathname from headers.
- If headers/pathname differ between server/request contexts, hero binding or category could be wrong during initial render.
- Treatment page routing resolves aliases and can redirect before rendering; alias/canonical transitions should be ruled out when testing.

### CSS load order

Risk: medium.

- `globals.css` imports theme CSS, and theme CSS imports multiple token layers.
- Root/body backgrounds are repeated in both theme and globals.
- Normal CSS order should make theme root `--bg-ink: var(--brand-ink)` active, but first-paint proof should verify computed values, not infer them.

## What must be audited before implementation

Minimum diagnostic set per suspect route:

1. Route path and canonical path.
2. `NEXT_PUBLIC_HERO_ENGINE` value and normalized engine path.
3. Whether `HeroMount` rendered V1 or V2.
4. Hero manifest ID, preset, variant, and route binding.
5. PRM/reduced-motion state.
6. Surface IDs rendered and suppressed.
7. Opacity/blend/z-index for hero background/fx layers.
8. Computed `background-color` and `background-image` for `html`, `body`, root flex wrapper, sticky header, `main`, hero root, builder wrapper, first porcelain section, and footer.
9. CSS custom properties for `--bg-ink`, `--brand-ink`, `--surface-0`, `--surface-1`, `--surface-2`, `--surface-glass`, and any referenced `--surface-ink*` tokens.
10. Paint timeline or screenshot sequence: first paint, hero-ready, steady state.
11. Console warnings for missing assets, hydration mismatch, or undefined custom properties if available.
12. Network status for hero image/video assets.

Minimum route set:

- `/`
- `/treatments/composite-bonding`
- `/treatments`
- one non-treatment utility page such as `/contact`

## Safe diagnostic recommendation

Next mission should be `NAV_HERO_BACKGROUND_FLASH_DIAGNOSTIC_CAPTURE_V1`.

It should be read-mostly, with screenshots and DOM/computed-style exports only. It should not change tokens, hero, nav, typography, or layout. Its output should identify whether the flash is:

- root/background token mismatch;
- nav surface mismatch;
- hero transparent/fallback/suppressed layer;
- hydration/routing mismatch;
- CSS import/load-order issue;
- asset/video load delay;
- porcelain wrapper transition/contrast issue;
- or a combination.

## Unsafe next actions

Do not do any of the following before diagnostic proof:

- rename or tune `--bg-ink` / `--brand-ink`;
- add a Persian Midnight token;
- alter `Header.tsx` or header CSS;
- alter sacred hero renderer/runtime/manifests;
- add hero variants;
- change global layout/body/main backgrounds;
- change fonts/typography;
- force hero visibility or bypass PRM/governance.
