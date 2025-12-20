# Section Registry Inventory

## Registry locations
- Primary registry map: `packages/champagne-sections/src/registry.ts` defines dynamic imports for section component types such as `feature-list`, `media-block`, `clinician-insight`, `patient-stories`, `faq`, `closing-cta`, `tools-trio`, `overview-rich`, `treatment-media-feature`, and `routing-cards`.【F:packages/champagne-sections/src/registry.ts†L1-L36】
- Section normalization: `packages/champagne-sections/src/SectionRegistry.ts` converts manifest entries into renderer-friendly shapes and derives `kind` from type or styles before rendering.【F:packages/champagne-sections/src/SectionRegistry.ts†L1-L118】
- Runtime renderer fallbacks: `packages/champagne-sections/src/ChampagneSectionRenderer.tsx` maps normalized kinds (`text`, `media`, `features`, `routing_cards`, `treatment_overview_rich`, `treatment_media_feature`, `treatment_tools_trio`, `clinician_insight`, `patient_stories_rail`, `treatment_faq_block`, `treatment_closing_cta`, `reviews`) to components and falls back to text/media/feature renderers for unmatched types.【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L33-L116】

## Supported section componentIds/sectionTypes
- Registry types: feature-list, media-block, clinician-insight, patient-stories, faq, closing-cta, tools-trio, overview-rich, treatment-media-feature, routing-cards.【F:packages/champagne-sections/src/registry.ts†L11-L34】
- Normalized kinds handled by renderer fallbacks: text, copy, media, gallery, features, treatment_overview_rich, treatment_media_feature, treatment_tools_trio, routing_cards, clinician_insight, patient_stories_rail, treatment_faq_block, treatment_closing_cta, reviews.【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L33-L70】

## Manifest sectionTypes without dedicated mapping
- `cta`: Appears on multiple utility pages (contact, patient-portal, practice-plan, video-consultation, finance) but lacks a registry entry; renderer falls back to `Section_TextBlock`.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L486-L530】【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L55-L75】
- `story` and `people`: Used on `/about`; not present in registry, so they resolve to text fallback.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L414-L438】【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L55-L70】

## Fallback rules
- Unknown or unmapped types default to text (with specialized fallbacks for copy-block/story/faq/accordion, gallery/grid media, and feature-grid/steps) as implemented in `ChampagneSectionRenderer`.【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L55-L75】
- Treatment component ids are normalized to section kinds via `sectionComponentTypeMap` (e.g., `treatment.heroIntro` → `treatment_overview_rich`, `treatment.cta` → `treatment_closing_cta`) before rendering.【F:packages/champagne-manifests/src/core.ts†L360-L411】
