# Routing Canon Receipts

## Pre-change routing precedence
- `/treatments/implants`, `/treatments/whitening`, and `/treatments/veneers` resolved to the static leaf implementations in `apps/web/app/(champagne)/treatments/*/page.tsx` (logs showed pageKey set to each slug when requested with `heroDebug=1`).【b76b9f†L1-L15】【e44a15†L1-L18】【1c5f16†L1-L15】

## Canonical routing actions
- Removed duplicate static treatment leaf routes and their shared helper under `apps/web/app/(champagne)/treatments/**` so only the dynamic `[slug]` page is present.
- Removed preview-only routing under `apps/web/app/preview/(champagne)/[...slug]/page.tsx` and `apps/web/app/preview/treatments/[slug]/page.tsx`.
- Added a server-side canonical route marker log in `apps/web/app/treatments/[slug]/page.tsx`.

## Canonical source of truth
- `apps/web/app/treatments/[slug]/page.tsx` is the sole leaf implementation for `/treatments/<slug>`.

## URL checks (dev)
- `/treatments` renders successfully after the cleanup.【084282†L1-L1】
- `/treatments/implants` served via the canonical dynamic route (log marker emitted).【441bd9†L1-L14】
- `/treatments/whitening` served via the canonical dynamic route (log marker emitted).【428b87†L1-L13】
- `/treatments/veneers` served via the canonical dynamic route (log marker emitted).【160fe0†L1-L13】

## Remaining known conflicts
- None observed; dev server produced no duplicate route warnings after cleanup.
