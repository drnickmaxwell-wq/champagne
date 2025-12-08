# Preview Canvas UX v1

## Summary of visual changes
- Added a dusk-to-ink canvas gradient with Champagne magenta→teal highlights so preview pages sit in the same room as the home hero.
- Refreshed preview cards and section shells with smoked-glass fills, warmer/teal ambient shadows, and a featured gradient keyline on the first section below the hero.
- Enhanced preview hub tiles with a glass console treatment, deeper hover lift, and subtle tonal glow.

## Before vs After
### Canvas background
- **Before:** Plain white canvas under the hero, minimal ambient depth.
- **After:** Layered dusk-to-ink gradient with light magenta/teal uplighting and soft vignette to keep text readable while linking to the hero energy.

### Section cards
- **Before:** White paper-like cards with thin shadows and uniform gradient borders.
- **After:** Smoked-pearl glass fills, softened ambient + float shadows, inset gleam, and a hero-adjacent gradient keyline on the first section for continuity.

### Preview hub tiles
- **Before:** Flat white tiles with light shadow and small hover shift.
- **After:** Glass console tiles with tinted shadows, gentle brand-tinted overlays, and stronger hover elevation with a faint gradient outline.

## Known limitations / remaining deltas
- Hero glass spacing remains unchanged; minor radius differences may persist between hero glass and deeper cards on small screens.
- The preview canvas uses subtle lighting only; it does not yet include motion or particle accents like the home hero.

## Test results
- `node scripts/guard-rogue-hex.mjs`
- `pnpm brand:guard`
- `pnpm guard:hero`
- `node scripts/guard-manifest-sync.mjs`
- `node scripts/guard-preview-only.mjs` *(fails in this environment because `origin/main` is not available).* 
