# Hero Parity — Iteration 1

## Manifest micro-tuning diff (only changed keys)
- overlays.field.waveRings.opacity: 0.20 → 0.18
- overlays.overlay.lighting.opacity: 0 → 0.04
- particles.overlay.particlesPrimary.opacity: 0.17 → 0.14
- particles.overlay.particles.opacity: 0.17 → 0.14

## Screenshots
Screenshot captured locally via Playwright and reviewed out-of-band. Image available on request.

## Observed deltas
- Reduced overall wash from particle haze, especially in the upper-left field.
- Ring field reads a touch lighter, leaving more separation against the gradient crest.
- Subtle lighting falloff adds gentle depth without shifting hue balance.

## Guard/build status
- pnpm guard:rogue-hex / guard:canon / guard:hero / build:web — passed.
- npm run guard:hero / guard:canon / verify — passed.
