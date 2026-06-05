# DESIGN_AUTHORITY_CONSOLIDATION_NEXT_ACTIONS

Mode: `SAFE_NEXT_ACTION_RECOMMENDATION`  
Evidence date: 2026-06-05

## Recommended immediate next mission

`NAV_HERO_BACKGROUND_FLASH_DIAGNOSTIC_CAPTURE_V1`

Purpose: establish runtime truth before implementation. Capture computed backgrounds, hero binding, route state, and first-paint/steady-state screenshots on representative routes.

Why this comes first:

- The active background is mixed: ink root, porcelain content wrappers, hero manifest stack, header ink mixes, footer-local surfaces.
- Persian Midnight is canonically required but not implemented as a first-class named token.
- Header/nav directly depends on `--bg-ink`.
- Hero first paint may depend on surrounding backgrounds and can suppress layers by PRM/governance.
- Composite Bonding is still the best reference candidate, but active runtime parity with recovered Phase 1B has not been proven.

## Do not implement yet

Do not implement any of these until diagnostic proof and Director authorization exist:

1. Persian Midnight token or value tuning.
2. Root/body background changes.
3. Header/nav flash fix.
4. Hero variants or hero rendering changes.
5. Typography changes.
6. Composite Bonding layout/visual changes.
7. Global atmosphere/surface-state orchestration.

## Follow-up mission sequence

### 1. `NAV_HERO_BACKGROUND_FLASH_DIAGNOSTIC_CAPTURE_V1`

Output:

- screenshots: first paint/steady state where possible;
- computed-style table for html/body/header/main/hero/builder/footer;
- hero engine/binding/variant report;
- route/canonical path report;
- conclusion: flash category or `UNKNOWN — EVIDENCE INCOMPLETE`.

No code changes unless adding temporary diagnostics is explicitly authorized. Prefer browser/devtools capture over code edits.

### 2. `COMPOSITE_BONDING_REFERENCE_PAGE_ZERO_RUNTIME_AUDIT`

Output:

- route existence and canonical URL proof;
- runtime section/component map;
- screenshot comparison against recovered Atlas principles;
- status decision: `PROMOTE_AS_REFERENCE_PAGE_ZERO`, `REFERENCE_CANDIDATE_NEEDS_ASSIMILATION`, or `NOT_REFERENCE_READY`.

### 3. `PERSIAN_MIDNIGHT_DECISION_RECORD_V1`

Output:

- decide whether current `--brand-ink` is accepted Persian Midnight or whether a new semantic alias is required;
- define naming/mapping contract only, not broad implementation;
- identify nav/footer/hero dependencies;
- identify guard requirements.

### 4. `SURFACE_SEMANTIC_GAP_DECISION_PACK_V1`

Output:

- resolve undefined or canon-only surface names (`--surface-ink`, `--surface-footer-emotion`, `--surface-ink-soft`, `--surface-gold-soft`);
- classify aliases as active/legacy/forbidden;
- propose guard/audit coverage for undefined token references and semantic misuse.

### 5. `TYPOGRAPHY_AUTHORITY_DECISION_PACK_V1`

Output:

- choose display/body/UI/mono authority if needed;
- define loading strategy and guard plan;
- no implementation until licensed/proven and Director-approved.

## Guard posture for any future implementation

Any future implementation mission must run and report:

- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`

If any command is missing, stop. If any command fails, stop and report. If a visual change is made to the runnable web app, capture screenshots.

## Consolidated safe recommendation

The safest next action is diagnostic capture, not design implementation. Champagne should stabilize evidence around background/hero/nav first, then promote Composite Bonding to a runtime reference page only after visual proof, then make token decision records before touching token values or surface bindings.
