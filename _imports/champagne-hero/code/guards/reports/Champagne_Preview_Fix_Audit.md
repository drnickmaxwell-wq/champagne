# Champagne Preview Fix Audit

## Files Changed
- styles/preview/champagne-preview.css
- reports/Champagne_Preview_Fix_Audit.md

## Hero Before/After
- **Before:** Hero surfaces layered the canonical gradient with an ink overlay and variable wave opacity, tinting the background away from the unmodified Champagne Canon.
- **After:** Hero surfaces stay on the canonical gradient (`linear-gradient(135deg, var(--brand-magenta) 0%, var(--brand-teal) 60%, var(--brand-gold) 100%)`), add a subtle ink vignette, and raise the wave visibility to 0.18 opacity while keeping the inner hero glass lighter and more neutral via soft white/ink mixing.

## Cards Before/After
- **Before:** Cards stacked multiple dusk gradients and radial accents over teal-leaning mixes, with lighter blur and extra overlays.
- **After:** Large cards now sit on the canonical gradient with layered ink dusk vignettes; subcards, FAQs, and link cards keep the canon gradient but lighten locally with soft white/ink veils to read as glass atop darker panels. Blur remains at 24px and no texture URLs are applied to cards.

## Canon Confirmation
- All preview gradients now reference the Champagne Canon string exactly where used.
- No changes were made to `styles/tokens/smh-champagne-tokens.css`.
- No new hex values were introduced; guards confirm the palette remains token-only.

## Guard Status
- `pnpm guard:rogue-hex`
- `pnpm brand:guard`
- `pnpm guard:hero`
- `pnpm guard:preview-only`
