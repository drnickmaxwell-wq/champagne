# Champagne Preview Mood Map v1

## Files modified
- app/preview/treatments/3d-dentistry/page.tsx
- app/preview/treatments/composite-bonding/page.tsx
- app/preview/treatments/cosmetic/page.tsx
- app/preview/treatments/dental-implants/page.tsx
- app/preview/treatments/general/page.tsx
- app/preview/treatments/implants/page.tsx
- app/preview/treatments/orthodontics/page.tsx
- app/preview/treatments/orthodontics/spark-aligners/page.tsx
- app/preview/treatments/page.tsx
- app/preview/treatments/technology/page.tsx
- app/preview/treatments/veneers/page.tsx
- app/preview/treatments/whitening/page.tsx
- styles/preview/champagne-preview.css

## Treatment pages and `data-treatment` values
- Composite bonding → `composite`
- Dental implants & implants alias → `implants`
- Porcelain veneers → `veneers`
- Cosmetic dentistry → `cosmetic`
- Orthodontics & Spark Aligners → `orthodontics`
- Whitening → `whitening`
- General dentistry & treatments index → `general`
- 3D dentistry & technology → `technology`
- (Reserved) Anxiety → `anxiety` (no preview page present)

## Mood variable table (Mood Map v1)
| Treatment | `--mood-warm-lift` | `--mood-teal-lift` | `--mood-gold-sheen` | `--mood-bg-depth` | `--mood-motion-intensity` |
| --- | --- | --- | --- | --- | --- |
| Default | 0 | 0 | 0 | 0.25 | 0.5 |
| Composite bonding | 0.36 | 0.24 | 0.22 | 0.32 | 0.58 |
| Implants | 0.18 | 0.34 | 0.16 | 0.40 | 0.60 |
| Veneers | 0.44 | 0.20 | 0.36 | 0.30 | 0.54 |
| Cosmetic | 0.40 | 0.26 | 0.28 | 0.28 | 0.56 |
| Orthodontics | 0.22 | 0.38 | 0.14 | 0.31 | 0.60 |
| Whitening | 0.28 | 0.34 | 0.20 | 0.26 | 0.52 |
| General | 0.24 | 0.22 | 0.12 | 0.27 | 0.48 |
| Technology / 3D dentistry | 0.16 | 0.46 | 0.14 | 0.36 | 0.66 |
| Anxiety (reserved) | 0.18 | 0.30 | 0.12 | 0.35 | 0.42 |

## Wiring summary
- Backgrounds now mix `var(--smh-ink)` and `var(--smh-white)` via `--mood-bg-depth` to set page, hero, and card base ink/light ratios, while gradient stops hue-shift with `--mood-warm-lift`, `--mood-teal-lift`, and `--mood-gold-sheen`.
- Card surfaces and borders reuse the mood-gradient blend, with border-image hues leaning warmer or cooler per treatment and chip accents responding to warm/teal lifts.
- Motion intensity drives `--champagne-grain-alpha`, `--champagne-particles-opacity-d/m`, wave parallax, and hero wave opacity; gold sheen powers `--champagne-sheen-alpha` for shimmer and gold dust overlays.
- Link underlines, lighting tint, and gold keylines inherit the mood lifts to keep micro-details aligned with each treatment’s feel.

## Guard results
- `node scripts/guard-rogue-hex.mjs` → pass (no rogue hex)
- `pnpm brand:guard` → pass (manifests clean)
- `pnpm guard:hero` → pass (freeze validated)
- `node scripts/guard-manifest-sync.mjs` → pass (manifests synced)
- `node scripts/guard-preview-only.mjs` → fails because `origin/main` is absent in this workspace; no preview-scope diffs were flagged.

## Integrity confirmations
- No brand manifests, token files, or sacred hero assets were modified.
- All edits stay inside preview-only directories.
- Guardrail checks report no rogue hex values.

## Screenshots
Preview screenshots were not captured in this environment (no running preview server available during this task).
