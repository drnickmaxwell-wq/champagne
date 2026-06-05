# SURFACE_TOKEN_MISSION_QUEUE_V1

Mode: repository-evidence-only planning output. No implementation performed.

## Mission objective

Give future agents a safe sequence for final surface-token decisions and implementation without relying on conversation history.

## Non-negotiable constraints

- Do not replace brand magenta, turquoise/teal, or gold tokens.
- Do not choose colours in audit missions.
- Do not touch sacred hero engine/manifests/render entry unless fresh explicit authority is granted.
- Token source files may contain literals; runtime component usage must remain token-only.
- Passing guards without `guard:hero`, `guard:canon`, and `verify` being wired is not acceptable.

## Current truth baseline

1. Brand tokens are authoritative in `packages/champagne-tokens/styles/tokens/smh-champagne-tokens.css` and guarded by `guard-canon`.
2. Current runtime dark material is `--brand-ink` mapped to `--bg-ink` in theme.
3. Persian Midnight is canonical but not first-class named in token CSS.
4. Porcelain ladder exists as `--surface-0/1/2`.
5. Glass exists as `--surface-glass` and `--surface-glass-deep`.
6. Canon names `--surface-ink` and `--surface-footer-emotion`, but they are not implemented.
7. Header uses `--bg-ink` directly.
8. Footer uses local `--smh-footer-*` variables and legacy fallback chains.
9. Hero background stack is governed; hero adjunct surfaces have undefined token references.
10. Undefined-token drift is the highest non-literal risk.

## Mission queue

### Mission 1 — Undefined design-token reference audit guard

Type: audit/guard design.  
Authority needed: likely scripts/guard scope only.

Goal:

- Add or design a report-only guard that lists all `var(--*)` usages with no definition in token sources or permitted component-local definitions.

Inputs:

- `scripts/verify-token-purity.cjs`
- `packages/champagne-tokens/styles/**`
- runtime roots in token-purity script

Acceptance criteria:

- Report distinguishes canonical token sources from local component variables.
- Report flags `--surface-ink`, `--surface-ink-soft`, `--surface-gold-soft`, `--surface-footer-emotion`, `--smh-sand`, `--smh-ink-soft`, `--smh-navy-900`, `--accent-gold`, `--accentGold_soft`.
- No token values chosen.

### Mission 2 — Persian Midnight decision packet

Type: decision pack only.

Goal:

- Decide whether `--brand-ink` is accepted as Persian Midnight or whether a new named token is required.

Required evidence:

- Material canon.
- Current token definitions.
- Header/footer/hero dependency report.
- Computed CSS proof if visual diagnostics are authorized.

Must answer:

- What is the canonical named token?
- What maps to `--bg-ink`?
- Does footer use the same material?
- Does nav get its own surface token?
- What guard protects the mapping?

### Mission 3 — Porcelain decision packet

Type: decision pack only.

Goal:

- Accept, adjust, or defer current `--surface-0/1/2` porcelain ladder.

Required evidence:

- Material canon.
- Current porcelain usage in builder, SectionShell, and sections.
- Semantic misuse audit for glass/ink/porcelain contexts.

Must answer:

- Are current values accepted?
- Should porcelain attributes set background or only text aliases?
- Should legacy debug surface tokens be mapped or removed?

### Mission 4 — Surface token naming contract

Type: canon/token architecture decision.

Goal:

- Lock the canonical token name set before implementation.

Candidate groups to classify:

- Keep/define: `--surface-0`, `--surface-1`, `--surface-2`, `--surface-glass`, `--surface-glass-deep`, `--border-subtle`, `--shadow-soft`, `--text-*`.
- Decide: `--surface-ink`, `--surface-ink-soft`, `--surface-ink-strong`, `--surface-gold-soft`, `--surface-footer-emotion`.
- Deprecated/legacy or map: `--smh-sand`, `--smh-ink-soft`, `--smh-navy-900`, `--surface-page`, `--surface-card`, `--surface-subtle`, `--surface-elevated`, `--accent-gold`, `--accentGold_soft`.

Acceptance criteria:

- Every runtime-used design token is defined, intentionally local, or removed.
- Semantic contract and token CSS agree.

### Mission 5 — Navigation/header surface semantics

Type: decision then implementation.

Goal:

- Isolate nav/header from global dark material changes if desired.

Options to decide later, not in this audit:

- Keep direct `--bg-ink` dependency.
- Introduce `--surface-nav` / `--surface-header`.
- Introduce nav border/hover tokens.

Acceptance criteria:

- Header dependency on Persian Midnight is explicit.
- No raw colours or rogue gradients.
- No layout/copy change.

### Mission 6 — Footer emotion surface mapping

Type: decision then implementation.

Goal:

- Map footer emotional slab to canonical surface semantics.

Must decide:

- Should `--surface-footer-emotion` exist as a defined token?
- Does footer root `--smh-footer-bg` map to it?
- Which legacy aliases are removed or mapped?

Acceptance criteria:

- Footer no longer relies on undefined fallback names.
- Footer does not borrow porcelain as emotional slab unless explicitly intended.
- No copy/layout changes.

### Mission 7 — Hero adjunct token cleanup

Type: narrow implementation after token naming contract.

Goal:

- Resolve undefined hero adjunct tokens without touching sacred engine/manifests unless explicit authority is granted.

Files requiring future review:

- `apps/web/app/components/hero/HeroRenderer.tsx` (sacred render entry; requires explicit authority if edited)
- `apps/web/app/components/hero/v2/HeroRendererV2.tsx`
- `apps/web/app/components/hero/v2/buildHeroV2Model.ts`
- `packages/champagne-hero/src/ChampagneHeroFrame.tsx`
- `packages/champagne-hero/src/HeroPreviewDebug.tsx`

Acceptance criteria:

- `--surface-gold-soft`, `--surface-ink-soft`, `--accentGold_soft`, and related hero tokens are defined or removed.
- Hero background stack behavior remains unchanged.
- `guard:hero`, `guard:canon`, and `verify` pass.

### Mission 8 — Semantic surface misuse audit

Type: forensic audit.

Goal:

- Classify component surfaces by intended semantic family: porcelain, glass, ink, footer emotion, hero overlay, nav.

Acceptance criteria:

- List default cards using glass.
- List porcelain contexts using ink.
- List footer/body token crossover.
- Produce implementation packet candidates with precise file scope.

### Mission 9 — Guard visibility CI audit

Type: CI audit.

Goal:

- Confirm named CI steps run `guard:hero`, `guard:canon`, and `verify`.

Inputs:

- `.github/workflows/**`
- `package.json`
- `packages/champagne-guards/package.json`

Acceptance criteria:

- Named CI steps documented.
- Any missing guard is reported, not bypassed.

## Recommended sequencing

1. Undefined-token report guard/audit.
2. Surface token naming contract.
3. Persian Midnight decision packet.
4. Porcelain decision packet.
5. Nav/header decision.
6. Footer emotion decision.
7. Hero adjunct cleanup packet.
8. Semantic misuse enforcement.
9. CI visibility audit.

## Stop conditions for future agents

Stop and report if:

- a required guard command is missing;
- a mission requires sacred hero edits without explicit authority;
- implementation would require changing brand magenta/teal/gold;
- final colours are requested inside an audit-only mission;
- undefined-token drift cannot be separated from local component custom variables safely.

## Mission queue verdict

`SURFACE_TOKEN_PROGRAM_READY_FOR_DECISION_SEQUENCE_NOT_READY_FOR_BULK_IMPLEMENTATION`.
