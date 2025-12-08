# Champagne Hero Presets Map

## Overview
All presets live in `lib/champagne/hero-presets.ts` and share CTA wiring to `cta-primary-ink-light` (primary) and `cta-secondary-glass-gold` (secondary). Wave masks, shimmer, tone/time-of-day, and layout are pre-baked per treatment.【F:lib/champagne/hero-presets.ts†L1-L182】【F:styles/champagne/cta-system-v2.css†L1-L22】

## Preset details
- **Whitening hero**
  - Tone: `whitening`; Time: `dawn`; Mood: `whitening_calm`; Depth: soft; Contrast: standard. Intensity: soft; Layout: left.
  - CTA: Primary "Book whitening" → `cta-primary-ink-light`; Secondary "Explore treatment options" → `cta-secondary-glass-gold`; hrefs `/contact` and `/treatments`.
  - Waves: mask `wave-02`, opacity 0.34, blend soft-light, strength strong. Shimmer: enabled, density med, style dust.
  - Route alignment: `/preview/treatments/whitening` via `WhiteningHero` → `HeroEngine(schema=whitening_hero)`.【F:lib/champagne/hero-presets.ts†L6-L55】【F:components/preview/treatments/whitening/WhiteningHero.tsx†L1-L12】

- **Composite bonding hero**
  - Tone: `dusk`; Time: `dusk`; Mood: `bonding_sculpted`; Depth: deep; Contrast: high. Intensity: lux; Layout: left.
  - CTA: Primary "Book a consultation" → `cta-primary-ink-light`; Secondary "AI smile preview" → `cta-secondary-glass-gold`; hrefs `/contact`, `/ai-smile-quiz`.
  - Waves: mask `wave-03`, opacity 0.38, blend overlay, strength strong. Shimmer: enabled, density med, style dust.
  - Route alignment: `/preview/treatments/composite-bonding` via `CompositeBondingHero` → `HeroEngine(schema=composite_bonding_hero)`.【F:lib/champagne/hero-presets.ts†L57-L115】【F:components/preview/treatments/composite-bonding/CompositeBondingHero.tsx†L1-L12】

- **Implants hero**
  - Tone: `noir`; Time: `day`; Mood: `implants_confident`; Depth: standard; Contrast: standard. Intensity: standard; Layout: left.
  - CTA: Primary "Book implant consult"; Secondary "View all treatments" with ink-light + glass-gold classes.
  - Waves: mask `wave-01`, opacity 0.26, blend soft-light, strength medium. Shimmer: enabled, density low, style dust.
  - Intended route hint: `/preview/treatments/dental-implants` via preset naming and slug.`【F:lib/champagne/hero-presets.ts†L117-L166】

- **Veneers hero**
  - Tone: `dawn`; Time: `day`; Mood: `veneers_polished`; Depth: standard; Contrast: standard. Intensity: standard; Layout: center.
  - CTA: "Book veneer consult" / "View all treatments" with ink-light + glass-gold classes.
  - Waves: mask `wave-02`, opacity 0.28, blend soft-light, strength medium. Shimmer: enabled, density med, style dust.
  - Intended route hint: `/preview/treatments/veneers`.【F:lib/champagne/hero-presets.ts†L117-L166】

- **Orthodontics hero**
  - Tone: `teal-lux`; Time: `day`; Mood: `ortho_precise`; Depth: soft; Contrast: standard. Intensity: soft; Layout: left.
  - CTA: "Book ortho consult" / "View all treatments" with ink-light + glass-gold classes.
  - Waves: mask `wave-03`, opacity 0.24, blend overlay, strength soft. Shimmer: enabled, density low, style dust.
  - Intended route hint: `/preview/treatments/orthodontics`.【F:lib/champagne/hero-presets.ts†L135-L166】

## Schema alignment
- All presets satisfy `HeroSchema` defaults/validator: tone/time-of-day/mood enumerations, wave masks (`wave-01`..`wave-03`), shimmer density (`low`|`med`|`high`), layout left/center, CTA labels/hrefs with fallback defaults if missing.【F:lib/champagne/hero-schema.ts†L1-L130】
