# Preview Hero Layer Sync v1

## Summary of Changes
- Matched preview hero canvases to the sacred Champagne gradient engine by lightening the dusk mix toward ink-to-paper and stripping heavy ink overlays.
- Rebalanced hero layers to mirror the home stack: canonical magenta→teal→gold gradient, tuned caustics/shimmer/particles/gold dust/grain opacities, and softer vignettes that no longer mute the gradient body.
- Brightened hero and content glass surfaces toward paper-pearl fills with mood accents confined to borders, glows, and shadow warmth/coolness.

## Layer Stack Parity
- Base uses `var(--smh-gradient)` at full saturation with reduced contrast filtering.
- Wave caustics, shimmer, drift particles, gold dust, static particles, and film grain now run at home-hero-like opacities and blend modes; vignette strength is eased to edge-only darkening.
- CTA pills keep the sacred gradient and glass hero card uses paper-forward fill, gradient keyline, and dual shadow lift.

## Ink/Grey Removal
- Page background ink mix reduced; radial veils and multiply vignettes lowered to keep the centre bright and jewel-toned.
- Hero vignettes softened and lighting tint lowered so the gradient reads without teal/grey fog.

## MoodMap Behaviour
- Mood values now steer borders, glows, shadow tint, shimmer/gold-dust/particle alpha, and subtle wave drift. Card fills and hero gradient remain neutral Champagne.
- Route intent retained (cooler implants/tech/orthodontics, warmer veneers/cosmetic/composite, brighter whitening, neutral general) via accent-only touches.

## Key Selectors Updated
- `:root` / `.cpv-page` mood math and canvas backgrounds
- `.champagne-hero-surface`, `.cpv-hero::before/::after`, `.cpv-wavefx__*` overlay opacities
- `.cpv-glass`, `.cpv-card`, `.cpv-faq__item`, `.cpv-linkcard` glass fills, borders, and shadows

## Known Differences vs Sacred Hero
- Preview heroes keep slightly stronger edge vignettes for preview staging context.
- Motion follows sacred values but scales with MoodMap intensity per treatment (still obeys `prefers-reduced-motion`).

## Tests
- `node scripts/guard-rogue-hex.mjs` — pass
- `pnpm brand:guard` — pass
- `pnpm guard:hero` — pass
- `node scripts/guard-manifest-sync.mjs` — pass
- `node scripts/guard-preview-only.mjs` — **fails here** because `origin/main` is unavailable in this ephemeral environment; expected per guard note.
