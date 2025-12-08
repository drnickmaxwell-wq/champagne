# Champagne FX Palette — Light Mode & Temporal Model

Light mode in Champagne is *not* white.  
It is diffused daylight through frosted glass: soft, creamy, hazy, luxurious.

---

## 1. Emotional Intent (Light Mode)

- Clear but never stark
- Airy but still cinematic
- Calm, warm confidence
- Premium clinical environment without “hospital glare”

**Brightness range:** 70–82% global brightness (never 100%).  
**Primary hue range:** porcelain ivory, champagne-neutral stone, soft pink → gentle teal at 135°.  
**Shadows:** extremely subtle, warm-tinted, diffused.  
**Highlights:** broad, creamy; micro-gold appears only on edges, not surfaces.

---

## 2. Time-of-Day Light Continuum

Four-segment cinematic continuum, each Champagne-safe and token-compatible.

### 2.1 Dawn Softrise (light early variant)

- Hue: warm rose → ivory
- Gradient: magenta softened to pastel
- FX: warm caustics, gentle dust motes
- Gold: ≤ 2%

Tone: fresh, caring, welcoming.  
Usage: onboarding, new patient flows.

---

### 2.2 Midday Clarity (pure light mode)

- Hue: neutral → cool
- Gradient: subtle teal inflections
- FX: minimal shimmer, almost no particles
- Gold: ≤ 1.5%

Tone: precision, competence, softened clinical clarity.  
Usage: treatment plans, payment, diagnostics.

---

### 2.3 Golden Hour Calm (hybrid mode)

- Hue: warm neutral
- Gradient: 135° gradient visibly present
- FX: gold micro-sparkles, warm glass glows
- Gold: up to 4% (system max)

Tone: cinematic, emotionally warm, luxurious.  
Usage: smile makeover stories, long scroll narratives.

---

### 2.4 Inkfall Evening (transition to dark canon)

- Hue: cool → ink
- Gradient: teal intensifies, gold almost disappears
- FX: bubbles, caustics, micro-noise, shimmer
- Gold: near zero

Tone: depth, contemplation, immersion.  
Usage: dark heroes, deep education sections.

---

## 3. Light-Mode Materials

### glass.clear.porcelain
- Use: diagnostic UI cards, CTAs.
- Look: porcelain-tinted clear glass, softened highlights.
- Rule: no pure white edges; always ivory/porcelain.

### glass.fogged.rose
- Use: onboarding, warm welcome screens.
- Look: warm haze diffusion; avoid heavy blur.

### metal.steel.soft-day
- Use: ortho, implants, 3D tools.
- Look: low-contrast surgical steel; no chrome.

### ink.porcelain-base
- Use: light-mode backgrounds.
- Look: porcelain neutral base with faint 135° gradient; never pure white.

### water.caustic.day
- Use: light heroes, “daytime” experiences.
- Look: warm caustics, low contrast; avoid cold blue cast.

---

## 4. Light-Mode FX

- `fx.shimmer.edge.porcelain` – warm edge shimmer, very low opacity.
- `fx.caustics.day-soft` – warm, low-contrast caustics for light surfaces.
- `fx.sparkles.gold.day` – slightly more visible micro gold, still micro density.
- `fx.surface.noise.porcelain` – warm analogue noise (<1% opacity) to avoid flatness.

All honour gold ≤ 4% rule and PRM fallbacks.
