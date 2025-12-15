# Sacred Hero Surface Truth Diff

## Sources
- Manifest: `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json`
- Resolved runtime: `HeroRenderer` resolved surfaces before render
- DOM truth: computed values reported via `?heroDebug=1`

## Alignment
| Surface id | Manifest opacity | Resolved opacity | DOM opacity | Note |
| --- | --- | --- | --- | --- |
| field.waveBackdrop | 0.35 | 0.35 | 0.35 | lowered from 0.7 manifest value that was bleaching the base |
| field.waveRings | 0.45 | 0.45 | 0.45 | lowered from 0.6 to match canonical stack guidance |
| field.dotGrid | 0.45 | 0.45 | 0.45 | lowered from 0.6 to keep gradient dominant |
| overlay.caustics | 0.35 | 0.35 | 0.35 | reduced from 0.45; follows canon limits |
| overlay.glassShimmer | 0.4 | 0.4 | 0.4 | reduced from 0.85 (source of screen wash) |
| overlay.goldDust | 0.45 | 0.45 | 0.45 | reduced from 0.7 to prevent over-brightening |
| overlay.particles | 0.15 | 0.15 | 0.15 | reduced from 0.45 to keep particles subtle |
| overlay.filmGrain | 0.12 | 0.12 | 0.12 | reduced from 0.35 to avoid haze |

All remaining surfaces inherit manifest blend modes. Motion videos retain screen blend but no longer override opacity via inline styles.

## Root cause
The milky wash originated in the sacred manifest values (screen layers at 0.7–0.85) which propagated unchanged through the runtime and renderer. There were no renderer overrides; the manifest itself was off-canon. The manifest now matches canonical surface weights, and the runtime/DOM values align one-to-one via `CHAMPAGNE_HERO_RESOLVE_VS_INLINE_JSON`.
