# Champagne FX Routing Notes
Where each FX preset belongs and why.

These notes map `fxPresets` to routes/contexts so Director and Codex
can attach them to manifests (home, treatments, portal, etc.).

---

## 1. Home Hero

Primary brief: first impression of safety + cinematic tech + warmth.

Recommended stack:

- `backgroundGradient`
  - `fx.wave.gradientWaveMask_primary`
  - `fx.water.depthCaustics_subtle`
  - Optional tech segments: `fx.viewer.techGrid_soft` very low.

- `weather`
  - `fx.water.surfaceRipple_soft`
  - `fx.mist.breathHalo_soft` around main hero object / 3D veneer / portrait.

- `particleField`
  - `fx.particles.champagneMicroBubbles_hero` (very sparse).

- `filmGrain`
  - `fx.grain.filmSoft_static`.

- `glassOverlays`
  - `fx.glass.parallaxSheen_soft` on main glass hero plate.

- `component`
  - `fx.component.buttonHover_confidenceShimmer` on primary CTA only.
  - `fx.component.cardHover_liftShadow` on hero info cards.

Why: water + gradient wave = calm; bubbles + soft gold = “Champagne”; glass + tech grid = precision and advanced tech.

---

## 2. Veneers

Brief: refinement, translucency, confidence.

Where: veneers hero, veneers explainers, veneers 3D viewer.

- Hero:
  - `fx.water.depthCaustics_subtle`
  - `fx.wave.gradientWaveMask_primary`
  - `fx.particles.champagneMicroBubbles_hero`

- Storytelling:
  - `fx.ink.inkfallDrift_bg`
  - `fx.grain.filmSoft_static`

- CTAs:
  - `fx.component.buttonHover_confidenceShimmer`

---

## 3. Implants

Brief: engineering, permanence, trust.

- Hero:
  - `fx.viewer.techGrid_soft`
  - `fx.wave.gradientWaveMask_primary` at lower intensity
  - Optional `fx.mist.breathHalo_soft`

- 3D viewer header:
  - `fx.viewer.techGrid_soft`
  - `fx.glass.parallaxSheen_soft`

- Cards:
  - `fx.component.cardHover_liftShadow`

Particles are toned down; it should feel architectural, not watery.

---

## 4. Spark Aligners / Clear Aligners

Brief: lightness, invisibility, lifestyle.

- Hero:
  - `fx.water.surfaceRipple_soft`
  - `fx.water.depthCaustics_subtle`
  - `fx.particles.champagneMicroBubbles_hero` very low density.

- Lifestyle:
  - `fx.ink.inkfallDrift_bg` very low.
  - `fx.grain.filmSoft_static`.

- CTAs / cards:
  - `fx.component.buttonHover_confidenceShimmer`
  - `fx.component.cardHover_liftShadow`

---

## 5. 3D Dentistry & Technology Hub

Brief: high-end lab, modern, reliable, not sci-fi.

- Backgrounds:
  - `fx.viewer.techGrid_soft`
  - `fx.wave.gradientWaveMask_primary` low amplitude.

- Heroes / viewers:
  - `fx.glass.parallaxSheen_soft`
  - `fx.mist.breathHalo_soft`

- Global:
  - `fx.grain.filmSoft_static`.

---

## 6. Emergency Dentistry

Brief: safety, clarity, zero confusion.

Dial FX down:

- Background:
  - `fx.wave.gradientWaveMask_primary` at minimum.
- Weather:
  - optional `fx.mist.breathHalo_soft`.
- Film:
  - `fx.grain.filmSoft_static` ultra-low.
- Components:
  - `fx.component.cardHover_liftShadow`
  - maybe one `fx.component.buttonHover_confidenceShimmer` on main call CTA.

FX should never compete with comprehension.

---

## 7. Portal Dashboard

Brief: trust, order, low cognitive load.

- Background:
  - mostly static gradient; optional very soft `fx.grain.filmSoft_static`.

- Cards & lists:
  - `fx.component.cardHover_liftShadow`.

- CTAs:
  - very minimal shimmer on 1–2 key actions.

No particles / ink behind dense info.

---

## 8. 3D Viewer Headers (across treatments)

Brief: floating object in a calm, controlled world.

- Background:
  - `fx.wave.gradientWaveMask_primary` or `fx.viewer.techGrid_soft`
  - plus `fx.water.depthCaustics_subtle` for veneers/aligners.

- Weather:
  - `fx.mist.breathHalo_soft`.

- ParticleField:
  - `fx.particles.champagneMicroBubbles_hero` only for cosmetic emotions.

---

## 9. PRM Routing Summary

When PRM is enabled:

- Use each preset’s `prmSafeAlternative`.
- Defaults:
  - Background animation → static gradient.
  - Particles → removed.
  - Shimmer → static highlight.
  - Card lift → small shadow/outline changes only.

Director/Codex can implement this as a global “motion mode” resolver that switches between `motion.*` and `motion.prmFadeOnly` / `motion.staticStill`.
