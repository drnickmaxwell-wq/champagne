# Manifest Inventory

## packages/champagne-manifests/data (core)
- `champagne_machine_manifest_full.json` — Machine manifest (pages + treatments); runtime-wired via `core.ts`.
- `manifest.nav.main.json` — Navigation manifest; runtime-wired via `core.ts` and header/footer.
- `manifest.public.brand.json` — Public brand manifest; loaded into manifest registry (runtime-accessible).
- `manifest.styles.champagne.json` — Styles manifest (hero/section presets); runtime-wired for hero and section style lookups.
- `manus_import_unified_manifest_20251104.json` — Manus import bundle; registered in runtime manifest registry.
- `journey.smile-makeover.json` — Journey manifest; exposed via journey helpers.
- `media-decks/media-deck.implants.json` — Media deck manifest; exposed via media deck helpers.

## Section defaults and library
- `sections/page-type.defaults.json` — Page-type → default section ordering; runtime-wired.
- `sections/section-fx.defaults.json` — Section FX defaults; runtime-wired.
- `sections/section-prm.defaults.json` — PRM (reduced motion) defaults; runtime-wired.
- `sections/section-library.json` — Section component registry metadata; runtime-wired.

## SMH section layout manifests
- Runtime-imported layouts (available to section resolver):
  - `treatments.aligners.json`
  - `treatments.clear-aligners.json`
  - `treatments.clear-aligners-spark.json`
  - `treatments.implants-teeth-in-a-day.json`
  - `treatments.implants-aftercare.json`
  - `treatments.implants-bone-grafting.json`
  - `treatments.implants-consultation.json`
  - `treatments.implants-full-arch.json`
  - `treatments.dentures.json`
  - `treatments.acrylic-dentures.json`
  - `treatments.chrome-dentures.json`
  - `treatments.peek-partial-dentures.json`
  - `treatments.implants-retained-dentures.json`
  - `treatments.implants-multiple-teeth.json`
  - `treatments.implants-failed-replacement.json`
  - `treatments.implants-sedation.json`
  - `treatments.implants-sinus-lift.json`
  - `treatments.implants-single-tooth.json`
  - `treatments.implants.json`
  - `treatments.fixed-braces.json`
  - `treatments.3d-digital-dentistry.json`
  - `treatments.night-guards-occlusal-splints.json`
  - `treatments.sports-mouthguards.json`
  - `treatments.dental-retainers.json`
  - `treatments.3d-printed-dentures.json`
  - `treatments.3d-printed-veneers.json`
  - `treatments.3d-implant-restorations.json`
  - `treatments.3d-printing-lab.json`
  - `treatments.digital-smile-design.json`
  - `treatments.cbct-3d-scanning.json`
  - `treatments.dental-bridges.json`
  - `treatments.dental-crowns.json`
  - `treatments.inlays-onlays.json`
  - `treatments.orthodontics.json`
  - `treatments.painless-numbing-the-wand.json`
  - `treatments.nervous-patients.json`
  - `treatments.sedation-dentistry.json`
  - `treatments.preventative-and-general-dentistry.json`
  - `treatments.senior-mature-smile-care.json`
  - `treatments.veneers.json`
  - `treatments.tmj-jaw-comfort.json`
- Present but not imported into the runtime layout list (rendered only if a page manifest carries inline sections):
  - `treatments.3d-dentistry-and-technology.json`
  - `treatments.childrens-dentistry.json`
  - `treatments.home-teeth-whitening.json`
  - `treatments.periodontal-gum-care.json`
  - `treatments.teeth-whitening-faqs.json`
  - `treatments.teeth-whitening.json`
  - `treatments.whitening-sensitive-teeth.json`
  - `treatments.whitening-top-ups.json`

## Hero manifests
- Sacred hero manifests: `hero/sacred_hero_base.json`, `hero/sacred_hero_surfaces.json`, `hero/sacred_hero_variants.json`, `hero/sacred_hero_weather.json` — runtime-wired through hero adapter.
- Hero variant manifests: `hero/hero.variant.marketing_v1.json`, `hero/hero.variant.treatment_v1.json`, `hero/hero.variant.editorial_v1.json`, `hero/hero.variant.utility_v1.json` — runtime hero presets.

## Apps/** manifests
- None present beyond package metadata JSON.

## _imports (reference only)
- `_imports/champagne-hero/**` diagnostic/reference JSON (fx guards audit, repo audits).
- `_imports/code/hero-engine/**` diagnostic/reference JSON (director control, CTA systems map, hero diagnostics, freeze hashes).
- `_imports/champagne-hero/docs/brand/champagne_machine_manifest_full.json` — reference snapshot, not runtime-wired.
