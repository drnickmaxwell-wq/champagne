# Sections engine usage

## Package and entry points
- The sections system lives in `packages/champagne-sections`. Its `ChampagneSectionRenderer` component reads section definitions via `getSectionStack` and renders mapped section components for a given `pageSlug`. 【packages/champagne-sections/src/ChampagneSectionRenderer.tsx】
- `SectionRegistry` wraps manifest data by calling `getSectionStackForPage` from `@champagne/manifests`, normalizing each section with styles and defaults before render. 【packages/champagne-sections/src/SectionRegistry.ts】【packages/champagne-manifests/src/core.ts】

## How manifests are loaded
- Manifest data is imported in `packages/champagne-manifests/src/core.ts`, which registers machine/page manifests, section layouts, page-type defaults, FX defaults, and PRM defaults. `getSectionStackForPage` uses these imports to choose a section list. 【packages/champagne-manifests/src/core.ts】
- `getSectionStackForPage` logic:
  1. Normalize the slug to a `routeId` (slashes → dots). 【packages/champagne-manifests/src/core.ts】
  2. If a matching section layout exists in `champagneSectionLayouts` (e.g., `sections/smh/treatments.implants.json`), convert ordered layout entries into `ChampagnePageSection` objects. 【packages/champagne-manifests/src/core.ts】
  3. Otherwise, check the page manifest from `champagne_machine_manifest_full.json` for inline `sections`. 【packages/champagne-manifests/src/core.ts】
  4. If neither exists, fall back to `page-type.defaults.json` ordering for the route/page type. 【packages/champagne-manifests/src/core.ts】
- Section styles (type/surface hints) come from `manifest.styles.champagne.json` via `getSectionStyle`, letting `SectionRegistry` enrich definitions even when a section is referenced by ID only. 【packages/champagne-manifests/src/helpers.ts】

## Page selection and routing
- App pages mostly delegate to `ChampagnePageBuilder`, which calls `getSectionStack` and passes `pageSlug` to `ChampagneSectionRenderer`. The slug is derived from the route (e.g., `/treatments/implants`). 【apps/web/app/(champagne)/_builder/ChampagnePageBuilder.tsx】
- The dynamic route `/treatments/[slug]` resolves a treatment manifest with `getTreatmentManifest` and passes its `path` to `ChampagnePageBuilder`, so section selection follows the same slug-based lookup chain. 【apps/web/app/treatments/[slug]/page.tsx】【packages/champagne-manifests/src/helpers.ts】
- The `/champagne/sections-debug` tool uses `getSectionLayouts`, `getSectionFxDefaults`, and `getSectionPrmDefaults` to visualize how section layouts and defaults apply to treatment routes. 【apps/web/app/champagne/sections-debug/page.tsx】
