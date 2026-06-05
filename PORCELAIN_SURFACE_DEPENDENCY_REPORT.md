# PORCELAIN_SURFACE_DEPENDENCY_REPORT

Mode: repository-evidence-only audit. No implementation performed.

## Verdict

Porcelain surface dependencies already exist across canon, tokens, app wrappers, and section styling. They are materially more implemented than Persian Midnight calibration, though they remain static rather than state-driven.

## Canon truth

The material canon defines porcelain as the primary calm and readable light material. It is intended for patient understanding, clinical readability, treatment information, forms, cards, review panels, and accessible long-form reading. It must not become stark white, hospital white, generic SaaS white, or low-contrast cream.

The semantic surface contract in repository instructions treats `--surface-0`, `--surface-1`, and `--surface-2` as the porcelain ladder for base canvas, elevated surfaces, and highest elevation.

## Implemented token dependencies

`packages/champagne-tokens/styles/champagne/tokens.css` defines:

- `--surface-0`
- `--surface-1`
- `--surface-2`
- `--border-subtle`
- `--shadow-soft`
- `--text-porcelain-high`
- `--text-porcelain-medium`
- `--text-porcelain-low`

`theme.css` applies porcelain text overrides inside `[data-surface-tone='porcelain']` and `[data-surface='porcelain']`.

## App/runtime dependencies

`ChampagnePageBuilder.tsx` uses a static builder surface style with border, background color `var(--surface-1)`, no background image, no shadow, and a child wrapper with `data-surface="porcelain"`.

`SectionShell.tsx` sets `data-surface="porcelain"` on section elements. The shell supports a `background` prop that maps to `bg-[var(--...)]`, but it does not implement a state machine.

Many section components already reference porcelain ladder and semantic tokens directly as part of previous token-purity passes.

## Hero relationship

Porcelain is not the default sacred hero surface; the sacred hero defaults to night/cinematic atmosphere. Porcelain appears in hero copy and treatment content, and canon allows porcelain-clear materials for time-of-day states, but the current sacred hero runtime is primarily an ink/cinematic stack.

## Direct dependencies found

| Dependency type | Evidence |
| --- | --- |
| Canon material target | Porcelain material section in material canon. |
| Semantic ladder | `--surface-0/1/2` tokens. |
| Text context | `--text-porcelain-*` tokens and theme override. |
| Static runtime attribute | `data-surface="porcelain"` in builder and SectionShell. |
| Component styling | Section files use `var(--surface-*)`, `var(--border-subtle)`, `var(--shadow-soft)`, and text tokens. |

## Gaps and risks

1. Porcelain is static, not atmospheric or time-driven.
2. `data-surface-tone='porcelain'` is supported but not broadly used; `data-surface="porcelain"` is the observed runtime pattern.
3. There is no route-level rule describing when to switch between porcelain, glass, ink, or footer emotion.
4. Porcelain ladder exists, but canon-level semantics still depend on disciplined component usage and guards.

## Conclusion

Porcelain readiness is `IMPLEMENTED_STATIC_SEMANTIC_FOUNDATION`.
