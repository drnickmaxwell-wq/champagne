# CURRENT_BACKGROUND_SURFACE_STATUS

Mode: `READ_ONLY_BACKGROUND_SURFACE_STATUS_AUDIT`  
Evidence date: 2026-06-05

## Executive verdict

The active app/page background currently appears to be a mixed system:

- Global root/body background: ink context via `background: var(--bg-ink)`.
- Active `--bg-ink` after theme import: `var(--brand-ink)`.
- `--brand-ink`: derived `--smh-ink-navy`, a candidate dark material mixed from primitive ink plus brand teal/magenta influence.
- Treatment page content wrapper: porcelain surface context via `BaseChampagneSurface` style `backgroundColor: var(--surface-1)` and child `data-surface="porcelain"`.
- Header/nav: translucent mixes of `--bg-ink`, with no dedicated nav-surface token.
- Hero: separate manifest/runtime-governed surface stack layered above a transparent/supporting page background in some paths.

Status: `MIXED_INK_ROOT_WITH_PORCELAIN_CONTENT_CONTEXT_AND_HERO_SURFACE_STACK`.

## Active app/page background token or CSS value

### Global CSS

`apps/web/app/globals.css` imports the Champagne theme and applies:

```css
html,
body {
  background: var(--bg-ink);
  color: var(--text-high);
}
```

### Theme binding

`packages/champagne-tokens/styles/champagne/theme.css` imports token/theme layers and sets root defaults:

```css
:root {
  --bg-ink: var(--brand-ink);
  color: var(--text-high);
  background: var(--bg-ink);
}

body,
.champagne-page {
  background: var(--bg-ink);
  color: var(--text-high);
}
```

### Token definition chain

`packages/champagne-tokens/styles/champagne/tokens.css` defines:

- `--smh-ink-navy` as a color mix using primitive ink, brand teal, and brand magenta.
- `--brand-ink: var(--smh-ink-navy)`.
- `--bg-ink: var(--ink-100)` initially.
- `--surface-0`, `--surface-1`, and `--surface-2` as porcelain ladder tokens.

Because `theme.css` imports `tokens.css` and then later sets `--bg-ink: var(--brand-ink)` in `:root`, the active root `--bg-ink` should resolve to the derived `--brand-ink`, not the initial `--ink-100`, assuming normal CSS import order.

## Ink, Persian Midnight, porcelain, or mixed?

### Ink

Yes. The global app canvas is ink-context because both `globals.css` and `theme.css` set body/root backgrounds to `var(--bg-ink)`.

### Persian Midnight

Not proven. The design canon requires Persian Midnight Velvet Blue as the primary dark material, and the current `--brand-ink` is the closest implemented candidate. However, no explicit `--persian-midnight`, `--persian-midnight-velvet`, or accepted mapping contract was found. Therefore the current background should be described as `derived ink candidate for Persian Midnight`, not confirmed Persian Midnight.

### Porcelain

Yes, but not as the global body background. Porcelain is active inside content/page builder contexts. `ChampagnePageBuilder` sets `BaseChampagneSurface` to `backgroundColor: var(--surface-1)` and wraps rendered content in `data-surface="porcelain"`, which also switches text aliases to porcelain context through `theme.css`.

### Mixed

Yes. Current pages can contain:

- ink root/body behind everything;
- sticky header bound to ink mixes;
- hero surface stack with manifest-driven background/fx layers;
- porcelain builder/content surface;
- footer-specific local surface variables.

## Where values are defined

| Layer | File | Evidence summary |
| --- | --- | --- |
| Theme import + global body/html binding | `apps/web/app/globals.css` | Imports theme and sets `html, body` background to `var(--bg-ink)`. |
| Root `--bg-ink` active binding | `packages/champagne-tokens/styles/champagne/theme.css` | Sets `--bg-ink: var(--brand-ink)` and body background to `var(--bg-ink)`. |
| Derived dark candidate | `packages/champagne-tokens/styles/champagne/tokens.css` | Defines `--smh-ink-navy`, `--brand-ink`, and initial `--bg-ink`. |
| Primitive brand/dark anchors | `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css` | Defines primitive chroma and ink anchors. |
| Porcelain ladder | `packages/champagne-tokens/styles/champagne/tokens.css` | Defines `--surface-0/1/2`. |
| Porcelain text context | `packages/champagne-tokens/styles/champagne/theme.css` | Switches `--text-high/medium/low` inside porcelain data attributes. |
| Treatment page porcelain wrapper | `apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx` | Uses `BaseChampagneSurface` with `backgroundColor: var(--surface-1)` and `data-surface="porcelain"`. |
| Header/nav surface | `apps/web/app/components/layout/Header.tsx` | Uses `color-mix(... var(--bg-ink) ...)` for background/border/hover. |
| Hero surface | `apps/web/app/_components/HeroMount.tsx` + hero renderer/runtime/manifests | V1/V2 hero path selected by environment and rendered from manifest/runtime surfaces. |

## Multiple competing sources?

Yes, but they are partly layered rather than direct duplicates:

1. `tokens.css` initially sets `--bg-ink: var(--ink-100)`.
2. `theme.css` overrides `--bg-ink: var(--brand-ink)` at root.
3. `globals.css` also sets body/html background to `var(--bg-ink)` after importing theme.
4. Header uses `--bg-ink` directly rather than a nav-specific semantic token.
5. Footer uses local `--smh-footer-*` variables and fallback chains per prior audits.
6. Some semantic surface names (`--surface-ink`, `--surface-footer-emotion`, `--surface-ink-soft`, `--surface-gold-soft`) are referenced in reports/runtime surfaces but are not fully defined in current token CSS.

## Would changing it now risk instability?

Yes. Changing `--bg-ink`, `--brand-ink`, or root background now would affect multiple systems at once:

- global first paint/body canvas;
- header/nav background and hover states;
- hero transparent/first-paint surroundings;
- contrast aliases in ink context;
- footer divergence if not aligned;
- any color-mix consumers of `--bg-ink`;
- flash diagnostics that currently depend on knowing body/main/below-hero backgrounds.

Changing the background before a runtime proof would risk misdiagnosing nav/hero/background flash as a colour decision problem. The next step should be diagnostic: capture computed body/header/main/hero/builder/footer backgrounds on representative routes before implementation.

## Safe status label

`ACTIVE_BACKGROUND_IS_DERIVED_INK_ROOT_NOT_CONFIRMED_PERSIAN_MIDNIGHT_WITH_PORCELAIN_CONTENT_CONTEXTS`.
