AGENTS.md

Champagne OS — Canonical Agent Operating Rules

This repository is governed by the Champagne Canon.
Agents operate as specialists under strict scope control.
Violations are regressions, not “experiments”.

1. Prime Directive

Agents MUST:

Preserve the Champagne Canon

Protect the Sacred Hero Engine

Respect token-only styling

Leave the system more observable, never more fragile

Agents MUST NOT:

“Refactor” core engines

Introduce raw colours, gradients, or styles

Bypass guards

Make visual guesses without diagnostics

If uncertain, STOP and report.

2. Sacred Zones (ABSOLUTE DO-NOT-TOUCH)

The following paths are sacred.
They MUST NOT be modified, renamed, refactored, or “cleaned up” by any agent unless the task explicitly states SACRED HERO SURGEON AUTHORITY.

2.1 Sacred Hero Engine Core
packages/champagne-hero/src/HeroAssetRegistry.ts
packages/champagne-hero/src/hero-engine/HeroConfig.ts
packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts
packages/champagne-hero/src/hero-engine/HeroRuntime.ts
packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts

2.2 Sacred Hero Manifests
packages/champagne-manifests/data/hero/sacred_*

2.3 Sacred Render Entry
apps/web/app/components/hero/HeroRenderer.tsx


If any of these files are touched without explicit permission, the work is INVALID.

3. Guard Enforcement (MANDATORY)

Champagne OS uses guards. Guards are not optional.
Passing builds without guards running is considered a failure state.

3.1 Required Guards

Agents MUST ensure the following commands exist and pass:

npm run guard:hero
npm run guard:canon
npm run verify


If any command does not exist, STOP and report:

“Guard missing or not wired — cannot proceed.”

3.2 Brand Canon Guard (guard:canon)

The Brand Canon Guard enforces:

❌ No raw hex colours (e.g. #RGB, #RRGGBB, 0xFFFFFF)

❌ No rogue gradients

❌ No inline colour literals

✅ Token-only colour usage

✅ Approved CSS variables only

Agents MUST NOT introduce:

Hard-coded colours

Non-token Tailwind colour utilities

Inline gradients

3.3 Hero Guard (guard:hero)

The Hero Guard enforces:

Sacred hero files remain untouched

Manifest → runtime → renderer alignment

No silent fallback to gradient-only hero

No bypass of PRM / motion / surface gating

Agents MUST run this guard when:

Touching hero preview

Touching hero debug

Touching any marketing hero renderer

4. CI & Visibility Requirements

Guards MUST be visible in GitHub / CI.

Agents modifying workflows MUST ensure:

guard:hero runs as a named CI step

guard:canon runs as a named CI step

verify runs as a named CI step

Green CI without guards running is NOT acceptable.

5. Allowed Modification Zones

Agents MAY modify:

apps/web/app/champagne/hero-preview/**
apps/web/app/champagne/hero-debug/**
apps/web/app/champagne/hero-lab/**
apps/web/app/_components/** (EXCEPT HeroRenderer.tsx)
packages/champagne-guards/**
.github/workflows/**

EXEMPTION — PASS T1 Token Binding (Director-authorized)
Agents MAY modify:
- packages/champagne-tokens/styles/**

Scope:
- Token binding + theme variable mapping only (e.g. --bg-ink, --text-*, surface vars).
- No component/layout edits, no globals.css edits, no hero changes.

Hard prohibitions remain in force:
- Sacred zones unchanged.
- apps/web/app/layout.tsx is still forbidden.
- apps/web/app/globals.css is still forbidden.
- apps/web/app/components/layout/** is still forbidden.

EXEMPTION — PASS T2 Surface Semantics (Director-authorized)
Agents MAY modify:
- apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx
- apps/web/app/components/sections/SectionShell.tsx

Scope:
- Add data-surface / data-surface-tone attributes only.
- No styling changes.
- No component restructuring.

Hard prohibitions remain in force:
- Sacred zones unchanged.
- apps/web/app/layout.tsx is still forbidden.
- apps/web/app/globals.css is still forbidden.
- apps/web/app/components/layout/** is still forbidden.
- No header/footer edits.
- No token edits.

EXEMPTION — PASS T3 Section Semantics (Director-authorized)
Agents MAY modify:
- packages/champagne-sections/src/Section_TextBlock.tsx

Scope:
- Remove raw hex/RGBA fallbacks in section styling.
- Bind background/border/text to semantic tokens only:
  --surface-0/1/2, --border-subtle, --shadow-soft, --text-high/medium/low
- No layout changes, no copy changes, no manifest changes.

Hard prohibitions remain:
- Sacred zones unchanged.
- No hero engine/manifests.
- No apps/web/app/layout.tsx edits.
- No apps/web/app/globals.css edits.
- No header/footer edits.

EXEMPTION — PASS T4 Section Semantics (Director-authorized)
Agents MAY modify:
- packages/champagne-sections/src/Section_FeatureList.tsx
- packages/champagne-sections/src/Section_PatientStoriesRail.tsx

Scope:
- Replace hardcoded colors/fallbacks with semantic tokens only:
  background -> --surface-0/1/2 or --surface-glass (if intentionally glass)
  border -> --border-subtle
  shadow -> --shadow-soft
  text -> --text-high/medium/low
- No layout changes, no copy changes

Hard prohibitions remain:
- Sacred zones unchanged.
- No hero engine/manifests.
- No apps/web/app/layout.tsx edits.
- No apps/web/app/globals.css edits.
- No header/footer edits.

EXEMPTION — PASS T6 Treatment Page Dark-Slab Removal (Director-authorized)
Agents MAY modify:
- packages/champagne-sections/src/Section_TreatmentOverviewRich.tsx
- packages/champagne-sections/src/Section_TreatmentMediaFeature.tsx
- packages/champagne-sections/src/Section_FAQ.tsx
- packages/champagne-sections/src/Section_TreatmentClosingCTA.tsx
- packages/champagne-sections/src/Section_TreatmentMidCTA.tsx

Scope:
- Semantic-token-only styling replacement (background/border/shadow/text) with no structural edits.
- No copy changes.

Hard prohibitions remain:
- Sacred zones unchanged.
- No hero engine/manifests.
- No apps/web/app/layout.tsx edits.
- No apps/web/app/globals.css edits.
- No header/footer edits.

EXEMPTION — PASS T8 Interactive States (Director-authorized)
Agents MAY modify:
- packages/champagne-cta/src/ChampagneCTAButton.tsx

Scope:
- Replace hardcoded interaction-state colors (hover/active/focus/disabled) with semantic tokens only.
- No layout changes.
- No structural refactors.
- No copy changes.
- No new tokens unless they are defined in packages/champagne-tokens/styles/** and contain no new hex.

Hard prohibitions remain in force:
- Sacred zones unchanged.
- apps/web/app/layout.tsx is still forbidden.
- apps/web/app/globals.css is still forbidden.
- apps/web/app/components/layout/** is still forbidden.

EXEMPTION — PASS T9 (Inputs + Accordions + Pills) (Director-authorized)
Agents MAY modify:
- packages/champagne-sections/src/Section_FAQ.tsx
- packages/champagne-sections/src/Section_FeatureList.tsx

Scope:
- Semantic-token-only interaction state replacement.

Hard prohibitions remain in force:
- Sacred zones unchanged.
- apps/web/app/layout.tsx is still forbidden.
- apps/web/app/globals.css is still forbidden.
- apps/web/app/components/layout/** is still forbidden.

EXEMPTION — PASS T10 (Form Controls Interaction + Token Purity) (Director-authorized)
Agents MAY modify:
- apps/web/app/components/layout/Footer.tsx
- apps/web/app/components/layout/FooterLuxe.module.css

Scope:
- Semantic-token-only styling + interaction state replacement.

Hard prohibitions remain in force:
- Sacred zones unchanged.
- apps/web/app/layout.tsx is still forbidden.
- apps/web/app/globals.css is still forbidden.

EXEMPTION — PASS T11 Tables & Data Surfaces (Director-authorized)
Agents MAY modify:
- packages/champagne-sections/src/Section_TreatmentRoutingCards.tsx
- scripts/verify-token-purity.cjs

Scope:
- Semantic-token-only styling replacement (background/border/shadow/text + hover/focus) for tables, fee grids, download lists, and comparison grids.
- Verification coverage updates in scripts/verify-token-purity.cjs only.

Hard prohibitions remain in force:
- Sacred zones unchanged.
- No hero engine/manifests.
- No apps/web/app/layout.tsx edits.
- No apps/web/app/globals.css edits.
- No header/footer edits.
- No token edits.

EXEMPTION — PASS T12 Chip/Pill/Badge Token Purity (Director-authorized)
Agents MAY modify:
- packages/champagne-sections/src/Section_GoogleReviews.tsx
- scripts/verify-token-purity.cjs

Scope:
- Semantic-token-only styling replacement (background/border/shadow/text + interaction states) for chip/pill/badge/tag UI.
- No layout changes.
- No copy changes.

Hard prohibitions remain in force:
- Sacred zones unchanged.
- No hero engine/manifests.
- No apps/web/app/layout.tsx edits.
- No apps/web/app/globals.css edits.
- No header/footer edits.
- No token edits.


Only within task scope.

6. Role-Based Authority

Agents operate under declared roles.
Authority is role-dependent.

6.1 Diagnostic Roles (READ-ONLY)

Hero Diagnostics

Runtime Inspection

Manifest Validation

❌ No code changes allowed
✅ Logging, reporting, analysis only

6.2 Integration Roles (LIMITED WRITE)

Marketing Bridge

Preview / Debug tooling

CI / Guard wiring

❌ Cannot touch Sacred Zones
❌ Cannot change hero semantics

6.3 Sacred Hero Surgeon (RARE)

This role MUST be explicitly named in the task.

Allowed ONLY to:

Restore broken sacred hero rendering

Repair manifest → runtime → renderer linkage

Fix regressions without altering canon

Must explain every change.

7. Visual Changes Policy

Visual changes MUST follow this order:

Runtime diagnostics

Layer stack inspection

Asset resolution confirmation

CSS binding verification

Renderer paint confirmation

Skipping steps = guessing = failure.

8. Failure Protocol

If something does not render:

Agents MUST report:

What data exists

What layer is suppressed

Why suppression occurs

Where rendering breaks

Agents MUST NOT:

“Force visibility”

Hard-code styles

Bypass logic “just to see it”

9. Summary Rule (Non-Negotiable)

Champagne OS values truth over green ticks.

If guards fail, visuals fail, or canon is violated:

Stop

Report

Do not patch blindly
