# Champagne Preview Fix Audit v6

## Scope
- styles/preview/champagne-preview.css

## Hero Before / After
- **Before:** Preview hero overlays were pared back, leaving the wave/particle stack faint compared to the live home hero.
- **After:** Preview hero now mirrors the home stack: canonical Champagne gradient via `var(--smh-gradient)` with wave, particles, grain, and shimmer layers visible, plus a pearly smoked-glass card lifted with soft shadowing.

## Cards & Page Chrome Before / After
- **Before:** Charcoal shell and cards ran dark with thin gradient borders, making text feel low-contrast.
- **After:** Page shell softened to charcoal/white mixes; cards, FAQs, and link tiles use lighter smoked-glass fills with Champagne gradient reserved for border/keyline accents so copy reads clearly.

## Compliance
- Token files untouched; no new hex values added.
- Canonical Champagne gradient referenced through existing token `var(--smh-gradient)` only.

## Guards
- `node scripts/guard-rogue-hex.mjs` — pass
- `pnpm brand:guard` — pass
- `pnpm guard:hero` — pass
- `node scripts/guard-preview-only.mjs` — expected fail here (no `origin/main` merge-base)
