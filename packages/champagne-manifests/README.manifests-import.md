# Champagne Manifests Import Status (Phase 3A)

Real Champagne manifest payloads are not currently included in this repository snapshot. The `@champagne/manifests` package still serves placeholder data and keeps readiness flags set to `unavailable`.

## Expected manifest artefacts
When the source archive is available, import the real files into `packages/champagne-manifests/data/` using their canonical names. Based on the extraction brief, the missing artefacts include:

- `_champagne-extraction/manifests-and-seo/brand/champagne_machine_manifest_full.json`
- `_champagne-extraction/manifests-and-seo/config/champagne/manifests/**`
- `_champagne-extraction/manifests-and-seo/docs/Brand_Canon_Packet/champagne_machine_manifest.json`
- `_champagne-extraction/manifests-and-seo/public/brand/manifest.json`
- `_champagne-extraction/manifests-and-seo/public/brand/champagne_machine_manifest_full.json`
- `_champagne-extraction/manifests-and-seo/public/brand/manus_import_unified_manifest_20251104.json`
- `_champagne-extraction/manifests-and-seo/styles/champagne/manifest.json`
- Any SEO-related manifest or config files under `_champagne-extraction/manifests-and-seo/**`.

## How to wire them once available
1. Copy the artefacts into `packages/champagne-manifests/data/`, preserving file names where possible.
2. Update `packages/champagne-manifests/src/index.ts` to import each JSON file and populate the `champagneManifests` registry. Keep the `champagneManifestStatus` and `champagneManifestsReady` flags aligned with the real data readiness.
3. Regenerate `reports/manifest-hero-section-map.md` using the real hero, page, and section definitions from the manifests.
4. Run `pnpm lint` and `pnpm build` to ensure the typed surface remains valid for downstream packages.

Until those artefacts arrive, the package will continue to expose the stub manifest and mark readiness as `unavailable`.
