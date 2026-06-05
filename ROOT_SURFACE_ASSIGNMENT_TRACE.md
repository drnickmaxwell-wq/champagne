# ROOT_SURFACE_ASSIGNMENT_TRACE

Mode: read-only trace  
Evidence date: 2026-06-05

## Root assignment chain

| Order | File | Assignment | Diagnostic meaning |
| --- | --- | --- | --- |
| 1 | `apps/web/app/layout.tsx` | Imports `./globals.css`; renders `<body className="min-h-screen antialiased">`; wraps app in `flex min-h-screen flex-col`; renders `main` with `flex-1 px-6 py-10`. | Root and body styles depend on global CSS; `main` has spacing but no explicit background token. |
| 2 | `apps/web/app/globals.css` | Tailwind base/components/utilities, then imports Champagne theme; sets `html, body` background to `var(--bg-ink)` and color to `var(--text-high)`. | First app canvas is ink-context through `--bg-ink`. |
| 3 | `packages/champagne-tokens/styles/champagne/theme.css` | Imports tokens/gradients/layers/glass/typography/spacing/time-of-day/surface; sets `:root --bg-ink: var(--brand-ink)` and root background to `var(--bg-ink)`. | Active root background is brand ink after theme binding. |
| 4 | `packages/champagne-tokens/styles/champagne/tokens.css` | Defines `--smh-ink-navy`, `--brand-ink`, initial `--bg-ink: var(--ink-100)`, porcelain surfaces `--surface-0/1/2`, glass surfaces, text aliases. | Root has an initial `--bg-ink` in tokens, then theme rebinds it to `--brand-ink`. |
| 5 | `apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx` | Uses `surfaceStyle` with `backgroundColor: var(--surface-1)` and child `data-surface="porcelain"`. | Most public page content starts a porcelain context after the global hero. |

## Observed state

Current root surface state is:

`html/body/:root = ink` → `main = transparent/no explicit background` → `HeroMount/Hero V2 stack = separate hero surfaces` → `ChampagnePageBuilder = porcelain surface-1`.

## Flash implications

1. If hero stack is transparent, slow, suppressed, or temporarily absent, `main` and root/body ink can show through.
2. When content below hero paints, it is porcelain, so below-hero area can contrast sharply against root/header ink.
3. If CSS import or streaming order delays theme variable application, `--bg-ink` resolution can change from initial token intent to active theme binding.
4. No evidence in this pass proves that CSS load order is failing; the risk is due to multiple valid surface layers with different semantics.

## Missing evidence

A live trace should record computed styles for `document.documentElement`, `body`, `main`, `[data-hero-engine]`, `[data-hero-root="true"]`, `.hero-surface-stack`, the first `[data-surface="porcelain"]`, and header at first frame and after 1500ms.
