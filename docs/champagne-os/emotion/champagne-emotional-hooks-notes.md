# Champagne Emotional Hooks – Behavioural Response Layer

This document defines how emotional lighting should adapt in real time within the Concierge, Portal, and future adaptive UI engines.

---

## 1. Anxiety Signals → Shift to Assurance

Triggers:
- Repeated help requests  
- Long pauses  
- Emergency terms  
- High-intensity language  

Effects:
- Fade to emotionalLighting.assurance  
- Reduce weather motion  
- Increase dome softness  
- Switch concierge persona to “Warm Guide”

---

## 2. Curiosity → Shift to Precision

Triggers:
- User opens 3D viewers  
- User asks technical questions  
- User compares treatments  

Effects:
- Move toward emotionalLighting.precision  
- Increase rim visibility  
- Sharpen glassInk edges  
- Elevate clarity without increasing contrast too much

---

## 3. Excitement → Shift to LuxuryEmotion or Celebration

Triggers:
- User selects Smile Design  
- User views cosmetic results  
- Completed finance check  
- Booking success  

Effects:
- Introduce softGold within ≤ 4%  
- Add bokeh drift  
- Slight warm shift in gradient135  

---

## 4. Portal Progression Logic

### Stage 1: Onboarding → emotionalLighting.calm  
### Stage 2: Reviewing Treatment → precision/calm mix  
### Stage 3: Approaching Completion → assurance  
### Stage 4: Success → relief or celebration  

Transitions must stay below:
- 400ms (motion cap)  
- 16px environmental parallax  
- Prefer fade/blend modes for PRM users

---

## 5. Future Multi-Sensory Hooks

These emotional states can later influence:
- haptic patterns (soft pulse, calm hold)  
- ambient sound beds (warm pad, airy clarity, gentle shimmer)  
- micro-motion behaviours (slower drift during calm; balanced oscillation during assurance)  

All interactions must remain subtle and cinematic.
