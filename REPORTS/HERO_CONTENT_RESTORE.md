# Hero Content Restore Evidence

## Content object passed into HeroRenderer

- `HeroRenderer` pulls `content` directly from `getHeroRuntime` and renders the legacy `.hero-content` block using `content.eyebrow`, `content.headline`, `content.subheadline`, `content.cta`, and `content.secondaryCta`.【F:apps/web/app/components/hero/HeroRenderer.tsx†L1102-L1264】
- `HeroRuntime` merges `base.content` with any `variant.content` using `mergeContent`, preserving the base CTA fields when variants omit them.【F:packages/champagne-hero/src/hero-engine/HeroRuntime.ts†L96-L114】
- The base manifest content is sourced from `sacred_hero_base.json` via `HeroManifestAdapter`, so the base headline/subheadline/CTAs flow into the runtime merge.【F:packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts†L1-L92】

## Source confirmation (base vs variant)

- `HeroRuntime` calls `mergeContent(base.content, variant.content)`; if no variant overrides are provided, the base manifest (from `sacred_hero_base.json`) is the source of truth for the hero copy and CTA labels/hrefs.【F:packages/champagne-hero/src/hero-engine/HeroRuntime.ts†L96-L114】

## Field presence confirmation

- The runtime `content` object includes `headline`, `subheadline`, `cta`, and `secondaryCta` keys from `sacred_hero_base.json`, which the renderer consumes directly without re-mapping.【F:packages/champagne-manifests/data/hero/sacred_hero_base.json†L1-L19】【F:apps/web/app/components/hero/HeroRenderer.tsx†L1102-L1264】
