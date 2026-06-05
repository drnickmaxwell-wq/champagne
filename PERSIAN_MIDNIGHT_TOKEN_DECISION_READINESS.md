# PERSIAN_MIDNIGHT_TOKEN_DECISION_READINESS

Mode: repository-evidence-only audit. No final colour chosen.

## Verdict

Persian Midnight is canonically required but not implemented as a first-class named token. The current implementation has a derived dark-material candidate (`--brand-ink` through `--smh-ink-navy`) and runtime binding through `--bg-ink`, but no explicit Persian Midnight decision record or token contract.

Readiness: `CANON_READY_IMPLEMENTATION_CANDIDATE_EXISTS_DECISION_NOT_LOCKED`.

## Canon evidence

`docs/canon/design/CHAMPAGNE_MATERIAL_AND_TOKEN_CANON_V1.md` defines the primary dark material target as `Persian Midnight Velvet Blue`. It states the dark material should feel deep, quiet, expensive, cinematic, Persian-blue influenced, velvet-like, and suitable for a luxury clinical technology brand. It also forbids collapse into flat black, generic navy, charcoal, or developer-dashboard grey.

This canon also states brand magenta, turquoise/teal, and gold are immutable brand chroma tokens and must not be retuned or replaced by mood/surface work.

## Current implementation evidence

### Primitive dark anchor

`packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css` defines:

- `--ink`
- `--smh-ink`
- `--smh-primary-ink`

These are legacy/primitive dark anchors. They are not named Persian Midnight.

### Derived dark material candidate

`packages/champagne-tokens/styles/champagne/tokens.css` defines:

- `--smh-ink-navy` as a mix of primitive ink, brand teal, and brand magenta.
- `--brand-ink` as `var(--smh-ink-navy)`.
- `--bg-ink` initially as `var(--ink-100)`.
- `--bg-ink-soft` as a mix of `--brand-ink` and a luxe sheen.
- `--ink-luxe-shift` and `--ink-luxe-sheen` using teal, magenta, and gold.

`packages/champagne-tokens/styles/champagne/theme.css` then overrides `--bg-ink` to `var(--brand-ink)` at `:root`, making the derived candidate the active root dark material after theme import.

## Current runtime consumers

| Consumer | Current binding | Readiness implication |
| --- | --- | --- |
| Global body/theme | `background: var(--bg-ink)` | Active site canvas uses derived `--brand-ink`. |
| Header | `color-mix(... var(--bg-ink) ...)` | Header depends on active dark material but has no nav-specific token. |
| Hero renderer | Uses `--bg-ink`, `--smh-gradient`, and manifest surfaces | Hero identity remains gradient/asset-driven, with ink used as support. |
| Footer | Local `--smh-footer-bg` set to `var(--smh-ink)` | Footer currently pins primitive ink rather than the derived Persian Midnight candidate. |
| Sections/debug/concierge | Some references to `--surface-ink` / `--surface-ink-soft` | Those tokens are not defined, so dark surface semantics are incomplete. |

## Candidate status

Current candidate material:

```text
--brand-ink = --smh-ink-navy = derived from --ink + --brand-teal + --brand-magenta
```

Supporting candidate knobs:

```text
--bg-ink = --brand-ink at runtime root
--bg-ink-soft = brand ink mixed with luxe sheen
--ink-luxe-shift = teal/magenta mix
--ink-luxe-sheen = luxe shift with gold
```

This is the closest implemented Persian Midnight candidate. It is not yet labelled or governed as Persian Midnight.

## Missing decision artifacts

No repository evidence found for:

- `--persian-midnight` token.
- `--persian-midnight-velvet` token.
- `--surface-persian-midnight` token.
- a Persian Midnight calibration report with accepted computed value.
- a visual proof pack comparing current `--brand-ink` to the canon target.
- a guard asserting that `--bg-ink` maps to the chosen Persian Midnight token.
- footer/header/hero dependency migration plan from generic ink to Persian Midnight semantics.

## Risks if a final decision is attempted now

1. The current runtime dark material may be adequate, but the repo does not prove it meets the Persian Midnight canon.
2. Footer pins `--smh-ink`, while root theme uses `--brand-ink`; this can create dark-material divergence.
3. Header uses `--bg-ink` directly, so any Persian Midnight change immediately affects navigation chrome without an explicit nav token.
4. Hero support surfaces and CTAs reference undefined ink/gold surface tokens, which makes dark-material behavior harder to reason about.
5. Guards protect canonical brand tokens but do not enforce a Persian Midnight semantic mapping.

## Readiness checklist

| Requirement | Status | Evidence |
| --- | --- | --- |
| Canon names target material | Ready | Material canon names Persian Midnight Velvet Blue. |
| Brand chroma protected | Ready | Token file and canon guard lock brand magenta, teal, gold. |
| Runtime dark candidate exists | Ready | `--brand-ink`, `--bg-ink`, `--bg-ink-soft`. |
| Explicit Persian Midnight token | Missing | No token definition found. |
| Header/nav dependency isolated | Missing | Header uses `--bg-ink` directly. |
| Footer dependency aligned | Missing | Footer uses `--smh-ink` local variable. |
| Hero dependency aligned | Partial | Hero background stack governed; CTA tokens drift. |
| Guard for chosen mapping | Missing | No guard found for Persian Midnight. |

## Decision questions for future pack

Do not choose colours in the audit. Future decision pack must answer:

1. Is current `--brand-ink` accepted as Persian Midnight, or is a new material token required?
2. If accepted, should `--brand-ink` be renamed, aliased, or documented as the Persian Midnight material?
3. Should `--bg-ink`, `--surface-ink`, footer surface, and nav surface all map through a single Persian Midnight semantic source?
4. Should primitive `--ink` remain flat/legacy while `--brand-ink` becomes the material token?
5. What proof is required: screenshots, computed CSS audit, contrast audit, or visual canon sign-off?

## Final readiness verdict

`PERSIAN_MIDNIGHT_DECISION_NOT_READY_FOR_TOKEN_CHANGE`.

The repo is ready for a decision conversation because evidence is sufficient. It is not ready for implementation because the named token contract and dependency mapping are missing.
