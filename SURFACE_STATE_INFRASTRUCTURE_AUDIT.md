# SURFACE_STATE_INFRASTRUCTURE_AUDIT

Mode: repository-evidence-only audit. No implementation performed.

## Verdict

Surface-state infrastructure exists as static semantic surface binding plus hero surface-stack resolution. A generalized surface-state switching system does not exist.

## Implemented surface foundations

### Canon surface contract

Repository instructions and canons define a semantic surface contract:

- `--surface-0`: base porcelain canvas.
- `--surface-1`: elevated porcelain.
- `--surface-2`: highest porcelain elevation.
- `--surface-glass`: translucent glass.
- `--surface-ink`: dark ink surfaces.
- `--surface-footer-emotion`: reserved footer emotional slab.

The root AGENTS instructions also state hard rules: glass is not default cards, ink is not porcelain replacement, and footer emotion is not body content.

### Token implementation

`packages/champagne-tokens/styles/champagne/tokens.css` implements the porcelain ladder with `--surface-0`, `--surface-1`, and `--surface-2`, glass variables with `--surface-glass` and `--surface-glass-deep`, `--border-subtle`, `--shadow-soft`, and text tokens for porcelain and ink contexts.

`theme.css` sets default root ink context and switches text tokens inside `[data-surface-tone='porcelain']` or `[data-surface='porcelain']`.

### Runtime/static usage

`ChampagnePageBuilder.tsx` wraps builder content in `BaseChampagneSurface` and sets a child `div` with `data-surface="porcelain"`.

`SectionShell.tsx` sets `data-surface="porcelain"` on section shells and uses a dynamic Tailwind arbitrary variable background based on the `background` prop.

Section components audited by token-purity passes use semantic surface tokens directly, e.g. `var(--surface-1)`, `var(--surface-2)`, `var(--border-subtle)`, and text tokens.

### Hero surface stack

Hero surface-state is more developed than page surface-state. The sacred hero surface manifest defines a stack of gradient, wave, dot, caustics, shimmer, particles, film grain, lighting, and content-frame layers. Runtime combines base, weather, and variant surface tokens, maps them to assets, resolves assets, applies PRM filtering, and filters by allowed surfaces.

## Not implemented

No evidence was found for:

- `surfaceState` runtime object.
- App-level surface-state provider.
- Route-level surface-tone manifest.
- Environmental surface switching.
- Page sections switching between porcelain/ink/glass based on time, mood, or lighting.
- Surface-state reducer/state machine.
- Seasonal surface state.
- Day/night page surface switching outside hero preview/runtime.

## Surface-state truth table

| Capability | Status | Notes |
| --- | --- | --- |
| Semantic surface tokens | Exists | Porcelain/glass/text/border/shadow tokens are implemented. |
| Static porcelain binding | Exists | Builder and SectionShell set `data-surface="porcelain"`. |
| Static porcelain text-context override | Exists | `theme.css` handles porcelain data attributes. |
| Hero surface-stack resolution | Exists | Runtime combines base/weather/variant surfaces and resolves assets. |
| Generalized surface-state switching | Not found | No provider or state object discovered. |
| Time-of-day page surface switching | Not found | Only hero runtime and minimal root CSS selectors. |
| Seasonal surface switching | Not found | No seasonal infrastructure. |
| Ink/porcelain dependency separation | Partial | Tokens/canon exist; static body default is ink, content wrappers are porcelain. |

## Risks

1. The phrase “surface system” can mean two different implemented things: static page semantic tokens or sacred hero surface stack. They are not unified.
2. `data-surface-tone='porcelain'` is supported by CSS, but repository search found current runtime usage primarily as `data-surface="porcelain"`.
3. Static porcelain wrappers do not constitute atmospheric state switching.
4. Hero surface switching is real, but only inside sacred hero runtime/rendering boundaries.

## Conclusion

Surface-state readiness is `STATIC_FOUNDATION_PLUS_HERO_STACK`. The repo has enough token and attribute substrate to build a state system later, but no generalized surface-state orchestrator currently exists.
