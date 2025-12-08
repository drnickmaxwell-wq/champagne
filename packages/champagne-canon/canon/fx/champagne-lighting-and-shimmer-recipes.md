# Champagne Adaptive Lighting & Shimmer Recipes  
(Light Mode + Time-of-Day)

These recipes describe how light, shimmer, and FX combine for different emotional and temporal states.

---

## Recipe: lighting.light-mode.global-porcelain

**Purpose**  
Baseline for all light-mode surfaces.

**Behaviour**
- Ambient brightness ~75%
- No harsh lights
- Soft warm-white diffusion
- Shadows almost nonexistent

**Ingredients**
- Porcelain base surface
- Warm noise grain
- Soft edge glows on key components

**Performance**  
Cheap: CSS-only implementation.

---

## Recipe: fx.dawn-softrise.glow

**Purpose**  
Introduce warm early-day lighting.

**Behaviour**
- Warm gradient shift toward rose/ivory
- Gold micro-sparkles allowed (≤ 2%)
- Subtle warm vignette around main content

**Triggers**
- Theme selection: `temporalState = "dawn"`
- Onboarding / welcome flows

**Performance**  
Cheap–moderate.

---

## Recipe: fx.midday-clarity

**Purpose**  
Crisp yet soft light for treatment planning and forms.

**Behaviour**
- Cool-neutral highlights
- Warmth reduced
- Minimal shimmer or particles

**Usage**
- Treatment plan screens
- Finance/payment flows
- Diagnostic viewers

---

## Recipe: fx.golden-hour-emotion

**Purpose**  
Create cinematic narrative depth.

**Behaviour**
- Warm sidelight
- Enhanced (but still ≤ 4%) gold micro-shimmer
- Light caustics behind key imagery
- Slightly stronger gradient presence

**Usage**
- Smile makeover pages
- Cosmetic storytelling sequences

**Performance**  
Moderate.

---

## Recipe: fx.inkfall-transition

**Purpose**  
Transition from light mode into dark Inkfall mode.

**Behaviour**
- Gradual fade of porcelain base into ink
- Shimmer temperature drifts from warm to cool
- Bubbles and deeper caustics can slowly appear

**Usage**
- Scroll-driven entries into deep hero sections
- Portal → cinematic treatment explainer transitions

**Performance**  
Moderate–expensive when real caustics are used.
