# Promotion diff (v2)

## Files changed
- `packages/champagne-manifests/data/sections/smh/treatments.3d-dentistry-and-technology.json` — added SMH layout for the 3D dentistry & technology route.
- `packages/champagne-manifests/src/core.ts` — wired additional SMH layouts into the runtime layout registry.
- `packages/champagne-manifests/data/champagne_machine_manifest_full.json` — updated treatments hub reviews section to render the Google reviews component.
- `packages/champagne-sections/src/SectionRegistry.ts` — mapped `type: "cta"` sections to the CTA-capable closing CTA renderer.

## Rationale
- Promote missing SMH treatment layouts so treatment slugs use their structured stacks instead of inline fallbacks.
- Ensure the treatments hub reviews render with the dedicated reviews component for authority coverage.
- Enable patient portal CTA bands to render real CTA buttons using the existing CTA renderer.
