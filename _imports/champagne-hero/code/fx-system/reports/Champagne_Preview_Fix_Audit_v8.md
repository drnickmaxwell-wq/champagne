# Champagne Preview Fix Audit v8

## Scope
- Updated preview styling in `styles/preview/champagne-preview.css` only.

## Hero Before / After
- **Before:** Preview hero used darker preview-only ink/text mixes and a softened gradient stack that muted the wave and overlays compared to the live home hero.
- **After:** Preview hero reuses the home hero stack: canonical `var(--smh-gradient)` base, the same wave/particles/shimmer/grain layers and drift timing, and a pearly smoked-glass card with home-hero shadow/radius for clear, bright readability.

## Cards & Page Chrome Before / After
- **Before:** Page shell and cards leaned charcoal/ink with gradient fills and dimmed text, making content harder to read.
- **After:** Page, cards, FAQs, and tiles now sit on pearl smoked-glass surfaces built from `var(--smh-white)` mixes, reserve the Champagne gradient for thin borders/keylines, and use the home text tokens for crisp contrast.

## Compliance
- Token files untouched; no new hex values introduced.
- Canonical gradient retained via `var(--smh-gradient)`; no alternate gradient strings added.
- Guard runs (this environment):
  - `node scripts/guard-rogue-hex.mjs`
  - `pnpm brand:guard`
  - `pnpm guard:hero`
  - `node scripts/guard-preview-only.mjs` *(expected to fail here because `origin/main` is unavailable)*
