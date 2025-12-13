# Static Layers Truth Report

## CSS variable bindings
- Wave background: `--hero-wave-background-desktop` and `--hero-wave-background-mobile` resolve to `url(...)` strings from either `path`, `asset.id`, or `id` fallbacks. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L131-L144】
- Wave mask: `--hero-wave-mask-desktop` / `--hero-wave-mask-mobile` are set via `path` or `asset.id` with `url(...)`. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L121-L130】
- Overlay rings/dots: `--hero-overlay-field` and `--hero-overlay-dots` each wrap `path` or `asset.id` in `url(...)`. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L145-L154】
- Particles: `--hero-particles` is populated with `url(...)` when particles are enabled and an asset/path exists. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L155-L159】
- Film grain: `--hero-grain-desktop` / `--hero-grain-mobile` use `url(...)` around desktop/mobile assets. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L160-L169】
- Additional opacity/blend variables: film grain and particles opacity plus wave backdrop opacity/blend are exposed as CSS vars for the surface stack. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L170-L176】

## Layer rendering and bindings
- Surface elements are rendered from `surfaceStack.map` as `<div>` nodes with `data-surface-id` and `data-surface-role`, inheriting per-token styles. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L346-L353】

- **field.waveBackdrop** (`data-surface-id` from manifest): style applies `maskImage/WebkitMaskImage: var(--hero-wave-mask-desktop)` plus no-repeat/cover/center. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L197-L208】 The injected CSS sets `background-image: var(--hero-wave-background-desktop)` with cover/center, blend, and opacity; mobile media queries swap to `var(--hero-wave-background-mobile)` and mask mobile. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L284-L318】

- **mask.waveHeader**: rendered with mixBlend/opacity only; no mask or background binding here, leaving it visually inert. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L209-L212】

- **field.waveRings**: uses `backgroundImage: var(--hero-overlay-field)` with no-repeat/cover/center and blend/opacity. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L213-L219】

- **field.dotGrid**: uses `backgroundImage: var(--hero-overlay-dots)` with the same repeat/size/position rules and blend/opacity. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L221-L227】

- **overlay.particles**: gated by `shouldShowParticles`, rendered with `backgroundImage: var(--hero-particles)` and matching repeat/size/position plus blend/opacity. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L87-L90】【F:reports/CURRENT_HeroRenderer.tsx.txt†L229-L235】

- **overlay.filmGrain**: gated by `shouldShowGrain` and rendered with `backgroundImage: var(--hero-grain-desktop)` (mobile CSS swaps to `var(--hero-grain-mobile)`) plus blend/opacity. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L84-L86】【F:reports/CURRENT_HeroRenderer.tsx.txt†L237-L243】【F:reports/CURRENT_HeroRenderer.tsx.txt†L320-L322】

- **Gradient base / caustics**: other layers retain gradient/caustics bindings, unaffected by static overlay vars. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L191-L245】

## Potential invalid CSS observations
- All image-like vars are wrapped in `url("...")`; if no asset/path/id exists the variable becomes `undefined`, yielding empty `var(--...)` resolutions at render time. 【F:reports/CURRENT_HeroRenderer.tsx.txt†L121-L169】
