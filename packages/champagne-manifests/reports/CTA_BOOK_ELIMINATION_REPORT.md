# CTA_BOOK_ELIMINATION_REPORT

## Files updated
- packages/champagne-cta/src/CTARegistry.ts — added forbidden target guard and dev hard-fail with safe prod fallback.
- apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx — CTA resolution now passes page context into the sanitizer.
- packages/champagne-cta/src/ChampagneCTAGroup.tsx — CTA resolution includes component context for guard logging.
- packages/champagne-sections/src/Section_TreatmentClosingCTA.tsx — CTA resolution includes section context for guard logging.
- packages/champagne-manifests/data/hero/sacred_hero_base.json — canonical hero CTA retargeted to /contact.
- packages/champagne-manifests/reports/CTA_PATHWAY_MAP.md — removed retired booking route references.
- packages/champagne-manifests/reports/CTA_INVENTORY_IMPLANTS.md — removed consultation/booking phrasing that triggered the retired route pattern.
- packages/champagne-guards/scripts/guard-no-book.mjs — guard rewritten to detect the retired booking target without embedding the literal route.
- _imports/code/hero-components/components/preview/home/HomeHero.tsx — preview CTA retargeted to /contact.
- _imports/champagne-hero/code/hero-components/components/preview/home/HomeHero.tsx — preview CTA retargeted to /contact.
- _imports/champagne-hero/code/hero-engine/hero-components/components/preview/home/HomeHero.tsx — preview CTA retargeted to /contact.
- _imports/champagne-hero/code/fx-system/app/treatments/technology/components/TechnologyCTA.tsx — consultation CTA retargeted to /contact.
- _imports/champagne-hero/manus/notes/reports/Manus_Manifests_Snapshot.json — renamed legacy booking calendar reference.
- _imports/champagne-hero/manus/notes/public/brand/manus_import_unified_manifest_20251104.json — renamed legacy booking calendar reference.

## Retired route replacements
- All occurrences of the retired booking endpoint were replaced with /contact or descriptive text, depending on context.
- Legacy calendar references were renamed to consultation-calendar to remove the retired route fragment.
- Governance reports now reference the retired booking endpoint generically instead of citing the literal path.

## Validation
- rg "/book" ⇒ no matches (repository clean of retired booking target literals).
- CTA resolution layer now logs and throws (in dev) if any CTA attempts to target the retired booking endpoint, coercing the href to /contact in production.
