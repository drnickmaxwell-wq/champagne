# Campaign 15 — Implant Crown 3D Viewer Integration

**Date:** 2026-06-07  
**Branch:** implant-crown-3d-viewer-campaign15-v1  
**Status:** PASS

---

## Asset Copy

| File | Destination | Bytes | SHA256 |
|------|------------|-------|--------|
| IMPLANT_CROWN__HERO__OPTIMISED__v1.glb | apps/web/public/tenants/smh/3d/implants/ | 20856 | A7EB5E519415756D331D8B23E02DB0DBF898B41A0D9644E91886D35F51E46335 |
| IMPLANT_CROWN__HERO__FALLBACK__WEB__v1.jpg | apps/web/public/tenants/smh/3d/implants/ | 9938 | BBBF6FD2819A97D4CBF330B06BF1FBB963680710C290BBFBA1F7BAC7369C5788 |

Sources: `C:\dev\NickoClaw-Router\tools\agent\outputs\3d-creation-os-campaign-12-implant-crown-optimisation-proof-v1\proof\`

---

## Canon Manifest Update

Added `implant_crown_hero_optimised_v1` to `packages/champagne-canon/canon/3d/champagne-3d-assets.json`:

- **id:** implant_crown_hero_optimised_v1
- **type:** 3d-model
- **family:** implants / smh
- **file:** /tenants/smh/3d/implants/IMPLANT_CROWN__HERO__OPTIMISED__v1.glb
- **fallback:** /tenants/smh/3d/implants/IMPLANT_CROWN__HERO__FALLBACK__WEB__v1.jpg
- **lightingPreset:** light.beauty_front_soft
- **viewerModes:** mode_turntable, mode_focus_tooth
- **exportPriority:** hero
- **campaignSource:** campaign-15

---

## Dependencies Installed

Added to `apps/web/package.json`:

| Package | Version | Type |
|---------|---------|------|
| three | ^0.180.0 | dependency |
| @react-three/fiber | ^9.3.0 | dependency |
| @types/three | ^0.180.0 | devDependency |

Resolved: three@0.180.x, @react-three/fiber@9.6.1

---

## Viewer Integration

**Route:** `/champagne/implant-crown-viewer`

Files created:
- `apps/web/app/champagne/implant-crown-viewer/page.tsx` — Server component, provides asset paths
- `apps/web/app/champagne/implant-crown-viewer/ImplantCrownViewerShell.tsx` — Client wrapper with `next/dynamic ssr:false`
- `apps/web/app/champagne/implant-crown-viewer/ImplantCrownViewerClient.tsx` — R3F Canvas, turntable, JPEG fallback

**Viewer features:**
- React Three Fiber Canvas with WebGL renderer
- GLTFLoader for GLB loading
- OrbitControls with autoRotate (turntable mode, 1.2 RPM)
- Auto-centers and scales model to fit viewport
- `prefers-reduced-motion` guard — falls back to JPEG
- WebGL failure guard — falls back to JPEG

---

## Guard Results

| Guard | Result |
|-------|--------|
| guard:hero | ✅ PASS |
| guard:rogue-hex | ✅ PASS |
| guard:hero-freeze | ✅ PASS |
| guard:token-binding | ✅ PASS |
| guard:manifest | ✅ PASS (no manifests to sync) |
| guard:route-truth | ✅ PASS |
| guard:no-_imports-runtime | ✅ PASS |
| guard:smh-treatment-layouts | ✅ PASS |
| guard:chatbot-engine-copy | ✅ PASS |
| guard:canon | ❌ PRE-EXISTING FAIL (patient-portal-ssr pnpm spawn ENOENT on Windows — not related to this branch) |

---

## Build

```
CI=1 pnpm run build:web → SUCCESS
Route /champagne/implant-crown-viewer → 1.79 kB (R3F loaded dynamically, not in initial bundle)
```

---

## Campaign 15 Outcome

- Champagne mutated: **true**
- Asset copy completed: **true**
- Viewer integration completed: **true**
- Dependencies installed: **true**
- Build: **PASS**
- Campaign 15 implementation: **PASS**
- Campaign 16 unlocked: **true**
- Remaining blockers: none (guard:canon patient-portal-ssr is a pre-existing Windows environment issue, unrelated to this work)
