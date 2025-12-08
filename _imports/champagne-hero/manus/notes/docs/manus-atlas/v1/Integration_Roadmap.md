# Integration Roadmap  
Champagne Ecosystem — St Mary’s House Dental  
Author: Manus Importer AI  
Version: Atlas v1

---

# 0. Purpose

This roadmap explains **exactly how to integrate all Manus sections, components, and effects** into the Champagne Next.js repo using:

- App Router (Next.js 15)
- Tailwind v4 tokens
- Champagne gradient law
- Wave masks, particles, grain
- PRM-safe animations
- Dark/light support
- Codex guarded patches

This serves as a master plan for Director AI and Codex Agent Mode.

---

# 1. Integration Philosophy

Manus produced **many variations** of the same components.  
Champagne Restoration produced a **single correct version** for each.

Therefore:

### ✔ Only Champagne Restored components become canonical  
### ✔ Manus Raw components are archived but never used  
### ✔ Polished Manus components inform spacing and rhythm  
### ✔ All visuals must be regenerated using tokens (not static colours)

This ensures long-term consistency across the entire ecosystem.

---

# 2. High-Level Build Order

This is the **correct order** to integrate everything into your repo:

## **1. Global Effects & Tokens**
1. Wave masks  
2. Particle overlay  
3. Film grain  
4. Champagne gradient generator  
5. Glass overlay tokens  
6. Motion (parallax/hover) PRM safe defaults  

Then run:

```
pnpm brand:guard
pnpm hue:verify
```

---

## **2. Canonical Champagne Hero Component**

**Files:**  
- composite-hero-desktop-final  
- home-desktop-wave + grain  
- home-mobile  
- particles  
- grain  
- wave masks  

### Build one reusable hero:

```
/components/hero/ChampagneHero.tsx
```

### Features:
- accepts title, subtitle, CTAs  
- gradient token-based  
- optional wave mask  
- optional particles  
- optional grain  
- optional badge capsule  
- mobile-first responsive behaviour  
- dark mode support  

This will become the **foundation** for:

- Home  
- Composite Bonding  
- Technology  
- Veneers  
- Whitening  
- Implants  
- Ortho  

---

## **3. Layout Scaffolding**

Create a canonical layout:

```
/components/layout/ChampagneLayout.tsx
```

Includes:
- Header  
- Footer  
- Scroll restore  
- Theme switch  
- Cookie/GDPR bar  

Use the polished light/dark variants.

---

## **4. Canonical Card System**

Using the polished Composite Body & AI tools cards:

```
/components/card/
TreatmentCard.tsx
AIWidgetCard.tsx
TestimonialCard.tsx
TeamCard.tsx
```

All cards share:
- consistent radius  
- consistent shadow  
- consistent glass overlay  
- consistent spacing rhythm  
- typography scale from tokens  

---

## **5. Tab Component (Composite Overview)**

The tab system inside Composite Bonding is your strongest Manus pattern.

Create:

```
/components/tabs/TabsChampagne.tsx
```

Features:
- fade transition (250ms)
- PRM safe
- keyboard accessible
- auto-height
- token-based colours

---

## **6. CTAs (Global)**

Create a single module:

```
/components/cta/ChampagneCTA.tsx
```

Includes:
- Primary gradient CTA  
- Secondary glass CTA  
- CTA pairs (hero, inline, section ending)  
- Responsive size scaling  
- Gold focus ring  

---

## **7. FAQ Component (schema-ready)**

Use Phase 1E as the blueprint.

```
/components/faq/ChampagneFAQ.tsx
```

Features:
- SEO structured data injection  
- Expandable cards  
- Accessible keyboard nav  
- Light/dark theme tokens  
- Gold indicator line  

---

## **8. Testimonial / Patient Stories**

Build two components:

```
/components/testimonial/ChampagneTestimonial.tsx
/components/testimonial/ChampagneTestimonialCarousel.tsx
```

Features:
- dot navigation  
- avatar  
- star rating  
- PRM-safe movement  
- serif quote  

---

## **9. AI Tools Module**

Convert the following Manus cards into components:

- Cost Estimator  
- Time Predictor  
- AR Try-On  


```
/components/ai-tools/CostEstimator.tsx
/components/ai-tools/TimePredictor.tsx
/components/ai-tools/ARSmileTryOn.tsx
```

Use the polished AI cards as base.

---

## **10. 3D Viewer Section**

Use your placeholder until you swap for real 3D models:

```
/components/3d/Champagne3DViewer.tsx
```

Wrap with glass frame and token spacing.

---

## **11. Page Assembly**

### Home Page


```
app/page.tsx
```

Use:
- ChampagneHero
- SignatureTreatmentGrid
- TechnologyStrip
- TestimonialsCarousel
- FAQ
- CTA band

### Composite Bonding Page


```
app/treatments/composite-bonding/page.tsx
```

Use:
- ChampagneHero
- TabsChampagne
- AI tools
- TestimonialsCarousel
- FAQ
- CTA band

### Technology Page


```
app/technology/page.tsx
```

Use:
- ChampagneHero
- 3DViewer
- TechnologyGrid
- CTA

---

# 3. What to **NOT** Import

## ❌ Manus Raw Heroes  
Unpolished, wrong gradients.

## ❌ Manus Old Cards  
Any card without soft glass + standard radius.

## ❌ Old Testimonials  
Spacing mismatched.

## ❌ Duplicate Composite ZIP Sections  
Only use **polished** variants.

## ❌ Old Footer  
Only use the **polished light/dark footer duo**.

---

# 4. What to Rebuild Entirely

## 1. Portal Dashboard  
Manus never produced a full Champagne version.

## 2. Finance Explainer  
Needs calculator + card grid.

## 3. Chatbot Panel (Champagne Integrated)  
Manus gave a base UI — you must rebuild in your style.

## 4. Smile Quiz Results Page  
Only inputs provided — not the final hero/section.

These four become **GAP_NEEDS_MANUS** briefs.

---

# 5. Codex Integration Steps

For each category:

### 1. Drop folder structure  
Codex creates:

```
/components/*
/components/hero
/components/card
/components/ai-tools
/components/testimonial
/components/faq
/components/cta
/components/3d
```

### 2. Convert assets to `/public/brand/champagne/`  
Waves, particles, grain.

### 3. Enforce tokens  
Run hue + brand guard.

### 4. Generate Typescript components  
Each section becomes a TSX component with token-driven styling.

### 5. Create routes  
Codex updates your `app/` folder with the correct assembly.

---

# 6. Deployment Steps

### 1. Test in Preview Deployment  
- Brand guard  
- Hue guard  
- Motion guard  
- Token audits  

### 2. Validate dark/light  
Compare against polished screenshots.

### 3. Sign-off with Pixel-Perfect Auditor
Use the screenshot pairs you uploaded.

---

# 6A. Route execution order (imported from Integration_Roadmap.md)

**Order:** Home → Treatments hub → Top 6 treatments → Technology → Patient Stories

## Home (`app/preview/home`)
- Wire hero (immutable), value-trio, patient-stories, priority-treatments, 3d-ar, ai-concierge, teleconsult, finance, faq, local-proof, footer.

## Treatments hub (`app/preview/treatments`)
- Use `/treatments/[slug]` template; ensure HowTo, Offer, FAQPage blocks; add ConversionBand.

## Top 6 treatments (e.g., veneers, implants, composite bonding, Invisalign, whitening, crowns)
- Sequence sections: hero → symptoms-benefits → how-it-works → eligibility → results → gallery → pricing → 3d-ar → experts → faqs → cta.

## Technology (`app/preview/technology`)
- Tech grid and demo; progressive enhance Three viewer; PRM fallbacks.

## Patient Stories (`app/preview/stories`)
- Filters, grid, pagination; link to services for internal linking.

## Director Checks
- Any token additions to be approved; keep gold coverage within guard; heroes remain immutable; structured data via route-level metadata.

---

# 7. Final Notes

With this roadmap:

- Director AI understands every component  
- Codex knows exactly what to build  
- Manus knows what gaps to fill  
- You know what becomes canonical  
- All Champagne patterns become unified  
- Your site becomes consistent, luxurious, and scalable

This is the “how” of bringing the Champagne Ecosystem to life.

---

**End of Roadmap File.**
