# PORCELAIN_TOKEN_DECISION_READINESS

Mode: repository-evidence-only audit. No token changes. No final colour choice.

## Verdict

Porcelain is the most implemented surface-material family in the repo. The porcelain ladder exists in tokens, page/section wrappers set porcelain data attributes, text alias switching exists, and many component passes have moved hardcoded styling to semantic tokens.

Readiness: `PORCELAIN_IMPLEMENTED_STATIC_READY_FOR_SEMANTIC_DECISION_REVIEW`.

## Canon evidence

The material canon defines porcelain as the primary calm and readable light material for patient understanding, clinical readability, treatment information, forms, cards, review panels, and long-form reading. It must not become stark white, hospital white, SaaS grey-white, or low-contrast cream.

The repository semantic surface contract defines:

| Token | Intended meaning |
| --- | --- |
| `--surface-0` | Base porcelain canvas for primary content. |
| `--surface-1` | Elevated porcelain for secondary sections/cards/panels. |
| `--surface-2` | Highest porcelain elevation. |

## Implemented token evidence

`packages/champagne-tokens/styles/champagne/tokens.css` defines:

- `--surface-0`
- `--surface-1`
- `--surface-2`
- `--border-subtle`
- `--shadow-soft`
- `--shadow-strong`
- `--text-porcelain-high`
- `--text-porcelain-medium`
- `--text-porcelain-low`

`packages/champagne-tokens/styles/champagne/theme.css` maps porcelain contexts to porcelain text aliases:

- `[data-surface-tone='porcelain']`
- `[data-surface='porcelain']`

Inside those contexts, `--text-high`, `--text-medium`, and `--text-low` become the porcelain text ladder.

## Runtime usage evidence

| Runtime family | Evidence | Status |
| --- | --- | --- |
| Page builder | `apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx` uses `--surface-1`, `--surface-2`, `--border-subtle`, and `data-surface="porcelain"`. | Implemented. |
| Section shell | `apps/web/app/components/sections/SectionShell.tsx` sets `data-surface="porcelain"`. | Implemented. |
| Section components | Multiple files in `packages/champagne-sections/src` use `--surface-0/1/2`, `--border-subtle`, `--shadow-soft`, `--text-*`. | Implemented across audited files. |
| Body/root | `theme.css` and `globals.css` default to ink body, not porcelain. | Intentional mixed page model. |
| Debug routes | `apps/web/app/champagne/sections-debug/page.tsx` references older surface names not defined in token CSS. | Drift risk. |

## Implementation status table

| Capability | Status | Notes |
| --- | --- | --- |
| Porcelain base token | Exists | `--surface-0`. |
| Porcelain elevation tokens | Exists | `--surface-1`, `--surface-2`. |
| Porcelain text tokens | Exists | High/medium/low. |
| Context switch | Exists | Data attributes switch text only. |
| Background context switch | Partial | Components directly set backgrounds; data attribute does not set surface background globally. |
| App-wide porcelain provider | Missing | No provider/state engine found. |
| Route-level porcelain manifest | Missing | Static wrappers, not route-driven material state. |
| Guard semantic correctness | Partial | Token purity exists; semantic misuse is mostly process/canon law, not fully enforced. |

## Porcelain semantic risks

1. Porcelain token values are implemented, but no final visual proof in this audit confirms they meet the canon’s warm premium porcelain target.
2. `data-surface="porcelain"` changes text aliases only. It does not automatically assign `background: var(--surface-0)`.
3. Some components may use `--surface-glass` or ink-like tokens where porcelain default cards are expected.
4. Debug/preview routes reference undefined older surface tokens (`--surface-page`, `--surface-card`, `--surface-subtle`, `--surface-elevated`).
5. Footer CSS falls back to porcelain tokens via `--smh-sand` fallback chains, even though footer emotion should not be body porcelain.

## Decision readiness checklist

| Requirement | Status | Evidence/notes |
| --- | --- | --- |
| Canon material target exists | Ready | Material canon. |
| Token ladder exists | Ready | `--surface-0/1/2`. |
| Text ladder exists | Ready | `--text-porcelain-*`. |
| Runtime adoption exists | Ready | Builder, shell, sections. |
| Background semantic auto-binding | Missing/optional | Current components set backgrounds manually. |
| Semantic misuse guard | Missing/partial | Token purity catches literals, not all misuse. |
| Visual acceptance proof | Missing | No screenshot/computed audit produced here. |

## Future decision questions

1. Are current `--surface-0/1/2` values accepted as the final porcelain ladder?
2. Should porcelain context attributes also set a default background, or should components continue to bind backgrounds explicitly?
3. Should legacy/debug token names be mapped, removed, or quarantined?
4. Should footer fallback chains stop using porcelain as the fallback for emotional footer surfaces?
5. Should semantic guards distinguish porcelain cards from glass, ink, and footer emotion surfaces?

## Final readiness verdict

`PORCELAIN_READY_FOR_DECISION_PACK_REVIEW_NOT_FULLY_GUARDED`.

Porcelain has enough implementation truth to support a final decision pack. The main blockers are semantic enforcement, visual acceptance proof, and cleanup/mapping of legacy surface names.
