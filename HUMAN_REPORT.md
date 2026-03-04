# SUPPORT PAGE METADATA PATCH REPORT

## Mission
Added minimal route-specific metadata exports to support wrapper pages so they no longer inherit root metadata.

## Files Updated
- `apps/web/app/contact/page.tsx`
- `apps/web/app/fees/page.tsx`
- `apps/web/app/team/page.tsx`
- `apps/web/app/blog/page.tsx`
- `apps/web/app/treatments/page.tsx`
- `apps/web/app/(champagne)/smile-gallery/page.tsx`
- `apps/web/app/patient-portal/page.tsx`
- `apps/web/app/(site)/[page]/page.tsx`

## Approach
- Added `metadata` export for static wrapper pages.
- Added `generateMetadata` for dynamic `/(site)/[page]` route.
- Metadata title/description prefer page manifest fields (`label`, `description`, `intro`) with deterministic fallbacks.
- No changes made to `/treatments/[slug]` metadata.
- No token/hero changes.

## Validation
- `pnpm run guard:all` ✅
- `pnpm run build:web` ✅
- `npm run guard:hero` ✅
- `npm run guard:canon` ✅
- `npm run verify` ✅
