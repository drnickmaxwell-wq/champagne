# Preview Treatments Canvas Wiring — Before Changes

## Layout + Route Wrappers
- **app/preview/treatments/layout.tsx** — wraps children with `className="cpv-page cpv-page--champagne-dark"` and sets `data-treatment` based on params (canvas-level dark skin owner).
- No other `layout.tsx` files under `/app/preview/treatments/**`.

## Page-Level Imports / Canvas Touchpoints
- **app/preview/treatments/page.tsx** — imports preview layout + typography CSS and `styles/preview/treatments-preview.css` in addition to the shared layout (duplicate global preview imports).
- **app/preview/treatments/whitening/page.tsx** — imports `champagne-preview.css` and `preview-typography.css` locally despite layout handling canvas CSS; wraps content in `div` with module class (no extra canvas classes).
- **app/preview/treatments/composite-bonding/page.tsx** — same duplicate preview imports as whitening; uses `div` with module class (no canvas class).
- **app/preview/treatments/[slug]/page.tsx** — imports `styles/preview/treatments.css`; top-level `<main className="tp-main">` sets background: transparent and `color: var(--tp-body)` (canvas-level text + padding), with section shells defined in the same CSS.

## Canvas-Level CSS Rules
- **styles/preview/champagne-preview.css**
  - `.cpv-page` — neutral base: `background: transparent; color` via on-dark mixes; provides spacing and flex layout (canvas-level).
  - `.cpv-page--champagne-dark` — sole dark Champagne gradient/overlay + on-dark text tokens (canvas-level background owner for treatments).
- **styles/preview/treatments.css**
  - `.tp-main` — `background: transparent; color: var(--tp-body); min-height: 100vh; padding…` (canvas-level main wrapper for schema preview page), no light fill.
  - `.tp-section` and related `.tp-*` classes — sectional surfaces/grids (section-level), no page-wide repaint.
- **styles/preview/treatments-preview.css** — card/rail styling only (section-level), no canvas repaint.
- **styles/preview/treatments-light.css** — defines light skin variables and `.tl-main` background for the dedicated `/preview/treatments-light` route; not imported under `/preview/treatments/**`.

## Hero Engine Scoping
- **styles/champagne/hero-engine.css** — tone classes (`.hero-tone--dawn/day/dusk/night`, `.hero-tonal-*`, `.hero-intensity-*`) scoped to `.hero-engine-shell.hero-frame` backgrounds and hero sublayers; no selectors target `.cpv-page`, `body`, or layout wrappers (hero-level only).

## Other Component-Level Notes
- **components/preview/treatments/ChampagneTreatmentTemplate.tsx** and hero components use local CSS modules only; no cpv-page/tl-main wrappers.
- **components/preview/preview-layout.css** — global `.cpv-section/.cpv-card` styling (section-level), no canvas background.
- **styles/preview/treatments-light.css** references `.tl-main` (light skin) but only wired via `/app/preview/treatments-light/page.tsx` outside the treatments subtree.

