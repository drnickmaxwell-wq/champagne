[README.md](https://github.com/user-attachments/files/24034665/README.md)
# Champagne Hero Pack v2.0

**Premium luxury hero section for St Mary's House Dental**  
Complete asset pack with static images, motion videos, CSS, and manifest.

---

## 📦 Package Contents

This ZIP contains all assets needed to implement the Champagne Design System luxury hero:

### Static Assets (WEBP)
- **Waves** (10 files): Responsive wave masks and backgrounds (320px - 2560px)
- **Particles** (1 file): Tileable particle texture (1024×1024px)
- **Textures** (1 file): Film grain texture (512×512px)

### Motion Assets (WEBM)
- **wave-caustics.webm** (458KB): Underwater light caustics effect
- **glass-shimmer.webm** (457KB): Elegant glass shimmer overlay
- **particles-drift.webm** (412KB): Slow drifting particles
- **gold-dust-drift.webm** (384KB): Sparse gold dust accent

All motion files use VP9 codec with alpha channel, 24fps, seamless loops.

### Styles
- **hero.css**: Complete CSS with 9-layer system and reduced-motion support
- **manifest.json**: Full specification with layer order, opacity, blend modes

---

## 🗂 Installation

### Option 1: Copy to Existing Repo

Extract this ZIP and copy folders to your repo root:

```bash
# From the extracted champagne-hero-pack folder:
cp -r public/assets/champagne /path/to/your-repo/client/public/assets/
cp -r styles/champagne /path/to/your-repo/client/src/styles/
```

### Option 2: Manual Integration

1. **Copy assets** to your public directory:
   - `public/assets/champagne/waves/`
   - `public/assets/champagne/particles/`
   - `public/assets/champagne/textures/`
   - `public/assets/champagne/motion/`

2. **Copy styles** to your styles directory:
   - `styles/champagne/hero.css`
   - `styles/champagne/manifest.json`

3. **Update asset paths** in CSS if your structure differs

---

## 🎨 Layer System

The hero uses a strict 9-layer z-index system:

| Layer | Name | Type | Opacity | Blend Mode | Parallax |
|-------|------|------|---------|------------|----------|
| 1 | Gradient Base | Static | 1.0 | normal | 0px |
| 2 | Wave Caustics | Motion | 0.10 | screen | 2px |
| 3 | Wave Mask | Static | 0.40 | overlay | 4px |
| 4 | Glass Shimmer | Motion | 0.12 | screen | 1px |
| 5 | Particles Static | Static | 0.08 | screen | 3px |
| 6 | Particles Drift | Motion | 0.06 | screen | 3px |
| 7 | Gold Dust Drift | Motion | 0.08 | screen | 2px |
| 8 | Film Grain | Static | 0.07 | overlay | 0px |
| 9 | Content | Content | 1.0 | normal | 0px |

---

## 🎬 Motion Behavior

### Default (Motion Enabled)
All 4 motion layers play automatically:
- Wave caustics create depth
- Glass shimmer adds luxury sparkle
- Particles drift slowly upward
- Gold dust provides premium accent

### Reduced Motion (`prefers-reduced-motion: reduce`)
All motion layers are **hidden** via CSS:
```css
@media (prefers-reduced-motion: reduce) {
  .hero-wave-caustics,
  .hero-glass-shimmer,
  .hero-particles-drift,
  .hero-gold-dust-drift {
    display: none !important;
  }
}
```

Users see only:
- Gradient base
- Static wave mask
- Static particles
- Film grain
- Content

---

## 🎨 Brand Tokens

All colors use CSS variables from the Champagne Design System:

```css
--brand-magenta: #C2185B;
--brand-turquoise-alt: #40C4B4;
--brand-gold: #D4AF37;
--gradient-champagne: linear-gradient(135deg, #C2185B 0%, #40C4B4 60%, #D4AF37 100%);
```

**No hard-coded hex values** in implementation.

---

## 📱 Responsive Design

### Desktop (>768px)
- Min height: 70vh
- Safe padding: 96px top
- Wave mask: `wave-mask-desktop.webp` (2560×1440)

### Mobile (≤768px)
- Min height: 68vh
- Safe padding: 80px top
- Wave mask: `wave-mask-mobile.webp` (1170×2532)
- CTAs stack vertically

---

## 🚀 HTML Structure Example

```html
<section class="champagne-hero">
  <!-- Layer 1: Gradient -->
  <div class="hero-gradient-base"></div>
  
  <!-- Layer 2: Wave Caustics (motion) -->
  <div class="hero-wave-caustics">
    <video autoplay loop muted playsinline>
      <source src="/assets/champagne/motion/wave-caustics.webm" type="video/webm">
    </video>
  </div>
  
  <!-- Layer 3: Wave Mask -->
  <div class="hero-wave-mask"></div>
  
  <!-- Layer 4: Glass Shimmer (motion) -->
  <div class="hero-glass-shimmer">
    <video autoplay loop muted playsinline>
      <source src="/assets/champagne/motion/glass-shimmer.webm" type="video/webm">
    </video>
  </div>
  
  <!-- Layer 5: Particles Static -->
  <div class="hero-particles-static"></div>
  
  <!-- Layer 6: Particles Drift (motion) -->
  <div class="hero-particles-drift">
    <video autoplay loop muted playsinline>
      <source src="/assets/champagne/motion/particles-drift.webm" type="video/webm">
    </video>
  </div>
  
  <!-- Layer 7: Gold Dust (motion) -->
  <div class="hero-gold-dust-drift">
    <video autoplay loop muted playsinline>
      <source src="/assets/champagne/particles/gold-dust-drift.webm" type="video/webm">
    </video>
  </div>
  
  <!-- Layer 8: Film Grain -->
  <div class="hero-film-grain"></div>
  
  <!-- Layer 9: Content -->
  <div class="hero-content">
    <div class="hero-content-wrapper">
      <h1 class="hero-title">Your Luxury Smile Awaits</h1>
      <p class="hero-subtitle">Experience world-class dental care in the heart of London</p>
      <div class="hero-cta-group">
        <button class="hero-cta-primary">Book Consultation</button>
        <button class="hero-cta-secondary">Explore Treatments</button>
      </div>
    </div>
  </div>
</section>
```

---

## ⚡ Performance

- **Total static assets**: ~4.7MB (WEBP compressed)
- **Total motion assets**: ~1.7MB (WEBM VP9)
- **Hardware acceleration**: Enabled via `transform: translateZ(0)`
- **Will-change**: Applied to parallax layers
- **Lazy loading**: Recommended for below-fold content

---

## 🔧 Customization

### Adjust Layer Opacity
Edit values in `hero.css`:
```css
.hero-wave-caustics { opacity: 0.10; } /* 0.05 - 0.15 */
.hero-glass-shimmer { opacity: 0.12; } /* 0.08 - 0.18 */
```

### Adjust Parallax Intensity
Modify `parallaxMaxPx` values in `manifest.json` or implement via JavaScript:
```javascript
element.style.transform = `translateY(${scrollY * 0.04}px)`;
```

### Change Gradient
Update CSS variable:
```css
--gradient-champagne: linear-gradient(135deg, #C2185B 0%, #40C4B4 60%, #D4AF37 100%);
```

---

## 📋 Checklist

- [ ] Copy all assets to correct directories
- [ ] Import `hero.css` in your main stylesheet
- [ ] Update asset paths if needed
- [ ] Test on desktop and mobile viewports
- [ ] Verify motion videos autoplay and loop
- [ ] Test `prefers-reduced-motion` behavior
- [ ] Check CTA button focus states (accessibility)
- [ ] Verify gradient matches brand colors
- [ ] Test parallax on scroll (if implemented)
- [ ] Optimize video preload strategy

---

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires WebM VP9 codec support for motion layers.

---

## 📄 License

Proprietary assets for **St Mary's House Dental**.  
Do not redistribute or reuse outside this project.

---

## 🤝 Support

For questions or issues with this asset pack:
1. Check `manifest.json` for full specifications
2. Review layer order and blend modes
3. Verify file paths match your project structure
4. Test in multiple browsers

---

**Version**: 2.0.0  
**Last Updated**: 2025-11-01  
**Created by**: Manus AI  
**Design System**: St Mary's House Champagne Design System
