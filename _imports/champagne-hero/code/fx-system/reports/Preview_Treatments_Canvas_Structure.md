# Preview Treatments Canvas Structure

## Wrapper stack by route

### /preview/treatments (hub)
- `app/preview/layout.tsx` → `<PreviewShell data-theme="preview-dusk" class="${styles.cpvShell} ...">`
- `components/preview/layout/PreviewShell` renders backdrop/particles within `.cpvShell` and wraps children in `.cpvInner`.
- `app/preview/treatments/layout.tsx` → `<div class="cpv-page cpv-page--champagne-dark cpv-page--treatments" data-treatment="general" data-preview-scope="treatments">`
- `app/preview/treatments/page.tsx` → `<div class="previewCanvas">` containing hero + `main.cpv-main` sections.

### /preview/treatments/whitening
- `app/preview/layout.tsx` → `PreviewShell` (as above).
- `app/preview/treatments/layout.tsx` → `div.cpv-page.cpv-page--champagne-dark.cpv-page--treatments` with `data-treatment="whitening"`.
- `app/preview/treatments/whitening/page.tsx` → `<div class="{styles.page}">` with hero band + `main.{styles.main}` sections.

### /preview/treatments/composite-bonding
- `app/preview/layout.tsx` → `PreviewShell` (as above).
- `app/preview/treatments/layout.tsx` → `div.cpv-page.cpv-page--champagne-dark.cpv-page--treatments` with `data-treatment="composite"`.
- `app/preview/treatments/composite-bonding/page.tsx` → `<div class="{styles.page}">` with hero band + `main.{styles.main}` sections.

### /preview/treatments/veneers
- `app/preview/layout.tsx` → `PreviewShell` (as above).
- `app/preview/treatments/layout.tsx` → `div.cpv-page.cpv-page--champagne-dark.cpv-page--treatments` with `data-treatment="veneers"`.
- `app/preview/treatments/veneers/page.tsx` → `<div class="{styles.page}">` rendered via `ChampagneTreatmentTemplate` hero + sections.

## Canvas ownership notes
- Primary canvas owner: `.cpv-page.cpv-page--champagne-dark.cpv-page--treatments` declared in `app/preview/treatments/layout.tsx`.
- Higher-level preview shell (`PreviewShell`) now defers its backdrop/particles and background when a treatments canvas is present, avoiding repaint collisions.
- No treatment pages add their own cpv-page or light-skin wrappers.

## Post-fix navigation expectations
- All listed routes render inside the shared treatments wrapper with classes `cpv-page cpv-page--champagne-dark cpv-page--treatments` and `data-preview-scope="treatments"`.
- Preview shell backgrounds/backdrops are disabled whenever a treatments canvas is present, so navigation between hub → whitening → composite → veneers → hub preserves the dark Champagne canvas.
- Hero tone classes remain applied to hero components only; no page-level tone classes are used on the canvas wrapper.
