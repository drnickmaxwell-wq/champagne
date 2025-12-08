# Champagne Knowledge Audit

## Located assets
- **SEO**: `config/seo/schema-map.json`, `config/seo/SEO_Validation_Checklist.md`, `config/seo/SEO_AI_Synergy_Checklist.md`, `config/seo/Zero_Click_Strategy.md`, `config/seo/Treatments_Schema_Pack.json`, `config/seo/Treatments_AnswerFirst_Copy.md`.
- **Treatments schema**: `config/seo/schema/Treatments_Schema_Pack.json`, `config/seo/schema/Treatments_Schema_Pack_v2.json`, `config/seo/schema/Treatments_Schema_Pack_v3.json`, `config/seo/schema/Treatments_Breadcrumbs.json`.
- **Manus**: `config/champagne/Manus_Section_Catalog.json`, `config/champagne/manus/Manus_Section_Catalog.json`, `reports/manus/Manus_Audit_Report.md`.
- **Champagne strategy & manifests**: `reports/Champagne_Page_Strategy_Report.md`, manifest source files at `config/champagne/manifests/public/champagne_machine_manifest_full.json` and `config/champagne/manifests/brand/champagne_machine_manifest_full.json` (served to the legacy `public/brand/...` path via symlink), audits in `reports/` (`CHAMPAGNE_AUDIT.md`, `CHAMPAGNE_INVENTORY.json`, palette and preview fix reports, treatments architecture, mood map).

## Missing/absent items
- No `*SEO_Plan*.md` documents were found.
- No `SMH_Manus_Audit_Reports*` artifacts were present.

## Scope note
Only documentation/config paths and import targets were updated to normalize locations. No component, page layout, or styling changes were made.

## Test results
- `pnpm lint` — **failed**: existing lint errors remain (forbidden `require` usage in `brand-guard.cjs` and `postcss.config.js` plus legacy `any` and unused refs in preview routes/components). No fixes applied.
- `pnpm test` — passed (`tests/brand-manifest.spec.ts`).
- `pnpm brand:guard` — passed (no rogue hex detected; manifests ok).
- `node scripts/guard-rogue-hex.mjs` — passed (no rogue HEX values found outside tokens).
