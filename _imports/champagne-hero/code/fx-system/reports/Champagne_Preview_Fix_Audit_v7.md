# Champagne Preview Fix Audit v7

## Scope
- Updated visual layer in `styles/preview/champagne-preview.css` only.

## Hero Before / After
- **Before:** Preview hero stacked darker overlays on the gradient with a muted wave and a heavier card treatment that differed from the live home hero motion stack.
- **After:** Preview hero now reuses the home hero stack: canonical Champagne gradient with matching wave mask, particles, grain, and drift timing; wave visibility restored; hero glass card uses the same pearly smoked-white mix, gold keyline, and soft shadow for clear separation.

## Cards & Page Chrome Before / After
- **Before:** Page ink leaned toward near-black and cards read as dark slabs with thin gradient outlines and subdued text.
- **After:** Page ink is lifted to a charcoal mix, cards/tiles/FAQs use lighter smoked-glass surfaces with brighter text tokens, and the Champagne gradient is reserved for thin borders and accents to keep the layout calm and readable.

## Compliance
- Token files untouched; no new hex values introduced.
- Canonical gradient string retained via existing `--smh-gradient` token for all Champagne surfaces and borders.
- Guard runs (in this environment):
  - `node scripts/guard-rogue-hex.mjs`
  - `pnpm brand:guard`
  - `pnpm guard:hero`
  - `node scripts/guard-preview-only.mjs` *(expected to fail here due to missing “origin/main” merge base)*
