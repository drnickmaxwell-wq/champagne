# Treatment Inventory

## A. Canonical registry sources
- Machine manifest: `packages/champagne-manifests/data/champagne_machine_manifest_full.json`
- Section layout registry: `packages/champagne-manifests/src/core.ts` (imports + `champagneSectionLayouts`)

## B. Full treatment list
| treatmentTitle | slug | route | machineManifestId | category/group | sectionLayoutFile | existsOnDisk | notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3D dentistry & technology | 3d-dentistry-and-technology | /treatments/3d-dentistry-and-technology | 3d_dentistry_and_technology | technology | packages/champagne-manifests/data/sections/smh/treatments.3d-dentistry-and-technology.json | YES | — |
| 3D & digital dentistry | 3d-digital-dentistry | /treatments/3d-digital-dentistry | technology_digital_dentistry | treatment | packages/champagne-manifests/data/sections/smh/treatments.3d-digital-dentistry.json | YES | — |
| 3D implant restorations | 3d-implant-restorations | /treatments/3d-implant-restorations | 3d_implant_restorations | treatment | packages/champagne-manifests/data/sections/smh/treatments.3d-implant-restorations.json | YES | — |
| 3D printed dentures | 3d-printed-dentures | /treatments/3d-printed-dentures | printed_dentures_3d | treatment | packages/champagne-manifests/data/sections/smh/treatments.3d-printed-dentures.json | YES | — |
| 3D printed veneers | 3d-printed-veneers | /treatments/3d-printed-veneers | 3d_printed_veneers | treatment | packages/champagne-manifests/data/sections/smh/treatments.3d-printed-veneers.json | YES | — |
| 3D printing lab | 3d-printing-lab | /treatments/3d-printing-lab | 3d_printing_lab | treatment | packages/champagne-manifests/data/sections/smh/treatments.3d-printing-lab.json | YES | — |
| Acrylic dentures | acrylic-dentures | /treatments/acrylic-dentures | acrylic_dentures | treatment | packages/champagne-manifests/data/sections/smh/treatments.acrylic-dentures.json | YES | — |
| Prescription anti-wrinkle treatments | anti-wrinkle-treatments | /treatments/anti-wrinkle-treatments | anti_wrinkle_treatments | treatment | packages/champagne-manifests/data/sections/smh/treatments.anti-wrinkle-treatments.json | YES | — |
| Broken, chipped or cracked teeth | broken-chipped-cracked-teeth | /treatments/broken-chipped-cracked-teeth | emergency_broken_chipped_teeth | treatment | — | NO | — |
| Bruxism and jaw clenching treatment | bruxism-and-jaw-clenching | /treatments/bruxism-and-jaw-clenching | bruxism_jaw_clenching | treatment | packages/champagne-manifests/data/sections/smh/treatments.bruxism-and-jaw-clenching.json | YES | — |
| CBCT / 3D scanning | cbct-3d-scanning | /treatments/cbct-3d-scanning | cbct_3d_scanning | treatment | packages/champagne-manifests/data/sections/smh/treatments.cbct-3d-scanning.json | YES | — |
| Children’s dentistry | childrens-dentistry | /treatments/childrens-dentistry | childrens_dentistry | treatment | packages/champagne-manifests/data/sections/smh/treatments.childrens-dentistry.json | YES | — |
| Chrome dentures | chrome-dentures | /treatments/chrome-dentures | chrome_dentures | treatment | packages/champagne-manifests/data/sections/smh/treatments.chrome-dentures.json | YES | — |
| Clear Aligners in Shoreham-by-Sea | clear-aligners | /treatments/clear-aligners | clear_aligners | — | packages/champagne-manifests/data/sections/smh/treatments.clear-aligners.json | YES | — |
| Spark clear aligners in Shoreham-by-Sea | clear-aligners-spark | /treatments/clear-aligners-spark | clear_aligners_spark | treatment | packages/champagne-manifests/data/sections/smh/treatments.clear-aligners-spark.json | YES | — |
| Composite bonding | composite-bonding | /treatments/composite-bonding | composite_bonding | treatment | — | NO | — |
| Dental abscess & infection | dental-abscess-infection | /treatments/dental-abscess-infection | emergency_dental_abscess | treatment | — | NO | — |
| Dental bridges | dental-bridges | /treatments/dental-bridges | dental_bridges | treatment | packages/champagne-manifests/data/sections/smh/treatments.dental-bridges.json | YES | — |
| Dental crowns | dental-crowns | /treatments/dental-crowns | dental_crowns | treatment | packages/champagne-manifests/data/sections/smh/treatments.dental-crowns.json | YES | — |
| Dental retainers | dental-retainers | /treatments/dental-retainers | dental_retainers | treatment | packages/champagne-manifests/data/sections/smh/treatments.dental-retainers.json | YES | — |
| Dental trauma & accidents | dental-trauma-accidents | /treatments/dental-trauma-accidents | emergency_dental_trauma | treatment | — | NO | — |
| Dentures & tooth replacement | dentures | /treatments/dentures | dentures | treatment | packages/champagne-manifests/data/sections/smh/treatments.dentures.json | YES | — |
| Dermal fillers with medical oversight | dermal-fillers | /treatments/dermal-fillers | dermal_fillers | treatment | packages/champagne-manifests/data/sections/smh/treatments.dermal-fillers.json | YES | — |
| Digital smile design | digital-smile-design | /treatments/digital-smile-design | digital_smile_design | treatment | packages/champagne-manifests/data/sections/smh/treatments.digital-smile-design.json | YES | — |
| Emergency dental appointments | emergency-dental-appointments | /treatments/emergency-dental-appointments | emergency_dental_appointments | treatment | — | NO | — |
| Emergency dentistry | emergency-dentistry | /treatments/emergency-dentistry | emergency_dentistry | treatment | — | NO | — |
| Endodontics & root canal care | endodontics-root-canal | /treatments/endodontics-root-canal | endodontics_root_canal | treatment | packages/champagne-manifests/data/sections/smh/treatments.endodontics-root-canal.json | YES | — |
| Extractions & oral surgery | extractions-and-oral-surgery | /treatments/extractions-and-oral-surgery | extractions_and_oral_surgery | treatment | packages/champagne-manifests/data/sections/smh/treatments.extractions-and-oral-surgery.json | YES | — |
| Facial aesthetics hub | facial-aesthetics | /treatments/facial-aesthetics | facial_aesthetics | hub | packages/champagne-manifests/data/sections/smh/treatments.facial-aesthetics.json | YES | — |
| Facial pain and headache pathways | facial-pain-and-headache | /treatments/facial-pain-and-headache | facial_pain_headache | treatment | packages/champagne-manifests/data/sections/smh/treatments.facial-pain-and-headache.json | YES | — |
| Facial therapeutics in Shoreham-by-Sea | facial-therapeutics | /treatments/facial-therapeutics | facial_therapeutics | hub | packages/champagne-manifests/data/sections/smh/treatments.facial-therapeutics.json | YES | — |
| Failed implant replacement in Shoreham-by-Sea | failed-implant-replacement | /treatments/failed-implant-replacement | implants_failed_replacement | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-failed-replacement.json | YES | — |
| Fixed braces | fixed-braces | /treatments/fixed-braces | fixed_braces | treatment | packages/champagne-manifests/data/sections/smh/treatments.fixed-braces.json | YES | — |
| Full smile makeover | full-smile-makeover | /treatments/full-smile-makeover | full_smile_makeover | treatment | — | NO | — |
| Home teeth whitening | home-teeth-whitening | /treatments/home-teeth-whitening | home_teeth_whitening | treatment | packages/champagne-manifests/data/sections/smh/treatments.home-teeth-whitening.json | YES | — |
| Implant aftercare & recovery in Shoreham-by-Sea | implant-aftercare | /treatments/implant-aftercare | implants_aftercare | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-aftercare.json | YES | — |
| Implant consultation & planning in Shoreham-by-Sea | implant-consultation | /treatments/implant-consultation | implants_consultation | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-consultation.json | YES | — |
| Implant-retained dentures | implant-retained-dentures | /treatments/implant-retained-dentures | implant_retained_dentures | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-retained-dentures.json | YES | — |
| Dental Implants in Shoreham-by-Sea | implants | /treatments/implants | implants | — | packages/champagne-manifests/data/sections/smh/treatments.implants.json | YES | — |
| Bone grafting for dental implants | implants-bone-grafting | /treatments/implants-bone-grafting | implants_bone_grafting | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-bone-grafting.json | YES | — |
| Full arch implant rehabilitation | implants-full-arch | /treatments/implants-full-arch | implants_full_arch | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-full-arch.json | YES | — |
| Multiple teeth implant options | implants-multiple-teeth | /treatments/implants-multiple-teeth | implants_multiple_teeth | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-multiple-teeth.json | YES | — |
| Single-tooth dental implants in Shoreham-by-Sea | implants-single-tooth | /treatments/implants-single-tooth | implants_single_tooth | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-single-tooth.json | YES | — |
| Injection-moulded composite | injection-moulded-composite | /treatments/injection-moulded-composite | injection_moulded_composite | treatment | — | NO | — |
| Inlays & onlays | inlays-onlays | /treatments/inlays-onlays | inlays_onlays | treatment | packages/champagne-manifests/data/sections/smh/treatments.inlays-onlays.json | YES | — |
| Knocked-out (avulsed) tooth | knocked-out-tooth | /treatments/knocked-out-tooth | emergency_knocked_out_tooth | treatment | — | NO | — |
| Lost crowns, veneers & fillings | lost-crowns-veneers-fillings | /treatments/lost-crowns-veneers-fillings | emergency_lost_crowns | treatment | — | NO | — |
| Mouthguards & retainers | mouthguards-and-retainers | /treatments/mouthguards-and-retainers | mouthguards_and_retainers | treatment | packages/champagne-manifests/data/sections/smh/treatments.mouthguards-and-retainers.json | YES | — |
| Nervous patients | nervous-patients | /treatments/nervous-patients | nervous_patients | treatment | packages/champagne-manifests/data/sections/smh/treatments.nervous-patients.json | YES | — |
| Night guards (occlusal splints) | night-guards-occlusal-splints | /treatments/night-guards-occlusal-splints | night_guards_occlusal_splints | treatment | packages/champagne-manifests/data/sections/smh/treatments.night-guards-occlusal-splints.json | YES | — |
| Orthodontics | orthodontics | /treatments/orthodontics | orthodontics | treatment | packages/champagne-manifests/data/sections/smh/treatments.orthodontics.json | YES | — |
| Painless numbing with The Wand | painless-numbing-the-wand | /treatments/painless-numbing-the-wand | painless_numbing_the_wand | treatment | packages/champagne-manifests/data/sections/smh/treatments.painless-numbing-the-wand.json | YES | — |
| PEEK partial dentures | peek-partial-dentures | /treatments/peek-partial-dentures | peek_partial_dentures | treatment | packages/champagne-manifests/data/sections/smh/treatments.peek-partial-dentures.json | YES | — |
| Periodontal & gum care | periodontal-gum-care | /treatments/periodontal-gum-care | periodontal_gum_care | treatment | packages/champagne-manifests/data/sections/smh/treatments.periodontal-gum-care.json | YES | — |
| Polynucleotide treatments to support skin quality | polynucleotides | /treatments/polynucleotides | polynucleotides | treatment | packages/champagne-manifests/data/sections/smh/treatments.polynucleotides.json | YES | — |
| Preventative & general dentistry | preventative-and-general-dentistry | /treatments/preventative-and-general-dentistry | preventative_and_general_dentistry | treatment | packages/champagne-manifests/data/sections/smh/treatments.preventative-and-general-dentistry.json | YES | — |
| Sedation dentistry | sedation-dentistry | /treatments/sedation-dentistry | sedation_dentistry | treatment | packages/champagne-manifests/data/sections/smh/treatments.sedation-dentistry.json | YES | — |
| Sedation for dental implant treatment in Shoreham-by-Sea | sedation-for-implants | /treatments/sedation-for-implants | implants_sedation | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-sedation.json | YES | — |
| Senior & mature smile care | senior-mature-smile-care | /treatments/senior-mature-smile-care | senior_mature_smile_care | treatment | packages/champagne-manifests/data/sections/smh/treatments.senior-mature-smile-care.json | YES | — |
| Severe toothache & dental pain | severe-toothache-dental-pain | /treatments/severe-toothache-dental-pain | emergency_severe_toothache | treatment | — | NO | — |
| Sinus lift for dental implants in Shoreham-by-Sea | sinus-lift | /treatments/sinus-lift | implants_sinus_lift | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-sinus-lift.json | YES | — |
| Skin boosters for hydration and elasticity | skin-boosters | /treatments/skin-boosters | skin_boosters | treatment | packages/champagne-manifests/data/sections/smh/treatments.skin-boosters.json | YES | — |
| Sports mouthguards | sports-mouthguards | /treatments/sports-mouthguards | sports_mouthguards | treatment | packages/champagne-manifests/data/sections/smh/treatments.sports-mouthguards.json | YES | — |
| Teeth-in-a-Day implants in Shoreham-by-Sea | teeth-in-a-day | /treatments/teeth-in-a-day | implants_teeth_in_a_day | treatment | packages/champagne-manifests/data/sections/smh/treatments.implants-teeth-in-a-day.json | YES | — |
| Teeth whitening | teeth-whitening | /treatments/teeth-whitening | whitening_hub | treatment | packages/champagne-manifests/data/sections/smh/treatments.teeth-whitening.json | YES | — |
| Teeth whitening FAQs | teeth-whitening-faqs | /treatments/teeth-whitening-faqs | whitening_faq | treatment | packages/champagne-manifests/data/sections/smh/treatments.teeth-whitening-faqs.json | YES | — |
| Therapeutic facial injectables | therapeutic-facial-injectables | /treatments/therapeutic-facial-injectables | therapeutic_facial_injectables | treatment | packages/champagne-manifests/data/sections/smh/treatments.therapeutic-facial-injectables.json | YES | — |
| TMJ disorder treatment | tmj-disorder-treatment | /treatments/tmj-disorder-treatment | tmj_disorder_treatment | treatment | packages/champagne-manifests/data/sections/smh/treatments.tmj-disorder-treatment.json | YES | — |
| TMJ & jaw comfort | tmj-jaw-comfort | /treatments/tmj-jaw-comfort | tmj_jaw_comfort | treatment | packages/champagne-manifests/data/sections/smh/treatments.tmj-jaw-comfort.json | YES | — |
| Tooth Wear & Broken Teeth | tooth-wear-broken-teeth | /treatments/tooth-wear-broken-teeth | tooth_wear_broken_teeth | treatment | — | NO | — |
| — | veneers | /treatments/veneers | veneers | — | packages/champagne-manifests/data/sections/smh/treatments.veneers.json | YES | — |
| Sensitive teeth & whitening | whitening-sensitive-teeth | /treatments/whitening-sensitive-teeth | whitening_sensitivity | treatment | packages/champagne-manifests/data/sections/smh/treatments.whitening-sensitive-teeth.json | YES | — |
| Whitening top-ups & maintenance | whitening-top-ups | /treatments/whitening-top-ups | whitening_topups | treatment | packages/champagne-manifests/data/sections/smh/treatments.whitening-top-ups.json | YES | — |

## C. Orphans / mismatches
- Treatments missing section layout: /treatments/composite-bonding, /treatments/injection-moulded-composite, /treatments/full-smile-makeover, /treatments/emergency-dentistry, /treatments/emergency-dental-appointments, /treatments/severe-toothache-dental-pain, /treatments/dental-abscess-infection, /treatments/broken-chipped-cracked-teeth, /treatments/knocked-out-tooth, /treatments/lost-crowns-veneers-fillings, /treatments/dental-trauma-accidents, /treatments/tooth-wear-broken-teeth
- Orphan section layout files: packages/champagne-manifests/data/sections/smh/treatments.hub-directory.json, packages/champagne-manifests/data/sections/smh/treatments.aligners.json
- Duplicate slugs: None

Total treatments: 73
Total missing layouts: 12
Total orphan layouts: 2