# Sacred Hero Implementation Notes (Read‑Only Forensic Summary)

These notes describe how the **Sacred Champagne Hero** appears to be wired in the extracted `please-work-main` repo.  
They are **descriptive only** – no refactors, no edits, just observations.

---

## 1. Where the Hero Lives in the App Router

### 1.1 Home page entry

The primary entry point is:

- `app/page.tsx` (copied to `code/hero-engine/app/page.tsx`)

Key behaviour:

- Imports `ChampagneHero` plus a 4K hero video and a Smile Journey section.
- Renders the hero **only when** `NEXT_PUBLIC_FEATURE_BRAND_HERO` is truthy:

  ```tsx
  {process.env.NEXT_PUBLIC_FEATURE_BRAND_HERO && <ChampagneHero />}
  ```

- The page then layers:
  1. `ChampagneHero` (Sacred hero)
  2. `Hero4KVideo` (cinematic B‑roll)
  3. `SmileJourney` (narrative section)

So the Sacred Hero is already feature‑flagged and treated as a primary but optionally‑enabled layer.

### 1.2 Hero preview / dedicated routes

Additional routes relating to hero previews were extracted, including:

- `app/champagne/hero/page.tsx`
- `app/champagne-preview/page.tsx`
- Multiple files under `app/preview/(with-shell)/…`

These appear to provide:

- **Hero preview shells** for internal review.
- Brand/phase preview pages for validating FX, gradients, and tone before going live.

All of these live under `code/hero-engine/app/**` in the extraction pack.

---

## 2. Core Hero Components & Layout

The main hero component tree is under:

- `code/hero-components/components/hero/**`
- `code/hero-components/components/champagne/hero/**`
- `code/hero-components/components/home/ChampagneHero.tsx`

Key files:

- `components/hero/ChampagneHero.tsx`
  - High‑level React component that:
    - Accepts eyebrow, title, subtitle, CTA config, badge, and variant props.
    - Imports `layers` from `lib/champagne/layers`.
    - Connects semantic hero presets (whitening, bonding, implants, veneers, ortho) to:
      - **Time of day**
      - **Mood**
      - **Intensity**
      - **Wave mask + blend**
      - **Shimmer density**

- `components/champagne/hero/HeroFrame.tsx`
  - Structural frame component that:
    - Wraps the hero in glass / ink surfaces.
    - Positions the content stack over the FX stack.
    - Likely takes care of paddings, aspect ratios, and breakpoints.

- `components/champagne/hero/HeroWaveStack.tsx`
  - Manages the **wave background layers**:
    - Uses the wave mask assets extracted to `assets/waves/**`.
    - Controls ordering of:
      - Base gradient fields
      - Wave masks (desktop/mobile)
      - Occasional dot/field overlays.

- `components/champagne/hero/HeroShimmer.tsx`
  - Handles the **shimmer / light‑sweep layer**.
  - Provides variants for “soft”, “standard”, and “lux” intensities.
  - Likely wired to an FX token or CSS animation class for glass sheen.

- `components/champagne/hero/HeroCTABar.tsx`
  - Responsible for CTA layout:
    - Primary and secondary buttons
    - CTA tone variants (`ink-on-light` / `ink-on-dark`)
    - Badge / reassurance copy row.

- Supporting components:
  - `components/brand/BrandHeroGradient.tsx`
  - `components/champagne/ChampagneHeroSurface.tsx`
  - `components/sections/HeroLuxury.tsx`
  - Treatment‑specific heroes (e.g. `LuxeTreatmentHero`, `TechnologyHero`, whitening/composite bonding/whitening previews).

These components collectively define the **layer stack**:

> gradient background → wave fields/masks → film grain & particles → glass/shimmer → hero content & CTAs.

---

## 3. Hero Schema, Tone, and Presets

Under `code/hero-components/lib/champagne/**` and `code/hero-engine/lib/champagne/**` we have the canonical hero configuration layer:

- `hero-schema.ts`
  - Defines core types:
    - `HeroTone`, `HeroMood`, `HeroTimeOfDay`
    - `HeroToneProfile` (timeOfDay + mood + depth + contrast)
    - `HeroIntensity` (`soft | standard | lux | medium | bold`)
    - `HeroWaveMask` (`wave-01 | wave-02 | wave-03`)
    - `HeroWaveBlend` (`soft-light | overlay`)
  - This file is effectively the **contract** for what a hero preset is allowed to do.

- `hero-tone.ts`
  - Maps time‑of‑day to CSS tone classes:
    - `dawn`, `day`, `dusk`, `night` → `hero-tone--*`
  - Provides `HeroToneClasses`:
    - `wrapperToneClass`
    - `waveToneClass`
    - `shimmerToneClass`
    - CTA tone variants.

- `hero-presets.ts`
  - Exports named hero presets such as:
    - `whitening_hero`, `bonding_hero`, `implants_hero`, `veneers_hero`, `ortho_hero`
  - Each preset defines:
    - `id` (e.g. `hero-whitening`)
    - `treatmentSlug`
    - `tone` and `toneProfile`
    - `intensity`
    - Content wiring (eyebrow, headline, subheadline, CTAs, badges).

- `layers.ts`
  - (Copied into `code/hero-engine/lib/champagne/layers.ts`)
  - Describes **visual layers** (gradient, waves, particles, film‑grain, shimmer, glass) as semantic tokens.
  - Connects directly to assets like:
    - `assets/waves/**`
    - `assets/particles/**`
    - `assets/film-grain/**`
    - `assets/video-loops/**`
    - `assets/textures/**`.

- `gradient.ts`, `theme.ts`, `timeOfDay.ts`
  - Contain supporting functions/tokens for:
    - The Champagne 135° gradient
    - Theme surfaces (ink/glass/soft-gold)
    - Time‑of‑day logic.

These files are the **brain** of the hero: the UI components simply render what these schemas and presets describe.

---

## 4. FX System, Layer Stack & PRM Behaviour

The extracted **FX / motion** layer lives under:

- `code/fx-system/**`

Key observations:

- There are audits and reports:
  - `Guards_Audit.json`
  - `Guards_Audit_Report.md`
  - `advanced-web-features-audit.md`
  - `UPLOAD_ASSETS_TODO.md`
- Preview pages under:
  - `app/preview/(with-shell)/champagne/**`
  - `app/preview/(with-shell)/brand-live`
  - `app/preview/(with-shell)/brand-lock`
- These preview routes appear to:
  - Load the same wave/film‑grain/particle assets now extracted under `assets/**`.
  - Toggle FX layers and brand locks for visual QA.
- PRM (prefers‑reduced‑motion):
  - Behaviour is handled in utility files that look for `prefers-reduced-motion`.
  - The likely behaviour:
    - Full FX stack (particles, shimmer, wave parallax, video loops) when motion is allowed.
    - Simplified / static gradients and minimal shimmer when PRM is enabled.

The FX system is tightly coupled to the hero via:

- Shared layer tokens (`layers.ts`).
- Shared tone/time‑of‑day logic (`timeOfDay.ts`, `hero-tone.ts`).
- Shared assets in `/public/assets/champagne/**` and `/public/brand/**`.

---

## 5. Extracted Assets and How They Connect

### 5.1 Wave masks & fields

Representative files (now under `assets/waves/**`):

- `public/assets/champagne/waves/wave-mask-desktop.webp`
- `public/assets/champagne/waves/wave-mask-mobile.webp`
- `public/assets/champagne/waves/waves-bg-1024.webp` (+ 1280/1600 variants)
- `public/brand/waves/header-wave-mask.svg`
- `public/brand/waves/wave-dots.svg`
- `public/brand/waves/wave-field.svg`
- `public/waves/waves-bg-1024/1280.webp`
- `public/waves/smh-wave-mask.svg`

These are referenced by `HeroWaveStack` and the layers configuration to generate the **signature Champagne wave‑field background** for the hero and other sections.

### 5.2 Particles & sparkles

Representative files (now under `assets/particles/**`):

- `public/assets/champagne/motion/gold-dust-drift.webm`
- `public/assets/champagne/motion/particles-drift.webm`
- `public/assets/champagne/particles/home-hero-particles.webp`
- `public/brand-polish/wave-gold-dust.png`
- `public/particles/particles-gold.webp`
- `public/particles/particles-magenta.webp`
- `public/particles/particles-teal.webp`
- `public/icons/sparkle.svg`

These support:

- Floating dust/sparkle motion over the wave field.
- Gold dust bands particularly around CTAs or wave crests.

### 5.3 Film grain & texture overlays

Representative files (now under `assets/film-grain/**` and `assets/textures/**`):

- `public/assets/champagne/film-grain-desktop.webp`
- `public/assets/champagne/textures/home-hero-film-grain.webp`
- `public/textures/film-grain-desktop.webp`
- `public/textures/film-grain-mobile.webp`
- `public/assets/champagne/motion/wave-caustics.webm`

Film‑grain is generally layered above waves/gradients but below glass/shimmer, providing a **cinematic, analog feel**.

### 5.4 Video loops & glass shimmer

Representative files (now under `assets/video-loops/**`):

- `public/assets/champagne/motion/glass-shimmer.webm`
- `public/videos/dental-hero-4k.mp4`

These are used by:

- `Hero4KVideo` and `cinematic-hero-video` components.
- Shimmer overlays that run in sync with hero tone/time‑of‑day.

---

## 6. Manus References

Under `manus/**` we extracted:

- Manus hero masks and wave assets:
  - `public/assets/manus/waves/home-hero-mask-desktop.webp`
  - `public/assets/manus/waves/home-hero-mask-mobile.webp`
  - `public/assets/manus/waves/waves-bg-[sizes].webp`
  - `public/assets/manus/particles/home-hero-particles.webp`
  - `public/assets/manus/textures/home-hero-film-grain.webp`

- Manus documentation and audits:
  - `docs/manus-atlas/v1/Manus_Design_Atlas_v1.md`
  - `Manus_Section_Catalog.json`
  - `Manus_LuxuryHero_Report.md`
  - `Manus_Asset_Discovery_Report.md`
  - `manus_import_unified_manifest_20251104.json`

These provide a **design‑time atlas** for how Manus iterated the hero layout, wave shapes, and FX stack.  
They are extremely useful for future Codex/Director agents to understand intent without guessing.

---

## 7. Dependencies & Things the Hero Relies On

From the extracted files, the Sacred Hero depends on:

1. **Schema / tone / presets**
   - `lib/champagne/hero-schema.ts`
   - `lib/champagne/hero-tone.ts`
   - `lib/champagne/hero-presets.ts`
   - `lib/champagne/timeOfDay.ts`

2. **Layer & gradient logic**
   - `lib/champagne/layers.ts`
   - `lib/champagne/gradient.ts`
   - `lib/champagne/theme.ts`

3. **FX & motion previews**
   - `app/preview/(with-shell)/champagne/**`
   - Champion brand/phase preview pages.

4. **Assets**
   - Wave masks and fields (`assets/waves/**`)
   - Particles and sparkles (`assets/particles/**`)
   - Film grain textures (`assets/film-grain/**`)
   - Caustics/shimmer textures (`assets/textures/**`)
   - Video loops (`assets/video-loops/**`)
   - Manus hero references (`manus/**`)

Everything in `_champagne-hero-extraction` has been copied **read‑only** from the original repo, keeping filenames intact and preserving relative structure under the new categories.
