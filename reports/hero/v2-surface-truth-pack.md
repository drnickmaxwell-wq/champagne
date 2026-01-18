# V2 Sacred Hero Surface Truth Pack (HOME)

## Table: surface IDs → source + parameters + assets

> Notes:
> - “Ordering key” refers to position in `surfaceStack` unless a numeric z-index is explicitly defined elsewhere.
> - Mask/clip/overflow/isolation are only listed when explicitly defined in source; otherwise the cell is `UNKNOWN — EVIDENCE NOT PRESENT`.

| surfaceId | source_file + line_range | key params (opacity / blend / z-index or ordering) | asset src / mapping | mask / clip / overflow / isolation | extracted_object |
| --- | --- | --- | --- | --- | --- |
| gradient.base | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L8-L31` | Ordered first in `surfaceStack`; gradient token `var(--smh-gradient)` | `var(--smh-gradient)` | `UNKNOWN — EVIDENCE NOT PRESENT` | `"surfaceStack": [{"id":"gradient.base"...}], "gradients": {"gradient.base": "var(--smh-gradient)"}` |
| field.waveBackdrop | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L8-L27` | Ordered after gradient in `surfaceStack`; blend `soft-light`, opacity `0.24` (desktop/mobile) | Asset ID: `sacred.wave.background.desktop` / `sacred.wave.background.mobile` | `UNKNOWN — EVIDENCE NOT PRESENT` | `"field.waveBackdrop": {"desktop": {"asset": "sacred.wave.background.desktop", "blendMode": "soft-light", "opacity": 0.24}, "mobile": {"asset": "sacred.wave.background.mobile", "blendMode": "soft-light", "opacity": 0.24}}` |
| field.waveRings | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L8-L35` | Ordered after `field.waveBackdrop`; blend `soft-light`, opacity `0.08` | Asset ID: `sacred.wave.overlay.field` | `UNKNOWN — EVIDENCE NOT PRESENT` | `"field.waveRings": {"asset": "sacred.wave.overlay.field", "blendMode": "soft-light", "opacity": 0.08}` |
| mask.waveHeader | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L2-L13` | Ordered after `field.waveRings`; blend `overlay`, opacity `0.4` | Asset ID: `sacred.wave.mask.desktop` (desktop) / `sacred.wave.mask.mobile` (mobile) | `UNKNOWN — EVIDENCE NOT PRESENT` | `"mask.waveHeader": {"asset": "sacred.wave.mask.desktop", "blendMode": "overlay", "opacity": 0.4}` |
| field.dotGrid | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L8-L35` | Ordered after `mask.waveHeader`; blend `soft-light`, opacity `0.05` | Asset ID: `sacred.wave.overlay.dots` | `UNKNOWN — EVIDENCE NOT PRESENT` | `"field.dotGrid": {"asset": "sacred.wave.overlay.dots", "blendMode": "soft-light", "opacity": 0.05}` |
| overlay.particlesDrift | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L8-L71` | Ordered after `overlay.goldDustDrift`; blend `screen`, opacity `0.06` | Asset ID: `sacred.motion.particleDrift` | `UNKNOWN — EVIDENCE NOT PRESENT` | `"overlay.particlesDrift": {"asset": "sacred.motion.particleDrift", "blendMode": "screen", "opacity": 0.06, "className": "hero-surface--particles-drift"}` |
| overlay.particles | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L8-L41` | Ordered after `overlay.particlesDrift`; blend `screen`, opacity `0.08` (via `overlay.particlesPrimary`) | Asset ID: `sacred.particles.home` (from `overlay.particlesPrimary`) | `UNKNOWN — EVIDENCE NOT PRESENT` | `"overlay.particlesPrimary": {"asset": "sacred.particles.home", "blendMode": "screen", "opacity": 0.08}` |
| overlay.filmGrain | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L8-L45` | Ordered after `overlay.particles`; blend `overlay`, opacity `0.07` (desktop/mobile) | Asset ID: `sacred.grain.desktop` / `sacred.grain.mobile` | `UNKNOWN — EVIDENCE NOT PRESENT` | `"overlay.filmGrain.desktop": {"asset": "sacred.grain.desktop", "blendMode": "overlay", "opacity": 0.07}, "overlay.filmGrain.mobile": {"asset": "sacred.grain.mobile", "blendMode": "overlay", "opacity": 0.07}` |
| hero.contentFrame | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L8-L21` | Ordered last in `surfaceStack` | No asset defined | `UNKNOWN — EVIDENCE NOT PRESENT` | `{"id": "hero.contentFrame", "role": "background", "token": "hero.contentFrame", "prmSafe": true}` |
| sacred.motion.waveCaustics | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L47-L53` | Motion overlay `overlay.caustics` uses blend `screen`, opacity `0.14` | Asset ID: `sacred.motion.waveCaustics` (video) | `UNKNOWN — EVIDENCE NOT PRESENT` | `"overlay.caustics": {"asset": "sacred.motion.waveCaustics", "blendMode": "screen", "opacity": 0.14, "className": "hero-surface--caustics"}` |
| sacred.motion.glassShimmer | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L54-L59` | Motion overlay `overlay.glassShimmer` uses blend `soft-light`, opacity `0.13` | Asset ID: `sacred.motion.glassShimmer` (video) | `UNKNOWN — EVIDENCE NOT PRESENT` | `"overlay.glassShimmer": {"asset": "sacred.motion.glassShimmer", "blendMode": "soft-light", "opacity": 0.13, "className": "hero-surface--glass-shimmer"}` |
| sacred.motion.goldDust | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L60-L65` | Motion overlay `overlay.goldDustDrift` uses blend `soft-light`, opacity `0.06` | Asset ID: `sacred.motion.goldDust` (video) | `UNKNOWN — EVIDENCE NOT PRESENT` | `"overlay.goldDustDrift": {"asset": "sacred.motion.goldDust", "blendMode": "soft-light", "opacity": 0.06, "className": "hero-surface--gold-dust"}` |
| sacred.motion.particleDrift | `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:L66-L71` | Motion overlay `overlay.particlesDrift` uses blend `screen`, opacity `0.06` | Asset ID: `sacred.motion.particleDrift` (video) | `UNKNOWN — EVIDENCE NOT PRESENT` | `"overlay.particlesDrift": {"asset": "sacred.motion.particleDrift", "blendMode": "screen", "opacity": 0.06, "className": "hero-surface--particles-drift"}` |

## HOME hero binding (NEXT_PUBLIC_HERO_ENGINE=v2)

- Home page builder sets `heroId` and `heroPreset` to `sacred_home_hero_v1` when `pagePath === "/"`.【F:apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx†L137-L170】
- `getHeroManifest` hardcodes `/` to return `sacred_home_hero_v1`, and merges in the style preset from `manifest.styles.champagne.json` when a hero id is provided.【F:packages/champagne-manifests/src/helpers.ts†L220-L275】
- `manifest.styles.champagne.json` defines the `sacred_home_hero_v1` preset (palette/motion/cta).【F:packages/champagne-manifests/data/manifest.styles.champagne.json†L1-L15】
- When `NEXT_PUBLIC_HERO_ENGINE=v2`, `HeroMount` selects `HeroRendererV2` and renders the V2 surface stack frame.【F:apps/web/app/_components/HeroMount.tsx†L12-L53】
- V2 runtime loads Sacred hero base + surfaces + variants + weather via `loadSacredHeroManifests`, and merges the base/variant surfaces into resolved assets for rendering.【F:packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts†L1-L178】【F:packages/champagne-hero/src/hero-engine/HeroRuntime.ts†L235-L279】

**Conclusion:** HOME in V2 uses the Sacred hero base/variant stack: `sacred_home_hero_v1` preset (styles manifest) layered onto Sacred base + surfaces manifests through the hero runtime pipeline.

## Motion assets (resolved file paths)

Resolved via `HERO_ASSET_REGISTRY` (paths under `/assets/champagne`):

- `sacred.motion.waveCaustics` → `/assets/champagne/motion/wave-caustics.webm`【F:packages/champagne-hero/src/HeroAssetRegistry.ts†L10-L149】
- `sacred.motion.glassShimmer` → `/assets/champagne/motion/glass-shimmer.webm`【F:packages/champagne-hero/src/HeroAssetRegistry.ts†L10-L149】
- `sacred.motion.goldDust` → `/assets/champagne/motion/gold-dust-drift.webm`【F:packages/champagne-hero/src/HeroAssetRegistry.ts†L10-L149】
- `sacred.motion.particleDrift` → `/assets/champagne/motion/particles-drift.webm`【F:packages/champagne-hero/src/HeroAssetRegistry.ts†L10-L149】

**Filesystem confirmation (public assets):**
- `apps/web/public/assets/champagne/motion/wave-caustics.webm`
- `apps/web/public/assets/champagne/motion/glass-shimmer.webm`
- `apps/web/public/assets/champagne/motion/gold-dust-drift.webm`
- `apps/web/public/assets/champagne/motion/particles-drift.webm`

If anything cannot be proven: `UNKNOWN — EVIDENCE NOT PRESENT`.

**Fallback/sentinel note:** Sacred base defaults set `surfaces.video` to `"__OFF__"` (no hero video) in the home base manifest.【F:packages/champagne-manifests/data/hero/sacred_hero_base.json†L21-L30】
