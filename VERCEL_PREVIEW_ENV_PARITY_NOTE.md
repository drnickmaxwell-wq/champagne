# VERCEL_PREVIEW_ENV_PARITY_NOTE

Role: `HERO_V2_NAVIGATION_FLASH_FAILURE_RESPONSE_DIRECTOR`  
Evidence date: 2026-06-05

## Environment-sensitive switches

## 1. Brand hero enablement

`isBrandHeroEnabled()` returns:

- in production, disabled by default unless `NEXT_PUBLIC_FEATURE_BRAND_HERO` is exactly `true` or `1`;
- in non-production, enabled by default when the flag is undefined.

Vercel Preview uses a production build/runtime profile, so the preview must have `NEXT_PUBLIC_FEATURE_BRAND_HERO=1` or `true` for this code path to match local proof captures.

## 2. Hero engine selection

`HeroMount` selects Hero V2 only when normalized `NEXT_PUBLIC_HERO_ENGINE` equals `v2`. Any missing, misspelled, quoted incorrectly, or differently cased value after normalization may fall back to V1.

## 3. Debug and truth query behavior

`HeroMount` server-side debug attributes depend on `heroDebug` being present in the server-derived `next-url`. During click navigation, target links generally do not preserve `?heroDebug=1&heroTruth=1`, so post-click debug attributes may disappear even while the issue remains visible.

## 4. Motion allowlist

`buildHeroV2Model` reads `NEXT_PUBLIC_HERO_MOTION_ALLOWLIST`. If set in Vercel Preview but not local, it can change which motion layers exist. If unset locally but set in Vercel, local proof may not match preview motion composition.

## 5. Content fade switch

`HeroContentFade` is enabled unless `NEXT_PUBLIC_HERO_CONTENT_FADE=0`. A Vercel preview with this unset will replay content opacity on every pathname change.

## 6. Production build evidence from this mission

Local production build with the relevant flags succeeded:

```bash
NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm run build:web
```

Local production server was started with the same flags:

```bash
PORT=3100 NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm --filter web start
```

This proves the local diagnostic exercised a production build with Hero V2 enabled. It does not prove that Vercel Preview has identical environment variables.

## Parity risks

| Risk | Why it matters | Needed evidence |
| --- | --- | --- |
| Preview missing `NEXT_PUBLIC_FEATURE_BRAND_HERO` | Preview could be exercising a different hero path. | Vercel preview env dump or debug overlay showing `data-hero-flag`. |
| Preview missing `NEXT_PUBLIC_HERO_ENGINE=v2` | Preview could fall back to V1. | DOM `data-hero-engine` in preview. |
| Preview has a motion allowlist | Preview may include/exclude different videos. | DOM motion layer count and ids in preview. |
| Preview navigation uses hard document reload | Full document replacement will remount hero regardless of root layout source placement. | Browser devtools: network document request, console context persistence, stack id continuity. |
| Debug query not preserved on links | Can hide debug attributes after click. | Capture with a route-preserving debug instrumentation or browser snippet independent of query. |

## Vercel parity conclusion

The environment most likely matters less than lifecycle because the same reset class reproduced in a local production build. However, Vercel Preview parity is still not proven. The next mission should require a preview DOM/env capture before choosing an implementation.
