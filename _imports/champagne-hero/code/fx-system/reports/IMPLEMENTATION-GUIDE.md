# Technology Page — Phase 2 Implementation Guide

**Objective**: This guide provides instructions for integrating the Phase 2 cinematic micro-effects into the existing React components of the Technology Page.

**Prerequisites**: A working React environment with the Phase 1 Technology Page components.

---

## 1. File Structure & Asset Placement

Ensure the following new assets from the `ai24-ai24_polish_kit.zip` are placed correctly in your `/public` directory:

- `/public/brand-polish/film-grain.png`
- `/public/brand-polish/glass-reflect.svg`
- `/public/brand-polish/wave-gold-dust.png`
- `/public/brand-polish/wave-light-overlay.png`

---

## 2. CSS Integration

For each component, replace the existing Phase 1 CSS file with the new Phase 2 CSS file. The new files contain all the keyframe animations and new classes for the micro-effects.

- `TechnologyHero.tsx` → `technology-hero.css`
- `DigitalWorkflow.tsx` → `digital-workflow.css`
- `EquipmentGallery.tsx` → `equipment-gallery.css`
- `AIInnovation.tsx` → `ai-innovation.css`
- `Sustainability.tsx` → `sustainability.css`
- `TechnologyCTA.tsx` → `technology-cta.css`
- `ScrollCue.tsx` → `scroll-cue.css`

---

## 3. Component Modifications

### `TechnologyHero.tsx`

1.  **Add Parallax Layers**: Add the following `div` elements inside the main `<section>` tag, before the `.hero-video-container`:

    ```html
    <div className="hero-gradient"></div>
    <div className="hero-wave-slow"></div>
    <div className="hero-wave-medium"></div>
    <div className="hero-wave-reverse"></div>
    <div className="hero-wave-light"></div>
    <div className="hero-film-grain"></div>
    <div className="hero-lens-flare"></div>
    <div className="gold-whisper-line"></div>
    <div className="hero-gold-dust"></div>
    <div className="hero-overlay"></div>
    ```

2.  **Add Parallax Mouse Effect**: Implement a `mousemove` event listener to update the `--rx` and `--ry` CSS variables for the lens distortion effect. This should be disabled on mobile.

### `DigitalWorkflow.tsx`

1.  **Add Wave Morph Layer**: Add `<div className="workflow-wave-morph"></div>` inside the main `<section>`.
2.  **Implement Scroll-Sync Narrative**: Use an `IntersectionObserver` to track which of the three cards (Scan, Design, Make) is most visible in the viewport. Update the `data-phase` attribute on the `.workflow-wave-morph` element to `scan`, `design`, or `make` accordingly. The CSS will handle the hue morphing.

### `EquipmentGallery.tsx`

1.  **Implement Staggered Fade-In**: Use an `IntersectionObserver` to trigger the `visible` class on the `.equipment-card` elements when the gallery enters the viewport. Add a transition delay to each card in your component logic (`index * 100ms`).

### `Sustainability.tsx`

1.  **Add Gold Flecks**: The CSS now handles the gold flecks. Ensure you have a container with the class `.gold-particles-container`.
2.  **Implement Number Animation**: Use an `IntersectionObserver` to trigger the number animation when the `.sustainability-stats` element is in view. The provided React code in the `Sustainability.tsx` file already contains this logic.

### `TechnologyCTA.tsx`

1.  **Add New Layers**: Add the new layers for the film grain, parallax wave, and wave shimmer inside the main `<section>` tag:

    ```html
    <div className="cta-film-grain"></div>
    <div className="cta-parallax-wave"></div>
    <div className="cta-wave-shimmer"></div>
    ```

### `page.tsx` (Main Technology Page)

1.  **Add Scroll Cue**: Import and add the `<ScrollCue />` component at the top level of your page component, just inside the `<main>` element.

---

## 4. Performance & Accessibility

- **Lazy Loading**: Ensure all new image assets (`.png`, `.webp`) are lazy-loaded. The provided components assume a standard `next/image` implementation or equivalent.
- **Reduced Motion**: All animations are wrapped in `@media (prefers-reduced-motion: reduce)` queries in the CSS. No additional logic is needed.
- **Contrast**: The text contrast has been validated with all new effects active and meets WCAG AA standards.

---

By following these steps, you will successfully integrate all Phase 2 cinematic micro-effects, elevating the Technology Page to the next level of brand expression.

