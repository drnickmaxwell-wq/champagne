# Preview Theme Runtime Audit

## Theme mutation functions (JS/TS)

- **`PreviewShell` component — `components/preview/layout/PreviewShell.tsx`**
  - Wraps preview content in a shell div that sets `data-theme="preview-dusk"` and applies the `cpvShell` class (no `classList` calls).
  - Does **not** change `data-preview-scope`, and it does **not** add/remove `cpv-page*` or `preview-*` classes programmatically.
  - Does **not** attach any router or navigation listeners.

- **`PreviewTreatmentsLayout` component — `app/preview/treatments/layout.tsx`**
  - Layout wrapper that renders a div with classes `cpv-page cpv-page--champagne-dark cpv-page--treatments` and sets `data-preview-scope="treatments"` plus a `data-treatment` slug.
  - Does **not** mutate `data-theme` on `<html>` or `<body>`; all attributes are set declaratively on the wrapper element.
  - No `classList` usage or router/navigation hooks.

## Theme/scope selectors (CSS)

- **Canvas/shell-level selectors**
  - `styles/preview/dusk.css` — `[data-theme="preview-dusk"]` and nested selectors provide full-page dark preview shell styling (min-height 100vh, background color, sticky header, glass pane, wave overlays); canvas-level.
  - `styles/brand/theme-manager.css` — `:root[data-theme="light"]`, `:root[data-theme="dark"]`, and derivatives (including `.idle-mode` waves) define global theme tokens and transitions affecting the whole document canvas.
  - `styles/champagne/time-of-day.css` — `:root[data-theme='dawn'|'dusk'|'night']` sets global background ink variables; canvas-level.

- **Section-level selectors**
  - `styles/brand/lighting-effects.css` — `:root[data-theme="dark"]` variants for `.subsurface-glow::before`, `.iridescent-text`, `.depth-bloom`, `.card-reflection::after`, `.shimmer-particle`, `.cta-hover-lift:hover`, `.film-grain-overlay`; targeted lighting/particle effects used within sections.
  - `styles/brand/lux-glass.css` — `:root[data-theme="dark"] .lux-glass` adjusts a specific glass component appearance; section-level.
  - `components/faq/faq-accordion.css` — `:root[data-theme="dark"] .faq-content p` tweaks FAQ text color; section-level.
  - `app/treatments/technology/components/equipment-gallery.css` — `[data-theme="dark"] .equipment-card:hover` intensifies hover glow inside the technology equipment gallery; section-level.
  - `app/treatments/technology/components/technology-hero.css` — `[data-theme="dark"] .cta-primary` and hover variant deepen CTA shadowing within the technology hero; section-level.
