# Hero Preset Library v1

## Purpose
The Hero Preset Library is the single source of truth for ready-to-render hero configurations used by the Champagne Hero Engine. Each preset packages copy, tonal intent, wave and shimmer behaviours, and CTA wiring so treatment previews can stay consistent while remaining easy to extend.

## Schema overview
Hero presets implement the shared `HeroSchema` exported from `lib/champagne/hero-schema.ts`.

```ts
export interface HeroSchema {
  id?: string;
  treatmentSlug?: string;
  tone: HeroTone;
  intensity: HeroIntensity;
  headline: string;
  subheadline?: string;
  subcopy?: string;
  eyebrow?: string;
  waveSet?: HeroWaveMask;
  waveStrength?: "soft" | "medium" | "strong";
  waves: { mask: HeroWaveMask; opacity: number; blendMode?: HeroWaveBlend };
  shimmer: { enabled: boolean; density: HeroShimmerDensity; style?: HeroShimmerStyle };
  cta: { primary: string; secondary: string; primaryLabel?: string; secondaryLabel?: string; primaryHref?: string; secondaryHref?: string };
  primaryCta?: { label: string; href: string; className?: string };
  secondaryCta?: { label: string; href: string; className?: string };
  layout: "left" | "center";
}
```

Key fields:
- **tone**: symbolic tonal intent used to pick gradient classes (mapped by CSS elsewhere).
- **intensity**: relative strength of the tonal application (soft/standard/lux, with medium/bold accepted aliases).
- **waveSet**: selects the wave mask stack; corresponds to supported masks in `HeroWaveStack`.
- **waveStrength**: semantic indicator of how prominent the waves should feel.
- **shimmerEnabled / shimmer**: toggles particle overlays and sets density/style for `HeroShimmer`.
- **primaryCta / secondaryCta**: UX-facing label + href pairs; `cta` also carries the CTA plate class names for the preview shell.
- **layout**: left or center aligned content; `layoutVariant` can add metadata without changing layout spacing.

## Preset catalogue

### whitening
- **Slug**: `/preview/treatments/whitening`
- **Headline**: `Luminous Whitening`
- **Eyebrow**: `Cosmetic treatment`
- **Tone + intensity**: `whitening`, `lux`
- **Wave set**: `wave-02`
- **Shimmer**: `dust`, density `high`
- **CTA labels**: `Book whitening` → `/contact`; `Explore treatment options` → `/treatments`

### composite-bonding
- **Slug**: `/preview/treatments/composite-bonding`
- **Headline**: `Composite Bonding`
- **Eyebrow**: `Cosmetic treatment`
- **Tone + intensity**: `dusk`, `lux`
- **Wave set**: `wave-03`
- **Shimmer**: `dust`, density `high`
- **CTA labels**: `Book composite bonding` → `/contact`; `View all treatments` → `/treatments`

### implants
- **Slug**: `/preview/treatments/implants`
- **Headline**: `Dental Implants`
- **Eyebrow**: `Implant dentistry`
- **Tone + intensity**: `noir`, `standard`
- **Wave set**: `wave-01`
- **Shimmer**: `dust`, density `low`
- **CTA labels**: `Book implant consult` → `/contact`; `View all treatments` → `/treatments`

### veneers
- **Slug**: `/preview/treatments/veneers`
- **Headline**: `Porcelain Veneers`
- **Eyebrow**: `Cosmetic treatment`
- **Tone + intensity**: `dawn`, `standard`
- **Wave set**: `wave-02`
- **Shimmer**: `dust`, density `med`
- **CTA labels**: `Book veneer consult` → `/contact`; `View all treatments` → `/treatments`

### orthodontics
- **Slug**: `/preview/treatments/orthodontics`
- **Headline**: `Orthodontics`
- **Eyebrow**: `Orthodontics`
- **Tone + intensity**: `teal-lux`, `soft`
- **Wave set**: `wave-03`
- **Shimmer**: `dust`, density `low`
- **CTA labels**: `Book ortho consult` → `/contact`; `View all treatments` → `/treatments`

## Usage
Import presets directly when rendering a preview hero:

```tsx
import { HeroEngine } from "@/components/champagne/hero/HeroEngine";
import { HERO_PRESETS } from "@/lib/champagne/hero-presets";

export function ExampleHero() {
  return <HeroEngine schema={HERO_PRESETS["whitening"]} />;
}
```

Canvas colours and gradients are controlled by the preview canvas and time-of-day palette; presets only define symbolic tone, intensity, and behaviour. Do not change gradients or background styles from inside presets.
