# Champagne FX Canon  
Luxury FX & Motion Language for the Champagne Ecosystem

Brand shorthand:
- Mood: quiet luxury, cinematic, confident, never shouty.
- Materials: ink, glass, water, fog, soft gold.
- Signatures: champagneGradient135, wave overlays, film grain, micro-particles.
- Law: champagneGradient135 (135° magenta → teal → softGold), softGold coverage ≤ 4%.

All FX and motion here are behavioural specs, not code.
Implementation is handled by Codex via shaders, WebGPU, Lottie, CSS, etc.

---

## 1. Global Principles

1. **FX are weather, not fireworks**
   - FX live in background, weather, and glass layers.
   - They never obstruct legibility or fight with copy/CTAs.

2. **Micro-motion only**
   - No spinning, no wild parallax, no camera whooshes.
   - Scale ≤ 1.035, parallax ≤ 6px desktop, ≤ 3px mobile.

3. **Gradient Law**
   - Use `champagneGradient135` for any gradient behaviour.
   - `accentGold_soft` and `accentGold_micro` together ≤ 4% visual coverage.

4. **PRM (prefers-reduced-motion) is always honoured**
   - Every FX preset defines a `prmSafeAlternative`.
   - PRM mode prioritises soft fades, static overlays, or total removal.

5. **Layer stack is sacred**
   FX live in a consistent stack (from bottom to top):

   1. `backgroundGradient` (champagneGradient135)
   2. `weather` (water, mist, very soft noise)
   3. `particleField` (micro-bubbles, dust, sparks)
   4. `filmGrain` (soft analogue texture)
   5. `glassOverlays` (panels, cards, glass sheen)
   6. `content` (copy, UI, media – must remain readable)

---

## 2. FX Families

Each FX family has:
- ID family (`fx.<domain>.<name>_*`)
- Preferred layer(s)
- Behaviour summary
- Motion profile ID (defined in `champagne-motion-profiles.json`)

### 2.1 Water

Keywords: calm, depth, cleansing, renewal.  
Tokens: `fx-texture-waterRipple_soft`, `fx-texture-waterCaustics_soft`.

1. **surfaceRipple**
   - ID family: `fx.water.surfaceRipple_*`
   - Layer: `weather`
   - Behaviour: extremely low-amplitude, slow ripples, as if a basin just settled.
   - Motion: `motion.softBreath`.

2. **depthCaustics**
   - ID family: `fx.water.depthCaustics_*`
   - Layer: `backgroundGradient`
   - Behaviour: subtle depth/shimmer of underwater caustics under the gradient.
   - Motion: `motion.softBreath`.

Use for: home hero, veneers hero, aligners, “comfort” moments.

---

### 2.2 Glass

Keywords: precision, clarity, clinical but warm.  
Tokens: `inkGlass_soft`, `fx-sheen-soft`, `fx-border-glassSoft`.

1. **parallaxSheen**
   - ID family: `fx.glass.parallaxSheen_*`
   - Layer: `glassOverlays`
   - Behaviour: very soft diagonal sheen that shifts slightly with pointer/scroll.
   - Motion: `motion.parallaxGentle`.

2. **glassPanels**
   - Expressed via component tokens (cards, modals).
   - FX: tiny lift and shadow on hover (`fx.component.cardHover_liftShadow`).
   - Motion: `motion.cardLiftSoft`.

Use for: cards, pricing, dashboards, portal UI, 3D viewer framing.

---

### 2.3 Ink

Keywords: depth, artistic, human decision-making.  
Tokens: `fx-texture-inkfall_soft`, `fx-blend-softOverlay`.

1. **inkfallDrift**
   - ID family: `fx.ink.inkfallDrift_*`
   - Layer: `backgroundGradient`
   - Behaviour: slow, drifting ink clouds, almost imperceptible.
   - Motion: `motion.inkfallDrift`.

Use behind storytelling: veneers journeys, smile design, patient narratives.

---

### 2.4 Particles (Champagne)

Keywords: celebration, micro-precision, vitality.  
Tokens: `fx-size-micro`, `fx-density-sparse`, `fx-material-glassSpark`, `accentGold_soft`.

1. **champagneMicroBubbles**
   - ID family: `fx.particles.champagneMicroBubbles_*`
   - Layer: `particleField`
   - Behaviour: sparse, micro bubbles rising slowly, occasional shimmer.
   - Motion: `motion.pulseCalm`.

Rules:
- No confetti.
- Very low density, micro size.
- Faint `accentGold_soft` + `inkGlass_soft`.

---

### 2.5 Shimmer

Keywords: confidence, reveal, reassurance.

1. **confidenceShimmer**
   - ID family: `fx.component.buttonHover_confidenceShimmer_*`
   - Layer: `component`
   - Behaviour: narrow shimmer sweep across key CTAs on hover/focus.
   - Motion: `motion.confidenceShimmer`.

Use sparingly, only on one or two primary CTAs per view.

---

### 2.6 Mists & Fog

Keywords: softness, safety, reduced cognitive load.  
Tokens: `fx-texture-subtleMist`, `fx-spread-localHero`.

1. **breathHalo**
   - ID family: `fx.mist.breathHalo_*`
   - Layer: `weather`
   - Behaviour: slight local softening around central hero object or 3D viewer.
   - Motion: `motion.softBreath`.

---

### 2.7 Film Grain

Keywords: cinematic, analogue, trustworthy, non-plastic.  
Tokens: `fx-texture-filmGrain_soft`.

1. **filmSoft_static**
   - ID family: `fx.grain.filmSoft_*`
   - Layer: `filmGrain`
   - Behaviour: static or barely-shifting ultra-soft grain.
   - Motion: `motion.staticStill`.

Grain never flickers strongly.

---

### 2.8 Technology Grid

Keywords: precision engineering, longevity, planning.  
Tokens: `fx-pattern-isometricGrid_soft`.

1. **techGrid_soft**
   - ID family: `fx.viewer.techGrid_*`
   - Layer: `backgroundGradient`
   - Behaviour: barely-visible grid/parallax behind 3D models or tech sections.
   - Motion: `motion.parallaxGentle`.

Use for implants, 3D dentistry, planning tools.

---

## 3. Layer Placement Rules

- Water / waves / ink → `backgroundGradient`, `weather`
- Particles → `particleField`, always under copy and glass panels
- Film grain → `filmGrain`
- Glass sheen → `glassOverlays`
- Component motion → `component` layer, local to element

Never:
- Put high-contrast FX above body copy.
- Animate everything at once – 1–3 subtle FX per screen maximum.

---

## 4. PRM Handling

For `prefers-reduced-motion`:

- Background motion:
  - Drop intensity to zero, or
  - Switch to `motion.prmFadeOnly` with single-entry fades.
- Particles removed (`fx-density-none`).
- Shimmer/focus → static styles (outline, soft elevation).
- Parallax disabled (`fx-parallax-none`).

Every FX preset in `champagne-fx-presets.json` defines its own `prmSafeAlternative`.
