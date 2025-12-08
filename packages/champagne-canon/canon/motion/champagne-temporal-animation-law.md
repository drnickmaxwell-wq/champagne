# Champagne Temporal Animation Law

This law governs how Champagne transitions between time-of-day and emotional light states.

---

## 1. Principles

1. **Time must never feel mechanical**  
   No snapping, no harsh state jumps. Time flows like light across a gallery wall.

2. **Motion must feel inevitable**  
   Animations behave as if they were already happening; the user simply tuned in.

3. **Emotion is driven by temperature drift**  
   - Gold → warmth  
   - Teal → clarity  
   - Ink → depth  

Transitions are slow shifts through these temperatures.

---

## 2. Temporal States

- Dawn Softrise  
- Midday Clarity  
- Golden Hour Calm  
- Inkfall Evening  
- Deep Ink Night Mode  
- Ceremonial Light Mode

Each state is a colour–emotion–light package; this law controls movement between them.

---

## 3. Transition Rules

1. **No direct leaps**  
   - Dawn → Golden Hour is forbidden.  
   - Midday → Night must pass through intermediate drift states.

2. **Three-layer fade per transition**
   - Base surface temperature
   - Micro FX temperature (grain, caustics)
   - Edge energy (shimmer tone)

3. **Opacity changes follow Champagne easing curves**
   - `cubic-bezier(0.33, 0.0, 0.15, 1.0)` – “Champagne Drift”
   - `cubic-bezier(0.25, 0.1, 0.25, 1.0)` – for micro edge glints.

4. **Duration window: 1.6–4.2 seconds**
   - Shorter: abrupt
   - Longer: theatrical (not allowed)

---

## 4. Shift Recipes (summary)

- **Dawn → Midday**  
  Warm → neutral clarity. Warmth drains, porcelain cools, gold density drops, teal edge light +3–4%.

- **Midday → Golden Hour**  
  Neutral → warm cinematic. Light warms, caustics become visible, micro-gold strokes activate, shadows soften.

- **Golden Hour → Inkfall**  
  Warm → deep immersion. Shadows deepen, 135° gradient emphasised, bubbles begin, gold reduced below 1%.

- **Inkfall → Night**  
  Depth → precision focus. Vibrancy drops, cool edges glow, liquid glass distortion slightly increases.

- **Ceremonial Light**  
  Rare high-trust state (plan accepted, milestone). Single soft gold shimmer, porcelain glow, micro-sparkles, total duration ~1.6s.

---

## 5. Accessibility

If `prefers-reduced-motion` is true:

- No temperature drifts.
- No shimmer animation.
- All transitions become 180–240ms opacity-only fades.
- FX layers remain static.
