# Hero V3 H3.1 Diagnostic Report V1

**Verdict:** `DIAGNOSIS_COMPLETE_NO_REPAIR`

**Base:** `a00f718a93710028b364930566d7f6a44483bc25`

**Lab:** `/champagne/hero-v3-diagnostic`

**Production binding:** `false`

## Outcome

The current obvious motion seam is primarily caused by four intrinsically
non-seamless VP9 videos with identical `5.042s` durations and synchronised
start/loop behaviour. They return to visually different first frames at
approximately the same moment. H3.1 diagnoses this defect and does not repair it.

The prior route-navigation restart is a different historical mechanism. Current
V2 source preserves a persistent surface stack and shared video nodes across
client navigation. H3.1 does not alter that lifecycle.

## Layer inventory

### Static and reduced-motion stack

1. `gradient.base` — `var(--smh-gradient)`.
2. `field.waveBackdrop` — desktop and mobile Sacred wave backgrounds.
3. `field.waveRings` — `wave-field.svg`.
4. `mask.waveHeader` — registered desktop/mobile WebP mask assets.
5. `field.dotGrid` — `wave-dots.svg`.
6. `overlay.particles` — static home particles.
7. `overlay.filmGrain` — desktop/mobile film grain.
8. `overlay.lighting` — renderer-generated lighting plane.
9. `overlay.sacredBloom` — conditional renderer-generated bloom.
10. `hero.contentFrame` — protected content plane.

The desktop and mobile `wave-mask-*.webp` files at the commissioned base are
both zero bytes. Consequently the visible wave/cut character at this base is
being carried by the backdrop, field, dot, gradient and light composition—not
usable pixels from those two registered WebP masks. This is recorded for a later
exact tranche; H3.1 does not repair or replace the assets.

### Motion stack

| Surface | Asset | Blend | Manifest opacity |
|---|---|---:|---:|
| `sacred.motion.waveCaustics` | `wave-caustics.webm` | screen | 0.21 |
| `sacred.motion.glassShimmer` | `glass-shimmer.webm` | soft-light | 0.19 |
| `sacred.motion.particleDrift` | `particles-drift.webm` | screen | 0.10 |
| `sacred.motion.goldDust` | `gold-dust-drift.webm` | soft-light | 0.15 |

All four are VP9, 1280×720, 24fps, start at `0.000s` and last `5.042s`.

## Seam evidence

First-frame versus near-final-frame SSIM:

| Asset | SSIM | Interpretation |
|---|---:|---|
| Glass shimmer | 0.726659 | Large visual discontinuity |
| Wave caustics | 0.779068 | Large visual discontinuity |
| Gold dust | 0.886627 | Material discontinuity |
| Particle drift | 0.952830 | Smaller but visible discontinuity |

The videos share duration and begin together, so their discontinuities align.
This produces the detectable collective restart around every five seconds.

The shared `heroMotionTide` transform lasts 42 seconds, with identical 0% and
100% transform states. `heroGoldDustPulse` lasts 24 seconds with a 6-second delay
and likewise returns to its initial filter. Those animations create common phase
cadence but do not explain the hard five-second image reset. The 220ms opacity
reveal and 1200ms ready fallback may affect initial entry, not repeated five-
second seams.

## Diagnostic laboratory

The isolated route imports the real `HeroRendererV2`. It provides:

- each known static surface independently;
- cumulative static builds;
- complete V2 static;
- each motion surface independently;
- complete V2 motion;
- reduced-motion V2;
- desktop, tablet and mobile evidence frames;
- visibility, opacity, blend, crop, focal position, phase and playback controls;
- computed opacity, blend, z-index, background, mask and CSS animation data;
- live video duration, current time, distance-to-boundary and ready state;
- 200ms time-regression detection;
- node identity and replacement detection;
- downloadable machine-readable live evidence.

Overrides are local, ephemeral and resettable. The route has `robots` set to
no-index/no-follow. It changes no public Hero route or Sacred runtime file.

## Visual evidence

- `HERO_V3_H3_1_STATIC_LAYER_CONTACT_SHEET_V1.jpg` shows the real resolved source
  layers and exposes the zero-byte mask fact.
- `HERO_V3_H3_1_MOTION_FRAME_CONTACT_SHEET_V1.jpg` shows real frames at 0.0,
  2.5 and 5.0 seconds for every active motion asset.
- `HERO_V3_H3_1_RESPONSIVE_ASSET_CONTACT_SHEET_V1.jpg` compares the actual
  desktop/mobile source assets.

Browser runtime capture remains outstanding in this execution environment: no
Chromium binary was installed and the restricted Playwright mirrors returned
invalid downloads. This is not concealed as a pass. The production build
successfully generated the diagnostic route, and the lab carries the runtime
probes needed for Founder or preview-browser evidence without changing public
behaviour.

## H3.2 decisions required

1. Confirm the then-current `CHAMPAGNE_FOUNDER_BRAND_DNA_V1` and relevant domain
   profile versions as visual authority.
2. Choose the Founder-preferred diagnostic static state as H3.2 starting preset.
3. Approve the initial desktop, tablet and mobile focal/safe zones.
4. Decide whether zero-byte registered mask assets are repaired in a separately
   named asset tranche or intentionally retired from the V3 composition.
5. Approve measured numeric first-paint, network, decode, memory and GPU budgets.
6. Confirm the first H3.2 comparison set and evidence cadence.

No H3.2 implementation is authorised by this report.
