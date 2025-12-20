# Section Coverage

## Home (/)
- Sections from machine manifest: `home_intro_positioning`, `home_authority`, `home_treatment_hub`, `home_care_pathway`, `home_treatment_routing`, `home_special_pathways`, `home_technology_showcase`, `home_patient_stories`, `home_google_reviews`, `home_finance_options`, `home_locality_nap`, `home_map_location`, `home_areas_served`, `home_access_parking`, `home_faq`, `home_faq_expanded`, `home_closing_cta`.
- Component mapping: all types resolve via section registry (copy/feature/routing/media/patient_stories/reviews/faq/closing CTA). No unknown IDs.

## Treatments hub (/treatments)
- Sections: `treatments_hub_intro`, `treatments_hub_categories`, `treatments_hub_pathways`, `treatments_hub_authority`, `treatments_hub_reviews`, `treatments_hub_faq`.
- Component mapping: copy/feature/routing/feature-grid/review CTA/FAQ all registered; renders through ChampagneSectionRenderer when present.

## Treatment example (/treatments/implants)
- Layout-driven sections (SMH layout): `implants-hero-intro`, `implants-trust-signals`, `implants-guided-planning`, `implants-what-are`, `implants-who-for`, `implants-process`, `implants-technology`, `implants-benefits`, `implants-aftercare`, `implants-faq`, `implants-clinician`, `implants-cta`.
- Component mapping: layout component IDs map to treatment overview/media/features/FAQ/closing CTA types; all registered in section renderer; no unknown IDs.

## Patient portal landing (/patient-portal)
- Sections: `patient_portal_intro_copy`, `patient_portal_features`, `patient_portal_cta_band`.
- Component mapping: intro/features resolve to text/feature list; `patient_portal_cta_band` uses type `cta`, which falls back to the generic text block (CTA entries are not rendered as buttons). No missing components but CTA intent is degraded.
