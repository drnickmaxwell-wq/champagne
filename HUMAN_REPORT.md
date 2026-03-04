# PACKET_ZONEA_015_TREATMENT_ALIAS_REDIRECTS — Human Report

## Mission
When a treatment alias URL is requested, return a permanent redirect to the canonical treatment manifest path.

## Files Changed
- `apps/web/app/treatments/[slug]/page.tsx`

## Implementation Notes
- Preserved existing treatment manifest resolution (`getTreatmentManifest` + manifest `path` fallback).
- Added `requestedPath` resolution from incoming route slug.
- Added redirect behavior in page render path only:
  - if resolved canonical `pageSlug` differs from requested treatment path, call `permanentRedirect(pageSlug)`.
- Left canonical rendering unchanged when the requested path already matches canonical.
- Did not modify treatment metadata field logic beyond existing canonical path usage.

## Validation
- `npm run guard:hero` ✅
- `npm run guard:canon` ✅
- `npm run verify` ✅
- `pnpm run guard:all` ✅
- `pnpm run build:web` ✅
