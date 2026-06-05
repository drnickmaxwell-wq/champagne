# ROGUE_HEX_AND_TOKEN_DRIFT_AUDIT

Mode: repository-evidence-only audit. No code changes. No token changes.

## Verdict

Raw colour literal risk is mostly controlled by token-source centralization and guards, but token drift risk remains significant because runtime code references semantic custom properties that are not currently defined in token CSS.

Readiness: `RAW_HEX_GUARDED_TOKEN_DRIFT_NOT_FULLY_GUARDED`.

## Guard infrastructure truth

Required root scripts exist in `package.json`:

- `npm run guard:hero` maps to `pnpm --filter @champagne/guards guard:hero`.
- `npm run guard:canon` maps to `pnpm --filter @champagne/guards guard:canon`.
- `npm run verify` runs token purity, workspace dependency guard, SEO launch safety, all guards, lint, typecheck, and web build.

Guard package scripts exist in `packages/champagne-guards/package.json`:

- `guard:hero`
- `guard:rogue-hex`
- `guard:canon`
- `guard:token-binding`
- `guard:all`

## What the guards enforce

### Canon guard

`packages/champagne-guards/scripts/guard-canon.mjs` enforces:

- canonical brand token values in `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css`;
- canonical gradient string;
- hero sacred surface gradient includes `var(--smh-gradient)`;
- allowed literal set for canonical brand/support hues;
- diff-based checks against unexpected changes.

### Rogue hex guard

`packages/champagne-guards/scripts/guard-rogue-hex.mjs` scans tracked `apps`, `packages`, and `public` files for:

- hex literals;
- `rgb()` / `rgba()`;
- `hsl()` / `hsla()`.

It has allowlists and warning-only behavior for configured paths/extensions.

### Token-purity verifier

`scripts/verify-token-purity.cjs` scans runtime roots:

- `packages/champagne-sections/src`
- `packages/champagne-cta/src`
- `apps/web/app`
- `packages/champagne-hero/src`

It treats token source roots/files as allowed literal sources and flags runtime hex, rgb/rgba, gradient literals with raw colours, var fallback literals, and box-shadow literals.

Important scope: token source files include only:

- `packages/champagne-tokens/styles/tokens/**`
- `packages/champagne-tokens/styles/champagne/gradients.css`
- `packages/champagne-tokens/styles/champagne/surface.css`
- `packages/champagne-tokens/styles/champagne/theme.css`

## Raw literal scan truth

Repository scan found raw colour literals concentrated in expected areas:

| Area | Status | Notes |
| --- | --- | --- |
| `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css` | Expected | Canonical primitive literals live here. |
| `packages/champagne-guards/scripts/guard-canon.mjs` | Expected | Guard repeats canonical literals. |
| `packages/champagne-guards/scripts/brand-guard.cjs` and brand lock/smoke files | Expected/guard-test | Guard source and smoke tests contain literals by design. |
| Runtime components | Mostly controlled | Current token-purity passes target runtime roots. |
| Markdown/reports | Allowed by rogue guard extension | Audit/report files can contain literal values. |
| JSON | Warning-only in rogue guard | Surface/manifest JSON may warn, not always fail. |

## Token drift findings

The stronger risk is undefined-token drift. The following token references were found without matching CSS custom-property definitions in the scanned repo token/runtime sources:

| Undefined token reference | Example consumers | Risk |
| --- | --- | --- |
| `--surface-ink` | concierge modal, hero asset lab, HeroRendererV2 | Canon expects this token but token CSS does not define it. |
| `--surface-ink-soft` | hero debug/preview/lab, HeroRenderer secondary CTA, HeroPreviewDebug, concierge preview | Runtime surfaces may resolve to invalid/transparent values unless fallback exists. |
| `--surface-ink-strong` | hero preview controls | Preview semantic drift. |
| `--surface-gold-soft` | HeroRenderer CTA, HeroRendererV2 CTA, ChampagneHeroFrame CTA | CTA backgrounds depend on undefined token. |
| `--surface-footer-emotion` | canon only | Reserved but not implemented. |
| `--surface-page`, `--surface-card`, `--surface-subtle`, `--surface-elevated` | sections debug route | Legacy/debug token vocabulary not mapped to current surface ladder. |
| `--smh-sand`, `--smh-ink-soft`, `--smh-navy-900` | Footer CSS | Legacy fallback vocabulary not implemented in current token CSS. |
| `--accent-gold`, `--accentGold_soft` | hero lighting/diagnostic fallback | Brand gold exists, but these names are not defined. |
| `--border` | concierge CSS | Generic border token not defined in current token package. |

## Drift categories

### 1. Canon-only tokens not implemented

- `--surface-ink`
- `--surface-footer-emotion`

These are named in the semantic surface contract but absent from token CSS.

### 2. Runtime-only tokens not implemented

- `--surface-ink-soft`
- `--surface-ink-strong`
- `--surface-gold-soft`
- `--surface-page`
- `--surface-card`
- `--surface-subtle`
- `--surface-elevated`

These exist as usage but not as authoritative definitions.

### 3. Legacy aliases not implemented

- `--smh-sand`
- `--smh-ink-soft`
- `--smh-navy-900`

Footer currently relies on these in fallback chains.

### 4. Naming mismatch aliases

- `--brand-gold` / `--smh-accent-gold` exist.
- `--accent-gold` is referenced in hero lighting but not defined.
- `--accentGold_soft` is referenced as a diagnostic fallback but not defined.

## Guard gaps

Current guard suite is strong for literal residue. It is weaker for semantic-token completeness:

| Gap | Impact |
| --- | --- |
| Undefined CSS custom properties are not failed as a design-token drift class. | Runtime can reference missing tokens while passing raw-hex checks. |
| Rogue guard allowlists include sacred/runtime files. | Changed allowlisted files warn or pass depending context; review required. |
| Markdown is allowlisted by extension. | Reports can contain raw literals; acceptable for audits but not runtime. |
| JSON is warning-only. | Manifest literal drift may not be hard-fail. |
| Semantic misuse not fully enforced. | Glass/ink/footer/porcelain contracts remain mostly human-governed. |

## Risk ranking by severity

| Severity | Risk | Why it matters |
| --- | --- | --- |
| High | Undefined `--surface-gold-soft` in hero CTAs | Visible CTA background may not render as intended. |
| High | Undefined `--surface-ink` family | Canon names dark surfaces but implementation absent. |
| High | Footer uses `--smh-ink` and legacy fallbacks instead of footer-emotion token | Persian Midnight/footer decisions may diverge. |
| Medium | Header direct `--bg-ink` dependency | Global dark-token decisions alter nav without explicit nav contract. |
| Medium | Debug routes use old surface vocabulary | Debug output can mislead future agents. |
| Medium | `--accent-gold` naming mismatch | Hero lighting fallback depends on non-authoritative alias. |
| Low | Raw literals in guard/test/token files | Expected if guards remain scoped. |

## Final audit verdict

`ROGUE_LITERAL_RISK_MANAGED_BUT_TOKEN_DRIFT_RISK_ACTIVE`.

The next token mission should add a guard or audit mode for undefined design-token references before any final surface-token implementation packet.
