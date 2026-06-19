# Champagne Runtime Truth Report V1

Generated: 2026-06-19T08:33:22.535Z

## Executive verdict

PARTIAL: runtime route and SEO safety coverage exists, but most treatment pages are not rewrite-ready because answer-surface coverage is incomplete.

## Truth coverage

- Truth coverage: 100%
- Routes inventoried: 118
- Treatment pages: 79
- Treatment families: 9
- Location pages: 0
- Answer surfaces complete: 12/79

## Guard coverage

- guard:seo-launch-safety: covered
- guard:canon: covered
- guard:treatment-answer-surface: covered
- SECTION_KIND_COMPATIBILITY_GUARD_V1: covered
- LOCAL_ANTI_DOORWAY_GUARD_V1: covered
- COMPARISON_PAGE_GUARD_V1: covered
- COST_FEE_PAGE_GUARD_V1: covered
- EVIDENCE_REVIEW_METADATA_CONTRACT_V1: covered

## Schema inventory

- Sitemap: READY
- Robots: READY
- Treatment route schema scripts are checked per page in CHAMPAGNE_TREATMENT_PAGE_TRUTH_MATRIX_V1.json.

## Cannibalisation inventory

- /treatments/retainers -> /treatments/dental-retainers
- /treatments/dental-implants -> /treatments/implants
- /treatments/hygiene -> /treatments/preventative-and-general-dentistry
- /treatments/3d-printed-implant-restorations -> /treatments/3d-implant-restorations
- /treatments/fillings -> /treatments/dental-fillings
- /treatments/restorative-fillings -> /treatments/dental-fillings
- /dental-checkups-oral-cancer-screening -> /treatments/dental-checkups-oral-cancer-screening

## Exact blocker list

- NO_CLEAN_LAUNCH_ASSERTION: This export is an evidence layer only and does not certify clean launch readiness.
- LAUNCH_EXCLUDED_ROUTES_PRESENT: Debug/internal/API/private routes are present and must stay launch-excluded.
- CONTENT_READINESS_NOT_GREEN: Content readiness report contains POLISH/REWRITE routes.
- TREATMENT_PAGE_NOT_READY (/treatments/implants): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/veneers): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/clear-aligners): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/clear-aligners-spark): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/fixed-braces): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/dental-checkups-oral-cancer-screening): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/implants-single-tooth): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/implants-multiple-teeth): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/implants-full-arch): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/implant-retained-dentures): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/implant-consultation): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/implants-bone-grafting): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/sinus-lift): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/teeth-in-a-day): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/sedation-for-implants): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/failed-implant-replacement): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/implant-aftercare): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/surgically-guided-implants): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/3d-implant-restorations): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/3d-printed-veneers): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/composite-bonding): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/injection-moulded-composite): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/dental-bridges): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/dental-crowns): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/teeth-whitening): Conversion/CTA evidence not discovered in export
- TREATMENT_PAGE_NOT_READY (/treatments/home-teeth-whitening): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/whitening-top-ups): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/whitening-sensitive-teeth): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/teeth-whitening-faqs): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export; Local SEO wording not detected in extracted page text
- TREATMENT_PAGE_NOT_READY (/treatments/orthodontics): Treatment answer-surface incomplete or absent; Conversion/CTA evidence not discovered in export

## Recommended first rewrite batch

- /treatments/clear-aligners-spark
- /treatments/implants-full-arch
- /treatments/implants-bone-grafting
- /treatments/sedation-for-implants
- /treatments/surgically-guided-implants
- /treatments/3d-printed-veneers
- /treatments/home-teeth-whitening
- /treatments/whitening-top-ups
- /treatments/whitening-sensitive-teeth
- /treatments/teeth-whitening-faqs
- /treatments/orthodontics
- /treatments/emergency-dentistry
