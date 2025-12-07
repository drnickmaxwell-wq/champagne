# Champagne Manifest – Hero & Section Map (Stub)

Real Champagne manifests are not present in this repository snapshot. This report will be regenerated once the source manifest JSON files are imported into `packages/champagne-manifests/data/`.

## Status
- Manifest readiness: unavailable (placeholder JSON only)
- Parsed data: none — hero presets and section stacks cannot be enumerated until the real manifests are available.

## Expected inputs for a full report
The following artefacts are required to build the hero and section mapping:
- `manifests-and-seo/brand/champagne_machine_manifest_full.json`
- `manifests-and-seo/public/brand/manifest.json`
- `manifests-and-seo/public/brand/champagne_machine_manifest_full.json`
- `manifests-and-seo/public/brand/manus_import_unified_manifest_20251104.json`
- `manifests-and-seo/styles/champagne/manifest.json`
- Any related manifest or SEO configuration files under `_champagne-extraction/manifests-and-seo/**`

Once those files are present, update the `@champagne/manifests` package to ingest them and regenerate this report with the concrete hero presets and ordered section stacks per page/treatment.
