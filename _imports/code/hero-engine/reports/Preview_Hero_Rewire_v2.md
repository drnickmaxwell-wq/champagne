# Preview Hero Rewire v2

## Canonical references
- Sacred manifest JSON: `styles/champagne/manifest.json`
- Sacred hero component: `components/home/ChampagneHero.tsx`
- Sacred hero styles: `styles/champagne/hero.css`
- Preview surface + routing updated: `styles/preview/champagne-preview.css`, `components/preview/PreviewHero.tsx`, `app/preview/treatments/**/*`

## What changed
- Preview pages now render the canonical `ChampagneHero` via a new `PreviewHero` wrapper, hiding the home content and injecting preview-specific titles, body copy, and CTAs without altering the sacred overlay stack.
- Cleared preview-only gradients/vignettes that were tinting the canvas and lightened the page backdrop so the sacred magenta→teal→gold gradient shows at full saturation.
- Raised hero and card surfaces to paper-pearl glass with ink text; MoodMap now only tints borders/shadows instead of recoloring the hero or card fills.

## Remaining deltas vs home hero
- Preview hero height follows the ChampagneHero defaults; minor layout differences may appear on narrow mobile due to page padding.

## Tests
- `node scripts/guard-rogue-hex.mjs` — pass
- `pnpm brand:guard` — pass
- `pnpm guard:hero` — pass
- `node scripts/guard-manifest-sync.mjs` — pass
- `node scripts/guard-preview-only.mjs` — fails in this environment (missing `origin/main` remote)
