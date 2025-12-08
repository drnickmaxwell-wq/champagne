# Champagne CTA System v2 — Plan

This document defines **Champagne CTA System v2**, including the new **ink-light variant**.

The goal is to:

- Keep all CTAs visually consistent and clearly branded.
- Avoid CTA conflict with hero gradients and tonal backgrounds.
- Provide a small set of variants that can be applied across the whole Champagne Ecosystem.

All CTAs must obey:

- Gold ≤ 4% of page area (used only as rims/accents).
- No neon / candy colour effects.
- Medical-luxury tone: calm, precise, reassuring.

---

## 1. Existing CTA Systems (v1 recap)

### 1.1 System 1 — Gradient Champagne Pill (legacy)

- Gradient pill using the core Champagne gradient.
- Soft glow around the button.
- White text.

**Status**

- Still allowed for **secondary surfaces and special editorial**.
- **Not recommended** for main heroes anymore, because it can compete with the sacred hero background.

### 1.2 System 2 — Regal Glass–Gold

This is currently the preferred hero system.

**Primary CTA**

- Ink background (`--ink` token).
- Soft-gold keyline (Champagne gold token).
- White text.
- Subtle bevel and shadow.
- Hover: ink deepens slightly, keyline brightens.

**Secondary CTA**

- Transparent / frosted glass pill.
- Gold keyline (thinner than primary).
- White text.
- Hover: subtle teal tint fill, still transparent.

**Usage**

- Homepage hero.
- Important treatment heroes.
- Strong commercial CTAs (“Book a consultation”, “Request a video consultation”).

---

## 2. CTA System v2 — Variants

For v2, all CTAs should be expressed as a small set of **variants** that can be selected per context.

> Implementation note: eventually this becomes a variant enum, e.g.\
> `type CtaVariant = 'regal' | 'regalInkLight' | 'ghost' | 'textLink';`

### 2.1 Variant: `regal` (canonical hero CTA)

**Primary**

- Background: full `--ink` token.
- Keyline: 1.5–2px soft-gold keyline.
- Text: white.
- Shape: pill with consistent radius (matching hero CTAs already in use).
- Hover: slightly deeper ink, inner glow at 5–8% opacity.

**Secondary**

- Background: transparent / light glass.
- Keyline: 1px gold.
- Text: white, slightly lower font weight.
- Hover: gentle teal fill (≤ 10% opacity).

**Best for**

- Main homepage hero.
- Treatment heroes on darker or more saturated tones (`implants_midnight`, `veneers_dusk`, `noir` when strong prompts are needed).

---

### 2.2 Variant: `regalInkLight` (ink-light)

This is the **new variant** introduced in v2, optimised for brighter tones.

**Primary**

- Background: lightened ink token (e.g. `--ink-light` or equivalent).
- Keyline: 1.5px gold, slightly softer than `regal`.
- Text: ink on light surfaces, or white where contrast requires.
- Shadow: minimal, mostly a soft ambient shadow for tap target clarity.
- Hover: small darkening of background and mild inner glow.

**Secondary**

- Background: frosted glass with very subtle teal tint.
- Keyline: 1px teal or muted gold, depending on tone.
- Text: ink or white depending on background brightness.

**Best for**

- Light heroes (`home_canon`, `whitening_dawn`, `ortho_tealLux`).
- Sections where a heavy ink block would feel too loud (comfort, process, FAQs).

---

### 2.3 Variant: `ghost`

**Primary**

- Background: transparent or ultra-low opacity ink.
- Keyline: 1px ink or teal.
- Text: ink or white depending on surface.
- Hover: filled with a very light ink tone.

**Secondary**

- Text-only or outline-only with no fill.

**Best for**

- Editorial sections.
- Less urgent actions (“Learn more about the clinic”, “Explore technology”).

---

### 2.4 Variant: `textLink`

**Primary**

- No pill, only text.
- Underline or hairline keyline beneath text.
- Uses ink or teal tokens.

**Best for**

- Micro CTAs within body copy.
- Busy layouts where pills would clutter the design.

---

## 3. Mapping CTAs to Tones & Surfaces

### 3.1 Tone → CTA variant

| Hero Tone            | Primary CTA Variant | Secondary CTA Variant |
|----------------------|--------------------|-----------------------|
| `home_canon`         | `regal`            | `regal` secondary     |
| `whitening_dawn`     | `regalInkLight`    | `regalInkLight` secondary or `ghost` |
| `veneers_dusk`       | `regal`            | `ghost`               |
| `implants_midnight`  | `regal`            | `ghost`               |
| `ortho_tealLux`      | `regalInkLight`    | `ghost`               |
| `noir`               | `regal` or `ghost` | `ghost`               |

### 3.2 Layout types

| Surface Type                      | Preferred Variant       |
|----------------------------------|-------------------------|
| Main homepage hero               | `regal`                 |
| Bright treatment heroes          | `regalInkLight`         |
| Dark/technical heroes            | `regal`                 |
| Interior feature sections        | `regalInkLight` or `ghost` |
| Micro actions in copy            | `textLink`              |
| Footers / low-priority actions   | `textLink` or `ghost`   |

---

## 4. Implementation Notes (for future code)

1. **Central CTA Helper**

   Introduce a single CTA helper/component that accepts:

   ```ts
   interface CtaConfig {
     label: string;
     href: string;
     variant: 'regal' | 'regalInkLight' | 'ghost' | 'textLink';
     size?: 'md' | 'lg';
     icon?: ReactNode;
   }
All CTAs on the site must be expressed via this helper to guarantee consistency.

Token-only Styling

All colours and shadows must come from tokens (ink tokens, glass tokens, gold tokens).

No ad-hoc hex values.

Accessibility

Minimum hit-target height and width suitable for touch.

Maintain WCAG AA contrast between text and background for each variant and tone.

Hover/active states must not rely solely on colour; subtle scale/shadow changes are recommended.

Guard Integration

CTA helper should be placed under /components/champagne/ or equivalent, and considered a “sacred” component.

Future brand guards can check for raw <a> or <button> usage and encourage migrating to the CTA helper.

5. Preview / Adoption Plan
v2 should first be used on:

/preview/home hero and CTA bands.

/preview/treatments/whitening hero and closing CTA band.

Once validated visually, the CTA helper and variants can be rolled out to other preview routes and then production routes.

This document is the source of truth for CTA behaviour. New variants must be defined here first before appearing in code.

sql
Copy code
