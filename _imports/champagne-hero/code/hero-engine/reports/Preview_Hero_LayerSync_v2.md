# Preview Hero Layer Sync v2

## Summary
- Reduced dusk ink mixes and vignette strength on preview canvases to let the Champagne gradient stay bright and jewel-toned.
- Matched preview hero overlays to sacred opacities (wave, shimmer, particles, gold dust, grain) while keeping the canonical `var(--smh-gradient)` untouched.
- Brightened hero glass and all preview cards to paper-forward smoked glass with MoodMap limited to borders, glows, and shadow tint.

## Layer stack alignment
- `.champagne-hero-surface__gradient` now mirrors the sacred hero gradient intensity with light contrast/brightness only.
- `.cpv-wavefx__wave-caustics`, `.cpv-wavefx__glass-shimmer`, `.cpv-wavefx__particles-drift`, `.cpv-wavefx__gold-dust`, `.cpv-wavefx__grain` opacities reduced to sacred-level alphas.
- `.cpv-hero::before/::after` vignettes eased so the center gradient stays saturated like home hero.

## Ink/grey removal
- Page and hero backgrounds lighten ink mixes; vignette overlays trimmed to remove fog.
- Card and hero glass fills pushed toward `var(--smh-white)`/paper with minimal ink tint.

## MoodMap behaviour
- Mood variables now mostly drive border-image gradients, glow tint, shadow warmth/cool, and minor motion alpha (waves/particles/shimmer) instead of recolouring fills or canvases.

## Remaining minor differences
- Preview pages keep a slightly duskier base gradient tilt and softer edge vignette than the sacred homepage to preserve preview context, but hues/stack match the Champagne palette.

## Tests
- `node scripts/guard-rogue-hex.mjs`
- `pnpm brand:guard`
- `pnpm guard:hero`
- `node scripts/guard-manifest-sync.mjs`
- `node scripts/guard-preview-only.mjs` (expected to fail in this environment if `origin/main` is unavailable)
