# Lighthouse / CWV / Mobile / Accessibility Evidence Report V1

Generated: 2026-06-02T12:46:06.367Z

## Classification

**NEXT_MISSION_REQUIRED**

## Highest ROI Next Mission

ROUTE_AVAILABILITY_RECONCILIATION_FOR_3D_DENTISTRY_AND_TECHNOLOGY: reconcile the requested /treatments/3d-dentistry-and-technology route with the production app router so Lighthouse/mobile/accessibility evidence can cover the full required route set.

## Scope Boundary

Evidence only. No redesign, deployment, SEO/schema/manifest mutation, chatbot runtime change, PHI/PMS/Dentally integration change, booking workflow change, or binary screenshot/PDF artifact was committed.

## Tooling Inspected / Used

- Existing build script: `pnpm run build:web`.
- Existing production server path: `cd apps/web && pnpm exec next start -p 3000` (equivalent to the app's `next start`).
- Existing Playwright dependency: `playwright@1.57.0`.
- Lighthouse was not installed in repo scripts; this packet used ephemeral `pnpm dlx lighthouse` with Playwright Chromium and did not add it as a dependency.
- `axe-core` was not installed; no heavy dependency was added. Accessibility evidence uses Lighthouse accessibility scores plus Playwright DOM/accessibility heuristics.

## Routes Tested

- /
- /contact
- /treatments/emergency-dentistry
- /treatments/implants
- /treatments/clear-aligners-spark
- /treatments/3d-dentistry-and-technology
- /treatments/sedation-dentistry
- /treatments/preventative-and-general-dentistry

## Lighthouse / CWV-Style Lab Results

Mobile Lighthouse profile where Lighthouse completed. INP is not available in local lab; TBT is recorded as the lab proxy.

| Route | LH status | Perf | A11y | Best practices | SEO | LCP | CLS | TBT / INP proxy |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| / | measured | 71 | 96 | 100 | 54 | 2.7 s | 0 | 1,400 ms |
| /contact | measured | 75 | 96 | 100 | 54 | 2.3 s | 0 | 1,110 ms |
| /treatments/emergency-dentistry | measured | 72 | 96 | 100 | 54 | 2.7 s | 0 | 1,240 ms |
| /treatments/implants | measured | 70 | 100 | 100 | 54 | 2.7 s | 0 | 1,580 ms |
| /treatments/clear-aligners-spark | measured | 72 | 100 | 100 | 54 | 2.6 s | 0 | 1,310 ms |
| /treatments/3d-dentistry-and-technology | failed_load | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| /treatments/sedation-dentistry | measured | 76 | 100 | 100 | 54 | 2.5 s | 0 | 920 ms |
| /treatments/preventative-and-general-dentistry | measured | 70 | 100 | 100 | 54 | 2.7 s | 0 | 1,560 ms |

## Mobile Readiness Results

Viewport: 390x844, mobile emulation, touch enabled.

| Route | Status | HTTP | Loads | Primary content | Answer surface | No horizontal overflow | No SSR/hydration crash |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| / | pass | 200 | yes | yes | no | yes | yes |
| /contact | pass | 200 | yes | yes | yes | yes | yes |
| /treatments/emergency-dentistry | pass | 200 | yes | yes | yes | yes | yes |
| /treatments/implants | pass | 200 | yes | yes | yes | yes | yes |
| /treatments/clear-aligners-spark | pass | 200 | yes | yes | yes | yes | yes |
| /treatments/3d-dentistry-and-technology | review_required | 404 | no | yes | no | yes | yes |
| /treatments/sedation-dentistry | pass | 200 | yes | yes | yes | yes | yes |
| /treatments/preventative-and-general-dentistry | pass | 200 | yes | yes | yes | yes | yes |

## Accessibility Evidence

Automated limitation: axe-core was not present in this repo and was not added. Lighthouse accessibility scores and Playwright DOM/accessibility heuristics were captured.

| Route | Status | HTTP | Headings | Main landmark | Named controls heuristic | Answer HTML readable | Critical issues |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| / | pass_basic_automated_checks | 200 | yes | yes | yes | yes | none |
| /contact | pass_basic_automated_checks | 200 | yes | yes | yes | yes | none |
| /treatments/emergency-dentistry | pass_basic_automated_checks | 200 | yes | yes | yes | yes | none |
| /treatments/implants | pass_basic_automated_checks | 200 | yes | yes | yes | yes | none |
| /treatments/clear-aligners-spark | pass_basic_automated_checks | 200 | yes | yes | yes | yes | none |
| /treatments/3d-dentistry-and-technology | review_required | 404 | yes | yes | yes | no | route_not_2xx |
| /treatments/sedation-dentistry | pass_basic_automated_checks | 200 | yes | yes | yes | yes | none |
| /treatments/preventative-and-general-dentistry | pass_basic_automated_checks | 200 | yes | yes | yes | yes | none |

## Performance / Readiness Risk Register

| Route | Severity | Risk | Evidence |
| --- | --- | --- | --- |
| / | medium | high_total_blocking_time_inp_proxy | 1,400 ms |
| /contact | medium | high_total_blocking_time_inp_proxy | 1,110 ms |
| /treatments/emergency-dentistry | medium | high_total_blocking_time_inp_proxy | 1,240 ms |
| /treatments/implants | medium | high_total_blocking_time_inp_proxy | 1,580 ms |
| /treatments/clear-aligners-spark | medium | high_total_blocking_time_inp_proxy | 1,310 ms |
| /treatments/3d-dentistry-and-technology | high | route_not_lighthouse_measured | Lighthouse JSON was emitted but category scores were unavailable because the requested route failed to load reliably (HTTP 404 confirmed by Playwright/curl). |
| /treatments/sedation-dentistry | medium | high_total_blocking_time_inp_proxy | 920 ms |
| /treatments/preventative-and-general-dentistry | medium | high_total_blocking_time_inp_proxy | 1,560 ms |
| /treatments/3d-dentistry-and-technology | high | mobile_readiness_review_required | {"routeLoads":false,"noFatalConsoleErrors":true,"primaryContentVisible":true,"answerSurfacesVisible":false,"navigationUsableEnoughForEvidence":true,"noHorizontalOverflow":true,"noSsrHydrationCrash":true} |
| /treatments/3d-dentistry-and-technology | high | basic_accessibility_review_required | ["route_not_2xx"] |

## Certification Recheck Recommendation

**NEXT_MISSION_REQUIRED**

Current evidence is generated, but the full requested route set is not certification-recheck ready because `/treatments/3d-dentistry-and-technology` returned HTTP 404 in the local production build and Lighthouse could not complete that route.
