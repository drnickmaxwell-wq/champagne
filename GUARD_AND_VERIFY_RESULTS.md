# GUARD_AND_VERIFY_RESULTS

Role: `HERO_V2_FIRST_PAINT_BASE_SURFACE_STABILIZATION_IMPLEMENTER`
Evidence date: 2026-06-05

## Required guard/check results

| Command | Result | Notes |
| --- | --- | --- |
| `npm run guard:hero` | PASS | Hero Guard passed; sacred hero lock verified. |
| `npm run guard:canon` | PASS | Canon Guard passed; patient portal SSR smoke test passed. |
| `npm run verify` | PASS | Token purity, workspace deps, SEO launch safety, guard:all, lint, typecheck, and production build completed. |

## Production recapture setup checks

| Command | Result | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm run build:web` | PASS | Production build completed with Hero V2 flags. |
| `PORT=3100 NEXT_PUBLIC_FEATURE_BRAND_HERO=1 NEXT_PUBLIC_HERO_ENGINE=v2 NEXT_PUBLIC_HERO_DEBUG=1 pnpm --filter web start` | PASS | Production server started locally on port 3100. |
| `pnpm exec playwright install chromium` | PASS with environment warning | Primary CDN returned 403; Microsoft fallback downloaded Chromium/FFMPEG/headless shell successfully. |
| `pnpm exec playwright install-deps chromium` | PASS with environment warning | `mise.jdx.dev` apt source returned 403; Ubuntu package sources succeeded and required Chromium dependencies installed. |
| `node .tmp/hero-v2-recapture.cjs > /tmp/hero-v2-recapture.json` | PASS | Captured first-frame and post-hydration evidence for `/`, `/treatments/composite-bonding`, and `/treatments/teeth-whitening`. |

## Notable non-failing warnings

- `npm` warned: unknown env config `http-proxy`.
- Browserslist warned that `caniuse-lite` data is old.
- Tailwind warned about a broad content pattern.
- Next.js warned that `next lint` is deprecated and that the Next.js plugin was not detected in ESLint config.
- SEO launch safety emitted existing content/layout/cannibalisation review warnings.
- Chatbot engine copy guard warned that the optional QA report/conversation files were absent.

None of these warnings failed the required guard/verify commands.
