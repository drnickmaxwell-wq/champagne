# Lighthouse / CWV / Mobile / Accessibility Evidence Rerun Report V1

Generated: 2026-06-02T17:19:58.990Z

## Classification

READY_FOR_FINAL_CERTIFICATION_RECHECK

## Route availability

8/8 required routes returned HTTP 200 in the local production server rerun.

- /: HTTP 200
- /contact: HTTP 200
- /treatments/emergency-dentistry: HTTP 200
- /treatments/implants: HTTP 200
- /treatments/clear-aligners-spark: HTTP 200
- /treatments/3d-dentistry-and-technology: HTTP 200
- /treatments/sedation-dentistry: HTTP 200
- /treatments/preventative-and-general-dentistry: HTTP 200

## Lighthouse / CWV-style lab evidence

8/8 routes produced Lighthouse JSON under mobile form-factor lab settings. INP is unavailable in local Lighthouse lab evidence, so Total Blocking Time is recorded as the INP proxy.

| Route | Perf | A11y | FCP | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| / | 75 | 96 | 1.3 s | 2.3 s | 0 | 1,120 ms |
| /contact | 75 | 96 | 1.3 s | 2.5 s | 0 | 1,070 ms |
| /treatments/emergency-dentistry | 75 | 96 | 1.2 s | 2.5 s | 0 | 1,030 ms |
| /treatments/implants | 74 | 100 | 1.2 s | 2.5 s | 0 | 1,100 ms |
| /treatments/clear-aligners-spark | 70 | 100 | 1.2 s | 2.7 s | 0 | 1,530 ms |
| /treatments/3d-dentistry-and-technology | 76 | 100 | 1.3 s | 2.6 s | 0 | 930 ms |
| /treatments/sedation-dentistry | 77 | 100 | 1.3 s | 2.5 s | 0 | 880 ms |
| /treatments/preventative-and-general-dentistry | 75 | 100 | 1.3 s | 2.6 s | 0 | 1,020 ms |

## Mobile readiness evidence

8/8 routes passed the Playwright mobile viewport evidence checks at 390x844.

## Accessibility evidence

8/8 routes passed basic automated accessibility heuristics. axe-core was not installed, so no dependency was added; Lighthouse accessibility scores and DOM heuristics are recorded.

## Remaining performance risks

- /: high_total_blocking_time_inp_proxy (medium) — 1,120 ms
- /: lighthouse_accessibility_below_100 (low) — 96
- /contact: high_total_blocking_time_inp_proxy (medium) — 1,070 ms
- /contact: lighthouse_accessibility_below_100 (low) — 96
- /treatments/emergency-dentistry: high_total_blocking_time_inp_proxy (medium) — 1,030 ms
- /treatments/emergency-dentistry: lcp_above_good_lab_threshold (medium) — 2.5 s
- /treatments/emergency-dentistry: lighthouse_accessibility_below_100 (low) — 96
- /treatments/implants: high_total_blocking_time_inp_proxy (medium) — 1,100 ms
- /treatments/implants: lcp_above_good_lab_threshold (medium) — 2.5 s
- /treatments/clear-aligners-spark: high_total_blocking_time_inp_proxy (medium) — 1,530 ms
- /treatments/clear-aligners-spark: lcp_above_good_lab_threshold (medium) — 2.7 s
- /treatments/3d-dentistry-and-technology: high_total_blocking_time_inp_proxy (medium) — 930 ms
- /treatments/3d-dentistry-and-technology: lcp_above_good_lab_threshold (medium) — 2.6 s
- /treatments/sedation-dentistry: high_total_blocking_time_inp_proxy (medium) — 880 ms
- /treatments/preventative-and-general-dentistry: high_total_blocking_time_inp_proxy (medium) — 1,020 ms
- /treatments/preventative-and-general-dentistry: lcp_above_good_lab_threshold (medium) — 2.6 s

## Recommendation

READY_FOR_FINAL_CERTIFICATION_RECHECK
