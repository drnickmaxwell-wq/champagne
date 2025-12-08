# Preview Hero Overhaul v3

## Summary of changes
- **Hero gradient & overlays:** Preview heroes now render the canonical Champagne gradient without MoodMap recoloring. Edge vignettes and wave/particle/grain overlays are dialed back to match home-hero opacity while keeping shimmer and drift responsive to motion intensity.
- **Canvas dusk treatment:** Page canvases shift to an ink-to-paper dusk blend that is one step lighter, with only subtle warm/teal/gold veils at low opacity so the hero reads as jewel-toned instead of foggy.
- **Card surfaces:** Hero glass, primary cards, FAQs, and link tiles use paper-forward smoked glass fills with higher ink text contrast. MoodMap now rides on borders, glows, and shadow warmth/coolness rather than tinting the fills.

## MoodMap influence
MoodMap variables continue to map per treatment, but they now adjust accent layers only:
- Shadow warmth/coolness and border-image gradients.
- Light glows, shimmer/particle opacities, and modest vignette strength.
- Base hero gradient, card fills, and canvas hues stay in the canonical Champagne palette.

## Before/after notes by treatment
- **Implants/Technology:** Removed teal fog from canvas; cooler accents now live in borders and float shadows while the hero shows the magenta→teal→gold body clearly.
- **Veneers/Cosmetic/Composite:** Warm lift confined to keylines and shadow warmth; cards return to pearl glass so the gradient body remains saturated.
- **Whitening:** Gold sheen amplified through shimmer/particle opacity rather than card tinting; canvas stays neutral dusk.
- **General/Anxiety:** Neutral dusk canvas with softer vignette; reduced motion path still honored.

## Key selectors updated
- Root and `.cpv-page` custom properties for canvas balance, hero overlays, and surface lightness.
- `.cpv-page`, `.cpv-page::before`, `.cpv-page::after` for lighter dusk background and gentler veils.
- `.champagne-hero-surface__gradient`, `.cpv-hero::before`, `.cpv-hero::after`, and `.cpv-wavefx` layers to keep the canonical gradient visible.
- Card shells: `.cpv-card`, `.cpv-faq__item`, `.cpv-linkcard`, `.cpv-glass` for paper-forward fills and accent-driven shadows/borders.

## Known differences vs sacred hero
- Preview canvases remain slightly duskier than home to differentiate preview context.
- Motion intensities still scale per treatment, though reduced-motion disables drift entirely.
- CTA outline buttons keep preview-specific typography sizing; gradients match home recipes.

## Tests
- `node scripts/guard-rogue-hex.mjs` ✅
- `pnpm brand:guard` ✅
- `pnpm guard:hero` ✅
- `node scripts/guard-manifest-sync.mjs` ✅
- `node scripts/guard-preview-only.mjs` ⚠️ (fails in this environment because `origin/main` is unavailable; expected for preview-only guard)
