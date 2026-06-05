# TYPOGRAPHY_MISSION_QUEUE_V1

Status: `FORENSIC_AUDIT_ONLY`  
Evidence date: 2026-06-05

## Mission protocol

This queue is audit-derived. It does not authorize implementation by itself. Every implementation mission must separately respect AGENTS.md sacred zones, guard requirements, and Director scope.

## Recommended mission sequence

### TYP-00 — Typography Authority Decision Pack

Role: `CHAMPAGNE_TYPOGRAPHY_DIRECTOR_PACKET`  
Type: Decision / no code  
Priority: P0

Decide and record:

- Display font.
- Heading font.
- Body font.
- UI font.
- Numeric/mono font, if any.
- Fallback stacks.
- Whether historical imported canons are retired, superseded, or promoted.

Acceptance criteria:

- One active typography authority statement exists.
- Conflicting Playfair/Montserrat/Poppins/Lora evidence is explicitly resolved.
- No runtime code changes.

### TYP-01 — Font Loading Strategy Packet

Role: `CHAMPAGNE_FONT_LOADING_ARCHITECT`  
Type: Decision / no code  
Priority: P0

Define:

- `next/font` vs self-hosted vs system-only.
- Weights and subsets.
- `font-display` policy.
- Preload policy.
- Performance budget.
- License/provenance requirements.

Acceptance criteria:

- Chosen loading path has CWV risk notes.
- No final font implementation yet.

### TYP-02 — Type Token Architecture Spec

Role: `CHAMPAGNE_TYPE_TOKEN_ARCHITECT`  
Type: Design spec / no code unless separately authorized  
Priority: P1

Define:

- Font-family variables.
- Semantic type roles.
- Size/line-height/tracking scale.
- Tailwind mapping plan.
- CSS module/inline style replacement rules.

Acceptance criteria:

- Components can migrate without guessing.
- Token-only styling law remains intact.

### TYP-03 — Typography Guard Design

Role: `CHAMPAGNE_TYPOGRAPHY_GUARD_DESIGNER`  
Type: Guard specification  
Priority: P1

Define future guard checks for:

- Unauthorized `font-family` declarations.
- Unapproved font loading imports.
- Arbitrary typography values outside allowed files.
- Hero/display binding after a canon exists.
- Tailwind type utility exceptions.

Acceptance criteria:

- Guard plan lists exact target files and allowlists.
- Guard does not conflict with token purity or hero sacred guards.

### TYP-04 — Runtime Font Loading Implementation

Role: `CHAMPAGNE_FONT_LOADING_IMPLEMENTER`  
Type: Code / requires Director authorization  
Priority: P2

Prerequisites:

- TYP-00 complete.
- TYP-01 complete.
- Allowed file scope explicitly granted.

Likely files (not authorized by this audit):

- `apps/web/app/layout.tsx` if using `next/font` classes.
- token/theme files if adding font variables.
- package config if adding local assets.

Acceptance criteria:

- Deterministic loaded fonts.
- Font fallback stacks explicit.
- Guards pass.
- Performance evidence captured.

### TYP-05 — Hero and Heading Binding Mission

Role: `CHAMPAGNE_HERO_TYPOGRAPHY_BINDER`  
Type: Code / requires explicit scope and sacred-zone review  
Priority: P2

Prerequisites:

- TYP-00 through TYP-03 complete.
- Explicit authority if touching sacred hero renderer paths.

Objective:

- Bind hero/display headings to the chosen semantic display role.
- Preserve hero engine and renderer semantics.

Acceptance criteria:

- No sacred file violation.
- No layout/structure drift.
- Typography guard passes.

### TYP-06 — Section Typography Consolidation

Role: `CHAMPAGNE_SECTION_TYPOGRAPHY_MIGRATOR`  
Type: Code / staged  
Priority: P3

Objective:

- Replace repeated inline/Tailwind typography values with approved semantic tokens/primitives.
- Preserve copy, layout, and token-only styling.

Acceptance criteria:

- No visual guessing; evidence screenshots if perceptible change.
- Guard suite passes.
- Drift count decreases.

### TYP-07 — Navigation/Footer/CTA Typography Consolidation

Role: `CHAMPAGNE_CHROME_TYPOGRAPHY_MIGRATOR`  
Type: Code / staged  
Priority: P3

Objective:

- Align header, footer, CTA, and concierge typography to chosen UI/body roles.

Acceptance criteria:

- Header/footer restrictions explicitly authorized.
- No copy/layout changes.
- Guard suite passes.

### TYP-08 — Portal/Ops Typography Exception Policy

Role: `CHAMPAGNE_PRODUCT_SURFACE_TYPE_GOVERNOR`  
Type: Policy + optional later implementation  
Priority: P3

Objective:

- Decide whether patient portal and stock/ops surfaces inherit marketing typography or use calmer operational typography.

Acceptance criteria:

- Exceptions are documented.
- Future agents know whether generic Tailwind typography in portal is drift or intentional.

## Stop conditions

Stop and report if:

- Required guards are missing or not wired.
- A mission requires sacred file edits without explicit authority.
- A final font is requested without licensing/loading/performance decisions.
- A component migration would change layout/copy outside scope.

## Current next best mission

Run **TYP-00 — Typography Authority Decision Pack** before any implementation.
