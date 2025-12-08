# SMH Champagne Canon — Brand Canon Report

## Palette

| Token | Value | Source |
|---|---|---|
| `--brand-magenta` | `#C2185B` | smh-champagne-tokens.css |
| `--brand-teal` | `#40C4B4` | smh-champagne-tokens.css |
| `--brand-gold` | `#D4AF37` | smh-champagne-tokens.css |
| `--brand-gold-keyline` | `#F9E8C3` | smh-champagne-tokens.css |
| `--ink` | `#0B0D0F` | smh-champagne-tokens.css |
| `--text` | `#1A1A1A` | smh-champagne-tokens.css |
| `--bg` | `#FFFFFF` | smh-champagne-tokens.css |
| `--smh-white` | `#FFFFFF` | smh-champagne-tokens.css |
| `--smh-gray-200` | `#E5E7EB` | smh-champagne-tokens.css |
| `--smh-warm-rose` | `#E24DAA` | smh-champagne-tokens.css |

## 135° Gradient Specification

*Primary gradient*: `linear-gradient(135deg,#C2185B 0%,#40C4B4 60%,#D4AF37 100%)` — 135° with stops #C2185B at 0%, #40C4B4 at 60%, #D4AF37 at 100%.

Canonical CSS tokens:
- `--smh-gradient` → `linear-gradient(135deg, var(--brand-magenta) 0%, var(--brand-teal) 60%, var(--brand-gold) 100%)`
- `--smh-gradient-legacy` → `linear-gradient(135deg,#D94BC6 0%,#00C2C7 100%)`
- `--iridescent-gradient` → `linear-gradient(
    180deg,
    color-mix(in oklab, var(--brand-teal) 70%, white) 0%,
    color-mix(in oklab, var(--brand-magenta) 70%, white) 100%
  )`
Manifest gradients:
- `manifest.styles.tokens.gradients.champagne` → `linear-gradient(135deg, #C2185B 0%, #40C4B4 60%, #D4AF37 100%)`
- `manifest.styles.tokens.gradients.cta` → `linear-gradient(135deg, #C2185B 0%, #2CBFAE 55%, #D4AF37 100%)`
- `manifest.public.gradient.css` → `linear-gradient(135deg,#C2185B 0%,#40C4B4 60%,#D4AF37 100%)`

## Gold Etiquette

- Core gold token: `--brand-gold` (`#D4AF37`).
- Keyline gold: `--brand-gold-keyline` for soft accents.
- Usage guidance: keylines, accents only.

## Motion & Accessibility Limits

- `--parallax-max`: 0px when `prefers-reduced-motion: reduce`; 6px otherwise.
- Compliance thresholds:
  - layerOrder: strict
  - parallaxCap: 6px
  - particleDensity: 0.6-0.9%
  - grainStrength: 6-8%
  - gradientAccuracy: 95%+
  - brandTokens: CSS variables only
  - motionDisable: prefers-reduced-motion: reduce
- Motion disablement: `prefers-reduced-motion: reduce` hides motion layers per styles manifest.

## Additional Tokens of Note

- `--iridescent-gradient` uses color mix: `linear-gradient(
    180deg,
    color-mix(in oklab, var(--brand-teal) 70%, white) 0%,
    color-mix(in oklab, var(--brand-magenta) 70%, white) 100%
  )`
- `--champagne-glass-bg` uses color mix: `color-mix(in oklab, var(--ink) 22%, transparent 78%)`
- `--smh-gold-shoulder` uses color mix: `color-mix(in oklab, var(--brand-gold) 65%, white 35%)`

## Duplicate / Collision Audit

- Normalized key `brandmagenta` appears in:
  - smh-champagne-tokens.css → `--brand-magenta` = `#C2185B`
  - manifest.styles.champagne.json → `manifest.styles.tokens.colors.brandMagenta` = `#C2185B`
- Normalized key `brandgold` appears in:
  - smh-champagne-tokens.css → `--brand-gold` = `#D4AF37`
  - manifest.styles.champagne.json → `manifest.styles.tokens.colors.brandGold` = `#D4AF37`
- Normalized key `ink` appears in:
  - smh-champagne-tokens.css → `--ink` = `#0B0D0F`
  - manifest.styles.champagne.json → `manifest.styles.tokens.colors.ink` = `#0E1420`
- Normalized key `parallaxmax` appears in:
  - smh-champagne-tokens.css → `--parallax-max` = `0px`
  - smh-champagne-tokens.css → `--parallax-max` = `6px`
  - Note: CSS variable declared multiple times
- Normalized key `body` appears in:
  - manifest.styles.champagne.json → `manifest.styles.tokens.typography.body` = `Inter`
  - manifest.public.brand.json → `manifest.public.typography.body` = `Inter`
- Normalized key `mask` appears in:
  - manifest.public.brand.json → `manifest.public.waves.mask` = `/assets/champagne/waves/wave-mask-desktop.webp`
  - manifest.public.brand.json → `manifest.public.static.waves.mask` = `/brand/waves/wave-mask.svg`
- Normalized key `background` appears in:
  - manifest.public.brand.json → `manifest.public.waves.background` = `/assets/champagne/waves/wave-bg.webp`
  - manifest.public.brand.json → `manifest.public.static.waves.background` = `/brand/waves/wave-bg.webp`
- Normalized key `filmgrain` appears in:
  - manifest.public.brand.json → `manifest.public.textures.filmGrain` = `/assets/champagne/textures/home-hero-film-grain.webp`
  - manifest.public.brand.json → `manifest.public.static.textures.filmGrain` = `/brand/textures/film-grain-2560x1440.webp`
- Normalized key `glasssoft` appears in:
  - manifest.public.brand.json → `manifest.public.textures.glassSoft` = `/assets/champagne/textures/glass-soft.webp`
  - manifest.public.brand.json → `manifest.public.static.textures.glassSoft` = `/brand/textures/glass-soft.webp`
