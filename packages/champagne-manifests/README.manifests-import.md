# Champagne Manifests Import Status (Phase 3B)

The real manifest JSON payloads from the Champagne extraction pack have been wired into `@champagne/manifests`. Source files live under `_champagne-extraction/manifests-and-seo/` and were copied into the package in normalised form for consumption by tooling and downstream apps.

## Source → package mapping
- `_champagne-extraction/manifests-and-seo/brand/champagne_machine_manifest_full.json` → `packages/champagne-manifests/data/champagne_machine_manifest_full.json` (machine manifest)
- `_champagne-extraction/manifests-and-seo/public/brand/manifest.public.brand.json` → `packages/champagne-manifests/data/manifest.public.brand.json` (public brand manifest)
- `_champagne-extraction/manifests-and-seo/styles/champagne/manifest.styles.champagne.json` → `packages/champagne-manifests/data/manifest.styles.champagne.json` (styles + hero/section catalogue)
- `_champagne-extraction/manifests-and-seo/brand/manus_import_unified_manifest_20251104.json` → `packages/champagne-manifests/data/manus_import_unified_manifest_20251104.json` (Manus import manifest)

## Roles of each manifest
- **Machine manifest** – `champagne_machine_manifest_full.json` holds the page/treatment graph with hero presets and ordered section stacks.
- **Public brand manifest** – `manifest.public.brand.json` exposes the externally consumable brand view (hero defaults and surface hints).
- **Styles manifest** – `manifest.styles.champagne.json` enumerates hero palettes and section surface pairings used by the machine manifest references.
- **Manus import manifest** – `manus_import_unified_manifest_20251104.json` captures the unified Manus routes/slugs, hero presets, and section stacks used for import/export tasks.

## Next steps for consumers
- Use `champagneManifestsReady` from the package to check readiness before consuming the registry.
- Prefer the helper getters (e.g. `getPageManifestBySlug`) exported from `src/index.ts` to look up page metadata from the registry.
- Update derived reports (like `reports/manifest-hero-section-map.md`) whenever the upstream extraction pack changes.
