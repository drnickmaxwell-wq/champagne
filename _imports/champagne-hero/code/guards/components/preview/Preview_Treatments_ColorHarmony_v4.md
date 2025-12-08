# Preview Treatments Color Harmony v4

## Summary
- Lightened the preview canvas base to the ink-paper blend for improved legibility while keeping Champagne gradients intact.
- Unified section rhythm with consistent max-widths, padding, and heading spacing across the concern rail, benefits, 3D slot, finance, tech, stories, and FAQ rails.
- Softened card surfaces and CTA treatments using existing preview tokens (paper, card, gold keylines, gradient) for an 8–12% lift without introducing new colours or motion.

## Checks
- `node scripts/guard-preview-only.mjs` *(fails: repository missing “origin/main” reference in this environment)*
- `pnpm run brand:guard`
- `node scripts/guard-rogue-hex.mjs`
- `node scripts/guard-manifest-sync.mjs`
- `node scripts/guard-asset-size.mjs` *(fails: repository missing “origin/main” reference in this environment)*
