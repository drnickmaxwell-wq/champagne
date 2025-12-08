# Champagne Tonal Pack v1

This document defines the **Champagne Hero Tonal Pack v1** — a set of reusable tonal presets for heroes and key sections.

These tones are not PNGs. They are **configuration bundles** that the future `ChampagneHeroEngine` will consume:

- gradient emphasis (magenta / teal / gold balance)
- background brightness
- wave + particle visibility
- shimmer intensity
- recommended CTA system
- typical usage (page types, treatment types, time-of-day mood)

All tones must obey **Champagne Canon**:

- Gradient law: 135° (magenta → teal → gold)
- Gold usage: ≤ 4% of the visible area (accents only)
- No neon, no candy gradients
- Calm, cinematic, medical-luxury atmosphere
- Wave geometry never distorted or aliased

---

## 1. Tonal Principles

1. **Single Gradient Law**

   All tones inherit the same canonical gradient direction (135°) and backbone tokens:

   - Magenta: `--smh-primary-magenta`
   - Teal: `--smh-primary-teal`
   - Gold: `--smh-primary-gold`
   - Any composite gradient tokens already defined in `smh-champagne-tokens.css`

   Tones are *re-weightings* of these tokens, not new colours.

2. **Layer Stack Discipline**

   Every hero tone is still built from the same structural layers:

   - Base gradient field
   - Wave mask field
   - Particle / dust field
   - Shimmer layer (optional, capped)
   - Film grain
   - Hero content field (copy + CTAs)

   The Tonal Pack only adjusts **intensities**, **opacity**, and **relative balance** of these layers.

3. **Accessibility & Readability**

   - Body copy must meet WCAG AA contrast against its immediate field.
   - CTA contrast is defined by the CTA System (see separate doc).
   - No tone may reduce legibility for decorative effect.

---

## 2. Tone Catalogue v1

These tone IDs are the canonical names that code should use.

> Implementation note: eventually they will map to a `HeroTone` TypeScript union, e.g.\
> `type HeroTone = 'home_canon' | 'whitening_dawn' | 'veneers_dusk' | 'implants_midnight' | 'ortho_tealLux' | 'noir';`

### 2.1 Overview Table

| Tone ID            | Mood / Brightness               | Primary Use                                   | Gradient Emphasis                | Recommended CTA Variant         |
|--------------------|----------------------------------|----------------------------------------------|----------------------------------|---------------------------------|
| `home_canon`       | Bright, optimistic, airy        | Main homepage hero                            | Balanced magenta/teal, light gold | `regal`                         |
| `whitening_dawn`   | Very bright, fresh, luminous    | Whitening treatment hero                      | Extra teal + light gold, softened magenta | `regalInkLight` (ink-light) |
| `veneers_dusk`     | Warm, cinematic, slightly dimmer| Veneers / smile makeover heroes               | Strong magenta, muted gold       | `regal`                         |
| `implants_midnight`| Deep, high-contrast, technical  | Implants / surgical / tech-forward treatments | Teal-heavy, controlled magenta, minimal gold | `regal`                     |
| `ortho_tealLux`    | Clinical, precise, teal-forward | Orthodontics / aligners                       | Teal dominant, gentle magenta    | `regalInkLight`                 |
| `noir`             | Darkest, ultra-cinematic        | Editorial sections, hero alternates, campaigns| Teal + ink overlays, gold as pin-point | `regal` or `ghost`         |

---

## 3. Tone Definitions

Each tone definition below should later be mirrored by a config object in code. This document is the **source of truth**.

### 3.1 `home_canon`

**Mood**

- Bright, optimistic, welcoming.
- Represents the “default” Champagne hero as seen on the homepage.

**Layer guidance**

- Gradient: standard Champagne gradient, equal weight magenta/teal, soft gold in lower-right.
- Waves: mid-opacity, full hero arc visible.
- Particles: subtle, light, never cluttered.
- Shimmer: light veil limited to the crest of the wave.
- Film grain: present but soft.

**Usage**

- `/` homepage hero (sacred hero).
- Anywhere “this is SMH Dental” needs to be instantly recognisable.

**CTA recommendation**

- `regal` (ink pill primary + glass outline secondary).

---

### 3.2 `whitening_dawn`

**Mood**

- Very bright, “freshly polished”, luminous.
- Designed specifically for Whitening.

**Layer guidance**

- Gradient: increased teal + light gold, magenta softened but still present in the upper-left.
- Waves: high visibility, especially through teal band for “wash of light”.
- Particles: slightly more visible, but still controlled.
- Shimmer: more active along the upper wave to evoke sparkle, but capped to avoid glitter.

**Usage**

- `/treatments/whitening` hero (preview and production).
- Any whitening-related campaign sections in the future.

**CTA recommendation**

- `regalInkLight` (ink-light variant) to keep contrast without heavy blocks.

---

### 3.3 `veneers_dusk`

**Mood**

- Warm, cinematic, evening-light feeling.
- Used for smile makeover / cosmetic veneer storytelling.

**Layer guidance**

- Gradient: stronger magenta in upper areas, gold slightly richer near the base, teal softened.
- Waves: slightly darker overlay, less foil-like, more velvet.
- Particles: reduced, more like gentle dust than glitter.
- Shimmer: minimal, emphasising smoothness rather than sparkle.

**Usage**

- Veneers and smile makeover heroes.
- Editorial / story sections for big transformations.

**CTA recommendation**

- `regal` (full ink) to hold its ground on the richer background.

---

### 3.4 `implants_midnight`

**Mood**

- Deep, reassuring, high-tech.
- Feels serious and precise without becoming gloomy.

**Layer guidance**

- Gradient: teal-heavy with magenta suppressed; gold used only as a soft lower accent.
- Waves: slightly higher contrast against the background, giving a sense of engineered precision.
- Particles: minimal, almost none.
- Shimmer: extremely subtle, focused along a narrow line on the crest.

**Usage**

- Implants hero (and related surgical/3D-planning sections).
- Sections describing technology, CBCT, guides, etc.

**CTA recommendation**

- `regal` primary + ghost secondary, to avoid over-bright pills on dark fields.

---

### 3.5 `ortho_tealLux`

**Mood**

- Clean, crisp, clinical, with a subtle luxury overlay.
- Aligners, orthodontics, smile-alignment pathways.

**Layer guidance**

- Gradient: teal dominant, magenta is faint in the top band, gold is almost only in the far base.
- Waves: clear but soft, with a sense of smooth curvature.
- Particles: limited to a light dust in the upper-right.
- Shimmer: low, barely perceptible.

**Usage**

- Orthodontic and clear aligner heroes.
- Treatment pathway explainers.

**CTA recommendation**

- `regalInkLight` to feel clinical and light, not heavy or salesy.

---

### 3.6 `noir`

**Mood**

- Darkest, most cinematic tone.
- Reserved for special editorial treatment, not everyday pages.

**Layer guidance**

- Gradient: magenta and teal subdued into near-ink hues; gold appears only as micro-glints.
- Waves: sharp but low-contrast; more about silhouette than colour.
- Particles: can be slightly more visible (like fine dust) but never glitter.
- Shimmer: thin, linear accents only.

**Usage**

- Special campaigns, longform editorial, AI smile atelier narration sections.
- Do not use as the default treatment hero.

**CTA recommendation**

- `regal` for strong calls to action, or `ghost` for softer, story-driven surfaces.

---

## 4. Implementation Notes (for future code)

- The Tonal Pack must be represented as a typed config, e.g.:

  ```ts
  interface HeroToneConfig {
    id: HeroTone;
    recommendedCtaVariant: 'regal' | 'regalInkLight' | 'ghost';
    brightness: 'light' | 'medium' | 'dark';
    mood: string;
    gradientEmphasis: 'balanced' | 'magentaHeavy' | 'tealHeavy' | 'goldWarm';
    shimmerLevel: 'low' | 'medium' | 'high';
    notes?: string;
  }
ChampagneHeroEngine should accept a tone: HeroTone prop and look up the correct config.

Tone selection should be per route, not per viewport, so analytics and design remain predictable.

The Tonal Pack v1 is deliberately small. New tones must be added here first before being used in code or Manus briefs.

yaml
Copy code
