# Preview Canvas Palette Correction Report

## Files Updated
- styles/preview/champagne/layers.css
- styles/preview/champagne/page.css
- styles/preview/champagne/footer.css
- styles/preview/home-champagne.css
- styles/preview/treatments-preview.css
- components/preview/preview-layout.css
- components/preview/sections/treatments/preview-treatments.module.css
- components/preview/sections/technology/preview-technology.module.css
- styles/champagne/footer-preview.css

## Non-brand Colours Removed/Replaced
- Removed hard-coded black/white hex mixes in hero layers, cards, and controls, replacing them with ink tokens (`--smh-ink`, `--smh-ink-soft`) and champagne text variables.
- Replaced bright paper-based gradients and radial washes with controlled magenta → teal → gold bands that sit over ink backgrounds.
- Converted neon chip/button highlights to token-driven gradients with subdued opacities and gold keyline borders.

## Page Notes
### Preview Home
- Shifted page zones from parchment gradients to ink-led backgrounds with a single champagne hero wash and softened ambient overlay. Gold is limited to a thin accent in the hero blend while subsequent zones stay dusk-toned glass.

### Treatments Hub
- Unified all `.cpv-card` surfaces to ink-glass mixes with gold keylines; removed rainbow radials from concern rails, how-to steps, and finance chips. Finance CTA now carries the only strong gradient band (magenta → teal → gold), while other sections ride on ink backgrounds.

### Technology Treatment Page
- Rebased the entire page onto ink/dusk gradients, aligning cards, workflow steps, equipment tiles, and stats with the shared glass surface. The closing CTA keeps the canonical gradient while viewer/stat blocks now use calm ink glass without neon overlays.
