# Manifest & Config Framework Report

## Visual/Brand Manifests
- `public/brand/manifest.json` — Canonical brand manifest consumed by `lib/brand/manifest.ts` to surface waves, textures, particles, and motion for hero/luxury layers (active; production-facing). It points to token CSS under `/styles/tokens` and provides static/dynamic asset fallbacks.
- `public/assets/champagne/manifest.json` — Legacy/fallback asset manifest for champagne hero layers (active as fallback via brand manifest loader).
- `public/brand/champagne_machine_manifest_full.json` (mirrors `config/champagne/manifests/public/champagne_machine_manifest_full.json` & `config/champagne/manifests/brand/champagne_machine_manifest_full.json`) — Expanded brand package covering gradients, wave specs, and freeze lists for hero automation and guards (active in preview audits and guard scripts).
- `styles/champagne/manifest.json` — Style-layer manifest for champagne visuals (likely dormant; not imported in app code).
- `docs/Brand_Canon_Packet/manifest.public.brand.json` & `docs/Brand_Canon_Packet/manifest.styles.champagne.json` — Documentation copies of public/brand and champagne style manifests (legacy/dormant; reference only).
- `brand/manus_import_unified_manifest_20251104.json` & `public/brand/manus_import_unified_manifest_20251104.json` — Manus-delivered unified asset map (active for reference/audit; not directly imported in runtime code yet).

**Intended use:** Blueprint and Director docs position `public/brand/manifest.json` as the shared source for gradients/waves/textures, with champagne machine manifests extending guard rails for hero freezes and automation. Manus unified manifests catalog external drops for alignment with Atlas/Manus imports.

## Manus Catalogs & Atlases
- `config/champagne/manus/Manus_Section_Catalog.json` — Guard-safe Manus section catalog listing hero/value/stories/treatment/portal/chatbot sections with status + layer/tokens/motion budgets (active for knowledge index and audits; assets largely missing, so implementations are dormant).
- `config/champagne/Manus_Section_Catalog.json` — Preview-stage composite bonding catalog pointing to `_sections` files (dormant; noted in README to update after release).
- `docs/manus-atlas/v1/Manus_Section_Catalog.json`, `docs/manus-atlas/v1/Assets_Register.json`, `docs/manus-atlas/v1/Manus_Design_Atlas_v1.md`, `docs/manus-atlas/v1/Integration_Roadmap.md`, `docs/manus-atlas/v1/Manus_Audit_Report.md`, and `docs/manus-atlas/v1/Intake_Batch_Summary.md` — Atlas documentation set describing Manus intake batches, assets, and integration steps (legacy guidance informing how sections/manifests should align).
- `docs/manus-atlas/README.md` — Explains Atlas directory and ties to section catalog (legacy orientation).

**Intended use:** Manus catalogs describe the desired section inventory (hero, value-trio, treatments, portal/chatbot) with readiness flags; Atlas docs guide how Manus drops should map into preview routes and future portal work. Current code doesn’t wire sections automatically, leaving many definitions dormant until assets arrive.

## SEO & Schema Packs
- `config/seo/Treatments_Schema_Pack.json`, `config/seo/schema/Treatments_Schema_Pack.json`, `config/seo/schema/Treatments_Schema_Pack_v2.json`, `config/seo/schema/Treatments_Schema_Pack_v3.json`, and `config/seo/schema/Treatments_Breadcrumbs.json` — Schema/breadcrumb datasets actively imported by `lib/treatments/previewTreatmentConfig.ts` and `lib/seo/preview` loaders for preview treatment routes (active).
- `config/seo/Treatments_AnswerFirst_Copy.md`, `config/seo/Zero_Click_Strategy.md`, `config/seo/SEO_Validation_Checklist.md`, `config/seo/SEO_AI_Synergy_Checklist.md`, and `config/seo/schema-map.json` — Strategy and validation guides (active as human-facing references; not programmatically imported).

**Intended use:** Preview treatment pages load schema packs to render dynamic hero/FAQ/how-to/FAQ schema blocks and breadcrumbs while keeping SEO experiments in preview-only surfaces.

## Navigation & Route Mapping
- `config/navigation.mirrored.ts` — Mirrored navigation data from AI24 export covering primary/footer/treatment menus (active reference for nav consistency; not auto-wired).
- `config/route.mappings.json` — Generated map of intended treatment routes (kept shim list) for mirroring with CMS/AI exports (dormant runtime; used as reference for alignment).
- `config/champagne/header-nav.ts` — Preview navigation list for champagne layouts including portal/finance placeholders (active in preview contexts; includes non-existent portal routes).

**Intended use:** Navigation configs provide single-source-of-truth menus for preview and eventual production menus; route mappings help reconcile CMS exports with app routes and guards.

## Champagne Knowledge & Guard Scripts
- `config/champagne-knowledge-index.json` — Index pointing to schema packs, section catalogs, and manifests for audit tooling (active in reports/guards).
- Guard utilities: `scripts/guard-manifest-sync.mjs`, `brand-guard.cjs`, `tests/brand-manifests.spec.ts`, `tests/brand-manifest.spec.ts`, and `node` guard scripts referenced in README/Blueprint — enforce manifest parity and hero freeze integrity (active; should run in CI/local before release).

**Intended use:** Knowledge index and guard scripts coordinate between manifests/copies to ensure public and config manifests stay synchronized and compliant with brand rules.

## Documentation Mirrors & Styling Tokens
- `docs/Brand_Canon_Packet/Brand_Canon.json`, `docs/Brand_Canon_Packet/Brand_Canon_README.md`, `docs/Brand_Canon_Packet/Brand_Canon_Report.md`, and `docs/Brand_Canon_Packet/smh-champagne-tokens.css` — Canon packet and token references (legacy/dormant for dev use).
- `app/styles/smh-tokens.css` & `app/globals/hero-polish.css` — Token and polish layers referenced by pages but not part of routing; align with brand manifest guidance (active styling assets, unchanged).

## For Director AI
- Active systems: brand manifest loader + champagne machine manifests, preview SEO schema packs, and guard scripts/knowledge index keep hero and schema experiments aligned.
- Experimental/dormant: Manus section catalogs (most sections marked missing), unified Manus import manifests awaiting wiring, style manifest under `styles/champagne`, and navigation/route maps referencing future portal/finance routes.
- Ready for next-phase automation: leverage champagne machine + brand manifest combo with Manus catalogs to auto-wire hero/section drops into preview routes while keeping SEO schema packs feeding treatment previews; guard scripts already monitor manifest sync.
