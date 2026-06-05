# NAV_HERO_BACKGROUND_FLASH_DIAGNOSTIC_REPORT

Role: `NAV_HERO_BACKGROUND_FLASH_DIAGNOSTIC_CAPTURE_DIRECTOR`  
Mode: read-only diagnostic capture plus documentation-only evidence output  
Evidence date: 2026-06-05

## Executive verdict

The nav/hero/background flash risk is most likely a **mixed-surface first-paint problem** amplified by **hero model/route timing and client motion/content fade behavior**.

The repository currently layers:

1. an ink root/body canvas via `--bg-ink`;
2. a sticky translucent header/nav that samples `--bg-ink` directly;
3. a global `<main>` with no explicit background, padding around hero/content, and server-rendered route/category hero mounting;
4. a Hero V2 surface stack whose frame has no explicit base background in the injected CSS, whose `gradient.base` layer only receives z-index in the V2 model, and whose fallback uses `--smh-gradient`;
5. porcelain page-builder content immediately after the hero via `BaseChampagneSurface` with `backgroundColor: var(--surface-1)`.

That means first paint and route changes can briefly expose a different surface than steady-state: ink behind root/main/header, hero stack once assets/model resolve, then porcelain content below hero.

## Most likely root-cause candidates

| Candidate | Likelihood | Confidence | Evidence summary |
| --- | --- | --- | --- |
| Root/background mismatch between ink root and porcelain content | High | High | `html`, `body`, `:root`, and `.champagne-page` are ink; page builder content is porcelain `--surface-1`. |
| Header/nav surface mismatch | Medium-high | High | Header is sticky over hero and uses translucent `color-mix(... var(--bg-ink) ... transparent)` rather than a dedicated nav surface token. |
| Hero fallback/base mismatch | Medium-high | Medium | Hero V2 fallback uses `var(--smh-gradient)` and frame CSS lacks an explicit base background; V2 `gradient.base` style only sets z-index. |
| Route-level surface mismatch during navigation | Medium-high | Medium | Root layout derives pathname from request header and mounts one global hero before route children; most public routes render `ChampagnePageBuilder` immediately after hero. |
| Motion/content fade timing | Medium | High | V2 content fades to opacity 0 for one animation frame on pathname changes; media layers use `preload="metadata"`, ready events, and opacity transitions. |
| CSS load order | Medium | Medium | Tailwind directives precede the theme import in `globals.css`; root/background is declared in both imported theme and `globals.css`. No failing guard proves breakage. |
| Hydration mismatch | Medium | Low-medium | V2 has a client fallback and cached client model path, while `HeroMount` builds a server model. No runtime browser trace was captured in this mission. |
| Font loading/layout shift | Low-medium | Medium | Typography audit found no active `next/font`, `@font-face`, external font stylesheet, or preload evidence; missing webfont load makes custom font flash less likely than surface flash. |

## Evidence for each candidate

### 1. Root/background mismatch

- `globals.css` imports the Champagne theme, then sets `html, body` to `background: var(--bg-ink)` and `color: var(--text-high)`.
- `theme.css` imports token layers, sets `:root { --bg-ink: var(--brand-ink); ... background: var(--bg-ink); }`, and also sets `body, .champagne-page { background: var(--bg-ink); }`.
- `tokens.css` initially defines `--bg-ink: var(--ink-100)`, then `theme.css` rebinds active root `--bg-ink` to `--brand-ink`.
- `ChampagnePageBuilder` wraps route content in `BaseChampagneSurface` with `backgroundColor: var(--surface-1)` and a child `data-surface="porcelain"`.

Assessment: the app is intentionally mixed: ink shell/root plus porcelain content. A flash can occur when the hero or page builder has not painted, or during route replacement.

### 2. Header/nav surface mismatch

- `Header.tsx` sets header border and background with `color-mix(in srgb, var(--bg-ink) ..., transparent)`.
- Header links use hover backgrounds based on the same direct `--bg-ink` color mix.
- There is no route-aware or hero-aware nav surface contract visible in the header file.

Assessment: the sticky nav can visually read as an ink translucent slab above a hero and porcelain content. If the hero or below-hero surface changes during navigation, the nav does not change in a coordinated way.

### 3. Hero V2 base/fallback mismatch

- `HeroFallback()` in V2 uses `BaseChampagneSurface variant="inkGlass"` and `background: var(--smh-gradient)`.
- The injected `.hero-renderer-v2` CSS sets layout, color, containment, and overflow, but no explicit base `background`.
- `buildHeroV2Model.ts` assigns `gradient.base` only `zIndex`, while actual background image variables are assigned to other layers such as `field.waveBackdrop`, `field.waveRings`, `field.dotGrid`, particles, and grain.
- V2 content frame is explicitly transparent.

Assessment: if surface assets are slow, disabled, filtered, or the model is unavailable and fallback appears, the visual base can jump from root ink to gradient/fx stack to porcelain below.

### 4. Route-level surface mismatch

- `RootLayout` computes pathname from `headers().get("next-url")`, classifies page category, renders a sticky header, then renders `<main className="flex-1 px-6 py-10">`.
- For public pages with brand hero enabled, `HeroMount` is mounted before route children.
- Many route files render `ChampagnePageBuilder`, whose first surface is porcelain.

Assessment: route transitions likely replace hero identity and content beneath a stable root/header. The root remains ink; the new page-builder surface is porcelain; the hero stack has its own rendering timeline.

### 5. Motion/content fade timing

- Hero V2 media layers use `preload="metadata"`, `data-ready="false"`, and ready handlers that only flip readiness after media events.
- Hero V2 content fade sets opacity to 0 on route/path changes and restores it on the next animation frame, with a 220ms opacity transition.
- V2 debug tooling already logs background sources, surface data, content visibility, media events, and route/nav state when debug flags are used.

Assessment: not necessarily a bug by itself, but it can make a surface mismatch perceptible as a flash.

### 6. CSS load order

- `globals.css` places Tailwind directives before the Champagne theme import.
- Both imported `theme.css` and `globals.css` declare root/body background roles.
- Guards and build passed; no direct evidence proves CSS load order failure. The risk is first-paint ordering or duplicate source confusion, not confirmed invalid CSS.

### 7. Hydration mismatch

- `HeroMount` can server-build a V2 model and pass it into `HeroV2Frame`.
- `HeroRendererV2` also contains client-side model cache/fallback paths.
- No Playwright/browser runtime trace was captured in this pass, so hydration mismatch remains a candidate rather than a proven root cause.

### 8. Font loading/layout shift

- Current repo evidence says typography uses CSS font-family stacks but no active font loading infrastructure.
- That reduces likelihood of a webfont-driven flash; layout shifts from fallback/system fonts may still exist if local fonts differ, but this is not the primary surface-flash candidate.

## Missing evidence

This pass did not capture live browser screenshots or console traces. Missing evidence for a future mission:

1. first-frame and steady-state screenshots for `/`, `/about`, `/blog`, `/contact`, `/treatments`, and representative treatment routes with `NEXT_PUBLIC_HERO_ENGINE=v2`;
2. browser console output with `?heroDebug=1&heroTruth=1&bloomDebug=1`;
3. computed `backgroundColor`/`backgroundImage` for `html`, `body`, `main`, header, hero root, each hero surface, and first below-hero element at first animation frame and after 1500ms;
4. network timing for CSS and hero background/motion assets;
5. hydration warnings, if any, from browser console;
6. route-transition capture using client-side nav clicks rather than direct page loads;
7. PRM on/off comparison.

## What must not be changed yet

Do not change code, tokens, hero engine, sacred manifests, header/nav implementation, global CSS, typography, motion timing, or any final color/material selection during this diagnostic phase.

Specific no-touch areas for a later mission unless explicitly authorized:

- sacred hero runtime/config/manifest files;
- `apps/web/app/components/hero/HeroRenderer.tsx` unless fresh sacred authority exists;
- `apps/web/app/globals.css` and `apps/web/app/layout.tsx` unless an explicit override is issued;
- token definitions or theme binding without a bounded token-authorized mission;
- header/nav visual behavior without a header/nav-authorized mission.

## Safest future fix path

The safest future path is not a redesign. It is a bounded stabilization plan after one live proof pass:

1. capture first-paint and route-transition evidence with existing V2 debug hooks;
2. choose one minimal contract to stabilize first paint, likely a single root/hero/nav surface contract rather than multiple component edits;
3. preserve token-only styling and guard visibility;
4. avoid changing hero semantics, asset selection, motion governance, copy, layout, or typography;
5. run `npm run guard:hero`, `npm run guard:canon`, and `npm run verify` after any future implementation.

## Commands run

- `pwd && rg --files -g 'AGENTS.md' -g '!node_modules' -g '!**/.next/**'`
- `sed -n '1,260p' AGENTS.md`
- `find . -maxdepth 3 -type f ...`
- `sed -n ...` against the requested status/audit documents and relevant files
- `rg -n ...` for surface/background/nav/hero/fallback/motion/font patterns
- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`
- `git status --short`

## Guard/check status

- `npm run guard:hero`: PASS.
- `npm run guard:canon`: PASS with environment/tooling warnings from Browserslist and Tailwind content pattern.
- `npm run verify`: PASS with warnings already emitted by subcommands: npm unknown env config, token-source literal allowance output, workspace legacy dependency warnings, SEO launch safety warnings, Browserslist age warning, Tailwind content pattern warning, missing chatbot QA report warning, and Next ESLint migration/plugin warnings.
