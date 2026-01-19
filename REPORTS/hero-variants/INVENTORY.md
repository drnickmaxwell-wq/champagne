# Hero Variant Inventory

## 1) Variant Declarations

| Variant ID | Manifest file | Surface overrides vs base defaults | Notes |
| --- | --- | --- | --- |
| default | packages/champagne-manifests/data/hero/sacred_hero_variants.json | matches base default surfaces |  |
| day | packages/champagne-manifests/data/hero/sacred_hero_variants.json | overrides surfaces (explicit values or nulls) | timeOfDay: day |
| hero_whitening | packages/champagne-manifests/data/hero/sacred_hero_variants.json | overrides surfaces (explicit values or nulls) | treatmentSlug: teeth-whitening |
| hero_implants | packages/champagne-manifests/data/hero/sacred_hero_variants.json | overrides surfaces (explicit values or nulls) | treatmentSlug: dental-implants |
| hero_aligners | packages/champagne-manifests/data/hero/sacred_hero_variants.json | overrides surfaces (explicit values or nulls) | treatmentSlug: spark-aligners |
| hero_veneers | packages/champagne-manifests/data/hero/sacred_hero_variants.json | overrides surfaces (explicit values or nulls) | treatmentSlug: porcelain-veneers |
| hero_technology | packages/champagne-manifests/data/hero/sacred_hero_variants.json | overrides surfaces (explicit values or nulls) | treatmentSlug: dental-technology |
| hero.variant.marketing_v1 | packages/champagne-manifests/data/hero/hero.variant.marketing_v1.json | overrides surfaces (explicit values or nulls) | allowedSurfaces present; filmGrain: {"enabled": true, "opacity": 0.18} |
| hero.variant.treatment_v1 | packages/champagne-manifests/data/hero/hero.variant.treatment_v1.json | overrides surfaces (explicit values or nulls) | allowedSurfaces present; filmGrain: {"enabled": false, "opacity": 0} |
| hero.variant.editorial_v1 | packages/champagne-manifests/data/hero/hero.variant.editorial_v1.json | overrides surfaces (explicit values or nulls) | allowedSurfaces present; filmGrain: {"enabled": true, "opacity": 0.12} |
| hero.variant.utility_v1 | packages/champagne-manifests/data/hero/hero.variant.utility_v1.json | overrides surfaces (explicit values or nulls) | allowedSurfaces present; filmGrain: {"enabled": false, "opacity": 0} |

## 2) Route → Hero Mapping

### 2.1 Machine manifest pages/treatments

| Route | Hero key | Category | Fallback if hero key missing |
| --- | --- | --- | --- |
| / | sacred_home_hero_v1 | hub | sacred_home_hero_v1 |
| /about | about_story_hero_v1 | hub | hero.variant.marketing_v1 |
| /blog | blog_intro_hero_v1 | editorial | hero.variant.editorial_v1 |
| /contact | contact_calm_hero_v1 | utility | hero.variant.utility_v1 |
| /dental-checkups-oral-cancer-screening | contact_calm_hero_v1 | site | hero.variant.marketing_v1 |
| /downloads | legal_simple_banner | utility | hero.variant.utility_v1 |
| /fees | contact_calm_hero_v1 | utility | hero.variant.utility_v1 |
| /finance | contact_calm_hero_v1 | utility | hero.variant.utility_v1 |
| /legal/accessibility | legal_simple_banner | legal | hero.variant.marketing_v1 |
| /legal/complaints | legal_simple_banner | legal | hero.variant.marketing_v1 |
| /legal/cookies | legal_simple_banner | legal | hero.variant.marketing_v1 |
| /legal/privacy | legal_simple_banner | legal | hero.variant.marketing_v1 |
| /legal/terms | legal_simple_banner | legal | hero.variant.marketing_v1 |
| /newsletter | legal_simple_banner | utility | hero.variant.utility_v1 |
| /patient-portal | patient_portal_placeholder_hero | utility | hero.variant.utility_v1 |
| /practice-plan | contact_calm_hero_v1 | utility | hero.variant.utility_v1 |
| /smile-gallery | smile_gallery_placeholder_hero | editorial | hero.variant.editorial_v1 |
| /team | team_preview_hero_v1 | hub | hero.variant.marketing_v1 |
| /team/nick-maxwell | team_preview_hero_v1 | profile | hero.variant.marketing_v1 |
| /team/sara-burden | team_preview_hero_v1 | profile | hero.variant.marketing_v1 |
| /team/sylvia-krafft | team_preview_hero_v1 | profile | hero.variant.marketing_v1 |
| /technology | contact_calm_hero_v1 | utility | hero.variant.utility_v1 |
| /treatments | treatment_neutral_hero_v1 | hub | hero.variant.marketing_v1 |
| /treatments/3d-dentistry-and-technology | treatment_tech_focus_hero_v1 | technology | hero.variant.marketing_v1 |
| /treatments/3d-digital-dentistry | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/3d-implant-restorations | implant_restorations_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/3d-printed-dentures | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/3d-printed-veneers | printed_veneers_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/3d-printing-lab | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/acrylic-dentures | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/anti-wrinkle-treatments | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/broken-chipped-cracked-teeth | emergency_support_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/bruxism-and-jaw-clenching | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/cbct-3d-scanning | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/childrens-dentistry | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/chrome-dentures | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/clear-aligners | clear_aligners_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/clear-aligners | clear_aligners_hero_v1 |  | hero.variant.marketing_v1 |
| /treatments/clear-aligners-spark | clear_aligners_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/composite-bonding | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/dental-abscess-infection | emergency_support_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/dental-bridges | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/dental-checkups-oral-cancer-screening | contact_calm_hero_v1 | site | hero.variant.marketing_v1 |
| /treatments/dental-crowns | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/dental-fillings | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/dental-retainers | orthodontics_balanced_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/dental-trauma-accidents | emergency_support_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/dentures | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/dermal-fillers | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/digital-smile-design | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/emergency-dental-appointments | emergency_support_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/emergency-dentistry | emergency_support_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/endodontics-root-canal | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/extractions-and-oral-surgery | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/facial-aesthetics | treatment_neutral_hero_v1 | hub | hero.variant.marketing_v1 |
| /treatments/facial-pain-and-headache | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/facial-therapeutics | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/failed-implant-replacement | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/fixed-braces | orthodontics_balanced_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/fixed-braces | orthodontics_balanced_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/full-smile-makeover | full_smile_makeover_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/home-teeth-whitening | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/implant-aftercare | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implant-consultation | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implant-retained-dentures | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implants | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/implants | treatment_neutral_hero_v1 |  | hero.variant.marketing_v1 |
| /treatments/implants-bone-grafting | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implants-full-arch | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implants-multiple-teeth | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implants-single-tooth | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/injection-moulded-composite | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/inlays-onlays | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/knocked-out-tooth | emergency_support_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/lost-crowns-veneers-fillings | emergency_support_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/mouthguards-and-retainers | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/nervous-patients | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/night-guards-occlusal-splints | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/orthodontics | orthodontics_balanced_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/painless-numbing-the-wand | painless_wand_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/peek-partial-dentures | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/periodontal-gum-care | periodontal_health_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/polynucleotides | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/preventative-and-general-dentistry | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/sedation-dentistry | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/sedation-for-implants | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/senior-mature-smile-care | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/severe-toothache-dental-pain | emergency_support_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/sinus-lift | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/skin-boosters | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/sports-mouthguards | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/teeth-in-a-day | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/teeth-whitening | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/teeth-whitening-faqs | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/therapeutic-facial-injectables | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/tmj-disorder-treatment | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/tmj-jaw-comfort | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/tooth-wear-broken-teeth | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/veneers | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/veneers | treatment_neutral_hero_v1 |  | hero.variant.marketing_v1 |
| /treatments/whitening-sensitive-teeth | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/whitening-top-ups | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /video-consultation | contact_calm_hero_v1 | utility | hero.variant.utility_v1 |

### 2.2 Public brand manifest pages

| Route | Hero key | Category | Fallback if hero key missing |
| --- | --- | --- | --- |
| / | sacred_home_hero_v1 | hub | sacred_home_hero_v1 |
| /about | about_story_hero_v1 | hub | hero.variant.marketing_v1 |
| /contact | contact_friendly_hero | utility | hero.variant.utility_v1 |
| /dental-checkups-oral-cancer-screening | contact_calm_hero_v1 | site | hero.variant.marketing_v1 |
| /finance | contact_calm_hero_v1 | utility | hero.variant.utility_v1 |
| /legal/privacy | legal_simple_banner | legal | hero.variant.marketing_v1 |
| /practice-plan | contact_calm_hero_v1 | utility | hero.variant.utility_v1 |
| /smile-gallery | gallery_showcase_hero | editorial | hero.variant.editorial_v1 |
| /treatments/3d-digital-dentistry | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/3d-implant-restorations | implant_restorations_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/3d-printed-dentures | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/3d-printed-veneers | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/3d-printing-lab | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/cbct-3d-scanning | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/childrens-dentistry | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/clear-aligners | clear_aligners_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/clear-aligners-spark | clear_aligners_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/dental-retainers | orthodontics_balanced_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/digital-smile-design | treatment_tech_focus_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/failed-implant-replacement | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/fixed-braces | orthodontics_balanced_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/implant-aftercare | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implant-consultation | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implant-retained-dentures | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implants | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implants-bone-grafting | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implants-full-arch | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implants-multiple-teeth | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/implants-single-tooth | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/inlays-onlays | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/night-guards-occlusal-splints | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/sedation-for-implants | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/sinus-lift | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/sports-mouthguards | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /treatments/teeth-in-a-day | implants_variant_hero_v3 | treatment | hero.variant.treatment_v1 |
| /treatments/veneers | treatment_neutral_hero_v1 | treatment | hero.variant.treatment_v1 |
| /video-consultation | contact_calm_hero_v1 | utility | hero.variant.utility_v1 |

### 2.3 Hero resolution wiring (read-only evidence)

- Hero manifests are normalized and assembled into the runtime manifest list (sacred variants + marketing/treatment/editorial/utility variants).
- Page/category-based defaults are resolved when a page manifest has no explicit hero key.
- Runtime selection picks explicit variantId, then treatmentSlug, then timeOfDay, then default.

## 3) Effective Render Check (surface equality to Sacred defaults)

Variants whose merged surface tokens match the Sacred base defaults:
- default (packages/champagne-manifests/data/hero/sacred_hero_variants.json)

## 4) Notes on defaults and fallbacks (read-only evidence)

- Page-level fallback: if a page manifest exists without an explicit hero key, defaults are derived from category (home → sacred_home_hero_v1; treatment/editorial/utility → hero.variant.*; other → hero.variant.marketing_v1).
- Registry-level fallback: if a hero lookup is missing, the registry returns the provided heroId unchanged.
- Treatment slug mismatch in runtime resolves to Sacred base surfaces (warning in non-production).