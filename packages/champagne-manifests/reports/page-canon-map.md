# Page Canon Map (Non-Treatment)

| Slug | Title | Hero preset? | Section stack? | Route status |
| --- | --- | --- | --- | --- |
| / | Home | `home_neutral_hero_v1` | `home_intro_positioning`, `home_treatment_hub`, `home_care_pathway`, `home_finance_options`, `home_technology_showcase`, `home_patient_stories`, `home_faq`, `home_closing_cta` | Manifest-driven via `/page.tsx` |
| /team | Team | `team_preview_hero_v1` | `team_intro_copy`, `team_grid_placeholder`, `team_connection_cta` | Manifest-driven via `/team/page.tsx` |
| /contact | Contact | `contact_calm_hero_v1` | `contact_intro_copy`, `contact_details_simple`, `contact_followup_cta` | Manifest-driven via `/contact/page.tsx` |
| /smile-gallery | Smile gallery | `smile_gallery_placeholder_hero` | `smile_gallery_intro_copy`, `smile_gallery_cases_overview`, `smile_gallery_case_categories` | Manifest-driven via `(champagne)/smile-gallery` |
| /blog | Blog | `blog_intro_hero_v1` | `blog_intro_copy`, `blog_placeholder_features` | Manifest-driven via `/blog/page.tsx` |
| /patient-portal | Patient portal | `patient_portal_placeholder_hero` | `patient_portal_intro_copy`, `patient_portal_features`, `patient_portal_cta_band` | Manifest-driven via `/patient-portal/page.tsx` |
| /dental-checkups-oral-cancer-screening | Dental Check-Ups & Oral Cancer Screening | `contact_calm_hero_v1` | `dental_checkups_intro`, `dental_checkups_what_to_expect`, `dental_checkups_digital_imaging`, `dental_checkups_who_benefits`, `dental_checkups_frequency`, `dental_checkups_worried`, `dental_checkups_faq` | Manifest-driven via `(site)/[page]` |
| /about | About | `about_story_hero_v1` | `about_story`, `team_profiles`, `technology_stack`, `cta_gold_bar` | Present via `(champagne)/about` |
| /legal/privacy | Privacy Policy | `legal_simple_banner` | `legal_intro`, `legal_terms` | Present via `(champagne)/legal/privacy` |

## Notes
- All non-treatment nav destinations now map to manifest entries, style presets, and live routes.
- Home now follows the richer Champagne stack (hub → pathway → finance → tech → stories → FAQ → closing CTA) while keeping neutral placeholder copy.
