# NEXT_MISSION_RECOMMENDATION

Mode: recommendation after read-only diagnostic capture  
Evidence date: 2026-06-05

## Recommendation

Recommended next mission: **A. deeper diagnostic capture**.

## Why not a fix mission yet?

Repository evidence strongly identifies mixed-surface flash candidates, but the mission did not capture live browser first-frame screenshots, route-click transition screenshots, network waterfalls, or hydration console warnings. A bounded safe fix is likely possible, but choosing the exact file/surface contract now would still involve guessing.

## Required next diagnostic capture

Run the app with V2/debug enabled and capture direct load plus client-side route transitions for:

- `/`
- `/about`
- `/blog`
- `/contact`
- `/treatments`
- `/treatments/teeth-whitening`
- `/treatments/implants-single-tooth`
- `/treatments/3d-digital-dentistry`

Use existing debug query flags:

```text
?heroDebug=1&heroTruth=1&bloomDebug=1
```

Capture at minimum:

1. screenshot immediately after navigation starts or first frame is available;
2. screenshot after 1500ms;
3. browser console output for hero debug/truth logs;
4. computed background for `html`, `body`, `main`, header, hero root, hero surfaces, and below-hero content;
5. network waterfall timing for global CSS and hero assets;
6. PRM off and PRM on comparisons;
7. hydration warnings/errors, if any.

## Decision gate after deeper capture

Proceed to **B. bounded safe fix plan** only if the next capture proves one dominant cause:

- root/main background visibly shows during hero/page swap;
- header translucent surface is visibly mismatched;
- hero fallback appears during normal navigation;
- hero base layer is transparent before image/fx layers load;
- content fade/media readiness timing exposes a wrong surface.

Proceed to **C. certification** only if direct-load and route-click captures show no visible blocker, no unexpected fallback, no hydration mismatch, and guards continue to pass.

## Guard requirement for any future implementation

Any future implementation mission must run:

- `npm run guard:hero`
- `npm run guard:canon`
- `npm run verify`

If any command is missing or fails, stop and report rather than patching blindly.
