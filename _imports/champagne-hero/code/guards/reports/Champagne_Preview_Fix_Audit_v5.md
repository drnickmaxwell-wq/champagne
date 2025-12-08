# Champagne Preview Fix Audit v5

## Scope
- styles/preview/champagne-preview.css

## Hero Before / After
- **Before:** Preview hero used darker parchment glass and muted text mixes on top of the canonical gradient, making the wave arc feel buried.
- **After:** Hero now mirrors the live home hero with the canonical gradient via `var(--smh-gradient)`, a clearly visible wave overlay, and a pearly smoked-glass card (light ink/white mix) with brighter copy and soft lift.

## Cards & Page Chrome Before / After
- **Before:** Page ink and card fills skewed toward near-black with thin gradient outlines, leaving copy low-contrast.
- **After:** Page shell lightened to charcoal ink/white mix; cards, FAQs, and tiles use shared smoked-glass surfaces (ink/white blend) with Champagne gradient reserved for 1–2px borders/accents, improving readability and hierarchy.

## Compliance
- Token files untouched; no new hex values introduced.
- Canonical Champagne gradient referenced via existing token `var(--smh-gradient)` only.

## Guards
- `node scripts/guard-rogue-hex.mjs` — pass
- `pnpm brand:guard` — pass
- `pnpm guard:hero` — pass
- `node scripts/guard-preview-only.mjs` — expected fail in this environment (no `origin/main` merge-base)
