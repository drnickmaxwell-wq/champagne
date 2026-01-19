# Hero Parity Baseline

## Engine Gate (V2)
- Confirmed `NEXT_PUBLIC_HERO_ENGINE` env gating in `apps/web/app/_components/HeroMount.tsx` uses `normalized === "v2"` to select the V2 renderer.

## Sacred surface manifest values (current)
- field.waveBackdrop
  - opacity: 0.24
  - blendMode: soft-light
- field.waveRings
  - opacity: 0.20
  - blendMode: soft-light
- field.dotGrid
  - opacity: 0.07
  - blendMode: soft-light
- overlay.particles
  - opacity: 0.17
  - blendMode: screen
- overlay.filmGrain
  - opacity: 0.08
  - blendMode: overlay
- overlay.lighting
  - opacity: 0
  - blendMode: soft-light
- motion.overlay.caustics
  - opacity: 0.21
  - blendMode: screen
- motion.overlay.glassShimmer
  - opacity: 0.19
  - blendMode: soft-light
- motion.overlay.goldDustDrift
  - opacity: 0.15
  - blendMode: soft-light
- motion.overlay.particlesDrift
  - opacity: 0.10
  - blendMode: screen

## Baseline screenshot
Screenshot captured locally via Playwright and reviewed out-of-band. Image available on request.
