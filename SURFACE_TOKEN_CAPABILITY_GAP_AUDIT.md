# SURFACE_TOKEN_CAPABILITY_GAP_AUDIT

Mode: repository-evidence-only audit. No implementation performed.

## Verdict

Champagne has enough token substrate for a final surface-token program, but not enough completed semantic infrastructure for a safe one-shot implementation. The largest gaps are named material tokens, nav/footer surface abstraction, undefined-token detection, and semantic misuse enforcement.

Readiness: `FOUNDATION_PRESENT_CAPABILITY_GAPS_BLOCK_FINAL_IMPLEMENTATION`.

## Capability matrix

| Capability | Current status | Gap |
| --- | --- | --- |
| Immutable brand chroma | Implemented and guarded | None for current brand tokens. |
| Persian Midnight material | Canon target + derived candidate | No named accepted token or mapping guard. |
| Porcelain ladder | Implemented | Needs visual acceptance and semantic misuse enforcement. |
| Glass material | Implemented | Needs separation from default cards. |
| Elevation shadows | Implemented | Needs context-specific elevation semantics. |
| Ink surface semantics | Canon + runtime references | Missing token definitions. |
| Footer emotional surface | Canon reserved | Missing token definition and footer mapping. |
| Navigation surface | Direct `--bg-ink` use | Missing nav/header semantic token. |
| Hero surface runtime | Strong manifest/runtime implementation | Adjunct CTA/debug token drift remains. |
| Page surface state | Static data attributes | No generalized surface-state engine. |
| Token purity | Implemented | Does not catch all undefined-token drift. |
| Rogue literal guard | Implemented | Allowlists/warn-only scopes require review. |
| Tailwind token map | Minimal/no extension | Arbitrary token usage works, but no centralized Tailwind semantic map. |
| CI guard visibility | Scripts exist | CI visibility not re-audited in this packet except script presence. |

## Gap 1: Persian Midnight lacks a first-class token contract

Current dark material is implemented as a derived `--brand-ink` candidate and mapped to `--bg-ink` in theme. The canon material target is Persian Midnight Velvet Blue, but no explicit token or decision record binds the candidate to the canon.

Needed capability:

- Either an accepted alias/mapping (`--persian-midnight` / `--surface-ink` / `--bg-ink`) or a documented decision that `--brand-ink` is the accepted material.
- Guard coverage that prevents accidental remapping.
- Header/footer/hero dependency notes for any mapping change.

## Gap 2: Semantic surface contract exceeds implemented tokens

Canon names `--surface-ink` and `--surface-footer-emotion`, while runtime references additional `--surface-ink-soft`, `--surface-ink-strong`, and `--surface-gold-soft` names. These are not defined in token CSS.

Needed capability:

- Decide which names are canonical, aliases, deprecated, or forbidden.
- Define accepted tokens only in token source, or remove runtime references.
- Add an undefined-token audit/guard.

## Gap 3: Navigation has no surface abstraction

Header uses `--bg-ink` directly. This means any Persian Midnight or root ink decision changes nav chrome without a navigation-specific semantic layer.

Needed capability:

- `--surface-nav` / `--surface-header` or an explicit decision to keep nav tied to `--bg-ink`.
- Hover/focus/border tokens for nav surfaces.
- Dependency tests or snapshots if nav material changes.

## Gap 4: Footer emotion token is not wired

The semantic contract reserves `--surface-footer-emotion`, but footer currently uses local `--smh-footer-*` variables and fallback chains to legacy names and porcelain.

Needed capability:

- Decide whether footer should map to `--surface-footer-emotion`.
- Decide whether footer emotion is Persian Midnight-derived or separate.
- Remove or map legacy aliases such as `--smh-sand`, `--smh-ink-soft`, and `--smh-navy-900`.

## Gap 5: Hero adjunct surfaces drift from hero background governance

Hero background stack is manifest/runtime-governed. Hero CTAs and debug adjuncts still use undefined tokens such as `--surface-gold-soft` and `--surface-ink-soft`.

Needed capability:

- Define or remove hero CTA adjunct surface tokens.
- Ensure hero CTA surfaces use approved semantic tokens only.
- Include HeroRendererV2 and ChampagneHeroFrame in any dependency review even if sacred render entry is untouched.

## Gap 6: Token purity is not semantic correctness

Existing guards can pass while semantic misuse remains:

- Glass can be token-only but semantically wrong as a default card.
- Footer can fall back to porcelain tokens while still token-only.
- Undefined custom properties can appear token-like while not resolving.

Needed capability:

- Semantic contract guard or audit mode.
- Undefined-token guard.
- Optional surface-usage classification report by file/component.

## Gap 7: No generalized surface-state orchestrator

Prior and current evidence show static porcelain wrappers plus hero runtime. No app-level surface-state provider, route-level surface material manifest, environmental switching, or seasonal surface state exists.

Needed capability if desired:

- Route/page surface metadata.
- Surface-state provider or builder-level mapping.
- Explicit boundaries between body, nav, hero, section, footer, portal, and debug surfaces.

## Gap 8: Tailwind has no semantic color map

`apps/web/tailwind.config.cjs` has an empty `extend` section. The repo uses arbitrary values like `text-[var(--text-high)]` and `border-[color:var(--border-subtle)]`.

This is functional, but future developers cannot rely on Tailwind semantic aliases unless added later.

Needed capability if desired:

- Tailwind semantic aliases mapped to CSS variables.
- Guard that disallows non-token Tailwind color utilities.

## Final capability verdict

The repo is ready for a decision pack, not implementation. The safest next move is a token decision packet that resolves naming/mapping, followed by a narrow implementation packet with guard updates.

Status: `DECISION_PACK_READY_AFTER_GAP_ACKNOWLEDGEMENT_IMPLEMENTATION_NOT_READY`.
