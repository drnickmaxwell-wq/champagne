# Champagne Extraction Archive

This folder is a read‑only archive of assets extracted from the previous please‑work repository for the Champagne Ecosystem. It preserves the original file structure of the extraction pack so that we can refer to the original sources during the refactoring phases. **Do not edit files in this folder directly.**

## Subfolders

- `tokens‑and‑theme` – CSS token and theme definitions.
- `guards‑and‑scripts` – brand guards, rogue‑hex checks, hero freeze scripts, manifest sync tasks, etc.
- `manifests‑and‑seo` – the Champagne machine manifest, SEO blueprints, and page architecture documents.
- `preview‑treatments‑canonical` – Manus‑spec treatment preview templates and helpers.
- `heroes‑and‑fx` – hero engine components, hero presets, and particle/FX helpers.
- `brand‑canon‑and‑docs` – brand canon packet and design documentation.
- `reports‑and‑audits` – historical diagnostic reports and audits.
- `assets‑core` – wave masks, textures, particles, hero poster, video, and other core assets.

These are archived originals. Live, maintained implementations will later live in `packages/@champagne/*` and `apps/*`. When you need to work on a feature, copy relevant pieces out of this archive into the appropriate package or app. Never modify files in `_champagne‑extraction` directly.
