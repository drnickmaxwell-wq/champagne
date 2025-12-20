# Runtime Section Registry Report

## Registered components
- `feature-list` → `Section_FeatureList`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- `media-block` → `Section_MediaBlock`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- `clinician-insight` → `Section_ClinicianInsight`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- `patient-stories` → `Section_PatientStoriesRail`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- `faq` → `Section_FAQ`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- `closing-cta` → `Section_TreatmentClosingCTA`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- `tools-trio` → `Section_TreatmentToolsTrio`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- `overview-rich` → `Section_TreatmentOverviewRich`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- `treatment-media-feature` → `Section_TreatmentMediaFeature`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- `routing-cards` → `Section_TreatmentRoutingCards`【F:packages/champagne-sections/src/registry.ts†L11-L37】
- Fallback renderer components also exist for kinds `text`, `media`, `features`, `treatment_overview_rich`, `treatment_media_feature`, `treatment_tools_trio`, `routing_cards`, `clinician_insight`, `patient_stories_rail`, `treatment_faq_block`, `treatment_closing_cta`, and `reviews` via `ChampagneSectionRenderer` and `SectionRegistry` normalization.【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L33-L123】【F:packages/champagne-sections/src/SectionRegistry.ts†L1-L170】

## Data references to unregistered types
These manifest section types lack a dedicated registry entry and are rendered via fallbacks:
- `cta` (seen on Contact, Patient Portal, Practice Plan, Video Consultation, Finance, Team/About)【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L420-L530】【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L60-L70】
- `story` and `people` (About page)【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L414-L438】
- `accordion` (Privacy policy)【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L532-L548】
- Plain `faq` (not `treatment_faq_block`) on some entries (e.g., About/Team fallback) also render as text because only `treatment_faq_block` maps to the FAQ component.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L440-L483】【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L45-L70】
