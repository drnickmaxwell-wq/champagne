# Champagne CTA Systems Map

## System overview
- **Regal Glass–Gold (CTA System v2)** lives in `styles/champagne/cta-system-v2.css` and is pulled into the hero via `styles/champagne/hero-engine.css`. Primary pill uses `cta-primary-ink-light`; secondary glass outline uses `cta-secondary-glass-gold`; the hero CTA plate uses `cta-plate-glass-dusk`. These classes surface through `HeroCTABar` → `PreviewChampagneCTA` when presets supply the class names.【F:styles/champagne/cta-system-v2.css†L1-L22】【F:components/champagne/hero/HeroCTABar.tsx†L1-L31】【F:lib/champagne/hero-presets.ts†L1-L79】
- **Preview CTA module** (`components/preview/shared/PreviewChampagneCTA.tsx` + `preview-cta.module.css`) adds structural styling (`ctaBase`, `primary`, `secondary`, `primaryHero`, `secondaryHero`, `heroCTAGroup`) and leverages the Regal Glass–Gold tokens via CSS variables (e.g., `--cta-primary-bg-ink`, `--cta-border-gold`).【F:components/preview/shared/PreviewChampagneCTA.tsx†L1-L22】【F:components/preview/shared/preview-cta.module.css†L1-L83】
- **Legacy/other CTAs**: treatment preview sections (e.g., `TreatmentConsultationCta` / `TreatmentBreadcrumb` shells) exist but the primary Champagne hero CTAs route through the above v2 system; no alternative tone packs were found in the scanned preview/treatment heroes.

## Variant mapping
- **Primary (Regal ink pill)**: `cta-primary-ink-light` with ink background and gold border/shadow tokens; used by all hero presets (`primary` CTA class) and rendered through `PreviewChampagneCTA`.【F:lib/champagne/hero-presets.ts†L6-L166】【F:styles/champagne/cta-system-v2.css†L1-L9】
- **Secondary (Regal glass outline)**: `cta-secondary-glass-gold` with glass background + gold keyline; used by hero presets for secondary actions and by the preview CTA module’s secondary variant styling.【F:lib/champagne/hero-presets.ts†L6-L166】【F:styles/champagne/cta-system-v2.css†L10-L20】【F:components/preview/shared/preview-cta.module.css†L55-L78】
- **Hero CTA plate**: `hero-cta-plate cta-plate-glass-dusk` adds glass banding under CTA row; applied inside `HeroCTABar` to wrap `PreviewChampagneCTA` buttons. Tokens: champagne glass background, gold keyline, dusk shadow.【F:components/champagne/hero/HeroCTABar.tsx†L9-L31】【F:styles/champagne/hero-engine.css†L1-L21】【F:styles/champagne/cta-system-v2.css†L11-L20】

## Usage across canvases
- **Preview treatments (whitening, composite bonding)**: hero band wraps `HeroEngine` → CTA plate + Regal CTAs; pages reside under `/app/preview/treatments/**`.【F:components/preview/treatments/whitening/WhiteningHero.tsx†L1-L12】【F:components/preview/treatments/composite-bonding/CompositeBondingHero.tsx†L1-L12】
- **Preview shell**: `PreviewShell` supplies dusk theming and champagne preview CSS imports; CTA styles cascade via global imports in `app/preview/treatments/layout.tsx`.【F:app/preview/treatments/layout.tsx†L1-L26】
- **Other preview sections**: Additional CTAs in treatment sections likely reuse the preview CTA module; no conflicting CTA systems detected in scanned files, indicating CTA System v2 is the active standard for hero/treatment previews.
