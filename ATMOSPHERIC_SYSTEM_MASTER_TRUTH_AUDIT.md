# ATMOSPHERIC_SYSTEM_MASTER_TRUTH_AUDIT

Role: `CHAMPAGNE_ATMOSPHERIC_SYSTEM_FORENSIC_AUDITOR`

Repository: `drnickmaxwell-wq/champagne`

Mode: repository-evidence-only audit. No implementation, redesign, or sacred-file edits were performed.

## Scope inspected

This audit read design/material/token canons, token/theme/surface CSS, hero atmosphere manifests, hero runtime/model wiring, surface wrappers, motion/visual reports, and related docs under `apps`, `packages`, `docs`, `reports`, `REPORTS`, `scripts`, and `tests`.

Primary evidence files:

- `docs/canon/design/CHAMPAGNE_MATERIAL_AND_TOKEN_CANON_V1.md`
- `packages/champagne-tokens/styles/champagne/tokens.css`
- `packages/champagne-tokens/styles/champagne/theme.css`
- `packages/champagne-tokens/styles/champagne/time-of-day.css`
- `packages/champagne-tokens/styles/champagne/surface.css`
- `packages/champagne-manifests/data/hero/sacred_hero_base.json`
- `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json`
- `packages/champagne-manifests/data/hero/sacred_hero_variants.json`
- `packages/champagne-manifests/data/hero/sacred_hero_weather.json`
- `packages/champagne-hero/src/hero-engine/HeroConfig.ts`
- `packages/champagne-hero/src/hero-engine/HeroRuntime.ts`
- `apps/web/app/components/hero/v2/buildHeroV2Model.ts`
- `apps/web/app/champagne/hero-preview/page.tsx`
- `apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx`
- `apps/web/app/components/sections/SectionShell.tsx`
- `packages/champagne-canon/canon/fx/fx-manifest-schema-time-of-day.json`
- `packages/champagne-canon/canon/fx/champagne-lighting-and-shimmer-recipes.md`
- `packages/champagne-canon/canon/narrative/01_narrative_flow_engine.json`
- `docs/champagne-os/emotion/champagne-emotional-lighting-presets.json`

## Executive truth table

| Question | Implemented truth | Evidence summary |
| --- | --- | --- |
| 1. Time-of-day systems exist? | Partially. Hero runtime has `HeroTimeOfDay` and accepts `timeOfDay`; hero weather manifest has day/evening/night; CSS has dawn/dusk/night selectors. But app-wide time-of-day state orchestration is not implemented. | `HeroTimeOfDay` is day/evening/night in `HeroConfig.ts`; `getHeroRuntime` reads `options.timeOfDay`; `time-of-day.css` only maps root data-theme values to `--bg-ink`; canon docs define richer dawn/midday/goldenHour/inkfall states. |
| 2. Day/night systems exist? | Partially. Night is the default hero tone and preview can map light/dark to day/night. There is no global day/night controller, scheduler, persistence, or environment provider. | Sacred base defaults to `tone: night`; preview maps theme `light` to `day` and otherwise `night`; token CSS has root theme selectors. |
| 3. Atmospheric state infrastructure exists? | Partially. Canon and manifests describe weather, lighting, particles, grain, shimmer, caustics, tone, and energy modes. Runtime merges only hero-oriented weather/time and variant surface tokens. | Hero base default surfaces include gradient, wave, particle, grain, motion, video off; surface manifest governs overlays and motion; runtime merges base, weather, and variant tokens. |
| 4. Surface-state switching exists? | Minimal. Porcelain surface attributes exist, and semantic surface tokens exist. There is no generalized surface-state switcher beyond static `data-surface="porcelain"` and hero surface stack selection. | `theme.css` reacts to porcelain data attributes; builder and SectionShell set `data-surface="porcelain"`; hero runtime selects surface tokens through manifests. |
| 5. Lighting-state infrastructure exists? | Mostly canon/manifest-level, partially hero-rendered. Hero surface stack contains an `overlay.lighting` layer and CSS renders a token-derived lighting gradient; canon files define lighting states. No app-level lighting-state API exists. | `sacred_hero_surfaces.json` has `overlay.lighting`; `surface.css` defines `.hero-surface--lighting`; canon fx schema and emotional lighting presets define lighting IDs. |
| 6. Token-driven atmosphere exists? | Yes for primitives and hero surface variables, but incomplete for richer time states. Atmosphere uses CSS variables for brand chroma, ink, porcelain, glass, particles, grain, surface opacities/blends, and lighting. | `tokens.css` defines brand/material/surface variables; `surface.css` defines hero asset vars, opacity vars, blend vars, z-index vars. |
| 7. Seasonal infrastructure exists? | No implemented system found. Repository hits for season are content references only. | `rg` found seasonality in treatment copy/report content, not a seasonal token/provider/manifest/runtime. |
| 8. Hero atmosphere integration exists? | Yes. The sacred hero system integrates tone, timeOfDay/weather, variant particles, motion overlays, film grain, PRM filtering, and V2 model rendering. | `HeroRuntime.ts` merges base/weather/variant surfaces and motion; `buildHeroV2Model.ts` passes `timeOfDay` and computes active motion/layers. |
| 9. Persian Midnight dependencies exist? | Yes as design canon and token dependency, but exact material remains flagged as needing final tuning. | Canon declares Persian Midnight Velvet Blue as primary dark material and notes exact token needs final tuning; `tokens.css` derives `--brand-ink` from ink mixed with teal/magenta. |
| 10. Porcelain surface dependencies exist? | Yes. Canon defines porcelain as primary readable light material; tokens define porcelain surface ladder and text tokens; app wrappers set porcelain attributes. | Canon porcelain section; `--surface-0/1/2`; porcelain text tokens; builder and SectionShell use `data-surface="porcelain"`. |

## Implemented atmospheric substrate

### Canon layer

The design canon explicitly distinguishes immutable brand chroma from mood/time/surface tokens and states that the brand magenta, teal, and gold anchors are not mood tokens, not time-of-day tokens, and not per-surface preferences. It separately defines Persian Midnight Velvet Blue as the primary dark material and porcelain as the primary calm readable light material.

The canon allows time-of-day variants to adjust ambient warmth, background depth, sheen opacity, vignette strength, lighting temperature, particle visibility, glass opacity, and cinematic layer intensity, while forbidding alteration of immutable brand chroma.

The fx canon defines richer temporal states: dawn, midday, goldenHour, and inkfall, with associated surface material IDs, background FX IDs, and accent FX IDs. Its own metadata says time-of-day modes remain optional and must be applied safely.

### Token layer

The active token package provides:

- fixed brand chroma and legacy aliases;
- `--brand-ink` derived from base ink mixed through teal/magenta influence;
- porcelain ladder tokens `--surface-0`, `--surface-1`, and `--surface-2`;
- glass tokens `--surface-glass` and `--surface-glass-deep`;
- ink and porcelain text tokens;
- particle, grain, glass, sheen, warm-lift, and surface opacity controls.

The theme file imports time-of-day and surface CSS, sets default ink context on `:root`, and applies porcelain text-token overrides to `[data-surface-tone='porcelain']` and `[data-surface='porcelain']`.

The active `time-of-day.css` is very small. It only handles `:root[data-theme='dawn']`, `:root[data-theme='dusk']`, and `:root[data-theme='night']`, and only changes `--bg-ink`. It does not define full lighting, particles, glass, vignette, or seasonal state variables.

### Hero atmosphere layer

The hero engine has a typed time-of-day union of day/evening/night. Runtime options accept `timeOfDay`, and runtime selection checks for time-of-day variants after explicit variant and treatment matching.

The hero base manifest defaults to night tone, disables internal overlays, allowlists motion overlays, declares gradient/wave/particle/grain/motion surfaces, disables video, and sets motion and film grain defaults.

The hero weather manifest maps day/evening/night to tone-specific particles and motion. However, the evening manifest references `overlay.goldDust`, while the base allowlist and surface/variant manifests use `overlay.goldDustDrift`; this is a residue/mismatch risk to be validated before relying on evening state.

The hero variants manifest contains many night-toned variants plus one explicit `timeOfDay: day` variant. Treatment/family variants tune particle color and energy modes but are not time-of-day variants.

### Surface-state layer

Surface semantics currently exist as:

- static porcelain attributes in page builder and SectionShell;
- token-context override in `theme.css` for porcelain attributes;
- semantic surface tokens used by section components;
- hero-specific surface stack manifests and runtime resolution.

No general `surfaceState` model, provider, switcher, manifest, or route-level atmosphere state map was found.

### Lighting/mood/environment layer

Lighting and mood exist as canons and data manifests. The emotional lighting presets define IDs with light rigs, weather layer IDs, time-of-day tokens, and surface material tokens. The narrative canon maps chapters to lighting, weather, and motion. The 3D asset docs include lighting presets. These are not wired into the current website runtime as a unified atmospheric state machine.

## Major gaps

1. No global atmospheric state provider or route/page atmosphere manifest was found.
2. No scheduler, local time, geolocation, weather API, seasonal calendar, or day/night persistence was found.
3. Active time-of-day CSS is limited to `--bg-ink` changes and does not express the canon-level atmospheric parameters.
4. Canon temporal state vocabulary is inconsistent with hero runtime vocabulary: canon uses dawn/midday/goldenHour/inkfall while hero runtime uses day/evening/night.
5. Hero evening weather references `overlay.goldDust`, but current allowlists/surfaces commonly reference `overlay.goldDustDrift`.
6. Porcelain/ink/glass surface semantics exist, but surface-state switching remains static and local.
7. Persian Midnight is canonized and token-derived, but exact final tuning is explicitly still unresolved in the canon.

## Forensic conclusion

Champagne currently has a real atmospheric foundation, not a complete atmospheric system. The strongest implemented area is the sacred hero atmosphere pipeline. The strongest canonical area is material/time/light design language. The weakest implemented areas are global time-of-day orchestration, day/night state management, seasonal infrastructure, and generalized surface-state switching.
