## Files Updated
- styles/preview/champagne-preview.css

## Hero Background Before/After
- Before: Preview heroes used a token-derived gradient but were muted by darker ink mixes and a lower-opacity wave mask sourced from `/brand/waves-bg-1600.webp`.
- After: Heroes now pull the canonical Champagne gradient (`var(--smh-gradient)`, 135° magenta→teal→gold) with a single soft-light wave texture from `/brand/waves-bg-1920.webp` plus a lighter ink glass base, keeping the wave visible while preserving vivid colour.

## Card Background Before/After
- Before: Luxe cards relied on heavy ink mixes and layered gradients that pushed the surfaces toward flat, near-black panels with limited Champagne colour.
- After: Cards use refreshed smoked-ink glass gradients built from the magenta/teal/gold tokens with softened gold keylines, allowing subtle rim-light colour while maintaining dark ink readability across hubs and detail sections.

## Token Usage
- Primary hues now draw directly from the canonical set: #C2185B (magenta), #40C4B4 (teal), #D4AF37 (gold), #F9E8C3 (soft gold), #0B0D0F (ink), and #FFFFFF for text/highlights.
- No additional brand colours were introduced; gradients and keylines are composed via existing token variables and color-mix overlays.

## After v2 Adjustments
- Hero surfaces now use the canonical magenta→teal→gold gradient with the single soft-light `/brand/waves-bg-1920.webp` texture at low opacity, ensuring the wave is visible without muting colour.
- Preview cards share a refreshed ink-to-Champagne gradient with ink mixing capped at 40% and a soft-gold keyline, restoring the dusk glow without brown casts.
