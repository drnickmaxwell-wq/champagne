# PACKET_ZONEA_016_JSONLD_MVP — Human Report

## Mission
Added minimal deterministic JSON-LD output for root and treatment pages.

## Files Changed
- `apps/web/app/layout.tsx`
- `apps/web/app/treatments/[slug]/page.tsx`
- `HUMAN_REPORT.md`
- `TRUTH_REPORT.json`

## Implementation Notes
- Root layout now emits one JSON-LD script with an `@graph` containing:
  - `LocalBusiness` + `Dentist`
  - `WebSite`
- Treatment page now emits two JSON-LD scripts:
  - `Service` (manifest-based title/description)
  - `BreadcrumbList` (Home → Treatments → current treatment)
- Data is deterministic and local-only, using `NEXT_PUBLIC_SITE_URL` fallback to `https://smhdental.co.uk`.
- No copy/layout stack changes beyond script emission.

## Validation
- `npm run guard:hero` ✅
- `npm run guard:canon` ✅
- `npm run verify` ✅
- `pnpm run guard:all` ✅
- `pnpm run build:web` ✅
