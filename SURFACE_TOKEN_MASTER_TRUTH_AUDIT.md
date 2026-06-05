# SURFACE_TOKEN_MASTER_TRUTH_AUDIT

Mode: `CHAMPAGNE_SURFACE_TOKEN_FORENSIC_AUDITOR`  
Evidence rule: repository evidence only. No token changes. No final colour choices.

## Executive verdict

The implemented surface-token truth is a partial, layered system:

1. Brand chroma authority is explicit and guarded: magenta, teal/turquoise, gold, keyline gold, legacy rollback hues, ink, text, white, grey, and warm rose are hard-coded only in canonical token/guard sources.
2. The live website theme defaults to an ink context, then switches text tokens to porcelain only inside porcelain data-attribute contexts.
3. Porcelain is implemented as `--surface-0`, `--surface-1`, and `--surface-2` in token CSS, and is used across sections and builder surfaces.
4. Persian Midnight is canonical as a material target, but no literal `--persian-midnight` token exists. Runtime dark material is currently `--brand-ink`/`--bg-ink`, derived from `--ink`, teal, magenta, and gold sheen mixes.
5. Glass/elevation tokens exist, but semantic separation is incomplete: some runtime code still references undeclared ink/gold surface tokens and uses glass in places that need final semantic review.
6. Hero surface behavior is more developed than page surface behavior: it has manifest-driven layers, assets, opacity/blend/z-index governance, PRM filtering, and debug receipts.
7. Navigation/header surfaces are directly bound to `--bg-ink`, not a dedicated navigation-surface semantic token.
8. The final surface-token decision pack is not ready for implementation until token naming gaps, Persian Midnight calibration gaps, navigation semantics, and hero CTA undefined surface tokens are resolved.

## Authoritative evidence map

| Evidence family | Files inspected | Implemented truth |
| --- | --- | --- |
| Material canon | `docs/canon/design/CHAMPAGNE_MATERIAL_AND_TOKEN_CANON_V1.md`, `packages/champagne-canon/canon/visual/03_material_tokens.json` | Brand chroma is immutable; Persian Midnight Velvet Blue, porcelain, gold restraint, glass depth, and cinematic hero identity are canonical concepts. |
| Primitive brand tokens | `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css` | Literal brand anchors are defined here. |
| Semantic tokens | `packages/champagne-tokens/styles/champagne/tokens.css` | `--brand-ink`, `--bg-ink`, porcelain ladder, glass, text, border, shadow, and opacity knobs are defined. |
| Theme binding | `packages/champagne-tokens/styles/champagne/theme.css`, `apps/web/app/globals.css` | Root/body default is ink; porcelain attributes switch text context only. |
| Tailwind | `apps/web/tailwind.config.cjs` | Tailwind has no extended color token map; runtime styling relies on CSS custom properties and arbitrary values. |
| Glass/gradients | `packages/champagne-tokens/styles/champagne/glass.css`, `packages/champagne-tokens/styles/champagne/gradients.css` | Glass utility classes and canonical gradient utility exist. |
| Hero surfaces | `packages/champagne-tokens/styles/champagne/surface.css`, `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json`, `apps/web/app/components/hero/HeroRenderer.tsx` | Hero layers are token/manifest-driven and runtime-governed. |
| Nav/header | `apps/web/app/components/layout/Header.tsx`, `apps/web/app/components/layout/Footer.tsx`, `apps/web/app/components/layout/FooterLuxe.module.css` | Header uses `--bg-ink` directly; footer uses local footer custom properties and fallback chains. |
| Guards | `package.json`, `packages/champagne-guards/package.json`, `packages/champagne-guards/scripts/guard-canon.mjs`, `packages/champagne-guards/scripts/guard-rogue-hex.mjs`, `scripts/verify-token-purity.cjs` | Required scripts exist; guard coverage is real but allowlists and target-file scopes are important drift risks. |
| Existing audits | `SURFACE_STATE_INFRASTRUCTURE_AUDIT.md`, `PORCELAIN_SURFACE_DEPENDENCY_REPORT.md`, `ATMOSPHERIC_SYSTEM_MASTER_TRUTH_AUDIT.md`, `reports/hero/v2-surface-truth-pack.md` | Prior reports align with the current finding: static page surfaces plus advanced hero stack; no generalized surface-state orchestrator. |

## Current authoritative brand colour tokens

Authoritative primitive brand tokens are in `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`:

| Token | Current value/status | Authority notes |
| --- | --- | --- |
| `--brand-magenta` | canonical literal | Immutable brand chroma. Must not be replaced by Persian Midnight/porcelain work. |
| `--brand-teal` | canonical literal | This is the current turquoise/teal authority. |
| `--brand-gold` | canonical literal | Deep gold visual accent. |
| `--brand-gold-keyline` | canonical literal | Soft keyline gold. |
| `--smh-gradient` | canonical gradient from brand magenta, teal, and gold | Guarded by canon guard. |
| `--smh-gradient-legacy` | legacy rollback gradient | Explicitly marked diagnostics/rollback only. |
| `--ink` | canonical primitive dark anchor | Currently flat dark primitive, not explicitly Persian Midnight. |
| `--text`, `--bg`, `--smh-white`, `--smh-gray-200`, `--smh-warm-rose` | canonical/legacy support literals | Guard-canon treats these as expected values. |

Guard evidence: `packages/champagne-guards/scripts/guard-canon.mjs` repeats the expected token values and allowed literal set. Therefore the implemented source of truth is not just the CSS file; guard enforcement encodes it too.

## Current surface token structure

### Implemented semantic surface and context tokens

Defined in `packages/champagne-tokens/styles/champagne/tokens.css`:

| Token | Implemented meaning | Notes |
| --- | --- | --- |
| `--brand-ink` | derived dark ink from `--ink`, teal, and magenta | Current dark material candidate. |
| `--bg-ink` | initially `--ink-100`, then overridden in theme to `--brand-ink` | Runtime root uses theme value. |
| `--bg-ink-soft` | mixed brand-ink with luxe sheen | Used as softer dark material. |
| `--surface-0` | base porcelain | Warm white/gold mix. |
| `--surface-1` | elevated porcelain | Warmer/deeper porcelain layer. |
| `--surface-2` | highest porcelain elevation | Highest porcelain layer. |
| `--surface-glass` | translucent dark glass | Derived from brand ink and luxe sheen with transparency. |
| `--surface-glass-deep` | deeper translucent glass | Same family, darker/deeper. |
| `--border-subtle` | subtle porcelain/ink border mix | Uses `--brand-ink` and `--surface-0`. |
| `--shadow-soft`, `--shadow-strong` | elevation shadows | Derived from `--brand-ink`. |
| `--text-porcelain-high/medium/low` | porcelain text ladder | Bound in porcelain contexts. |
| `--text-ink-high/medium/low` | ink text ladder | Bound at root by theme. |
| `--text-high/medium/low` | active semantic text aliases | Contextual aliases. |

### Canonical but not implemented as token definitions

The root `AGENTS.md` semantic contract names these tokens, but current token CSS does not define all of them:

| Token name | Current implementation status | Runtime references found |
| --- | --- | --- |
| `--surface-ink` | not defined in token CSS | Used in concierge, hero lab, and HeroRendererV2 paths. |
| `--surface-footer-emotion` | not defined in token CSS | Canon-only/reserved; no live definition found. |
| `--surface-ink-soft` | not defined in token CSS | Used by hero CTA/debug/preview and concierge surfaces. |
| `--surface-ink-strong` | not defined in token CSS | Used in hero preview controls. |
| `--surface-gold-soft` | not defined in token CSS | Used by hero CTA buttons. |
| `--surface-page`, `--surface-card`, `--surface-subtle`, `--surface-elevated` | not defined in token CSS | Used in sections-debug route. |
| `--smh-sand`, `--smh-ink-soft`, `--smh-navy-900` | not defined in current token CSS | Used in footer CSS fallback chains. |

This is the central token-drift truth: the repo has a canonical semantic contract wider than the implemented token package.

## Current Persian Midnight status

Persian Midnight Velvet Blue is canonically required as the primary dark material target, but implementation is candidate-level, not locked:

- Canon names the target material as `Persian Midnight Velvet Blue` and says it must not collapse into flat black, generic navy, charcoal, or dashboard grey.
- Implemented token CSS does not define `--persian-midnight`, `--persian-midnight-velvet`, or equivalent explicit named token.
- Current runtime dark material is `--brand-ink`, derived as `--smh-ink-navy` from `--ink`, `--brand-teal`, and `--brand-magenta`.
- `--bg-ink` is overridden by `theme.css` to `--brand-ink`, so runtime root surfaces see the derived ink, not the primitive `--ink` from `tokens.css` after the theme import order applies.

Verdict: `PERSIAN_MIDNIGHT_CANONICAL_TARGET_WITH_DERIVED_INK_CANDIDATE_IMPLEMENTED`.

## Current porcelain status

Porcelain is implemented more concretely than Persian Midnight:

- `--surface-0`, `--surface-1`, and `--surface-2` are defined.
- `--text-porcelain-high/medium/low` are defined.
- `theme.css` switches active text aliases when `[data-surface-tone='porcelain']` or `[data-surface='porcelain']` is present.
- The page builder and SectionShell use porcelain data attributes and surface tokens.
- Many section components now use `--surface-*`, `--border-subtle`, `--shadow-soft`, and `--text-*` tokens.

Verdict: `PORCELAIN_LADDER_IMPLEMENTED_STATIC_CONTEXT_PARTIAL_SEMANTIC_COVERAGE`.

## Current glass/elevation status

Glass and elevation are implemented but semantically incomplete:

- `--surface-glass` and `--surface-glass-deep` exist in tokens.
- `.glass-soft` and `.glass-card` bind to glass tokens and token-derived borders/shadows.
- `--shadow-soft` and `--shadow-strong` exist.
- Some components still use glass as a default panel surface where the semantic contract says glass must not be default cards.
- The semantic contract’s `--surface-ink` and `--surface-footer-emotion` are not implemented, so dark/glass/footer differentiation is incomplete.

Verdict: `GLASS_AND_ELEVATION_TOKENS_EXIST_SEMANTIC_SEPARATION_INCOMPLETE`.

## Current navigation surface behavior

Header/navigation currently use generic ink tokens directly:

- Header border uses `color-mix(... var(--bg-ink) ...)`.
- Header background uses `color-mix(... var(--bg-ink) ...)`.
- Nav hover states use `var(--bg-ink)` mixes.
- No `--surface-nav`, `--surface-navigation`, `--nav-surface`, or `--header-surface` token is defined or used.

Footer uses component-scoped custom properties:

- `Footer.tsx` sets `--smh-footer-bg`, `--smh-footer-particles`, `--smh-footer-rim`, and `--smh-footer-button-shadow` inline.
- `FooterLuxe.module.css` consumes those variables with fallback chains to legacy `--smh-*` tokens and porcelain fallbacks.
- The reserved `--surface-footer-emotion` canon token is not defined or used as the footer semantic binding.

Verdict: `NAV_USES_BG_INK_DIRECTLY_FOOTER_HAS_LOCAL_SURFACE_VARIABLES_NO_CANONICAL_NAV_SURFACE_TOKEN`.

## Current hero fallback/background surface behavior

Hero surface behavior splits into two systems:

1. `HeroRenderer.tsx` sacred render entry uses `getHeroRuntime`, manifest surfaces, runtime asset resolution, PRM filtering, governance suppression, and debug receipts.
2. `ChampagneHeroFrame.tsx` is an older/generic frame that derives fallback gradients from hero type and preset layers.

Key truths:

- `HeroRenderer` fallback returns a safe `BaseChampagneSurface` with `background: var(--smh-gradient)` if runtime fails.
- `HeroRenderer` normal path sets BaseChampagneSurface to `variant="plain"`, disables internal overlays, sets `backgroundImage: none`, `backgroundColor: transparent`, and drives the visual background through the hero surface stack.
- Hero layer CSS in `surface.css` sets default layer backgrounds and opacities from tokens and CSS vars.
- `HeroRenderer` has explicit governance: if manifest opacity/blend/z-index is missing for governed layers, the layer is disabled or opacity forced to zero.
- `HeroRenderer` still references undefined `--surface-gold-soft`, `--surface-ink-soft`, and diagnostic fallback `--accentGold_soft` in CTA/debug styles.

Verdict: `HERO_STACK_GOVERNED_RUNTIME_STRONG_BUT_FALLBACK_CTA_TOKENS_DRIFT`.

## Rogue hex / hardcoded colour risk summary

Repository scan found literal colour values concentrated in expected token and guard files, plus smoke tests. Runtime component raw hex risk is controlled by guards and prior token-purity work, but risk remains from:

- guard allowlists that include runtime files;
- markdown being allowed by extension;
- JSON warn-only behavior;
- undefined token references that silently fall through to invalid styles or fallback variables;
- legacy fallback chains in footer and hero paths.

The most important drift risk is no longer only raw hex. It is semantic-token name drift: files reference `--surface-ink`, `--surface-ink-soft`, `--surface-gold-soft`, `--surface-footer-emotion`, and nav/footer concepts that are not implemented as canonical tokens.

## Canon/runtime mismatch table

| Canon expectation | Runtime truth | Mismatch |
| --- | --- | --- |
| Persian Midnight Velvet Blue primary dark material | Derived `--brand-ink`/`--bg-ink` candidate | No explicit named Persian Midnight token or calibrated decision. |
| Porcelain ladder | `--surface-0/1/2` implemented | Implemented, but static; no state engine. |
| Glass not default cards | Glass tokens/classes exist; some components use glass surfaces | Needs semantic review per component. |
| `--surface-ink` dark ink surfaces | Canon names it; runtime references it | Not defined in tokens. |
| `--surface-footer-emotion` reserved footer slab | Canon names it | Not defined or wired in footer. |
| Navigation surface behavior | Header uses `--bg-ink` mixes directly | No dedicated nav/header semantic token. |
| Hero fallback/background | Sacred renderer stack strong; fallback is `--smh-gradient` | Hero CTA/fallback adjuncts reference undefined surface tokens. |

## Decision-pack readiness

Readiness state: `NOT_FINAL_DECISION_READY_BUT_AUDIT_READY`.

A future decision pack can proceed only after it explicitly answers:

1. Should `--brand-ink` become the Persian Midnight implementation, or should a new named material token be introduced and mapped to `--bg-ink`?
2. Should the canon-only `--surface-ink`, `--surface-ink-soft`, `--surface-ink-strong`, and `--surface-footer-emotion` become real tokens?
3. Should `--surface-gold-soft` become a real semantic accent-surface token, or should hero CTAs use existing brand/keyline tokens only?
4. Should navigation/header receive `--surface-nav` / `--surface-header` semantic tokens, or remain direct `--bg-ink` consumers?
5. Should footer local variables map to `--surface-footer-emotion`?
6. Should guards fail on undefined design-token references, not just raw hex/rgb/gradient literals?
