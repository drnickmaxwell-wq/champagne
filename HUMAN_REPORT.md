# TREATMENT ALIAS REDIRECTS REPORT

## Mission
Ensure treatment alias URLs permanently redirect to canonical manifest paths while keeping existing treatment manifest resolution and metadata behavior intact.

## Files Updated
- `apps/web/app/treatments/[slug]/page.tsx`
- `HUMAN_REPORT.md`
- `TRUTH_REPORT.json`

## Change Summary
- Added alias resolution via `resolveTreatmentPathAlias` in treatment page resolution.
- Preserved existing `getTreatmentManifest`-driven manifest lookup and metadata generation.
- Added permanent redirect in the page handler only when an alias is actually detected and requested path differs from canonical path.
- Kept canonical treatment routes unchanged.

## Validation
- `pnpm run guard:all` ✅
- `pnpm run build:web` ✅
- `npm run guard:hero` ✅
- `npm run guard:canon` ✅
- `npm run verify` ✅
