# Preview Treatments Canvas Conflict Scan

This scan enumerates every background or text-colour rule that could influence preview treatment pages. Each entry notes the selector, the colour-related rule, and whether it is canvas-, hero-, or section-scoped.

## styles/preview/champagne-preview.css
- `.cpv-page` – neutral base with transparent background, on-dark text mix; **CANVAS-SCOPED**.
- `.cpv-page--champagne-dark` – sets dark Champagne gradient background, on-dark text, card/chip surfaces; **CANVAS-SCOPED**.
- `.cpv-page--champagne-dark::before/::after` – gradient overlays blending ink/magenta/teal for depth; **CANVAS-SCOPED**.
- `.cpv-hero` plus `.champagne-hero-surface`/wave layers – hero container background-image and wave overlays; **HERO-SCOPED**.

## styles/preview/treatments-preview.css
- `.treatment-rail__card` / `.treatment-deck__card` / `.howto-grid__item` / `.finance-band` / `.stories-grid__card` – multiple card and band backgrounds using card-surface gradients; **SECTION-SCOPED**.
- `.treatment-rail__tone` / `.treatment-deck__tone` – linear gradient tone overlays; **SECTION-SCOPED**.
- `.finance-band` gradient overlay with magenta/teal/gold mix; **SECTION-SCOPED**.
- `.cpv-btn-solid` / `.cpv-btn-outline` – button backgrounds and colour; **SECTION-SCOPED**.

## styles/preview/treatments-light.css
- `.tl-main` – radial gradient plus `var(--smh-gradient)` background for light treatments surface; **CANVAS-SCOPED** (used outside the treatments subtree).
- `.tl-header`, `.tl-section`, `.tl-chip`, `.tl-layer--*` – multiple light-surface backgrounds and colour rules; **SECTION-SCOPED**.

## styles/preview/treatments.css
- `.tp-main` – transparent canvas that inherits the shared dark Champagne background with on-dark text tokens; **CANVAS-SCOPED**.
- `.tp-shell`, `.tp-section`, `.tp-hero`, `.tp-chip` etc. – schema preview card, hero, and chip surfaces scoped to local sections; **SECTION-SCOPED**.

## components/preview/preview-layout.css
- `:global(.cpv-section)` – background mix, border, and shadow; **SECTION-SCOPED**.
- `:global(.cpv-card)`, `:global(.cpv-card--soft)`, `:global(.cpv-card--bright)` – card backgrounds and text colour; **SECTION-SCOPED**.
- `:global(.cpv-shell-dim)` – dimmed shell background and border; **SECTION-SCOPED**.

## components/preview/sections/treatments/preview-treatments.module.css
- `.previewCanvas :global(.cpv-card)` / `.treatment-rail__card` / `.treatment-deck__card` / `.howto-grid__item` – card backgrounds using surface mixes and borders; **SECTION-SCOPED**.
- `.previewCanvas :global(.finance-band)` – magenta/teal/gold gradient plus bright surface; **SECTION-SCOPED**.
- `.previewCanvas :global(.cpv-btn-solid)` / `.cpv-btn-outline)` – button backgrounds and colours; **SECTION-SCOPED**.

## components/preview/treatments/champagne-treatment-template.module.css
- `.shell`, `.shell::before` – layered gradients and glass texture backgrounds; **SECTION-SCOPED** (template container).
- `.hero`, `.heroGradient`, `.heroWave`, `.glassPanel` – hero band gradients, masks, and glass backgrounds; **HERO-SCOPED**.
- `.card`, `.storyCard`, `.techCard`, `.faqItem` – card/panel backgrounds using card/bg-ink mixes; **SECTION-SCOPED**.
- `.ctaBand` / `.ctaBand::before` – gradient overlays for CTA band; **SECTION-SCOPED**.
- `.stack`, `.tabPanel`, `.financePanel` – section panel backgrounds; **SECTION-SCOPED**.

## components/preview/treatments/whitening/whitening-preview.module.css
- `.heroBand::after` – bottom gradient using `var(--bg-ink)`; **HERO-SCOPED**.
- `.ratingCapsule`, `.tabButton`, `.treatmentCard`, `.faqCard`, `.financePanel`, `.heroWave` – chip, tab, card, panel, and hero wave backgrounds; **SECTION/HERO-SCOPED**.
- Typography colours `.eyebrow`, `.sectionTitle`, `.sectionLead`, `.heroSubcopy` – set on-dark text colours; **SECTION-SCOPED**.

## components/preview/treatments/composite-bonding/composite-bonding-preview.module.css
- Mirrors whitening module: `.heroBand::after` gradient, chip/tab/panel/card backgrounds, hero wave imagery, and text colours for headings/labels; **SECTION/HERO-SCOPED**.

## components/preview/treatments/ThreeDViewerSlot.module.css
- `.viewerSlot`, `.viewerSlot::before`, `.viewerScreen` – glass and gradient backgrounds with wave overlay; **SECTION-SCOPED**.

## styles/champagne/hero-engine.css
- `.hero-engine-shell.hero-frame.hero-tone--*` – tone-specific hero backgrounds (dawn/day/dusk/night) scoped to hero frame; **HERO-SCOPED**.
- `.hero-gradient-base` / `.hero-intensity-*` – hero surface gradients; **HERO-SCOPED**.
- `.hero-wave-layer`, `.hero-shimmer-layer`, `.hero-cta-plate` – wave/shimmer/CTA backgrounds and colours; **HERO-SCOPED**.

## app/preview/treatments/layout.tsx
- Layout wraps children with `className="cpv-page cpv-page--champagne-dark"` providing the shared canvas and data-treatment hook; **CANVAS-SCOPED**.
