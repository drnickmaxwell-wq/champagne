# Phase 1 — Mask-Only Proof (Sacred Hero V2)

## COMMANDS RUN
- `rg "waveBackgrounds" -n`
- `rg "surfaces\.background" -n`
- `nl -ba packages/champagne-hero/src/hero-engine/HeroRuntime.ts | sed -n '80,160p'`
- `nl -ba packages/champagne-hero/src/hero-engine/HeroRuntime.ts | sed -n '220,300p'`
- `nl -ba packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts | sed -n '1,80p'`
- `nl -ba packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts | sed -n '120,220p'`
- `nl -ba packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts | sed -n '320,420p'`
- `nl -ba packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts | sed -n '420,470p'`
- `nl -ba packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts | sed -n '440,520p'`
- `nl -ba packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts | sed -n '50,100p'`
- `nl -ba packages/champagne-hero/src/hero-engine/HeroConfig.ts | sed -n '80,170p'`
- `nl -ba packages/champagne-manifests/data/hero/sacred_hero_base.json | sed -n '1,120p'`
- `nl -ba packages/champagne-manifests/data/hero/sacred_hero_surfaces.json | sed -n '1,120p'`
- `rg "__OFF__" -n packages/champagne-hero apps/web/app/components/hero`
- `nl -ba packages/champagne-hero/src/HeroAssetRegistry.ts | sed -n '1,200p'`
- `rg "SURFACE_TOKEN_CLASS_MAP|hero-surface--wave-backdrop" -n packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts`
- `rg -n -e "--hero-wave-background" apps/web`
- `nl -ba apps/web/app/components/hero/HeroRenderer.tsx | sed -n '150,360p'`
- `nl -ba apps/web/app/components/hero/HeroRenderer.tsx | sed -n '340,520p'`
- `nl -ba apps/web/app/components/hero/HeroRenderer.tsx | sed -n '900,1045p'`
- `nl -ba apps/web/app/components/hero/HeroRenderer.tsx | sed -n '1120,1205p'`

## RESOLUTION_CHAIN
### 1) Base manifest surfaces.background is defined in sacred_hero_base.json
```
21     "surfaces": {
22       "gradient": "gradient.base",
23       "waveMask": { "desktop": "mask.waveHeader", "mobile": "mask.waveHeader.mobile" },
24       "background": { "desktop": "field.waveBackdrop", "mobile": "field.waveBackdrop" },
25       "overlays": { "dots": "field.dotGrid", "field": "field.waveRings" },
```
Source: `packages/champagne-manifests/data/hero/sacred_hero_base.json`.

### 2) Manifest adapter normalizes defaults (no special handling for background)
```
62 function normalizeSurfaceTokens(
63   surfaces?: HeroSurfaceTokenConfig,
64   motionAllowlist?: string[],
65 ): HeroSurfaceTokenConfig | undefined {
66   if (!surfaces) return undefined;
67   const normalizedMotion = Array.isArray(surfaces.motion)
68     ? motionAllowlist
69       ? surfaces.motion.filter((entry) => typeof entry === "string" && motionAllowlist.includes(entry))
70       : surfaces.motion
71     : undefined;
72   const video = surfaces.video === "__OFF__" ? undefined : surfaces.video;
73   return {
74     ...surfaces,
75     motion: normalizedMotion,
76     video,
77   };
78 }
```
Source: `packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts`.

### 3) Runtime merges base defaults and maps tokens to assets
```
252   const mergedSurfaceTokens = mergeSurfaceConfig(
253     manifests.base.defaultSurfaces,
254     weatherConfig?.surfaces,
255     selectedVariant?.surfaces,
256   );

258   const assetIds = mapSurfaceTokensToAssets(mergedSurfaceTokens, manifests.surfaces, { prm: prmFlag });
259   const resolvedSurfaces = filterSurfacesByAllowlist(
260     resolveHeroSurfaceAssets(applyPrm(assetIds, prmFlag)),
261     selectedVariant?.allowedSurfaces,
262   );
```
Source: `packages/champagne-hero/src/hero-engine/HeroRuntime.ts`.

### 4) Surface map resolves `background` token via waveBackgrounds
```
347     background: (() => {
348       const backgroundToken = surfaceTokens.background?.desktop ?? surfaceTokens.background?.mobile;
349       const backgroundDefinition =
350         typeof backgroundToken === "string" ? surfaceMap.waveBackgrounds?.[backgroundToken] : undefined;
351       const fallbackBackground = surfaceMap.waveBackgrounds?.primary;
352       const desktopRef = surfaceTokens.background?.desktop;
353       const mobileRef = surfaceTokens.background?.mobile;
354       return {
355         desktop:
356           definitionToLayer(backgroundDefinition?.desktop, backgroundToken as string)
357             ?? (typeof desktopRef === "string"
358               ? definitionToLayer(surfaceMap.waveBackgrounds?.[desktopRef]?.desktop, desktopRef)
359               : definitionToLayer(normalizeLayer(desktopRef)))
360             ?? (typeof mobileRef === "string"
361               ? definitionToLayer(surfaceMap.waveBackgrounds?.[mobileRef]?.desktop, mobileRef)
362               : undefined)
363             ?? definitionToLayer(fallbackBackground?.desktop),
364         mobile:
365           definitionToLayer(backgroundDefinition?.mobile, backgroundToken as string)
366             ?? (typeof mobileRef === "string"
367               ? definitionToLayer(surfaceMap.waveBackgrounds?.[mobileRef]?.mobile, mobileRef)
368               : definitionToLayer(normalizeLayer(mobileRef)))
369             ?? definitionToLayer(backgroundDefinition?.desktop, backgroundToken as string)
370             ?? definitionToLayer(fallbackBackground?.mobile)
371             ?? definitionToLayer(fallbackBackground?.desktop),
372       };
373     })(),
```
Source: `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts`.

### 5) Surface stack includes `field.waveBackdrop` whenever waveBackgrounds exist
```
426   if (tokens.gradient || surfaceMap.gradients) includedTokens.add("gradient.base");
427   if (tokens.background || surfaceMap.waveBackgrounds) includedTokens.add("field.waveBackdrop");
```
Source: `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts`.

### 6) `field.waveBackdrop` maps to a CSS class that paints the background image
```
34 const SURFACE_TOKEN_CLASS_MAP: Record<string, string> = {
35   "gradient.base": "hero-surface-layer hero-surface--gradient-field",
36   "mask.waveHeader": "hero-surface-layer hero-surface--wave-mask",
37   "field.waveBackdrop": "hero-surface-layer hero-surface--wave-backdrop",
```
Source: `packages/champagne-hero/src/hero-engine/HeroSurfaceMap.ts`.

### 7) HeroRenderer uses `surfaces.background` to set CSS vars and layer styles
```
174   const waveBackdropOpacity = surfaces.background?.desktop?.opacity;
175   const waveBackdropBlend = surfaces.background?.desktop?.blendMode as CSSProperties["mixBlendMode"];
...
284   ["--hero-wave-background-desktop" as string]: surfaces.background?.desktop?.path
285     ? `url("${surfaces.background.desktop.path}")`
286     : surfaces.background?.desktop?.asset?.id
287       ? `url("${ensureHeroAssetPath(surfaces.background.desktop.asset.id)}")`
288       : surfaces.background?.desktop?.id
289         ? `url("${ensureHeroAssetPath(surfaces.background.desktop.id)}")`
290         : undefined,
...
350   "field.waveBackdrop": (() => {
351     const style: CSSProperties = { zIndex: 2 };
352     let missingForLayer = false;
353 
354     const tunedBlend = applyBlendTuning(waveBackdropBlend);
355     if (tunedBlend) {
356       style.mixBlendMode = tunedBlend;
357     } else {
358       noteMissing("field.waveBackdrop", "blend", "surface");
359       missingForLayer = true;
360     }
361 
362     if (waveBackdropOpacity !== undefined) {
363       const tunedOpacity = applyOpacityTuning("field.waveBackdrop", waveBackdropOpacity, tunedBlend);
364       style.opacity = missingForLayer ? 0 : tunedOpacity;
365     } else {
366       style.opacity = 0;
367       noteMissing("field.waveBackdrop", "opacity", "surface");
368       missingForLayer = true;
369     }
370 
371     return style;
372   })(),
```
Source: `apps/web/app/components/hero/HeroRenderer.tsx`.

### 8) The DOM element for background is created by surface stack rendering
```
1151   <div
1152     aria-hidden
1153     className="hero-surface-stack"
1154     ref={surfaceRef}
1155     data-prm={prmEnabled ? "true" : "false"}
1156     style={surfaceVars}
1157   >
1158     {surfaceStack.map((layer) => {
1159       const inlineStyle = surfaceInlineStyles.get(layer.id);
1160 
1161       return (
1162         <div
1163           key={layer.id}
1164           data-surface-id={layer.id}
1165           data-surface-role={layer.role}
1166           data-prm-safe={layer.prmSafe ? "true" : undefined}
1167           className={layer.className ?? "hero-surface-layer"}
1168           style={inlineStyle}
1169         />
1170       );
1171     })}
```
Source: `apps/web/app/components/hero/HeroRenderer.tsx`.

### 9) CSS uses the background image variables for the wave backdrop class
```
972   .hero-renderer .hero-surface-layer.hero-surface--wave-backdrop {
973     background-image: var(--hero-wave-background-desktop);
974     background-size: cover;
975     background-position: center;
976   }
...
1031  @media (max-width: 640px) {
1032    .hero-renderer .hero-surface-layer.hero-surface--wave-backdrop {
1033      background-image: var(--hero-wave-background-mobile);
1034    }
1035  }
```
Source: `apps/web/app/components/hero/HeroRenderer.tsx`.

## SUPPORTED_NONE_OPTIONS (A–E)
**Key behaviors:**
- Background tokens are optional in the type shape, so omission is schema-aligned. (`HeroSurfaceTokenConfig.background?`).
- `__OFF__` is handled only for `video`, not for background.
- Missing assets resolve to `undefined` without throwing.

### A) background omitted entirely from surfaces
**Supported without throw.**
- `HeroSurfaceTokenConfig.background` is optional. No normalization is required, so omitting it is schema-safe. (Type optional.)
- When omitted, `mapSurfaceTokensToAssets` finds no background token and returns `desktop/mobile` as `undefined` (no fallback unless `waveBackgrounds.primary` exists). Background layer remains in the surface stack because `surfaceMap.waveBackgrounds` exists, but opacity is forced to 0 due to missing blend/opacity. No throw paths exist.
Evidence:
- Optional background in config type. (`HeroSurfaceTokenConfig.background?`).
- Background token resolution uses optional chaining and fallback; if absent, nothing resolves. (See `mapSurfaceTokensToAssets`.)
- Layer inclusion is unconditional when `waveBackgrounds` exists. (See `mapSurfaceStack`.)
- Renderer sets opacity 0 and logs missing blend/opacity, no throw. (See `HeroRenderer` layerStyles.)

### B) background set to null
**Functionally tolerated, but not schema-safe.**
- Runtime uses optional chaining (`surfaceTokens.background?.desktop`), so `null` yields `undefined` and behaves like omission. No throw.
- Not schema-aligned because `background` expects an object (or undefined), not `null`.
Evidence:
- Optional chaining in `mapSurfaceTokensToAssets` prevents null deref.
- No special validation for `background` in `normalizeSurfaceTokens`.

### C) background set to "__OFF__"
**Not supported as a special case.**
- `__OFF__` is only checked for `video`. Background has no special handling.
- A string "__OFF__" does not match the expected background object shape and is not schema-safe. It will be ignored by optional chaining and treated similarly to omission, but it is not an explicit supported flag.
Evidence:
- `__OFF__` check is only for `surfaces.video`. (`normalizeSurfaceTokens`.)
- Background type expects object, not string.

### D) background token points to a waveBackground entry with opacity 0 and a real asset
**Supported, but it will still load the asset and render a layer (opacity 0).**
- If waveBackground definition includes `opacity: 0`, renderer applies opacity 0 and keeps blend mode. Background image is still defined and likely fetched.
Evidence:
- `waveBackdropOpacity` uses `surfaces.background?.desktop?.opacity` and is applied in `layerStyles`.
- Background image variables are set when a resolved asset/path exists.

### E) background token points to a waveBackground entry with missing asset (asset undefined / null / empty string)
**Supported without throw, but schema-unsafe for assets.**
- Asset lookup uses `resolveHeroAsset`, which returns `undefined` for unknown ids. `resolveLayer` falls back without throwing.
- Background image CSS var remains undefined, so no visual background image is applied.
Evidence:
- `resolveHeroAsset` returns `undefined` for missing ids.
- `resolveLayer` returns the layer even when asset resolution fails.
- Background image CSS var is only set when `path`/`asset.id`/`id` resolves.

## RECOMMENDED_IMPLEMENTATION
**Choose A) omit `background` entirely from `defaults.surfaces` for Sacred Hero V2 when mask-only is required.**

Justification (code-backed):
- **Schema-safe**: `background` is an optional field; omission is valid per `HeroSurfaceTokenConfig`. (No null/string coercion.)
- **No runtime errors**: token resolution uses optional chaining and safe fallbacks; no throws on missing background. (See `mapSurfaceTokensToAssets`.)
- **No visual background**: with no background asset, the wave backdrop layer’s opacity is forced to 0 and the CSS var resolves to `undefined`, so nothing paints. (See `HeroRenderer` layerStyles + CSS var usage.)
- **No special sentinel needed**: `__OFF__` is only supported for `video`; background has no special sentinel handling.

## STOP POINT
No changes made.
