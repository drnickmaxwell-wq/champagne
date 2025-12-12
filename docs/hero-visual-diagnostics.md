# Sacred hero visual diagnostics (home mode)

## Runtime summary for home mode
- `getHeroRuntime({ mode: "home", variantId: "default" })` returns fully populated data: content and layout fields are present, `motion` and `filmGrain` carry numeric tuning values, and `flags.prm` is `false`.
- `surfaces` is fully populated. Keys observed:
  - `gradient`, `waveMask.desktop`, `waveMask.mobile`, `background.desktop`, `background.mobile`, `overlays.field`, `overlays.dots`, `particles`, `grain.desktop`, `grain.mobile`, `video`, and a `surfaceStack` ordering list that includes all of these plus `overlay.caustics`, `overlay.glassShimmer`, `overlay.goldDust`, `overlay.particles`, `overlay.filmGrain`, and `hero.contentFrame`.
  - Motion layer entries in `surfaceStack` are marked with `motion: true`, but `surfaces.motion` itself is empty (only the general `motion` tuning object exists).
- All surface entries already include resolved `path` values to `/public/assets/champagne/**` and non-zero opacities; nothing is empty or placeholder-only.【aefa75†L1-L128】【aefa75†L153-L205】

## Manifest + asset mapping status
Home mode draws from the Sacred manifests:

- Base manifest wires the home defaults to tokens for gradient, wave mask, wave backdrop, overlays, particles, grain, motion, and video.【F:packages/champagne-manifests/data/hero/sacred_hero_base.json†L10-L36】
- Surface manifest maps each token to a concrete asset id (e.g., `mask.waveHeader.desktop` → `sacred.wave.mask.desktop`, `overlay.caustics` → `sacred.motion.waveCaustics`) and defines the full surface stack order.【F:packages/champagne-manifests/data/hero/sacred_hero_surfaces.json†L2-L49】
- All referenced asset ids exist in `HeroAssetRegistry` and point to real files under `/public/assets/champagne/**` (masks, backgrounds, overlays, particles, grain, motion clips, and hero video).【F:packages/champagne-hero/src/HeroAssetRegistry.ts†L10-L155】

| Layer / token | Manifest asset id | Maps to file? | Notes |
| --- | --- | --- | --- |
| gradient.base | CSS gradient | Yes | Uses `var(--smh-gradient)` string, not registry |
| mask.waveHeader.desktop / mobile | sacred.wave.mask.desktop / sacred.wave.mask.mobile | Yes | `.webp` masks present |
| field.waveBackdrop (desktop/mobile) | sacred.wave.background.desktop / sacred.wave.background.mobile | Yes | `.webp` backdrops present |
| field.waveRings | sacred.wave.overlay.field | Yes | `waves/wave-field.svg` |
| field.dotGrid | sacred.wave.overlay.dots | Yes | `waves/wave-dots.svg` |
| overlay.particlesPrimary | sacred.particles.home | Yes | `particles/home-hero-particles.webp` |
| overlay.filmGrain.desktop / mobile | sacred.grain.desktop / sacred.grain.mobile | Yes | Film grain `.webp` files |
| overlay.caustics | sacred.motion.waveCaustics | Yes | `motion/wave-caustics.webm` |
| overlay.glassShimmer | sacred.motion.glassShimmer | Yes | `motion/glass-shimmer.webm` |
| overlay.goldDust | sacred.motion.goldDust | Yes | `motion/gold-dust-drift.webm` |
| overlay.particlesDrift | sacred.motion.particleDrift | Yes | `motion/particles-drift.webm` |
| hero.video | sacred.motion.heroVideo | Yes | `motion/dental-hero-4k.mp4` |

No asset-id mismatches or missing files were found; the runtime is resolving concrete file paths for every token.【aefa75†L1-L128】

## Marketing bridge filtering
Reading the bridge renderer and layer utilities:
- `buildLayerStack` converts the runtime into renderable layers. Filters remove layers only when particles/filmGrain toggles are off, when PRM hides unsafe motion, when a video URL is missing, or when opacity is zero.【F:apps/web/app/_components/HeroRenderer/layerUtils.ts†L169-L230】
- Because `flags.prm` is false and particles/filmGrain are on in home mode, none of these filters actually drop the static surfaces. The only dropped items are motion videos when their URLs are missing (`overlay.caustics`, `overlay.glassShimmer`, `overlay.goldDust`, `overlay.particlesDrift`), since the runtime carries no `surfaces.motion` array with paths.【aefa75†L153-L205】【F:apps/web/app/_components/HeroRenderer/layerUtils.ts†L162-L217】
- Static layers (gradient, wave backdrop/mask, overlays, particles image, grain image) all survive filtering and keep their resolved URLs.

## Hero-debug current behaviour
- `hero-debug` reads the same runtime and layerStack, then renders cards from `layerDiagnostics`, showing background images when `detail.url` exists.【F:apps/web/app/champagne/hero-debug/page.tsx†L135-L199】
- The runtime it receives already includes the full `surfaceStack` with ids/roles/classNames and resolved asset paths (example above).【aefa75†L153-L205】
- Cards appear blank because the upstream renderer (`apps/web/app/components/hero/HeroRenderer.tsx`) does not apply any background image styles for most surface classes (only the wave backdrop has a `background-image` rule). The divs for masks, rings, dots, particles, and grain render but have no CSS pointing them at the URLs stored in `surfaceVars`, so they remain transparent despite having data.【F:apps/web/app/components/hero/HeroRenderer.tsx†L71-L130】【F:apps/web/app/components/hero/HeroRenderer.tsx†L200-L280】

### Sample runtime slice
```json
{
  "surfaces": {
    "gradient": "var(--smh-gradient)",
    "waveMask": {"desktop": {"path": "/assets/champagne/waves/wave-mask-desktop.webp"}},
    "background": {"desktop": {"path": "/assets/champagne/waves/waves-bg-1920.webp"}},
    "overlays": {"dots": {"path": "/assets/champagne/waves/wave-dots.svg"}, "field": {"path": "/assets/champagne/waves/wave-field.svg"}},
    "particles": {"path": "/assets/champagne/particles/home-hero-particles.webp"},
    "grain": {"desktop": {"path": "/assets/champagne/film-grain/film-grain-desktop.webp"}},
    "surfaceStack": [{"id": "gradient.base"}, {"id": "field.waveBackdrop"}, {"id": "mask.waveHeader"}, {"id": "field.waveRings"}, {"id": "field.dotGrid"}, {"id": "overlay.caustics", "motion": true}, {"id": "overlay.glassShimmer", "motion": true}, {"id": "overlay.goldDust", "motion": true}, {"id": "overlay.particles"}, {"id": "overlay.filmGrain"}, {"id": "hero.contentFrame"}]
  }
}
```
(The full dump also includes content, motion tuning, filmGrain settings, and flags.)【aefa75†L1-L205】

## Single clear root-cause statement
Home hero only shows the gradient because the marketing renderer never applies the resolved asset URLs to most surface layers—CSS only assigns a `background-image` to the wave backdrop class, leaving masks, rings, dots, particles, grain, and motion divs transparent even though the runtime supplies valid paths.

### Possible fix strategies (not implemented here)
1. Wire the renderer’s surface classes to the URLs in `surfaceVars` (similar to the wave backdrop rule) or reuse `buildLayerStack` to emit inline `backgroundImage` styles for every static layer.
2. Pipe the motion layer paths into `surfaces.motion` so the video overlays render instead of being dropped for missing URLs.
3. Update `hero-debug` thumbnails to read `surfaceVars` or resolved layer URLs so suppressed/transparent layers visibly confirm their source assets.
