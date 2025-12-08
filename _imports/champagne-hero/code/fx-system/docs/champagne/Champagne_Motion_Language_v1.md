# Champagne Motion Language v1

Champagne motion emphasizes cinematic calm, precision, and PRM-safe accessibility. Gold presence remains below 4% per frame, easing follows soft cubic curves, and interactions respect hero-freeze governance on sacred hero routes.

## Principles
- **Cinematic Restraint:** Prioritize long easing curves, layered depth, and soft fades over aggressive transforms.
- **PRM Safety:** Provide reduced-motion defaults, limit parallax amplitude, and avoid rapid strobing or opacity flickers.
- **Gold Discipline:** Gold highlights remain under 4% per frame and never drive functional affordances.
- **Token Fidelity:** All durations, opacities, and radii use existing Champagne motion tokens; avoid hard-coded values.
- **Preview-First:** Ship new motion only in `/preview/*` surfaces until cleared for production and hero manifest alignment.

## Motion Motifs

### Dust Settling
- **Description:** Fine particle drift that decelerates into calm stillness, evoking airborne dust illuminated by soft light.
- **Intended Components/Routes:** Champagne Light-Dome Hero, Whisper Interaction Layer, `/preview/lux/*`.
- **Implementation Hints:** Prefer Framer Motion with opacity + translateY easing; optional canvas/WebGL particles if gated behind PRM detection.
- **PRM Fallback:** Remove particle emitters and retain static glow overlays only.

### Hover Bloom
- **Description:** Gentle scale and glow bloom on hover focus, paired with micro-shadow lift to reinforce premium tactility.
- **Intended Components/Routes:** Floating Signature Cards, Gold Refract CTA Bar, `/treatments/*`, `/preview/lux/*`.
- **Implementation Hints:** CSS + motion tokens for scale/box-shadow; Framer Motion for accessible focus-visible states.
- **PRM Fallback:** Disable scale, retain soft shadow change and color token shift only.

### Gradient Drift
- **Description:** Slow gradient pans that subtly shift hue and luminance, maintaining Champagne dusk palette discipline.
- **Intended Components/Routes:** Champagne Dusk Divider, Story Walk ribbons, `/stories/*`, `/preview/lux/*`.
- **Implementation Hints:** CSS background-position animations using tokenized durations; clamp movement to low amplitudes.
- **PRM Fallback:** Freeze gradient position; allow manual toggle via prefers-reduced-motion.

### Wave Sync
- **Description:** Sequential, low-amplitude wave motion across chips or steps to signal flow without jarring attention.
- **Intended Components/Routes:** Champagne Timeline ribbon, treatment onboarding steps, `/journeys/*`.
- **Implementation Hints:** Framer Motion staggered transitions or CSS keyframes with tokenized delays; maintain vertical displacement under 4px.
- **PRM Fallback:** Replace with opacity-only highlight on active step.

### Parallax Rhythm
- **Description:** Layered parallax motion that syncs scroll velocity to depth planes for cinematic storytelling.
- **Intended Components/Routes:** Champagne Parallax Corridor, Story Walk, `/preview/lux/*`.
- **Implementation Hints:** Framer Motion `useScroll` with clamped transforms; optional WebGL plane depth when hardware allows.
- **PRM Fallback:** Disable parallax offsets and lock planes to base position.

### Dusk Fade
- **Description:** Soft fade-through between sections with dusk-tinted overlays to control pacing.
- **Intended Components/Routes:** Dusk Dividers, portal transitions, `/preview/*` shell.
- **Implementation Hints:** CSS transition on opacity with token durations; optional overlay gradient using tokens.
- **PRM Fallback:** Instant change with maintained gradient overlay.

### Shimmer Brushing
- **Description:** Controlled shimmer pass resembling brushed metal, limited in intensity to avoid distraction.
- **Intended Components/Routes:** Gold Refract CTA Bar, signature highlights, `/preview/lux/*`.
- **Implementation Hints:** CSS linear-gradient mask with tokenized animation speed; avoid hard-coded gold and rely on existing metallic tokens.
- **PRM Fallback:** Static metallic highlight without motion.

### Glass Echolines
- **Description:** Refractive line sweeps across glass-like surfaces, creating a subtle echo of light.
- **Intended Components/Routes:** Light-Dome Hero overlays, 3D artefact frames, `/preview/lux/*`.
- **Implementation Hints:** Framer Motion clip-path sweeps or CSS mask animations; consider WebGL reflection planes for high-end devices.
- **PRM Fallback:** Single static highlight line; no sweep animation.

## Implementation Notes for Codex
- Build and test motion only within `/preview/*` scopes until Director and manifest sign-off.
- Sacred hero routes remain under hero-freeze rules; integrate motifs only through approved hero manifests.
- Timings, opacities, and easing must reference existing Champagne tokens—no hard-coded values or new color definitions.
