# Preview Hero Rebuild v1

## Canonical sources referenced
- Sacred hero JSON: `styles/champagne/manifest.json`
- Sacred hero component: `components/home/ChampagneHero.tsx`
- Sacred hero styles: `styles/champagne/hero.css`
- Preview styling updated: `styles/preview/champagne-preview.css`

## Summary of changes
- Rebuilt preview hero layer stack to mirror the sacred manifest: canonical `var(--smh-gradient)` base, overlay opacities matched to the JSON (caustics ~0.10, shimmer ~0.12, static particles ~0.08, drift particles ~0.06, gold dust ~0.08, grain ~0.07) and wave mask switched to overlay at the same 0.4 strength.
- Removed heavy ink fog by lightening the canvas mix, softening vignette opacity, and keeping MoodMap influence to accent glows and shadow tint instead of recolouring the gradient body.
- Brightened hero glass, cards, FAQs, and link tiles to paper-forward smoked glass with gradient borders and dual shadows while leaving fills near `var(--smh-white)` so ink text stays high contrast.

## Before vs After (preview vs sacred)
- **Gradient**: Preview heroes now use the exact sacred `var(--smh-gradient)` without extra filters; center body matches the home hero’s magenta→teal→gold balance.
- **Grey wash removal**: Page canvas and vignettes are lighter, with ink reserved for text/shadow edges so the gradient reads jewel-toned instead of teal/grey fog.
- **Overlays restored**: Wave, shimmer, particles, gold dust, and grain now run at the same alphas/blend modes as the sacred stack, honoring `prefers-reduced-motion`.
- **Glass surfaces**: Hero slab and cards now mirror the sacred glass treatment—pearl fills, gradient borders, ambient + float shadows—MoodMap only tints borders/glows/shadows.

## Tests
- `node scripts/guard-rogue-hex.mjs`
- `pnpm brand:guard`
- `pnpm guard:hero`
- `node scripts/guard-manifest-sync.mjs`
- `node scripts/guard-preview-only.mjs` *(expected to fail here if `origin/main` is unavailable)*
