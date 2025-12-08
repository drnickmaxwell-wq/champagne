# Champagne FX Routing Notes

This document tells Director / Codex how to wire FX presets to real routes and components.

---

## 1. Mapping model

Each experience declares:

- `routeId` – e.g. `/treatments/veneers`
- `experienceKind` – e.g. `hero`, `storySection`, `portalDashboard`
- `fxPresetId` – from `champagne-fx-presets.json`
- Optional: `emotionalLightingState` and `temporalState`

Example conceptual mapping (implementation lives in TS):

- `/` → `fxPreset.hero.veneers.cinematic`
- `/treatments/veneers` → `fxPreset.hero.veneers.cinematic`
- `/treatments/aligners` → `fxPreset.hero.aligners.clean`
- `/fees` → `fxPreset.section.pricing.clarity`
- `/portal` → `fxPreset.portal.dashboard.softInk`

---

## 2. PRM routing

If `prefers-reduced-motion` is true:

- Use the `prmSafeAlternative` for the chosen preset.
- If it equals the original preset ID, only opacity / colour changes are allowed.

---

## 3. Stack guard reminder

All presets must obey the Layer Stack Guard:

1. `layer.base`
2. `layer.gradient135`
3. `layer.weather`
4. `layer.material`
5. `layer.fx`
6. `layer.content`
7. `layer.ritual` (temporary only)

If an FX preset attempts to put gold into `weather`, or grain above `content`, Stack Guard should raise an error.
