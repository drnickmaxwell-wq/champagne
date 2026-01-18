# V2 Motion Z-Index Fix Report

## Scope
- Target: V2 hero motion layer defaults for `sacred.motion.particleDrift` and `sacred.motion.goldDust`.
- Files touched: `apps/web/app/components/hero/v2/HeroRendererV2.tsx`, `reports/hero/v2-motion-zindex-fix-report.md`.

## Evidence — Mapping Before/After

### Before (default mapping)
```
apps/web/app/components/hero/v2/HeroRendererV2.tsx (pre-change)
120  const defaultZFor = (id: string) => {
121    const defaults = new Map<string, number>([
122      ["gradient.base", 1],
123      ["field.waveBackdrop", 2],
124      ["mask.waveHeader", 3],
125      ["field.waveRings", 4],
126      ["field.dotGrid", 5],
127      ["sacred.motion.waveCaustics", 6],
128      ["sacred.motion.glassShimmer", 7],
129      ["overlay.sacredBloom", 8],
130      ["overlay.particles", 9],
131      ["overlay.filmGrain", 10],
132      ["hero.contentFrame", 9],
133    ]);
134    return defaults.get(id) ?? 100;
135  };
```

### After (explicit motion defaults + duplicate guard)
```
apps/web/app/components/hero/v2/HeroRendererV2.tsx
120  const defaultZFor = (id: string) => {
121    const defaults = new Map<string, number>([
122      ["gradient.base", 1],
123      ["field.waveBackdrop", 2],
124      ["mask.waveHeader", 3],
125      ["field.waveRings", 4],
126      ["field.dotGrid", 5],
127      ["sacred.motion.waveCaustics", 6],
128      ["sacred.motion.glassShimmer", 7],
129      ["sacred.motion.particleDrift", 8],
130      ["sacred.motion.goldDust", 9],
131      ["overlay.sacredBloom", 8],
132      ["overlay.particles", 9],
133      ["overlay.filmGrain", 10],
134      ["hero.contentFrame", 9],
135    ]);
136    return defaults.get(id) ?? 100;
137  };
```

```
apps/web/app/components/hero/v2/HeroRendererV2.tsx
900  const allowDuplicate = id === "sacred.motion.particleDrift" || id === "sacred.motion.goldDust";
901  if (!allowDuplicate) {
902    while (usedZIndexes.has(resolved)) {
903      resolved += 1;
904    }
905  }
906  usedZIndexes.add(resolved);
907  return resolved;
```

## Evidence — Runtime Console Capture (heroTruth)

Captured from `http://localhost:3000/champagne/hero-debug?heroTruth=1` after settle (heroTruth logs after a 1500ms timeout):

```
HERO_V2_TRUTH_SURFACES
…
{ "id": "sacred.motion.particleDrift", "zIndex": "8", ... }
{ "id": "sacred.motion.goldDust", "zIndex": "9", ... }
…
HERO_V2_TRUTH_CONTENT
{ "exists": true, "zIndex": "50", ... }
```

Full console payload excerpt:
```
[
  {
    "text": "HERO_V2_TRUTH_SURFACES [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object]",
    "args": [
      "HERO_V2_TRUTH_SURFACES",
      [
        ...
        {
          "id": "sacred.motion.particleDrift",
          "zIndex": "8",
          "isVideo": true
        },
        {
          "id": "sacred.motion.goldDust",
          "zIndex": "9",
          "isVideo": true
        }
      ]
    ]
  },
  {
    "text": "HERO_V2_TRUTH_CONTENT {exists: true, zIndex: 50, opacity: 1, transform: matrix(1, 0, 0, 1, 0, 0), filter: none}",
    "args": [
      "HERO_V2_TRUTH_CONTENT",
      {
        "exists": true,
        "zIndex": "50",
        "opacity": "1"
      }
    ]
  }
]
```

## Rollback

```
git restore apps/web/app/components/hero/v2/HeroRendererV2.tsx
git restore reports/hero/v2-motion-zindex-fix-report.md
```
