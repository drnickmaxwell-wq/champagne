# Homepage Champagne v2 Polish Report

## Sections polished
- Clinic tour band: Elevated glass band with dusk overlay, deeper padding, and motion-aware placeholder frame.
- Most requested treatments: Four-up responsive glass rail with gradient keylines and Playfair headings.
- Technology highlight: Teal-edged glass blocks with refreshed CTA pills and tighter list rhythm.
- Patient stories teaser: Trio of portrait tiles with shimmer lift, placeholder frames, and display-type headings.
- AI Smile Quiz teaser: Gold-touched glass band with benefit bullets and primary gradient CTA.
- Patient portal teaser: Cooler teal-accented glass card with ghost CTA and compact spacing.
- Local proof & map: Split trust band with rating chip and glass map placeholder frame.
- Micro-FAQ rail: Compact glass pills with crisp summaries and focusable disclosure states.

## Design notes
- Established a unified dusk-to-ink canvas via `champagne-preview` background overlays and consistent SectionShell spacing.
- Glass treatments now use gradient keylines from Champagne tokens, softened dual shadows, and film-grain overlays.
- CTA styling consolidated into pill primitives (primary gradient + ghost) with clear focus rings.
- Section rhythm standardized to shared padding, max-width, and display-type headings, keeping hero untouched.

## Accessibility & motion
- All CTAs and cards include visible focus states; FAQ disclosures remain keyboard operable.
- Text contrast on glass surfaces tuned with ink-forward mixes to maintain AA legibility.
- Hover lifts capped and disabled under `prefers-reduced-motion`; ambient gradients reduce when motion is reduced.

## Test outcomes
- `pnpm test` — pass.
- `pnpm brand:guard` — pass.
- `node scripts/guard-rogue-hex.mjs` — pass.
- `node scripts/guard-preview-only.mjs` — failed (missing `origin/main` in environment).
- `node scripts/guard-manifest-sync.mjs` — pass.
- `node scripts/guard-asset-size.mjs` — failed (missing `origin/main` in environment).

## Limitations / TODOs
- Clinic tour and map remain placeholders until final media is ready.
- Asset-size and preview-only guards require a valid `origin/main` reference in CI to re-run successfully.
