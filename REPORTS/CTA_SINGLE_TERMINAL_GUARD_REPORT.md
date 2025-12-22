# CTA single-terminal guard

## What it checks
- Every treatment stack must contain exactly one `treatment_closing_cta`.
- At most one `treatment_mid_cta` is allowed.
- Any mid CTA must sit at least three positions away from the closing CTA (distance > 2).

## Implementation
- New guard script `packages/champagne-guards/scripts/guard-cta-single-terminal.cjs` resolves each treatment stack via SectionRegistry and enforces the counts and spacing rules above.
- Guard is exposed as `pnpm run guard:cta-single-terminal` and added to the global `guard:all` chain.

## Outcome
- Current manifests pass the guard after correcting the dental fillings mid-CTA wiring.
