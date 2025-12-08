# Guardrail Assessment

Generated: 2025-11-09T18:40:23.124053+00:00

## Package Scripts
- **brand:guard** → `node scripts/brand-guard.cjs` (protects canonical tokens and brand manifest structure)
- **guard:hero** → `node scripts/guard-hero-freeze.mjs` (enforces hero freeze lists and layer integrity)

## Guard Scripts Inventory
- scripts/brand-guard-structure.cjs
- scripts/brand-guard.cjs
- scripts/brand-guard.smoke.mjs
- scripts/brand-lock-guard.cjs
- scripts/brand-structure-guard.cjs
- scripts/guard-hero-freeze.mjs
- scripts/verify-brand-tokens.ts
- scripts/verify-hue.cjs

## Guarded Assets (Freeze Lists)
- public/brand/champagne_machine_manifest_full.json
  - /public/assets/champagne/waves/wave-mask-desktop.webp
  - /public/assets/champagne/waves/waves-bg-2560.webp
  - /public/assets/champagne/motion/wave-caustics.webm
  - /public/assets/champagne/motion/glass-shimmer.webm
  - /public/assets/champagne/motion/gold-dust-drift.webm
  - /public/assets/champagne/motion/particles-drift.webm
  - /public/assets/champagne/particles/home-hero-particles.webp
  - /public/assets/champagne/textures/home-hero-film-grain.webp
- public/brand/manus_import_unified_manifest_20251104.json
  - public/brand/waves/header-wave-mask.svg
  - public/brand/waves/footer-wave-mask.svg
  - public/brand/waves/wave-mask.svg
  - public/brand/waves/wave-bg.webp
  - public/brand/textures/film-grain-2560x1440.webp
  - public/brand/motion/particles-soft.webm
  - public/brand/motion/caustics.webm
  - public/brand/motion/gold-dust.webm
  - public/brand/motion/posters/particles-soft.jpg
  - public/brand/motion/posters/caustics.jpg
  - public/brand/motion/posters/gold-dust.jpg

## Safety Plan for Build Tasks
- **Allowed scaffolding directories:** app/preview, components/imports, styles/champagne, preview (Playwright specs)
- **Read-only directories:** public/assets/champagne, public/brand, docs/Brand_Canon_Packet (token canon)
- **Token hygiene:** Resolve hues via `smh-champagne-tokens.css`. Map new UI colors to existing tokens (magenta, teal, gold, keyline) before committing. No new literal hex values.
- **Guard execution:** Run `pnpm run brand:guard` (token + manifest audits) and `pnpm run guard:hero` (freeze/layer enforcement) ahead of PRs.
- **Noindex enforcement:** Keep preview experiences under `/preview/*` routes with Next.js `robots: { index: false }` metadata and avoid linking from production navigation until approved.
