# Effective Hero Variant Map

Canonical source: `packages/champagne-manifests/data/champagne_machine_manifest_full.json` (pages + treatments).
Hero runtime selection: `apps/web/app/layout.tsx` → `HeroMount` → `HeroRenderer`/`HeroRendererV2` → `getHeroRuntime`.

**Legend (flags)**
- `DUPLICATE_ROUTE`: same path appears multiple times across machine manifest collections.
- `MISSING_EXPLICIT_HERO`: page manifest has no explicit `hero` key; fallback hero key applied.
- `FALLBACK_TO_BASE_SURFACES`: treatment slug has no matching sacred hero variant → runtime drops to base surfaces.

| Route | Category (runtime) | Explicit hero key | Fallback hero key (if no explicit) | Resolved heroId / variantId (runtime) | Flags | Sources |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | home | `sacred_home_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:home |
| `/about` | utility | `about_story_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:about |
| `/blog` | editorial | `blog_intro_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:blog |
| `/contact` | utility | `contact_calm_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:contact |
| `/dental-checkups-oral-cancer-screening` | site | `contact_calm_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:dental_checkups_oral_cancer_screening |
| `/downloads` | utility | `legal_simple_banner` | `—` | `sacred-home-hero / default` | — | pages:downloads |
| `/fees` | utility | `contact_calm_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:fees |
| `/finance` | utility | `contact_calm_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:finance |
| `/legal/accessibility` | legal | `legal_simple_banner` | `—` | `sacred-home-hero / default` | — | pages:accessibility |
| `/legal/complaints` | legal | `legal_simple_banner` | `—` | `sacred-home-hero / default` | — | pages:complaints |
| `/legal/cookies` | legal | `legal_simple_banner` | `—` | `sacred-home-hero / default` | — | pages:cookies |
| `/legal/privacy` | legal | `legal_simple_banner` | `—` | `sacred-home-hero / default` | — | pages:privacy |
| `/legal/terms` | legal | `legal_simple_banner` | `—` | `sacred-home-hero / default` | — | pages:terms |
| `/newsletter` | utility | `legal_simple_banner` | `—` | `sacred-home-hero / default` | — | pages:newsletter |
| `/patient-portal` | utility | `patient_portal_placeholder_hero` | `—` | `sacred-home-hero / default` | — | pages:patient_portal |
| `/practice-plan` | utility | `contact_calm_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:practice_plan |
| `/smile-gallery` | utility | `smile_gallery_placeholder_hero` | `—` | `sacred-home-hero / default` | — | pages:smile_gallery |
| `/team` | utility | `team_preview_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:team |
| `/team/nick-maxwell` | profile | `team_preview_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:team_nick_maxwell |
| `/team/sara-burden` | profile | `team_preview_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:team_sara_burden |
| `/team/sylvia-krafft` | profile | `team_preview_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:team_sylvia_krafft |
| `/technology` | utility | `contact_calm_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:technology_hub |
| `/treatments` | utility | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:treatments_hub |
| `/treatments/3d-dentistry-and-technology` | treatment | `treatment_tech_focus_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:3d_dentistry_and_technology |
| `/treatments/3d-digital-dentistry` | treatment | `treatment_tech_focus_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:technology_digital_dentistry |
| `/treatments/3d-implant-restorations` | treatment | `implant_restorations_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:3d_implant_restorations |
| `/treatments/3d-printed-dentures` | treatment | `treatment_tech_focus_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:printed_dentures_3d |
| `/treatments/3d-printed-veneers` | treatment | `printed_veneers_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:3d_printed_veneers |
| `/treatments/3d-printing-lab` | treatment | `treatment_tech_focus_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:3d_printing_lab |
| `/treatments/acrylic-dentures` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:acrylic_dentures |
| `/treatments/anti-wrinkle-treatments` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:anti_wrinkle_treatments |
| `/treatments/broken-chipped-cracked-teeth` | treatment | `emergency_support_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:emergency_broken_chipped_teeth |
| `/treatments/bruxism-and-jaw-clenching` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:bruxism_jaw_clenching |
| `/treatments/cbct-3d-scanning` | treatment | `treatment_tech_focus_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:cbct_3d_scanning |
| `/treatments/childrens-dentistry` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:childrens_dentistry |
| `/treatments/chrome-dentures` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:chrome_dentures |
| `/treatments/clear-aligners` | treatment | `clear_aligners_hero_v1` | `—` | `sacred-home-hero / (base)` | DUPLICATE_ROUTE, FALLBACK_TO_BASE_SURFACES | pages:clear_aligners, treatments:clear_aligners |
| `/treatments/clear-aligners-spark` | treatment | `clear_aligners_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:clear_aligners_spark |
| `/treatments/composite-bonding` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:composite_bonding |
| `/treatments/dental-abscess-infection` | treatment | `emergency_support_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:emergency_dental_abscess |
| `/treatments/dental-bridges` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:dental_bridges |
| `/treatments/dental-checkups-oral-cancer-screening` | treatment | `contact_calm_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:dental_checkups_oral_cancer_screening_treatments |
| `/treatments/dental-crowns` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:dental_crowns |
| `/treatments/dental-fillings` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:dental_fillings |
| `/treatments/dental-retainers` | treatment | `orthodontics_balanced_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:dental_retainers |
| `/treatments/dental-trauma-accidents` | treatment | `emergency_support_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:emergency_dental_trauma |
| `/treatments/dentures` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:dentures |
| `/treatments/dermal-fillers` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:dermal_fillers |
| `/treatments/digital-smile-design` | treatment | `treatment_tech_focus_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:digital_smile_design |
| `/treatments/emergency-dental-appointments` | treatment | `emergency_support_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:emergency_dental_appointments |
| `/treatments/emergency-dentistry` | treatment | `emergency_support_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:emergency_dentistry |
| `/treatments/endodontics-root-canal` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:endodontics_root_canal |
| `/treatments/extractions-and-oral-surgery` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:extractions_and_oral_surgery |
| `/treatments/facial-aesthetics` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:facial_aesthetics |
| `/treatments/facial-pain-and-headache` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:facial_pain_headache |
| `/treatments/facial-therapeutics` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:facial_therapeutics |
| `/treatments/failed-implant-replacement` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_failed_replacement |
| `/treatments/fixed-braces` | treatment | `orthodontics_balanced_hero_v1` | `—` | `sacred-home-hero / (base)` | DUPLICATE_ROUTE, FALLBACK_TO_BASE_SURFACES | pages:fixed_braces, treatments:fixed_braces |
| `/treatments/full-smile-makeover` | treatment | `full_smile_makeover_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:full_smile_makeover |
| `/treatments/home-teeth-whitening` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:home_teeth_whitening |
| `/treatments/implant-aftercare` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_aftercare |
| `/treatments/implant-consultation` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_consultation |
| `/treatments/implant-retained-dentures` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implant_retained_dentures |
| `/treatments/implants` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | DUPLICATE_ROUTE, FALLBACK_TO_BASE_SURFACES | pages:implants, treatments:implants |
| `/treatments/implants-bone-grafting` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_bone_grafting |
| `/treatments/implants-full-arch` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_full_arch |
| `/treatments/implants-multiple-teeth` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_multiple_teeth |
| `/treatments/implants-single-tooth` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_single_tooth |
| `/treatments/injection-moulded-composite` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:injection_moulded_composite |
| `/treatments/inlays-onlays` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:inlays_onlays |
| `/treatments/knocked-out-tooth` | treatment | `emergency_support_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:emergency_knocked_out_tooth |
| `/treatments/lost-crowns-veneers-fillings` | treatment | `emergency_support_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:emergency_lost_crowns |
| `/treatments/mouthguards-and-retainers` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:mouthguards_and_retainers |
| `/treatments/nervous-patients` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:nervous_patients |
| `/treatments/night-guards-occlusal-splints` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:night_guards_occlusal_splints |
| `/treatments/orthodontics` | treatment | `orthodontics_balanced_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:orthodontics |
| `/treatments/painless-numbing-the-wand` | treatment | `painless_wand_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:painless_numbing_the_wand |
| `/treatments/peek-partial-dentures` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:peek_partial_dentures |
| `/treatments/periodontal-gum-care` | treatment | `periodontal_health_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:periodontal_gum_care |
| `/treatments/polynucleotides` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:polynucleotides |
| `/treatments/preventative-and-general-dentistry` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:preventative_and_general_dentistry |
| `/treatments/sedation-dentistry` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:sedation_dentistry |
| `/treatments/sedation-for-implants` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_sedation |
| `/treatments/senior-mature-smile-care` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:senior_mature_smile_care |
| `/treatments/severe-toothache-dental-pain` | treatment | `emergency_support_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:emergency_severe_toothache |
| `/treatments/sinus-lift` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_sinus_lift |
| `/treatments/skin-boosters` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:skin_boosters |
| `/treatments/sports-mouthguards` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:sports_mouthguards |
| `/treatments/teeth-in-a-day` | treatment | `implants_variant_hero_v3` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:implants_teeth_in_a_day |
| `/treatments/teeth-whitening` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / hero_whitening` | — | pages:whitening_hub |
| `/treatments/teeth-whitening-faqs` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:whitening_faq |
| `/treatments/therapeutic-facial-injectables` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:therapeutic_facial_injectables |
| `/treatments/tmj-disorder-treatment` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:tmj_disorder_treatment |
| `/treatments/tmj-jaw-comfort` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:tmj_jaw_comfort |
| `/treatments/tooth-wear-broken-teeth` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:tooth_wear_broken_teeth |
| `/treatments/veneers` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | DUPLICATE_ROUTE, FALLBACK_TO_BASE_SURFACES | pages:veneers, treatments:veneers |
| `/treatments/whitening-sensitive-teeth` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:whitening_sensitivity |
| `/treatments/whitening-top-ups` | treatment | `treatment_neutral_hero_v1` | `—` | `sacred-home-hero / (base)` | FALLBACK_TO_BASE_SURFACES | pages:whitening_topups |
| `/video-consultation` | utility | `contact_calm_hero_v1` | `—` | `sacred-home-hero / default` | — | pages:video_consultation |
