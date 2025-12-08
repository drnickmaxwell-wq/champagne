# Champagne Manifest Inventory

## Treatment/hero manifests
- `public/assets/champagne/manifest.json` — Champagne Hero asset manifest covering tokens (colors/gradients/typography/radii/shadows), layered stack, parallax/motion, accessibility, responsive targets, and asset list. Mirrors the doc copy under `docs/Brand_Canon_Packet/manifest.styles.champagne.json`.【F:public/assets/champagne/manifest.json†L1-L120】【F:docs/Brand_Canon_Packet/manifest.styles.champagne.json†L1-L120】
- `public/brand/champagne_machine_manifest_full.json` — machine-level component asset manifest with package/version plus `components` array (hero assets: waves, motion, particles).【F:public/brand/champagne_machine_manifest_full.json†L1-L19】

## Brand/page manifests
- `public/brand/manifest.json` — brand/style manifest defining tokens path, gradient/gold variables, typography, waves/textures/particles, motion assets. Doc copy at `docs/Brand_Canon_Packet/manifest.public.brand.json` matches these keys.【F:public/brand/manifest.json†L1-L36】【F:docs/Brand_Canon_Packet/manifest.public.brand.json†L1-L19】
- `public/manifest.json` — PWA/site manifest (name, short_name, description, start_url, display/theme colors, icons, categories).【F:public/manifest.json†L1-L30】

## Import/automation manifests
- `public/brand/manus_import_unified_manifest_20251104.json` — Manus import/package manifest listing source ZIP payloads for hero/assets automation feeds.【F:public/brand/manus_import_unified_manifest_20251104.json†L1-L20】

## Notes
- Hero manifests exist in both `/public` (runtime assets) and `/docs/Brand_Canon_Packet` (documentation copies). Keys align across copies, indicating documentation parity rather than divergent configs.
