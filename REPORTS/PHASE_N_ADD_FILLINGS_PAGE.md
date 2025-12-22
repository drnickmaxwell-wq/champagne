# Phase N — Dental fillings page

## Slug & manifest locations
- Slug: `/treatments/dental-fillings`
- Section manifest: `packages/champagne-manifests/data/sections/smh/treatments.dental-fillings.json`
- Machine registry entry: `packages/champagne-manifests/data/champagne_machine_manifest_full.json`

## Registration check
- Added the dental fillings page to the machine manifest with `category: "treatment"` so `getTreatmentPages()` discovers it.
- Included the section layout in `champagneSectionLayouts` and the treatment hub restorative group for directory visibility.

## CTA routing examples (all resolve to `/treatments/dental-fillings`)
1. `Review dental fillings` → `/treatments/dental-fillings` (periodontal gum care secondary CTA target).
2. `Dental fillings options` → `/treatments/dental-fillings` (CTA intent mapping on the fillings page).
3. `Review fillings intent CTA` → `/treatments/dental-fillings` (mid-page intent from the fillings journey).
4. `Review restorative fillings` → `/treatments/restorative-fillings` (alias resolves to the fillings page).
5. `Explore fillings` → `/treatments/fillings` (alias resolves to the fillings page).
6. `Compare composite and amalgam fillings` → `/treatments/dental-fillings` (CTA intent label truth normalises to the fillings path).
7. `Dental fillings overview` → `/treatments/dental-fillings?intent=review_fillings_options` (query preserved, path resolves to fillings page).
8. `Plan a fillings visit` → `/treatments/dental-fillings` (CTA labels using the slug stay on the fillings page).
9. `Fillings appointment details` → `/treatments/dental-fillings` (destination title helper keeps this slug instead of onlays).
10. `Restorative fillings review` → `/treatments/dental-fillings` (label truth prevents fallback to onlays and keeps the fillings slug).
