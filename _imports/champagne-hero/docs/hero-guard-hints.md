# Sacred Hero Guard Hints (For Future Codex / Director Agents)

These are **guidance notes only** for protecting the Sacred Hero and its FX stack.  
They do **not** change any code – they simply document what should be guarded.

---

## 1. Files that should be treated as “Sacred” (no auto‑refactor)

The following files should be considered **high‑risk for automated refactors** and ideally:

- Excluded from bulk rename / auto‑format passes.
- Only changed in small, reviewed PRs.

### 1.1 Core hero components

From `code/hero-components/**`:

- `components/hero/ChampagneHero.tsx`
- `components/champagne/hero/HeroFrame.tsx`
- `components/champagne/hero/HeroWaveStack.tsx`
- `components/champagne/hero/HeroShimmer.tsx`
- `components/champagne/hero/HeroCTABar.tsx`
- `components/home/ChampagneHero.tsx`
- `components/preview/PreviewTreatmentsHero.tsx`
- Treatment‑specific hero components:
  - Whitening, bonding, implants, veneers, ortho heroes.
  - Technology / 3D / AI heroes.

These define the **visible hero composition** and are tightly bound to assets, tokens, and schema types.

### 1.2 Hero schema / tone / presets

From `code/hero-components/lib/champagne/**` and `code/hero-engine/lib/champagne/**`:

- `hero-schema.ts`
- `hero-tone.ts`
- `hero-presets.ts`
- `timeOfDay.ts`
- `layers.ts`
- `gradient.ts`
- `theme.ts`

These files form the **contract** for all hero variants.  
Any automated refactor that changes types, key names, or enums here can silently break multiple routes.

### 1.3 Routing and feature flags

From `code/hero-engine/app/**`:

- `app/page.tsx`
- `app/champagne/hero/page.tsx`
- `app/champagne-preview/page.tsx`
- `app/preview/(with-shell)/champagne/**`
- Any file that gates the hero via `NEXT_PUBLIC_FEATURE_BRAND_HERO`.

These should be guarded from:

- Accidental removal of the feature flag.
- Re‑ordering that hides the hero behind other sections.
- Changes that bypass the hero preview flow.

---

## 2. Assets that should be treated as Canonical

The following assets should be treated as **canonical hero FX**:

### 2.1 Wave masks & fields

Representative canonical files:

- `public/assets/champagne/waves/wave-mask-desktop.webp`
- `public/assets/champagne/waves/wave-mask-mobile.webp`
- `public/brand/waves/header-wave-mask.svg`
- `public/brand/waves/wave-dots.svg`
- `public/brand/waves/wave-field.svg`
- `public/waves/waves-bg-*.webp`
- `public/waves/smh-wave-mask.svg`

Guard ideas:

- Prevent deletion or silent replacement.
- Enforce aspect ratio and resolution ranges.
- If replaced, require a “visual compare” step against Manus references.

### 2.2 Particles & sparkles

Canonical examples:

- `public/assets/champagne/motion/gold-dust-drift.webm`
- `public/assets/champagne/motion/particles-drift.webm`
- `public/assets/champagne/particles/home-hero-particles.webp`
- `public/particles/particles-{gold,magenta,teal}.webp`
- `public/icons/sparkle.svg`

Guard ideas:

- Ensure these remain **subtle**, not turned into heavy gamer FX.
- Keep file sizes within a safe performance budget.
- Maintain naming conventions for future manifests (e.g. `particles-*`, `gold-dust-*`).

### 2.3 Film grain & caustic textures

Canonical examples:

- `public/assets/champagne/film-grain-desktop.webp`
- `public/assets/champagne/textures/home-hero-film-grain.webp`
- `public/textures/film-grain-{desktop,mobile}.webp`
- `public/assets/champagne/motion/wave-caustics.webm`

Guard ideas:

- Protect the **contrast curve** – grain should stay soft, not crunchy.
- Guard against re‑encoding that introduces banding or artifacts.
- Ensure they are always layered **below** glass/shimmer but **above** gradients.

### 2.4 Video loops

Canonical examples:

- `public/assets/champagne/motion/glass-shimmer.webm`
- `public/videos/dental-hero-4k.mp4`

Guard ideas:

- Keep duration, loop points, and framing consistent with current hero composition.
- Require visual QA if replaced (no distracting motion, no off‑brand colour shifts).

### 2.5 Manus hero references

Canonical examples under `manus/**`:

- Manus hero waves and masks.
- Manus hero particles and film‑grain.
- `Manus_Design_Atlas_v1.md` + `Manus_Section_Catalog.json` + hero‑specific audit reports.

Guard ideas:

- Treat these as **design source of truth**, not throwaway assets.
- Do not auto‑delete or “clean up” these folders – they document intent.

---

## 3. Guard Concepts for Future Tooling

These are conceptual guard ideas that a future **Guard Agent / Codex tooling** could implement:

1. **Hero Freeze Guard**
   - Prevents changes to:
     - Core hero components
     - Hero schema/tone/presets
     - Key wave/particle/film‑grain assets
   - Only allows modifications when a specific `HERO_FREEZE_OVERRIDE` flag is set in the PR description or commit message.

2. **Rogue FX Guard**
   - Scans hero/FX code for:
     - Excessive motion parameters (e.g. large parallax distances, fast durations).
     - New animation names not in the Champagne motion canon.
   - Blocks changes that would:
     - Introduce spinning logos
     - Add aggressive parallax
     - Break `prefers-reduced-motion` fallbacks.

3. **Gradient Law Guard**
   - Inspects tokens/manifests for:
     - Correct usage of the Champagne 135° gradient.
     - Soft‑gold usage ≤ 4% coverage.
   - Flags any attempts to:
     - Introduce new, off‑brand gradients.
     - Replace the hero background with non‑canon colour schemes.

4. **Asset Canon Guard**
   - Checks that canonical asset filenames:
     - Still exist in `public/**`.
     - Haven’t been silently replaced with different resolutions or formats.
   - Optionally, stores a small hash or metadata snapshot for visual regression testing.

5. **PRM Respect Guard**
   - Verifies that any new hero/FX component:
     - Checks `prefers-reduced-motion`.
     - Provides a non‑animated fallback state.
   - Blocks PRs that add motion without PRM handling.

---

## 4. Operational Recommendations

For anyone working on this hero in future:

- **Never** run bulk “rename all heroes” / “auto‑optimize all assets” scripts without:
  - Temporarily disabling hero/FX guards with an explicit override.
  - Running a Champagne visual review (preview routes, QA checklist).

- **Prefer small, focused PRs**:
  - One change at a time – e.g. “adjust veneers hero title copy” or “swap wave mask for v2”.
  - Avoid “mega‑PRs” that touch schema, hero components, and assets all together.

- **Keep Manus + Champagne in sync**:
  - If Manus produces a new hero layout, update:
    - Manus atlas + section catalog.
    - Hero presets and tone profile.
    - Wave/particle/film‑grain assets and layer mapping.

These hints should give future Codex/Director agents a clear idea of **what must be protected** to keep the Sacred Hero visually and emotionally consistent across refactors.
