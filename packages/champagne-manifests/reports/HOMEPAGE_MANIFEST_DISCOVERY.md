# HOMEPAGE_MANIFEST_DISCOVERY.md

Scope: phase-home-cta-lock discovery for `/`
Date: 2025-12-19

## Candidates reviewed

1. `packages/champagne-manifests/data/champagne_machine_manifest_full.json`
   - **Runtime wiring:** Imported as `champagneMachineManifest` in `packages/champagne-manifests/src/core.ts` and used by `getPageManifestBySlug` via `pageCollections` (runtime source of truth).
   - **Sections (5):** `home_intro`, `home_authority`, `home_treatment_routing`, `home_special_pathways`, `home_closing_cta`.
   - **CTA coverage:** Inline `ctas` with hero, mid-page, and footer group; footer CTA already points to `/contact`.
   - **SEO/trust:** Contains authority grid and routing cards; no FAQ block on the home stack.

2. `packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json`
   - **Runtime wiring:** Present in the registry but **not** consumed by `pageCollections`; treated as import/reference only.
   - **Sections (8):** `home_intro_positioning`, `home_treatment_hub`, `home_care_pathway`, `home_finance_options`, `home_technology_showcase`, `home_patient_stories`, `home_faq`, `home_closing_cta`.
   - **CTA coverage:** Closing CTA maps to `/contact` and `/treatments`.
   - **SEO/trust:** Includes patient stories rail and FAQ block.

3. `packages/champagne-manifests/data/manifest.public.brand.json`
   - **Runtime wiring:** Part of the registry for hero presets; does not feed `pageCollections` or section resolution.
   - **Sections:** None; entry for `/` only defines hero `sacred_home_hero_v1` and category `hub`.
   - **SEO/trust:** Not applicable (hero mapping only).

## Recommendation
- **Best runtime candidate:** `champagne_machine_manifest_full.json` (already powering `/` resolution). Maintain this as the authoritative homepage manifest.
- **_imports/reference candidates:** None identified beyond the Manus import manifest listed above; no promotion performed.
