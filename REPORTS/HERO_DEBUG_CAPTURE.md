# Hero Debug Capture (Content Resolution)

## Resolved content fields

The hero debug view should show the runtime content fields populated from the sacred base manifest:

- `headline`: "Advanced cosmetic dentistry crafted with calm precision."
- `subheadline`: "Digital workflows, gentle clinicians, and beautifully layered studio light for confident smiles."
- `cta.href`: `/contact`
- `secondaryCta.href`: `/treatments`

These values come from the base manifest that `HeroManifestAdapter` loads and that `HeroRuntime` merges into the runtime `content` object consumed by the hero renderers.【F:packages/champagne-manifests/data/hero/sacred_hero_base.json†L1-L19】【F:packages/champagne-hero/src/hero-engine/HeroManifestAdapter.ts†L1-L92】【F:packages/champagne-hero/src/hero-engine/HeroRuntime.ts†L96-L114】

## Renderer parity

Both V1 and V2 hero renderers use the shared runtime `content` fields and render the legacy `.hero-content` block with the same headline/subheadline/CTA structure, ensuring parity across hero engines.【F:apps/web/app/components/hero/HeroRenderer.tsx†L1102-L1264】【F:apps/web/app/components/hero/v2/HeroRendererV2.tsx†L430-L513】
