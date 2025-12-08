# Champagne Weather System

Champagne's “weather” is NOT literal rain or fog — it is ambient micro-environment behaviour that adds emotional depth and cinematic calm.

Weather is always **quiet, low-opacity (<4%)**, and never distracts from content. It breathes with the page.

---

## 1. Weather Modes

### 1.1 Clear Studio Air
- Clean, crisp, minimal movement
- Static grain (0.5%)
- No particles
- No caustics
Use for: pricing, finance, clinical UI, treatment plan pages.

---

### 1.2 Soft Haze Drift
- Warm atmospheric glow (<2%)
- Micro dust drift (<0.5% opacity)
- Gentle horizontal movement
Use for: cosmetic storytelling, onboarding, luxury flows.

---

### 1.3 Subsurface Ripple Air
- Low-frequency water ripples
- Soft caustics
- Extremely slow flow (<1px/sec)
Use for: hero sections, smile makeovers, cinematic landing moments.

---

### 1.4 Deep Ink Atmosphere
- Slow bubbles rising
- Vertical dust drift
- Stronger gradient emphasis (135°)
- Cool edge under-lighting
Use for: deep educational sections, immersive 3D dentistry moments.

---

## 2. Weather Laws

1. Weather must never distract (opacity stays <4%).
2. Motion speed < 1px/sec.
3. Gold is illegal in weather layers.
4. Weather inherits the current Temporal State (dawn → haze, inkfall → ink atmosphere).
5. Weather always sits BELOW materials, glass, and content.

---

## 3. FX Layer Mapping

Weather maps to:
- `layer.weather`
- `layer.gradient135` (caustics beneath grain)
- `layer.filmGrain` (when needed)

Stack Guard enforces correct placement.
