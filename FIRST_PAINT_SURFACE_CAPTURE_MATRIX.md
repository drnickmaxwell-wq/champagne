# FIRST_PAINT_SURFACE_CAPTURE_MATRIX

Role: `NAV_HERO_BACKGROUND_FLASH_DEEP_CAPTURE_DIRECTOR`  
Mode: read-only browser evidence capture; documentation-only output  
Evidence date: 2026-06-05  
App command: `NEXT_PUBLIC_HERO_ENGINE=v2 pnpm dev:web`  
Capture command: temporary Playwright diagnostic script outside the repo (`/tmp/capture_min.mjs`), no repository source edits.

## Capture scope

Routes captured at 1365×900 Chromium viewport:

- `/`
- `/treatments/composite-bonding`
- `/treatments/teeth-whitening` as the additional representative treatment route

Each route was captured with debug flags:

```text
?heroDebug=1&heroTruth=1&bloomDebug=1
```

Two media modes were captured:

- default motion
- `prefers-reduced-motion: reduce`

Timing labels:

- `immediate`: first diagnostic read after `domcontentloaded` plus ~50ms; this is not a raw pre-CSS browser first pixel.
- `hydrated`: diagnostic read after an additional ~1500ms.

## First-paint / post-hydration computed surface matrix

| Context | Route | Moment | html / body background | main background | header background | hero root / base background | Hero V2 gradient.base | wave backdrop opacity | hero content opacity | surface layers / motion layers | fallback seen |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| motion-default | `/` | immediate (~2530ms) | `oklab(0.25248 0.00174809 -0.00324971)` / same | `rgba(0, 0, 0, 0)` | `color(srgb 0.134572 0.132574 0.140214 / 0.85)` | transparent / transparent | `linear-gradient(135deg, rgb(194, 24, 91) 0%, rgb(64, 196, 180) 60%, rgb(212, 175, 55) 100%)`, opacity `1` | `0` | `1` | `13 / 4` | no |
| motion-default | `/` | hydrated (~5198ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| motion-default | `/treatments/composite-bonding` | immediate (~5084ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| motion-default | `/treatments/composite-bonding` | hydrated (~7615ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| motion-default | `/treatments/teeth-whitening` | immediate (~7869ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| motion-default | `/treatments/teeth-whitening` | hydrated (~10980ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| reduced-motion | `/` | immediate (~2224ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| reduced-motion | `/` | hydrated (~3896ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| reduced-motion | `/treatments/composite-bonding` | immediate (~4768ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| reduced-motion | `/treatments/composite-bonding` | hydrated (~6325ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| reduced-motion | `/treatments/teeth-whitening` | immediate (~3810ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |
| reduced-motion | `/treatments/teeth-whitening` | hydrated (~5358ms) | same | transparent | same | transparent / transparent | same, opacity `1` | `0` | `1` | `13 / 4` | no |

## Interpretation

- Browser-computed `html` and `body` resolve to the same dark ink value across all sampled routes and modes.
- `<main>` is transparent across all captures, so the visible page canvas behind hero and route content remains the root/body ink unless a child surface paints over it.
- Header/nav is a stable translucent ink mix across all captures.
- Hero V2 root and its immediate BaseChampagneSurface wrapper are transparent; the visible hero base in these captures is the `gradient.base` layer, not the frame/background itself.
- The wave backdrop asset URL is present but opacity is `0` in all captures, so it is not contributing to first visible color in the sampled state.
- Reduced-motion did not change the computed root/header/hero base colors in this capture; motion layer count remained present in DOM, but CSS media rules may visually hide motion layers.
- No Hero V2 fallback text appeared in any direct-load capture.

## Evidence limitations

- This matrix captures DOM/CSS after `domcontentloaded` plus ~50ms, not the browser’s raw first pixel before app CSS and markup are applied.
- Pixel screenshots were attempted in earlier temporary tooling but were not retained in the repository; final successful capture used computed style evidence only.
- Direct client-side Link-click route transition capture proved unstable in this environment because navigation could destroy the evaluation context during measurement. The transition matrix therefore uses browser navigation after a prior route as bounded route-level evidence, not a perfect SPA-click proof.
