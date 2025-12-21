# CTA Runtime Wiring Report

## Findings
- **CTA label source:** `Section_TreatmentClosingCTA` was defaulting to CTA registry entries because `ChampagneSectionRenderer` injected an empty `footerCTAs` array. This bypassed manifest CTAs and forced the fallback registry copy (e.g., “Book a consultation”, “AI smile preview”).【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L52-L60】【F:packages/champagne-sections/src/Section_TreatmentClosingCTA.tsx†L69-L87】
- **Dental check-ups CTA gap:** The `dental_checkups_oral_cancer_screening` page had no `treatment_closing_cta` section in `champagne_machine_manifest_full.json`, so no CTA rendered on that page.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L1467-L1547】
- **FAQ disappearance:** Some FAQ sections in the machine manifest used `"type": "faq"`, but the section registry only mapped `treatment_faq_block`, so these FAQs were treated as generic text and effectively dropped from the FAQ renderer.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L4299-L4319】【F:packages/champagne-sections/src/SectionRegistry.ts†L44-L57】

## Changes Made
- Preserve manifest CTAs by only using page-level CTA overrides when they exist, fall back to section CTAs, then journey/intent CTAs, and finally safe defaults.【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L20-L60】【F:packages/champagne-sections/src/Section_TreatmentClosingCTA.tsx†L27-L108】
- Wire journey-aware CTA intent resolution using `treatment_journeys.json` and route-level `cta_intents` so CTA copy now varies per treatment page, with safe fallbacks.【F:packages/champagne-manifests/src/helpers.ts†L18-L66】【F:packages/champagne-sections/src/Section_TreatmentClosingCTA.tsx†L69-L108】
- Added a closing CTA section to the dental check-ups page so it always renders at least one CTA.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L1500-L1519】
- Restored FAQ rendering for `type: "faq"` sections by mapping them to the FAQ renderer in the section registry.【F:packages/champagne-sections/src/SectionRegistry.ts†L44-L57】
