# Safe Build README — Champagne Preview Scaffolding

This guide explains how to consume Manus manifests while keeping the codebase within guardrails.

## 1. Select Sections from the Unified Manifest
1. Inspect `public/brand/manus_import_unified_manifest_20251104.json`. Components provide `id`, `kind`, `entry`, and `preview_route`.
2. Choose sections relevant to the preview build (e.g., hero, footer, effects). Prioritize entries with `tokens_ok: true` and no `hard_hex` flags.
3. Mirror the `preview_route` under `app/preview/...` to keep all generated pages noindex-ready.
4. Copy required style paths from the `css` array into the component or route import list without altering frozen files.

## 2. Minimal Preview Wrapper
- Create a lightweight wrapper component that forwards manifest props (headline, ctas, media).
- Import `docs/Brand_Canon_Packet/smh-champagne-tokens.css` or the workspace alias so gradients resolve via tokens (`var(--smh-gradient)`, `var(--smh-accent-gold)`).
- Respect `accessibility` notes from hero manifests: semantic section landmarks, focus ring using gold token, minimum hit targets, and `prefers-reduced-motion` fallbacks described in `reducedMotionBehavior`.
- Wrap motion layers in utilities that consult `prefers-reduced-motion` and degrade to static textures per manifest guidance.

## 3. Naming & Placement
- Components belong under `components/imports/<component-id>/` matching the manifest `entry` path.
- Styles live beside existing champagne styles (e.g., `styles/champagne/effects/`). Reuse manifest filenames when possible.
- Preview routes follow `/preview/imports/<component-id>` or `/preview/treatments-light/<slug>` as hinted by manifest IDs; ensure metadata exports `robots: { index: false }`.
- Asset references must point to frozen files listed in manifests; do not move or rename assets under `public/brand` or `public/assets/champagne`.

## 4. Pre-Merge Checklist
- ✅ Tokens only: no new `#` hex strings; rely on the token inventory in `smh-champagne-tokens.css`.
- ✅ Contrast: verify text/background pairs meet WCAG AA when using manifest gradients and overlays.
- ✅ Guards green: `pnpm run brand:guard` and `pnpm run guard:hero` both exit 0.
- ✅ Preview isolation: every new page sits under `/preview/*` and exports explicit noindex metadata.
