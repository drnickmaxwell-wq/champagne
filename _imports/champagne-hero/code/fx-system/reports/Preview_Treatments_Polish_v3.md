# Preview Treatments Polish v3

## Updated preview pages
- /preview/treatments/veneers
- /preview/treatments/implants and /preview/treatments/dental-implants
- /preview/treatments/orthodontics
- /preview/treatments/whitening
- /preview/treatments/composite-bonding
- /preview/treatments/general
- /preview/treatments/cosmetic
- /preview/treatments/technology
- /preview/treatments/3d-dentistry

All pages now share the Champagne preview canvas layout, AnswerFirst-led benefits rail, 3D viewer slot, manifest-fed how-to steps and FAQs, finance band, tech highlight, stories teaser, and preview-only JSON-LD.

## Manifest consumption
- `lib/treatments/previewTreatmentConfig.ts` reads `config/seo/Treatments_Schema_Pack.json`, `config/seo/schema/Treatments_Schema_Pack_v2.json`, `config/seo/schema/Treatments_Schema_Pack_v3.json`, `config/seo/schema/Treatments_Breadcrumbs.json`, and `config/seo/Treatments_AnswerFirst_Copy.md`.
- `getPreviewTreatmentConfig(slug)` maps preview slugs to manifest routes, derives Service descriptions, HowTo steps, FAQ items, breadcrumbs, and AnswerFirst snippets, and returns schema graphs for preview JSON-LD.

## Safeguards
- Only preview routes and preview treatment components were touched; production routes and the core Champagne hero remain unchanged.
- Prefers-reduced-motion safety is maintained in the static 3D viewer slot and glass cards.

## TODO
- Swap the placeholder 3D slot with the real viewer when assets arrive.
- Expand AnswerFirst and schema pack coverage for additional treatment slugs beyond veneers, implants, and aligners.
