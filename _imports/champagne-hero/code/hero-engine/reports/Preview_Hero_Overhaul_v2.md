# Preview Hero Overhaul v2

## Updates
- Softened dusk canvas mixing to keep Champagne ink depth but lift overall lightness; reduced vignette overlays so warm/teal/gold veils read without fogging the page.
- Restored the canonical magenta → teal → gold hero gradient with higher saturation and lighter edge vignettes so the body stays jewel-toned while retaining dusk framing.
- Raised card/FAQ/link glass fills toward pearl-white with clearer ink text, leaving mood influence to borders, shadows, and soft glows rather than tinting whole surfaces.
- Rebalanced MoodMap: background depth lowered per route while warm/teal/gold lifts continue to steer borders/shadows; motion tints remain but no longer wash the canvas.
- Treatment highlights: implants/technology now cooler but brighter; veneers/cosmetic/composite keep warm dusk with gold sheen; whitening lifts further with gentle gold; general stays neutral dusk.

## Tests
- `node scripts/guard-rogue-hex.mjs`
- `pnpm brand:guard`
- `pnpm guard:hero`
- `node scripts/guard-manifest-sync.mjs`
- `node scripts/guard-preview-only.mjs` *(fails in this ephemeral env because `origin/main` is unavailable)*
