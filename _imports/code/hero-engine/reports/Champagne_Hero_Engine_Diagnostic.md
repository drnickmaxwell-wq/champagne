# Champagne Hero Engine Diagnostic

## Architecture overview
- **HeroEngine** (`components/champagne/hero/HeroEngine.tsx`) acts as the gatekeeper: it blocks non-preview requests unless `allowNonPreview` is set, validates incoming schemas via `validateHeroSchema`, then renders `HeroFrame`.【F:components/champagne/hero/HeroEngine.tsx†L1-L24】
- **HeroFrame** composes the hero surface: tone/intensity/layout class resolution, wave stack, shimmer layer, text copy, and CTA plate via `HeroCTABar`. Tone/time-of-day classes come from `getHeroToneClasses`.【F:components/champagne/hero/HeroFrame.tsx†L1-L45】
- **Wave + shimmer layers**: `HeroWaveStack` maps masks and layering strength; `HeroShimmer` chooses particle textures and density per tone and shimmer settings.【F:components/champagne/hero/HeroWaveStack.tsx†L1-L43】【F:components/champagne/hero/HeroShimmer.tsx†L1-L36】
- **CTA plate**: `HeroCTABar` wraps primary/secondary CTAs with `PreviewChampagneCTA` and tone-aware classes, pairing with the glass CTA plate styling in `hero-engine.css` / `cta-system-v2.css`.【F:components/champagne/hero/HeroCTABar.tsx†L1-L31】【F:styles/champagne/cta-system-v2.css†L1-L22】
- **Schema + tone utilities**: `hero-schema.ts` defines tone/time-of-day/mood enums, wave/shimmer/CTA fields, defaults, and validator; `hero-tone.ts` maps time-of-day to wrapper/wave/shimmer/CTA tone variants.【F:lib/champagne/hero-schema.ts†L1-L122】【F:lib/champagne/hero-tone.ts†L1-L24】
- **Presets**: `hero-presets.ts` supplies treatment-ready schemas (whitening, composite bonding, implants, veneers, orthodontics) with CTA class wiring and tone profiles. `HERO_PRESETS` aggregates them.【F:lib/champagne/hero-presets.ts†L1-L79】【F:lib/champagne/hero-presets.ts†L170-L182】

## Preset flow and tone/time-of-day
- Presets feed directly into `HeroEngine` in preview treatments (e.g., `WhiteningHero` and `CompositeBondingHero`). The engine validates each preset before rendering, enforcing tone/time-of-day (`toneProfile.timeOfDay`) and mood-depth/contrast settings used by `getHeroToneClasses` for wrapper, wave, shimmer, and CTA tone variants.【F:components/preview/treatments/whitening/WhiteningHero.tsx†L1-L12】【F:lib/champagne/hero-tone.ts†L1-L24】
- The schema validator clamps wave opacity/strength, shimmer density/style, CTA labels/hrefs, and normalizes layout variants (`left` vs `center`). Tone/time-of-day fallbacks ensure unsupported inputs resolve to the dusk default set.。【F:lib/champagne/hero-schema.ts†L52-L130】【F:lib/champagne/hero-schema.ts†L130-L199】

## Usage mapping
- **Whitening preview**: `components/preview/treatments/whitening/WhiteningHero` imports `HeroEngine` and injects `whitening_hero` preset inside a local hero band wrapper. Rendered in `app/preview/treatments/whitening/page.tsx` before the main body stack.【F:components/preview/treatments/whitening/WhiteningHero.tsx†L1-L12】【F:app/preview/treatments/whitening/page.tsx†L19-L38】
- **Composite bonding preview**: `components/preview/treatments/composite-bonding/CompositeBondingHero` uses the `composite_bonding_hero` preset similarly, with page assembly in `app/preview/treatments/composite-bonding/page.tsx`.【F:components/preview/treatments/composite-bonding/CompositeBondingHero.tsx†L1-L12】【F:app/preview/treatments/composite-bonding/page.tsx†L18-L38】
- **Supporting hero-like shells**: legacy/static preview heroes (e.g., `ChampagnePreviewHero`, `PreviewHero`, `HeroGilded`, and treatment sections under `/components/preview/` and `/components/sections/`) are separate; they do not invoke `HeroEngine` but provide context for legacy CTA/gradient treatments.

## Tone profiles & presets
- Tones available: dusk, teal-lux, noir, dawn, whitening, custom, plus treatment-specific aliases (whitening_dawn, bonding_dusk, implants_dusk, veneers_dusk, ortho_dusk).【F:lib/champagne/hero-schema.ts†L1-L37】
- Time-of-day states: dawn, day, dusk, night — drive wrapper tone class + CTA tone variant. Moods: whitening_calm, bonding_sculpted, implants_confident, veneers_polished, ortho_precise. Intensities: soft, standard, lux, medium, bold.【F:lib/champagne/hero-schema.ts†L15-L34】【F:lib/champagne/hero-tone.ts†L1-L24】
- Presets include CTA classes (`cta-primary-ink-light`, `cta-secondary-glass-gold`), wave mask/opacity/blend, shimmer density/style, layout, and tone profile per treatment (details expanded in the dedicated presets map).【F:lib/champagne/hero-presets.ts†L1-L170】

## Wiring into preview treatments
- `/app/preview/treatments/layout.tsx` wraps all treatment routes with `PreviewShell` → `.cpv-page cpv-page--champagne-dark cpv-page--treatments` container, ensuring the hero engine inherits the champagne-dark canvas. Routes are normalized via `data-treatment` for slug variants (e.g., composite, implants).【F:app/preview/treatments/layout.tsx†L1-L36】
- `/app/preview/layout.tsx` is pass-through, so the treatments layout provides the main shell. `PreviewShell` adds dusk theming, header/footer, particles, and backdrop layers used across preview canvases.【F:app/preview/layout.tsx†L1-L5】【F:components/preview/layout/PreviewShell.tsx†L1-L18】

## Notes on dependencies
- **HeroEngine → HeroFrame → {HeroWaveStack, HeroShimmer, HeroCTABar}** chain encapsulates wave/shimmer/CTA systems. CTA rendering delegates to `PreviewChampagneCTA`, tying CTA styling to `preview-cta.module.css` plus tone-aware classnames from the schema/presets.【F:components/champagne/hero/HeroFrame.tsx†L20-L44】【F:components/champagne/hero/HeroCTABar.tsx†L1-L31】
- **Styles**: `hero-engine.css` imports `cta-system-v2.css` ensuring Regal Glass–Gold CTA tokens and hero gradients apply without touching runtime TS/TSX logic.【F:styles/champagne/hero-engine.css†L1-L21】
