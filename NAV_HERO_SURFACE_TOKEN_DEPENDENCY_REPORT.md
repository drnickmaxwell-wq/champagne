# NAV_HERO_SURFACE_TOKEN_DEPENDENCY_REPORT

Mode: repository-evidence-only audit. No implementation performed.

## Verdict

Navigation/header and hero depend on surface tokens in very different ways:

- Header/nav use `--bg-ink` directly and do not have a dedicated navigation surface token.
- Footer uses local footer variables plus legacy fallback chains and does not map to the canon-reserved `--surface-footer-emotion` token.
- Hero rendering has strong manifest/runtime surface governance, but surrounding hero CTA/debug surfaces reference undefined semantic tokens.

Readiness: `DEPENDENCIES_IDENTIFIED_NAV_NOT_ABSTRACTED_HERO_STACK_GOVERNED_WITH_ADJUNCT_DRIFT`.

## Header/navigation dependencies

File: `apps/web/app/components/layout/Header.tsx`.

Current behavior:

| UI part | Token dependency | Notes |
| --- | --- | --- |
| Header border | `color-mix(... var(--bg-ink) ...)` | Directly depends on active ink material. |
| Header background | `color-mix(... var(--bg-ink) ...)` | No `--surface-nav` abstraction. |
| Brand link text | `var(--text-high)` | Root text alias is ink text unless inside porcelain context. |
| Subtitle/nav text | `var(--text-medium)` | Root context. |
| Link hover background | `color-mix(... var(--bg-ink) ...)` | Direct dependency on ink. |
| Contact CTA border | `var(--border-subtle)` | Border token was designed around porcelain/ink mix. |

Dependency truth: changing `--bg-ink` will directly change header chrome and hover surfaces. There is no isolation layer for nav material decisions.

## Footer dependencies

Files:

- `apps/web/app/components/layout/Footer.tsx`
- `apps/web/app/components/layout/FooterLuxe.module.css`

Current behavior:

| UI part | Token dependency | Notes |
| --- | --- | --- |
| Footer root bg variable | `--smh-footer-bg: var(--smh-ink)` | Uses primitive/legacy ink, not `--bg-ink` or `--brand-ink`. |
| Particle layer | `--smh-footer-particles` URL | Asset-bound. |
| Rim | `--smh-footer-rim: var(--smh-accent-gold, var(--brand-gold))` | Brand gold dependency. |
| Footer CSS root | `background: var(--smh-footer-bg, var(--smh-ink))` | Local variable with fallback. |
| Footer overlay | `var(--smh-ink-soft, var(--smh-ink))` | `--smh-ink-soft` is not defined in current token CSS. |
| Footer text | `color-mix(... var(--smh-sand, var(--surface-0)) ...)` | `--smh-sand` not defined; falls back to porcelain. |
| Social hover text | `var(--smh-navy-900, var(--smh-ink))` | `--smh-navy-900` not defined. |

Dependency truth: footer is not using the canon-reserved `--surface-footer-emotion`; it has a local footer variable layer and unresolved legacy fallbacks.

## Hero renderer dependencies

File: `apps/web/app/components/hero/HeroRenderer.tsx`.

### Runtime acquisition

`HeroRenderer` calls `getHeroRuntime` with mode, treatment slug, PRM, time of day, particle/film controls, page category, and variant id. If runtime fails, it returns `HeroFallback`.

### Fallback surface

`HeroFallback` uses:

- `BaseChampagneSurface`
- `variant="inkGlass"`
- `disableInternalOverlays`
- `background: var(--smh-gradient)`
- text aliases `--text-medium`

Fallback truth: safe gradient, not Persian Midnight/porcelain. It is explicitly a loading/unavailable fallback.

### Normal hero surface stack

Normal render path:

- computes `gradient` from manifest surfaces or falls back to `var(--smh-gradient)`;
- resolves asset URLs for wave masks, wave backgrounds, overlay field/dots, particles, grain, and caustics;
- sets CSS variables on `.hero-surface-stack`;
- filters surface stack entries by suppression, PRM, duplicates, missing governance, video denylist, and motion activation;
- builds inline styles for canonical surface ids;
- disables layers with missing opacity/blend/z-index governance;
- produces dev debug payloads and computed-vs-manifest receipts.

### Hero layer CSS dependencies

File: `packages/champagne-tokens/styles/champagne/surface.css`.

| Layer | Token dependency |
| --- | --- |
| Gradient field | `--hero-gradient`, fallback `--smh-gradient`. |
| Wave backdrop | `--hero-wave-background-desktop/mobile`. |
| Wave mask | `--hero-wave-mask-desktop/mobile`. |
| Wave field | `--hero-overlay-field`. |
| Dot field | `--hero-overlay-dots`. |
| Particles | `--hero-particles`. |
| Film grain | `--hero-grain-desktop/mobile`, `--hero-film-grain-blend`. |
| Caustics/glass shimmer | `--hero-caustics-overlay`. |
| Gold dust | `--champagne-texture-gold-dust`, `--hero-gold-dust`. |
| Lighting | token-derived radial/linear gradients using `--smh-white`, `--accent-gold` fallback, and `--bg-ink`. |

## Hero adjunct token drift

Hero runtime stack is governed, but surrounding hero UI references undefined tokens:

| Token | References | Status |
| --- | --- | --- |
| `--surface-gold-soft` | `HeroRenderer.tsx`, `HeroRendererV2.tsx`, `ChampagneHeroFrame.tsx` | Not defined in token CSS. |
| `--surface-ink-soft` | `HeroRenderer.tsx`, hero debug/preview/lab, `HeroPreviewDebug.tsx` | Not defined in token CSS. |
| `--accentGold_soft` | diagnostic outline fallback | Not defined in token CSS. |
| `--surface-ink` | Hero asset lab / V2 / concierge | Not defined in token CSS. |

This means hero background governance is stronger than hero control/CTA semantic token governance.

## Hero frame legacy/fallback dependencies

File: `packages/champagne-hero/src/ChampagneHeroFrame.tsx`.

`ChampagneHeroFrame` derives backgrounds from preset layers or hero type. When no preset layer exists, it uses inline token-derived gradients. This file is not the sacred render entry, but it remains a surface dependency because it can render hero-like frames and CTA surfaces.

Notable dependencies:

- `--champagne-keyline-gold`
- `--bg-ink`
- `--bg-ink-soft`
- `--smh-gradient-legacy`
- `--surface-gold-soft` (undefined)

## Nav/hero dependency risks

1. A Persian Midnight change to `--bg-ink` affects header immediately.
2. Footer may not follow Persian Midnight if only `--bg-ink`/`--brand-ink` changes, because footer pins `--smh-ink` locally.
3. Hero background stack may remain correct, but CTAs/debug panels can drift because they reference undefined tokens.
4. Navigation has no independent opacity/elevation/frosted semantic surface token.
5. Footer has no mapping to `--surface-footer-emotion`, despite canon reserving that meaning.
6. Hero layer CSS has token-derived gradient literals in token source, which is allowed, but lighting depends on `--accent-gold` fallback even though only brand gold tokens are implemented.

## Decision dependencies for future pack

Before final surface-token decisions, future agents need answers to:

1. Should header get `--surface-nav` / `--surface-header`?
2. Should footer root variable map to `--surface-footer-emotion`?
3. Should `--surface-footer-emotion` map to Persian Midnight, a separate emotional slab, or a derived footer material?
4. Should hero CTA tokens become explicit semantic tokens or use existing brand/keyline tokens?
5. Should hero frame fallback gradients remain inline token-derived gradients, or be moved into tokens/manifests?

## Final dependency verdict

`NAV_AND_FOOTER_REQUIRE_SEMANTIC_TOKEN_ABSTRACTION_BEFORE_GLOBAL_DARK_MATERIAL_CHANGE`.

`HERO_BACKGROUND_STACK_IS_READY_FOR_AUDITED_DEPENDENCY_DECISIONS_BUT_HERO_ADJUNCT_TOKENS_NEED_DEFINITION_OR_REMOVAL`.
