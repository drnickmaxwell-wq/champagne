# Champagne Skeleton v1 Report

## Files Created
- components/layout/ChampagneLayout.tsx
- components/navigation/ChampagneHeader.tsx
- components/navigation/ChampagneMobileNav.tsx
- components/navigation/ChampagneFooter.tsx
- components/navigation/champagne-nav.module.css
- components/hero/ChampagneHero.tsx
- styles/champagne/hero-skeleton.css
- components/card/card-skeleton.module.css
- components/card/TreatmentCard.tsx
- components/card/AIWidgetCard.tsx
- components/card/TestimonialCard.tsx
- components/card/TeamCard.tsx
- components/cta/ChampagneCTA.tsx
- components/cta/champagne-cta.module.css
- components/faq/ChampagneFAQ.tsx
- components/faq/champagne-faq.module.css
- components/testimonial/ChampagneTestimonial.tsx
- components/testimonial/ChampagneTestimonialCarousel.tsx
- components/testimonial/champagne-testimonial-carousel.module.css
- components/ai-tools/CostEstimator.tsx
- components/ai-tools/TimePredictor.tsx
- components/ai-tools/ARSmileTryOn.tsx
- components/ai-tools/AIWidgetTrio.tsx
- components/3d/Champagne3DViewer.tsx
- app/preview/skeleton/page.tsx
- app/preview/skeleton/skeleton-preview.module.css

## Existing Files Touched
- None. All additions are new scaffolding files.

## Skeleton Overview
- **Layout**: `ChampagneLayout` wraps pages with the new `ChampagneHeader` and `ChampagneFooter` scaffolds. Header includes a basic link set plus mobile toggle with `ChampagneMobileNav` placeholder panel.
- **Hero**: `ChampagneHero` accepts eyebrow, title, subtitle, CTA pair, optional badge, and feature flags for wave/particles/grain placeholders. It includes layer wrappers ready for gradients/masks and supports an optional aside slot.
- **Card System**: Shared `card-skeleton.module.css` defines `cp-card` base plus hooks for card types. Treatment, AI widget, testimonial, and team cards share spacing, typography hooks, and CTA/link affordances.
- **CTA System**: `ChampagneCTA` renders primary, secondary, or paired actions with token-based styling hooks for later theming.
- **FAQ**: `ChampagneFAQ` provides an accessible accordion (button triggers with aria-expanded/controls) supporting multiple open items.
- **Testimonials**: `ChampagneTestimonial` wraps the shared testimonial card; `ChampagneTestimonialCarousel` manages index state with previous/next controls and progress meta (manual only, no auto-rotate).
- **AI Tools Trio**: `AIWidgetTrio` composes `CostEstimator`, `TimePredictor`, and `ARSmileTryOn`, each using the AI widget card skeleton with placeholder copy.
- **3D Viewer**: `Champagne3DViewer` offers a framed placeholder box for future 3D content alongside title/description hooks.

## Preview Skeleton Page
- Added `app/preview/skeleton/page.tsx` using `ChampagneLayout` to assemble the hero, treatment card grid, AI tools trio, 3D viewer with companion text card, testimonial carousel, FAQ accordion, and paired CTA.
- Use `/preview/skeleton` to manually inspect structure; spacing and grid helpers live in `skeleton-preview.module.css` while visual styling remains neutral for later theming.

## Tests & Guards
- `pnpm test` (pass)
- `pnpm brand:guard` (pass)
- `node scripts/guard-rogue-hex.mjs` (pass)
- `node scripts/guard-preview-only.mjs` (fails: repository lacks origin/main ref, pre-existing environment limitation)
- `node scripts/guard-manifest-sync.mjs` (pass)
- `node scripts/guard-asset-size.mjs` (fails: repository lacks origin/main ref, pre-existing environment limitation)
