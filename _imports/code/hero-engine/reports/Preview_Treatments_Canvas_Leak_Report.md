# Preview Treatments Canvas Leak Report

## Canvas-Level Rules
- `styles/preview/champagne-preview.css` — `.cpv-page` keeps a transparent base; `.cpv-page--champagne-dark` is the sole canvas modifier applying the dark Champagne gradient stack and on-dark text variables.
- `styles/preview/dusk.css` — `[data-theme="preview-dusk"]` defines `background-color: var(--smh-ink)` and dark text defaults for the preview shell.
- `components/preview/layout/preview-shell.module.css` — `.cpvShell` applies a full-shell gradient background and text color; `.cpvBackdrop` layers additional radial gradients behind the shell.
- `styles/preview/champagne/page.css` — `.preview-champagne-frame` paints a full-page radial + linear gradient backdrop and on-dark text color.
- `styles/preview/treatments-light.css` — `.tl-main` paints a light radial + gradient background with on-light text and a `min-height: 100vh` wrapper for the treatments-light preview route.
- `styles/preview/treatments.css` — `.tp-main` now inherits a transparent canvas and on-dark text tokens while keeping local section styling for the schema preview route.
- `components/preview/treatments/champagne-treatment-template.module.css` — `.implantsCanvas` assigns a multi-stop radial/linear gradient background plus on-dark text/color variable overrides scoped to the treatment template wrapper.

## Hero-Level Rules
- `styles/champagne/hero-engine.css` — Tone classes such as `.hero-engine-shell.hero-frame.hero-tone--dawn|day|dusk|night` and `.hero-tonal-*`, `.hero-intensity-*` set hero-surface gradients, waves, and shimmer overlays on `.hero-engine-shell` and related hero layers.
- `components/preview/treatments/champagne-treatment-template.module.css` — `.whiteningHeroShell` and `.heroBand::after` add hero-only radial and linear gradients beneath the band.
- `components/preview/treatments/whitening/whitening-preview.module.css` — `.heroBand::after` provides a linear gradient footer glow within the hero band.
- `components/preview/treatments/composite-bonding/composite-bonding-preview.module.css` — `.heroBand::after` mirrors the hero footer gradient treatment within the composite hero band.

## Section-Level Rules
- `components/preview/treatments/whitening/whitening-preview.module.css` — panel surfaces (`.tabButton`, `.card`, `.section` children) use on-dark surface backgrounds and chip fills.
- `components/preview/treatments/composite-bonding/composite-bonding-preview.module.css` — panel, card, and chip selectors set layered surface backgrounds and gradients for local UI elements.
- `components/preview/treatments/champagne-treatment-template.module.css` — numerous section-specific selectors (`.glass`, `.howtoGrid`, `.financeCard`, `.testimonialShell`, etc.) define on-dark panel backgrounds and overlays without targeting the full page.
- `styles/preview/treatments-preview.css` & `components/preview/preview-layout.css` — card, rail, and finance band selectors apply localized backgrounds and keylines to interior panels only.
