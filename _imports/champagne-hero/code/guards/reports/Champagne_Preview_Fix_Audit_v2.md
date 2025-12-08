# Champagne Preview Fix Audit v2

## Files Changed
- `styles/preview/champagne-preview.css`
- `reports/Champagne_Preview_Fix_Audit_v2.md`

## Hero Before/After
- **Before:** Preview heroes layered extra ink/multiply overlays that muted the canonical gradient and softened the wave texture.
- **After:** Heroes now rely solely on the canonical gradient (`linear-gradient(135deg, var(--brand-magenta) 0%, var(--brand-teal) 60%, var(--brand-gold) 100%)`) with the wave layer lifted to ~0.82 opacity via a screen blend and no ink overlays, while the glass card uses a brighter white-and-soft-gold mix plus a stronger float shadow to mirror the home hero.

## Card Surfaces Before/After
- **Before:** Large preview cards and tiles used full-gradient fills with heavy teal/magenta presence, competing with the hero brightness.
- **After:** Cards shift to smoked-glass interiors built from softer white mixes (no full-card gradients) with only 1–2px canonical gradient borders; tiles and FAQs stay lighter than their parent panels without teal/magenta flooding.

## Canonical + Guard Compliance
- All gradients that reference Champagne canon use the exact string above.
- No new hex codes were added; token file `styles/tokens/smh-champagne-tokens.css` remains unchanged.
- Updates stay confined to the preview stylesheet and audit note.
