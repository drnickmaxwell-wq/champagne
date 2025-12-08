# Champagne Layer Stack Guard

The Stack Guard is the strictest law in the Champagne Universe.

Its job:
- enforce layer order
- prevent visual corruption
- protect accessibility
- keep everything Champagne (calm, cinematic, legible)

If this guard is broken, the experience is no longer considered “Champagne-compliant”.

---

## 1. Sacred Stack Order

From bottom → top:

1. **Base Layer**  
   - `layer.base`  
   - porcelain, ink, or temporal base tones

2. **Gradient Layer (135°)**  
   - `layer.gradient135`  
   - champagneGradient135 only, angled at 135°  
   - never missing, never re-angled

3. **Weather Layer**  
   - `layer.weather`  
   - haze, atmospheric glow, slow ripples

4. **Material Layer**  
   - `layer.material`  
   - glass, metal, enamel metaphors

5. **FX Layer**  
   - `layer.fx`  
   - shimmer, caustics, sparkles, particles

6. **Content Layer**  
   - `layer.content`  
   - text, UI, CTAs, icons, input fields

7. **Ritual Layer (Temporary)**  
   - `layer.ritual`  
   - ONLY active during rituals (Acceptances, Ceremonial, etc.)  
   - must self-dismantle within a strict timeout

---

## 2. Violations (These Must Raise Errors)

The system must **refuse** a build or log a hard error if:

1. **Gold in Weather**  
   - Any gold token appears in `layer.weather`.  
   - Gold is ceremonial, never atmospheric.

2. **Gradient Angle Not 135°**  
   - Any “Champagne” gradient is not at 135°.  
   - No rotated gradients, no freestyle angles.

3. **Missing Gradient Layer**  
   - Gradient 135° layer is absent on scenes that claim Champagne theming.

4. **FX Under Material**  
   - `layer.fx` is placed below `layer.material`.  
   - FX must sit above materials and below content.

5. **Grain Above Content**  
   - Film grain or noise appears above text or CTAs.  
   - Content must remain clean, sharp, and legible.

6. **Blurred Content**  
   - Any blur effect applied directly to `layer.content` without explicit accessibility override.  
   - Glow, blur, and haze must sit underneath.

7. **Ritual Layer Overstay**  
   - `layer.ritual` persists beyond its configured timeout.  
   - Ritual = moment, not state.

---

## 3. Accessibility Requirements

- Contrast must remain WCAG-compliant regardless of weather/FX.
- `prefers-reduced-motion` must be honoured:
  - FX intensity reduced or disabled.
  - Ritual layers perform fade-only transitions.
- No layer combination may cause flicker or strobing.

---

## 4. Stack Guard & Canon Integration

Stack Guard reads and enforces:

- Temporal State (dawn, midday, goldenHour, inkfall, night, ceremonial)
- Weather Mode (clearStudio, softHaze, subsurfaceRipple, deepInk)
- Motion Profile (silent, softBreath, cinematic)
- Emotional Lighting State (assurance, luxuryEmotion, precision, gratitude)
- FX Canon and Particle Physics
- PRM (prefers-reduced-motion)
- Ritual Motion Law

If any combination violates:
- gradient law
- gold ≤ 4%
- readability
- layer order

→ Stack Guard raises a **Champagne Canon Violation**.
