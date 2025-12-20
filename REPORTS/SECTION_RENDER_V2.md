# Section render audit (v2)

## Home (/) sections
| Order | Section ID | Type | Derived kind |
| --- | --- | --- | --- |
| 1 | home_intro_positioning | copy-block | text |
| 2 | home_authority | feature-grid | features |
| 3 | home_treatment_hub | feature-list | features |
| 4 | home_care_pathway | steps | features |
| 5 | home_treatment_routing | routing_cards | routing_cards |
| 6 | home_special_pathways | routing_cards | routing_cards |
| 7 | home_technology_showcase | media | media |
| 8 | home_patient_stories | patient_stories_rail | patient_stories_rail |
| 9 | home_google_reviews | google_reviews | reviews |
| 10 | home_finance_options | feature-list | features |
| 11 | home_locality_nap | copy-block | text |
| 12 | home_map_location | map | media |
| 13 | home_areas_served | feature-list | features |
| 14 | home_access_parking | feature-grid | features |
| 15 | home_faq | treatment_faq_block | treatment_faq_block |
| 16 | home_faq_expanded | treatment_faq_block | treatment_faq_block |
| 17 | home_closing_cta | treatment_closing_cta | treatment_closing_cta |

All section types map to registered kinds via `SectionRegistry`.

## Treatments hub (/treatments) sections
| Order | Section ID | Type | Derived kind |
| --- | --- | --- | --- |
| 1 | treatments_hub_intro | copy-block | text |
| 2 | treatments_hub_categories | feature-list | features |
| 3 | treatments_hub_pathways | routing_cards | routing_cards |
| 4 | treatments_hub_authority | feature-grid | features |
| 5 | treatments_hub_reviews | google_reviews | reviews |
| 6 | treatments_hub_faq | treatment_faq_block | treatment_faq_block |

## Representative treatment layouts
| Slug | Layout file | Exists | Wired into runtime | Notes |
| --- | --- | --- | --- | --- |
| implants | treatments.implants.json | Yes | Yes | Uses SMH layout list |
| veneers | treatments.veneers.json | Yes | Yes | Uses SMH layout list |
| sedation-dentistry | treatments.sedation-dentistry.json | Yes | Yes | Uses SMH layout list |
| nervous-patients | treatments.nervous-patients.json | Yes | Yes | Uses SMH layout list |
| teeth-whitening | treatments.teeth-whitening.json | Yes | Yes | Uses SMH layout list |