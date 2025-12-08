# Preview Hero Overhaul v1

## Summary
- Intensified preview hero gradients, dusk-ink canvases, and Champagne vignette layers to mirror the sacred hero without altering production assets.
- Elevated preview cards with smoked-glass surfaces, dual-shadow lift, and mood-aware gradient borders for clearer luxury contrast.
- Tuned MoodMap warmth/teal/gold balances per treatment and amplified shimmer/motion cues while honoring prefers-reduced-motion.

## Visual changes
- **Canvas:** Replaced grey wash with an ink-forward dusk base, layered radial glows (warm/teal/gold) driven by MoodMap strengths, and multiplied vignettes for cinematic depth.
- **Hero:** Stacked canonical `var(--smh-gradient)` energy with brighter stops, deeper top/bottom fades, strengthened lighting tint, and revived wave/particle/sheen presence.
- **Cards:** Smoked glass gradients, richer gradient borders, and paired ambient/float shadows restore Champagne clarity across cards, subcards, FAQs, and links.

## MoodMap & motion tuning
- Warm lift emphasised for **veneers**, **cosmetic**, and **composite** routes; teal-biased depth for **technology**, **implants**, and **orthodontics**; gold sheen heightened for **whitening**; dusk-neutral balance for **general**.
- Motion intensity now scales parallax, wave drift, shimmer, and grain: tech/implant/ortho routes show stronger drift; whitening/cosmetic shimmer more present; anxiety route damped for a calmer state. All animated layers still disable under `prefers-reduced-motion`.

## Screenshots (desktop, hero + cards)
- ![Veneers preview](browser:/invocations/fhlzrnxv/artifacts/artifacts/veneers-preview.png)
- ![Composite bonding preview](browser:/invocations/fhlzrnxv/artifacts/artifacts/composite-preview.png)
- ![Technology preview](browser:/invocations/fhlzrnxv/artifacts/artifacts/technology-preview.png)
- ![Dental implants preview](browser:/invocations/fhlzrnxv/artifacts/artifacts/dental-implants-preview.png)
- ![Whitening preview](browser:/invocations/fhlzrnxv/artifacts/artifacts/whitening-preview.png)
- ![Orthodontics preview](browser:/invocations/fhlzrnxv/artifacts/artifacts/orthodontics-preview.png)

## Files touched
- `styles/preview/champagne-preview.css`
- `reports/Preview_Hero_Overhaul_v1.md`

## Tests
- `node scripts/guard-rogue-hex.mjs` (pass)
- `pnpm brand:guard` (pass)
- `pnpm guard:hero` (pass)
- `node scripts/guard-manifest-sync.mjs` (pass)
- `node scripts/guard-preview-only.mjs` (expected fail in ephemeral env: missing ‘origin/main’)

## Brand safety
- Sacred hero assets and production manifests remain untouched; changes scoped to preview styling only.
