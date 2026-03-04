# HUMAN REPORT

## Mission
Register the two new treatment hub slugs in the SMH treatment layout registry so guard enforcement passes:
- `/treatments/cosmetic-dentistry`
- `/treatments/preventive-dentistry`

## Files Updated
- `packages/champagne-manifests/src/core.ts`
  - Added imports for:
    - `treatments.cosmetic-dentistry.json`
    - `treatments.preventive-dentistry.json`
  - Added both imported layout identifiers into `champagneSectionLayouts`.

- `packages/champagne-manifests/data/sections/smh/treatments.cosmetic-dentistry.json`
  - Added new route layout registry file with `routeId: treatments.cosmetic-dentistry`.

- `packages/champagne-manifests/data/sections/smh/treatments.preventive-dentistry.json`
  - Added new route layout registry file with `routeId: treatments.preventive-dentistry`.

## Notes
- No routing refactor or UI redesign was performed.
- Existing manifest hub entries remain unchanged in this follow-up patch.
- This is the smallest registry wiring change required for `guard:smh-treatment-layouts` to pass.
