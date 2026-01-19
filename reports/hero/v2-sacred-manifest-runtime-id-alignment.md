# Sacred Hero Manifest Runtime ID Alignment (V2)

## Scope
Align manifest keys to the runtime `data-surface-id` values so opacity tuning applies to the surfaces rendered on the homepage. Changes are aliases only (no asset, blend, or opacity changes).

## Runtime ID Mapping Table (Before)
| Runtime surface id | Manifest location | Controlling key | Status |
| --- | --- | --- | --- |
| overlay.particles | particles | particles.overlay.particlesPrimary | MISSING (no `overlay.particles` key) |
| overlay.filmGrain | grain | grain.overlay.filmGrain.desktop / grain.overlay.filmGrain.mobile | MISSING (no `overlay.filmGrain` key) |
| field.waveRings | overlays | overlays.field.waveRings | OK |
| field.dotGrid | overlays | overlays.field.dotGrid | OK |
| mask.waveHeader | waveMasks | waveMasks.mask.waveHeader | OK |
| gradient.base | gradients | gradients.gradient.base | OK |
| sacred.motion.waveCaustics | motion | motion.overlay.caustics | MISSING (no `sacred.motion.waveCaustics` key) |
| sacred.motion.glassShimmer | motion | motion.overlay.glassShimmer | MISSING (no `sacred.motion.glassShimmer` key) |
| sacred.motion.particleDrift | motion | motion.overlay.particlesDrift | MISSING (no `sacred.motion.particleDrift` key) |
| sacred.motion.goldDust | motion | motion.overlay.goldDustDrift | MISSING (no `sacred.motion.goldDust` key) |

## Runtime ID Mapping Table (After)
| Runtime surface id | Manifest location | Controlling key | Status |
| --- | --- | --- | --- |
| overlay.particles | particles | particles.overlay.particles | OK (alias to primary particles) |
| overlay.filmGrain | grain | grain.overlay.filmGrain | OK (wrapper with desktop/mobile) |
| field.waveRings | overlays | overlays.field.waveRings | OK |
| field.dotGrid | overlays | overlays.field.dotGrid | OK |
| mask.waveHeader | waveMasks | waveMasks.mask.waveHeader | OK |
| gradient.base | gradients | gradients.gradient.base | OK |
| sacred.motion.waveCaustics | motion | motion.sacred.motion.waveCaustics | OK (alias) |
| sacred.motion.glassShimmer | motion | motion.sacred.motion.glassShimmer | OK (alias) |
| sacred.motion.particleDrift | motion | motion.sacred.motion.particleDrift | OK (alias) |
| sacred.motion.goldDust | motion | motion.sacred.motion.goldDust | OK (alias) |

## Diff Excerpt (Changed Lines Only)
```diff
+    "overlay.particles": { "asset": "sacred.particles.home", "blendMode": "screen", "opacity": 0.17 },
+    "overlay.filmGrain.mobile": { "asset": "sacred.grain.mobile", "blendMode": "overlay", "opacity": 0.08, "prmSafe": true },
+    "overlay.filmGrain": {
+      "desktop": { "asset": "sacred.grain.desktop", "blendMode": "overlay", "opacity": 0.08, "prmSafe": true },
+      "mobile": { "asset": "sacred.grain.mobile", "blendMode": "overlay", "opacity": 0.08, "prmSafe": true }
+    }
+    "sacred.motion.waveCaustics": {
+      "asset": "sacred.motion.waveCaustics",
+      "blendMode": "screen",
+      "opacity": 0.21,
+      "className": "hero-surface--caustics"
+    },
+    "sacred.motion.glassShimmer": {
+      "asset": "sacred.motion.glassShimmer",
+      "blendMode": "soft-light",
+      "opacity": 0.19,
+      "className": "hero-surface--glass-shimmer"
+    },
+    "sacred.motion.goldDust": {
+      "asset": "sacred.motion.goldDust",
+      "blendMode": "soft-light",
+      "opacity": 0.15,
+      "className": "hero-surface--gold-dust"
+    },
+    "sacred.motion.particleDrift": {
+      "asset": "sacred.motion.particleDrift",
+      "blendMode": "screen",
+      "opacity": 0.10,
+      "className": "hero-surface--particles-drift"
+    },
```

## Why Tuning Previously Appeared To Do Nothing
Runtime surfaces were keyed by IDs like `overlay.particles`, `overlay.filmGrain`, and `sacred.motion.*`, but the manifest only defined the `particlesPrimary` and `overlay.*` motion/grain entries. That mismatch meant runtime IDs had no direct configuration key to resolve, so opacity edits to the existing manifest keys would not apply to the rendered surfaces. The aliases added here align runtime IDs to the same underlying asset/blend/opacity settings without changing the look.

## Command Logs Summary
See terminal logs in the execution transcript for:
- pnpm --filter web build
- pnpm run guard:hero
- pnpm run guard:canon
- pnpm run verify

## Rollback
```bash
git revert HEAD
```
