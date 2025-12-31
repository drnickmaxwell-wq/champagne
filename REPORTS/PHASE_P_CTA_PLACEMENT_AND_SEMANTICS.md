# Phase P — CTA Placement & Semantics Report

## Summary counts
- Treatment pages checked: 72
- Pages with exactly one mid CTA: 72
- Pages with exactly one closing CTA: 72
- Violations remaining: none

_Source: `scripts/phase_p_cta_report.cjs` execution._

## Before/after spotlights
### /treatments/dental-fillings
- Before: duplicate closing CTAs surfaced and mid CTA slot absent in stack truth tables.
- After: single closing CTA retained at index 10 with mid CTA restored at index 5 carrying “Endodontics & root canal care” and “Inlays & onlays” options.

### /treatments/implants-single-tooth
- Before: CBCT link labelled as an “alternative”, causing semantic drift.
- After: closing CTA now lists “Planning & assessment: CBCT / 3D scanning” and mid CTAs carry maintenance labelling for aftercare and implant-retained dentures.

## Manual checks
- Verified section stacks via `scripts/phase_p_cta_report.cjs` for:
  - /treatments/dental-fillings
  - /treatments/implants-single-tooth
  - /treatments/periodontal-gum-care

