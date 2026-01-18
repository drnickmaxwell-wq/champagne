# Phase 1 — Disable field.waveBackdrop by Opacity (Evidence Report)

## PHASE 1A — Findings (rg output summary)
References to `field.waveBackdrop` in `packages/champagne-manifests/data/hero`:

- `packages/champagne-manifests/data/hero/sacred_hero_base.json:24`
  - `"background": { "desktop": "field.waveBackdrop", "mobile": "field.waveBackdrop" }`
- `packages/champagne-manifests/data/hero/hero.variant.marketing_v1.json:9`
  - `"field.waveBackdrop"`
- `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:10`
  - `{ "id": "field.waveBackdrop", "role": "background", "token": "field.waveBackdrop", "prmSafe": true }`
- `packages/champagne-manifests/data/hero/sacred_hero_surfaces.json:24`
  - `"field.waveBackdrop": {`
- `packages/champagne-manifests/data/hero/hero.variant.editorial_v1.json:9`
  - `"field.waveBackdrop"`
- `packages/champagne-manifests/data/hero/hero.variant.treatment_v1.json:9`
  - `"field.waveBackdrop"`

## BLAST_RADIUS
`field.waveBackdrop` appears in **multiple hero variant manifests** beyond `sacred_hero_base.json`:
- `hero.variant.marketing_v1.json`
- `hero.variant.editorial_v1.json`
- `hero.variant.treatment_v1.json`

These references indicate usage beyond a single hero, so global opacity disablement cannot be proven safe under the Phase 1 stop condition.

## PHASE 1B — Status
**STOPPED** — No edits performed. The stop condition triggered because more than one hero references `field.waveBackdrop`.

## Opacity Change Snippet (Not Applied)
**Planned change (not executed due to STOP condition):**

Before:
```json
"waveBackgrounds": {
  "field.waveBackdrop": {
    "desktop": { "opacity": 0.24 },
    "mobile": { "opacity": 0.24 }
  }
}
```

After (proposed):
```json
"waveBackgrounds": {
  "field.waveBackdrop": {
    "desktop": { "opacity": 0 },
    "mobile": { "opacity": 0 }
  }
}
```

## Verification Logs
Not run — STOP condition triggered before implementation.

## Rollback Command
```bash
git restore packages/champagne-manifests/data/hero/sacred_hero_surfaces.json
rm -f reports/hero/phase1-disable-waveBackdrop.md
```
