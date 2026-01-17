# Hero Overlay Audit Summary

## Findings
- **Homepage (/)** uses sacred hero base copy for headline/subheadline, but hero CTA slots were not merged into the hero overlay contract. Overlay relied on hero runtime content only. 
- **Treatment pages** (e.g., `/treatments/implants`) store headline/subhead in `treatment.heroIntro` section manifests. Those values were not wired into the hero renderer, so overlay content could disappear when variant defaults are empty. 
- **Utility/editorial/marketing pages** (e.g., `/about`) use surface-only variants (no content defaults), so overlay copy relied on sacred base and ignored page-level hero CTAs/copy.

## Root Cause
Hero rendering consumed `getHeroRuntime` content only. Page-level hero copy (heroIntro section) and CTA slots were not merged, so variants without explicit content produced missing overlay fields.

## Restore Plan Implemented
- Added a single hero overlay contract (`resolveHeroOverlay`) that merges:
  1. Page overrides (heroIntro section fields + hero CTA slots)
  2. Variant defaults
  3. Sacred base defaults
- Overlay rendering now attaches in `HeroMount` and hides the legacy hero-content block when overlay data exists.

## Notes
No sacred hero manifests were modified. All copy comes from existing manifests; no placeholders were introduced.
