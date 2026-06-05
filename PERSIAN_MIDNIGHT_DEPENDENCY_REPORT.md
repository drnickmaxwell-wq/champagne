# PERSIAN_MIDNIGHT_DEPENDENCY_REPORT

Mode: repository-evidence-only audit. No implementation performed.

## Verdict

Persian Midnight dependencies already exist, but the material is not fully calibrated as a final token.

## Canon truth

The material canon declares Persian Midnight Velvet Blue as the primary dark material. It describes it as deep, luxury, midnight-blue, Persian-blue influenced, velvet-like, cinematic, and suitable for a luxury clinical technology brand. The canon explicitly forbids collapse into flat black, generic navy, charcoal, or developer-dashboard grey.

The same canon lists a current known token issue: the exact Persian Midnight Velvet background token still requires final tuning. Therefore the current repo state is not “missing Persian Midnight,” but “Persian Midnight canon exists and token tuning remains open.”

## Implemented token dependencies

`packages/champagne-tokens/styles/champagne/tokens.css` implements:

- `--smh-ink-navy`: derived through color mixing from base ink, brand teal, and brand magenta.
- `--brand-ink`: aliases to `--smh-ink-navy`.
- `--ink-100`, `--ink-80`, and `--ink-60`.
- `--bg-ink`: defaulting to `--ink-100` in tokens, and defaulting to `--brand-ink` in theme root.
- `--bg-ink-soft`: mixed from brand ink and luxe sheen.
- ink text tokens such as `--text-ink-high`, `--text-ink-medium`, and `--text-ink-low`.
- glass tokens derived from brand ink and luxe sheen.

`packages/champagne-tokens/styles/champagne/theme.css` sets root defaults to ink context and applies `background: var(--bg-ink)` to `body` and `.champagne-page`.

`packages/champagne-tokens/styles/champagne/time-of-day.css` sets `--bg-ink` for dusk and night to `--ink-100`, and dawn to a brand-teal/white mix. This means time-of-day CSS can override the dark surface dependency, but currently only at `--bg-ink` level.

## Hero dependencies

The sacred hero base defaults to tone `night`. The hero gradient, wave, caustic, shimmer, particle, grain, and lighting stack all render over this dark/cinematic premise. The hero lighting CSS uses `--bg-ink` in its layered lighting gradient, making the dark material dependency part of hero atmosphere rendering.

## Direct dependencies found

| Dependency type | Evidence |
| --- | --- |
| Canon material target | Persian Midnight Velvet Blue in material canon. |
| Root dark theme | `--brand-ink`, `--bg-ink`, body background in token/theme CSS. |
| Hero default tone | Sacred base `tone: night`. |
| Hero weather night state | Night weather tone and caustics. |
| Glass material | `--surface-glass` and `--surface-glass-deep` are derived from brand ink/luxe sheen. |
| Text contrast | Ink text tokens derive from white/transparent mixes. |
| Time CSS override | Dusk/night set `--bg-ink` to ink base. |

## Gaps and risks

1. The exact Persian Midnight token is explicitly not final.
2. No token named `--persian-midnight` was found in active token files; the dependency is semantic/canonical through `--brand-ink`, `--smh-ink-navy`, and `--bg-ink`.
3. Time-of-day CSS can override `--bg-ink`, but does not express Persian Midnight as a full material state.
4. Future dark-state work must not replace this with generic ink/black/navy.

## Conclusion

Persian Midnight readiness is `CANONICAL_DEPENDENCY_PRESENT_WITH_CALIBRATION_GAP`.
