# Homepage Manifest Runtime Truth

## 1) Route resolver and manifest lookup
- `/` is served by `apps/web/app/page.tsx`, which renders `<ChampagnePageBuilder slug="/" />` (after optionally rendering the hero).【F:apps/web/app/page.tsx†L1-L13】
- `ChampagnePageBuilder` resolves the manifest by calling `getPageManifestBySlug(slug)` and falling back to registry entries in `champagneMachineManifest.pages`/`treatments`.【F:apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx†L18-L24】
- The page path for `/` stays `/`, so `getRouteIdFromSlug` turns it into the routeId `home`.【F:packages/champagne-manifests/src/core.ts†L359-L368】
- With slug `/`, `getPageManifestBySlug` returns the `home` page from the machine manifest (path `/`, id `home`).【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L7-L213】【F:packages/champagne-manifests/src/core.ts†L447-L455】

Resolved identifiers: **pageId: `home`**, **routeId: `home`**.

## 2) Runtime homepage manifest and sections
The runtime manifest is `packages/champagne-manifests/data/champagne_machine_manifest_full.json` (machine manifest imported in `packages/champagne-manifests/src/core.ts`).【F:packages/champagne-manifests/src/core.ts†L256-L319】 The `/` entry defines the following sections in order (no variantIds are set, and `componentId` comes from `type`):【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L36-L212】

1. `home_intro` — component `copy-block`
2. `home_authority` — component `feature-grid`
3. `home_treatment_hub` — component `feature-list`
4. `home_care_pathway` — component `steps`
5. `home_treatment_routing` — component `routing_cards`
6. `home_special_pathways` — component `routing_cards`
7. `home_technology_showcase` — component `media`
8. `home_patient_stories` — component `patient_stories_rail`
9. `home_finance_options` — component `feature-list`
10. `home_faq` — component `treatment_faq_block`
11. `home_closing_cta` — component `treatment_closing_cta`

For comparison, the imported please-work manifest in `packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json` lists eight sections for `/`, starting with `home_intro_positioning` and omitting the `home_authority`, `home_treatment_routing`, and `home_special_pathways` stacks.【F:packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json†L6-L99】

## 3) Render pipeline
- `ChampagnePageBuilder` passes the page slug to `ChampagneSectionRenderer`, which internally calls `getSectionStack(pageSlug)` to fetch section definitions.【F:apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx†L135-L180】【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L71-L118】
- `getSectionStack` wraps `getSectionStackForPage` (from `@champagne/manifests`) and normalizes each section (adds defaults, derives kind/type) without filtering any entries.【F:packages/champagne-sections/src/SectionRegistry.ts†L1-L186】
- `getSectionStackForPage` resolves sections in this order: explicit section layout for the route; otherwise the page manifest sections; otherwise page-type defaults. There is no allowlist/denylist—only hero components are removed when building from a section layout (not used for `/`).【F:packages/champagne-manifests/src/core.ts†L395-L488】
- `ChampagneSectionRenderer` maps each section `kind`/`type` to a component via `typeMap` and falls back to text/media/feature renderers when needed; no try/catch blocks drop sections silently.【F:packages/champagne-sections/src/ChampagneSectionRenderer.tsx†L32-L118】

## 4) Why fewer sections than please-work
- The runtime homepage uses the machine manifest entry `home`, not the please-work import. That manifest adds `home_authority`, `home_treatment_routing`, and `home_special_pathways` but replaces the please-work intro id (`home_intro_positioning`) with `home_intro`, so the two manifests are not identical despite similar copy.【F:packages/champagne-manifests/data/champagne_machine_manifest_full.json†L36-L212】【F:packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json†L6-L99】
- Section resolution does not filter or drop sections for `/`; it simply renders the sections present in the machine manifest. Any section absent from the runtime experience (e.g., `home_intro_positioning`) is missing because it is not in the loaded manifest, not because of runtime filtering.【F:packages/champagne-manifests/src/core.ts†L461-L488】【F:packages/champagne-sections/src/SectionRegistry.ts†L67-L186】
