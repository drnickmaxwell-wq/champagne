# Homepage Champagne v1 Report

## Sections implemented
- Sacred hero: updated headline, calm subheading, and CTA pairing (Book a consultation / Take the AI Smile Quiz).
- Clinic tour band: glass-framed video placeholder with wave/grain overlays, reduced-motion friendly.
- Most requested treatments rail: veneers, implants, orthodontics, whitening cards linking to treatment hubs.
- Technology highlight: bullet-led overview of digital/3D capabilities with CTAs.
- Patient stories teaser: three-story grid with CTA to /patient-stories.
- AI Smile Quiz teaser: benefit list and CTA to /ai-smile-quiz.
- Patient portal teaser: glass band linking to /portal.
- Local proof & map placeholder: Shoreham-by-Sea mention, review score callout, map reserve, LocalBusiness schema.
- Micro-FAQ rail: four zero-click-friendly FAQs with FAQPage JSON-LD.

## Limitations / TODOs
- Clinic tour uses a placeholder; replace `practiceTourVideoSrc` with the final practice tour asset when available.
- Existing lint issues remain outside homepage scope (e.g., legacy require() imports, unused vars). See lint output below.

## Hybrid Canvas Fix Notes
- `home-champagne.css` applied a full-page champagne gradient and forced white typography through `.champagne-preview` selectors targeting `main`, `section`, `div`, and `article`, which allowed the dusk bands to bleed across the entire layout and flatten the glass cards.
- Without a dedicated preview wrapper, the background overlays sat directly on `body/main`, creating rainbow bands down the viewport and erasing section spacing intended for glass rails.
- Introduced a `.preview-home-canvas` root with zone wrappers to contain the gradients, re-center the clinic tour glass card, and keep treatment/story/FAQ rails separated from production styling.

## Time-of-Day Ready Variables
- Defined `--smh-home-zone1-default`, `--smh-home-zone2-default`, and `--smh-home-zone3-default` alongside `--home-zone1-bg`, `--home-zone2-bg`, and `--home-zone3-bg` on `.preview-home-canvas` so a future controller can swap canvases without touching markup.

## Before vs After
- Before: rainbow gradients ran full-width with flattened glass cards and buttons inheriting washed-out text.
- After: light → dusk → light canvas zones frame the hero, treatments/tech/stories, and local proof/FAQ with restored glass spacing and legible CTAs.

## Test outcomes
- `pnpm test` — passed (brand manifest + preview smoke).
- `pnpm brand:guard` — passed.
- `node scripts/guard-rogue-hex.mjs` — passed.
- `node scripts/guard-preview-only.mjs` — blocked (repository has no `origin/main`, so merge-base lookup fails in container).
- `node scripts/guard-manifest-sync.mjs` — passed.

## Crash Fix Summary
- Root cause: `MicroFaq` passed a `data` prop to `FAQJsonLd`, but `FAQJsonLd` expects an `items` array and immediately maps over it, causing a client-side exception on `/preview/home`.
- Files touched: `components/sections/home/MicroFaq.tsx`, `tests/preview/homepage.test.tsx`, `package.json`, `reports/Homepage_Champagne_Debug.md` (diagnostic notes).
- Fallbacks: none required; wiring corrected to hand the FAQ list directly to the JSON-LD helper.
- Status: `/preview/home` now renders without client-side exceptions on this branch.
