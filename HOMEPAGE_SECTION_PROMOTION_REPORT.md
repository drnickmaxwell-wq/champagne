# Homepage Section Promotion Report

## Runtime resolver
- `/` resolves to `pageId: home` through `ChampagnePageBuilder` → `getPageManifestBySlug('/')` (machine manifest).

## Section stacks
### Before (machine manifest)
1. home_intro — copy-block
2. home_authority — feature-grid
3. home_treatment_hub — feature-list
4. home_care_pathway — steps
5. home_treatment_routing — routing_cards
6. home_special_pathways — routing_cards
7. home_technology_showcase — media
8. home_patient_stories — patient_stories_rail
9. home_finance_options — feature-list
10. home_faq — treatment_faq_block
11. home_closing_cta — treatment_closing_cta

### Reference (legacy/please-work import manifest for `/`)
1. home_intro_positioning — copy-block
2. home_treatment_hub — feature-list
3. home_care_pathway — steps
4. home_finance_options — feature-list
5. home_technology_showcase — media
6. home_patient_stories — patient_stories_rail
7. home_faq — treatment_faq_block
8. home_closing_cta — treatment_closing_cta

### After (runtime machine manifest)
1. home_intro_positioning — copy-block (promoted from please-work import)
2. home_authority — feature-grid (existing runtime)
3. home_treatment_hub — feature-list (shared)
4. home_care_pathway — steps (shared)
5. home_treatment_routing — routing_cards (existing runtime)
6. home_special_pathways — routing_cards (existing runtime)
7. home_technology_showcase — media (shared)
8. home_patient_stories — patient_stories_rail (shared)
9. home_google_reviews — google_reviews (promoted legacy section)
10. home_finance_options — feature-list (shared)
11. home_faq — treatment_faq_block (shared)
12. home_closing_cta — treatment_closing_cta (shared)

## Renderer mappings
- copy-block → `Section_TextBlock`
- feature-grid → `Section_FeatureList`
- feature-list → `Section_FeatureList`
- steps → `Section_FeatureList`
- routing_cards → `Section_TreatmentRoutingCards`
- media → `Section_MediaBlock`
- patient_stories_rail → `Section_PatientStoriesRail`
- google_reviews → `Section_GoogleReviews` (new renderer)
- treatment_faq_block → `Section_FAQ`
- treatment_closing_cta → `Section_TreatmentClosingCTA`

## Notes
- No routing changes; `/` still served by `apps/web/app/page.tsx` and `ChampagnePageBuilder`.
- No `/book` links introduced; guard `guard:no-book` remains green.
