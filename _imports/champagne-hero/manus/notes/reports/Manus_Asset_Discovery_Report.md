[Manus_Asset_Discovery_Report.md](https://github.com/user-attachments/files/24035433/Manus_Asset_Discovery_Report.md)
# Manus Asset Discovery Report — Champagne Ecosystem

## Master Index
- **Manifests & Catalogs**
  - `public/brand/manus_import_unified_manifest_20251104.json` (detailed Manus import manifest with components, assets, guards).【F:public/brand/manus_import_unified_manifest_20251104.json†L1-L259】
  - `config/champagne/manus/Manus_Section_Catalog.json` (guard-safe Manus section catalog with layer/tokens/motion specs and asset references).【F:config/champagne/manus/Manus_Section_Catalog.json†L1-L120】【F:config/champagne/manus/Manus_Section_Catalog.json†L360-L429】
  - `config/champagne/Manus_Section_Catalog.json` (preview-stage composite bonding mapping).【F:config/champagne/Manus_Section_Catalog.json†L1-L78】
  - `reports/manus/Manus_Audit_Report.md` (route-by-route readiness table).【F:reports/manus/Manus_Audit_Report.md†L1-L45】
  - `reports/Manus_Manifests_Snapshot.json` (historical snapshot of Manus manifest metadata).【F:reports/Manus_Manifests_Snapshot.json†L551-L594】
- **Preview & Audit Surfaces**
  - `/app/preview/manus-manifest/page.tsx` (runtime loader/comparer for Manus vs Champagne manifests).【F:app/preview/manus-manifest/page.tsx†L1-L117】
  - `/app/preview/manus-audit/page.tsx` (audit dashboard comparing manifest coverage).【F:app/preview/manus-audit/page.tsx†L342-L379】
  - `/app/preview/manus/README.md` (scope note for Manus preview assets).【F:app/preview/manus/README.md†L1-L6】
- **Assets (public)**
  - `public/assets/manus/` README plus hero overlays: wave masks/backgrounds, particles tile, film grain, Manus SVG icons.【F:public/assets/manus/README.md†L1-L6】【8c275d†L2-L16】
  - `public/brand/` root wave/texture JPG/WEBP set (used by manifest, but Manus-specific masks/motion folders absent).【576ef8†L1-L7】【808441†L1-L2】【177afd†L1-L2】
- **Docs & Guides**
  - `docs/audit/Manus_LuxuryHero_Report.md` (audit of Luxury Home Hero & Smile Journey).【F:docs/audit/Manus_LuxuryHero_Report.md†L1-L40】
  - `docs/IMPLEMENTATION_GUIDE.md` (manual integration steps citing Manus assets).【F:docs/IMPLEMENTATION_GUIDE.md†L28-L70】
  - `MANUS_LUX_APPLY_REPORT.md`, `reports/Safe_Build_Readme.md`, and related guardrail docs referencing Manus import manifest.【F:MANUS_LUX_APPLY_REPORT.md†L16-L33】【F:reports/Safe_Build_Readme.md†L4-L7】
- **Scripts & Automation**
  - `scripts/compare-manus-to-champagne.mjs` (CLI diff between manifests).【F:scripts/compare-manus-to-champagne.mjs†L5-L23】
  - `scripts/reports/compare-manus-to-champagne.json` (structured diff results).【F:scripts/reports/compare-manus-to-champagne.json†L1-L20】
- **Live Components Using Manus Assets**
  - `components/sections/SmileJourney.tsx` (uses Manus icon sprites for journey timeline).【F:components/sections/SmileJourney.tsx†L48-L116】

## Section-by-Section Findings
### Footers
- Catalog lists a Champagne-style Manus footer with wave/particle/glass layers and references to `luxury-footer.tsx` variants; status marked **ready** but component files are not present in the repo.【F:config/champagne/manus/Manus_Section_Catalog.json†L393-L429】
- Manifest tracks `footer-champagne` with assets (wave masks, particles, grain) that are missing from `public/brand/` (no `wave-mask.svg`, `footer-wave-mask.svg`, or motion/poster assets).【F:public/brand/manus_import_unified_manifest_20251104.json†L158-L239】【808441†L1-L2】【177afd†L1-L2】【130683†L1-L1】
- Currently rendered footer on site uses non-Manus implementations; no imports of Manus footer entries were found.

### Headers / Navbars / Mega-menus
- No Manus header entries exist in the section catalogs (no `header` ids), and manifest does not define a header component; dual-header issues are unrelated to Manus manifests.【F:config/champagne/manus/Manus_Section_Catalog.json†L1-L120】

### Hero Variants & Video Players
- Catalog hero entry (/:hero) references extensive Manus hero/video assets (4K/cinematic hero variants, video components) with status **ready**, but none of the referenced files live in the repo; manifest `hero-champagne-v2` targets `components/imports/...` files that are absent, leaving the manifest entry dormant/broken.【F:config/champagne/manus/Manus_Section_Catalog.json†L5-L59】【F:public/brand/manus_import_unified_manifest_20251104.json†L178-L199】
- No Manus video player skins or cinematic layouts are imported by current pages; preview routes rely on local manifests only.

### Treatment & Portal Sections
- Guard-safe catalog enumerates portal/chatbot/teleconsult/finance/FAQ and multiple treatment sections, most marked **missing** with empty `assetRefs`, indicating design intent without delivered assets.【F:config/champagne/manus/Manus_Section_Catalog.json†L62-L120】【F:config/champagne/manus/Manus_Section_Catalog.json†L360-L390】
- Composite bonding preview catalog maps to `_sections` files in `/app/preview/treatments/composite-bonding/`, but those targets do not exist in the repo; catalog is unused and dormant.【F:config/champagne/Manus_Section_Catalog.json†L1-L43】

### Gallery / Pricing / Feature Blocks
- Catalog lists value-trio, patient-stories, priority-treatments, local-proof, etc., all flagged **missing**, with no asset references; no components in repo import Manus definitions for these blocks.【F:config/champagne/manus/Manus_Section_Catalog.json†L62-L120】【F:config/champagne/manus/Manus_Section_Catalog.json†L360-L390】

### Video Hero / Cinematic Layouts
- Manus hero/video references (e.g., cinematic-hero-video.tsx) are absent; manifest entries are therefore broken and not wired to any preview routes beyond manifest loaders.【F:config/champagne/manus/Manus_Section_Catalog.json†L33-L52】【F:public/brand/manus_import_unified_manifest_20251104.json†L178-L199】

### 3D / AR Viewers
- Catalog includes a `/3d-ar` section marked **ready** referencing WebGPU-based particle/wave shaders and a luxury 3D dentistry plan, but these assetRefs do not exist locally; no 3D/AR shells or Three.js/A-Frame code in repo beyond generic components unrelated to Manus.【2aa82c†L19-L59】【F:config/champagne/manus/Manus_Section_Catalog.json†L198-L203】

### Chatbot / Concierge UI
- `/ai-concierge` section marked **ready** with assetRefs pointing to Manus chatbot guides/components not present in repo; no chatbot UI imports under Manus naming exist, leaving the concept dormant.【F:config/champagne/manus/Manus_Section_Catalog.json†L198-L207】

### Special Effects & Interaction Components
- Manifest tracks wave, grain, and particles effects packages (`fx-waves`, `fx-grain`, `fx-particles-soft`) with expected masks, textures, and motion assets, but `public/brand/` lacks the referenced files; effects are broken/unserved even though preview manifest routes exist.【F:public/brand/manus_import_unified_manifest_20251104.json†L69-L155】【808441†L1-L2】【177afd†L1-L2】【130683†L1-L1】
- `public/assets/manus/` holds Manus-provided wave overlays, particle tile, film grain, and hero masks, but no code imports them; only SVG icons are consumed (SmileJourney).【8c275d†L2-L16】【F:components/sections/SmileJourney.tsx†L48-L116】

## Active / Dormant / Broken Status
- **Active:**
  - `components/sections/SmileJourney.tsx` consumes Manus icons from `/assets/manus/icons`, rendering on the homepage (`app/page.tsx`).【F:components/sections/SmileJourney.tsx†L48-L116】
  - Preview diagnostics `/preview/manus-audit` and `/preview/manus-manifest` load `public/brand/manus_import_unified_manifest_20251104.json` at runtime for comparison with Champagne manifest, confirming the manifest file itself is active for audits despite missing assets.【F:app/preview/manus-manifest/page.tsx†L43-L117】
- **Dormant:**
  - Wave/particle/grain WEBP assets in `public/assets/manus/waves|particles|textures` are unused anywhere in code.【8c275d†L2-L16】
  - Composite bonding preview catalog and guard-safe catalog entries for treatments/portal/chatbot/finance/etc. have no corresponding components; manifests reference non-existent entries (dormant definitions).【F:config/champagne/Manus_Section_Catalog.json†L1-L78】【F:config/champagne/manus/Manus_Section_Catalog.json†L62-L120】
  - Scripts `compare-manus-to-champagne.mjs` and `scripts/reports/compare-manus-to-champagne.json` are tooling-only; not invoked by runtime code (manual run required).【F:scripts/compare-manus-to-champagne.mjs†L5-L23】【F:scripts/reports/compare-manus-to-champagne.json†L1-L20】
- **Broken/Unserved:**
  - Manifest asset paths (wave masks, film grain, motion posters) point to `public/brand/...` files that are absent; preview routes depending on these would fail to load assets until restored.【F:public/brand/manus_import_unified_manifest_20251104.json†L69-L239】【808441†L1-L2】【177afd†L1-L2】【130683†L1-L1】
  - Footer and hero component entries in manifest target `components/imports/...` directories not present, leaving manifest component IDs unresolved for actual rendering.【F:public/brand/manus_import_unified_manifest_20251104.json†L158-L199】

## Recovery Recommendations
- **Restore from JSON:** Rehydrate manifest-listed assets (`brand/waves/*`, `brand/textures/film-grain-2560x1440.webp`, `brand/motion/*`) into `public/brand/` to satisfy `manus_import_unified_manifest_20251104.json` paths and enable preview routes.【F:public/brand/manus_import_unified_manifest_20251104.json†L69-L239】
- **Safe to Re-render via Manus:** Catalog entries marked **ready** (hero, 3d-ar, ai-concierge, footer) can be regenerated from Manus exports without conflicting local code because no overlapping implementations exist; ensure tokenized gradients and PRM gating per catalog specs.【F:config/champagne/manus/Manus_Section_Catalog.json†L5-L59】【F:config/champagne/manus/Manus_Section_Catalog.json†L393-L429】
- **Needs Codex Wiring:** If regenerated assets are added, wire them into preview routes and manifests; create actual React components for `footer-champagne`, `hero-champagne-v2`, effects packages, and section blocks so manifest IDs resolve. Update imports to consume `public/assets/manus/` overlays instead of unused directories.【F:public/brand/manus_import_unified_manifest_20251104.json†L158-L199】【8c275d†L2-L16】
- **Needs Re-generation:** Missing treatment/portal/chatbot sections marked **missing** in catalogs should be re-generated by Manus before wiring (no source assets exist).【F:config/champagne/manus/Manus_Section_Catalog.json†L62-L120】

## Footer Summary
- **Original Manus Footer Assets/Defs:** Manifest defines `footer-champagne` component with wave mask, particles, grain, and wave background, but required SVG/WEBP/WEBM assets are absent from `public/brand/` and component code is missing.【F:public/brand/manus_import_unified_manifest_20251104.json†L158-L176】【808441†L1-L2】【177afd†L1-L2】【130683†L1-L1】
- **Current Rendered Version:** Site pages use existing non-Manus footers; no imports or renders of manifest footer IDs detected.
- **Missing Imports:** `components/imports/footer-champagne/Footer.tsx` and `styles/champagne/footer.css` referenced by manifest are not in repo, so manifest footer cannot render without regeneration.【F:public/brand/manus_import_unified_manifest_20251104.json†L158-L176】
- **Safe to Restore:** Reintroducing Manus footer assets and component under manifest paths would be isolated (no conflicting code present), provided assets are copied into `public/brand/` and Next static routes are refreshed.【F:public/brand/manus_import_unified_manifest_20251104.json†L158-L199】

## Header Summary
- No Manus header JSON entries or assets exist; manifest lacks header components. Any dual-header bug is unrelated to Manus drops. Catalog focus is heroes/sections/footers only.【F:config/champagne/manus/Manus_Section_Catalog.json†L1-L120】

## Special Effects Summary
- Manifest defines effects (`fx-waves`, `fx-grain`, `fx-particles-soft`) with masks, grain, and motion assets, but `public/brand/` lacks these files, leaving effects unserved on preview routes.【F:public/brand/manus_import_unified_manifest_20251104.json†L69-L155】【808441†L1-L2】【177afd†L1-L2】【130683†L1-L1】
- `public/assets/manus/` contains alternate wave masks (desktop/mobile), gradient backgrounds, particles tile, and film grain WEBP plus icon sprites; these are dormant except for icons used by SmileJourney.【8c275d†L2-L16】【F:components/sections/SmileJourney.tsx†L48-L116】

## 3D / AR Summary
- Catalog’s `/3d-ar` section lists WebGPU particle/wave shaders and a luxury 3D dentistry plan, but no WebGL/WebGPU code or A-Frame shells exist in the repo; section is unimplemented and safe to regenerate/wire when assets arrive.【F:config/champagne/manus/Manus_Section_Catalog.json†L198-L207】

## Next Steps Checklist
1. Re-import missing manifest assets into `public/brand/` to satisfy `manus_import_unified_manifest_20251104.json` freeze paths (waves, grain, motion/posters).【F:public/brand/manus_import_unified_manifest_20251104.json†L69-L239】
2. Generate and add Manus components for `footer-champagne`, `hero-champagne-v2`, and effects packages at the manifest-specified entry points, then wire preview routes to render them.【F:public/brand/manus_import_unified_manifest_20251104.json†L69-L199】
3. Revive dormant section definitions (value-trio, patient-stories, priority-treatments, portal/chatbot/finance) by requesting Manus exports matching catalog specs and hooking them into preview pages with tokenized gradients and PRM support.【F:config/champagne/manus/Manus_Section_Catalog.json†L62-L120】【F:config/champagne/manus/Manus_Section_Catalog.json†L360-L390】
4. Map `public/assets/manus/` wave/particle/grain overlays into hero/footer implementations to replace unused assets and align with Manus design intent.【8c275d†L2-L16】
5. Keep audit tooling (`/preview/manus-audit`, `/preview/manus-manifest`, `scripts/compare-manus-to-champagne.mjs`) updated after restoration to validate component IDs and asset counts end-to-end.【F:app/preview/manus-manifest/page.tsx†L43-L117】【F:scripts/compare-manus-to-champagne.mjs†L5-L23】
